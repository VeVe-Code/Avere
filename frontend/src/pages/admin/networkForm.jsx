import axios from '../../helper/axios'
import assetUrl from '../../helper/assetUrl'
import { validateImageFile } from '../../helper/validateImage'
import {
  validateContentForm,
  hasFieldErrors,
  normalizeServerErrors,
} from '../../helper/formValidation'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import RichTextEditor from '../../components/RichTextEditor'
import {
  AdminFormCard,
  FormSection,
  FormField,
  FormErrorBanner,
  ImageDropzone,
  FormActions,
  fieldClass,
} from '../../components/admin/AdminFormUI'

function NetworkForm() {
  let { id } = useParams()
  let navigate = useNavigate()

  let [title, setTitle] = useState('')
  let [description, setDescription] = useState('')
  let [about, setAbout] = useState('')
  let [hidden, setHidden] = useState(false)
  let [file, setFile] = useState(null)
  let [error, setError] = useState({})
  let [formError, setFormError] = useState('')
  let [preview, setPreview] = useState(null)
  let [categories, setCategories] = useState([])
  let [category, setCategory] = useState('')
  let [saving, setSaving] = useState(false)

  let clearField = (key) =>
    setError((prev) => {
      if (!prev[key]) return prev
      let next = { ...prev }
      delete next[key]
      return next
    })

  let createNetwork = async (e) => {
    e.preventDefault()
    setFormError('')

    let clientErrors = validateContentForm(
      { title, description, about, category },
      { requireCategory: true }
    )
    if (file) {
      let imgErr = validateImageFile(file)
      if (imgErr) clientErrors.photo = { msg: imgErr }
    }
    if (hasFieldErrors(clientErrors)) {
      setError(clientErrors)
      return
    }
    setError({})

    try {
      setSaving(true)
      let network = { title, description, about, category, hidden }
      let res

      if (id) {
        res = await axios.patch(`/api/network/${id}`, network)
      } else {
        res = await axios.post('/api/network', network)
      }

      if (file) {
        let formData = new FormData()
        formData.append('photo', file)
        await axios.post(`/api/network/${res.data._id}/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      }

      if (res.status === 200 || res.status === 201) {
        navigate('/admin/adminnetwork')
      }
    } catch (e) {
      if (e.response?.data?.errors) {
        setError(normalizeServerErrors(e.response.data))
      } else {
        setFormError(e.response?.data?.msg || e.message || 'Save failed')
      }
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    let initForm = async () => {
      let catRes = await axios.get('/api/publiccategory')
      if (catRes.status === 200) setCategories(catRes.data)

      if (id) {
        let res = await axios.get('/api/network/' + id)
        if (res.status === 200) {
          setTitle(res.data.title || '')
          setDescription(res.data.description || '')
          setAbout(res.data.about || '')
          setHidden(Boolean(res.data.hidden))
          setCategory(res.data.category?._id || res.data.category || '')
          if (res.data.photo) setPreview(assetUrl(res.data.photo))
        }
      }
    }
    initForm()
  }, [id])

  let upload = (e) => {
    let selected = e.target.files[0]
    if (!selected) return
    let imgErr = validateImageFile(selected)
    if (imgErr) {
      setFormError(imgErr)
      setFile(null)
      e.target.value = ''
      return
    }
    setFormError('')
    setFile(selected)
    let fileReader = new FileReader()
    fileReader.onload = (ev) => setPreview(ev.target.result)
    fileReader.readAsDataURL(selected)
  }

  return (
    <AdminFormCard
      title={id ? 'Edit network' : 'Create network'}
      subtitle="Fill each step below. Preview is for the list; About is the full page."
      onSubmit={createNetwork}
      footer={
        <FormActions
          onCancel={() => navigate('/admin/adminnetwork')}
          saving={saving}
          isEdit={!!id}
        />
      }
    >
      <FormErrorBanner message={formError} errors={error} />

      <FormSection step="1" title="Cover image" hasError={Boolean(error.photo)}>
        <ImageDropzone
          preview={preview}
          onChange={(e) => {
            clearField('photo')
            upload(e)
          }}
          error={error.photo?.msg}
        />
      </FormSection>

      <FormSection
        step="2"
        title="Basic info"
        hasError={Boolean(error.title || error.description || error.category)}
      >
        <FormField label="Title" required error={error.title?.msg}>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              clearField('title')
            }}
            type="text"
            placeholder="Network title"
            className={fieldClass}
            aria-invalid={Boolean(error.title)}
          />
        </FormField>

        <FormField
          label="List preview"
          required
          hint="Short text on the list card"
          error={error.description?.msg}
        >
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value)
              clearField('description')
            }}
            rows={3}
            placeholder="One or two short sentences..."
            className={fieldClass}
            aria-invalid={Boolean(error.description)}
          />
        </FormField>

        <FormField label="Category" required error={error.category?.msg}>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value)
              clearField('category')
            }}
            className={fieldClass}
            aria-invalid={Boolean(error.category)}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="Visibility"
          hint="Hidden items stay in admin but are not shown on the public site."
        >
          <label className="flex items-center gap-3 cursor-pointer select-none rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3">
            <input
              type="checkbox"
              checked={hidden}
              onChange={(e) => setHidden(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-800 dark:text-slate-200">
              Hide from public site
            </span>
          </label>
        </FormField>
      </FormSection>

      <FormSection step="3" title="Full detail" hasError={Boolean(error.about)}>
        <FormField
          label="About"
          required
          hint="Shown on the detail page — use the toolbar"
          error={error.about?.msg}
        >
          <RichTextEditor
            value={about}
            onChange={(v) => {
              setAbout(v)
              clearField('about')
            }}
            placeholder="Write the full network detail..."
            minHeightClass="min-h-[220px]"
          />
        </FormField>
      </FormSection>
    </AdminFormCard>
  )
}

export default NetworkForm
