"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createPenjualan } from "@/lib/actions/penjualan"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface PenjualanFormProps {
  barang: { id: string; kode: string; nama: string; hargaJual: number; stok: number; kategori: { nama: string } }[]
  anggota: { id: string; name: string | null; noAnggota: string | null }[]
  userId: string
}

interface DetailItem {
  barangId: string
  nama: string
  harga: number
  stokTersedia: number
  jumlah: number
  subtotal: number
}

export function PenjualanForm({ barang, anggota, userId }: PenjualanFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedAnggota, setSelectedAnggota] = useState("")
  const [items, setItems] = useState<DetailItem[]>([])

  function addItem() {
    setItems([...items, { barangId: "", nama: "", harga: 0, stokTersedia: 0, jumlah: 1, subtotal: 0 }])
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index))
  }

  function updateItem(index: number, field: keyof DetailItem, value: string | number) {
    const updated = items.map((item, i) => {
      if (i !== index) return item
      const newItem = { ...item, [field]: value }

      if (field === "barangId" && typeof value === "string") {
        const b = barang.find((b) => b.id === value)
        if (b) {
          newItem.nama = b.nama
          newItem.harga = b.hargaJual
          newItem.stokTersedia = b.stok
        }
      }

      if (field === "jumlah" || field === "harga") {
        newItem.subtotal = newItem.harga * newItem.jumlah
      }

      return newItem
    })
    setItems(updated)
  }

  const total = items.reduce((sum, item) => sum + item.subtotal, 0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (items.length === 0) { setError("Tambahkan minimal 1 barang"); return }

    for (const item of items) {
      if (item.jumlah > item.stokTersedia) {
        setError(`Stok "${item.nama}" tidak mencukupi (tersedia: ${item.stokTersedia})`)
        return
      }
    }

    const result = await createPenjualan({
      userId,
      anggotaId: selectedAnggota || undefined,
      total,
      detail: items.map((item) => ({
        barangId: item.barangId,
        jumlah: item.jumlah,
        harga: item.harga,
        subtotal: item.subtotal,
      })),
    })

    if (result.error) { setError("Gagal menyimpan penjualan"); return }
    toast.success("Penjualan berhasil dicatat")
    router.push("/dashboard/penjualan")
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" render={<Link href="/dashboard/penjualan" />}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Penjualan Baru</h1>
          <p className="text-muted-foreground">Catat penjualan barang ke anggota</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Detail Barang</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  <Plus className="mr-1 h-3 w-3" />Tambah Barang
                </Button>
              </CardHeader>
              <CardContent>
                {items.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Belum ada barang</p>
                ) : (
                  <div className="space-y-3">
                    {items.map((item, index) => (
                      <div key={index} className="flex items-end gap-2 rounded-lg border p-3">
                        <div className="flex-1 space-y-1">
                          <Label className="text-xs">Barang (Stok: {item.stokTersedia || "-"})</Label>
                          <Select value={item.barangId} onValueChange={(v) => updateItem(index, "barangId", v!)}>
                            <SelectTrigger><SelectValue placeholder="Pilih barang" /></SelectTrigger>
                            <SelectContent>
                              {barang.map((b) => (
                                <SelectItem key={b.id} value={b.id}>{b.kode} - {b.nama} (Stok: {b.stok})</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="w-20 space-y-1">
                          <Label className="text-xs">Jumlah</Label>
                          <Input type="number" min="1" max={item.stokTersedia} value={item.jumlah} onChange={(e) => updateItem(index, "jumlah", Number(e.target.value))} />
                        </div>
                        <div className="w-32 space-y-1">
                          <Label className="text-xs">Harga</Label>
                          <Input type="number" min="0" value={item.harga} onChange={(e) => updateItem(index, "harga", Number(e.target.value))} />
                        </div>
                        <div className="w-32 space-y-1">
                          <Label className="text-xs">Subtotal</Label>
                          <div className="flex h-9 items-center rounded-md border px-3 text-sm">
                            Rp {item.subtotal.toLocaleString("id-ID")}
                          </div>
                        </div>
                        <Button type="button" variant="ghost" size="icon" className="shrink-0" onClick={() => removeItem(index)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-base">Info Penjualan</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="anggota">Anggota (Opsional)</Label>
                  <Select value={selectedAnggota} onValueChange={(v) => setSelectedAnggota(v!)}>
                    <SelectTrigger><SelectValue placeholder="Umum / Non-Anggota" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="umum">Umum / Non-Anggota</SelectItem>
                      {anggota.map((a) => (
                        <SelectItem key={a.id} value={a.id}>{a.noAnggota} - {a.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-lg bg-muted p-3">
                  <div className="flex justify-between text-sm">
                    <span>Total</span>
                    <span className="text-lg font-bold">Rp {total.toLocaleString("id-ID")}</span>
                  </div>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <div className="flex gap-2">
                  <Button variant="outline" type="button" render={<Link href="/dashboard/penjualan" />} className="flex-1">Batal</Button>
                  <Button type="submit" disabled={loading} className="flex-1">
                    <Save className="mr-2 h-4 w-4" />{loading ? "Menyimpan..." : "Simpan"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
