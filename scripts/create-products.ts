import { PrismaClient } from "@prisma/client"

import products from "./products.json"

const prisma = new PrismaClient()

async function main() {
  await prisma.productImage.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  const categories = products
    .map((product) => product.category)
    .filter((v, i, a) => a.indexOf(v) === i)

  await prisma.category.createMany({
    data: categories.map((category) => ({
      name: category,
      parentId: null,
    })),
    skipDuplicates: true,
  })

  const categoryMap = await prisma.category.findMany().then((categories) => {
    return categories.reduce((map, category) => {
      map[category.name] = category.id
      return map
    }, {})
  })

  const productsData = products.map((product) => ({
    name: product.title,
    description: product.description,
    price: product.price * 100,
    stock: product.stock,
    categoryId: categoryMap[product.category],
    images: product.images.map((url) => ({ url })),
  }))

  const batchSize = 50 // Adjust batch size to your needs
  for (let i = 0; i < productsData.length; i += batchSize) {
    const batch = productsData.slice(i, i + batchSize)

    // Insert products in batches
    await prisma.product.createMany({
      data: batch.map((product) => ({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        categoryId: product.categoryId,
      })),
      skipDuplicates: true,
    })

    // Retrieve the created products to link images
    const productRecords = await prisma.product.findMany({
      where: {
        name: { in: batch.map((product) => product.name) },
      },
    })

    // Create a map of product names to their corresponding records
    const productMap = productRecords.reduce((map, product) => {
      map[product.name] = product.id
      return map
    }, {})

    // Insert images in batches
    const imagesData = []
    batch.forEach((product) => {
      const productId = productMap[product.name]
      const productImages = product.images.map((image) => ({
        productId,
        url: image.url,
      }))
      imagesData.push(...productImages)
    })

    await prisma.productImage.createMany({
      data: imagesData,
      skipDuplicates: true,
    })
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
