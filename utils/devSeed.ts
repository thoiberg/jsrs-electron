import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const cards = [
  { english: 'cat', kana: 'ねこ', kanji: '猫' },
  { english: 'dog', kana: 'いぬ', kanji: '犬' },
  { english: 'read', kana: 'よむ', kanji: '読む' },
  { english: 'cool', kanji: '涼しい' },
  { english: 'write', kana: 'かく' }
]

cards.forEach(async (card) => {
  await prisma.card.create({
    data: {
      japaneseCardSide: {
        create: {
          japaneseAnswers: {
            create: {
              kana: card.kana,
              kanji: card.kanji
            }
          }
        }
      },
      englishCardSide: {
        create: {
          englishAnswers: {
            create: {
              answer: card.english
            }
          }
        }
      }
    }
  })
})
