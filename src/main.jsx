import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

/* COMPONENTS */
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@/context/ThemeContext'
import { AuthProvider } from '@/context/AuthContext'
import { ConfigProvider } from '@/context/ConfigContext.jsx'

/* CSS */
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '@/css/index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ConfigProvider>
  </StrictMode>,
)
