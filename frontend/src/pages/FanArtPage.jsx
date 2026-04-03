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

// ─── Comment Section Component ───────────────────────────────────────────────
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
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
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
      fetchComments()
    } catch { toast.error('Failed to post comment') }
    finally { setSubmitting(false) }
  }

  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`)
      fetchComments()
    } catch { toast.error('Failed to delete') }
  }

  const totalCount = comments.reduce((sum, c) => sum + 1 + (c.replies?.length || 0), 0)

  return (
    <div>
      <div>
        <h4>
          {totalCount} Comment{totalCount !== 1 ? 's' : ''}
        </h4>

        {loading ? (
          <div>
            <div></div>
          </div>
        ) : (
          <div>
            {comments.length === 0 && (
              <p>No comments yet. Be the first!</p>
            )}
            {comments.map(comment => (
              <div key={comment._id}>
                <div>
                  <div>
                    {comment.user?.username?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <div>
                      <span>@{comment.user?.username}</span>
                      <div>
                        {user && (
                          <button onClick={() => setReplyTo({ id: comment._id, username: comment.user?.username })}>
                            <FaReply  />
                          </button>
                        )}
                        {(user?._id === comment.user?._id || user?.role === 'admin') && (
                          <button onClick={() => handleDelete(comment._id)}>
                            <FaTrash  />
                          </button>
                        )}
                      </div>
                    </div>
                    <p>{comment.content}</p>
                  </div>
                </div>

                {comment.replies?.length> 0 && (
                  <div>
                    {comment.replies.map(reply => (
                      <div key={reply._id}>
                        <div>
                          {reply.user?.username?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <div>
                            <span>@{reply.user?.username}</span>
                            {(user?._id === reply.user?._id || user?.role === 'admin') && (
                              <button onClick={() => handleDelete(reply._id)}>
                                <FaTrash  />
                              </button>
                            )}
                          </div>
                          <p>{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {user ? (
          <form onSubmit={handleSubmit}>
            {replyTo && (
              <div>
                <span><FaReply /> Replying to @{replyTo.username}</span>
                <button type="button" onClick={() => setReplyTo(null)}>
                  <FaTimes />
                </button>
              </div>
            )}
            <div>
              <input type="text"
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Add a animated comment..."
                
              />
              <button type="submit"
                disabled={submitting || !text.trim()}>
                Post
              </button>
            </div>
          </form>
        ) : (
          <p>
            <a href="/login">Sign in</a> to join the conversation
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Fan Art Card ─────────────────────────────────────────────────────────────
const FanArtCard = ({ post, onLike }) => {
  const { user } = useAuth()
  const [showComments, setShowComments] = useState(false)

  const resolveUrl = (url) => url?.startsWith('http') ? url : `${API_BASE}${url}`
  const isLiked = user && Array.isArray(post.likes) && post.likes.includes(user._id)
  const likeCount = Array.isArray(post.likes) ? post.likes.length : 0

  return (
    <div>
      {/* Media */}
      {post.type === 'image' && post.mediaUrl && (
        <div>
          <img src={resolveUrl(post.mediaUrl)}
            alt={post.content}
            
            loading="lazy"
          />
          <div></div>
        </div>
      )}
      {post.type === 'video' && post.mediaUrl && (
        <video src={resolveUrl(post.mediaUrl)} controls  />
      )}

      {/* Content */}
      <div>
        <div>
          <div>
            <div>
              {post.user?.username?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <p>@{post.user?.username}</p>
              <p>{new Date(post.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          {post.type === 'text' && (
            <div>
              <FaAlignLeft />
            </div>
          )}
        </div>

        <p>{post.content}</p>

        {/* Actions */}
        <div>
          <button onClick={() => onLike(post._id)}>
            <FaHeart  />
            <span>{likeCount}</span>
          </button>
          <button onClick={() => setShowComments(!showComments)}>
            <FaComment  />
            <span>Discuss</span>
          </button>
        </div>
      </div>

      {showComments && <CommentSection postId={post._id} />}
    </div>
  )
}

// ─── Main Fan Art Page ────────────────────────────────────────────────────────
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
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
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
    } catch { toast.error('Upload failed') }
    finally { setUploading(false) }
  }

  const filtered = posts.filter(p =>
    p.content?.toLowerCase().includes(search.toLowerCase()) ||
    p.user?.username?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div>
      {/* Header */}
      <div>
        <div></div>
        <div></div>
        
        <div>
          <h1>
            Fan Art <span>Gallery</span>
          </h1>
          <p>
            Discover mesmerizing artwork crafted by the community. Share your passion, like, and discuss with fellow creators.
          </p>
          
          <div>
            {user && (
              <button onClick={() => setShowUpload(true)}>
                <FaUpload  /> Share Your Art
              </button>
            )}
          </div>

          {/* Search */}
          <div>
            <FaSearch  />
            <input type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search art or artist..."
              
            />
          </div>
        </div>
      </div>

      <div>
        {loading ? (
          <div>
            <div></div>
          </div>
        ) : filtered.length === 0 ? (
          <div>
            <div>
              <FaImage  />
            </div>
            <p>No artworks found</p>
            {user && (
              <button onClick={() => setShowUpload(true)}>
                Be the first to share your creation!
              </button>
            )}
          </div>
        ) : (
          <div>
            <Masonry
              breakpointCols={breakpointColumns}
              
              columnClassName="pl-6 bg-clip-padding">
              {filtered.map(post => (
                <FanArtCard key={post._id} post={post} onLike={handleLike} />
              ))}
            </Masonry>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div>
          <div>
            <div></div>
            
            <div>
              <h2>
                <FaImage  /> Share Masterpiece
              </h2>
              <button onClick={() => setShowUpload(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleUpload}>
              {/* Type selector */}
              <div>
                {[
                  { value: 'image', icon: <FaImage />, label: 'Image' },
                  { value: 'video', icon: <FaVideo />, label: 'Video' },
                  { value: 'text', icon: <FaAlignLeft />, label: 'Text' },
                ].map(opt => (
                  <button key={opt.value}
                    type="button"
                    onClick={() => setUploadType(opt.value)}>
                    {opt.icon} {opt.label}
                  </button>
                ))}
              </div>

              {/* File Input */}
              {uploadType !== 'text' && (
                <div>
                  <input type="file"
                    accept={uploadType === 'image' ? 'image/*' : 'video/*'}
                    onChange={e => setMediaFile(e.target.files[0])}
                    
                    id="fanart-file"
                    required
                  />
                  <label htmlFor="fanart-file">
                    {mediaFile ? (
                      <div>
                        <div>✓</div>
                        <p>{mediaFile.name}</p>
                        <p>{(mediaFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    ) : (
                      <>
                        <div>
                          {uploadType === 'image' ? <FaImage  /> : <FaVideo  />}
                        </div>
                        <p>Click to select {uploadType}</p>
                        <p>Supports up to 100MB</p>
                      </>
                    )}
                  </label>
                </div>
              )}

              <div>
                <label>Description</label>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Tell us about your art..."
                  
                  rows="4"
                  required
                />
              </div>

              <div>
                <span>ℹ️</span>
                <p>Your post will be submitted for community moderation and reviewed by an admin.</p>
              </div>

              <button type="submit"
                disabled={uploading}>
                {uploading ? 'Uploading to Server...' : 'Submit Post'}
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