import axios from '../../helper/axios.js'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import AdminSecurityCard from '../../components/admin/AdminSecurityCard.jsx'
import SecurityPagi from '../../components/admin/AdminPagination.jsx'
import { Link, useLocation, useNavigate} from 'react-router-dom'


function adminsecurity() {
  
  let location = useLocation()
  let searchQuery = new URLSearchParams(location.search)
  let navigate = useNavigate()
   let page = searchQuery.get('page') || 1;
  page = parseInt(page) 
let [security, setSecrity] = useState([])
let [links, setLinks] = useState(null)
let [loading, setLoading] = useState(true)
useEffect(()=>{
 let fetchsecurity  = async()=>{
  try {
    setLoading(true)
    let res = await axios.get("/api/security?page=" + page)
    let data = res.data
    setSecrity(data.data)
    setLinks(data.links)
    scrollTo(0,0)
  } catch (err) {
    console.error(err)
  } finally {
    setLoading(false)
  }
 }
 fetchsecurity()
},[page])



let ondeleted = (_id) => {
  if(security.length === 1 && page > 1){
      navigate(`/admin/adminsecurity?page=${page-1}`)
  }
 else{
 setSecrity(prev => prev.filter(s => s._id !== _id))
 }
}

let onHiddenChange = (_id, hidden) => {
  setSecrity(prev => prev.map(s => s._id === _id ? { ...s, hidden } : s))
}


  return (
<>
 <div className="max-w-7xl mx-auto">
    
    <div className="flex justify-between items-center mt-7 ">
        <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Security</h1>
       <Link to ="/admin/adminSecurity/create">
        <button className="bg-blue-400 text-white py-3 px-2 rounded-2xl">Create Security</button></Link>
    </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
       
   {!!security.length && security.map(s => (
       <AdminSecurityCard s={s} key={s._id} ondeleted={ondeleted} onHiddenChange={onHiddenChange}></AdminSecurityCard>
   ))}
   {!security.length && (
     <p className="col-span-full text-center text-slate-500 dark:text-slate-400 py-12 text-sm">No security items yet.</p>
   )}
        </div>
      )}
     
      </div>
   <div className='mt-3.5 mx-auto flex justify-center'>
       {!loading && !!links && (
         <SecurityPagi basePath="/admin/adminsecurity" links={links} page={page} />
       )}
   </div>
</>
  )
}

export default adminsecurity

