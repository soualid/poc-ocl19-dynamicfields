import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api/client'
import type { FieldDefinition, Entity } from '../types'
import DynamicFormRenderer from '../components/DynamicFormRenderer'

export default function EntityFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [fields, setFields] = useState<FieldDefinition[]>([])
  const [templateId, setTemplateId] = useState<number | null>(null)
  const [initialData, setInitialData] = useState<Record<string, unknown>>({})
  const [entityId, setEntityId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      // Check if we're editing an entity or creating a new one
      const path = window.location.pathname
      if (path.includes('/entities/') && path.includes('/edit')) {
        // Edit mode: load entity
        const { data } = await api.get<Entity & { form_template: { id: number; field_definitions: FieldDefinition[] } }>(`/entities/${id}`)
        setFields(data.form_template.field_definitions)
        setTemplateId(data.form_template_id)
        setInitialData(data.data)
        setEntityId(data.id)
      } else {
        // Create mode: load template
        const { data } = await api.get(`/form-templates/${id}`)
        setFields(data.field_definitions || [])
        setTemplateId(data.id)
      }
      setLoading(false)
    }
    load()
  }, [id])

  const handleSubmit = async (formData: Record<string, unknown>) => {
    if (entityId) {
      await api.put(`/entities/${entityId}`, { data: formData })
    } else {
      await api.post(`/form-templates/${templateId}/entities`, { data: formData })
    }
    navigate(`/templates/${templateId}/entities`)
  }

  if (loading) return <p className="text-gray-500">Chargement...</p>

  return (
    <div>
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
        <Link to="/" className="hover:text-gray-700">Templates</Link>
        <span>/</span>
        <Link to={`/templates/${templateId}/entities`} className="hover:text-gray-700">Donnees</Link>
        <span>/</span>
        <span className="text-gray-800">{entityId ? 'Editer' : 'Nouveau'}</span>
      </div>

      <h1 className="text-2xl font-bold mb-6">
        {entityId ? 'Editer l\'entite' : 'Nouvelle soumission'}
      </h1>

      {fields.length === 0 ? (
        <p className="text-gray-500">Aucun champ defini pour ce template.</p>
      ) : (
        <DynamicFormRenderer
          fields={fields}
          initialData={initialData}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  )
}
