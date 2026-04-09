import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import type { FormTemplate } from '../types'

export default function TemplateListPage() {
  const [templates, setTemplates] = useState<FormTemplate[]>([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchTemplates = async () => {
    const { data } = await api.get('/form-templates')
    setTemplates(data)
    setLoading(false)
  }

  useEffect(() => { fetchTemplates() }, [])

  const createTemplate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    await api.post('/form-templates', { name })
    setName('')
    fetchTemplates()
  }

  const deleteTemplate = async (id: number) => {
    await api.delete(`/form-templates/${id}`)
    fetchTemplates()
  }

  if (loading) return <p className="text-gray-500">Chargement...</p>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Templates de formulaires</h1>

      <form onSubmit={createTemplate} className="flex gap-2 mb-6">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom du template"
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
        >
          Creer
        </button>
      </form>

      {templates.length === 0 ? (
        <p className="text-gray-500">Aucun template. Creez-en un ci-dessus.</p>
      ) : (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Nom</th>
                <th className="text-left px-4 py-3 font-medium">Statut</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((t) => (
                <tr key={t.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <Link to={`/templates/${t.id}`} className="text-blue-600 hover:underline">
                      {t.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded ${t.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {t.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Link
                      to={`/templates/${t.id}/entities`}
                      className="text-gray-600 hover:text-gray-800 text-xs"
                    >
                      Donnees
                    </Link>
                    <button
                      onClick={() => deleteTemplate(t.id)}
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
