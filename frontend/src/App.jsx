import React from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import LeaveStatus from './pages/LeaveStatus'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Requests from './pages/Requests'
import EmployeeLeaves from './pages/EmployeesLeaves'

const App = () => {
  // const location = useLocation()
  return (
    <>
    <BrowserRouter>
    {/* {location.pathname !== "/" && <Navbar />} */}
    <Navbar />
      <Routes>
        <Route path='/'  element={<Login/>}/>
        <Route path='/employee'  element={<EmployeeLeaves/>}/>
        <Route path='/status/:id'  element={<LeaveStatus/>}/>
        <Route path='/requests'  element={<Requests/>}/>
      </Routes>
    </BrowserRouter>
    </>
    
  )
}

export default App