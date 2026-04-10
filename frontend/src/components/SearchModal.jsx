import React, { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import api from '../services/api'
import { Link } from 'react-router-dom'

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('')
  const [mangaResults, setMangaResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      setMangaResults([])
    }
  }, [isOpen])

  useEffect(() => {
    if (!query.trim()) {
      setMangaResults([])
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await api.get(`/manga?search=${encodeURIComponent(query)}&limit=10`)
        setMangaResults(res.data.chapters || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [query])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center pt-24 bg-black/80 backdrop-blur-md px-4">
      <button 
        onClick={onClose} 
        className="absolute top-6 right-6 text-gray-400 hover:text-white transition"
      >
        <X size={32} />
      </button>

      <div className="w-full max-w-2xl relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search manga chapters, novels, titles..."
          className="w-full bg-white/10 border border-white/20 rounded-full py-4 pl-14 pr-6 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 text-lg shadow-2xl"
          autoFocus
        />
      </div>

      <div className="w-full max-w-2xl mt-8">
        {loading && <div className="text-gray-400 text-center animate-pulse">Searching universe...</div>}
        
        {!loading && query && mangaResults.length === 0 && (
          <div className="text-gray-400 text-center">No matches found for "{query}".</div>
        )}

        {!loading && mangaResults.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl max-h-[60vh] overflow-y-auto">
            <h3 className="bg-white/5 px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider backdrop-blur-sm sticky top-0">
              Manga & Novel Matches
            </h3>
            {mangaResults.map(ch => (
              <Link 
                key={ch._id}
                to={`/manga/${ch.mangaDexChapterId}`}
                onClick={onClose}
                className="flex items-center gap-4 p-4 hover:bg-white/10 border-b border-white/5 transition"
              >
                {ch.coverImage && (
                  <img src={ch.coverImage} className="w-12 h-16 object-cover rounded bg-black" alt={ch.title}/>
                )}
                <div>
                  <h4 className="text-white font-semibold line-clamp-1">{ch.title}</h4>
                  <p className="text-sm text-gray-400">
                    {ch.category} {ch.chapter ? `• Ch. ${ch.chapter}` : ''}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchModal
