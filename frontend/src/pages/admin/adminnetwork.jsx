import React, { useEffect, useState } from 'react'
import AdminNetworkCard from '../../components/admin/adminnetworkCard' 
import axios from '../../helper/axios'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import NetWorkPagi from '../../components/admin/AdminPagination'

function adminnetwork() {
  let location = useLocation()
  let searchgQuery = new URLSearchParams(location.search)

  let page = parseInt(searchgQuery.get("page")) || 1;   // ✅ FIX

  let [network, setNetwork] = useState([])
  let [links, setLinks] = useState(null)
  let [loading, setLoading] = useState(true)
  let navigate = useNavigate()

  useEffect(() => {
    let fetchNetWork = async () => {
      try {
        setLoading(true)
        let res = await axios.get('/api/network?page=' + page)
        setNetwork(res.data.data)
        setLinks(res.data.links)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchNetWork()
    scrollTo(0,0)
  }, [page])

  let ondeleted = (_id) => {
     if(network.length === 1 && page > 1 ){
            navigate(`/admin/adminnetwork?page=${page-1}`)
     }else{
       setNetwork(prev => prev.filter(n => n._id !== _id))
     }
  }

  let onHiddenChange = (_id, hidden) => {
    setNetwork(prev => prev.map(n => n._id === _id ? { ...n, hidden } : n))
  }

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mt-7 ">
          <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">NetWork</h1>
          <Link to="/admin/adminnetwork/create"><button className="bg-blue-400 text-white py-3 px-2 rounded-2xl">Create NetWork</button></Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {network.map(n => (
            <AdminNetworkCard n={n} key={n._id} ondeleted={ondeleted} onHiddenChange={onHiddenChange}/>
          ))}
          {!network.length && (
            <p className="col-span-full text-center text-slate-500 dark:text-slate-400 py-12 text-sm">No network items yet.</p>
          )}
        </div>
        )}
      </div>

      <div className='flex mx-auto justify-center mt-10'>
        {!loading && links && (
          <NetWorkPagi basePath="/admin/adminnetwork" links={links} page={page} />
        )}
      </div>
    </>
  )
}

export default adminnetwork
