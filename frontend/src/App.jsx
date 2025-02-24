import { useState } from 'react'
import './App.css'
import DataInputForm from './pages/dataInputPG'
import AIOutput from './pages/AIresponsePG'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <AIOutput />
    </div>
  )
}

export default App
