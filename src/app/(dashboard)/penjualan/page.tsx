import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { Plus, Eye } from "lucide-react"
import { DeleteDialog } from "@/components/delete-dialog"
import { deletePenjualan } from "@/lib/actions/penjualan"

async function getData() {
  return prisma.penjualan.findMany({
    orderBy: { tanggal: "desc" },
    include: {
      user: { select: { name: true } },
      anggota: { select: { name: true, noAnggota: true } },
    },
  })
}

export default async function PenjualanPage() {
  const data = await getData()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Penjualan</h1>
          <p className="text-muted-foreground">Catatan penjualan barang</p>
        </div>
        <Button render={<Link href="/penjualan/tambah" />}><Plus className="mr-2 h-4 w-4" />Penjualan Baru</Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Daftar Penjualan ({data.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No Faktur</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Kasir</TableHead>
                <TableHead>Anggota</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="w-[80px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">Belum ada data penjualan</TableCell>
                </TableRow>
              ) : (
                data.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono font-medium">{p.noFaktur}</TableCell>
                    <TableCell>{new Date(p.tanggal).toLocaleDateString("id-ID")}</TableCell>
                    <TableCell>{p.user.name}</TableCell>
                    <TableCell>{p.anggota ? `${p.anggota.noAnggota} - ${p.anggota.name}` : "Umum"}</TableCell>
                    <TableCell className="text-right">Rp {p.total.toLocaleString("id-ID")}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" render={<Link href={`/penjualan/${p.id}`} />}><Eye className="h-4 w-4" /></Button>
                        <DeleteDialog id={p.id} name={p.noFaktur} action={deletePenjualan} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
