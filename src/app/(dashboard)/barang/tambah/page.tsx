import { prisma } from "@/lib/prisma"
import { BarangForm } from "./form"

export default async function TambahBarangPage() {
  const kategori = await prisma.kategoriBarang.findMany({ orderBy: { nama: "asc" } })
  return <BarangForm kategori={kategori} />
}
