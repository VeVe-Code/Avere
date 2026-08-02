import React, { useEffect, useState } from 'react'
import AdminsystemCard from '../../components/admin/AdminSystemCard.jsx'
import axios from '../../helper/axios.js'
import Systempagi from '../../components/admin/AdminPagination.jsx'
import {Link, useLocation, useNavigate } from 'react-router-dom'

function adminsystem() {
    let location = useLocation()
    let navigate = useNavigate()
    let searchQuery = new URLSearchParams(location.search)
    let page = searchQuery.get('page') || 1 
    page = parseInt(page)
    let [system, setSystem] = useState([])
    let [links,setLinks] = useState(null)
    let [loading, setLoading] = useState(true)

    useEffect(()=>{
 let fetchsystem = async ()=>{
  try {
    setLoading(true)
    let res = await axios.get('/api/systems?page=' + page)
    setSystem(res.data.data)
    setLinks(res.data.links)
  } catch (err) {
    console.error(err)
  } finally {
    setLoading(false)
  }
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

    let onHiddenChange = (_id, hidden) => {
      setSystem(prev => prev.map(s => s._id === _id ? { ...s, hidden } : s))
    }

 
  return (
   
     <>
            <div className="max-w-7xl mx-auto">
    
    <div className="flex justify-between items-center mt-7 ">
        <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">System</h1>
             <Link to="/admin/adminsystems/create">  <button className="bg-blue-400 text-white py-3 px-2 rounded-2xl">Create System</button></Link>
    </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
       
           {!!system.length && system.map(s=>(
             <AdminsystemCard s={s} key={s._id} ondeleted={ondeleted} onHiddenChange={onHiddenChange}></AdminsystemCard>
           ))}
           {!system.length && (
             <p className="col-span-full text-center text-slate-500 dark:text-slate-400 py-12 text-sm">No systems yet.</p>
           )}
        </div>
      )}

      
      </div>

      <div className='flex mt-10 mx-auto justify-center'>
       {!loading && links && (
         <Systempagi basePath="/admin/adminsystems" links={links} page={page} />
       )}
      </div>
     </>

  )
}

export default adminsystem