import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import { FaArrowLeft, FaExternalLinkAlt, FaBookOpen } from 'react-icons/fa'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const MangaReaderPage = () => {
  const { id } = useParams()
  const [chapter, setChapter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [iframeError, setIframeError] = useState(false)

  useEffect(() => {
    fetchChapter()
  }, [id])

  const fetchChapter = async () => {
    try {
      const { data } = await api.get(`/manga/${id}`)
      setChapter(data)
    } catch (error) {
      console.error('Error fetching chapter:', error)
    } finally {
      setLoading(false)
    }
  }

  const resolveUrl = (url) => {
    if (!url) return ''
    return url.startsWith('http') ? url : `${API_BASE}${url}`
  }

  const renderContent = () => {
    if (!chapter) return null

    switch (chapter.type) {

      // ── EXTERNAL LINK ──
      case 'link':
        return (
          <div className="reader-section">
            <div className="external-info">
              <p>External Manga Reader</p>
              <a href={chapter.externalLink} target="_blank" rel="noopener noreferrer">
                Open full manga <FaExternalLinkAlt />
              </a>
            </div>

            {!iframeError && (
              <iframe
                src={chapter.externalLink}
                title={chapter.title}
                className="external-iframe"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                onError={() => setIframeError(true)}
              />
            )}

            {iframeError && (
              <p className="error-text">
                This site may block embedding. Use the "Open full manga" button above.
              </p>
            )}
          </div>
        )

      // ── HTML EMBED ──
      case 'html':
        return (
          <div className="reader-section">
            <p>Embedded manga reader:</p>
            <iframe
              srcDoc={chapter.htmlEmbed}
              title={chapter.title}
              className="embed-iframe"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
            />
          </div>
        )

      // ── UPLOADED IMAGES & PDFs ──
      case 'upload':
        if (!chapter.contentFiles || chapter.contentFiles.length === 0) {
          return <p className="error-text">No files uploaded for this chapter.</p>
        }
        return (
          <div className="reader-section multi-page">
            {chapter.contentFiles.map((file, idx) => {
              const fileUrl = typeof file === 'string' ? file : file.url
              const fileType = typeof file === 'string'
                ? fileUrl.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image'
                : file.fileType

              if (fileType === 'pdf') {
                return (
                  <div key={idx} className="pdf-wrapper">
                    <div className="pdf-header">
                      <span>📄 PDF Page {idx + 1}</span>
                      <a href={resolveUrl(fileUrl)} target="_blank" rel="noopener noreferrer">
                        Open full <FaExternalLinkAlt />
                      </a>
                    </div>
                    <embed
                      src={resolveUrl(fileUrl)}
                      type="application/pdf"
                      className="pdf-embed"
                    />
                  </div>
                )
              }

              return (
                <img
                  key={idx}
                  src={resolveUrl(fileUrl)}
                  alt={`Page ${idx + 1}`}
                  loading="lazy"
                  className="manga-page"
                />
              )
            })}
          </div>
        )

      // ── SINGLE PDF ──
      case 'pdf':
        const pdfUrl = resolveUrl(chapter.externalLink || chapter.contentFiles?.[0]?.url)
        return (
          <div className="reader-section">
            <div className="pdf-header">
              <span>📄 PDF Reader</span>
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                Open full <FaExternalLinkAlt />
              </a>
            </div>
            <embed src={pdfUrl} type="application/pdf" className="pdf-embed" />
          </div>
        )

      default:
        return (
          <div className="reader-section empty-state">
            <FaBookOpen />
            <p>No content available for this chapter.</p>
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!chapter) {
    return (
      <div className="empty-state">
        <p>Chapter not found</p>
        <Link to="/manga" className="back-link">← Back to Library</Link>
      </div>
    )
  }

  return (
    <div className="manga-reader-page">
      {/* Top Bar */}
      <div className="reader-topbar">
        <Link to="/manga" className="back-link">
          <FaArrowLeft /> Back
        </Link>
        <div className="chapter-info">
          {chapter.animeName && <span>{chapter.animeName} • </span>}
          <span>{chapter.title}</span>
        </div>
        <span className="views-count">{chapter.views} views</span>
      </div>

      {/* Chapter Content */}
      <div className="reader-content">
        <div className="chapter-header">
          <h1>{chapter.title}</h1>
          {chapter.description && <p>{chapter.description}</p>}
        </div>

        {renderContent()}

        {/* Bottom Navigation */}
        <div className="reader-bottom-nav">
          <Link to="/manga" className="back-link">
            <FaArrowLeft /> Back to Library
          </Link>
        </div>
      </div>

      {/* Styles (can move to CSS/SCSS file) */}
      <style jsx="true">{`
        .manga-reader-page {
          background: #0d0d0d;
          color: #f5f5f5;
          min-height: 100vh;
          padding: 1rem 2rem;
          font-family: 'Arial', sans-serif;
        }
        .reader-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          border-bottom: 1px solid #222;
          padding-bottom: 0.5rem;
        }
        .back-link {
          color: #ff4d6d;
          text-decoration: none;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .back-link:hover { color: #ff85a2; }
        .chapter-info {
          font-weight: bold;
          font-size: 1.1rem;
        }
        .views-count { color: #888; font-size: 0.9rem; }
        .reader-content { margin-top: 1rem; }
        .chapter-header h1 { font-size: 2rem; margin-bottom: 0.25rem; color: #ff4d6d; }
        .chapter-header p { font-size: 1rem; color: #bbb; }
        .reader-section { margin-top: 2rem; }
        .external-info, .pdf-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
        .external-info a, .pdf-header a { color: #ff85a2; text-decoration: none; font-weight: bold; }
        .external-info a:hover, .pdf-header a:hover { color: #ff4d6d; }
        .external-iframe, .embed-iframe { width: 100%; height: 600px; border: none; border-radius: 0.25rem; background: #000; }
        .multi-page { display: flex; flex-direction: column; gap: 1.5rem; }
        .manga-page { width: 100%; max-width: 100%; border-radius: 0.25rem; box-shadow: 0 0 15px rgba(255,77,109,0.2); }
        .pdf-embed { width: 100%; height: 800px; border-radius: 0.25rem; background: #000; }
        .error-text { color: #ff4d6d; margin-top: 0.5rem; font-style: italic; }
        .reader-bottom-nav { margin-top: 3rem; border-top: 1px solid #222; padding-top: 1rem; }
        .empty-state { text-align: center; color: #888; margin-top: 5rem; }
        .page-loader { display: flex; justify-content: center; align-items: center; height: 50vh; }
        .spinner { width: 50px; height: 50px; border: 6px solid #222; border-top-color: #ff4d6d; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

export default MangaReaderPage