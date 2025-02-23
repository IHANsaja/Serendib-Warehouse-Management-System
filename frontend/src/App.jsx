import { useState } from 'react'
import './App.css'
import AIOutput from './pages/AIresponsePG.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <AIOutput />
  )
}

export default App
