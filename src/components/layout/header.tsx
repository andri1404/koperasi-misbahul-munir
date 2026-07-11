"use client"

import { useSession } from "next-auth/react"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"
import { Fragment } from "react"

function BreadcrumbNav() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)
  const labels: Record<string, string> = {
    dashboard: "Dashboard",
    anggota: "Anggota",
    barang: "Barang",
    kategori: "Kategori",
    supplier: "Supplier",
    pembelian: "Pembelian",
    penjualan: "Penjualan",
    laporan: "Laporan",
    tambah: "Tambah",
    edit: "Edit",
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, i) => {
          const href = "/" + segments.slice(0, i + 1).join("/")
          const isLast = i === segments.length - 1
          return (
            <Fragment key={segment}>
              <BreadcrumbItem>
                {isLast ? (
                  <span className="text-sm font-medium">
                    {labels[segment] || segment}
                  </span>
                ) : (
                  <BreadcrumbLink href={href}>
                    {labels[segment] || segment}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-6">
      <BreadcrumbNav />
      <div className="flex items-center gap-3">
        {session?.user?.role && (
          <Badge variant="secondary" className="capitalize">
            {session.user.role.toLowerCase()}
          </Badge>
        )}
      </div>
    </header>
  )
}
