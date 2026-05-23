'use client'

import type { Member, DietaryFlags } from '@/lib/types'
import { useState } from 'react'

const FLAG_LABELS: Record<keyof DietaryFlags, string> = {
  gluten_free: 'GF',
  nut_allergy: 'Nuts',
  dairy_free: 'Dairy-free',
  vegetarian: 'Veg',
  vegan: 'Vegan',
}

interface Props {
  member: Member
  onEdit: () => void
  onDelete: () => void
}

export default function MemberCard({ member, onEdit, onDelete }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  const activeFlags = Object.entries(member.dietary_flags ?? {})
    .filter(([, v]) => v)
    .map(([k]) => FLAG_LABELS[k as keyof DietaryFlags])

  return (
    <div className="card flex items-start gap-3">
      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-lg font-bold text-green-700 shrink-0">
        {member.name.charAt(0).toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-stone-800">{member.name}</span>
          {member.sms_enabled && (
            <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
              SMS
            </span>
          )}
        </div>

        {activeFlags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {activeFlags.map((flag) => (
              <span
                key={flag}
                className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full"
              >
                {flag}
              </span>
            ))}
          </div>
        )}

        {member.phone && (
          <p className="text-xs text-stone-400 mt-1">{member.phone}</p>
        )}

        {member.notes && (
          <p className="text-xs text-stone-500 mt-1 truncate">{member.notes}</p>
        )}
      </div>

      <div className="flex flex-col gap-1 shrink-0">
        <button
          className="text-xs text-orange-500 hover:underline"
          onClick={onEdit}
        >
          Edit
        </button>
        {confirmDelete ? (
          <div className="flex gap-1">
            <button
              className="text-xs text-red-500 hover:underline"
              onClick={onDelete}
            >
              Confirm
            </button>
            <button
              className="text-xs text-stone-400 hover:underline"
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            className="text-xs text-stone-400 hover:text-red-400"
            onClick={() => setConfirmDelete(true)}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  )
}
