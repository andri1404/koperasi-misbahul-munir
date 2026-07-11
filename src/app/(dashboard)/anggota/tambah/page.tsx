"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createAnggota, type AnggotaFormData } from "@/lib/actions/anggota"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function TambahAnggotaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    const form = new FormData(e.currentTarget)
    const data: AnggotaFormData = {
      name: form.get("name") as string,
      email: form.get("email") as string,
      password: form.get("password") as string,
      noAnggota: form.get("noAnggota") as string,
      alamat: form.get("alamat") as string || undefined,
      telepon: form.get("telepon") as string || undefined,
      role: form.get("role") as "ADMIN" | "PENGURUS" | "ANGGOTA",
    }

    const result = await createAnggota(data)

    if (result.error) {
      setErrors(result.error as Record<string, string[]>)
      setLoading(false)
      return
    }

    toast.success(result.message || "Anggota berhasil ditambahkan")
    router.push("/anggota")
    router.refresh()
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" render={<Link href="/anggota" />}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tambah Anggota</h1>
          <p className="text-muted-foreground">Daftarkan anggota baru ke koperasi</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Form Anggota</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input id="name" name="name" placeholder="Masukkan nama lengkap" required />
              {errors.name && <p className="text-sm text-red-500">{errors.name[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="noAnggota">Nomor Anggota</Label>
              <Input id="noAnggota" name="noAnggota" placeholder="Masukkan nomor anggota" required />
              {errors.noAnggota && <p className="text-sm text-red-500">{errors.noAnggota[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="contoh@email.com" required />
              {errors.email && <p className="text-sm text-red-500">{errors.email[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="Minimal 6 karakter" required />
              {errors.password && <p className="text-sm text-red-500">{errors.password[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telepon">Telepon</Label>
              <Input id="telepon" name="telepon" placeholder="08xxxx" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alamat">Alamat</Label>
              <Textarea id="alamat" name="alamat" placeholder="Masukkan alamat" rows={2} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select name="role" defaultValue="ANGGOTA">
                <SelectTrigger>
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="PENGURUS">Pengurus</SelectItem>
                  <SelectItem value="ANGGOTA">Anggota</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" type="button" render={<Link href="/anggota" />}>Batal</Button>
              <Button type="submit" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
