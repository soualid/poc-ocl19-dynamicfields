import type { FieldProps } from '../../types'

export default function SelectField({ definition, value, onChange, error }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {definition.field_label}
        {definition.is_required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        value={(value as string) || ''}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border rounded px-3 py-2 text-sm ${error ? 'border-red-500' : 'border-gray-300'}`}
      >
        <option value="">-- Selectionnez --</option>
        {(definition.options || []).map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}
