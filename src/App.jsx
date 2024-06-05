import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Sidebar from './components/Sidebar'
import Map from './components/Map/Map'
import AppRoutes from './routes/AppRoutes'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className='app'>
      <AppRoutes/>
      {/* <Map/> */}
    </div>
    </>
  )
}

export default App
