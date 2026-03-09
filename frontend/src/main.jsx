import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
import Routes from "./routes/index.jsx"
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>   {/* ✅ Put here */}
      <AuthContextProvider>
        <Routes />
      </AuthContextProvider>
    </HelmetProvider>
  </StrictMode>,
)
