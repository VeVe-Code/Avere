import axios from '../../helper/axios'
import React from 'react'

function AdminCategorycard({ d, Ondelete, onEdit }) {

  const deleteData = async (e) => {
    e.preventDefault()
    let res = await axios.delete('/api/category/' + d._id)

    if (res.status === 200) {
      Ondelete(d._id)
    }
  }

  return (
    <div className="bg-blue-50 rounded shadow-xl px-4 py-3">
      <h1 className="text-lg font-semibold">{d.title}</h1>

      <div className="space-x-3 mt-3">
        <button
          onClick={deleteData}
          className="bg-red-600 text-white py-1 px-3 rounded-xl"
        >
          Delete
        </button>

        <button
          onClick={() => onEdit(d)}
          className="bg-blue-600 text-white py-1 px-3 rounded-xl"
        >
          Edit
        </button>
      </div>
    </div>
  )
}

export default AdminCategorycard
