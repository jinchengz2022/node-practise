import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <div>{count}</div>
      <button onClick={() => setCount(count => count + 1)}>增加</button>
      <button onClick={() => setCount(count => count - 1)}>减小</button>
    </div>
  )
}

export default App