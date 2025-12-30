import { useState } from 'react'

import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

function App() {
  

  return (
<>
    <BrowserRouter>
    <Routes>
      <Route path='/login' element ={<Login/>}/>
      <Route path='/register' element = {<Register/>}/>
      <Route 
        path='/dashboard'
        element = {
        <PrivateRoute>
          <Dashboard/>
        </PrivateRoute> 
        }
      />

     
    </Routes>
    </BrowserRouter>
</>
  )
}

export default App
