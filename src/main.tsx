import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './vendor/bootstrap.min.css'
import './index.css'
import './noche.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('No se encontró el elemento #root')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
)
