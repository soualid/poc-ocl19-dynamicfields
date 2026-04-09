import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/client'
import type { FormTemplate } from '../types'
import FieldDefinitionEditor from '../components/FieldDefinitionEditor'

export default function TemplateEditPage() {
  const { id } = useParams<{ id: string }>()
  const [template, setTemplate] = useState<FormTemplate | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const fetchTemplate = async () => {
    const { data } = await api.get(`/form-templates/${id}`)
    setTemplate(data)
    setName(data.name)
    setDescription(data.description || '')
  }

  useEffect(() => { fetchTemplate() }, [id])

  const saveTemplate = async (e: React.FormEvent) => {
    e.preventDefault()
    await api.put(`/form-templates/${id}`, { name, description })
    fetchTemplate()
  }

  if (!template) return <p className="text-gray-500">Chargement...</p>

  return (
    <div>
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
        <Link to="/" className="hover:text-gray-700">Templates</Link>
        <span>/</span>
        <span className="text-gray-800">{template.name}</span>
      </div>

      <form onSubmit={saveTemplate} className="bg-white rounded shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Informations du template</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
        >
          Sauvegarder
        </button>
      </form>

      <FieldDefinitionEditor
        templateId={template.id}
        initialFields={template.field_definitions || []}
        onSaved={fetchTemplate}
      />

      <div className="mt-4">
        <Link
          to={`/templates/${id}/entities`}
          className="text-blue-600 hover:underline text-sm"
        >
          Voir les donnees soumises →
        </Link>
      </div>
    </div>
  )
}
