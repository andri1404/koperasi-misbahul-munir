import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Package, ShoppingCart, ClipboardList, DollarSign } from "lucide-react"

async function getStats() {
  const [totalAnggota, totalBarang, totalPembelian, totalPenjualan] = await Promise.all([
    prisma.user.count({ where: { role: "ANGGOTA" } }),
    prisma.barang.count(),
    prisma.pembelian.count(),
    prisma.penjualan.count(),
  ])

  const penjualanBulanIni = await prisma.penjualan.aggregate({
    _sum: { total: true },
    where: {
      tanggal: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    },
  })

  return {
    totalAnggota,
    totalBarang,
    totalPembelian,
    totalPenjualan,
    omzetBulanIni: penjualanBulanIni._sum.total || 0,
  }
}

export default async function DashboardPage() {
  const session = await auth()
  const stats = await getStats()

  const statCards = [
    { title: "Total Anggota", value: stats.totalAnggota, icon: Users, color: "text-blue-600" },
    { title: "Total Barang", value: stats.totalBarang, icon: Package, color: "text-green-600" },
    { title: "Pembelian", value: stats.totalPembelian, icon: ShoppingCart, color: "text-orange-600" },
    { title: "Penjualan", value: stats.totalPenjualan, icon: ClipboardList, color: "text-purple-600" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Selamat datang, {session?.user?.name || "Pengguna"}
        </h1>
        <p className="text-muted-foreground">Ringkasan koperasi hari ini</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{card.value.toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="h-5 w-5 text-green-600" />
            Omzet Bulan Ini
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-green-600">
            Rp {stats.omzetBulanIni.toLocaleString("id-ID")}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
