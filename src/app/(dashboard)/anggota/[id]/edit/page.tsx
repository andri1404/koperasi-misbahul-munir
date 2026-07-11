import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { EditForm } from "./edit-form"

export default async function EditAnggotaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) notFound()

  return <EditForm user={user} />
}
