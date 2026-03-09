import axios from '../../helper/axios.js'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import KnowledgePagi from '../../components/admin/KnowledgePagi.jsx';
import AdminKnowledgeCard from '../../components/admin/AdminKnowledgeCard.jsx';

function adminknowledge() {
         
let [knowledge,setKnowledge] = React.useState([])
let [Links , setLinks] = useState(null)
let location = useLocation()
let searchQuery = new URLSearchParams(location.search)
let navigate = useNavigate()
let page = searchQuery.get('page') || 1

page = parseInt(page)
useEffect(()=>{
    let fetchknowledge = async() =>{
        let res = await axios.get('/api/knowledge?page=' + page);
        setKnowledge(res.data.data);
        setLinks(res.data.Links)
        scrollTo(0,0);
    }
    fetchknowledge()
    
},[page])





let ondeleted = (_id) => {
if(knowledge.length == 1 && page > 1 ){
 navigate('/admin/adminknowledge?page=' + (page-1))
}else{
   setKnowledge(prev => prev.filter(k => k._id !== _id))
}
}

  return (
   <>
      <div className="max-w-7xl mx-auto">
    
    <div className="flex justify-between items-center mt-7 ">
        <h1 className="text-2xl font-bold mb-6">KnowLedge</h1>
     <Link to='/admin/adminknowledge/create'>
        <button className="bg-blue-400 text-white py-3 px-2 rounded-2xl">Create Knowledge</button></Link>
    </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
       
       {!!knowledge.length &&(knowledge.map(k =>
        (
            <AdminKnowledgeCard key={k._id} k={k} ondeleted={ondeleted} />
        )
       ))}
        </div>

     
      </div>
      <div className='mt-5 mx-auto flex justify-center'>
       {!!Links && <KnowledgePagi Links={Links} page={page}/>}
      </div>
   </>
  )
}

export default adminknowledge