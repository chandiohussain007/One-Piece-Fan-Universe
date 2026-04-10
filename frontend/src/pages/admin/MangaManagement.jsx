import { useState } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { FaSync, FaTrash } from 'react-icons/fa'

const MangaManagement = () => {
  const [syncing, setSyncing] = useState(false)
  const [rebuilding, setRebuilding] = useState(false)

  const handleManualSync = async () => {
    try {
      setSyncing(true)
      const res = await api.post('/manga/sync')
      toast.success(res.data.message || 'Sync started successfully!')
    } catch (error) {
      toast.error('Failed to start sync: ' + (error.response?.data?.message || error.message))
    } finally {
      setSyncing(false)
    }
  }

  const handleFullRebuild = async () => {
    if (!window.confirm('WARNING: This will CLEAR all manga chapters and start syncing from scratch. Are you sure?')) {
      return
    }
    
    try {
      setRebuilding(true)
      const res = await api.post('/manga/rebuild')
      toast.success(res.data.message || 'Full rebuild started!')
    } catch (error) {
      toast.error('Failed to rebuild: ' + (error.response?.data?.message || error.message))
    } finally {
      setRebuilding(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-purple-400">Automated Manga Management</h1>
        <p className="text-gray-400">
          The Manga system runs autonomously. It regularly queries MangaDex to sync the latest chapters. Use these controls if you need to manually force an update.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 flex flex-col space-y-4">
          <h2 className="text-xl font-semibold text-blue-400">Manual Sync</h2>
          <p className="text-gray-400 text-sm">
            Fetch new chapters immediately from MangaDex without waiting for the next 6-hour cycle. Only adds new chapters.
          </p>
          <button
            onClick={handleManualSync}
            disabled={syncing || rebuilding}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded shadow-lg transition-all"
          >
            <FaSync className={syncing ? 'animate-spin' : ''} /> {syncing ? 'Syncing...' : 'Run Manual Sync'}
          </button>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 flex flex-col space-y-4">
          <h2 className="text-xl font-semibold text-red-500">Full Rebuild</h2>
          <p className="text-gray-400 text-sm">
            Wipes the local database of all Manga Chapter entries. Useful if categories break or you want a completely fresh database.
          </p>
          <button
            onClick={handleFullRebuild}
            disabled={syncing || rebuilding}
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded shadow-lg transition-all"
          >
            <FaTrash /> {rebuilding ? 'Rebuilding...' : 'Run Full Rebuild'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default MangaManagement