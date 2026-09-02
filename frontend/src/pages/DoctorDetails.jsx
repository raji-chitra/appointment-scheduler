import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const DoctorDetails = () => {
  const navigate = useNavigate()
  const { doctorId } = useParams()
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
  const backendBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true)
        setError('')
        
        // First try to get from localStorage
        const doctors = JSON.parse(localStorage.getItem('doctors') || '[]')
        let foundDoctor = doctors.find(d => String(d._id) === String(doctorId))

        // If not in localStorage, fetch from API
        if (!foundDoctor) {
          const response = await axios.get(`${apiBase}/doctors/${doctorId}`)
          if (response.data.success && response.data.doctor) {
            foundDoctor = response.data.doctor
            // Store in localStorage
            const updatedDoctors = [...doctors]
            updatedDoctors.push(foundDoctor)
            localStorage.setItem('doctors', JSON.stringify(updatedDoctors))
          }
        }

        if (foundDoctor) {
          setDoctor(foundDoctor)
        } else {
          setError('Doctor not found')
        }
      } catch (err) {
        console.error('Error fetching doctor:', err)
        setError('Failed to load doctor details. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchDoctor()
  }, [doctorId])

  const handleBookAppointment = () => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : null
    if (!token) {
      alert('Please login as a patient to book an appointment')
      navigate('/patient-auth')
      return
    }
    if (userData && (userData.role === 'doctor' || userData.role === 'admin')) {
      alert('Only patients can book appointments. Doctors cannot book appointments.')
      return
    }
    navigate(`/appointment/${doctorId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading doctor details...</p>
        </div>
      </div>
    )
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Doctor not found'}</p>
          <button
            onClick={() => navigate('/doctors')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Doctors
          </button>
        </div>
      </div>
    )
  }

  const doctorImage = doctor.image
    ? doctor.image.startsWith('http')
      ? doctor.image
      : `${backendBase}${doctor.image}`
    : '/src/assets/doc1.png'

  const speciality = doctor.specialization || doctor.speciality || 'Specialist'
  const experience = doctor.experience || 0
  const about = doctor.about || ''
  const fees = doctor.fees || 0

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/doctors')}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Doctors
        </button>

        {/* Doctor Details Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Section with Image */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8">
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              {/* Doctor Image */}
              <div className="flex-shrink-0">
                <img
                  src={doctorImage}
                  alt={doctor.name}
                  className="w-48 h-48 rounded-xl object-cover shadow-lg border-4 border-white"
                  onError={(e) => {
                    e.target.src = '/src/assets/doc1.png'
                  }}
                />
              </div>

              {/* Doctor Basic Info */}
              <div className="flex-1 text-white">
                <h1 className="text-4xl font-bold mb-2">{doctor.name}</h1>
                
                {/* Specialization */}
                <div className="mb-4">
                  <p className="text-blue-100 text-sm font-semibold mb-1">SPECIALIZATION</p>
                  <p className="text-2xl font-semibold">{speciality}</p>
                </div>

                {/* Experience */}
                <div className="mb-4">
                  <p className="text-blue-100 text-sm font-semibold mb-1">EXPERIENCE</p>
                  <p className="text-lg">
                    {experience > 0 ? `${experience}+ years` : 'Specialist'}
                  </p>
                </div>

                {/* Fees */}
                <div>
                  <p className="text-blue-100 text-sm font-semibold mb-1">CONSULTATION FEE</p>
                  <p className="text-3xl font-bold">₹{fees}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Body Section */}
          <div className="p-8">
            {/* About Section */}
            {about && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Doctor</h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {about}
                </p>
              </div>
            )}

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-6 mb-8 py-6 border-t border-gray-200">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-2">Email</p>
                <p className="text-gray-900 font-medium">{doctor.email}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-2">Status</p>
                <p className="flex items-center text-gray-900">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  Available
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                onClick={handleBookAppointment}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Book Appointment
              </button>
              
              <button
                onClick={() => navigate('/doctors')}
                className="flex-1 bg-gray-200 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-300 transition duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                View Other Doctors
              </button>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-900 flex items-start gap-3">
            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              You can book an appointment with this doctor for consultations related to <strong>{speciality}</strong>. 
              Please provide relevant medical history during booking for better consultation.
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default DoctorDetails
