import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { MainScreen } from './features/main-screen/mainScreen'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainScreen />
  </StrictMode>,
)
