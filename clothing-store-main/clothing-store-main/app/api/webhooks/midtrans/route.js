import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      payment_type,
    } = body;

    const localPayloadString =
      order_id + status_code + gross_amount + process.env.MIDTRANS_SERVER_KEY;
    const computedSignature = crypto
      .createHash("sha512")
      .update(localPayloadString)
      .digest("hex");

    if (computedSignature !== signature_key) {
      console.warn(
        `[SECURITY WARNING] Signature key tidak cocok untuk Order ID: ${order_id}`,
      );
      return NextResponse.json(
        { error: "Signature tidak cocok! Request ilegal diblokir." },
        { status: 403 },
      );
    }

    const { data: existingOrder, error: checkError } = await supabaseAdmin
      .from("orders")
      .select("status, total_price")
      .eq("id", order_id)
      .single();

    if (checkError || !existingOrder) {
      return NextResponse.json(
        { error: "Order tidak ditemukan di database." },
        { status: 404 },
      );
    }

    if (Number(gross_amount) !== Number(existingOrder.total_price)) {
      console.warn(
        `[SECURITY WARNING] Selisih nominal terdeteksi pada Order ${order_id}. Midtrans: ${gross_amount}, DB: ${existingOrder.total_price}`,
      );
      return NextResponse.json(
        {
          error:
            "Manipulasi atau ketidakcocokan nominal pembayaran terdeteksi!",
        },
        { status: 400 },
      );
    }

    let finalOrderStatus = "PENDING";

    if (
      transaction_status === "capture" ||
      transaction_status === "settlement"
    ) {
      finalOrderStatus = "COMPLETED";
    } else if (
      transaction_status === "deny" ||
      transaction_status === "cancel" ||
      transaction_status === "expire"
    ) {
      finalOrderStatus = "CANCELLED";
    } else if (transaction_status === "pending") {
      finalOrderStatus = "PROCESSING";
    }

    if (
      existingOrder.status === "COMPLETED" &&
      finalOrderStatus !== "COMPLETED"
    ) {
      console.warn(
        `[WEBHOOK INFO] Mengabaikan downgrade status untuk Order ${order_id} yang sudah lunas.`,
      );
      return NextResponse.json(
        { message: "Status sudah COMPLETED, mengabaikan update." },
        { status: 200 },
      );
    }

    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({ status: finalOrderStatus })
      .eq("id", order_id);

    if (updateError) {
      throw new Error(
        "Gagal mengupdate status transaksi di DB: " + updateError.message,
      );
    }

    return NextResponse.json(
      { message: "Webhook Midtrans berhasil diproses secara valid." },
      { status: 200 },
    );
  } catch (error) {
    console.error("WEBHOOK CRITICAL ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
