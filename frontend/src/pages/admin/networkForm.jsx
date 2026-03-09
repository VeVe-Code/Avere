import axios from '../../helper/axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function networkForm() {
 let {id} = useParams()

 let [title,setTitle]=React.useState("")
    let [description,setDescription]=React.useState("")
    let [about,setAbout]=React.useState("")
    let[file , setFile] = useState(null)
    let[error, setError] = useState({})
    let navigate = useNavigate()
    let [preview, setPreview] = useState(null)
    


    let createNetwork = async(e) => {
       try {
         e.preventDefault()
        let network = {
            title,
            description,
            about,
        }
     
        
     
        
       let res
            if(id){
                res = await axios.patch(`/api/network/${id}` ,network)
            }else{
               res = await axios.post("/api/network",network)
            }

            let formData = new FormData;
              formData.set('photo',file)
            let uploadRes = await axios.post(`/api/network/${res.data._id}/upload`,formData,{
              headers :{
                Accept : "multipart/form-data"
              }
            })
            console.log(uploadRes)

             if(res.status === 200){
                navigate('/admin/adminnetwork')
             }
       } catch (e) {
       
            setError(e.response.data.errors)
       }
    }

    useEffect(()=>{
 if(id){
   let fetchdata = async ()=>{
  let res = await  axios.get('/api/network/' + id )
  if(res.status === 200){
    setTitle(res.data.title)
    setDescription(res.data.description)
    setAbout(res.data.about)
      setPreview( import.meta.env.VITE_BACKEND_ASSET_URL + res.data.photo)
   
  }
  }
  fetchdata()
  
 }

  
    },[id])
    
let upload = (e) => {
  let file= e.target.files[0]
  setFile(file)
  let fileReader = new FileReader
  fileReader.onload = (e) => {
 setPreview(e.target.result)
  }
  fileReader.readAsDataURL(file)
}

  return (
        <div className="max-w-2xl mx-auto mt-10">
      <form className="rounded-xl border bg-white p-6 shadow-sm" onSubmit={createNetwork} >
        <h2 className=
        "text-xl font-semibold mb-6">{id ? "Edit" : "Create"} NetWork</h2>


  <div className="mb-4">
         <input type="file" onChange={upload} />
        {preview && <img src={preview} alt="" />}
        </div>
        {/* Service Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Service title    
          </label>
          <input
           value={title}
           onChange={e=>setTitle(e.target.value)} 
            type="text"
            name="name"
            placeholder="Enter service name"
            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
              {error?.title && <p className="text-red-600 text-sm">{error.title.msg} Name</p>}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={e=>setDescription(e.target.value)}
         
            name="description"
            rows={3}
            placeholder="Short description"
            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
              {error?.description && <p className="text-red-600 text-sm">{error.description.msg} Description</p>}
        </div>

        {/* About */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            About
          </label>
          <textarea
            value={about}
            onChange={e=>setAbout(e.target.value)}
            name="about"
            rows={5}
            placeholder="Detailed information about the service"
            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
                {error?.about && <p className="text-red-600 text-sm">{error.about.msg} About</p>}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="rounded-lg border px-4 py-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
          {id ? "Edit" : "Create"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default networkForm