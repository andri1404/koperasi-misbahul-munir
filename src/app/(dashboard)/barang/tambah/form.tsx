"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createBarang, type BarangFormData } from "@/lib/actions/barang"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export function BarangForm({ kategori, barang }: { kategori: { id: string; nama: string }[]; barang?: { id: string; kode: string; nama: string; kategoriId: string; hargaBeli: number; hargaJual: number; stok: number; satuan: string; deskripsi: string | null } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const form = new FormData(e.currentTarget)
    const data: BarangFormData = {
      kode: form.get("kode") as string,
      nama: form.get("nama") as string,
      kategoriId: form.get("kategoriId") as string,
      hargaBeli: Number(form.get("hargaBeli")),
      hargaJual: Number(form.get("hargaJual")),
      stok: Number(form.get("stok") || 0),
      satuan: "pcs",
      deskripsi: (form.get("deskripsi") as string) || undefined,
    }

    let result
    if (barang) {
      const { updateBarang } = await import("@/lib/actions/barang")
      result = await updateBarang(barang.id, data)
    } else {
      result = await createBarang(data)
    }

    if (result.error || result.message !== "Barang berhasil ditambahkan" && result.message !== "Barang berhasil diperbarui") {
      setError(result.message || "Gagal menyimpan")
      setLoading(false)
      return
    }

    toast.success(result.message)
    router.push("/barang")
    router.refresh()
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" render={<Link href="/barang" />}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{barang ? "Edit Barang" : "Tambah Barang"}</h1>
          <p className="text-muted-foreground">{barang ? "Perbarui data barang" : "Daftarkan barang baru"}</p>
        </div>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">{barang ? "Form Edit Barang" : "Form Barang"}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="kode">Kode Barang</Label>
                <Input id="kode" name="kode" defaultValue={barang?.kode} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="satuan">Satuan</Label>
                <Input id="satuan" name="satuan" defaultValue={barang?.satuan || "pcs"} disabled />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nama">Nama Barang</Label>
              <Input id="nama" name="nama" defaultValue={barang?.nama} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="kategoriId">Kategori</Label>
              <Select name="kategoriId" defaultValue={barang?.kategoriId}>
                <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                <SelectContent>
                  {kategori.map((k) => (
                    <SelectItem key={k.id} value={k.id}>{k.nama}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hargaBeli">Harga Beli</Label>
                <Input id="hargaBeli" name="hargaBeli" type="number" min="0" step="100" defaultValue={barang?.hargaBeli || 0} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hargaJual">Harga Jual</Label>
                <Input id="hargaJual" name="hargaJual" type="number" min="0" step="100" defaultValue={barang?.hargaJual || 0} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stok">Stok</Label>
                <Input id="stok" name="stok" type="number" min="0" defaultValue={barang?.stok || 0} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <Textarea id="deskripsi" name="deskripsi" defaultValue={barang?.deskripsi || ""} rows={2} />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" render={<Link href="/barang" />}>Batal</Button>
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
