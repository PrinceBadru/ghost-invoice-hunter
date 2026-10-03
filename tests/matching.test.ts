import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockPrisma = vi.hoisted(() => ({
  document: {
    findUniqueOrThrow: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn().mockResolvedValue([]),
    update: vi.fn(),
  },
  discrepancy: {
    create: vi.fn(),
  },
  auditLog: {
    create: vi.fn(),
  },
}))

vi.mock('@/lib/prisma', () => ({
  prisma: mockPrisma
}))

import { evaluateInvoice } from '@/lib/matching'

describe('Line-Level Matching Engine', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPrisma.document.findMany.mockResolvedValue([])
  })

  it('matches perfectly with no variance', async () => {
    mockPrisma.document.findUniqueOrThrow.mockResolvedValue({
      id: 'inv-1',
      environmentId: 'env-1',
      businessId: 'bus-1',
      linkedPoRef: 'PO-123',
      totalAmount: 100,
      environment: { toleranceThreshold: 5 },
      lineItems: [
        { description: 'Widgets', quantity: 10, unitPrice: 10, amount: 100 }
      ]
    })

    mockPrisma.document.findFirst.mockResolvedValue({
      id: 'po-1',
      totalAmount: 100,
      lineItems: [
        { description: 'Widgets', quantity: 10, unitPrice: 10, amount: 100 }
      ]
    })

    const result = await evaluateInvoice('inv-1')
    
    expect(result.status).toBe('Matched')
    expect(result.severity).toBe('Low')
    expect(result.reasons).toHaveLength(0)
    expect(result.score).toBe(0)
  })

  it('detects quantity over-billed', async () => {
    mockPrisma.document.findUniqueOrThrow.mockResolvedValue({
      id: 'inv-2',
      environmentId: 'env-1',
      businessId: 'bus-1',
      linkedPoRef: 'PO-123',
      totalAmount: 120,
      environment: { toleranceThreshold: 5 },
      lineItems: [
        { description: 'Widgets', quantity: 12, unitPrice: 10, amount: 120 }
      ]
    })

    mockPrisma.document.findFirst.mockResolvedValue({
      id: 'po-2',
      totalAmount: 100,
      lineItems: [
        { description: 'Widgets', quantity: 10, unitPrice: 10, amount: 100 }
      ]
    })

    const result = await evaluateInvoice('inv-2')
    
    expect(result.status).toBe('Discrepancy')
    expect(result.severity).toBe('High')
    expect(result.reasons.some(r => r.includes('Quantity over-billed'))).toBe(true)
  })

  it('detects unit price variance', async () => {
    mockPrisma.document.findUniqueOrThrow.mockResolvedValue({
      id: 'inv-3',
      environmentId: 'env-1',
      businessId: 'bus-1',
      linkedPoRef: 'PO-123',
      totalAmount: 150,
      environment: { toleranceThreshold: 5 },
      lineItems: [
        { description: 'Widgets', quantity: 10, unitPrice: 15, amount: 150 }
      ]
    })

    mockPrisma.document.findFirst.mockResolvedValue({
      id: 'po-3',
      totalAmount: 100,
      lineItems: [
        { description: 'Widgets', quantity: 10, unitPrice: 10, amount: 100 }
      ]
    })

    const result = await evaluateInvoice('inv-3')
    
    expect(result.status).toBe('Discrepancy')
    expect(result.severity).toBe('High')
    expect(result.reasons.some(r => r.includes('Unit price variance'))).toBe(true)
  })

  it('detects missing PO line', async () => {
    mockPrisma.document.findUniqueOrThrow.mockResolvedValue({
      id: 'inv-4',
      environmentId: 'env-1',
      businessId: 'bus-1',
      linkedPoRef: 'PO-123',
      totalAmount: 150,
      environment: { toleranceThreshold: 5 },
      lineItems: [
        { description: 'Widgets', quantity: 10, unitPrice: 10, amount: 100 },
        { description: 'Mystery Item', quantity: 1, unitPrice: 50, amount: 50 }
      ]
    })

    mockPrisma.document.findFirst.mockResolvedValue({
      id: 'po-4',
      totalAmount: 100,
      lineItems: [
        { description: 'Widgets', quantity: 10, unitPrice: 10, amount: 100 }
      ]
    })

    const result = await evaluateInvoice('inv-4')
    
    expect(result.status).toBe('Discrepancy')
    expect(result.severity).toBe('High')
    expect(result.reasons.some(r => r.includes('Missing PO line'))).toBe(true)
  })
})
