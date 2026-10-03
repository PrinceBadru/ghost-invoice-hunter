import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { InvoiceActions } from '@/components/invoices/InvoiceActions'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: vi.fn(),
  }),
}))

describe('InvoiceActions Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
  })

  it('renders action buttons correctly', () => {
    render(<InvoiceActions invoiceId="123" />)
    expect(screen.getByText('Mark as Resolved')).toBeDefined()
    expect(screen.getByText('Request Correction')).toBeDefined()
    expect(screen.getByText('Reject')).toBeDefined()
  })

  it('opens modal for Request Correction', () => {
    render(<InvoiceActions invoiceId="123" />)
    const btn = screen.getByText('Request Correction')
    fireEvent.click(btn)

    expect(screen.getByText('Request Correction', { selector: 'h3' })).toBeDefined()
    expect(screen.getByPlaceholderText('Details of correction needed...')).toBeDefined()
  })
})
