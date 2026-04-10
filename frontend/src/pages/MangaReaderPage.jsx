import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import { FaArrowLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import toast from 'react-hot-toast'
import SEO from '../components/SEO'

const MangaReaderPage = () => {
  const { id } = useParams()
  const [chapter, setChapter] = useState(null)
  
  const [pages, setPages] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [baseUrl, setBaseUrl] = useState('')
  const [hash, setHash] = useState('')

  useEffect(() => {
    fetchChapterData()
  }, [id])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextPage()
      if (e.key === 'ArrowLeft') prevPage()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentPage, pages])

  const fetchChapterData = async () => {
    setLoading(true)
    try {
      const { data } = await api.get(`/manga/${id}`)
      setChapter(data)

      // If it's an official simulpub chapter, don't ping MangaDex home server
      if (data.externalUrl) {
        setLoading(false)
        return
      }

      const mdRes = await fetch(`https://api.mangadex.org/at-home/server/${id}`)
      if (!mdRes.ok) throw new Error('Failed to fetch MangaDex images')
      
      const mdData = await mdRes.json()
      setBaseUrl(mdData.baseUrl)
      setHash(mdData.chapter.hash)
      setPages(mdData.chapter.data)
      setCurrentPage(0)

    } catch (error) {
      console.error('Error fetching chapter:', error)
      toast.error('Could not load chapter pages.')
    } finally {
      setLoading(false)
    }
  }

  const nextPage = () => {
    if (currentPage < pages.length - 1) setCurrentPage(p => p + 1)
  }

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(p => p - 1)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // Intercept Simulpub external URL early
  if (chapter?.externalUrl) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white/5 border border-white/10 p-10 rounded-3xl max-w-lg shadow-2xl">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 text-transparent bg-clip-text mb-4">
            Official Release
          </h2>
          <p className="text-gray-300 mb-8 leading-relaxed">
            Because this chapter is an official simulpub, MangaDex does not host the images directly. 
            You must read it legally on the official publishing platform linked below!
          </p>
          <a 
            href={chapter.externalUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-white text-black font-bold px-8 py-3 rounded-full hover:scale-105 transition shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            Read on Official Platform ↗
          </a>
          <div className="mt-8">
            <Link to="/manga" className="text-gray-500 hover:text-white transition underline flex items-center gap-2 justify-center">
              <FaArrowLeft /> Back to Library
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!chapter || !pages.length) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl mb-4 text-red-400">Chapter Content Unavailable</h2>
        <p className="text-gray-500 mb-6">MangaDex servers might be down or heavily delayed.</p>
        <Link to="/manga" className="text-purple-400 underline flex items-center gap-2">
          <FaArrowLeft /> Back to Library
        </Link>
      </div>
    )
  }

  const imageUrl = `${baseUrl}/data/${hash}/${pages[currentPage]}`

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans flex flex-col">
      <SEO 
        title={chapter ? `Read ${chapter.title}` : 'Reading Manga'}
        description={chapter ? `Read ${chapter.title} ${chapter.chapter ? `Chapter ${chapter.chapter}` : ''} legally or via fanscans on the One Piece Fan Universe.` : 'Read Manga Online'}
        keywords={`One Piece ${chapter?.chapter ? `Chapter ${chapter.chapter}` : ''}, ${chapter?.title}, Read Manga Online`}
        image={chapter?.coverImage}
      />
      {/* Top Navbar */}
      <div className="sticky top-0 z-50 bg-[#111] border-b border-[#222] p-4 flex justify-between items-center shadow-lg">
        <Link to="/manga" className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
          <FaArrowLeft /> <span className="hidden sm:inline">Library</span>
        </Link>
        <div className="text-center truncate px-4">
          <h1 className="font-bold text-gray-100 truncate text-sm sm:text-base">
            {chapter.title}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {chapter.volume && `Vol. ${chapter.volume}`} {chapter.chapter && `Ch. ${chapter.chapter}`}
          </p>
        </div>
        <div className="text-sm font-mono text-gray-400 bg-gray-800 px-3 py-1 rounded">
          {currentPage + 1} / {pages.length}
        </div>
      </div>

      {/* Reader Content */}
      <div className="flex-1 flex flex-col items-center justify-center py-6 px-2 sm:px-4 relative group">
        <div className="absolute top-0 left-0 w-[45%] h-full z-10 cursor-w-resize" onClick={prevPage}></div>
        <div className="absolute top-0 right-0 w-[45%] h-full z-10 cursor-e-resize" onClick={nextPage}></div>

        <div className="relative z-20 max-w-5xl w-full flex justify-center shadow-2xl rounded">
          {/* Use key to remount the image tag, ensuring gif/loading states trigger cleanly */}
          <img 
            key={imageUrl}
            src={imageUrl} 
            alt={`Page ${currentPage + 1}`} 
            className="w-full sm:w-auto sm:max-h-[85vh] object-contain pointer-events-none bg-[#111]"
            loading="lazy"
          />
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="sticky bottom-0 z-50 bg-[#111] border-t border-[#222] p-4 flex justify-center gap-8 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <button 
          onClick={prevPage} 
          disabled={currentPage === 0}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:hover:bg-gray-800 px-6 py-2 rounded transition-colors"
        >
          <FaChevronLeft /> Prev
        </button>
        <button 
          onClick={nextPage} 
          disabled={currentPage === pages.length - 1}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-30 disabled:hover:bg-purple-600 px-6 py-2 border-b-4 border-purple-800 rounded transition-colors text-white"
        >
          Next <FaChevronRight />
        </button>
      </div>
    </div>
  )
}

export default MangaReaderPage