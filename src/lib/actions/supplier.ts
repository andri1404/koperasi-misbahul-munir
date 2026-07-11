"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const supplierSchema = z.object({
  nama: z.string().min(2, "Nama supplier minimal 2 karakter"),
  kontak: z.string().optional(),
  alamat: z.string().optional(),
})

export type SupplierFormData = z.infer<typeof supplierSchema>

export async function createSupplier(data: SupplierFormData) {
  const parsed = supplierSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors, message: "Validasi gagal" }

  await prisma.supplier.create({ data: parsed.data })
  revalidatePath("/supplier")
  return { message: "Supplier berhasil ditambahkan" }
}

export async function updateSupplier(id: string, data: SupplierFormData) {
  const parsed = supplierSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors, message: "Validasi gagal" }

  await prisma.supplier.update({ where: { id }, data: parsed.data })
  revalidatePath("/supplier")
  return { message: "Supplier berhasil diperbarui" }
}

export async function deleteSupplier(id: string) {
  await prisma.supplier.delete({ where: { id } })
  revalidatePath("/supplier")
}
