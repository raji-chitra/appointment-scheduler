import React from 'react'
import { useNavigate } from 'react-router-dom'

const RoleSelection = () => {
  const navigate = useNavigate()

  const handleRoleSelect = (role) => {
    if (role === 'patient') {
      const token = localStorage.getItem('token')
      if (token) {
        navigate('/patient-dashboard')
      } else {
        navigate('/patient-auth')
      }
    } else if (role === 'doctor') {
      const doctorToken = localStorage.getItem('doctorToken') || localStorage.getItem('token')
      const userData = localStorage.getItem('userData')
      const isDoc = userData && JSON.parse(userData)?.role === 'doctor'
      if (doctorToken && isDoc) {
        navigate('/doctor-dashboard')
      } else {
        navigate('/doctor-login')
      }
    } else if (role === 'admin') {
      const adminToken = localStorage.getItem('adminToken')
      if (adminToken) {
        navigate('/admin-dashboard')
      } else {
        navigate('/admin-login')
      }
    }
  }

  const roles = [
    {
      id: 'patient',
      title: "I'm a Patient",
      description: 'Book and manage your medical appointments',
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      bgColor: 'from-blue-400 to-blue-600',
      hoverColor: 'hover:from-blue-500 hover:to-blue-700',
      shadowColor: 'shadow-blue-500/50'
    },
    {
      id: 'doctor',
      title: "I'm a Doctor",
      description: 'View your schedule and manage patients',
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      bgColor: 'from-green-400 to-green-600',
      hoverColor: 'hover:from-green-500 hover:to-green-700',
      shadowColor: 'shadow-green-500/50'
    },
    {
      id: 'admin',
      title: "I'm an Admin",
      description: 'Manage doctors and system settings',
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      bgColor: 'from-red-400 to-red-600',
      hoverColor: 'hover:from-red-500 hover:to-red-700',
      shadowColor: 'shadow-red-500/50'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6 flex justify-center">
            <div className="text-5xl">🏥</div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome to HealthCare
          </h1>
          <p className="text-lg text-gray-300">Select your role to get started</p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => handleRoleSelect(role.id)}
              className={`group relative p-8 rounded-2xl bg-gradient-to-br ${role.bgColor} ${role.hoverColor} shadow-2xl ${role.shadowColor} transition-all duration-300 transform hover:scale-105 hover:shadow-2xl text-white cursor-pointer overflow-hidden`}
            >
              {/* Background Glow Effect */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              
              {/* Card Content */}
              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Icon */}
                <div className="mb-6 p-4 bg-white/20 rounded-full backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
                  <div className="text-white">
                    {role.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold mb-3 group-hover:scale-105 transition-transform duration-300">
                  {role.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-white/90 mb-4">
                  {role.description}
                </p>

                {/* Arrow Icon */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>

              {/* Bottom Border Animation */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-white/50 group-hover:w-full transition-all duration-300"></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RoleSelection