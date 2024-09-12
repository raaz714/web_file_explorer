import { React } from 'react'
import { Routes, Route } from 'react-router-dom'
import AppView from './components/AppView'

function App() {
  return (
    <Routes>
      <Route path='*' element={<AppView />} />
    </Routes>
  )
}

export default App
