import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'
import { 
  FaChevronDown, FaChevronUp, FaExternalLinkAlt, 
  FaPlus, FaTrash, FaTimes, FaTv, FaPlay 
} from 'react-icons/fa'

const AnimeLinksPage = () => {
  const { user } = useAuth()
  const [grouped, setGrouped] = useState({})
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState({})
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ animeTitle: '', episodeNumber: '', link: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchLinks() }, [])

  const fetchLinks = async () => {
    try {
      const { data } = await api.get('/animelinks')
      setGrouped(data)
      const keys = Object.keys(data)
      if (keys.length > 0) setExpanded({ [keys[0]]: true })
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
    } catch {
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
      <div className="min-h-screen bg-black flex items-center justify-center text-gray-400">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-10 py-10 overflow-x-hidden">

      {/* HEADER */}
      <div className="relative mb-14 text-center">
        <div className="absolute inset-0 blur-3xl opacity-20 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>

        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-white/5 border border-white/10 shadow-lg">
            <FaTv className="text-3xl text-purple-400" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-wide">
            Anime <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Links</span>
          </h1>

          <p className="text-gray-400 max-w-xl">
            Your centralized directory for high-quality episode streaming links across the web.
          </p>

          {user?.role === 'admin' && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 transition-all shadow-lg shadow-purple-500/30"
            >
              <FaPlus /> Contribute Link
            </button>
          )}
        </div>
      </div>

      {/* CONTENT */}
      {animeList.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">
          <FaTv className="text-5xl mx-auto mb-4 opacity-40" />
          <h2 className="text-xl font-semibold">No Links Available</h2>
          <p>The directory is currently empty.</p>
        </div>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">

          {animeList.map(([animeTitle, episodes], index) => (
            <div
              key={animeTitle}
              className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden hover:border-purple-500/40 transition-all"
            >

              {/* HEADER */}
              <button
                onClick={() => toggleExpand(animeTitle)}
                className="w-full flex justify-between items-center p-5 hover:bg-white/5 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-purple-500/10">
                    <FaTv className="text-purple-400" />
                  </div>

                  <div className="text-left">
                    <h2 className="text-lg font-semibold">{animeTitle}</h2>
                    <p className="text-sm text-gray-400">
                      {episodes.length} EPISODE{episodes.length !== 1 ? 'S' : ''}
                    </p>
                  </div>
                </div>

                <FaChevronDown
                  className={`transition-transform ${expanded[animeTitle] ? 'rotate-180 text-purple-400' : ''}`}
                />
              </button>

              {/* EPISODES */}
              <div
                className={`transition-all duration-500 ${
                  expanded[animeTitle] ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                } overflow-hidden`}
              >
                <div className="p-4 grid gap-3">

                  {episodes.map((ep, idx) => (
                    <div
                      key={ep._id}
                      className="flex justify-between items-center p-4 rounded-xl bg-black/60 border border-white/5 hover:border-purple-500/40 hover:scale-[1.02] transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-bold">
                          {ep.episodeNumber || idx + 1}
                        </div>

                        <div>
                          <p className="font-medium">
                            Episode {ep.episodeNumber || idx + 1}
                          </p>
                          <a
                            href={ep.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-gray-400 hover:text-purple-400 transition"
                          >
                            {new URL(ep.link).hostname}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <a
                          href={ep.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 transition"
                          title="Watch Episode"
                        >
                          <FaPlay />
                        </a>

                        {user?.role === 'admin' && (
                          <button
                            onClick={() => handleDelete(ep._id)}
                            className="p-3 rounded-lg bg-red-600/20 hover:bg-red-600/40 transition"
                          >
                            <FaTrash />
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

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center px-4">

          <div className="absolute inset-0" onClick={() => setShowForm(false)} />

          <div className="relative w-full max-w-lg bg-black border border-white/10 rounded-2xl p-6 shadow-2xl">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FaLink /> New Source Link
              </h2>

              <button onClick={() => setShowForm(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">

              <input
                type="text"
                placeholder="Anime Title"
                value={form.animeTitle}
                onChange={e => setForm({ ...form, animeTitle: e.target.value })}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 outline-none"
                required
              />

              <input
                type="number"
                placeholder="Episode #"
                value={form.episodeNumber}
                onChange={e => setForm({ ...form, episodeNumber: e.target.value })}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 outline-none"
              />

              <input
                type="url"
                placeholder="Streaming URL"
                value={form.link}
                onChange={e => setForm({ ...form, link: e.target.value })}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 outline-none"
                required
              />

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-[1.02] transition-all"
              >
                {saving ? 'Processing...' : 'Publish Link'}
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}

// icon fallback
const FaLink = (props) => <svg {...props} viewBox="0 0 512 512"><path d="M326.612 185.391..." /></svg>

export default AnimeLinksPage