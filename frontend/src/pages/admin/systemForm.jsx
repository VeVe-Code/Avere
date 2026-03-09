import axios from '../../helper/axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function SystemForm() {
  let { id } = useParams()
  let [title, setTitle] = useState('')
  let [description, setDescription] = useState('')
  let [about, setAbout] = useState('')
  let navigate = useNavigate()
  let [file, setFile] = useState(null)
  let [preview, setPreview] = useState(null)
  let [error, setError] = useState({})

  let createsystem = async (e) => {
    try {
      setError({})
      e.preventDefault()

      let system = { title, about, description }
      let res

      if (id) {
        res = await axios.patch('/api/systems/' + id, system)
      } else {
        res = await axios.post('/api/systems', system)
      }

      if (file) {
        let formData = new FormData()
        formData.set('photo', file)

        await axios.post(`/api/systems/${res.data._id}/upload`, formData, {
          headers: { Accept: "multipart/form-data" }
        })
      }

      if (res.status === 200) {
        navigate('/admin/adminsystems')
      }
    } catch (e) {
      setError(e.response?.data?.errors || {})
    }
  }

  useEffect(() => {
    if (!id) return

    let fetchdata = async () => {
      let res = await axios.get('/api/systems/' + id)
      if (res.status === 200) {
        setTitle(res.data.title)
        setDescription(res.data.description)
        setAbout(res.data.about)
        setPreview(import.meta.env.VITE_BACKEND_URL + res.data.photo)
      }
    }
    fetchdata()
  }, [id])

  let upload = (e) => {
    let file = e.target.files[0]
    setFile(file)

    let reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="max-w-xl sm:max-w-2xl mx-auto px-4 sm:px-0 mt-10">
      <form
        onSubmit={createsystem}
        className="rounded-xl border bg-white p-4 sm:p-6 shadow-sm"
      >
        <h2 className="text-lg sm:text-xl font-semibold mb-6">
          {id ? "Edit" : "Create"} System
        </h2>

        {/* Image */}
        <div className="mb-5">
          <input type="file" onChange={upload} />
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="mt-3 w-full  object-contain rounded-lg border"
            />
          )}
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            System Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Enter system title"
            className="w-full rounded-lg border px-3 py-2 text-sm sm:text-base
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error.title && (
            <p className="text-red-600 text-xs sm:text-sm">
              {error.title.msg}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Short description"
            className="w-full rounded-lg border px-3 py-2 text-sm sm:text-base
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error.description && (
            <p className="text-red-600 text-xs sm:text-sm">
              {error.description.msg}
            </p>
          )}
        </div>

        {/* About */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            About
          </label>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            rows={5}
            placeholder="Detailed information"
            className="w-full rounded-lg border px-3 py-2 text-sm sm:text-base
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error.about && (
            <p className="text-red-600 text-xs sm:text-sm">
              {error.about.msg}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg border px-4 py-2 text-sm sm:text-base"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm sm:text-base
                       text-white hover:bg-blue-700"
          >
            {id ? "Edit" : "Create"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SystemForm
