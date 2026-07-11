"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const detailSchema = z.object({
  barangId: z.string().min(1),
  jumlah: z.coerce.number().int().min(1),
  harga: z.coerce.number().min(0),
  subtotal: z.coerce.number().min(0),
})

const pembelianSchema = z.object({
  supplierId: z.string().min(1, "Supplier wajib dipilih"),
  userId: z.string().min(1),
  total: z.coerce.number().min(0),
  detail: z.array(detailSchema).min(1, "Minimal 1 barang"),
})

export type PembelianFormData = z.infer<typeof pembelianSchema>

export async function createPembelian(data: PembelianFormData) {
  const parsed = pembelianSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors, message: "Validasi gagal" }

  const { supplierId, userId, total, detail } = parsed.data

  const count = await prisma.pembelian.count()
  const noFaktur = `PBL-${String(count + 1).padStart(4, "0")}`

  const pembelian = await prisma.pembelian.create({
    data: {
      noFaktur,
      supplierId,
      userId,
      total,
      detail: {
        create: detail.map((d) => ({
          barangId: d.barangId,
          jumlah: d.jumlah,
          harga: d.harga,
          subtotal: d.subtotal,
        })),
      },
    },
  })

  for (const d of detail) {
    await prisma.barang.update({
      where: { id: d.barangId },
      data: { stok: { increment: d.jumlah } },
    })
  }

  revalidatePath("/pembelian")
  return { message: "Pembelian berhasil dicatat", id: pembelian.id }
}

export async function deletePembelian(id: string) {
  const pembelian = await prisma.pembelian.findUnique({
    where: { id },
    include: { detail: true },
  })
  if (pembelian) {
    for (const d of pembelian.detail) {
      await prisma.barang.update({
        where: { id: d.barangId },
        data: { stok: { decrement: d.jumlah } },
      })
    }
  }

  await prisma.pembelian.delete({ where: { id } })
  revalidatePath("/pembelian")
}
