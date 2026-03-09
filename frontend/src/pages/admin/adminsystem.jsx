import React, { useEffect, useState } from 'react'
import AdminsystemCard from '../../components/admin/AdminSystemCard.jsx'
import axios from '../../helper/axios.js'
import Systempagi from '../../components/admin/Systempagi.jsx'
import {Link, useLocation, useNavigate } from 'react-router-dom'

function adminsystem() {
    let location = useLocation()
    let navigate = useNavigate()
    let searchQuery = new URLSearchParams(location.search)
    let page = searchQuery.get('page') || 1 
    page = parseInt(page)
    let [system, setSystem] = useState([])
    let [links,setLinks] = useState(null)

    useEffect(()=>{
 let fetchsystem = async ()=>{
    let res = await axios.get('/api/systems?page=' + page)
    setSystem(res.data.data)
    setLinks(res.data.links)
 }
 fetchsystem()
    },[page])

    let ondeleted = (_id)=>{
        if(system.length === 1 && page > 1){
           navigate("/admin/adminsystems?page=" + (page-1) )
        }else{
              setSystem( prev => prev.filter(s => s._id !== _id))
        }
      
    }

 
  return (
   
     <>
            <div className="max-w-7xl mx-auto">
    
    <div className="flex justify-between items-center mt-7 ">
        <h1 className="text-2xl font-bold mb-6">System</h1>
             <Link to="/admin/adminsystems/create">  <button className="bg-blue-400 text-white py-3 px-2 rounded-2xl">Create System</button></Link>
    </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
       
           {!!system.length && system.map(s=>(
             <AdminsystemCard s={s} key={s._id} ondeleted={ondeleted}></AdminsystemCard>
           ))}
        </div>

      
      </div>

      <div className='flex mt-10 mx-auto justify-center'>
       {links && <Systempagi links={links} page={page}></Systempagi>}
      </div>
     </>

  )
}

export default adminsystem