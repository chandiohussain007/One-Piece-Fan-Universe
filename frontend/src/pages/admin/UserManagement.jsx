import { useState, useEffect } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { FaUser, FaShieldAlt, FaBan, FaSearch } from 'react-icons/fa'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState(null)

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users')
      setUsers(data)
    } catch { toast.error('Failed to fetch users') }
    finally { setLoading(false) }
  }

  const handleUpdate = async (id, updates) => {
    setUpdating(id)
    try {
      const { data } = await api.put(`/admin/users/${id}`, updates)
      setUsers(users.map(u => u._id === id ? data : u))
      toast.success('User updated')
    } catch { toast.error('Failed to update') }
    finally { setUpdating(null) }
  }

  const toggleBan = (user) => {
    handleUpdate(user._id, { role: user.role, isBanned: !user.isBanned })
  }

  const toggleAdmin = (user) => {
    handleUpdate(user._id, { role: user.role === 'admin' ? 'user' : 'admin', isBanned: user.isBanned })
  }

  const filtered = users.filter(u =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* Search */}
      <div>
        <FaSearch  />
        <input type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by username or email..."
          
        />
      </div>

      <p>{filtered.length} user{filtered.length !== 1 ? 's' : ''}</p>

      {loading ? (
        <div>
          <div></div>
        </div>
      ) : (
        <div>
          {filtered.map(user => (
            <div key={user._id}>
              {/* User Info */}
              <div>
                <div>
                  {user.role === 'admin'
                    ? <FaShieldAlt  />
                    : <FaUser  />
                  }
                </div>
                <div>
                  <div>
                    <span>{user.username}</span>
                    {user.role === 'admin' && (
                      <span>Admin</span>
                    )}
                    {user.isBanned && (
                      <span>Banned</span>
                    )}
                  </div>
                  <p>{user.email}</p>
                  <p>Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Actions */}
              <div>
                <button onClick={() => toggleAdmin(user)}
                  disabled={updating === user._id}>
                  {user.role === 'admin' ? '↓ Demote' : '↑ Make Admin'}
                </button>
                <button onClick={() => toggleBan(user)}
                  disabled={updating === user._id}>
                  <FaBan  />
                  {user.isBanned ? 'Unban' : 'Ban'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserManagement
