'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Household, Member } from '@/lib/types'
import MemberCard from './MemberCard'
import MemberForm from './MemberForm'

interface Props {
  initialHousehold: Household | null
  initialMembers: Member[]
}

export default function HouseholdClient({ initialHousehold, initialMembers }: Props) {
  const [household, setHousehold] = useState<Household | null>(initialHousehold)
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [householdName, setHouseholdName] = useState(initialHousehold?.name ?? '')
  const [editingName, setEditingName] = useState(!initialHousehold)
  const [showAddMember, setShowAddMember] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  async function saveHouseholdName() {
    if (!householdName.trim()) return
    setSaving(true)
    setError('')

    if (household) {
      const { data, error } = await supabase
        .from('households')
        .update({ name: householdName.trim() })
        .eq('id', household.id)
        .select()
        .single()
      if (error) { setError(error.message); setSaving(false); return }
      setHousehold(data)
    } else {
      const { data, error } = await supabase
        .from('households')
        .insert({ name: householdName.trim() })
        .select()
        .single()
      if (error) { setError(error.message); setSaving(false); return }
      setHousehold(data)
    }

    setEditingName(false)
    setSaving(false)
  }

  async function deleteMember(id: string) {
    const { error } = await supabase.from('members').delete().eq('id', id)
    if (error) { setError(error.message); return }
    setMembers((prev) => prev.filter((m) => m.id !== id))
  }

  function onMemberSaved(member: Member) {
    setMembers((prev) => {
      const existing = prev.find((m) => m.id === member.id)
      return existing
        ? prev.map((m) => (m.id === member.id ? member : m))
        : [...prev, member]
    })
    setShowAddMember(false)
    setEditingMember(null)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-green-800">Household</h1>

      {/* Household name */}
      <div className="card">
        <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">
          Household name
        </h2>
        {editingName ? (
          <div className="flex gap-2">
            <input
              className="input flex-1"
              value={householdName}
              onChange={(e) => setHouseholdName(e.target.value)}
              placeholder="e.g. The Doll Family"
              onKeyDown={(e) => e.key === 'Enter' && saveHouseholdName()}
            />
            <button className="btn-primary" onClick={saveHouseholdName} disabled={saving}>
              {saving ? '…' : 'Save'}
            </button>
            {household && (
              <button className="btn-ghost" onClick={() => setEditingName(false)}>
                Cancel
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-stone-800">{household?.name}</span>
            <button
              className="text-sm text-orange-500 hover:underline"
              onClick={() => setEditingName(true)}
            >
              Edit
            </button>
          </div>
        )}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {/* Members */}
      {household && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-stone-800">Family members</h2>
            <button
              className="btn-primary text-sm py-1.5"
              onClick={() => { setShowAddMember(true); setEditingMember(null) }}
            >
              + Add member
            </button>
          </div>

          {(showAddMember || editingMember) && (
            <MemberForm
              household={household}
              member={editingMember ?? undefined}
              onSaved={onMemberSaved}
              onCancel={() => { setShowAddMember(false); setEditingMember(null) }}
            />
          )}

          <div className="space-y-3">
            {members.length === 0 && !showAddMember && (
              <div className="card text-center text-stone-400 py-8">
                No members yet — add your first family member above.
              </div>
            )}
            {members.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                onEdit={() => { setEditingMember(member); setShowAddMember(false) }}
                onDelete={() => deleteMember(member.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
