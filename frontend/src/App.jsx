import { useState } from 'react'
import './App.css'
import DashboardPG from './pages/dashboardPG'

function App() {
  const [count, setCount] = useState(0)

  return (
    <DashboardPG />
  )
}

export default App
