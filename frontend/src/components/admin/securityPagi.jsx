import React from 'react'
import { Link } from 'react-router-dom'

function securityPagi({links,page}) {
  return (
    <nav aria-label="Page navigation example">
  <ul className="flex -space-x-px text-sm">
    <li>
      <a href="#" className="flex items-center justify-center text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading font-medium rounded-s-base text-sm px-3 h-10 focus:outline-none">Previous</a>
    </li>
    
  
{links.Loopablelinks.map(link => {
      if(link.number === page){
        return(
             
      <Link to={`/admin/adminsecurity?page=${link.number}`} key={link.number} aria-current="page" className="flex items-center justify-center text-fg-brand bg-blue-400 text-white box-border border border-default-medium hover:text-fg-brand font-medium text-sm w-10 h-10 focus:outline-none">{link.number}</Link>
   
    
        )
      }else{
        return(
           
      <Link to={`/admin/adminsecurity?page=${link.number}`} key={link.number} className="flex items-center justify-center text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading font-medium text-sm w-10 h-10 focus:outline-none">{link.number}</Link>
    
        )
      }
})}
    
    <li>
      <a href="#" className="flex items-center justify-center text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading font-medium rounded-e-base text-sm px-3 h-10 focus:outline-none">Next</a>
    </li>
  </ul>
</nav>
  )
}

export default securityPagi