import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'
import { FaChevronDown, FaChevronUp, FaExternalLinkAlt, FaPlus, FaTrash, FaTimes, FaTv, FaPlay } from 'react-icons/fa'

const AnimeLinksPage = () => {
  const { user } = useAuth()
  const [grouped, setGrouped] = useState({})
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState({})
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ animeTitle: '', episodeNumber: '', link: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchLinks()
  }, [])

  const fetchLinks = async () => {
    try {
      const { data } = await api.get('/animelinks')
      setGrouped(data)
      const keys = Object.keys(data)
      if (keys.length> 0) setExpanded({ [keys[0]]: true })
    } catch {
      console.error('Error fetching anime links')
    } finally {
      setLoading(false)
    }
  }

  const toggleExpand = (title) => {
    setExpanded(prev => ({ ...prev, [title]: !prev[title] }))
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this episode link?')) return
    try {
      await api.delete(`/animelinks/${id}`)
      toast.success('Link deleted')
      fetchLinks()
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.animeTitle || !form.link) return
    setSaving(true)
    try {
      await api.post('/animelinks', form)
      toast.success('Episode link added!')
      setForm({ animeTitle: '', episodeNumber: '', link: '' })
      setShowForm(false)
      fetchLinks()
    } catch {
      toast.error('Failed to add link')
    } finally {
      setSaving(false)
    }
  }

  const animeList = Object.entries(grouped)

  if (loading) {
    return (
      <div>
        <div></div>
      </div>
    )
  }

  return (
    <div>
      <div>
      {/* Header */}
      <div>
        <div></div>
        <div>
          <div>
            <div><FaTv  /></div>
          </div>
          
          <h1>
            Anime <span>Links</span>
          </h1>
          <p>
            Your centralized directory for high-quality episode streaming links across the web.
          </p>

          {user?.role === 'admin' && (
            <button onClick={() => setShowForm(true)}>
              <FaPlus /> Contribute Link
            </button>
          )}
        </div>
      </div>

      {/* Anime List */}
      <div>
        {animeList.length === 0 ? (
          <div>
            <FaTv  />
            <h2>No Links Available</h2>
            <p>The directory is currently empty.</p>
          </div>
        ) : (
          <div>
            {animeList.map(([animeTitle, episodes], index) => (
              <div key={animeTitle} 
                
                style={{ animationDelay: `${0.1 * index}s`, animationFillMode: 'forwards' }}>
                {/* Accordion Header */}
                <button onClick={() => toggleExpand(animeTitle)}>
                  <div>
                    <div>
                      <FaTv  />
                    </div>
                    <div>
                      <h2>{animeTitle}</h2>
                      <p>{episodes.length} EPISODE{episodes.length !== 1 ? 'S' : ''}</p>
                    </div>
                  </div>
                  <div>
                    <FaChevronDown />
                  </div>
                </button>

                {/* Episode List */}
                <div>
                  <div>
                    {episodes.map((ep, idx) => (
                      <div key={ep._id}>
                        <div>
                          <div>
                            <span>
                              {ep.episodeNumber || idx + 1}
                            </span>
                          </div>
                          <div>
                            <p>Episode {ep.episodeNumber || idx + 1}</p>
                            <a href={ep.link} target="_blank" rel="noreferrer">
                              {new URL(ep.link).hostname}
                            </a>
                          </div>
                        </div>
                        <div>
                          <a href={ep.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            
                            title="Watch Episode">
                            <FaPlay  />
                          </a>
                          {user?.role === 'admin' && (
                            <button onClick={() => handleDelete(ep._id)}
                              
                              title="Delete Link">
                              <FaTrash  />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Link Modal */}
      {showForm && (
        <div>
          <div>
            <div></div>
            
            <div>
              <h2>
                <FaLink  /> New Source Link
              </h2>
              <button onClick={() => setShowForm(false)}>
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleAdd}>
              <div>
                <label>Anime Title <span>*</span></label>
                <input type="text"
                  value={form.animeTitle}
                  onChange={e => setForm({ ...form, animeTitle: e.target.value })}
                  placeholder="e.g. Naruto Shippuden"
                  
                  required
                />
              </div>
              <div>
                <div>
                  <label>Episode #</label>
                  <input type="number"
                    value={form.episodeNumber}
                    onChange={e => setForm({ ...form, episodeNumber: e.target.value })}
                    placeholder="e.g. 1"
                    min="1"
                    
                  />
                </div>
              </div>
              <div>
                <label>Streaming URL <span>*</span></label>
                <input type="url"
                  value={form.link}
                  onChange={e => setForm({ ...form, link: e.target.value })}
                  placeholder="https://crunchyroll.com/..."
                  
                  required
                />
              </div>
              <button type="submit"
                disabled={saving}>
                {saving ? 'Processing...' : 'Publish Link'}
              </button>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

// Quick component for unimported icon FaLink since we used it up there
const FaLink = ({ className }) => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512"  height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M326.612 185.391c59.747 59.809 58.927 155.698.36 214.59-.11.12-.24.25-.36.37l-67.2 67.2c-59.27 59.27-155.699 59.262-214.96 0-59.27-59.26-59.27-155.7 0-214.96l37.106-37.106c9.84-9.84 26.786-3.3 27.294 10.606.648 17.722 3.826 35.527 9.69 52.721 1.986 5.822.567 12.262-3.783 16.612l-13.087 13.087c-28.026 28.026-28.905 73.66-1.155 101.96 28.024 28.579 74.086 28.749 102.325.51l67.2-67.19c28.191-28.191 28.073-73.757 0-101.83-3.701-3.694-7.429-6.564-10.341-8.569a16.037 16.037 0 0 1-6.947-12.606c-.396-10.567 3.348-21.456 11.698-29.806l21.054-21.055c5.521-5.521 14.182-6.199 20.584-1.731a152.482 152.482 0 0 1 20.522 17.197zM467.547 44.449c-59.261-59.262-155.69-59.27-214.96 0l-67.2 67.2c-.12.12-.25.25-.36.37-58.566 58.892-59.387 154.781.36 214.59a152.454 152.454 0 0 0 20.521 17.196c6.402 4.468 15.064 3.789 20.584-1.731l21.054-21.055c8.35-8.35 12.094-19.239 11.698-29.806a16.037 16.037 0 0 0-6.947-12.606c-2.912-2.005-6.64-4.875-10.341-8.569-28.073-28.073-28.191-73.639 0-101.83l67.2-67.19c28.239-28.239 74.3-28.069 102.325.51 27.75 28.3 26.872 73.934-1.155 101.96l-13.087 13.087c-4.35 4.35-5.769 10.79-3.783 16.612 5.864 17.194 9.042 34.999 9.69 52.721.509 13.906 17.454 20.446 27.294 10.606l37.106-37.106c59.271-59.259 59.271-155.699.001-214.959z"></path></svg>

export default AnimeLinksPage