import { Routes, Route, Link } from 'react-router-dom'
import TemplateListPage from './pages/TemplateListPage'
import TemplateEditPage from './pages/TemplateEditPage'
import EntityListPage from './pages/EntityListPage'
import EntityFormPage from './pages/EntityFormPage'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <Link to="/" className="text-lg font-semibold text-gray-800 no-underline">
            Dynamic Fields POC
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<TemplateListPage />} />
          <Route path="/templates/:id" element={<TemplateEditPage />} />
          <Route path="/templates/:id/entities" element={<EntityListPage />} />
          <Route path="/templates/:id/entities/new" element={<EntityFormPage />} />
          <Route path="/entities/:id/edit" element={<EntityFormPage />} />
        </Routes>
      </main>
    </div>
  )
}
