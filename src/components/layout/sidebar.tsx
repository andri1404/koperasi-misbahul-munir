"use client"

import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  ClipboardList,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
} from "lucide-react"
import { useState } from "react"

const menuItems = [
  {
    title: "Utama",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Anggota", href: "/dashboard/anggota", icon: Users },
    ],
  },
  {
    title: "Inventaris",
    items: [
      { name: "Kategori", href: "/dashboard/kategori", icon: Package },
      { name: "Barang", href: "/dashboard/barang", icon: Package },
      { name: "Supplier", href: "/dashboard/supplier", icon: Users },
    ],
  },
  {
    title: "Transaksi",
    items: [
      { name: "Pembelian", href: "/dashboard/pembelian", icon: ShoppingCart },
      { name: "Penjualan", href: "/dashboard/penjualan", icon: ClipboardList },
    ],
  },
  {
    title: "Laporan",
    items: [
      { name: "Laporan", href: "/dashboard/laporan", icon: FileText },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-14 items-center border-b px-4">
        {!collapsed && (
          <Link href="/dashboard" className="text-lg font-bold text-primary">
            KMM
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("ml-auto h-8 w-8", collapsed && "mx-auto")}
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        {menuItems.map((group) => (
          <div key={group.title} className="mb-3">
            {!collapsed && (
              <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.title}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      collapsed && "justify-center px-2",
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t p-2">
        {!collapsed && session?.user && (
          <div className="mb-2 px-3 py-1">
            <p className="text-xs font-medium">{session.user.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{session.user.role?.toLowerCase()}</p>
          </div>
        )}
        <Button
          variant="ghost"
          className={cn("w-full justify-start gap-3 text-muted-foreground", collapsed && "justify-center px-2")}
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Keluar</span>}
        </Button>
      </div>
    </aside>
  )
}
