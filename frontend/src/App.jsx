import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'

import AppContextProvider from './context/AppContext'
import Home from './pages/Home'
import RoleSelection from './components/RoleSelection'
import PatientDashboard from './pages/PatientDashboard'
import Login from './pages/Login'
import Doctors from './pages/Doctors'
import About from './pages/About'
import Contact from './pages/Contact'
import Appointment from './pages/Appointment'
import Navbar from './components/Navbar'
import PatientAuth from './pages/PatientAuth'

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbarPaths = ['/patient-auth', '/login', '/', '/role-selection']; // hide navbar for auth pages and role selection

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      {children}
    </div>
  );
};

const App = () => {
  return (
    <AppContextProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<RoleSelection />} />
            <Route path="/home" element={<Home />} />
            <Route path="/role-selection" element={<RoleSelection />} />
            <Route path="/patient-auth" element={<PatientAuth />} />
            <Route path="/login" element={<Login />} />
            <Route path="/patient-dashboard" element={<PatientDashboard />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/doctors/:speciality" element={<Doctors />} />
            
            <Route path="/appointment/:docId" element={<Appointment />} />
            <Route path="*" element={<RoleSelection />} />
          </Routes>
        </Layout>
      </Router>
    </AppContextProvider>
  )
}

export default App
