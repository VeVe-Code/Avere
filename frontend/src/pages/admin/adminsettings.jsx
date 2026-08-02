import React, { useContext, useState } from 'react'
import axios from '../../helper/axios'
import { AuthContext } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { useI18n } from '../../contexts/I18nContext'
import {
  Languages,
  Moon,
  Sun,
  Monitor,
  KeyRound,
} from 'lucide-react'
import {
  FormErrorBanner,
  FormField,
  fieldClass,
} from '../../components/admin/AdminFormUI'
import { fieldError, hasFieldErrors, isBlank } from '../../helper/formValidation'

function OptionButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 min-w-[100px] items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition border
        ${
          active
            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
        }`}
    >
      {Icon && <Icon size={16} />}
      {label}
    </button>
  )
}

function AdminSettings() {
  let { user } = useContext(AuthContext)
  let { theme, setTheme } = useTheme()
  let { lang, setLang, t } = useI18n()

  let [currentPassword, setCurrentPassword] = useState('')
  let [newPassword, setNewPassword] = useState('')
  let [confirmPassword, setConfirmPassword] = useState('')
  let [saving, setSaving] = useState(false)
  let [error, setError] = useState('')
  let [fieldErrors, setFieldErrors] = useState({})
  let [success, setSuccess] = useState('')

  let clearField = (key) =>
    setFieldErrors((prev) => {
      if (!prev[key]) return prev
      let next = { ...prev }
      delete next[key]
      return next
    })

  let onChangePassword = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    let next = {}
    if (isBlank(currentPassword)) {
      next.currentPassword = fieldError(t('settings.currentPassword') + ' is required')
    }
    if (isBlank(newPassword)) {
      next.newPassword = fieldError(t('settings.newPassword') + ' is required')
    } else if (newPassword.length < 6) {
      next.newPassword = fieldError(t('settings.passwordTooShort'))
    }
    if (isBlank(confirmPassword)) {
      next.confirmPassword = fieldError(t('settings.confirmPassword') + ' is required')
    } else if (newPassword !== confirmPassword) {
      next.confirmPassword = fieldError(t('settings.passwordMismatch'))
    }

    if (hasFieldErrors(next)) {
      setFieldErrors(next)
      return
    }
    setFieldErrors({})

    try {
      setSaving(true)
      await axios.patch('/api/users/me/password', {
        currentPassword,
        newPassword,
      })
      setSuccess(t('settings.passwordSuccess'))
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.errors?.currentPassword?.msg ||
          err.response?.data?.errors?.newPassword?.msg ||
          t('settings.passwordFailed')
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500 mb-1">
          Admin
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
          {t('settings.title')}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t('settings.subtitle')}
        </p>
        {user?.email && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
            Signed in as <span className="font-medium text-slate-600 dark:text-slate-300">{user.email}</span>
          </p>
        )}
      </div>

      {/* Appearance */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            {t('settings.appearance')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t('settings.appearanceHint')}
          </p>
        </div>
        <div className="p-5 flex flex-wrap gap-2">
          <OptionButton
            active={theme === 'light'}
            onClick={() => setTheme('light')}
            icon={Sun}
            label={t('settings.themeLight')}
          />
          <OptionButton
            active={theme === 'dark'}
            onClick={() => setTheme('dark')}
            icon={Moon}
            label={t('settings.themeDark')}
          />
          <OptionButton
            active={theme === 'system'}
            onClick={() => setTheme('system')}
            icon={Monitor}
            label={t('settings.themeSystem')}
          />
        </div>
      </div>

      {/* Language */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
            <Languages size={18} />
          </span>
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              {t('settings.language')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('settings.languageHint')}
            </p>
          </div>
        </div>
        <div className="p-5 flex flex-wrap gap-2">
          {[
            ['en', 'settings.english'],
            ['my', 'settings.myanmar'],
            ['th', 'settings.thai'],
            ['zh', 'settings.chinese'],
            ['vi', 'settings.vietnamese'],
            ['fr', 'settings.french'],
            ['ja', 'settings.japanese'],
          ].map(([code, key]) => (
            <OptionButton
              key={code}
              active={lang === code}
              onClick={() => setLang(code)}
              label={t(key)}
            />
          ))}
        </div>
      </div>

      {/* Password */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
            <KeyRound size={18} />
          </span>
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              {t('settings.changePassword')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('settings.changePasswordHint')}
            </p>
          </div>
        </div>
        <form onSubmit={onChangePassword} className="p-5 space-y-4" noValidate>
          <FormErrorBanner message={error} errors={fieldErrors} />
          {success && (
            <p className="text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 rounded-xl px-3 py-2">
              {success}
            </p>
          )}
          <FormField
            label={t('settings.currentPassword')}
            required
            error={fieldErrors.currentPassword?.msg}
          >
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value)
                clearField('currentPassword')
              }}
              className={fieldClass}
              autoComplete="current-password"
              aria-invalid={Boolean(fieldErrors.currentPassword)}
            />
          </FormField>
          <FormField
            label={t('settings.newPassword')}
            required
            error={fieldErrors.newPassword?.msg}
          >
            <input
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value)
                clearField('newPassword')
              }}
              className={fieldClass}
              autoComplete="new-password"
              aria-invalid={Boolean(fieldErrors.newPassword)}
            />
          </FormField>
          <FormField
            label={t('settings.confirmPassword')}
            required
            error={fieldErrors.confirmPassword?.msg}
          >
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                clearField('confirmPassword')
              }}
              className={fieldClass}
              autoComplete="new-password"
              aria-invalid={Boolean(fieldErrors.confirmPassword)}
            />
          </FormField>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? t('settings.updating') : t('settings.updatePassword')}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminSettings
