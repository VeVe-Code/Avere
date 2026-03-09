import React from "react";
import { Link, useSearchParams } from "react-router-dom";

function KnowledgePagi({ Links,page }) {
  const [searchParams] = useSearchParams();

  // get current page from URL (?page=)
  const currentPage = Number(searchParams.get("page")) || 1;

  return (
    <nav aria-label="Page navigation example">
      <ul className="flex -space-x-px text-sm">

        {/* Previous */}
        <li>
          <Link
            to ={`${Links.PrevPage ? "/admin/adminknowledge?page=" + (page - 1) : "/admin/adminknowledge?page=" + page }`}
            className={`flex items-center justify-center px-3 h-10 border font-medium rounded-s-base
              ${
                currentPage === 1
                  ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                  : "text-body bg-neutral-secondary-medium hover:bg-neutral-tertiary-medium"
              }
            `}
          >
            Previous
          </Link>
        </li>

        {/* Page numbers */}
        {Links.LoopableLinks.map((link) => (
          <li key={link.number}>
            <Link
              to={`/admin/adminKnowledge?page=${link.number}`}
              className={`flex items-center justify-center w-10 h-10 border font-medium
                ${
                  link.number === currentPage
                    ? "text-white bg-blue-400"
                    : "text-body text-cbg-neutral-secondary-medium hover:bg-blue-400"
                }
              `}
            >
              {link.number}
            </Link>
          </li>
        ))}

        {/* Next */}
        <li>
          <Link
           to ={`${Links.nextPage ? "/admin/adminknowledge?page=" + (page + 1) : "/admin/adminknowledge?page=" + page }`}
            className={`flex items-center justify-center px-3 h-10 border font-medium rounded-e-base
              ${
                currentPage === Links.totalPages
                  ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                  : "text-body bg-neutral-secondary-medium hover:bg-neutral-tertiary-medium"
              }
            `}
          >
            Next
          </Link>
        </li>

      </ul>
    </nav>
  );
}

export default KnowledgePagi;
