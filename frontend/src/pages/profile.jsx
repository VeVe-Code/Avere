import React, { useContext, useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import axios from '../helper/axios'
import { AuthContext } from '../contexts/AuthContext'
import { useI18n } from '../contexts/I18nContext'
import SEO from '../components/SEO'

function Profile() {
  let { user, authReady, dispatch } = useContext(AuthContext)
  let { t } = useI18n()
  let [name, setName] = useState('')
  let [phone, setPhone] = useState('')
  let [saving, setSaving] = useState(false)
  let [error, setError] = useState('')
  let [success, setSuccess] = useState('')

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setPhone(user.phone || '')
    }
  }, [user])

  if (authReady && !user) {
    return <Navigate to="/login" replace state={{ from: '/profile' }} />
  }

  if (!authReady || !user) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-slate-500 dark:text-slate-400">
        {t('common.loading')}
      </div>
    )
  }

  let onSave = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      setSaving(true)
      let res = await axios.patch('/api/users/me', {
        name: name.trim(),
        phone: phone.trim(),
      })
      dispatch({ type: 'LOGIN', payload: res.data.user })
      setSuccess(t('profile.updated'))
    } catch (e) {
      setError(
        e.response?.data?.error ||
          e.response?.data?.errors?.name?.msg ||
          e.response?.data?.errors?.phone?.msg ||
          t('profile.failed')
      )
    } finally {
      setSaving(false)
    }
  }

  let initial = (user.name?.trim()?.[0] || 'U').toUpperCase()

  return (
    <section className="min-h-screen bg-[#f4f6f9] dark:bg-slate-950 py-12 sm:py-16 px-4">
      <SEO title={`${t('profile.title')} - Avere`} description={t('profile.subtitle')} />

      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 mb-1">
            {t('profile.eyebrow')}
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            {t('profile.title')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('profile.subtitle')}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.35)] overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-semibold text-white">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
            </div>
          </div>

          <form onSubmit={onSave} className="p-6 space-y-5">
            {error && (
              <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50 rounded-xl px-3 py-2">
                {error}
              </p>
            )}
            {success && (
              <p className="text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 rounded-xl px-3 py-2">
                {success}
              </p>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1.5">
                {t('profile.fullName')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1.5">
                {t('profile.email')}
              </label>
              <input
                type="email"
                value={user.email || ''}
                disabled
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed"
              />
              <p className="text-xs text-slate-400 mt-1">{t('profile.emailLocked')}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1.5">
                {t('profile.phone')}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="09xxxxxxxxx"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-400"
              />
              <p className="text-xs text-slate-400 mt-1">{t('profile.phoneHint')}</p>
            </div>

            {user.role && user.role !== 'customer' && (
              <div>
                <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1.5">
                  {t('profile.role')}
                </label>
                <input
                  type="text"
                  value={user.role}
                  disabled
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-500 dark:text-slate-400 capitalize cursor-not-allowed"
                />
              </div>
            )}

            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t('profile.openSettings')}{' '}
              <Link to="/settings" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                {t('profile.openSettingsLink')}
              </Link>
            </p>

            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <Link
                to="/"
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {t('profile.cancel')}
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? t('profile.saving') : t('profile.save')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Profile
