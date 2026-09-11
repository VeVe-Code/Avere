import axios from '../../helper/axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import assetUrl from '../../helper/assetUrl'
import { validateImageFile } from '../../helper/validateImage'
import {
  AdminFormCard,
  FormSection,
  FormField,
  FormErrorBanner,
  ImageDropzone,
  FormActions,
  fieldClass,
} from '../../components/admin/AdminFormUI'

function HeroSlideForm() {
  let { id } = useParams()
  let navigate = useNavigate()

  let [order, setOrder] = useState(0)
  let [durationSeconds, setDurationSeconds] = useState(7)
  let [hidden, setHidden] = useState(false)
  let [file, setFile] = useState(null)
  let [preview, setPreview] = useState(null)
  let [hasExistingPhoto, setHasExistingPhoto] = useState(false)
  let [error, setError] = useState({})
  let [formError, setFormError] = useState('')
  let [saving, setSaving] = useState(false)

  const DURATION_OPTIONS = [5, 6, 7, 8, 9, 10]

  let clearField = (key) =>
    setError((prev) => {
      if (!prev[key]) return prev
      let next = { ...prev }
      delete next[key]
      return next
    })

  let save = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!id && !file) {
      setError({ photo: { msg: 'Please choose an image' } })
      return
    }
    if (file) {
      let imgErr = validateImageFile(file)
      if (imgErr) {
        setError({ photo: { msg: imgErr } })
        return
      }
    }
    setError({})

    try {
      setSaving(true)
      let payload = {
        order: Number(order) || 0,
        hidden,
        durationSeconds: Number(durationSeconds) || 7,
      }
      let res

      if (id) {
        res = await axios.patch('/api/heroslides/' + id, payload)
      } else {
        res = await axios.post('/api/heroslides', payload)
      }

      if (file) {
        let formData = new FormData()
        formData.append('photo', file)
        await axios.post(`/api/heroslides/${res.data._id}/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      }

      if (res.status === 200 || res.status === 201) {
        navigate('/admin/adminheroslides')
      }
    } catch (err) {
      setFormError(err.response?.data?.msg || err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    if (!id) return
    let fetchSlide = async () => {
      let res = await axios.get('/api/heroslides/' + id)
      if (res.status === 200) {
        setOrder(res.data.order ?? 0)
        setHidden(Boolean(res.data.hidden))
        let d = Number(res.data.durationSeconds)
        setDurationSeconds(
          Number.isFinite(d) && d >= 5 && d <= 10 ? Math.round(d) : 7
        )
        if (res.data.photo) {
          setPreview(assetUrl(res.data.photo))
          setHasExistingPhoto(true)
        }
      }
    }
    fetchSlide()
  }, [id])

  let upload = (e) => {
    let selectedFile = e.target.files[0]
    if (!selectedFile) return
    let imgErr = validateImageFile(selectedFile)
    if (imgErr) {
      setFormError(imgErr)
      setFile(null)
      e.target.value = ''
      return
    }
    setFormError('')
    clearField('photo')
    setFile(selectedFile)
    let fileReader = new FileReader()
    fileReader.onload = (ev) => setPreview(ev.target.result)
    fileReader.readAsDataURL(selectedFile)
  }

  return (
    <AdminFormCard
      title={id ? 'Edit hero slide' : 'Add hero slide'}
      subtitle="This photo appears in the home page background slider."
      onSubmit={save}
      footer={
        <FormActions
          onCancel={() => navigate('/admin/adminheroslides')}
          saving={saving}
          isEdit={!!id}
        />
      }
    >
      <FormErrorBanner message={formError} errors={error} />

      <FormSection step="1" title="Slide photo" hasError={Boolean(error.photo)}>
        <ImageDropzone
          preview={preview}
          onChange={upload}
          error={error.photo?.msg}
          hint={
            id && !file && hasExistingPhoto
              ? 'Optional: click to replace'
              : 'jpg, png, webp, gif — max 5MB'
          }
        />
      </FormSection>

      <FormSection step="2" title="Display">
        <FormField
          label="Order"
          hint="Lower numbers show first (0, 1, 2…)"
        >
          <input
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            type="number"
            min="0"
            className={fieldClass}
          />
        </FormField>

        <FormField
          label="Display duration"
          hint="How long this image stays before the next slide."
        >
          <select
            value={durationSeconds}
            onChange={(e) => setDurationSeconds(Number(e.target.value))}
            className={fieldClass}
          >
            {DURATION_OPTIONS.map((sec) => (
              <option key={sec} value={sec}>
                {sec} seconds
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="Visibility"
          hint="Hidden slides stay in admin but are not shown on the home page."
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
    </AdminFormCard>
  )
}

export default HeroSlideForm
