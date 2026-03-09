import React from 'react'
import { Helmet } from 'react-helmet-async'

function SEO({ title, description, href }) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {href && <link rel="canonical" href={href} />}
    </Helmet>
  )
}

export default SEO