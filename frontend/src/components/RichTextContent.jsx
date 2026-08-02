import Linkify from 'react-linkify'
import { looksLikeHtml, sanitizeHtml } from '../helper/sanitizeHtml'

function formatLegacyLine(line, index) {
  const text = line.trim()

  if (text.startsWith('# ')) {
    return (
      <h2
        key={index}
        className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight pt-2 break-words"
      >
        {text.slice(2)}
      </h2>
    )
  }

  if (text.startsWith('## ')) {
    return (
      <h3
        key={index}
        className="text-xl md:text-2xl font-semibold text-slate-800 dark:text-slate-200 tracking-tight pt-1 break-words"
      >
        {text.slice(3)}
      </h3>
    )
  }

  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <p
      key={index}
      className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-[1.75] break-words"
    >
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i} className="font-semibold text-slate-900 dark:text-slate-100">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
  )
}

/**
 * Renders TipTap HTML when present; falls back to legacy plain-text formatting.
 */
export default function RichTextContent({ value, className = '' }) {
  if (!value) return null

  if (looksLikeHtml(value)) {
    const safe = sanitizeHtml(value)
    return (
      <div
        className={`rich-content prose prose-slate dark:prose-invert max-w-none text-base md:text-lg text-slate-600 dark:text-slate-400 leading-[1.75] break-words ${className}`}
        dangerouslySetInnerHTML={{ __html: safe }}
      />
    )
  }

  const lines = value.split('\n').filter((line) => line.trim() !== '')
  const isList =
    lines.length > 0 && lines.every((line) => line.trim().startsWith('-'))

  return (
    <Linkify
      componentDecorator={(href, text, key) => (
        <a
          href={href}
          key={key}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:text-blue-800 dark:hover:text-blue-300"
        >
          {text}
        </a>
      )}
    >
      <div className={`space-y-4 min-w-0 overflow-hidden ${className}`}>
        {isList ? (
          <ul className="list-disc pl-5 space-y-2">
            {lines.map((line, idx) => (
              <li key={idx} className="text-slate-600 dark:text-slate-400">
                {formatLegacyLine(line.replace(/^\-\s*/, ''), idx)}
              </li>
            ))}
          </ul>
        ) : (
          lines.map((line, idx) => formatLegacyLine(line, idx))
        )}
      </div>
    </Linkify>
  )
}
