import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockCookiesGet = vi.fn()
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: mockCookiesGet
  })),
}))

vi.mock('@/lib/auth', () => ({
  SESSION_COOKIE: 'gih_session',
  verifySession: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    }
  }
}))

vi.mock('server-only', () => ({}))
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

import { verifySession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { requireApiRole } from '@/lib/session'

describe('requireApiRole', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return 401 Unauthorized if no user is found', async () => {
    mockCookiesGet.mockReturnValue(undefined)
    
    const result = await requireApiRole(['MASTER', 'ADMIN'])
    
    expect(result.error).toBeDefined()
    expect(result.error?.status).toBe(401)
  })

  it('should return 403 Forbidden if user role is not allowed', async () => {
    mockCookiesGet.mockReturnValue({ value: 'token' })
    vi.mocked(verifySession).mockResolvedValue({ userId: '123' } as any)
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: '123',
      role: 'VIEWER',
      environmentId: 'env-1',
    } as any)
    
    const result = await requireApiRole(['MASTER', 'ADMIN'])
    
    expect(result.error).toBeDefined()
    expect(result.error?.status).toBe(403)
  })

  it('should return user if role is allowed', async () => {
    const mockUser = {
      id: '123',
      role: 'ADMIN',
      environmentId: 'env-1',
    } as any

    mockCookiesGet.mockReturnValue({ value: 'token' })
    vi.mocked(verifySession).mockResolvedValue({ userId: '123' } as any)
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser)
    
    const result = await requireApiRole(['MASTER', 'ADMIN'])
    
    expect(result.error).toBeUndefined()
    expect(result.user).toEqual(mockUser)
  })
})
