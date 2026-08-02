import React from 'react'
import { AlertCircle, AlertTriangle } from 'lucide-react'

export let fieldClass =
  'w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-400 transition-colors'

export let fieldErrorClass =
  'w-full rounded-xl border border-red-400 dark:border-red-500/80 bg-red-50/40 dark:bg-red-950/25 px-3.5 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/25 focus:border-red-500 transition-colors'

/** Merge base field styles with optional error state */
export function inputClass(hasError) {
  return hasError ? fieldErrorClass : fieldClass
}

export function AdminFormCard({ title, subtitle, children, footer, onSubmit }) {
  return (
    <div className="max-w-3xl mx-auto mt-8 mb-12 px-4">
      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.35)] overflow-hidden"
        noValidate
      >
        <div className="px-6 sm:px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-linear-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-900">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <div className="p-5 sm:p-8 space-y-5">{children}</div>

        {footer && (
          <div className="border-t border-slate-100 dark:border-slate-800 px-5 sm:px-8 py-4 flex flex-wrap justify-end gap-3 bg-slate-50 dark:bg-slate-900/70">
            {footer}
          </div>
        )}
      </form>
    </div>
  )
}

export function FormSection({ step, title, children, hasError }) {
  return (
    <section
      className={`rounded-2xl border p-4 sm:p-5 space-y-4 ${
        hasError
          ? 'border-red-200 dark:border-red-900/60 bg-red-50/30 dark:bg-red-950/15'
          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40'
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
            hasError
              ? 'bg-red-600 text-white'
              : 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
          }`}
        >
          {step}
        </span>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          {title}
        </h3>
        {hasError && (
          <span className="ml-auto text-xs font-medium text-red-600 dark:text-red-400">
            Needs attention
          </span>
        )}
      </div>
      <div className="space-y-4 pl-0 sm:pl-11">{children}</div>
    </section>
  )
}

export function FieldError({ message }) {
  if (!message) return null
  return (
    <p
      role="alert"
      className="mt-1.5 flex items-start gap-1.5 text-sm text-red-600 dark:text-red-400"
    >
      <AlertCircle size={14} className="mt-0.5 shrink-0" aria-hidden />
      <span>{message}</span>
    </p>
  )
}

export function FormField({ label, required, hint, error, children }) {
  return (
    <div className={error ? 'rounded-xl' : undefined}>
      {label && (
        <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1.5">
          {label}
          {required && (
            <span className="text-red-500 ml-0.5" title="Required">
              *
            </span>
          )}
        </label>
      )}
      {hint && !error && (
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-1.5">{hint}</p>
      )}
      <div
        className={
          error
            ? '[&_input]:border-red-400 [&_input]:dark:border-red-500/80 [&_input]:bg-red-50/40 [&_input]:dark:bg-red-950/25 [&_input]:focus:ring-red-500/25 [&_input]:focus:border-red-500 [&_textarea]:border-red-400 [&_textarea]:dark:border-red-500/80 [&_textarea]:bg-red-50/40 [&_textarea]:dark:bg-red-950/25 [&_textarea]:focus:ring-red-500/25 [&_textarea]:focus:border-red-500 [&_select]:border-red-400 [&_select]:dark:border-red-500/80 [&_select]:bg-red-50/40 [&_select]:dark:bg-red-950/25 [&_select]:focus:ring-red-500/25 [&_select]:focus:border-red-500 [&_.ProseMirror]:border-red-400 [&_.ProseMirror]:dark:border-red-500/80'
            : undefined
        }
      >
        {children}
      </div>
      <FieldError message={error} />
    </div>
  )
}

export function FormErrorBanner({ message, errors }) {
  const fieldList = errors
    ? Object.entries(errors)
        .filter(([, v]) => v?.msg)
        .map(([key, v]) => ({ key, msg: v.msg }))
    : []

  if (!message && fieldList.length === 0) return null

  return (
    <div
      role="alert"
      className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/35 px-4 py-3.5"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400">
          <AlertTriangle size={16} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-red-800 dark:text-red-300">
            {message ||
              (fieldList.length === 1
                ? 'Please fix the highlighted field'
                : `Please fix ${fieldList.length} issues below`)}
          </p>
          {fieldList.length > 0 && (
            <ul className="mt-2 space-y-1">
              {fieldList.map(({ key, msg }) => (
                <li
                  key={key}
                  className="flex items-start gap-1.5 text-sm text-red-700 dark:text-red-400"
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-red-500" />
                  <span>
                    <span className="font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    {' — '}
                    {msg}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export function ImageDropzone({ preview, onChange, accept, hint, error }) {
  return (
    <div>
      <label
        className={`relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 sm:py-10 cursor-pointer transition ${
          error
            ? 'border-red-400 dark:border-red-500/70 bg-red-50/50 dark:bg-red-950/20 hover:border-red-500'
            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20'
        }`}
      >
        <input
          type="file"
          accept={accept || 'image/png,image/jpeg,image/jpg,image/webp,image/gif'}
          onChange={onChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
          aria-invalid={Boolean(error)}
        />
        {preview ? (
          <img
            src={preview}
            alt="preview"
            className="max-h-52 w-full object-contain rounded-xl pointer-events-none"
          />
        ) : (
          <>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Click to upload cover image
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {hint || 'jpg, png, webp, gif — max 5MB'}
            </span>
          </>
        )}
      </label>
      {preview && (
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 text-center">
          Click the image area to replace
        </p>
      )}
      <FieldError message={error} />
    </div>
  )
}

export function FormActions({ onCancel, saving, isEdit, submitLabel }) {
  return (
    <>
      <button
        type="button"
        onClick={onCancel}
        className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {saving
          ? 'Saving...'
          : submitLabel || (isEdit ? 'Update' : 'Create')}
      </button>
    </>
  )
}
