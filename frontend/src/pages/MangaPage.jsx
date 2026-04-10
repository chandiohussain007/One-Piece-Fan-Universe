import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { FaBookOpen, FaEye, FaSearch } from 'react-icons/fa'
import SEO from '../components/SEO'

const MangaPage = () => {
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('Manga')
  const [chapters, setChapters] = useState([])

  const tabs = ['Manga', 'One Shots', 'Light Novels']

  useEffect(() => {
    fetchChapters()
  }, [activeTab])

  const fetchChapters = async () => {
    setLoading(true)
    try {
      const { data } = await api.get(`/manga?category=${activeTab}&limit=500`)
      setChapters(data.chapters || [])
    } catch (error) {
      console.error('Error fetching chapters:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredChapters = chapters.filter(ch =>
    ch.title.toLowerCase().includes(search.toLowerCase()) ||
    (ch.chapter && ch.chapter.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="bg-black text-white min-h-screen px-4 md:px-6 py-12 relative overflow-hidden">
      <SEO 
        title={`${activeTab} Library`}
        description={`Read the latest One Piece ${activeTab.toLowerCase()} directly from our high-speed MangaDex synchronized library. Explore official releases and spin-offs.`}
        keywords={`One Piece ${activeTab}, Read Manga Online, One Piece Fan Universe`}
      />
      {/* Neon Glow */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-purple-600 opacity-20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-pink-600 opacity-20 blur-[120px] rounded-full"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
             <span className="bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">One Piece</span> Manga
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto mb-8">
            Read the latest One Piece chapters directly from our high-speed MangaDex synchronized library.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
            {/* TABS */}
            <div className="flex bg-gray-900 rounded-full p-1 border border-gray-800 w-full md:w-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 md:px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                    activeTab === tab
                      ? 'bg-purple-600 shadow-md text-white'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* SEARCH */}
            <div className="relative w-full md:w-64">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-12 pr-4 py-2 rounded-full bg-gray-900 border border-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* LOADING OR CONTENT */}
        {loading ? (
          <div className="text-center text-gray-400 py-20">
            <p className="animate-pulse">Loading {activeTab}...</p>
          </div>
        ) : filteredChapters.length === 0 ? (
          <div className="text-center text-gray-500 mt-20 p-6 border border-gray-800 rounded-xl bg-gray-900/50">
            <FaBookOpen className="mx-auto text-4xl mb-4 opacity-50" />
            <p>No chapters found for {activeTab}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredChapters.map((chapter) => (
              <Link
                key={chapter._id}
                to={`/manga/${chapter.mangaDexChapterId}`}
                className="group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:bg-gray-800 transition duration-300 hover:-translate-y-1"
              >
                {/* IMAGE */}
                <div className="relative h-64 overflow-hidden bg-black">
                  {chapter.coverImage ? (
                    <img
                      src={chapter.coverImage}
                      alt={chapter.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-700">
                      <FaBookOpen size={48} />
                    </div>
                  )}

                  {/* CHAPTER BADGE */}
                  {chapter.chapter && (
                    <div className="absolute bottom-2 right-2 text-xs font-bold px-2 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded text-white shadow-lg">
                      Ch. {chapter.chapter}
                    </div>
                  )}
                  {chapter.volume && (
                    <div className="absolute top-2 right-2 text-xs font-bold px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-gray-300 border border-gray-700">
                      Vol. {chapter.volume}
                    </div>
                  )}
                </div>

                {/* INFO */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-200 line-clamp-2 text-sm md:text-base leading-tight">
                    {chapter.title}
                  </h3>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500 mt-3 pt-3 border-t border-gray-800">
                    <span className="flex items-center gap-1">
                      <FaEye /> {chapter.views || 0}
                    </span>
                    <span className="text-purple-400 font-medium bg-purple-400/10 px-2 py-1 rounded">Read →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MangaPage