"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const kategoriSchema = z.object({
  nama: z.string().min(2, "Nama kategori minimal 2 karakter"),
})

export type KategoriFormData = z.infer<typeof kategoriSchema>

export async function createKategori(data: KategoriFormData) {
  const parsed = kategoriSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors, message: "Validasi gagal" }

  const { nama } = parsed.data
  const existing = await prisma.kategoriBarang.findUnique({ where: { nama } })
  if (existing) return { message: "Kategori sudah ada" }

  await prisma.kategoriBarang.create({ data: { nama } })
  revalidatePath("/dashboard/kategori")
  return { message: "Kategori berhasil ditambahkan" }
}

export async function updateKategori(id: string, data: KategoriFormData) {
  const parsed = kategoriSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors, message: "Validasi gagal" }

  const { nama } = parsed.data
  const existing = await prisma.kategoriBarang.findFirst({ where: { nama, id: { not: id } } })
  if (existing) return { message: "Kategori sudah ada" }

  await prisma.kategoriBarang.update({ where: { id }, data: { nama } })
  revalidatePath("/dashboard/kategori")
  return { message: "Kategori berhasil diperbarui" }
}

export async function deleteKategori(id: string) {
  await prisma.kategoriBarang.delete({ where: { id } })
  revalidatePath("/dashboard/kategori")
}
