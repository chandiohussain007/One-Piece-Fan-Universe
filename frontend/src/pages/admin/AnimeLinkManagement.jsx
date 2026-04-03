import { useState, useEffect } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { FaPlus, FaTrash, FaTimes, FaTv, FaExternalLinkAlt } from 'react-icons/fa'

const AnimeLinkManagement = () => {
  const [grouped, setGrouped] = useState({})
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ animeTitle: '', episodeNumber: '', link: '' })
  const [saving, setSaving] = useState(false)
  const [expanded, setExpanded] = useState({})

  useEffect(() => { fetchLinks() }, [])

  const fetchLinks = async () => {
    try {
      const { data } = await api.get('/animelinks')
      setGrouped(data)
    } catch { toast.error('Failed to fetch') }
    finally { setLoading(false) }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post('/animelinks', form)
      toast.success('Link added!')
      setForm({ animeTitle: '', episodeNumber: '', link: '' })
      setShowForm(false)
      fetchLinks()
    } catch { toast.error('Failed to add') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this link?')) return
    try {
      await api.delete(`/animelinks/${id}`)
      toast.success('Deleted')
      fetchLinks()
    } catch { toast.error('Failed') }
  }

  const toggleExpand = (title) => setExpanded(prev => ({ ...prev, [title]: !prev[title] }))

  const animeList = Object.entries(grouped)
  const totalEpisodes = animeList.reduce((sum, [, eps]) => sum + eps.length, 0)

  return (
    <div>
      <div>
        <p>{animeList.length} anime series, {totalEpisodes} episode links</p>
        <button onClick={() => setShowForm(true)}>
          <FaPlus /> Add Episode Link
        </button>
      </div>

      {loading ? (
        <div>
          <div></div>
        </div>
      ) : animeList.length === 0 ? (
        <div>
          <FaTv  />
          <p>No links yet. Add the first one!</p>
        </div>
      ) : (
        <div>
          {animeList.map(([animeTitle, episodes]) => (
            <div key={animeTitle}>
              <button onClick={() => toggleExpand(animeTitle)}>
                <div>
                  <FaTv  />
                  <span>{animeTitle}</span>
                  <span>({episodes.length} eps)</span>
                </div>
                <span>{expanded[animeTitle] ? '▴' : '▾'}</span>
              </button>
              {expanded[animeTitle] && (
                <div>
                  {episodes.map(ep => (
                    <div key={ep._id}>
                      <span>Ep{ep.episodeNumber || '?'}</span>
                      <span>{ep.link}</span>
                      <a href={ep.link}
                        target="_blank"
                        rel="noopener noreferrer">
                        <FaExternalLinkAlt  />
                      </a>
                      <button onClick={() => handleDelete(ep._id)}>
                        <FaTrash  />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div>
          <div>
            <div>
              <h2>Add Episode Link</h2>
              <button onClick={() => setShowForm(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handleAdd}>
              <div>
                <label>Anime Title *</label>
                <input type="text"
                  value={form.animeTitle}
                  onChange={e => setForm({ ...form, animeTitle: e.target.value })}
                  placeholder="e.g. Attack on Titan"
                  
                  required
                />
              </div>
              <div>
                <label>Episode Number</label>
                <input type="number"
                  value={form.episodeNumber}
                  onChange={e => setForm({ ...form, episodeNumber: e.target.value })}
                  placeholder="1"
                  min="1"
                  
                />
              </div>
              <div>
                <label>Link *</label>
                <input type="url"
                  value={form.link}
                  onChange={e => setForm({ ...form, link: e.target.value })}
                  placeholder="https://..."
                  
                  required
                />
              </div>
              <button type="submit"
                disabled={saving}>
                {saving ? 'Adding...' : 'Add Link'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnimeLinkManagement
