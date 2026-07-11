"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { deleteAnggota } from "@/lib/actions/anggota"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

export function DeleteButton({
  id,
  name,
  onDelete,
}: {
  id: string
  name: string
  onDelete: (id: string) => Promise<void>
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setLoading(true)
    await deleteAnggota(id)
    setLoading(false)
    setOpen(false)
    toast.success(`Anggota "${name}" berhasil dihapus`)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Anggota</DialogTitle>
          <DialogDescription>
            Yakin ingin menghapus anggota &ldquo;{name}&rdquo;? Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "Menghapus..." : "Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
