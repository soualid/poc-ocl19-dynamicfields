import type { FieldProps } from '../../types'

export default function NumberField({ definition, value, onChange, error }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {definition.field_label}
        {definition.is_required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="number"
        value={value === '' || value === null || value === undefined ? '' : String(value)}
        onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        className={`w-full border rounded px-3 py-2 text-sm ${error ? 'border-red-500' : 'border-gray-300'}`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}
