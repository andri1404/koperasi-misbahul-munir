import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import * as XLSX from "xlsx"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type") || "penjualan"
  const from = searchParams.get("from") || ""
  const to = searchParams.get("to") || ""

  let data: Record<string, unknown>[] = []
  let sheetName = ""

  if (type === "penjualan") {
    const fromDate = new Date(from)
    const toDate = new Date(to)
    toDate.setHours(23, 59, 59, 999)

    const items = await prisma.penjualan.findMany({
      where: { tanggal: { gte: fromDate, lte: toDate } },
      orderBy: { tanggal: "desc" },
      include: {
        user: { select: { name: true } },
        anggota: { select: { name: true, noAnggota: true } },
      },
    })

    data = items.map((i) => ({
      "No Faktur": i.noFaktur,
      "Tanggal": new Date(i.tanggal).toLocaleDateString("id-ID"),
      "Kasir": i.user.name || "",
      "Anggota": i.anggota ? `${i.anggota.noAnggota} - ${i.anggota.name}` : "Umum",
      "Total": i.total,
    }))
    sheetName = "Penjualan"
  }

  if (type === "pembelian") {
    const fromDate = new Date(from)
    const toDate = new Date(to)
    toDate.setHours(23, 59, 59, 999)

    const items = await prisma.pembelian.findMany({
      where: { tanggal: { gte: fromDate, lte: toDate } },
      orderBy: { tanggal: "desc" },
      include: {
        supplier: { select: { nama: true } },
        user: { select: { name: true } },
      },
    })

    data = items.map((i) => ({
      "No Faktur": i.noFaktur,
      "Tanggal": new Date(i.tanggal).toLocaleDateString("id-ID"),
      "Supplier": i.supplier.nama,
      "User": i.user.name || "",
      "Total": i.total,
    }))
    sheetName = "Pembelian"
  }

  if (type === "stok") {
    const items = await prisma.barang.findMany({
      orderBy: { stok: "asc" },
      include: { kategori: { select: { nama: true } } },
    })

    data = items.map((i) => ({
      "Kode": i.kode,
      "Nama": i.nama,
      "Kategori": i.kategori.nama,
      "Stok": i.stok,
      "Satuan": i.satuan,
      "Harga Beli": i.hargaBeli,
      "Harga Jual": i.hargaJual,
    }))
    sheetName = "Stok Barang"
  }

  if (type === "anggota") {
    const items = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    })

    data = items.map((i) => ({
      "No Anggota": i.noAnggota || "",
      "Nama": i.name || "",
      "Email": i.email,
      "Role": i.role,
      "Telepon": i.telepon || "",
      "Tanggal Daftar": i.createdAt.toLocaleDateString("id-ID"),
    }))
    sheetName = "Anggota"
  }

  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(data)
  XLSX.utils.book_append_sheet(wb, ws, sheetName)

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" })

  return new NextResponse(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="laporan-${type}-${from}-${to}.xlsx"`,
    },
  })
}
