import { fieldClass } from './AdminFormUI'

export function DisplayDateField({ value, onChange, hint, error }) {
  return (
    <div>
      <input
        type="date"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={fieldClass}
        aria-invalid={Boolean(error)}
      />
      {hint ? (
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{hint}</p>
      ) : null}
      {error ? <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p> : null}
    </div>
  )
}

export default DisplayDateField
