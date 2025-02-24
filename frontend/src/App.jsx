import { useState } from 'react'
import './App.css'
import DataInputForm from './pages/dataInputPG'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <DataInputForm />
    </div>
  )
}

export default App
