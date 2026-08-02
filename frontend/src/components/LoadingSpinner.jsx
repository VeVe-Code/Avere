export default function LoadingSpinner({ className = '', fullPage = false }) {
  const spinner = (
    <div
      className={`w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  )

  if (fullPage) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center py-24">
        {spinner}
      </div>
    )
  }

  return (
    <div className="flex justify-center py-16">
      {spinner}
    </div>
  )
}
