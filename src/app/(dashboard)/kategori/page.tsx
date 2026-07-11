import { prisma } from "@/lib/prisma"
import { deleteKategori } from "@/lib/actions/kategori"
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { Plus, Pencil } from "lucide-react"
import { DeleteDialog } from "@/components/delete-dialog"

async function getData() {
  return prisma.kategoriBarang.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { barang: true } } },
  })
}

export default async function KategoriPage() {
  const data = await getData()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kategori Barang</h1>
          <p className="text-muted-foreground">Kelola kategori barang koperasi</p>
        </div>
        <Button render={<Link href="/kategori/tambah" />}>
          <Plus className="mr-2 h-4 w-4" />Tambah Kategori
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Daftar Kategori ({data.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Kategori</TableHead>
                <TableHead className="text-center">Jumlah Barang</TableHead>
                <TableHead className="w-[80px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                    Belum ada data kategori
                  </TableCell>
                </TableRow>
              ) : (
                data.map((k) => (
                  <TableRow key={k.id}>
                    <TableCell className="font-medium">{k.nama}</TableCell>
                    <TableCell className="text-center">{k._count.barang}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" render={<Link href={`/kategori/${k.id}/edit`} />}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <DeleteDialog id={k.id} name={k.nama} action={deleteKategori} />
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
