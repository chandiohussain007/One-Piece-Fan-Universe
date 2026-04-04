import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { FaBookOpen, FaLink, FaCode, FaFilePdf, FaEye, FaSearch } from 'react-icons/fa'

const MangaPage = () => {
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [groupedByAnime, setGroupedByAnime] = useState({})

  useEffect(() => {
    fetchChapters()
  }, [])

  const fetchChapters = async () => {
    try {
      const { data } = await api.get('/manga')
      const groups = data.reduce((acc, ch) => {
        const key = ch.animeName || 'Standalone Chapters'
        if (!acc[key]) acc[key] = []
        acc[key].push(ch)
        return acc
      }, {})
      setGroupedByAnime(groups)
    } catch (error) {
      console.error('Error fetching chapters:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'pdf': return <FaFilePdf />
      case 'link': return <FaLink />
      case 'html': return <FaCode />
      default: return <FaBookOpen />
    }
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case 'pdf': return 'PDF'
      case 'link': return 'External'
      case 'html': return 'Embedded'
      case 'upload': return 'Images'
      default: return type
    }
  }

  const filteredGroups = Object.entries(groupedByAnime).reduce((acc, [anime, chs]) => {
    const filtered = chs.filter(ch =>
      ch.title.toLowerCase().includes(search.toLowerCase()) ||
      anime.toLowerCase().includes(search.toLowerCase())
    )
    if (filtered.length > 0) acc[anime] = filtered
    return acc
  }, {})

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gray-400">
        <p className="animate-pulse">Loading manga library...</p>
      </div>
    )
  }

  return (
    <div className="bg-black text-white min-h-screen px-4 md:px-6 py-12 relative overflow-hidden">

      {/* Neon Glow */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-purple-600 opacity-20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-pink-600 opacity-20 blur-[120px] rounded-full"></div>

      <div className="relative max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Manga <span className="bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">Library</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Read the latest releases — high quality scans, PDFs, and embedded viewing.
          </p>

          {/* SEARCH */}
          <div className="mt-8 max-w-lg mx-auto relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search manga or chapter..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 outline-none backdrop-blur-md"
            />
          </div>
        </div>

        {/* EMPTY STATE */}
        {Object.keys(filteredGroups).length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            <FaBookOpen className="mx-auto text-4xl mb-4 opacity-50" />
            <p>No manga found.</p>
          </div>
        ) : (
          Object.entries(filteredGroups).map(([animeName, chs]) => (
            <div key={animeName} className="mb-16">

              {/* GROUP HEADER */}
              <h2 className="text-2xl font-bold mb-6 border-l-4 border-purple-500 pl-4">
                {animeName}
              </h2>

              {/* GRID: responsive fire layout */}
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {chs.map((chapter, idx) => (
                  <Link
                    key={chapter._id}
                    to={`/manga/${chapter._id}`}
                    className="group bg-white/5 border border-white/10 backdrop-blur-lg rounded-xl overflow-hidden hover:bg-white/10 transition duration-300 hover:-translate-y-1"
                    style={{ animationDelay: `${0.1 * idx}s` }}
                  >

                    {/* IMAGE */}
                    <div className="relative h-48 overflow-hidden">
                      {chapter.coverImage ? (
                        <img
                          src={chapter.coverImage.startsWith('/')
                            ? `http://localhost:5000${chapter.coverImage}`
                            : chapter.coverImage}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          <FaBookOpen />
                        </div>
                      )}

                      {/* TYPE BADGE */}
                      <div className="absolute top-2 left-2 text-xs px-2 py-1 bg-black/70 rounded flex items-center gap-1">
                        {getTypeIcon(chapter.type)}
                        {getTypeLabel(chapter.type)}
                      </div>

                      {/* CHAPTER */}
                      <div className="absolute bottom-2 right-2 text-xs px-2 py-1 bg-purple-600 rounded">
                        Ch. {chapter.order || idx + 1}
                      </div>
                    </div>

                    {/* INFO */}
                    <div className="p-4">
                      <h3 className="font-semibold line-clamp-1">
                        {chapter.title}
                      </h3>

                      {chapter.description && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {chapter.description}
                        </p>
                      )}

                      <div className="flex justify-between items-center text-xs text-gray-400 mt-3">
                        <span className="flex items-center gap-1">
                          <FaEye /> {chapter.views}
                        </span>
                        <span className="text-purple-400">Read →</span>
                      </div>
                    </div>

                  </Link>
                ))}

              </div>
            </div>
          ))
        )}

      </div>
    </div>
  )
}

export default MangaPage