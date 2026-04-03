import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'
import { FaPlay, FaTimes, FaPlus, FaTrash, FaYoutube, FaSearch } from 'react-icons/fa'

const VideosPage = () => {
  const { user } = useAuth()
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [adding, setAdding] = useState(false)
  const [search, setSearch] = useState('')

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
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  const filtered = videos.filter(v =>
    v.title.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div>
        <div></div>
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
          <div>
            <FaYoutube  />
          </div>
          <div>
            <div>
              <h1>
                Anime <span>Videos</span>
              </h1>
              <p>Watch curated anime clips, AMVs, and trailers</p>
            </div>
          </div>
          {user?.role === 'admin' && (
            <button onClick={() => setShowAddForm(true)}>
              <FaPlus /> Add YouTube Video
            </button>
          )}
          {/* Search */}
          <div>
            <FaSearch  />
            <input type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search videos by title..."
              
            />
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div>
        {filtered.length === 0 ? (
          <div>
            <FaYoutube  />
            <p>No videos yet.</p>
            {user?.role === 'admin' && (
              <button onClick={() => setShowAddForm(true)}>
                + Add the first video
              </button>
            )}
          </div>
        ) : (
          <div>
            {filtered.map((video, index) => (
              <div key={video._id}
                onClick={() => setSelectedVideo(video)}
                
                style={{ animationDelay: `${0.1 * index}s`, animationFillMode: 'forwards' }}>
                {/* Thumbnail */}
                <div>
                  <img src={video.thumbnail}
                    alt={video.title}
                    
                  />
                  {/* Play Overlay */}
                  <div>
                    <div>
                      <FaPlay  />
                    </div>
                  </div>
                  {/* YouTube Badge */}
                  <div>
                    <FaYoutube /> YouTube
                  </div>
                  {/* Admin Delete */}
                  {user?.role === 'admin' && (
                    <button onClick={(e) => handleDelete(video._id, e)}>
                      <FaTrash  />
                    </button>
                  )}
                </div>

                {/* Info */}
                <div>
                  <h3>
                    {video.title}
                  </h3>
                  <p>
                    {new Date(video.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <div onClick={() => setSelectedVideo(null)}>
          <div onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div>
              <h3>{selectedVideo.title}</h3>
              <button onClick={() => setSelectedVideo(null)}>
                <FaTimes />
              </button>
            </div>
            {/* YouTube Embed */}
            <div>
              <iframe
                src={`${selectedVideo.embedUrl}?autoplay=1&rel=0`}
                
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={selectedVideo.title}
              />
            </div>
          </div>
        </div>
      )}

      {/* Add Video Modal (Admin) */}
      {showAddForm && (
        <div>
          <div>
            <div></div>
            <div>
              <h2>
                <FaYoutube  /> Add YouTube Video
              </h2>
              <button onClick={() => setShowAddForm(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleAddVideo}>
              <div>
                <label>YouTube URL</label>
                <input type="url"
                  value={youtubeUrl}
                  onChange={e => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  
                  required
                />
              </div>
              <button type="submit"
                disabled={adding}>
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