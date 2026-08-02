
import axios from '../../helper/axios.js'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import EventsPagi from '../../components/admin/AdminPagination.jsx';
import AdminEventsCard from '../../components/admin/AdminEventsCard.jsx';

function adminevents() {
         
let [events,setEvents] = React.useState([])
let [Links , setLinks] = useState(null)
let [loading, setLoading] = useState(true)
let location = useLocation()
let searchQuery = new URLSearchParams(location.search)
let navigate = useNavigate()
let page = searchQuery.get('page') || 1

page = parseInt(page)
useEffect(()=>{
    let fetchevents = async() =>{
      try {
        setLoading(true)
        let res = await axios.get('/api/events?page=' + page);
        setEvents(res.data.data);
        setLinks(res.data.Links)
        scrollTo(0,0);
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchevents()
    
},[page])





let ondeleted = (_id) => {
if(events.length == 1 && page > 1 ){
 navigate('/admin/adminevents?page=' + (page-1))
}else{
   setEvents(prev => prev.filter(e => e._id !== _id))
}
}

let onHiddenChange = (_id, hidden) => {
  setEvents(prev => prev.map(e => e._id === _id ? { ...e, hidden } : e))
}

  return (
   <>
      <div className="max-w-7xl mx-auto">
    
    <div className="flex justify-between items-center mt-7 ">
        <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Events</h1>
     <Link to='/admin/adminevents/create'>
        <button className="bg-blue-400 text-white py-3 px-2 rounded-2xl">Create Events</button></Link>
    </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
       
       {!!events.length &&(events.map(e =>
        (
            <AdminEventsCard key={e._id} e={e} ondeleted={ondeleted} onHiddenChange={onHiddenChange} />
        )
       ))}
       {!events.length && (
         <p className="col-span-full text-center text-slate-500 dark:text-slate-400 py-12 text-sm">No events yet.</p>
       )}
        </div>
      )}

     
      </div>
      <div className='mt-5 mx-auto flex justify-center'>
       {!loading && !!Links && (
         <EventsPagi basePath="/admin/adminevents" links={Links} page={page} />
       )}
      </div>
   </>
  )
}

export default adminevents
