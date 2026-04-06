import { useState, useEffect } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { FaCheck, FaTimes, FaTrash, FaImage, FaVideo, FaAlignLeft, FaFilter } from 'react-icons/fa'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const FanArtModeration = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')

  useEffect(() => { fetchPosts() }, [])

  const fetchPosts = async () => {
    try {
      const { data } = await api.get('/admin/fanart')
      setPosts(data)
    } catch { toast.error('Failed to fetch posts') }
    finally { setLoading(false) }
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
    if (type === 'image') return <FaImage className="text-blue-400" />
    if (type === 'video') return <FaVideo className="text-red-400" />
    return <FaAlignLeft className="text-green-400" />
  }

  const statusColor = (s) => {
    if (s === 'approved') return 'bg-green-500/20 text-green-400 border-green-500/30'
    if (s === 'rejected') return 'bg-red-500/20 text-red-400 border-red-500/30'
    return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 p-6 space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-4 flex-wrap">
        {['pending','approved','rejected','all'].map(f => (
          <button
            key={f}
            className={`px-4 py-2 rounded font-semibold transition-all ${filter === f ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-purple-500 hover:text-white'}`}
            onClick={() => setFilter(f)}
          >
            {f} <span className="text-gray-300">({counts[f]})</span>
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-gray-500 flex flex-col items-center gap-2">
          <FaFilter className="text-4xl text-gray-400" />
          <p>No {filter} posts</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(post => (
            <div key={post._id} className="bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:scale-[1.02] transition-all">
              {/* Media Preview */}
              {post.type === 'image' && post.mediaUrl && (
                <div className="h-48 bg-gray-800 flex items-center justify-center overflow-hidden">
                  <img src={resolveUrl(post.mediaUrl)} alt={post.content} className="object-cover h-full w-full"/>
                </div>
              )}
              {post.type === 'video' && post.mediaUrl && (
                <div className="h-48 bg-gray-800 flex items-center justify-center overflow-hidden">
                  <video src={resolveUrl(post.mediaUrl)} controls className="h-full w-full object-cover"/>
                </div>
              )}

              {/* Info */}
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">{typeIcon(post.type)} <span className="text-gray-400">{post.type}</span></div>
                  <span className={`px-2 py-1 rounded text-sm font-semibold border ${statusColor(post.status)}`}>{post.status}</span>
                </div>
                <p className="text-gray-100">{post.content}</p>
                <div className="flex justify-between text-sm text-gray-400">
                  <div>@{post.user?.username} | {new Date(post.createdAt).toLocaleDateString()}</div>
                  <div>❤️ {Array.isArray(post.likes)? post.likes.length : 0}</div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-2">
                  {post.status !== 'approved' && (
                    <button onClick={() => handleApprove(post._id)} className="flex-1 bg-green-600 hover:bg-green-700 py-1 rounded text-white flex items-center justify-center gap-2">
                      <FaCheck /> Approve
                    </button>
                  )}
                  {post.status !== 'rejected' && (
                    <button onClick={() => handleReject(post._id)} className="flex-1 bg-yellow-600 hover:bg-yellow-700 py-1 rounded text-white flex items-center justify-center gap-2">
                      <FaTimes /> Reject
                    </button>
                  )}
                  <button onClick={() => handleDelete(post._id)} className="flex-1 bg-red-600 hover:bg-red-700 py-1 rounded text-white flex items-center justify-center gap-2">
                    <FaTrash /> Delete
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