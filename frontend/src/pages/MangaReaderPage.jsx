import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import { FaArrowLeft, FaExternalLinkAlt, FaBookOpen } from 'react-icons/fa'

const API_BASE = 'http://localhost:5000'

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
    if (url.startsWith('http')) return url
    return `${API_BASE}${url}`
  }

  const renderContent = () => {
    if (!chapter) return null

    switch (chapter.type) {

      // ── EXTERNAL LINK ── show in iframe + fallback button
      case 'link':
        return (
          <div>
            <div>
              <div>
                <p>External Reader</p>
                <a href={chapter.externalLink}
                  target="_blank"
                  rel="noopener noreferrer">
                  {chapter.externalLink} <FaExternalLinkAlt />
                </a>
              </div>
              <a href={chapter.externalLink}
                target="_blank"
                rel="noopener noreferrer">
                Open →
              </a>
            </div>

            {!iframeError && (
              <div>
                <div>
                  If blank, use the "Open" button above — some sites block embedding
                </div>
                <iframe
                  src={chapter.externalLink}
                  
                  title={chapter.title}
                  allow="fullscreen"
                  onError={() => setIframeError(true)}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              </div>
            )}
          </div>
        )

      // ── HTML / IFRAME EMBED ── render in sandboxed iframe using srcdoc
      case 'html':
        return (
          <div>
            <p>Embedded manga reader:</p>
            <div>
              <iframe
                srcDoc={chapter.htmlEmbed}
                
                
                title={chapter.title}
                allow="fullscreen; autoplay"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
              />
            </div>
          </div>
        )

      // ── UPLOADED IMAGES & PDFs ──
      case 'upload':
        return (
          <div>
            {chapter.contentFiles?.length === 0 && (
              <p>No files uploaded for this chapter.</p>
            )}
            {chapter.contentFiles?.map((file, idx) => {
              // Support both old string format and new {url, fileType} format
              const fileUrl = typeof file === 'string' ? file : file.url
              const fileType = typeof file === 'string'
                ? (fileUrl?.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image')
                : file.fileType

              if (fileType === 'pdf') {
                return (
                  <div key={idx}>
                    <div>
                      <span>📄 PDF Page {idx + 1}</span>
                      <a href={resolveUrl(fileUrl)}
                        target="_blank"
                        rel="noopener noreferrer">
                        Open full <FaExternalLinkAlt />
                      </a>
                    </div>
                    <embed
                      src={resolveUrl(fileUrl)}
                      type="application/pdf"
                      
                      
                    />
                  </div>
                )
              }

              return (
                <img key={idx}
                  src={resolveUrl(fileUrl)}
                  alt={`Page ${idx + 1}`}
                  
                  loading="lazy"
                />
              )
            })}
          </div>
        )

      // ── SINGLE PDF ──
      case 'pdf':
        return (
          <div>
            <div>
              <span>📄 PDF Reader</span>
              <a href={resolveUrl(chapter.externalLink || chapter.contentFiles?.[0]?.url)}
                target="_blank"
                rel="noopener noreferrer">
                Open full <FaExternalLinkAlt />
              </a>
            </div>
            <embed
              src={resolveUrl(chapter.externalLink || chapter.contentFiles?.[0]?.url)}
              type="application/pdf"
              
              
            />
          </div>
        )

      default:
        return (
          <div>
            <FaBookOpen  />
            <p>No content available for this chapter.</p>
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div>
        <div></div>
      </div>
    )
  }

  if (!chapter) {
    return (
      <div>
        <div>
          <p>Chapter not found</p>
          <Link to="/manga">← Back to Library</Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div>
      {/* Top Bar */}
      <div>        <div>
          <Link to="/manga">
            <FaArrowLeft /> Back
          </Link>
          <div />
          <div>
            {chapter.animeName && (
              <span>{chapter.animeName} • </span>
            )}
            <span>{chapter.title}</span>
          </div>
          <span>{chapter.views} views</span>
        </div>
      </div>

      <div>
        {/* Chapter Info */}
        <div>
          <h1>{chapter.title}</h1>
          {chapter.description && (
            <p>{chapter.description}</p>
          )}
        </div>

        {renderContent()}

        {/* Bottom Nav */}
        <div>
          <Link to="/manga">
            <FaArrowLeft /> Back to Library
          </Link>
        </div>
      </div>
    </div>
  </div>
  )
}

export default MangaReaderPage
