import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { BarangForm } from "../../tambah/form"

export default async function EditBarangPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const barang = await prisma.barang.findUnique({ where: { id } })
  if (!barang) notFound()
  const kategori = await prisma.kategoriBarang.findMany({ orderBy: { nama: "asc" } })
  return <BarangForm kategori={kategori} barang={barang} />
}
