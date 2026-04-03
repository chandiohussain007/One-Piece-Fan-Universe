import { useState, useEffect } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { FaCheck, FaTimes, FaTrash, FaImage, FaVideo, FaAlignLeft, FaFilter } from 'react-icons/fa'

const API_BASE = 'http://localhost:5000'

const FanArtModeration = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const { data } = await api.get('/admin/fanart')
      setPosts(data)
    } catch (error) {
      toast.error('Failed to fetch posts')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    try {
      await api.put(`/admin/fanart/${id}/approve`)
      setPosts(posts.map(p => p._id === id ? { ...p, status: 'approved' } : p))
      toast.success('Post approved!')
    } catch { toast.error('Failed') }
  }

  const handleReject = async (id) => {
    try {
      await api.put(`/admin/fanart/${id}/reject`)
      setPosts(posts.map(p => p._id === id ? { ...p, status: 'rejected' } : p))
      toast.success('Post rejected')
    } catch { toast.error('Failed') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this post?')) return
    try {
      await api.delete(`/admin/fanart/${id}`)
      setPosts(posts.filter(p => p._id !== id))
      toast.success('Deleted')
    } catch { toast.error('Failed') }
  }

  const resolveUrl = (url) => url?.startsWith('http') ? url : `${API_BASE}${url}`

  const filtered = posts.filter(p => filter === 'all' ? true : p.status === filter)

  const counts = {
    all: posts.length,
    pending: posts.filter(p => p.status === 'pending').length,
    approved: posts.filter(p => p.status === 'approved').length,
    rejected: posts.filter(p => p.status === 'rejected').length,
  }

  const typeIcon = (type) => {
    if (type === 'image') return <FaImage  />
    if (type === 'video') return <FaVideo  />
    return <FaAlignLeft  />
  }

  const statusColor = (s) => {
    if (s === 'approved') return 'bg-green-500/20 text-green-400 border-green-500/30'
    if (s === 'rejected') return 'bg-red-500/20 text-red-400 border-red-500/30'
    return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
  }

  return (
    <div>
      {/* Filter Tabs */}
      <div>
        {['pending', 'approved', 'rejected', 'all'].map(f => (
          <button key={f}
            onClick={() => setFilter(f)}>
            {f} <span>({counts[f]})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div>
          <div></div>
        </div>
      ) : filtered.length === 0 ? (
        <div>
          <FaFilter  />
          <p>No {filter} posts</p>
        </div>
      ) : (
        <div>
          {filtered.map(post => (
            <div key={post._id}>
              {/* Media Preview */}
              {post.type === 'image' && post.mediaUrl && (
                <div>
                  <img src={resolveUrl(post.mediaUrl)}
                    alt={post.content}
                    
                  />
                </div>
              )}
              {post.type === 'video' && post.mediaUrl && (
                <div>
                  <video src={resolveUrl(post.mediaUrl)} controls  />
                </div>
              )}

              {/* Info */}
              <div>
                <div>
                  <div>
                    {typeIcon(post.type)}
                    <span>{post.type}</span>
                  </div>
                  <span>
                    {post.status}
                  </span>
                </div>

                <p>{post.content}</p>

                <div>
                  <div>
                    <p>@{post.user?.username}</p>
                    <p>{new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    ❤️ {Array.isArray(post.likes) ? post.likes.length : 0} likes
                  </div>
                </div>

                {/* Action Buttons */}
                <div>
                  {post.status !== 'approved' && (
                    <button onClick={() => handleApprove(post._id)}>
                      <FaCheck /> Approve
                    </button>
                  )}
                  {post.status !== 'rejected' && (
                    <button onClick={() => handleReject(post._id)}>
                      <FaTimes /> Reject
                    </button>
                  )}
                  <button onClick={() => handleDelete(post._id)}>
                    <FaTrash  />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FanArtModeration
