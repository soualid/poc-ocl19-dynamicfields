import type { FieldProps } from '../../types'

export default function DateField({ definition, value, onChange, error }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {definition.field_label}
        {definition.is_required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="date"
        value={(value as string) || ''}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border rounded px-3 py-2 text-sm ${error ? 'border-red-500' : 'border-gray-300'}`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}
