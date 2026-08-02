import { useContext, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import axios from '../../helper/axios.js'
import { AuthContext } from '../../contexts/AuthContext.jsx'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'

function AdminUsers() {
  let [users, setUsers] = useState([])
  let [error, setError] = useState('')
  let [loading, setLoading] = useState(true)
  let [deleteTarget, setDeleteTarget] = useState(null)
  let [deleting, setDeleting] = useState(false)
  let { user: me, authReady } = useContext(AuthContext)

  let fetchUsers = async () => {
    try {
      setLoading(true)
      let res = await axios.get('/api/users')
      setUsers(res.data)
      setError('')
    } catch (e) {
      setError(
        e.response?.data?.msg || e.response?.data?.error || 'Failed to load users'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (me?.role === 'owner') fetchUsers()
  }, [me])

  if (authReady && me && me.role !== 'owner') {
    return <Navigate to="/admin/adminservice" replace />
  }

  let changeRole = async (id, role) => {
    try {
      setError('')
      let res = await axios.patch('/api/users/' + id + '/role', { role })
      setUsers((prev) => prev.map((u) => (u._id === id ? res.data.user : u)))
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to update role')
      fetchUsers()
    }
  }

  let confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      setDeleting(true)
      setError('')
      await axios.delete('/api/users/' + deleteTarget._id)
      setUsers((prev) => prev.filter((u) => u._id !== deleteTarget._id))
      setDeleteTarget(null)
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to delete user')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mt-2 mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500 mb-1">
              Owner only
            </p>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Users</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage roles and accounts. Only the owner can access this page.
            </p>
          </div>
        </div>

        {error && (
          <p className="mb-4 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-4 py-12 text-center">
                    <div className="inline-flex justify-center">
                      <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : (
                <>
              {!!users.length &&
                users.map((u) => (
                  <tr key={u._id} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="px-4 py-3">
                      {u.name}
                      {me?._id === u._id && (
                        <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">(you)</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                      {u.phone || <span className="text-slate-400 dark:text-slate-500">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role || 'customer'}
                        onChange={(e) => changeRole(u._id, e.target.value)}
                        disabled={me?._id === u._id}
                        className="border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1 capitalize bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                      >
                        <option value="customer">customer</option>
                        <option value="admin">admin</option>
                        <option value="owner">owner</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setDeleteTarget(u)}
                        disabled={me?._id === u._id}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg disabled:opacity-40"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              {!users.length && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-6 text-center text-slate-500 dark:text-slate-400"
                  >
                    No users yet
                  </td>
                </tr>
              )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this user?"
        message={
          deleteTarget
            ? `“${deleteTarget.name || deleteTarget.email}” will be permanently removed.`
            : ''
        }
        confirmLabel="Yes"
        cancelLabel="No"
        busy={deleting}
        onCancel={() => !deleting && setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </>
  )
}

export default AdminUsers
