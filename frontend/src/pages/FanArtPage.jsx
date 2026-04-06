import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'
import { FaLink, FaExpand, FaTimes } from 'react-icons/fa'
import Masonry from 'react-masonry-css'
import {
  FaHeart, FaComment, FaUpload, FaImage,
  FaVideo, FaAlignLeft, FaReply, FaTrash, FaSearch, FaYoutube, FaPlay
} from 'react-icons/fa'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

// ─── Lightbox Component for Full Image View ───────────────────
const Lightbox = ({ imageUrl, onClose }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-lg flex items-center justify-center p-4 cursor-pointer"
      onClick={onClose}
    >
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition z-10"
      >
        <FaTimes size={30} />
      </button>
      <img 
        src={imageUrl} 
        alt="Full view"
        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}

// ─── Fan Art Card ───────────────────────────────────────────────
const FanArtCard = ({ post, onLike }) => {
  const { user } = useAuth()
  const [showComments, setShowComments] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const isLiked = user && Array.isArray(post.likes) && post.likes.includes(user._id)
  const likeCount = Array.isArray(post.likes) ? post.likes.length : 0
  const resolveUrl = (url) => url?.startsWith('http') ? url : `${API_BASE}${url}`

  // Helper function to truncate text
  const truncateText = (text, maxLength = 150) => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  }

  // Extract YouTube video ID from URL
  const getYouTubeId = (url) => {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  // Instagram detection
  const isInstagram = post.type === 'link' && post.mediaUrl?.includes('instagram.com')
  const getInstagramEmbedUrl = (url) => {
    const match = url?.match(/instagram\.com\/p\/([A-Za-z0-9_-]+)/)
    if (match) {
      return `https://www.instagram.com/p/${match[1]}/embed`
    }
    return null
  }
  const instagramEmbedUrl = isInstagram ? getInstagramEmbedUrl(post.mediaUrl) : null

  const isYouTube = post.type === 'link' && post.mediaUrl && getYouTubeId(post.mediaUrl)
  const youtubeId = isYouTube ? getYouTubeId(post.mediaUrl) : null

  return (
    <>
      <div className="group bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl overflow-hidden hover:bg-white/10 transition duration-300 flex flex-col h-full">
        
        {/* MEDIA - Fixed aspect ratio container */}
        <div className="relative bg-black/30">
          {post.type === 'image' && post.mediaUrl && (
            <div 
              className="relative overflow-hidden cursor-pointer aspect-[4/3]"
              onClick={() => setLightboxOpen(true)}
            >
              <img 
                src={resolveUrl(post.mediaUrl)} 
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center">
                <FaExpand className="text-white text-3xl opacity-0 group-hover:opacity-100 transition" />
              </div>
            </div>
          )}

          {post.type === 'video' && post.mediaUrl && (
            <div className="aspect-video">
              <video src={resolveUrl(post.mediaUrl)} controls className="w-full h-full object-cover" />
            </div>
          )}

          {/* LINK TYPE - Handle YouTube & Instagram */}
          {post.type === 'link' && post.mediaUrl && (
            <div className="relative">
              {isYouTube ? (
                <div className="relative aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              ) : isInstagram && instagramEmbedUrl ? (
                <div className="relative min-h-[400px]">
                  <iframe
                    src={instagramEmbedUrl}
                    title="Instagram post"
                    frameBorder="0"
                    scrolling="no"
                    allowTransparency="true"
                    className="w-full min-h-[400px]"
                  ></iframe>
                </div>
              ) : (
                // For regular image/video links
                post.mediaUrl.includes('.mp4') || post.mediaUrl.includes('.webm') ? (
                  <div className="aspect-video">
                    <video src={resolveUrl(post.mediaUrl)} controls className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div 
                    className="relative overflow-hidden cursor-pointer aspect-[4/3]"
                    onClick={() => setLightboxOpen(true)}
                  >
                    <img 
                      src={resolveUrl(post.mediaUrl)} 
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center">
                      <FaExpand className="text-white text-3xl opacity-0 group-hover:opacity-100 transition" />
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* LINK PREVIEW (metadata from link preview API) */}
        {post.type === 'link' && post.preview && !isYouTube && !isInstagram && (
          <div className="p-4 border-t border-white/10 bg-white/5">
            {post.preview.thumbnailUrl && (
              <div 
                className="cursor-pointer mb-3 overflow-hidden rounded-lg aspect-video"
                onClick={() => setLightboxOpen(true)}
              >
                <img 
                  src={post.preview.thumbnailUrl} 
                  alt={post.preview.title || 'Preview'}
                  className="w-full h-full object-cover hover:scale-110 transition duration-500"
                />
              </div>
            )}
            
            {post.preview.title && (
              <h4 className="font-semibold text-sm mb-1 line-clamp-2">
                {truncateText(post.preview.title, 80)}
              </h4>
            )}
            {post.preview.description && (
              <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                {truncateText(post.preview.description, 100)}
              </p>
            )}
            {post.preview.siteName && (
              <div className="flex items-center gap-2">
                {post.preview.siteName === 'YouTube' && <FaYoutube className="text-red-500" />}
                <p className="text-xs text-purple-400">{post.preview.siteName}</p>
              </div>
            )}
          </div>
        )}

        {/* CONTENT - Fixed height for consistency */}
        <div className="p-4 flex-1 flex flex-col">
          {post.title && (
            <h3 className="font-semibold text-lg mb-1 line-clamp-2 min-h-[3.5rem]">
              {truncateText(post.title, 60)}
            </h3>
          )}

          <p className="text-sm text-gray-300 mb-3 line-clamp-3 min-h-[4.5rem]">
            {truncateText(post.content, 150)}
          </p>

          {post.credits && (
            <p className="text-xs text-gray-400 mb-2 line-clamp-1">
              Credits: {truncateText(post.credits, 50)}
            </p>
          )}

          {/* ACTIONS - Pushed to bottom with mt-auto */}
          <div className="flex justify-between items-center text-sm mt-auto pt-3 border-t border-white/10">
            <button onClick={() => onLike(post._id)} className={`flex items-center gap-2 transition ${isLiked ? 'text-pink-400' : 'text-gray-400 hover:text-pink-400'}`}>
              <FaHeart /> {likeCount}
            </button>
            <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition">
              <FaComment /> Discuss
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox 
          imageUrl={resolveUrl(post.mediaUrl)} 
          onClose={() => setLightboxOpen(false)} 
        />
      )}
    </>
  )
}

// ─── Main Fan Art Page ─────────────────────────────────────────────
const FanArtPage = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUpload, setShowUpload] = useState(false)
  const [uploadType, setUploadType] = useState('image')
  const [content, setContent] = useState('')
  const [mediaFile, setMediaFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [title, setTitle] = useState('')
  const [credits, setCredits] = useState('')
  const [linkPreviewData, setLinkPreviewData] = useState(null)
  const [fetchingPreview, setFetchingPreview] = useState(false)
  const { user } = useAuth()

  const breakpointColumns = { default: 3, 1100: 3, 700: 2, 500: 1 }

  useEffect(() => { fetchPosts() }, [])

  const fetchPosts = async () => {
    try {
      const { data } = await api.get('/fanart')
      setPosts(data.posts || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch preview when linkUrl changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (uploadType === 'link' && linkUrl && linkUrl.trim()) {
        fetchLinkPreview()
      } else {
        setLinkPreviewData(null)
      }
    }, 800)

    return () => clearTimeout(timer)
  }, [linkUrl, uploadType])

  const fetchLinkPreview = async () => {
    if (!linkUrl.trim()) return
    
    setFetchingPreview(true)
    try {
      const { data } = await api.get(`/link-preview?url=${encodeURIComponent(linkUrl)}`)
      setLinkPreviewData(data)
    } catch (error) {
      console.error('Failed to fetch link preview:', error)
      setLinkPreviewData(null)
    } finally {
      setFetchingPreview(false)
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!content.trim()) { toast.error('Please add a caption'); return }

    setUploading(true)

    try {
      let mediaUrl = ''
      let preview = null

      if (uploadType === 'link') {
        mediaUrl = linkUrl
        // Use the fetched preview data if available
        if (linkPreviewData) {
          preview = linkPreviewData
        } else {
          // Try to fetch one more time if not available
          try {
            const { data } = await api.get(`/link-preview?url=${encodeURIComponent(linkUrl)}`)
            preview = data
          } catch (error) {
            console.error('Failed to fetch link preview:', error)
          }
        }
      } else if (mediaFile && !['text', 'link'].includes(uploadType)) {
        const fd = new FormData()
        fd.append('file', mediaFile)
        const { data } = await api.post('/upload/fanart', fd)
        mediaUrl = data.fileUrl
      }

      await api.post('/fanart', {
        type: uploadType,
        content,
        mediaUrl,
        title,
        credits,
        preview
      })

      toast.success('🎨 Submitted for review! Our team will approve it shortly.')
      setShowUpload(false)
      setContent('')
      setMediaFile(null)
      setLinkUrl('')
      setTitle('')
      setCredits('')
      setLinkPreviewData(null)
      fetchPosts()
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const filtered = posts.filter(p =>
    p.content?.toLowerCase().includes(search.toLowerCase()) ||
    p.user?.username?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-black text-white min-h-screen px-6 py-12 relative overflow-hidden">

      {/* Background Glows */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-purple-600 opacity-20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-pink-600 opacity-20 blur-[120px] rounded-full"></div>

      <div className="relative max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Fan Art{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
              Gallery
            </span>
          </h1>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            {user && (
              <button
                onClick={() => setShowUpload(true)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:scale-105 transition shadow-lg shadow-purple-500/30"
              >
                <FaUpload /> Share Your Art
              </button>
            )}

            <div className="relative w-full max-w-md">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search art or artist..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 outline-none"
              />
            </div>
          </div>
        </div>

        {/* POSTS */}
        {loading ? (
          <div className="text-gray-400 text-center">Loading posts...</div>
        ) : (
          <Masonry 
            breakpointCols={breakpointColumns} 
            className="flex gap-6" 
            columnClassName="masonry-column"
          >
            {filtered.map(post => (
              <div key={post._id} className="mb-6">
                <FanArtCard post={post} onLike={() => {}} />
              </div>
            ))}
          </Masonry>
        )}

        {/* UPLOAD MODAL */}
        {showUpload && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md overflow-y-auto py-8">
            <div className="w-full max-w-lg bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 my-8">

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FaImage /> Share Masterpiece
                </h2>
                <button onClick={() => setShowUpload(false)}><FaTimes /></button>
              </div>

              <form onSubmit={handleUpload} className="space-y-4">

                {/* TYPE SELECTOR */}
                <div className="flex gap-2 flex-wrap">
                  {[
                    { value: 'image', icon: <FaImage />, label: 'Image' },
                    { value: 'video', icon: <FaVideo />, label: 'Video' },
                    { value: 'text', icon: <FaAlignLeft />, label: 'Text' },
                    { value: 'link', icon: <FaLink />, label: 'Link' }
                  ].map(opt => (
                    <button key={opt.value} type="button"
                      onClick={() => {
                        setUploadType(opt.value)
                        setLinkPreviewData(null)
                        setLinkUrl('')
                      }}
                      className={`px-4 py-2 rounded-xl border ${uploadType === opt.value ? 'border-purple-500 bg-purple-500/20' : 'border-white/10'} flex items-center gap-2 transition`}>
                      {opt.icon} {opt.label}
                    </button>
                  ))}
                </div>

                {/* INPUT */}
                {uploadType === 'link' ? (
                  <div>
                    <input
                      type="url"
                      value={linkUrl}
                      onChange={e => setLinkUrl(e.target.value)}
                      placeholder="Paste any URL (YouTube, Twitter, etc)..."
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 outline-none"
                      required
                    />
                    
                    {/* Show preview while typing */}
                    {fetchingPreview && (
                      <div className="mt-3 text-sm text-gray-400 text-center">
                        Fetching preview...
                      </div>
                    )}
                    
                    {linkPreviewData && !fetchingPreview && (
                      <div className="mt-3 p-3 bg-white/5 rounded-xl border border-white/10">
                        <p className="text-xs text-purple-400 mb-2">Preview:</p>
                        {linkPreviewData.thumbnailUrl && (
                          <img 
                            src={linkPreviewData.thumbnailUrl} 
                            alt="Preview"
                            className="w-full h-32 object-cover rounded-lg mb-2"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        )}
                        {linkPreviewData.title && (
                          <p className="text-sm font-semibold">{linkPreviewData.title}</p>
                        )}
                        {linkPreviewData.siteName && (
                          <p className="text-xs text-gray-400">{linkPreviewData.siteName}</p>
                        )}
                      </div>
                    )}
                  </div>
                ) : uploadType !== 'text' && (
                  <input
                    type="file"
                    accept={uploadType === 'image' ? 'image/*' : 'video/*'}
                    onChange={e => setMediaFile(e.target.files[0])}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10"
                    required
                  />
                )}

                {/* TITLE + CREDITS */}
                <input
                  type="text"
                  placeholder="Title (optional)"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 outline-none"
                />

                <input
                  type="text"
                  placeholder="Credits (optional)"
                  value={credits}
                  onChange={e => setCredits(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 outline-none"
                />

                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Tell us about your art..."
                  rows="4"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 outline-none"
                  required
                />

                <button 
                  type="submit" 
                  disabled={uploading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Submit Post'}
                </button>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default FanArtPage