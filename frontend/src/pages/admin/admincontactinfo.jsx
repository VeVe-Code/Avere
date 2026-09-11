import React, { useEffect, useState } from 'react'
import axios from '../../helper/axios'
import { useContactInfo } from '../../contexts/ContactInfoContext'
import {
  AdminFormCard,
  FormField,
  FormErrorBanner,
  FormActions,
  fieldClass,
} from '../../components/admin/AdminFormUI'

function AdminContactInfo() {
  let { setInfo, refresh } = useContactInfo()
  let [companyName, setCompanyName] = useState('')
  let [email, setEmail] = useState('')
  let [phone, setPhone] = useState('')
  let [address, setAddress] = useState('')
  let [note, setNote] = useState('')
  let [loading, setLoading] = useState(true)
  let [saving, setSaving] = useState(false)
  let [formError, setFormError] = useState('')
  let [success, setSuccess] = useState('')
  let [error, setError] = useState({})

  let clearField = (key) =>
    setError((prev) => {
      if (!prev[key]) return prev
      let next = { ...prev }
      delete next[key]
      return next
    })

  useEffect(() => {
    let fetchInfo = async () => {
      try {
        setLoading(true)
        let res = await axios.get('/api/contactinfo')
        let data = res.data || {}
        setCompanyName(data.companyName || '')
        setEmail(data.email || '')
        setPhone(data.phone || '')
        setAddress(data.address || '')
        setNote(data.note || '')
      } catch (err) {
        setFormError(err.response?.data?.msg || 'Failed to load contact info')
      } finally {
        setLoading(false)
      }
    }
    fetchInfo()
  }, [])

  let save = async (e) => {
    e.preventDefault()
    setFormError('')
    setSuccess('')

    let next = {}
    if (!companyName.trim()) next.companyName = { msg: 'Company name is required' }
    if (!email.trim()) {
      next.email = { msg: 'Email is required' }
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      next.email = { msg: 'Invalid email format' }
    }
    if (!phone.trim()) next.phone = { msg: 'Phone is required' }
    if (!address.trim()) next.address = { msg: 'Address is required' }

    if (Object.keys(next).length) {
      setError(next)
      return
    }
    setError({})

    try {
      setSaving(true)
      let res = await axios.put('/api/contactinfo', {
        companyName: companyName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        note: note.trim(),
      })
      if (res.data) {
        setInfo((prev) => ({ ...prev, ...res.data }))
      } else {
        await refresh()
      }
      setSuccess('Contact info saved. Contact Us and Footer will show the new details.')
    } catch (err) {
      setFormError(err.response?.data?.msg || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <AdminFormCard
      title="Contact Info"
      subtitle="These details appear on the Contact Us page and in the site footer."
      onSubmit={save}
      footer={
        <FormActions
          onCancel={() => window.history.back()}
          saving={saving}
          isEdit
          submitLabel="Save contact info"
        />
      }
    >
      <FormErrorBanner message={formError} errors={error} />
      {success && (
        <p className="text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 rounded-xl px-3 py-2">
          {success}
        </p>
      )}

      <FormField label="Company name" required error={error.companyName?.msg}>
        <input
          type="text"
          value={companyName}
          onChange={(e) => {
            setCompanyName(e.target.value)
            clearField('companyName')
          }}
          className={fieldClass}
          aria-invalid={Boolean(error.companyName)}
        />
      </FormField>

      <FormField label="Email" required error={error.email?.msg}>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            clearField('email')
          }}
          className={fieldClass}
          aria-invalid={Boolean(error.email)}
        />
      </FormField>

      <FormField label="Phone" required error={error.phone?.msg}>
        <input
          type="text"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value)
            clearField('phone')
          }}
          className={fieldClass}
          aria-invalid={Boolean(error.phone)}
        />
      </FormField>

      <FormField
        label="Address"
        required
        hint="Shown on Contact Us and Footer"
        error={error.address?.msg}
      >
        <textarea
          rows={4}
          value={address}
          onChange={(e) => {
            setAddress(e.target.value)
            clearField('address')
          }}
          className={`${fieldClass} resize-y min-h-[96px]`}
          aria-invalid={Boolean(error.address)}
        />
      </FormField>

      <FormField label="Note" hint="Optional line under the contact details">
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className={fieldClass}
          placeholder="We reply within 24 hours."
        />
      </FormField>
    </AdminFormCard>
  )
}

export default AdminContactInfo
