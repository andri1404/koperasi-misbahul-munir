"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const barangSchema = z.object({
  kode: z.string().min(1, "Kode barang wajib diisi"),
  nama: z.string().min(2, "Nama barang minimal 2 karakter"),
  kategoriId: z.string().min(1, "Kategori wajib dipilih"),
  hargaBeli: z.coerce.number().min(0),
  hargaJual: z.coerce.number().min(0),
  stok: z.coerce.number().int().min(0),
  satuan: z.string().default("pcs"),
  deskripsi: z.string().optional(),
})

export type BarangFormData = z.infer<typeof barangSchema>

export async function createBarang(data: BarangFormData) {
  const parsed = barangSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors, message: "Validasi gagal" }

  const existing = await prisma.barang.findUnique({ where: { kode: parsed.data.kode } })
  if (existing) return { message: "Kode barang sudah digunakan" }

  await prisma.barang.create({ data: parsed.data })
  revalidatePath("/barang")
  return { message: "Barang berhasil ditambahkan" }
}

export async function updateBarang(id: string, data: BarangFormData) {
  const parsed = barangSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors, message: "Validasi gagal" }

  const existing = await prisma.barang.findFirst({ where: { kode: parsed.data.kode, id: { not: id } } })
  if (existing) return { message: "Kode barang sudah digunakan" }

  await prisma.barang.update({ where: { id }, data: parsed.data })
  revalidatePath("/barang")
  return { message: "Barang berhasil diperbarui" }
}

export async function deleteBarang(id: string) {
  await prisma.barang.delete({ where: { id } })
  revalidatePath("/barang")
}
