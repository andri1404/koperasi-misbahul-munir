"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { KategoriBarang } from "@/generated/prisma/client"
import { updateKategori } from "@/lib/actions/kategori"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export function KategoriEditForm({ kategori }: { kategori: KategoriBarang }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const form = new FormData(e.currentTarget)
    const result = await updateKategori(kategori.id, { nama: form.get("nama") as string })
    if (result.message === "Validasi gagal" || result.message === "Kategori sudah ada") {
      setError(result.message)
      setLoading(false)
      return
    }
    toast.success(result.message || "Kategori diperbarui")
    router.push("/dashboard/kategori")
    router.refresh()
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" render={<Link href="/dashboard/kategori" />}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Kategori</h1>
          <p className="text-muted-foreground">Perbarui data kategori</p>
        </div>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Form Edit Kategori</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Kategori</Label>
              <Input id="nama" name="nama" defaultValue={kategori.nama} required />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" render={<Link href="/dashboard/kategori" />}>Batal</Button>
              <Button type="submit" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />{loading ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
