import { useState, useEffect } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { FaFilePdf, FaImage, FaLink, FaCode, FaTrash, FaEdit, FaPlus, FaTimes, FaEye } from 'react-icons/fa'

const API_BASE = 'http://localhost:5000'

const MangaManagement = () => {
  const [chapters, setChapters] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingChapter, setEditingChapter] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    animeName: '',
    type: 'link',
    externalLink: '',
    htmlEmbed: '',
    order: 0,
    status: 'draft'
  })
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => { fetchChapters() }, [])

  const fetchChapters = async () => {
    try {
      // Try admin endpoint first, fall back to public
      let data
      try {
        const res = await api.get('/manga/all')
        data = res.data
      } catch {
        const res = await api.get('/manga?limit=200')
        data = res.data
      }
      setChapters(data)
    } catch (error) {
      toast.error('Failed to fetch chapters')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('title', formData.title)
      fd.append('description', formData.description)
      fd.append('animeName', formData.animeName)
      fd.append('type', formData.type)
      fd.append('externalLink', formData.externalLink)
      fd.append('htmlEmbed', formData.htmlEmbed)
      fd.append('order', formData.order)
      fd.append('status', formData.status)
      uploadedFiles.forEach(file => fd.append('contentFiles', file))

      if (editingChapter) {
        await api.put(`/manga/${editingChapter._id}`, fd)
        toast.success('Chapter updated!')
      } else {
        await api.post('/manga', fd)
        toast.success('Chapter created!')
      }
      resetForm()
      fetchChapters()
    } catch (error) {
      toast.error('Failed to save: ' + (error.response?.data?.message || error.message))
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this chapter?')) return
    try {
      await api.delete(`/manga/${id}`)
      toast.success('Chapter deleted')
      fetchChapters()
    } catch { toast.error('Failed to delete') }
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
    if (type === 'pdf') return <FaFilePdf  />
    if (type === 'upload') return <FaImage  />
    if (type === 'html') return <FaCode  />
    return <FaLink  />
  }

  return (
    <div>
      <div>
        <p>{chapters.length} chapter{chapters.length !== 1 ? 's' : ''} total</p>
        <button onClick={() => setShowForm(true)}>
          <FaPlus /> Add Chapter
        </button>
      </div>

      {/* Chapter List */}
      <div>
        {chapters.map((chapter, idx) => (
          <div key={chapter._id}>
            {/* Cover */}
            <div>
              {chapter.coverImage ? (
                <img src={chapter.coverImage.startsWith('/') ? `${API_BASE}${chapter.coverImage}` : chapter.coverImage}
                  alt=""
                  
                />
              ) : (
                <div>No img</div>
              )}
            </div>

            {/* Info */}
            <div>
              <div>
                <span>#{chapter.order || idx + 1}</span>
                {chapter.animeName && (
                  <span>{chapter.animeName}</span>
                )}
                <span>{chapter.status}</span>
              </div>
              <h3>{chapter.title}</h3>
              <div>
                {typeIcon(chapter.type)}
                <span>{chapter.type}</span>
                <span>
                  <FaEye  /> {chapter.views}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div>
              <button onClick={() => startEdit(chapter)}>
                <FaEdit  />
              </button>
              <button onClick={() => handleDelete(chapter._id)}>
                <FaTrash  />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showForm && (
        <div>
          <div>
            <div>
              <h2>
                {editingChapter ? '✏️ Edit Chapter' : '➕ New Chapter'}
              </h2>
              <button onClick={resetForm}><FaTimes /></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div>
                <div>
                  <label>Title *</label>
                  <input type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    
                    required
                  />
                </div>
                <div>
                  <label>Anime / Series Name</label>
                  <input type="text"
                    value={formData.animeName}
                    onChange={e => setFormData({ ...formData, animeName: e.target.value })}
                    placeholder="e.g. Naruto"
                    
                  />
                </div>
              </div>

              <div>
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  
                  rows="2"
                />
              </div>

              <div>
                <div>
                  <label>Content Type *</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}>
                    <option value="link">External Link</option>
                    <option value="html">HTML / Iframe Embed</option>
                    <option value="upload">Upload (Images + PDFs)</option>
                  </select>
                </div>
                <div>
                  <label>Chapter Order</label>
                  <input type="number"
                    value={formData.order}
                    onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    
                    min="0"
                  />
                </div>
                <div>
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              {/* Type-specific fields */}
              {formData.type === 'link' && (
                <div>
                  <label>External URL</label>
                  <input type="url"
                    value={formData.externalLink}
                    onChange={e => setFormData({ ...formData, externalLink: e.target.value })}
                    placeholder="https://..."
                    
                  />
                  <p>Will show the link in an embedded iframe on the site</p>
                </div>
              )}

              {formData.type === 'html' && (
                <div>
                  <label>HTML / Iframe Embed Code</label>
                  <textarea
                    value={formData.htmlEmbed}
                    onChange={e => setFormData({ ...formData, htmlEmbed: e.target.value })}
                    
                    rows="5"
                    placeholder={'<iframe src="https://..." width="100%" height="600"></iframe>'}
                  />
                  <p>⚡ This renders the embed code in a secure sandboxed iframe on the site</p>
                </div>
              )}

              {formData.type === 'upload' && (
                <div>
                  <label>Upload Files</label>
                  <div>
                    <input type="file"
                      multiple
                      accept="image/*,.pdf"
                      onChange={e => setUploadedFiles(Array.from(e.target.files))}
                      
                      id="manga-files"
                    />
                    <label htmlFor="manga-files">
                      <div>
                        <FaImage  />
                        <FaFilePdf  />
                      </div>
                      <p>Click to select files</p>
                      <p>Supports JPG, PNG, GIF, PDF — up to 50MB each</p>
                    </label>
                    {uploadedFiles.length> 0 && (
                      <p>
                        ✓ {uploadedFiles.length} file(s) selected
                      </p>
                    )}
                  </div>
                  {editingChapter?.contentFiles?.length> 0 && (
                    <p>
                      Currently has {editingChapter.contentFiles.length} file(s). New uploads will be appended.
                    </p>
                  )}
                </div>
              )}

              <div>
                <button type="submit"
                  disabled={uploading}>
                  {uploading ? 'Saving...' : (editingChapter ? 'Update Chapter' : 'Create Chapter')}
                </button>
                <button type="button"
                  onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default MangaManagement