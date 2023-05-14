import { describe, expect, it, vi } from 'vitest'
import formatDateTime from '../formatDateTime'
import { mockDeep } from 'vitest-mock-extended'

describe('formatDateTime', () => {
  it('formats according to the browser locale', () => {
    const navigatorMock = mockDeep<Navigator>({ language: 'en-GB' })
    vi.stubGlobal('navigator', navigatorMock)

    const date = new Date('2023-05-14')

    expect(formatDateTime(date)).toContain('14/05/2023')
  })
})
