import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'
import { FaPlay, FaTimes, FaPlus, FaTrash, FaYoutube, FaSearch } from 'react-icons/fa'
import Masonry from 'react-masonry-css'

const VideosPage = () => {
  const { user } = useAuth()
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [adding, setAdding] = useState(false)
  const [search, setSearch] = useState('')

  const breakpointColumns = { default: 3, 1100: 3, 700: 2, 500: 1 }

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const { data } = await api.get('/videos')
      setVideos(data)
    } catch {
      console.error('Error fetching videos')
    } finally {
      setLoading(false)
    }
  }

  const handleAddVideo = async (e) => {
    e.preventDefault()
    if (!youtubeUrl.trim()) return
    setAdding(true)
    try {
      await api.post('/videos', { youtubeUrl })
      toast.success('Video added!')
      setYoutubeUrl('')
      setShowAddForm(false)
      fetchVideos()
    } catch {
      toast.error('Failed to add video. Check the YouTube URL.')
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    if (!window.confirm('Delete this video?')) return
    try {
      await api.delete(`/videos/${id}`)
      toast.success('Video deleted')
      setVideos(videos.filter(v => v._id !== id))
    } catch {
      toast.error('Failed to delete')
    }
  }

  const filtered = videos.filter(v =>
    v.title.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>Loading videos...</p>
      </div>
    )
  }

  return (
    <div className="bg-black text-white min-h-screen relative max-w-full overflow-x-hidden px-6 py-12">
      {/* Background Glows */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-purple-600 opacity-20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-pink-600 opacity-20 blur-[120px] rounded-full"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <FaYoutube className="text-4xl text-red-600" />
              <div>
                <h1 className="text-4xl font-bold">
                  Anime <span className="text-purple-400">Videos</span>
                </h1>
                <p className="text-gray-300">Watch curated anime clips, AMVs, and trailers</p>
              </div>
            </div>
            {user?.role === 'admin' && (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-500 transition flex items-center gap-2"
              >
                <FaPlus /> Add YouTube Video
              </button>
            )}
          </div>

          {/* Search */}
          <div className="mt-6 flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg max-w-md">
            <FaSearch />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search videos by title..."
              className="bg-transparent outline-none flex-1 text-white placeholder-gray-300"
            />
          </div>
        </div>

        {/* Video Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <FaYoutube className="text-6xl mx-auto text-red-600 mb-4" />
            <p className="text-gray-400 mb-4">No videos yet.</p>
            {user?.role === 'admin' && (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-500 transition"
              >
                + Add the first video
              </button>
            )}
          </div>
        ) : (
          <Masonry
            breakpointCols={breakpointColumns}
            className="flex w-auto gap-6"
            columnClassName="flex flex-col gap-6 w-full"
          >
            {filtered.map((video, idx) => (
              <div
                key={video._id}
                onClick={() => setSelectedVideo(video)}
                className="group cursor-pointer relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:bg-white/10 transition"
                style={{ animationDelay: `${0.1 * idx}s`, animationFillMode: 'forwards' }}
              >
                {/* Thumbnail */}
                <div className="relative">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-auto" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
                    <FaPlay className="text-3xl text-white" />
                  </div>
                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-600 px-2 py-1 text-xs rounded">
                    <FaYoutube /> YouTube
                  </div>
                  {user?.role === 'admin' && (
                    <button
                      onClick={(e) => handleDelete(video._id, e)}
                      className="absolute top-2 right-2 bg-white/20 hover:bg-white/40 p-1 rounded"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <h3 className="font-bold text-lg">{video.title}</h3>
                  <p className="text-gray-400 text-sm">{new Date(video.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </Masonry>
        )}

        {/* Video Player Modal */}
        {selectedVideo && (
          <div
            onClick={() => setSelectedVideo(null)}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          >
            <div onClick={e => e.stopPropagation()} className="relative w-full max-w-3xl bg-black rounded-xl overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-white/20">
                <h3 className="font-bold text-xl">{selectedVideo.title}</h3>
                <button onClick={() => setSelectedVideo(null)} className="text-white">
                  <FaTimes />
                </button>
              </div>
              <div className="aspect-video">
                <iframe
                  src={`${selectedVideo.embedUrl}?autoplay=1&rel=0`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={selectedVideo.title}
                />
              </div>
            </div>
          </div>
        )}

        {/* Add Video Modal */}
        {showAddForm && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-black rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <FaYoutube /> Add YouTube Video
                </h2>
                <button onClick={() => setShowAddForm(false)} className="text-white">
                  <FaTimes />
                </button>
              </div>
              <form onSubmit={handleAddVideo} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-gray-300">YouTube URL</label>
                  <input
                    type="url"
                    value={youtubeUrl}
                    onChange={e => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="bg-white/5 text-white px-3 py-2 rounded outline-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={adding}
                  className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-500 transition"
                >
                  {adding ? 'Adding...' : 'Add Video'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VideosPage