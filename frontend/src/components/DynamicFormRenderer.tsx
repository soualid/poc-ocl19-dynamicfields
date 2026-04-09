import { useMemo, useState } from 'react'
import type { FieldDefinition, SelectOption } from '../types'
import TextField from './fields/TextField'
import NumberField from './fields/NumberField'
import DateField from './fields/DateField'
import BooleanField from './fields/BooleanField'
import SelectField from './fields/SelectField'
import type { FieldProps } from '../types'

const fieldComponents: Record<string, React.FC<FieldProps>> = {
  text: TextField,
  number: NumberField,
  date: DateField,
  boolean: BooleanField,
  select: SelectField,
}

interface Props {
  fields: FieldDefinition[]
  initialData: Record<string, unknown>
  onSubmit: (data: Record<string, unknown>) => Promise<void>
}

function parseJsonField<T>(val: unknown): T | null {
  if (val === null || val === undefined) return null
  if (typeof val === 'string') { try { return JSON.parse(val) } catch { return null } }
  return val as T
}

export default function DynamicFormRenderer({ fields: rawFields, initialData, onSubmit }: Props) {
  const fields = useMemo(() => rawFields.map((f) => ({
    ...f,
    options: parseJsonField<SelectOption[]>(f.options),
    validation_rules: parseJsonField<Record<string, unknown>>(f.validation_rules),
  })), [rawFields])
  const [formData, setFormData] = useState<Record<string, unknown>>(() => {
    const data: Record<string, unknown> = {}
    fields.forEach((f) => {
      data[f.field_name] = initialData[f.field_name] ?? (f.field_type === 'boolean' ? false : '')
    })
    return data
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    fields.forEach((f) => {
      const val = formData[f.field_name]
      if (f.is_required && (val === '' || val === null || val === undefined)) {
        newErrors[f.field_name] = `${f.field_label} est obligatoire`
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await onSubmit(formData)
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const response = (err as { response?: { data?: { errors?: Record<string, string[]> } } }).response
        if (response?.data?.errors) {
          const serverErrors: Record<string, string> = {}
          Object.entries(response.data.errors).forEach(([key, msgs]) => {
            const fieldName = key.replace('data.', '')
            serverErrors[fieldName] = msgs[0]
          })
          setErrors(serverErrors)
        }
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (fieldName: string) => (value: unknown) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[fieldName]
      return next
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded shadow p-4 space-y-4">
      {fields.map((field) => {
        const Component = fieldComponents[field.field_type]
        if (!Component) return null
        return (
          <Component
            key={field.field_name}
            definition={field}
            value={formData[field.field_name]}
            onChange={handleChange(field.field_name)}
            error={errors[field.field_name]}
          />
        )
      })}

      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? 'Envoi...' : 'Soumettre'}
      </button>
    </form>
  )
}
