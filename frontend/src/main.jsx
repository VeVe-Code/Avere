import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import { I18nProvider } from './contexts/I18nContext.jsx'
import Routes from "./routes/index.jsx"
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <I18nProvider>
          <AuthContextProvider>
            <Routes />
          </AuthContextProvider>
        </I18nProvider>
      </ThemeProvider>
    </HelmetProvider>
  </StrictMode>,
)
