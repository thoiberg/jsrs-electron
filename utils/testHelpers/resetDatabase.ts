import { prisma } from '../../prisma/prisma'

export default async function resetDatabase() {
  await prisma.$executeRawUnsafe('DELETE FROM EnglishAnswer;')
  await prisma.$executeRawUnsafe('DELETE FROM JapaneseAnswer;')
  await prisma.$executeRawUnsafe('DELETE FROM JapaneseCardSide;')
  await prisma.$executeRawUnsafe('DELETE FROM EnglishCardSide;')
  await prisma.$executeRawUnsafe('DELETE FROM Card;')
}
