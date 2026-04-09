import type { FieldProps } from '../../types'

export default function BooleanField({ definition, value, onChange, error }: FieldProps) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          className="rounded border-gray-300"
        />
        {definition.field_label}
        {definition.is_required && <span className="text-red-500">*</span>}
      </label>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}
