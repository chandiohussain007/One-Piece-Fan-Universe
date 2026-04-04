import { useState, useEffect } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { FaTrash, FaYoutube, FaPlus, FaTimes, FaPlay } from 'react-icons/fa'

const VideoManagement = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [adding, setAdding] = useState(false)

  useEffect(() => { fetchVideos() }, [])

  const fetchVideos = async () => {
    try {
      const { data } = await api.get('/videos')
      setVideos(data)
    } catch {
      toast.error('Failed to fetch')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    setAdding(true)
    try {
      await api.post('/videos', { youtubeUrl })
      toast.success('Video added!')
      setYoutubeUrl('')
      setShowForm(false)
      fetchVideos()
    } catch {
      toast.error('Invalid YouTube URL or fetch failed')
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this video?')) return
    try {
      await api.delete(`/videos/${id}`)
      setVideos(videos.filter(v => v._id !== id))
      toast.success('Deleted')
    } catch {
      toast.error('Failed')
    }
  }

  return (
    <div className="space-y-6 text-white">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">

        <p className="text-gray-400 text-sm">
          {videos.length} video{videos.length !== 1 ? 's' : ''} total
        </p>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 hover:scale-105 transition shadow-lg shadow-red-500/20"
        >
          <FaPlus /> Add YouTube Video
        </button>

      </div>

      {/* LOADING */}
      {loading ? (
        <div className="text-center text-gray-500 py-20">Loading videos...</div>
      ) : videos.length === 0 ? (

        /* EMPTY */
        <div className="text-center text-gray-500 py-20">
          <FaYoutube className="text-5xl mx-auto mb-4 opacity-40" />
          <p>No videos added yet</p>
        </div>

      ) : (

        /* GRID */
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          {videos.map(video => (
            <div
              key={video._id}
              className="group rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-red-500/40 transition backdrop-blur-md"
            >

              {/* THUMB */}
              <div className="relative overflow-hidden">

                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition duration-500"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">

                  <div className="p-4 rounded-full bg-red-600/80 backdrop-blur-md shadow-lg">
                    <FaPlay />
                  </div>

                </div>

                {/* YT ICON */}
                <div className="absolute top-3 left-3 bg-black/60 p-2 rounded-lg">
                  <FaYoutube className="text-red-500" />
                </div>

              </div>

              {/* INFO */}
              <div className="p-4 flex justify-between items-start gap-3">

                <div className="flex-1">
                  <h3 className="text-sm font-semibold line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(video.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(video._id)}
                  className="p-2 rounded-lg bg-red-600/20 hover:bg-red-600/40 transition"
                >
                  <FaTrash />
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center px-4">

          {/* CLICK OUTSIDE */}
          <div className="absolute inset-0" onClick={() => setShowForm(false)} />

          <div className="relative w-full max-w-md bg-black border border-white/10 rounded-2xl p-6 shadow-2xl">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="flex items-center gap-2 font-semibold">
                <FaYoutube className="text-red-500" />
                Add YouTube Video
              </h2>

              <button onClick={() => setShowForm(false)}>
                <FaTimes />
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleAdd} className="space-y-4">

              <input
                type="url"
                value={youtubeUrl}
                onChange={e => setYoutubeUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-red-500 outline-none"
                required
              />

              <button
                type="submit"
                disabled={adding}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 hover:scale-[1.02] transition"
              >
                {adding ? 'Adding...' : 'Add Video'}
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  )
}

export default VideoManagement