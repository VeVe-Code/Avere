import axios from '../../helper/axios.js'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import AdminSecurityCard from '../../components/admin/AdminSecurityCard.jsx'
import SecurityPagi from '../../components/admin/securityPagi.jsx'
import { Link, useLocation, useNavigate} from 'react-router-dom'


function adminsecurity() {
  
  let location = useLocation()
  let searchQuery = new URLSearchParams(location.search)
  let navigate = useNavigate()
   let page = searchQuery.get('page') || 1;
  page = parseInt(page) 
let [security, setSecrity] = useState([])
let [links, setLinks] = useState(null)
useEffect(()=>{
 let fetchsecurity  = async()=>{
  let res = await axios.get("/api/security?page=" + page)
  let data = res.data
  setSecrity(data.data)
  setLinks(data.links)
  scrollTo(0,0)
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


  return (
<>
 <div className="max-w-7xl mx-auto">
    
    <div className="flex justify-between items-center mt-7 ">
        <h1 className="text-2xl font-bold mb-6">Security</h1>
       <Link to ="/admin/adminSecurity/create">
        <button className="bg-blue-400 text-white py-3 px-2 rounded-2xl">Create Security</button></Link>
    </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
       
   {!!security.length && security.map(s => (
       <AdminSecurityCard s={s} key={s._id} ondeleted={ondeleted}></AdminSecurityCard>
   ))}
        </div>
     
      </div>
   <div className='mt-3.5 mx-auto flex justify-center'>
       {!!links  && <SecurityPagi links={links} page={page}></SecurityPagi>}
   </div>
</>
  )
}

export default adminsecurity

