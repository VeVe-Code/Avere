import axios from '../../helper/axios'
import React from 'react'
import { Link } from 'react-router-dom'

function adminnetworkCard({n,ondeleted}) {
  let deletenetwork = async (e) =>{
    e.preventDefault()
    let res = await axios.delete('/api/network/' + n._id)
    if(res.status === 200 ){
      ondeleted(n._id)
    }
  }
  
  return (
       <div
   
    className="rounded-xl border bg-white p-6 shadow-sm"
  >
     <img className="mx-auto h-64 object-contain " src={  import.meta.env.VITE_BACKEND_ASSET_URL+ n.photo} alt="" />
    <h2 className="text-lg font-semibold">
    {n.title}
    </h2>
    <p className="mt-2 text-slate-600">
     {n.description}
    </p>
       <Link to={`/admin/adminnetwork/${n._id}`} className="inline-block text-blue-500 hover:underline font-medium text-sm sm:text-base">
                     Details →
                   </Link>
    <div className="mt-5 flex gap-3">
     
    
   <Link to={'/admin/adminnetwork/edit/'+n._id}>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
        Edit
      </button></Link>
      
      <button onClick={deletenetwork} className="border px-4 py-2 rounded-lg">
        Delete
      </button>
    </div>
  </div>
  )
}

export default adminnetworkCard