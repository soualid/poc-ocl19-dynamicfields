import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/client'
import type { Entity, FieldDefinition } from '../types'

export default function EntityListPage() {
  const { id } = useParams<{ id: string }>()
  const [entities, setEntities] = useState<Entity[]>([])
  const [fields, setFields] = useState<FieldDefinition[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    const { data } = await api.get(`/form-templates/${id}/entities`)
    setEntities(data.entities)
    setFields(data.field_definitions)
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [id])

  const deleteEntity = async (entityId: number) => {
    await api.delete(`/entities/${entityId}`)
    fetchData()
  }

  if (loading) return <p className="text-gray-500">Chargement...</p>

  return (
    <div>
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
        <Link to="/" className="hover:text-gray-700">Templates</Link>
        <span>/</span>
        <Link to={`/templates/${id}`} className="hover:text-gray-700">Editer</Link>
        <span>/</span>
        <span className="text-gray-800">Donnees</span>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Donnees soumises</h1>
        <Link
          to={`/templates/${id}/entities/new`}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 no-underline"
        >
          Nouveau formulaire
        </Link>
      </div>

      {entities.length === 0 ? (
        <p className="text-gray-500">Aucune donnee soumise.</p>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium">#</th>
                {fields.map((f) => (
                  <th key={f.field_name} className="text-left px-4 py-3 font-medium">
                    {f.field_label}
                  </th>
                ))}
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entities.map((entity) => (
                <tr key={entity.id} className="border-b last:border-0">
                  <td className="px-4 py-3 text-gray-400">{entity.id}</td>
                  {fields.map((f) => (
                    <td key={f.field_name} className="px-4 py-3">
                      {formatValue(entity.data[f.field_name], f.field_type)}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right space-x-2">
                    <Link
                      to={`/entities/${entity.id}/edit`}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      Editer
                    </Link>
                    <button
                      onClick={() => deleteEntity(entity.id)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function formatValue(value: unknown, type: string): string {
  if (value === null || value === undefined) return '-'
  if (type === 'boolean') return value ? 'Oui' : 'Non'
  return String(value)
}
