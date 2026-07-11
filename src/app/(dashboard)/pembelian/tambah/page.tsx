import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { PembelianForm } from "./form"

export default async function TambahPembelianPage() {
  const session = await auth()
  const [supplier, barang] = await Promise.all([
    prisma.supplier.findMany({ orderBy: { nama: "asc" } }),
    prisma.barang.findMany({ orderBy: { nama: "asc" }, include: { kategori: true } }),
  ])

  return <PembelianForm supplier={supplier} barang={barang} userId={session?.user?.id || ""} />
}
