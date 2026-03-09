import axios from '../../helper/axios'
import React from 'react'
import { Link } from 'react-router-dom'

function AdminSystemCard({s,ondeleted}) {

    let deletedData =async (e) => {
        e.preventDefault()
        let res = await axios.delete('/api/systems/' + s._id)
        if(res.status ===200){
            
            ondeleted(s._id)
        }
    }
  return (
     <div
    
    className="rounded-xl border bg-white p-6 shadow-sm"
  >
     <img className="mx-auto h-64 object-contain " src={  import.meta.env.VITE_BACKEND_ASSET_URL+ s.photo} alt="" />
    <h2 className="text-lg font-semibold">
     {s.title}
    </h2>
    <p className="mt-2 text-slate-600">
    {s.description}
    </p>
    <Link to={`/admin/adminsystems/${s._id}`} className="inline-block text-blue-500 hover:underline font-medium text-sm sm:text-base">
                      Details →
                    </Link>
    <div className="mt-5 flex gap-3">
    
     <Link to={`/admin/adminsystems/edit/${s._id}`}>
      <button  className="bg-blue-600 text-white px-4 py-2 rounded-lg">
        Edit
      </button></Link>
     
      <button onClick={deletedData} className="border px-4 py-2 rounded-lg">
        Delete
      </button>
    </div>
  </div>
  )
}

export default AdminSystemCard