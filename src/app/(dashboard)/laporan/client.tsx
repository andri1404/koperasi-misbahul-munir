"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, FileSpreadsheet } from "lucide-react"
import { toast } from "sonner"

const reportTypes = [
  { value: "penjualan", label: "Laporan Penjualan" },
  { value: "pembelian", label: "Laporan Pembelian" },
  { value: "stok", label: "Laporan Stok Barang" },
  { value: "anggota", label: "Laporan Anggota" },
]

export function LaporanClient({
  data,
  type,
  from,
  to,
}: {
  data: unknown[]
  type: string
  from: string
  to: string
}) {
  const router = useRouter()

  function updateQuery(key: string, value: string) {
    const params = new URLSearchParams(window.location.search)
    params.set("type", type)
    params.set("from", from)
    params.set("to", to)
    params.set(key, value)
    router.push(`/dashboard/laporan?${params.toString()}`)
  }

  async function exportExcel() {
    try {
      const params = new URLSearchParams({ type, from, to })
      const res = await fetch(`/api/laporan?${params.toString()}`)
      if (!res.ok) { toast.error("Gagal export"); return }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `laporan-${type}-${from}-${to}.xlsx`
      a.click()
      URL.revokeObjectURL(url)
      toast.success("Laporan berhasil didownload")
    } catch {
      toast.error("Gagal mendownload laporan")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Laporan</h1>
          <p className="text-muted-foreground">Lihat dan export laporan koperasi</p>
        </div>
        <Button onClick={exportExcel}>
          <Download className="mr-2 h-4 w-4" />Export Excel
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1">
              <Label>Tipe Laporan</Label>
              <Select value={type ?? ""} onValueChange={(v) => updateQuery("type", v!)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((rt) => (
                    <SelectItem key={rt.value} value={rt.value}>{rt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {type !== "stok" && type !== "anggota" && (
              <>
                <div className="space-y-1">
                  <Label>Dari</Label>
                  <Input type="date" value={from} onChange={(e) => updateQuery("from", e.target.value)} className="w-[160px]" />
                </div>
                <div className="space-y-1">
                  <Label>Sampai</Label>
                  <Input type="date" value={to} onChange={(e) => updateQuery("to", e.target.value)} className="w-[160px]" />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            {reportTypes.find((r) => r.value === type)?.label}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RenderTable data={data} type={type} />
        </CardContent>
      </Card>
    </div>
  )
}

function RenderTable({ data, type }: { data: unknown[]; type: string }) {
  if (data.length === 0) {
    return <p className="text-center text-muted-foreground py-8">Tidak ada data</p>
  }

  if (type === "penjualan") {
    const items = data as {
      id: string; noFaktur: string; tanggal: string | Date; total: number;
      user: { name: string | null }; anggota: { name: string | null; noAnggota: string | null } | null
    }[]
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No Faktur</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Kasir</TableHead>
            <TableHead>Anggota</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-mono">{item.noFaktur}</TableCell>
              <TableCell>{new Date(item.tanggal).toLocaleDateString("id-ID")}</TableCell>
              <TableCell>{item.user.name}</TableCell>
              <TableCell>{item.anggota ? `${item.anggota.noAnggota} - ${item.anggota.name}` : "Umum"}</TableCell>
              <TableCell className="text-right">Rp {item.total.toLocaleString("id-ID")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  if (type === "pembelian") {
    const items = data as {
      id: string; noFaktur: string; tanggal: string | Date; total: number;
      supplier: { nama: string }; user: { name: string | null }
    }[]
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No Faktur</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>User</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-mono">{item.noFaktur}</TableCell>
              <TableCell>{new Date(item.tanggal).toLocaleDateString("id-ID")}</TableCell>
              <TableCell>{item.supplier.nama}</TableCell>
              <TableCell>{item.user.name}</TableCell>
              <TableCell className="text-right">Rp {item.total.toLocaleString("id-ID")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  if (type === "stok") {
    const items = data as {
      id: string; kode: string; nama: string; stok: number; satuan: string;
      hargaBeli: number; hargaJual: number; kategori: { nama: string }
    }[]
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kode</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead className="text-center">Stok</TableHead>
            <TableHead className="text-right">Harga Beli</TableHead>
            <TableHead className="text-right">Harga Jual</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-mono">{item.kode}</TableCell>
              <TableCell>{item.nama}</TableCell>
              <TableCell><Badge variant="outline">{item.kategori.nama}</Badge></TableCell>
              <TableCell className="text-center">
                <Badge variant={item.stok === 0 ? "destructive" : item.stok < 10 ? "secondary" : "default"}>
                  {item.stok} {item.satuan}
                </Badge>
              </TableCell>
              <TableCell className="text-right">Rp {item.hargaBeli.toLocaleString("id-ID")}</TableCell>
              <TableCell className="text-right">Rp {item.hargaJual.toLocaleString("id-ID")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  if (type === "anggota") {
    const items = data as {
      id: string; noAnggota: string | null; name: string | null; email: string;
      role: string; telepon: string | null; createdAt: string | Date
    }[]
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No Anggota</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Telepon</TableHead>
            <TableHead>Tanggal Daftar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-mono">{item.noAnggota}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell><Badge variant="secondary">{item.role}</Badge></TableCell>
              <TableCell>{item.telepon || "-"}</TableCell>
              <TableCell>{new Date(item.createdAt).toLocaleDateString("id-ID")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  return null
}
