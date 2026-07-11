"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const detailPenjualanSchema = z.object({
  barangId: z.string().min(1),
  jumlah: z.coerce.number().int().min(1),
  harga: z.coerce.number().min(0),
  subtotal: z.coerce.number().min(0),
})

const penjualanSchema = z.object({
  userId: z.string().min(1),
  anggotaId: z.string().optional(),
  total: z.coerce.number().min(0),
  detail: z.array(detailPenjualanSchema).min(1, "Minimal 1 barang"),
})

export type PenjualanFormData = z.infer<typeof penjualanSchema>

export async function createPenjualan(data: PenjualanFormData) {
  const parsed = penjualanSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors, message: "Validasi gagal" }

  const { userId, anggotaId, total, detail } = parsed.data

  const count = await prisma.penjualan.count()
  const noFaktur = `PJL-${String(count + 1).padStart(4, "0")}`

  const penjualan = await prisma.penjualan.create({
    data: {
      noFaktur,
      userId,
      anggotaId: anggotaId || null,
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
      data: { stok: { decrement: d.jumlah } },
    })
  }

  revalidatePath("/dashboard/penjualan")
  return { message: "Penjualan berhasil dicatat", id: penjualan.id }
}

export async function deletePenjualan(id: string) {
  const penjualan = await prisma.penjualan.findUnique({
    where: { id },
    include: { detail: true },
  })
  if (penjualan) {
    for (const d of penjualan.detail) {
      await prisma.barang.update({
        where: { id: d.barangId },
        data: { stok: { increment: d.jumlah } },
      })
    }
  }

  await prisma.penjualan.delete({ where: { id } })
  revalidatePath("/dashboard/penjualan")
}
