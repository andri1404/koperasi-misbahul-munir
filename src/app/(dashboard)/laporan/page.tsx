import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { LaporanClient } from "./client"

async function getReportData(type: string, from: string, to: string) {
  const fromDate = new Date(from)
  const toDate = new Date(to)
  toDate.setHours(23, 59, 59, 999)

  switch (type) {
    case "penjualan":
      return prisma.penjualan.findMany({
        where: { tanggal: { gte: fromDate, lte: toDate } },
        orderBy: { tanggal: "desc" },
        include: {
          user: { select: { name: true } },
          anggota: { select: { name: true, noAnggota: true } },
        },
      })

    case "pembelian":
      return prisma.pembelian.findMany({
        where: { tanggal: { gte: fromDate, lte: toDate } },
        orderBy: { tanggal: "desc" },
        include: {
          supplier: { select: { nama: true } },
          user: { select: { name: true } },
        },
      })

    case "stok":
      return prisma.barang.findMany({
        orderBy: { stok: "asc" },
        include: { kategori: { select: { nama: true } } },
      })

    case "anggota":
      return prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true, name: true, email: true, role: true,
          noAnggota: true, telepon: true, alamat: true, createdAt: true,
        },
      })

    default:
      return []
  }
}

export default async function LaporanPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const sp = await searchParams
  const type = sp.type || "penjualan"
  const from = sp.from || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0]
  const to = sp.to || new Date().toISOString().split("T")[0]

  const data = await getReportData(type, from, to)

  return <LaporanClient data={data} type={type} from={from} to={to} />
}
