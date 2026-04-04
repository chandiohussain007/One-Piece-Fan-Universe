import { useState, useEffect } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { FaPlus, FaTrash, FaTimes, FaTv, FaExternalLinkAlt, FaChevronDown } from 'react-icons/fa'

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
    } catch {
      toast.error('Failed to fetch')
    } finally {
      setLoading(false)
    }
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
    } catch {
      toast.error('Failed to add')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this link?')) return
    try {
      await api.delete(`/animelinks/${id}`)
      toast.success('Deleted')
      fetchLinks()
    } catch {
      toast.error('Failed')
    }
  }

  const toggleExpand = (title) =>
    setExpanded(prev => ({ ...prev, [title]: !prev[title] }))

  const animeList = Object.entries(grouped)
  const totalEpisodes = animeList.reduce((sum, [, eps]) => sum + eps.length, 0)

  return (
    <div className="space-y-6 text-white">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

        <p className="text-gray-400 text-sm">
          {animeList.length} series • {totalEpisodes} episode links
        </p>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 transition shadow-lg shadow-purple-500/20"
        >
          <FaPlus /> Add Episode Link
        </button>

      </div>

      {/* LOADING */}
      {loading ? (
        <div className="text-center text-gray-500 py-20">Loading links...</div>
      ) : animeList.length === 0 ? (

        /* EMPTY */
        <div className="text-center text-gray-500 py-20">
          <FaTv className="text-5xl mx-auto mb-4 opacity-40" />
          <p>No links yet. Add the first one!</p>
        </div>

      ) : (

        /* ACCORDION LIST */
        <div className="space-y-4 max-w-4xl">

          {animeList.map(([animeTitle, episodes]) => (
            <div
              key={animeTitle}
              className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden hover:border-purple-500/30 transition"
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
                    <h2 className="font-semibold">{animeTitle}</h2>
                    <p className="text-sm text-gray-400">
                      {episodes.length} episode{episodes.length !== 1 ? 's' : ''}
                    </p>
                  </div>

                </div>

                <FaChevronDown
                  className={`transition-transform ${
                    expanded[animeTitle] ? 'rotate-180 text-purple-400' : ''
                  }`}
                />
              </button>

              {/* EPISODES */}
              <div
                className={`transition-all duration-500 overflow-hidden ${
                  expanded[animeTitle]
                    ? 'max-h-[2000px] opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-4 grid gap-3">

                  {episodes.map((ep, idx) => (
                    <div
                      key={ep._id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-black/60 border border-white/5 hover:border-purple-500/40 hover:scale-[1.01] transition"
                    >

                      {/* LEFT */}
                      <div className="flex items-center gap-4">

                        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-bold">
                          {ep.episodeNumber || idx + 1}
                        </div>

                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            Episode {ep.episodeNumber || idx + 1}
                          </span>
                          <span className="text-xs text-gray-400 break-all">
                            {ep.link}
                          </span>
                        </div>

                      </div>

                      {/* ACTIONS */}
                      <div className="flex items-center gap-2">

                        <a
                          href={ep.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 transition"
                        >
                          <FaExternalLinkAlt />
                        </a>

                        <button
                          onClick={() => handleDelete(ep._id)}
                          className="p-2 rounded-lg bg-red-600/20 hover:bg-red-600/40 transition"
                        >
                          <FaTrash />
                        </button>

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

          {/* CLICK OUTSIDE */}
          <div className="absolute inset-0" onClick={() => setShowForm(false)} />

          <div className="relative w-full max-w-md bg-black border border-white/10 rounded-2xl p-6 shadow-2xl">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-semibold flex items-center gap-2">
                <FaTv className="text-purple-400" />
                Add Episode Link
              </h2>

              <button onClick={() => setShowForm(false)}>
                <FaTimes />
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleAdd} className="space-y-4">

              <input
                type="text"
                value={form.animeTitle}
                onChange={e => setForm({ ...form, animeTitle: e.target.value })}
                placeholder="Anime Title"
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 outline-none"
                required
              />

              <input
                type="number"
                value={form.episodeNumber}
                onChange={e => setForm({ ...form, episodeNumber: e.target.value })}
                placeholder="Episode Number"
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 outline-none"
              />

              <input
                type="url"
                value={form.link}
                onChange={e => setForm({ ...form, link: e.target.value })}
                placeholder="https://..."
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 outline-none"
                required
              />

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-[1.02] transition"
              >
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