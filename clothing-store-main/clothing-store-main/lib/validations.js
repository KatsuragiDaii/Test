import { z } from "zod";

export const profileSchema = z.object({
  full_name: z
    .string()
    .min(2, "NAMA MINIMAL 2 KARAKTER.")
    .max(35, "NAMA MAKSIMAL 35 KARAKTER.")
    .regex(/^[a-zA-Z\s]+$/, "NAMA HANYA BOLEH MENGANDUNG HURUF DAN SPASI.")
    .optional(),
  gender: z
    .enum(["Laki-laki", "Perempuan"], {
      invalid_type_error: "PILIH JENIS KELAMIN YANG VALID.",
    })
    .optional(),
  phone_number: z
    .string()
    .min(9, "NOMOR HP MINIMAL 9 DIGIT.")
    .max(14, "NOMOR HP MAKSIMAL 14 DIGIT.")
    .regex(/^08[0-9]+$/, "NOMOR HP HARUS DIAWALI '08'.")
    .refine((val) => {
      if (/(.)\1{6,}/.test(val)) return false;
      if (/1234567/.test(val) || /9876543/.test(val)) return false;
      return true;
    }, "NOMOR HP TIDAK VALID (TERDETEKSI ANGKA PALSU/DUMMY).")
    .optional(),
});

export const addressSchema = z.object({
  recipient: z.string().min(2, "NAMA PENERIMA WAJIB DIISI."),
  phone: z
    .string()
    .min(9, "NOMOR HP ALAMAT TIDAK VALID.")
    .max(14, "NOMOR HP MAKSIMAL 14 DIGIT.")
    .regex(/^08[0-9]+$/, "NOMOR HP HARUS DIAWALI '08'.")
    .refine((val) => {
      if (/(.)\1{6,}/.test(val)) return false;
      if (/1234567/.test(val) || /9876543/.test(val)) return false;
      return true;
    }, "NOMOR HP TIDAK VALID (TERDETEKSI ANGKA PALSU/DUMMY)."),
  detail: z
    .string()
    .trim()
    .min(
      25,
      "DETAIL ALAMAT TERLALU PENDEK. WAJIB SPESIFIK & LENGKAP (MIN. 25 KARAKTER).",
    )
    .max(160, "DETAIL ALAMAT MAKSIMAL 160 KARAKTER."),
});

export const authSchema = z.object({
  email: z.string().email("FORMAT EMAIL TIDAK VALID (CONTOH: USER@MAIL.COM)."),
  password: z.string().min(6, "KATA SANDI MINIMAL 6 KARAKTER."),
  full_name: z.string().min(2, "NAMA LENGKAP WAJIB DIISI.").optional(),
});

export const registerSchema = z
  .object({
    full_name: z
      .string()
      .trim()
      .min(2, "NAMA MINIMAL 2 KARAKTER.")
      .max(30, "NAMA MAKSIMAL 30 KARAKTER.")
      .regex(/^[a-zA-Z\s]+$/, "NAMA HANYA BOLEH HURUF DAN SPASI."),
    email: z
      .string()
      .trim()
      .min(1, "EMAIL WAJIB DIISI.")
      .email("FORMAT EMAIL TIDAK VALID."),
    password: z
      .string()
      .min(8, "KATA SANDI MINIMAL 8 KARAKTER.")
      .regex(/[A-Z]/, "KATA SANDI WAJIB MENGANDUNG MINIMAL 1 HURUF BESAR.")
      .regex(/[0-9]/, "KATA SANDI WAJIB MENGANDUNG MINIMAL 1 ANGKA."),
    confirmPassword: z.string().min(1, "KONFIRMASI KATA SANDI WAJIB DIISI."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "KONFIRMASI KATA SANDI TIDAK COCOK.",
  });

export const updatePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "KATA SANDI LAMA WAJIB DIISI."),
    password: z
      .string()
      .min(8, "KATA SANDI MINIMAL 8 KARAKTER.")
      .regex(/[A-Z]/, "KATA SANDI WAJIB MENGANDUNG MINIMAL 1 HURUF BESAR.")
      .regex(/[0-9]/, "KATA SANDI WAJIB MENGANDUNG MINIMAL 1 ANGKA."),
    confirmPassword: z.string().min(1, "KONFIRMASI KATA SANDI WAJIB DIISI."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "KONFIRMASI KATA SANDI BARU TIDAK COCOK.",
  })

  .refine((data) => data.oldPassword !== data.password, {
    path: ["password"],
    message: "KATA SANDI BARU TIDAK BOLEH SAMA DENGAN KATA SANDI LAMA.",
  });

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "KATA SANDI MINIMAL 8 KARAKTER.")
      .regex(/[A-Z]/, "KATA SANDI WAJIB MENGANDUNG MINIMAL 1 HURUF BESAR.")
      .regex(/[0-9]/, "KATA SANDI WAJIB MENGANDUNG MINIMAL 1 ANGKA."),
    confirmPassword: z.string().min(1, "KONFIRMASI KATA SANDI WAJIB DIISI."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "KONFIRMASI KATA SANDI BARU TIDAK COCOK.",
  });
