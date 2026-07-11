import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { KategoriEditForm } from "./edit-form"

export default async function EditKategoriPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await prisma.kategoriBarang.findUnique({ where: { id } })
  if (!data) notFound()
  return <KategoriEditForm kategori={data} />
}
