import { useState, useEffect } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { FaTrash, FaYoutube, FaPlus, FaTimes } from 'react-icons/fa'

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
    } catch { toast.error('Failed to fetch') }
    finally { setLoading(false) }
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
    } catch { toast.error('Invalid YouTube URL or fetch failed') }
    finally { setAdding(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this video?')) return
    try {
      await api.delete(`/videos/${id}`)
      setVideos(videos.filter(v => v._id !== id))
      toast.success('Deleted')
    } catch { toast.error('Failed') }
  }

  return (
    <div>
      <div>
        <p>{videos.length} video{videos.length !== 1 ? 's' : ''} total</p>
        <button onClick={() => setShowForm(true)}>
          <FaPlus /> Add YouTube Video
        </button>
      </div>

      {loading ? (
        <div>
          <div></div>
        </div>
      ) : videos.length === 0 ? (
        <div>
          <FaYoutube  />
          <p>No videos added yet</p>
        </div>
      ) : (
        <div>
          {videos.map(video => (
            <div key={video._id}>
              <div>
                <img src={video.thumbnail} alt={video.title}  />
                <div>
                  <FaYoutube  />
                </div>
              </div>
              <div>
                <div>
                  <h3>{video.title}</h3>
                  <p>{new Date(video.createdAt).toLocaleDateString()}</p>
                </div>
                <button onClick={() => handleDelete(video._id)}>
                  <FaTrash  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showForm && (
        <div>
          <div>
            <div>
              <h2>
                <FaYoutube  /> Add YouTube Video
              </h2>
              <button onClick={() => setShowForm(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handleAdd}>
              <input type="url"
                value={youtubeUrl}
                onChange={e => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                
                required
              />
              <button type="submit"
                disabled={adding}>
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
