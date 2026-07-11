import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { PenjualanForm } from "./form"

export default async function TambahPenjualanPage() {
  const session = await auth()
  const [barang, anggota] = await Promise.all([
    prisma.barang.findMany({ orderBy: { nama: "asc" }, include: { kategori: true } }),
    prisma.user.findMany({ where: { role: "ANGGOTA" }, orderBy: { name: "asc" } }),
  ])

  return <PenjualanForm barang={barang} anggota={anggota} userId={session?.user?.id || ""} />
}
