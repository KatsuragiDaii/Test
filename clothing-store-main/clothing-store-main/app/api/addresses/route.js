import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { addressSchema } from "../../../lib/validations";
import { ZodError } from "zod";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function verifyUser(request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) throw new Error("Akses ditolak.");
  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) throw new Error("Sesi tidak valid.");
  return user;
}

export async function POST(request) {
  try {
    const user = await verifyUser(request);

    const { count, error: countError } = await supabaseAdmin
      .from("addresses")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (countError) throw new Error("Gagal memvalidasi kuota alamat.");
    if (count >= 5) {
      return NextResponse.json(
        {
          error:
            "Batas maksimal 5 alamat telah tercapai. Hapus alamat lama untuk menambah baru.",
        },
        { status: 403 },
      );
    }

    const payload = await request.json();
    const validatedData = addressSchema.parse(payload);

    const { data, error } = await supabaseAdmin
      .from("addresses")
      .insert({ ...validatedData, user_id: user.id })
      .select();

    if (error) throw new Error(error.message);
    return NextResponse.json({ success: true, data: data[0] });
  } catch (error) {
    if (error instanceof ZodError)
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 },
      );
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request) {
  try {
    const user = await verifyUser(request);
    const { id, ...updates } = await request.json();

    const validatedData = addressSchema.parse(updates);

    const { error } = await supabaseAdmin
      .from("addresses")
      .update(validatedData)
      .match({ id: id, user_id: user.id });

    if (error) throw new Error(error.message);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ZodError)
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 },
      );
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    const user = await verifyUser(request);
    const { id } = await request.json();

    const { error } = await supabaseAdmin
      .from("addresses")
      .delete()
      .match({ id: id, user_id: user.id });

    if (error) throw new Error(error.message);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
