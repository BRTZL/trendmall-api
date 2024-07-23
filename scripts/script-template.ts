import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // user prisma here
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
