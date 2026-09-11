import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function ProductMegaMenu({ groups = [], onNavigate }) {
  const columns = [[], [], []]
  groups.forEach((g, i) => {
    columns[i % 3].push(g)
  })

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 top-full mt-3 z-50
        w-[min(920px,92vw)] overflow-hidden rounded-2xl
        bg-white dark:bg-slate-900
        border border-slate-200/90 dark:border-white/10
        shadow-[0_28px_60px_-22px_rgba(15,23,42,0.5)]"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
        {columns.map((col, colIdx) => (
          <div
            key={colIdx}
            className={`p-4 sm:p-5 ${
              colIdx > 0
                ? 'sm:border-l border-slate-200/90 dark:border-white/10'
                : ''
            }`}
          >
            {col.map((group) => (
              <div key={group.category} className="mb-5 last:mb-0">
                <p className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  {group.category}
                </p>
                {group.items?.length ? (
                  <ul className="space-y-0.5">
                    {group.items.map((item) => (
                      <li key={item._id}>
                        <Link
                          to={`/product?category=${item._id}`}
                          onClick={onNavigate}
                          className="flex items-center gap-1.5 py-1 text-[13px] text-slate-600 dark:text-slate-300
                            hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                        >
                          <ChevronRight
                            size={12}
                            className="shrink-0 text-slate-400 dark:text-slate-500"
                          />
                          <span className="truncate">{item.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400 dark:text-slate-500 pl-0.5">
                    No products yet
                  </p>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
