import { useState, useEffect } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { 
  FaFilePdf, FaImage, FaLink, FaCode, FaTrash, FaEdit, FaPlus, FaTimes, FaEye 
} from 'react-icons/fa'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const MangaManagement = () => {
  const [chapters, setChapters] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingChapter, setEditingChapter] = useState(null)
  const [formData, setFormData] = useState({
    title: '', description: '', animeName: '', type: 'link',
    externalLink: '', htmlEmbed: '', order: 0, status: 'draft'
  })
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => { fetchChapters() }, [])

  const fetchChapters = async () => {
    try {
      let data
      try { const res = await api.get('/manga/all'); data = res.data } 
      catch { const res = await api.get('/manga?limit=200'); data = res.data }
      setChapters(data)
    } catch { toast.error('Failed to fetch chapters') }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingChapter(null)
    setFormData({ title: '', description: '', animeName: '', type: 'link', externalLink: '', htmlEmbed: '', order: 0, status: 'draft' })
    setUploadedFiles([])
  }

  const startEdit = (chapter) => {
    setEditingChapter(chapter)
    setFormData({
      title: chapter.title,
      description: chapter.description || '',
      animeName: chapter.animeName || '',
      type: chapter.type,
      externalLink: chapter.externalLink || '',
      htmlEmbed: chapter.htmlEmbed || '',
      order: chapter.order,
      status: chapter.status
    })
    setShowForm(true)
  }

  const typeIcon = (type) => {
    if (type === 'pdf') return <FaFilePdf className="text-red-400" />
    if (type === 'upload') return <FaImage className="text-blue-400" />
    if (type === 'html') return <FaCode className="text-purple-400" />
    return <FaLink className="text-green-400" />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)
    try {
      const fd = new FormData()
      Object.entries(formData).forEach(([key, value]) => fd.append(key, value))
      uploadedFiles.forEach(file => fd.append('contentFiles', file))

      if (editingChapter) await api.put(`/manga/${editingChapter._id}`, fd)
      else await api.post('/manga', fd)

      toast.success(editingChapter ? 'Chapter updated!' : 'Chapter created!')
      resetForm()
      fetchChapters()
    } catch (error) {
      toast.error('Failed to save: ' + (error.response?.data?.message || error.message))
    } finally { setUploading(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this chapter?')) return
    try { await api.delete(`/manga/${id}`); toast.success('Chapter deleted'); fetchChapters() } 
    catch { toast.error('Failed to delete') }
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-purple-400">Manga Chapters</h1>
        <button
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded shadow-lg transition-all"
          onClick={() => setShowForm(true)}>
          <FaPlus /> Add Chapter
        </button>
      </div>

      {/* Chapter List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chapters.map((chapter, idx) => (
          <div key={chapter._id} className="bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:scale-[1.02] transition-all duration-200">
            {/* Cover */}
            <div className="h-48 bg-gray-800 flex items-center justify-center overflow-hidden">
              {chapter.coverImage ? (
                <img
                  src={chapter.coverImage.startsWith('/') ? `${API_BASE}${chapter.coverImage}` : chapter.coverImage}
                  alt={chapter.title}
                  className="object-cover h-full w-full"
                />
              ) : <div className="text-gray-500">No Image</div>}
            </div>

            {/* Info */}
            <div className="p-4 space-y-2">
              <div className="flex justify-between items-center text-sm text-gray-400">
                <span>#{chapter.order || idx + 1}</span>
                {chapter.animeName && <span>{chapter.animeName}</span>}
                <span className={`px-2 py-1 rounded ${chapter.status === 'published' ? 'bg-green-600' : 'bg-yellow-600'}`}>
                  {chapter.status}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-purple-300">{chapter.title}</h3>
              <div className="flex items-center justify-between text-sm text-gray-400 mt-2">
                <div className="flex items-center gap-2">{typeIcon(chapter.type)} <span>{chapter.type}</span></div>
                <div className="flex items-center gap-1"><FaEye /> {chapter.views}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 p-3 border-t border-gray-700">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 py-1 rounded text-white" onClick={() => startEdit(chapter)}>
                <FaEdit /> Edit
              </button>
              <button className="flex-1 bg-red-600 hover:bg-red-700 py-1 rounded text-white" onClick={() => handleDelete(chapter._id)}>
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 overflow-auto">
          <div className="bg-gray-900 rounded-lg max-w-3xl w-full p-6 relative space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-purple-400">
                {editingChapter ? '✏️ Edit Chapter' : '➕ New Chapter'}
              </h2>
              <button className="text-gray-300 hover:text-white" onClick={resetForm}><FaTimes /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full p-2 rounded bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block mb-1">Anime / Series Name</label>
                  <input
                    type="text"
                    value={formData.animeName}
                    onChange={e => setFormData({ ...formData, animeName: e.target.value })}
                    placeholder="e.g. Naruto"
                    className="w-full p-2 rounded bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows="2"
                  className="w-full p-2 rounded bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label>Content Type *</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    className="w-full p-2 rounded bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="link">External Link</option>
                    <option value="html">HTML / Iframe Embed</option>
                    <option value="upload">Upload (Images/PDF)</option>
                  </select>
                </div>
                <div>
                  <label>Chapter Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 rounded bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="0"
                  />
                </div>
                <div>
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-2 rounded bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              {/* Type-specific */}
              {formData.type === 'link' && (
                <div>
                  <label>External URL</label>
                  <input
                    type="url"
                    value={formData.externalLink}
                    onChange={e => setFormData({ ...formData, externalLink: e.target.value })}
                    placeholder="https://..."
                    className="w-full p-2 rounded bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}

              {formData.type === 'html' && (
                <div>
                  <label>HTML / Iframe Embed</label>
                  <textarea
                    value={formData.htmlEmbed}
                    onChange={e => setFormData({ ...formData, htmlEmbed: e.target.value })}
                    rows="5"
                    placeholder={'<iframe src="https://..." width="100%" height="600"></iframe>'}
                    className="w-full p-2 rounded bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}

              {formData.type === 'upload' && (
                <div>
                  <label>Upload Files</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={e => setUploadedFiles(Array.from(e.target.files))}
                    id="manga-files"
                    className="hidden"
                  />
                  <label htmlFor="manga-files" className="flex flex-col items-center justify-center border-2 border-dashed border-purple-500 p-6 rounded cursor-pointer hover:bg-purple-700 hover:text-white transition-all">
                    <div className="flex gap-2 text-purple-400 text-2xl"><FaImage /><FaFilePdf /></div>
                    <p>Click to select files (JPG, PNG, GIF, PDF)</p>
                    {uploadedFiles.length > 0 && <p className="text-green-400">✓ {uploadedFiles.length} file(s) selected</p>}
                  </label>
                </div>
              )}

              <div className="flex gap-4 justify-end mt-4">
                <button type="submit" disabled={uploading} className="bg-purple-600 hover:bg-purple-700 py-2 px-6 rounded text-white font-semibold transition-all">
                  {uploading ? 'Saving...' : (editingChapter ? 'Update Chapter' : 'Create Chapter')}
                </button>
                <button type="button" onClick={resetForm} className="bg-gray-700 hover:bg-gray-600 py-2 px-6 rounded text-white transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default MangaManagement