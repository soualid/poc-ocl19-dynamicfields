import { useState } from 'react'
import api from '../api/client'
import type { FieldDefinition, SelectOption } from '../types'

function parseJsonField<T>(val: unknown): T | null {
  if (val === null || val === undefined) return null
  if (typeof val === 'string') { try { return JSON.parse(val) } catch { return null } }
  return val as T
}

const FIELD_TYPES = [
  { value: 'text', label: 'Texte' },
  { value: 'number', label: 'Nombre' },
  { value: 'date', label: 'Date' },
  { value: 'boolean', label: 'Booleen' },
  { value: 'select', label: 'Liste deroulante' },
] as const

interface Props {
  templateId: number
  initialFields: FieldDefinition[]
  onSaved: () => void
}

export default function FieldDefinitionEditor({ templateId, initialFields, onSaved }: Props) {
  const [fields, setFields] = useState<FieldDefinition[]>(() =>
    initialFields.map((f) => ({
      ...f,
      options: parseJsonField<SelectOption[]>(f.options),
      validation_rules: parseJsonField<Record<string, unknown>>(f.validation_rules),
    }))
  )
  const [saving, setSaving] = useState(false)

  const addField = () => {
    setFields([
      ...fields,
      {
        field_name: '',
        field_label: '',
        field_type: 'text',
        validation_rules: null,
        options: null,
        sort_order: fields.length,
        is_required: false,
      },
    ])
  }

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index))
  }

  const updateField = (index: number, updates: Partial<FieldDefinition>) => {
    setFields(fields.map((f, i) => (i === index ? { ...f, ...updates } : f)))
  }

  const moveField = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= fields.length) return
    const next = [...fields]
    ;[next[index], next[target]] = [next[target], next[index]]
    next.forEach((f, i) => (f.sort_order = i))
    setFields(next)
  }

  const updateOption = (fieldIndex: number, optionIndex: number, key: keyof SelectOption, value: string) => {
    const field = fields[fieldIndex]
    const options = [...(field.options || [])]
    options[optionIndex] = { ...options[optionIndex], [key]: value }
    updateField(fieldIndex, { options })
  }

  const addOption = (fieldIndex: number) => {
    const field = fields[fieldIndex]
    updateField(fieldIndex, { options: [...(field.options || []), { value: '', label: '' }] })
  }

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    const field = fields[fieldIndex]
    updateField(fieldIndex, { options: (field.options || []).filter((_, i) => i !== optionIndex) })
  }

  const save = async () => {
    setSaving(true)
    try {
      await api.put(`/form-templates/${templateId}/field-definitions/bulk`, {
        fields: fields.map((f, i) => ({ ...f, sort_order: i })),
      })
      onSaved()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Definition des champs</h2>
        <button
          onClick={addField}
          className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700"
        >
          + Ajouter un champ
        </button>
      </div>

      {fields.length === 0 && (
        <p className="text-gray-500 text-sm">Aucun champ defini. Ajoutez-en un.</p>
      )}

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={index} className="border border-gray-200 rounded p-3">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-gray-400 w-6">#{index + 1}</span>
              <button onClick={() => moveField(index, -1)} disabled={index === 0} className="text-xs text-gray-400 hover:text-gray-600 disabled:opacity-30">↑</button>
              <button onClick={() => moveField(index, 1)} disabled={index === fields.length - 1} className="text-xs text-gray-400 hover:text-gray-600 disabled:opacity-30">↓</button>
              <div className="flex-1" />
              <button onClick={() => removeField(index)} className="text-red-500 hover:text-red-700 text-xs">Supprimer</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nom technique</label>
                <input
                  type="text"
                  value={field.field_name}
                  onChange={(e) => updateField(index, { field_name: e.target.value })}
                  placeholder="field_name"
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Label</label>
                <input
                  type="text"
                  value={field.field_label}
                  onChange={(e) => updateField(index, { field_label: e.target.value })}
                  placeholder="Label affiche"
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                <select
                  value={field.field_type}
                  onChange={(e) => updateField(index, { field_type: e.target.value as FieldDefinition['field_type'], options: e.target.value === 'select' ? [{ value: '', label: '' }] : null })}
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                >
                  {FIELD_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={field.is_required}
                    onChange={(e) => updateField(index, { is_required: e.target.checked })}
                  />
                  Obligatoire
                </label>
              </div>
            </div>

            {field.field_type === 'select' && (
              <div className="mt-3 pl-6">
                <label className="block text-xs font-medium text-gray-600 mb-1">Options</label>
                {(field.options || []).map((opt, optIdx) => (
                  <div key={optIdx} className="flex gap-2 mb-1">
                    <input
                      type="text"
                      value={opt.value}
                      onChange={(e) => updateOption(index, optIdx, 'value', e.target.value)}
                      placeholder="Valeur"
                      className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs"
                    />
                    <input
                      type="text"
                      value={opt.label}
                      onChange={(e) => updateOption(index, optIdx, 'label', e.target.value)}
                      placeholder="Label"
                      className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs"
                    />
                    <button onClick={() => removeOption(index, optIdx)} className="text-red-400 hover:text-red-600 text-xs">x</button>
                  </div>
                ))}
                <button onClick={() => addOption(index)} className="text-blue-600 text-xs hover:underline">+ Option</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {fields.length > 0 && (
        <button
          onClick={save}
          disabled={saving}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Sauvegarde...' : 'Sauvegarder les champs'}
        </button>
      )}
    </div>
  )
}
