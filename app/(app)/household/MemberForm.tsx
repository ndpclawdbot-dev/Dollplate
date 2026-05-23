'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Household, Member, DietaryFlags } from '@/lib/types'

const DIETARY_OPTIONS: { key: keyof DietaryFlags; label: string }[] = [
  { key: 'gluten_free', label: 'Gluten-free' },
  { key: 'nut_allergy', label: 'Nut allergy' },
  { key: 'dairy_free', label: 'Dairy-free' },
  { key: 'vegetarian', label: 'Vegetarian' },
  { key: 'vegan', label: 'Vegan' },
]

interface Props {
  household: Household
  member?: Member
  onSaved: (member: Member) => void
  onCancel: () => void
}

export default function MemberForm({ household, member, onSaved, onCancel }: Props) {
  const [name, setName] = useState(member?.name ?? '')
  const [phone, setPhone] = useState(member?.phone ?? '')
  const [flags, setFlags] = useState<DietaryFlags>(member?.dietary_flags ?? {})
  const [smsEnabled, setSmsEnabled] = useState(member?.sms_enabled ?? false)
  const [notes, setNotes] = useState(member?.notes ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  function toggleFlag(key: keyof DietaryFlags) {
    setFlags((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    setError('')

    const payload = {
      household_id: household.id,
      name: name.trim(),
      phone: phone.trim() || null,
      dietary_flags: flags,
      sms_enabled: smsEnabled,
      notes: notes.trim() || null,
    }

    if (member) {
      const { data, error } = await supabase
        .from('members')
        .update(payload)
        .eq('id', member.id)
        .select()
        .single()
      if (error) { setError(error.message); setSaving(false); return }
      onSaved(data as Member)
    } else {
      const { data, error } = await supabase
        .from('members')
        .insert(payload)
        .select()
        .single()
      if (error) { setError(error.message); setSaving(false); return }
      onSaved(data as Member)
    }

    setSaving(false)
  }

  return (
    <div className="card mb-3 border-orange-200 bg-orange-50">
      <h3 className="font-semibold text-stone-700 mb-4">
        {member ? 'Edit member' : 'Add family member'}
      </h3>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="label">Name *</label>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sarah"
            required
          />
        </div>

        <div>
          <label className="label">Phone (for SMS reminders)</label>
          <input
            className="input"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 555 000 0000"
          />
        </div>

        <div>
          <label className="label">Dietary restrictions</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {DIETARY_OPTIONS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => toggleFlag(key)}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                  flags[key]
                    ? 'bg-green-700 text-white border-green-700'
                    : 'bg-white text-stone-600 border-stone-300 hover:border-green-500'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Notes (allergies, preferences)</label>
          <textarea
            className="input resize-none"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Hates mushrooms, loves spicy food"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={smsEnabled}
            onClick={() => setSmsEnabled((v) => !v)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              smsEnabled ? 'bg-green-600' : 'bg-stone-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow ${
                smsEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className="text-sm text-stone-700">
            SMS dinner reminders{' '}
            <span className="text-stone-400">(enabled in Phase 5)</span>
          </span>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-2">
          <button type="submit" className="btn-primary flex-1" disabled={saving}>
            {saving ? 'Saving…' : member ? 'Save changes' : 'Add member'}
          </button>
          <button type="button" className="btn-ghost" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
