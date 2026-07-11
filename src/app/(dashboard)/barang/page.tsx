import { prisma } from "@/lib/prisma"
import { deleteBarang } from "@/lib/actions/barang"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Pencil } from "lucide-react"
import { DeleteDialog } from "@/components/delete-dialog"

async function getData() {
  return prisma.barang.findMany({
    orderBy: { createdAt: "desc" },
    include: { kategori: { select: { nama: true } } },
  })
}

export default async function BarangPage() {
  const data = await getData()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Barang</h1>
          <p className="text-muted-foreground">Kelola data barang koperasi</p>
        </div>
        <Button render={<Link href="/barang/tambah" />}>
          <Plus className="mr-2 h-4 w-4" />Tambah Barang
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Daftar Barang ({data.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead className="text-right">Harga Beli</TableHead>
                <TableHead className="text-right">Harga Jual</TableHead>
                <TableHead className="text-center">Stok</TableHead>
                <TableHead className="w-[80px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    Belum ada data barang
                  </TableCell>
                </TableRow>
              ) : (
                data.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-mono text-sm">{b.kode}</TableCell>
                    <TableCell className="font-medium">{b.nama}</TableCell>
                    <TableCell><Badge variant="outline">{b.kategori.nama}</Badge></TableCell>
                    <TableCell className="text-right">Rp {b.hargaBeli.toLocaleString("id-ID")}</TableCell>
                    <TableCell className="text-right">Rp {b.hargaJual.toLocaleString("id-ID")}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={b.stok === 0 ? "destructive" : b.stok < 10 ? "secondary" : "default"}>
                        {b.stok} {b.satuan}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" render={<Link href={`/barang/${b.id}/edit`} />}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <DeleteDialog id={b.id} name={b.nama} action={deleteBarang} />
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
