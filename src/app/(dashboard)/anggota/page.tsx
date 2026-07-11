import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { deleteAnggota } from "@/lib/actions/anggota"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { DeleteButton } from "./delete-button"

async function getAnggota() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      noAnggota: true,
      telepon: true,
      alamat: true,
    },
  })
}

const roleBadge: Record<string, string> = {
  ADMIN: "bg-red-100 text-red-800",
  PENGURUS: "bg-blue-100 text-blue-800",
  ANGGOTA: "bg-green-100 text-green-800",
}

export default async function AnggotaPage() {
  const session = await auth()
  const anggota = await getAnggota()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Anggota</h1>
          <p className="text-muted-foreground">Kelola data anggota koperasi</p>
        </div>
        <Button render={<Link href="/dashboard/anggota/tambah" />}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Anggota
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Daftar Anggota ({anggota.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No Anggota</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telepon</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="w-[80px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {anggota.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    Belum ada data anggota
                  </TableCell>
                </TableRow>
              ) : (
                anggota.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-mono text-sm">{a.noAnggota}</TableCell>
                    <TableCell className="font-medium">{a.name}</TableCell>
                    <TableCell>{a.email}</TableCell>
                    <TableCell>{a.telepon || "-"}</TableCell>
                    <TableCell>
                      <Badge className={roleBadge[a.role] || ""} variant="secondary">
                        {a.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" render={<Link href={`/dashboard/anggota/${a.id}/edit`} />}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        {a.id !== session?.user?.id && (
                          <DeleteButton id={a.id} name={a.name || ""} onDelete={deleteAnggota} />
                        )}
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
