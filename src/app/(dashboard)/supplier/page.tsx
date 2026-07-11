import { prisma } from "@/lib/prisma"
import { deleteSupplier } from "@/lib/actions/supplier"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { Plus, Pencil } from "lucide-react"
import { DeleteDialog } from "@/components/delete-dialog"

async function getData() {
  return prisma.supplier.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { pembelian: true } } },
  })
}

export default async function SupplierPage() {
  const data = await getData()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Supplier</h1>
          <p className="text-muted-foreground">Kelola data supplier</p>
        </div>
        <Button render={<Link href="/supplier/tambah" />}><Plus className="mr-2 h-4 w-4" />Tambah Supplier</Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Daftar Supplier ({data.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Supplier</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead className="text-center">Pembelian</TableHead>
                <TableHead className="w-[80px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">Belum ada data supplier</TableCell>
                </TableRow>
              ) : (
                data.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.nama}</TableCell>
                    <TableCell>{s.kontak || "-"}</TableCell>
                    <TableCell className="max-w-xs truncate">{s.alamat || "-"}</TableCell>
                    <TableCell className="text-center">{s._count.pembelian}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" render={<Link href={`/supplier/${s.id}/edit`} />}><Pencil className="h-4 w-4" /></Button>
                        <DeleteDialog id={s.id} name={s.nama} action={deleteSupplier} />
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
