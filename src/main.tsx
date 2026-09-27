import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/sofia-sans'
import './index.css'
import App from './App.tsx'
import { langFromPath } from './i18n/paths.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App initialLang={langFromPath(window.location.pathname)} />
  </StrictMode>,
)
