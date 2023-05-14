import type { electronAPI } from 'env'
import { vi } from 'vitest'
import { mockDeep } from 'vitest-mock-extended'

export default function mockElectronApi() {
  const electronApiMock = mockDeep<electronAPI>()
  vi.stubGlobal('electronAPI', electronApiMock)

  return electronApiMock
}
