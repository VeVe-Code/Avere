const backend = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/').replace(/\/?$/, '/')

export function getLineLoginUrl() {
  return `${backend}api/users/auth/line`
}

export default function LineLoginButton({ label = 'Continue with LINE' }) {
  return (
    <a
      href={getLineLoginUrl()}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#06C755]/50 bg-[#06C755] hover:bg-[#05b34c] text-white font-semibold py-3 transition"
    >
      <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-white text-[#06C755] text-xs font-black">
        LINE
      </span>
      {label}
    </a>
  )
}
