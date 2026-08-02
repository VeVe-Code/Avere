import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from '../helper/axios'
import { AuthContext } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useI18n } from '../contexts/I18nContext'
import SEO from '../components/SEO'
import {
  ChevronRight,
  KeyRound,
  Languages,
  Moon,
  Sun,
  Monitor,
  UserRound,
  Users,
} from 'lucide-react'

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

function Settings() {
  let { user, authReady } = useContext(AuthContext)
  let { theme, setTheme } = useTheme()
  let { lang, setLang, t } = useI18n()

  let [currentPassword, setCurrentPassword] = useState('')
  let [newPassword, setNewPassword] = useState('')
  let [confirmPassword, setConfirmPassword] = useState('')
  let [saving, setSaving] = useState(false)
  let [error, setError] = useState('')
  let [success, setSuccess] = useState('')

  if (!authReady) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-slate-500 dark:text-slate-400">
        {t('common.loading')}
      </div>
    )
  }

  let onChangePassword = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword !== confirmPassword) {
      setError(t('settings.passwordMismatch'))
      return
    }
    if (newPassword.length < 6) {
      setError(t('settings.passwordTooShort'))
      return
    }

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
    } catch (e) {
      setError(
        e.response?.data?.error ||
          e.response?.data?.errors?.currentPassword?.msg ||
          e.response?.data?.errors?.newPassword?.msg ||
          t('settings.passwordFailed')
      )
    } finally {
      setSaving(false)
    }
  }

  let fieldClass =
    'w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-400'

  return (
    <section className="min-h-screen bg-[#f4f6f9] dark:bg-slate-950 py-12 sm:py-16 px-4">
      <SEO title={`${t('settings.title')} - Avere`} description={t('settings.subtitle')} />

      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 mb-1">
            {t('settings.eyebrow')}
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            {t('settings.title')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('settings.subtitle')}
          </p>
        </div>

        {/* Appearance */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-[0_12px_32px_-24px_rgba(15,23,42,0.3)]">
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
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-[0_12px_32px_-24px_rgba(15,23,42,0.3)]">
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
            <OptionButton
              active={lang === 'en'}
              onClick={() => setLang('en')}
              label={t('settings.english')}
            />
            <OptionButton
              active={lang === 'my'}
              onClick={() => setLang('my')}
              label={t('settings.myanmar')}
            />
            <OptionButton
              active={lang === 'th'}
              onClick={() => setLang('th')}
              label={t('settings.thai')}
            />
            <OptionButton
              active={lang === 'zh'}
              onClick={() => setLang('zh')}
              label={t('settings.chinese')}
            />
            <OptionButton
              active={lang === 'vi'}
              onClick={() => setLang('vi')}
              label={t('settings.vietnamese')}
            />
            <OptionButton
              active={lang === 'fr'}
              onClick={() => setLang('fr')}
              label={t('settings.french')}
            />
            <OptionButton
              active={lang === 'ja'}
              onClick={() => setLang('ja')}
              label={t('settings.japanese')}
            />
          </div>
        </div>

        {/* Quick links */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-[0_12px_32px_-24px_rgba(15,23,42,0.3)]">
          {user ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-3 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition border-b border-slate-100 dark:border-slate-800"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                  <UserRound size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {t('settings.myProfile')}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t('settings.myProfileHint')}
                  </p>
                </div>
                <ChevronRight size={18} className="text-slate-400" />
              </Link>

              {user.role === 'owner' && (
                <Link
                  to="/admin/adminusers"
                  className="flex items-center gap-3 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300">
                    <Users size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {t('settings.users')}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t('settings.usersHint')}
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-slate-400" />
                </Link>
              )}
            </>
          ) : (
            <div className="px-5 py-5">
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                {t('settings.loginForSecurity')}
              </p>
              <Link
                to="/login"
                className="inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                {t('settings.goLogin')}
              </Link>
            </div>
          )}
        </div>

        {/* Change password — logged in only */}
        {user && (
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-[0_12px_32px_-24px_rgba(15,23,42,0.3)]">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900">
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

            <form onSubmit={onChangePassword} className="p-5 sm:p-6 space-y-4">
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
                  {t('settings.currentPassword')}
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className={fieldClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1.5">
                  {t('settings.newPassword')}
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className={fieldClass}
                />
                <p className="text-xs text-slate-400 mt-1">{t('settings.passwordMin')}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1.5">
                  {t('settings.confirmPassword')}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className={fieldClass}
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving ? t('settings.updating') : t('settings.updatePassword')}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  )
}

export default Settings
