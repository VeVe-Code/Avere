import axios from '../../helper/axios'
import React from 'react'
import { Link } from 'react-router-dom'

function AdminServiceCard({service, onDelete}) {
  
  let deleteService = async() => {
    let res = await axios.delete('/api/service/' + service._id)
    if(res.status === 200){

     onDelete(service._id)
    }
  }
  
  return (
     <div
    key={service._id}
    className="rounded-xl border bg-white p-6 shadow-sm"
  >
     <img className="mx-auto h-64 object-contain " src={  import.meta.env.VITE_BACKEND_ASSET_URL+ service.photo} alt="" />
    <h2 className="text-lg font-semibold">
      {service.name}
    </h2>
    <p className="mt-2 text-slate-600">
      {service.description}
    </p>
      <Link to={`/admin/adminservice/${service._id}`} className="inline-block text-blue-500 hover:underline font-medium text-sm sm:text-base">
                   Details →
                 </Link>
    <div className="mt-5 flex gap-3">
      <Link to={`/admin/adminservice/edit/${service._id}`}>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
        Edit
      </button>
      </Link>
      <button onClick={deleteService} className="border px-4 py-2 rounded-lg">
        Delete
      </button>
    </div>
  </div>
  )
}

export default AdminServiceCard