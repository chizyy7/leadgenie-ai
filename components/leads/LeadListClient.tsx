'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import type { Lead, LeadStatus } from '@/types'
import { EmptyLeadState } from '@/components/leads/EmptyLeadState'
import { LeadTable } from '@/components/leads/LeadTable'

interface LeadListClientProps {
  initialLeads: Lead[]
}

export function LeadListClient({ initialLeads }: LeadListClientProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [busyLeadId, setBusyLeadId] = useState<string | null>(null)

  const sortedLeads = useMemo(() => {
    return [...leads].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }, [leads])

  const updateStatus = async (id: string, status: LeadStatus) => {
    setBusyLeadId(id)
    const response = await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })

    const json = (await response.json()) as { success: boolean; data?: Lead }
    if (response.ok && json.success && json.data) {
      setLeads((current) => current.map((lead) => (lead.id === id ? json.data! : lead)))
      toast.success('Lead status updated', {
        style: { background: 'var(--success)', color: 'white' },
      })
    } else {
      toast.error('Unable to update status', {
        style: { background: 'var(--error)', color: 'white' },
      })
    }

    setBusyLeadId(null)
  }

  const deleteLead = async (id: string) => {
    setBusyLeadId(id)
    const response = await fetch(`/api/leads/${id}`, {
      method: 'DELETE',
    })

    const json = (await response.json()) as { success: boolean }
    if (response.ok && json.success) {
      setLeads((current) => current.filter((lead) => lead.id !== id))
      toast.success('Lead deleted', {
        style: { background: 'var(--success)', color: 'white' },
      })
    } else {
      toast.error('Unable to delete lead', {
        style: { background: 'var(--error)', color: 'white' },
      })
    }

    setBusyLeadId(null)
  }

  if (sortedLeads.length === 0) {
    return <EmptyLeadState />
  }

  return <LeadTable leads={sortedLeads} busyLeadId={busyLeadId} onStatusChange={updateStatus} onDelete={deleteLead} />
}
