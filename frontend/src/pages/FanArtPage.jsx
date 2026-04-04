import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'
import Masonry from 'react-masonry-css'
import {
  FaHeart, FaComment, FaUpload, FaTimes, FaImage,
  FaVideo, FaAlignLeft, FaReply, FaTrash, FaSearch
} from 'react-icons/fa'

const API_BASE = 'http://localhost:5000'

// ─── Comment Section ───────────────────────────────────────────────
const CommentSection = ({ postId }) => {
  const { user } = useAuth()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [replyTo, setReplyTo] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await api.get(`/comments/fanart/${postId}`)
        setComments(data)
      } catch {}
      finally { setLoading(false) }
    }
    fetchComments()
  }, [postId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setSubmitting(true)
    try {
      await api.post('/comments', {
        targetType: 'fanart',
        targetId: postId,
        content: text,
        parentId: replyTo?.id || null
      })
      setText('')
      setReplyTo(null)
      const { data } = await api.get(`/comments/fanart/${postId}`)
      setComments(data)
    } catch { toast.error('Failed to post comment') }
    finally { setSubmitting(false) }
  }

  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`)
      const { data } = await api.get(`/comments/fanart/${postId}`)
      setComments(data)
    } catch { toast.error('Failed to delete') }
  }

  const totalCount = comments.reduce((sum, c) => sum + 1 + (c.replies?.length || 0), 0)

  return (
    <div className="mt-4 space-y-4">
      <h4 className="text-sm font-semibold text-gray-300">{totalCount} Comment{totalCount !== 1 ? 's' : ''}</h4>

      {loading ? (
        <div className="text-gray-400 text-sm">Loading comments...</div>
      ) : comments.length === 0 ? (
        <p className="text-gray-400 text-sm">No comments yet. Be the first!</p>
      ) : (
        comments.map(comment => (
          <div key={comment._id} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold">
              {comment.user?.username?.[0]?.toUpperCase() || '?'}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 w-full">
              <div className="flex justify-between text-xs text-gray-400">
                <span>@{comment.user?.username}</span>
                <div className="flex gap-2">
                  {user && (
                    <button onClick={() => setReplyTo({ id: comment._id, username: comment.user?.username })}>
                      <FaReply />
                    </button>
                  )}
                  {(user?._id === comment.user?._id || user?.role === 'admin') && (
                    <button onClick={() => handleDelete(comment._id)}>
                      <FaTrash />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm mt-1">{comment.content}</p>

              {comment.replies?.length > 0 && (
                <div className="ml-6 mt-2 space-y-2">
                  {comment.replies.map(reply => (
                    <div key={reply._id} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-400 flex items-center justify-center text-[10px] font-bold">
                        {reply.user?.username?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 w-full">
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>@{reply.user?.username}</span>
                          {(user?._id === reply.user?._id || user?.role === 'admin') && (
                            <button onClick={() => handleDelete(reply._id)}>
                              <FaTrash />
                            </button>
                          )}
                        </div>
                        <p className="text-sm mt-1">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))
      )}

      {user ? (
        <form onSubmit={handleSubmit} className="mt-2">
          {replyTo && (
            <div className="flex justify-between items-center text-xs text-gray-300 mb-2">
              <span className="flex items-center gap-1"><FaReply /> Replying to @{replyTo.username}</span>
              <button type="button" onClick={() => setReplyTo(null)}>✕</button>
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:ring-1 focus:ring-purple-500 outline-none"
            />
            <button type="submit" disabled={submitting || !text.trim()} className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 transition">
              Post
            </button>
          </div>
        </form>
      ) : (
        <p className="text-gray-400 text-sm">
          <a href="/login" className="underline">Sign in</a> to join the conversation
        </p>
      )}
    </div>
  )
}

// ─── Fan Art Card ───────────────────────────────────────────────
const FanArtCard = ({ post, onLike }) => {
  const { user } = useAuth()
  const [showComments, setShowComments] = useState(false)
  const isLiked = user && Array.isArray(post.likes) && post.likes.includes(user._id)
  const likeCount = Array.isArray(post.likes) ? post.likes.length : 0
  const resolveUrl = (url) => url?.startsWith('http') ? url : `${API_BASE}${url}`

  return (
    <div className="group bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl overflow-hidden hover:bg-white/10 transition duration-300">
      {/* MEDIA */}
      {post.type === 'image' && post.mediaUrl && (
        <div className="relative overflow-hidden">
          <img src={resolveUrl(post.mediaUrl)} alt={post.content} className="w-full object-cover group-hover:scale-110 transition duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
        </div>
      )}
      {post.type === 'video' && post.mediaUrl && (
        <video src={resolveUrl(post.mediaUrl)} controls className="w-full" />
      )}

      {/* CONTENT */}
      <div className="p-4">
        {/* USER */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold">
            {post.user?.username?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="text-sm">@{post.user?.username}</p>
            <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <p className="text-sm text-gray-300 mb-3">{post.content}</p>

        {/* ACTIONS */}
        <div className="flex justify-between items-center text-sm">
          <button onClick={() => onLike(post._id)} className={`flex items-center gap-2 transition ${isLiked ? 'text-pink-400' : 'text-gray-400 hover:text-pink-400'}`}>
            <FaHeart /> {likeCount}
          </button>
          <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition">
            <FaComment /> Discuss
          </button>
        </div>
      </div>

      {showComments && <div className="border-t border-white/10 p-4"><CommentSection postId={post._id} /></div>}
    </div>
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
  const { user } = useAuth()

  const breakpointColumns = { default: 3, 1100: 3, 700: 2, 500: 1 }

  useEffect(() => { fetchPosts() }, [])

  const fetchPosts = async () => {
    try {
      const { data } = await api.get('/fanart')
      setPosts(data.posts || [])
    } catch (error) { console.error(error) }
    finally { setLoading(false) }
  }

  const handleLike = async (postId) => {
    if (!user) { toast.error('Please login to like posts'); return }
    try {
      const { data } = await api.post(`/fanart/${postId}/like`)
      setPosts(posts.map(p => p._id === postId ? { ...p, likes: data.likes } : p))
    } catch { toast.error('Failed to like') }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!content.trim()) { toast.error('Please add a caption'); return }
    setUploading(true)
    try {
      let mediaUrl = ''
      if (mediaFile && uploadType !== 'text') {
        const fd = new FormData()
        fd.append('file', mediaFile)
        const { data } = await api.post('/upload/fanart', fd)
        mediaUrl = data.fileUrl
      }
      await api.post('/fanart', { type: uploadType, content, mediaUrl })
      toast.success('🎨 Submitted for review! Our team will approve it shortly.')
      setShowUpload(false)
      setContent('')
      setMediaFile(null)
      fetchPosts()
    } catch { toast.error('Upload failed') }
    finally { setUploading(false) }
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
          <p className="text-gray-400 max-w-xl mx-auto">
            Discover mesmerizing artwork crafted by the community. Share your passion, like, and discuss.
          </p>

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
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 outline-none backdrop-blur-md"
              />
            </div>
          </div>
        </div>

        {/* POSTS */}
        {loading ? (
          <div className="text-gray-400 text-center">Loading posts...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-400">
            <FaImage className="mx-auto mb-4 text-6xl" />
            <p>No artworks found</p>
            {user && (
              <button onClick={() => setShowUpload(true)} className="mt-4 px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-600">
                Be the first to share your creation!
              </button>
            )}
          </div>
        ) : (
          <Masonry
            breakpointCols={breakpointColumns}
            className="flex gap-6"
            columnClassName=""
          >
            {filtered.map(post => (
              <FanArtCard key={post._id} post={post} onLike={handleLike} />
            ))}
          </Masonry>
        )}

        {/* UPLOAD MODAL */}
        {showUpload && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-lg bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FaImage /> Share Masterpiece
                </h2>
                <button onClick={() => setShowUpload(false)} className="text-gray-400 hover:text-white"><FaTimes /></button>
              </div>

              <form onSubmit={handleUpload} className="space-y-4">
                {/* Type Selector */}
                <div className="flex gap-2">
                  {[
                    { value: 'image', icon: <FaImage />, label: 'Image' },
                    { value: 'video', icon: <FaVideo />, label: 'Video' },
                    { value: 'text', icon: <FaAlignLeft />, label: 'Text' },
                  ].map(opt => (
                    <button key={opt.value} type="button"
                      onClick={() => setUploadType(opt.value)}
                      className={`px-4 py-2 rounded-xl border ${uploadType === opt.value ? 'border-purple-500' : 'border-white/10'} flex items-center gap-2`}>
                      {opt.icon} {opt.label}
                    </button>
                  ))}
                </div>

                {/* File Input */}
                {uploadType !== 'text' && (
                  <div>
                    <input
                      type="file"
                      accept={uploadType === 'image' ? 'image/*' : 'video/*'}
                      onChange={e => setMediaFile(e.target.files[0])}
                      id="fanart-file"
                      required
                      className="hidden"
                    />
                    <label htmlFor="fanart-file" className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-purple-500">
                      {mediaFile ? (
                        <div className="text-center">
                          <p>✓ {mediaFile.name}</p>
                          <p>{(mediaFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      ) : (
                        <p>Click to select {uploadType} (up to 100MB)</p>
                      )}
                    </label>
                  </div>
                )}

                <div>
                  <label className="block mb-1">Description</label>
                  <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="Tell us about your art..."
                    rows="4"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:ring-1 focus:ring-purple-500 outline-none"
                  />
                </div>

                <div className="text-xs text-gray-400 flex gap-1 items-center">
                  <span>ℹ️</span>
                  <p>Your post will be submitted for community moderation.</p>
                </div>

                <button type="submit" disabled={uploading} className="w-full py-3 rounded-xl bg-purple-500 hover:bg-purple-600 transition">
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