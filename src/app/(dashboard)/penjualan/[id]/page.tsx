import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function DetailPenjualanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const penjualan = await prisma.penjualan.findUnique({
    where: { id },
    include: {
      user: { select: { name: true } },
      anggota: { select: { name: true, noAnggota: true } },
      detail: { include: { barang: true } },
    },
  })
  if (!penjualan) notFound()

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" render={<Link href="/dashboard/penjualan" />}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Detail Penjualan</h1>
          <p className="text-muted-foreground">{penjualan.noFaktur}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">No Faktur</CardTitle></CardHeader>
          <CardContent><p className="font-mono font-bold">{penjualan.noFaktur}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Tanggal</CardTitle></CardHeader>
          <CardContent><p className="font-bold">{new Date(penjualan.tanggal).toLocaleDateString("id-ID")}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Kasir</CardTitle></CardHeader>
          <CardContent><p className="font-bold">{penjualan.user.name}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Anggota</CardTitle></CardHeader>
          <CardContent><p className="font-bold">{penjualan.anggota ? `${penjualan.anggota.noAnggota} - ${penjualan.anggota.name}` : "Umum"}</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Detail Barang</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Barang</TableHead>
                <TableHead className="text-right">Harga</TableHead>
                <TableHead className="text-center">Jumlah</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {penjualan.detail.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.barang.nama}</TableCell>
                  <TableCell className="text-right">Rp {d.harga.toLocaleString("id-ID")}</TableCell>
                  <TableCell className="text-center">{d.jumlah}</TableCell>
                  <TableCell className="text-right">Rp {d.subtotal.toLocaleString("id-ID")}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold">
                <TableCell colSpan={3} className="text-right">Total</TableCell>
                <TableCell className="text-right">Rp {penjualan.total.toLocaleString("id-ID")}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
