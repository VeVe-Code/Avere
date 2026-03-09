import React from 'react'
import { Link } from 'react-router-dom';

function pagination({ links, page }) {

  const currentPage = Number(page); // ✅ fix math issue

  return (
    <div>
      <nav aria-label="Page navigation example">
        <ul className="flex -space-x-px text-sm">

          {/* Previous */}
          <li>
            <Link
              to={
                
                links.prevPage
                  ? `/admin/adminservice?page=${currentPage - 1}`
                  : `/admin/adminservice?page=${currentPage}`
              }
              className="flex items-center justify-center text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading font-medium rounded-s-base text-sm w-10 h-10 focus:outline-none"
            >
              <span className="sr-only">Previous</span>
              <svg
                className="w-4 h-4 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m15 19-7-7 7-7"
                />
              </svg>
            </Link>
          </li>

          {/* Pages */}
          {links.loopablelinks.map((link) => {
            if (link.number === currentPage) {
              return (
                <li key={link.number}>
                  <Link
                    to={`/admin/adminservice?page=${link.number}`}
                    aria-current="page"
                    className="flex items-center justify-center bg-blue-600 text-white box-border border border-default-medium font-medium text-sm w-10 h-10 focus:outline-none"
                  >
                    {link.number}
                  </Link>
                </li>
              );
            } else {
              return (
                <li key={link.number}>
                  <Link
                    to={`/admin/adminservice?page=${link.number}`}
                    className="flex items-center justify-center text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading font-medium text-sm w-10 h-10 focus:outline-none"
                  >
                    {link.number}
                  </Link>
                </li>
              );
            }
          })}

          {/* Next */}
          <li>
            <Link
              to={
                links.nextPage
                  ? `/admin/adminservice?page=${currentPage + 1}`
                  : `/admin/adminservice?page=${currentPage}`
              }
              className="flex items-center justify-center text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading font-medium rounded-e-base text-sm w-10 h-10 focus:outline-none"
            >
              <span className="sr-only">Next</span>
              <svg
                className="w-4 h-4 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m9 5 7 7-7 7"
                />
              </svg>
            </Link>
          </li>

        </ul>
      </nav>
    </div>
  );
}

export default pagination;
