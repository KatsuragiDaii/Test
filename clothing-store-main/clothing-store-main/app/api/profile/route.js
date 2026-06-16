import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { profileSchema } from "../../../lib/validations";
import { ZodError } from "zod";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export async function PUT(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader)
      return NextResponse.json(
        { error: "Akses ditolak. Token tidak ditemukan." },
        { status: 401 },
      );

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user)
      return NextResponse.json(
        { error: "Sesi tidak valid atau telah kedaluwarsa." },
        { status: 401 },
      );

    const payload = await request.json();

    const validatedData = profileSchema.parse(payload);

    const { error: dbError } = await supabaseAdmin
      .from("profiles")
      .upsert({ ...validatedData, id: user.id });

    if (dbError) throw new Error(dbError.message);

    return NextResponse.json({
      success: true,
      message: "Profil berhasil diperbarui.",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 },
      );
    }
    console.error("Profile Update Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan sistem internal." },
      { status: 500 },
    );
  }
}
