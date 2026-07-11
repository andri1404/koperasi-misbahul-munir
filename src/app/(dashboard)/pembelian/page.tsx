import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { Plus, Eye } from "lucide-react"
import { DeleteDialog } from "@/components/delete-dialog"
import { deletePembelian } from "@/lib/actions/pembelian"

async function getData() {
  return prisma.pembelian.findMany({
    orderBy: { tanggal: "desc" },
    include: {
      supplier: { select: { nama: true } },
      user: { select: { name: true } },
    },
  })
}

export default async function PembelianPage() {
  const data = await getData()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pembelian</h1>
          <p className="text-muted-foreground">Catatan pembelian barang</p>
        </div>
        <Button render={<Link href="/pembelian/tambah" />}><Plus className="mr-2 h-4 w-4" />Pembelian Baru</Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Daftar Pembelian ({data.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No Faktur</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="w-[80px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">Belum ada data pembelian</TableCell>
                </TableRow>
              ) : (
                data.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono font-medium">{p.noFaktur}</TableCell>
                    <TableCell>{new Date(p.tanggal).toLocaleDateString("id-ID")}</TableCell>
                    <TableCell>{p.supplier.nama}</TableCell>
                    <TableCell>{p.user.name}</TableCell>
                    <TableCell className="text-right">Rp {p.total.toLocaleString("id-ID")}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" render={<Link href={`/pembelian/${p.id}`} />}><Eye className="h-4 w-4" /></Button>
                        <DeleteDialog id={p.id} name={p.noFaktur} action={deletePembelian} />
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
