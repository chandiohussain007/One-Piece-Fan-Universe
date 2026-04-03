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

      // Group by animeName
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
      case 'pdf': return <FaFilePdf  />
      case 'link': return <FaLink  />
      case 'html': return <FaCode  />
      default: return <FaBookOpen  />
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
    if (filtered.length> 0) acc[anime] = filtered
    return acc
  }, {})

  if (loading) {
    return (
      <div>
        <div>
          <div></div>
          <p>Loading manga library...</p>
        </div>
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
          <FaBookOpen  />
          <h1>
            Manga <span>Library</span>
          </h1>
          <p>Read the latest releases — high quality scans, PDFs, and embedded viewing</p>

          {/* Search */}
          <div>
            <FaSearch  />
            <input type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search manga or chapter title..."
              
            />
          </div>
        </div>
      </div>

      <div>
        {Object.keys(filteredGroups).length === 0 ? (
          <div>
            <FaBookOpen  />
            <p>No manga chapters published yet.</p>
          </div>
        ) : (
          Object.entries(filteredGroups).map(([animeName, chs]) => (
            <div key={animeName}>
              {/* Anime Group Header */}
              <div>
                <div></div>
                <h2>
                  {animeName}
                </h2>
                <div></div>
              </div>

              {/* Chapter Grid */}
              <div>
                {chs.map((chapter, idx) => (
                  <Link
                    key={chapter._id}
                    to={`/manga/${chapter._id}`}
                    
                    style={{ animationDelay: `${0.1 * idx}s`, animationFillMode: 'forwards' }}>
                    {/* Cover Image */}
                    <div>
                      {chapter.coverImage ? (
                        <img src={chapter.coverImage.startsWith('/') ? `http://localhost:5000${chapter.coverImage}` : chapter.coverImage}
                          alt={chapter.title}
                          
                        />
                      ) : (
                        <div>
                          <FaBookOpen  />
                          <span>No Cover</span>
                        </div>
                      )}
                      {/* Type Badge */}
                      <div>
                        {getTypeIcon(chapter.type)}
                        <span>{getTypeLabel(chapter.type)}</span>
                      </div>
                      {/* Chapter Number */}
                      <div>
                        Ch. {chapter.order || idx + 1}
                      </div>
                    </div>

                    {/* Info */}
                    <div>
                      <h3>
                        {chapter.title}
                      </h3>
                      {chapter.description && (
                        <p>{chapter.description}</p>
                      )}
                      <div>
                        <span>
                          <FaEye  /> {chapter.views} views
                        </span>
                        <span>Read →</span>
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
  </div>
  )
}

export default MangaPage