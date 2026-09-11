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

function PartnerForm() {
  let { id } = useParams()
  let navigate = useNavigate()

  let [name, setName] = useState('')
  let [order, setOrder] = useState(0)
  let [hidden, setHidden] = useState(false)
  let [file, setFile] = useState(null)
  let [preview, setPreview] = useState(null)
  let [hasExistingPhoto, setHasExistingPhoto] = useState(false)
  let [error, setError] = useState({})
  let [formError, setFormError] = useState('')
  let [saving, setSaving] = useState(false)

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
      setError({ photo: { msg: 'Please choose a logo image' } })
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
        name: name.trim(),
        order: Number(order) || 0,
        hidden,
      }
      let res

      if (id) {
        res = await axios.patch('/api/partners/' + id, payload)
      } else {
        res = await axios.post('/api/partners', payload)
      }

      if (file) {
        let formData = new FormData()
        formData.append('photo', file)
        await axios.post(`/api/partners/${res.data._id}/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      }

      if (res.status === 200 || res.status === 201) {
        navigate('/admin/adminpartners')
      }
    } catch (err) {
      setFormError(err.response?.data?.msg || err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    if (!id) return
    let fetchPartner = async () => {
      let res = await axios.get('/api/partners/' + id)
      if (res.status === 200) {
        setName(res.data.name || '')
        setOrder(res.data.order ?? 0)
        setHidden(Boolean(res.data.hidden))
        if (res.data.photo) {
          setPreview(assetUrl(res.data.photo))
          setHasExistingPhoto(true)
        }
      }
    }
    fetchPartner()
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
      title={id ? 'Edit partner' : 'Add partner'}
      subtitle="This logo appears in the partners marquee above the footer."
      onSubmit={save}
      footer={
        <FormActions
          onCancel={() => navigate('/admin/adminpartners')}
          saving={saving}
          isEdit={!!id}
        />
      }
    >
      <FormErrorBanner message={formError} errors={error} />

      <FormSection step="1" title="Partner logo" hasError={Boolean(error.photo)}>
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
        <FormField label="Name" hint="Optional label for admin (e.g. Microsoft).">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Partner name"
            className={fieldClass}
          />
        </FormField>

        <FormField
          label="Order"
          hint="Lower numbers show first in the marquee (0, 1, 2…)"
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
          label="Visibility"
          hint="Hidden partners stay in admin but are not shown on the site."
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

export default PartnerForm
