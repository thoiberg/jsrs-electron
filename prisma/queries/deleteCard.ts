import type { RPCResponse } from 'electron/types'
import errorProcessing from './utils/errorProcessing'
import { prisma } from '../prisma'
import { CardStatus } from '../card'

export default async function deleteCard(
  event: Event,
  cardId: string,
): Promise<RPCResponse<undefined>> {
  try {
    await prisma.card.update({
      where: {
        id: cardId,
      },
      data: {
        status: CardStatus.DELETED,
      },
    })
    return { data: undefined }
  } catch (e) {
    return errorProcessing(e)
  }
}
