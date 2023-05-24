import { prisma } from '../prisma'
import { CardStatus } from '../card'

export default async function deleteCard(cardId: string): Promise<void> {
  await prisma.card.update({
    where: {
      id: cardId,
    },
    data: {
      status: CardStatus.DELETED,
    },
  })
}
