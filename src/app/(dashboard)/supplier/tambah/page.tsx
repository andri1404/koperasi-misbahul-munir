"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createSupplier } from "@/lib/actions/supplier"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function TambahSupplierPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const form = new FormData(e.currentTarget)
    const result = await createSupplier({
      nama: form.get("nama") as string,
      kontak: (form.get("kontak") as string) || undefined,
      alamat: (form.get("alamat") as string) || undefined,
    })
    if (result.message === "Validasi gagal") { setError(result.message); setLoading(false); return }
    toast.success(result.message || "Supplier ditambahkan")
    router.push("/dashboard/supplier")
    router.refresh()
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" render={<Link href="/dashboard/supplier" />}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tambah Supplier</h1>
          <p className="text-muted-foreground">Daftarkan supplier baru</p>
        </div>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Form Supplier</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Supplier</Label>
              <Input id="nama" name="nama" placeholder="Masukkan nama supplier" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kontak">Kontak</Label>
              <Input id="kontak" name="kontak" placeholder="Nomor telepon / email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alamat">Alamat</Label>
              <Textarea id="alamat" name="alamat" placeholder="Masukkan alamat" rows={2} />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" render={<Link href="/dashboard/supplier" />}>Batal</Button>
              <Button type="submit" disabled={loading}><Save className="mr-2 h-4 w-4" />{loading ? "Menyimpan..." : "Simpan"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
