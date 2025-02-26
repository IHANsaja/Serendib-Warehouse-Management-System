import { useState } from 'react'
import './App.css'
import DataInputForm from './pages/dataInputPG'
import LoginPG from './pages/loginPG'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <LoginPG />
    </div>
  )
}

export default App
