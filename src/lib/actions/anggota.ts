"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import bcrypt from "bcryptjs"

const anggotaSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  noAnggota: z.string().min(1, "Nomor anggota wajib diisi"),
  alamat: z.string().optional(),
  telepon: z.string().optional(),
  role: z.enum(["ADMIN", "PENGURUS", "ANGGOTA"]),
})

const anggotaEditSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().optional(),
  noAnggota: z.string().min(1, "Nomor anggota wajib diisi"),
  alamat: z.string().optional(),
  telepon: z.string().optional(),
  role: z.enum(["ADMIN", "PENGURUS", "ANGGOTA"]),
})

export type AnggotaFormData = z.infer<typeof anggotaSchema>

export async function createAnggota(data: AnggotaFormData) {
  const parsed = anggotaSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors, message: "Validasi gagal" }
  }

  const { name, email, password, noAnggota, alamat, telepon, role } = parsed.data

  const existingEmail = await prisma.user.findUnique({ where: { email } })
  if (existingEmail) return { message: "Email sudah terdaftar" }

  const existingNo = await prisma.user.findUnique({ where: { noAnggota } })
  if (existingNo) return { message: "Nomor anggota sudah digunakan" }

  const hashed = await bcrypt.hash(password, 12)

  await prisma.user.create({
    data: { name, email, password: hashed, noAnggota, alamat, telepon, role },
  })

  revalidatePath("/dashboard/anggota")
  return { message: "Anggota berhasil ditambahkan" }
}

export async function updateAnggota(id: string, data: z.infer<typeof anggotaEditSchema>) {
  const parsed = anggotaEditSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors, message: "Validasi gagal" }
  }

  const { name, email, password, noAnggota, alamat, telepon, role } = parsed.data

  const existingEmail = await prisma.user.findFirst({ where: { email, id: { not: id } } })
  if (existingEmail) return { message: "Email sudah digunakan oleh pengguna lain" }

  const existingNo = await prisma.user.findFirst({ where: { noAnggota, id: { not: id } } })
  if (existingNo) return { message: "Nomor anggota sudah digunakan" }

  const updateData: Record<string, unknown> = {
    name, email, noAnggota, alamat, telepon, role,
  }

  if (password && password.length >= 6) {
    updateData.password = await bcrypt.hash(password, 12)
  }

  await prisma.user.update({ where: { id }, data: updateData })

  revalidatePath("/dashboard/anggota")
  return { message: "Anggota berhasil diperbarui" }
}

export async function deleteAnggota(id: string) {
  await prisma.user.delete({ where: { id } })
  revalidatePath("/dashboard/anggota")
}
