import axios from '../../helper/axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function securityForm() {
  let { id } = useParams()
  let [title, setTitle] = useState('')
  let [description, setDescription] = useState('')
  let [about, setAbout] = useState('')
  let [error, setError] = useState({})   // must be object
  let [file, setFile] = useState(null)
  let [preview, setPreview] = useState(null)
  let navigate = useNavigate()
 
  let createSecurity = async (e) => {
    try {
      e.preventDefault()
      setError({})   // ✅ FIX

      let security = { title, description, about }

      let res 
      if (id) {
        res = await axios.patch('/api/security/' + id, security)
      } else {
        res = await axios.post('/api/security', security)
      }

      // upload photo
      if (file) {
        let formData = new FormData()
        formData.set('photo', file)

        await axios.post(`/api/security/${res.data._id}/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
      }

      if (res.status === 200) {
        setError({})   // ✅ FIX
        navigate('/admin/adminSecurity')
      }

    } catch (e) {
      if (e.response?.data?.errors) {
        setError(e.response.data.errors)
      } else {
        console.log(e)
      }
    }
  }
 
  useEffect(() => {
    if (id) {
      let fetchdata = async () => {
        let res = await axios.get('/api/security/' + id)
        if (res.status === 200) {
          setTitle(res.data.title)
          setDescription(res.data.description)
          setAbout(res.data.about)
          setPreview( import.meta.env.VITE_BACKEND_ASSET_URL + res.data.photo)
        }
      }
      fetchdata()
    }
  }, [id])

  let upload = (e) => {
    let file = e.target.files[0]
    setFile(file)

    let fileReader = new FileReader()
    fileReader.onload = (e) => {
      setPreview(e.target.result)
    }
    fileReader.readAsDataURL(file)
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <form className="rounded-xl border bg-white p-6 shadow-sm" onSubmit={createSecurity} >
        <h2 className="text-xl font-semibold mb-6">{id ? 'edit' : 'Create'} Security</h2>

        <div className='mb-4'>
          <input type="file" onChange={upload}/>
          {preview && <img src={preview} alt="" />}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Service title</label>
          <input
            value={title}
            onChange={e=>setTitle(e.target.value)} 
            type="text"
            className="w-full rounded-lg border px-3 py-2"
          />
          {error?.title && <p className="text-red-600 text-sm">{error.title.msg}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={e=>setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-lg border px-3 py-2"
          />
          {error?.description && <p className="text-red-600 text-sm">{error.description.msg}</p>}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">About</label>
          <textarea
            value={about}
            onChange={e=>setAbout(e.target.value)}
            rows={5}
            className="w-full rounded-lg border px-3 py-2"
          />
          {error?.about && <p className="text-red-600 text-sm">{error.about.msg}</p>}
        </div>

        <div className="flex justify-end gap-3">
          <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-white">
            {id ? "edit" : "Create"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default securityForm
