import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import PetDetail from './components/PetDetail'

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pet/:id" element={<PetDetail />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
