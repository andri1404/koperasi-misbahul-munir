import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { SupplierEditForm } from "./edit-form"

export default async function EditSupplierPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supplier = await prisma.supplier.findUnique({ where: { id } })
  if (!supplier) notFound()
  return <SupplierEditForm supplier={supplier} />
}
