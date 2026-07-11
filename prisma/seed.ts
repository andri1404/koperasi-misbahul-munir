import "dotenv/config"
import { PrismaClient } from "@/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})
const prisma = new PrismaClient({ adapter })

async function main() {
  const password = await bcrypt.hash("admin123", 12)

  const admin = await prisma.user.upsert({
    where: { email: "admin@koperasi.id" },
    update: {},
    create: {
      email: "admin@koperasi.id",
      name: "Admin Koperasi",
      password,
      role: "ADMIN",
      noAnggota: "ADM-001",
    },
  })

  console.log("Admin created:", admin.email)

  const kategori = await prisma.kategoriBarang.createMany({
    data: [
      { nama: "Sembako" },
      { nama: "Minuman" },
      { nama: "Alat Tulis" },
      { nama: "Kebutuhan Rumah Tangga" },
    ],
    skipDuplicates: true,
  })

  console.log("Kategori seeded")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
