import React from 'react'
import { Link } from 'react-router-dom'

function networkpagi({links,page}) {

  

  return (
   <nav aria-label="Page navigation example">
  <ul className="flex -space-x-px text-sm">
    
  <li>
      <Link to={`${links.prevPage ? '/admin/adminnetwork?page=' + (page - 1) : '/admin/adminnetwork?page=' + page}`} className="flex items-center justify-center text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading font-medium rounded-e-base text-sm px-3 h-10 focus:outline-none">Prev</Link>
    </li>
   
   
{
  links.loopablelinks.map(link => {
    if(link.number === page){
        return(
          
      <Link to={`/admin/adminnetwork?page=${link.number}`} key={link.number} className="flex items-center justify-center text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading font-medium text-sm w-10 h-10 focus:outline-none">{link.number}</Link>
 
        )
    }else{
      return(
      <Link to={`/admin/adminnetwork?page=${link.number}`} key={link.number} className="flex items-center justify-center text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading font-medium text-sm w-10 h-10 focus:outline-none">{link.number}</Link>
    )
    }
  })
}
  
    <li>
      <Link to={`${links.nextPage ? '/admin/adminnetwork?page=' + (page + 1) : '/admin/adminnetwork?page=' + page}`} className="flex items-center justify-center text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading font-medium rounded-e-base text-sm px-3 h-10 focus:outline-none">Next</Link>
    </li>
  </ul>
</nav>
  )
}

export default networkpagi