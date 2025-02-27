import { useState } from 'react'
import './App.css'
import DataInputForm from './pages/dataInputPG'
import DashboardPG from './pages/dashboardPG'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <DashboardPG />
    </div>
  )
}

export default App
