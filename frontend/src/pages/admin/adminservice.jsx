import { useEffect, useState } from "react";
import axios from "../../helper/axios.js";
import AdminserviceCard from "../../components/admin/AdminserviceCard.jsx";
import Pagination from "../../components/admin/pagination.jsx";
import {Link, useLocation, useNavigate } from "react-router-dom";
function Adminservice() {

  let [services, setServices] = useState([])
 let location= useLocation()
 let [links,setLinks] = useState(null)
  let navigate = useNavigate()
 let searchQuery = new URLSearchParams(location.search);
 let page = searchQuery.get('page') || 1;
 page = parseInt(page) ? parseInt(page) : 1 ;
 

  useEffect(()=>{
    let fetchservices = async() =>{
        let res = await axios('/api/service?page='+ page)
        let data = res.data
        setServices(data.data)
        setLinks(data.links)
        window.scrollTo(0,0);
    }
    fetchservices()
  },[page])

 let onDelete = (_id) => {
  if(services.length === 1 && page > 1){
   navigate('/admin/adminservice?page=' + (page - 1))
  }else{
  setServices(prev => prev.filter(service => service._id !== _id))
 }}
  return (
   <>
    <div className="max-w-7xl mx-auto">
    
    <div className="flex justify-between items-center mt-7 ">
        <h1 className="text-2xl font-bold mb-6">Services</h1>
      <Link to="/admin/adminservice/create">  <button className="bg-blue-400 text-white py-3 px-2 rounded-2xl">Create Service</button></Link>
    </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
       
{!!services.length && (services.map(service => (
 <AdminserviceCard key={service._id} service={service} onDelete={onDelete}/>
)))}
        </div>

     
      </div>
   
    <div className="flex justify-center mt-10">
       { !!links && <Pagination links={links} page={page} />}
    </div>
   </>
   
  );
}

export default Adminservice;
