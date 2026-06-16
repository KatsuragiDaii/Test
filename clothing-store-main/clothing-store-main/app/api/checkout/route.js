import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthError";
  }
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function verifyUser(request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) throw new AuthError("Akses ditolak. Token tidak ditemukan.");

  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(token);

  if (error || !user)
    throw new AuthError("Sesi tidak valid atau telah dimanipulasi.");

  return user;
}

async function createMidtransTransaction(
  orderId,
  secureTotal,
  serverUserEmail,
  verifiedCartItems,
) {
  const midtransPayload = {
    transaction_details: { order_id: orderId, gross_amount: secureTotal },
    customer_details: { email: serverUserEmail },
    item_details: verifiedCartItems.map((item) => ({
      id: item.id,
      price: item.price,
      quantity: item.quantity,
      name: item.name.substring(0, 50),
    })),
  };

  const authHeaderMidtrans = Buffer.from(
    process.env.MIDTRANS_SERVER_KEY + ":",
  ).toString("base64");
  const response = await fetch(
    "https://app.sandbox.midtrans.com/snap/v1/transactions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${authHeaderMidtrans}`,
      },
      body: JSON.stringify(midtransPayload),
    },
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data.error_messages
        ? data.error_messages[0]
        : "Gagal memicu transaksi Midtrans.",
    );
  }
  return data;
}

export async function POST(request) {
  try {
    const user = await verifyUser(request);
    const serverUserId = user.id;
    const serverUserEmail = user.email;

    const { cartItems, totalAmount, addressId, idempotencyKey } =
      await request.json();

    if (!cartItems || cartItems.length === 0 || !addressId) {
      return NextResponse.json(
        { error: "Keranjang belanja kosong atau alamat belum dipilih." },
        { status: 400 },
      );
    }

    const orderId = idempotencyKey
      ? `ZH-ORD-${idempotencyKey}`
      : `ZH-ORD-${crypto.randomUUID()}`;

    const productIds = cartItems.map((item) => item.id);
    const { data: dbProducts, error: productFetchError } = await supabaseAdmin
      .from("products")
      .select("id, name, price")
      .in("id", productIds);

    if (productFetchError || !dbProducts) {
      return NextResponse.json(
        { error: "Gagal memverifikasi data produk." },
        { status: 500 },
      );
    }

    const productMap = {};
    dbProducts.forEach((p) => {
      productMap[p.id] = { name: p.name, price: p.price };
    });

    let secureTotal = 0;
    const verifiedCartItems = [];

    for (const item of cartItems) {
      const realProduct = productMap[item.id];
      if (!realProduct)
        return NextResponse.json(
          { error: `Produk ID ${item.id} tidak ditemukan.` },
          { status: 400 },
        );

      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        return NextResponse.json(
          { error: "Kuantitas tidak valid." },
          { status: 400 },
        );
      }

      secureTotal += realProduct.price * item.quantity;
      verifiedCartItems.push({
        ...item,
        name: realProduct.name,
        price: realProduct.price,
      });
    }

    if (totalAmount !== secureTotal) {
      return NextResponse.json(
        { error: "Manipulasi harga terdeteksi!" },
        { status: 400 },
      );
    }

    const { data: addressData, error: addressFetchError } = await supabaseAdmin
      .from("addresses")
      .select("*")
      .eq("id", addressId)
      .eq("user_id", serverUserId)
      .single();

    if (addressFetchError || !addressData) {
      return NextResponse.json(
        { error: "Alamat tidak valid." },
        { status: 400 },
      );
    }

    const safeShippingAddressText = `${addressData.recipient} (${addressData.phone}) | ${addressData.detail.toUpperCase()}`;

    let midtransData;
    const { error: dbError } = await supabaseAdmin.from("orders").insert({
      id: orderId,
      user_id: serverUserId,
      total_price: secureTotal,
      status: "PENDING",
      items: verifiedCartItems,
      shipping_address: safeShippingAddressText,
    });

    if (dbError) {
      if (dbError.code === "23505") {
        const { data: existingOrder } = await supabaseAdmin
          .from("orders")
          .select("status")
          .eq("id", orderId)
          .single();

        if (existingOrder?.status === "PENDING") {
          midtransData = await createMidtransTransaction(
            orderId,
            secureTotal,
            serverUserEmail,
            verifiedCartItems,
          );
        } else {
          return NextResponse.json(
            { error: "Pesanan sudah diproses atau dibatalkan." },
            { status: 409 },
          );
        }
      } else {
        throw new Error(dbError.message);
      }
    } else {
      midtransData = await createMidtransTransaction(
        orderId,
        secureTotal,
        serverUserEmail,
        verifiedCartItems,
      );
    }

    return NextResponse.json({
      token: midtransData.token,
      redirectUrl: midtransData.redirect_url,
      orderId: orderId,
    });
  } catch (error) {
    console.error("CRITICAL CHECKOUT API ERROR:", error);
    if (error.name === "AuthError")
      return NextResponse.json({ error: error.message }, { status: 401 });
    return NextResponse.json(
      { error: error.message || "Internal Server Error." },
      { status: 500 },
    );
  }
}
