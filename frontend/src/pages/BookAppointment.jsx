import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { validateAppointmentReason, getSuggestedReasons } from '../utils/appointmentValidator'
import { toast } from 'react-toastify'

const BookAppointment = () => {
  const navigate = useNavigate()
  const { doctorId } = useParams()
  // Get doctors from localStorage, handle both formats
  const doctors = JSON.parse(localStorage.getItem('doctors') || '[]')
  const doctor = doctors.find(d => String(d._id) === String(doctorId))
  
  // If doctor not found in localStorage, try to fetch it directly
  const [loading, setLoading] = useState(doctor ? false : true)

  const currentUser = JSON.parse(localStorage.getItem('user'))

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    reason: '',
    contact: ''
  })
  const [suggestedReasons, setSuggestedReasons] = useState([])
  const [reasonError, setReasonError] = useState('')
  const [reasonWarning, setReasonWarning] = useState('')

  // Add useEffect to fetch doctor if not found in localStorage
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  const backendBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!doctor && doctorId) {
      const fetchDoctor = async () => {
        try {
          const response = await axios.get(`${apiBase}/doctors/${doctorId}`)
          if (response.data.success && response.data.doctor) {
            // Update doctors in localStorage with this doctor
            const updatedDoctors = [...doctors]
            updatedDoctors.push(response.data.doctor)
            localStorage.setItem('doctors', JSON.stringify(updatedDoctors))
            setLoading(false)
          }
        } catch (err) {
          console.error('Error fetching doctor:', err)
          setLoading(false)
        }
      }
      fetchDoctor()
    }
  }, [doctorId, doctor])

  // Load suggested reasons based on doctor specialty
  useEffect(() => {
    if (doctor && doctor.speciality) {
      const suggestions = getSuggestedReasons(doctor.speciality)
      setSuggestedReasons(suggestions)
    }
  }, [doctor])

  if (loading) return <div className="max-w-md mx-auto mt-10 p-8">Loading doctor information...</div>
  if (!doctor) return <div className="max-w-md mx-auto mt-10 p-8">Doctor not found</div>
  
  // Format image URL correctly
  const doctorImage = doctor.image ? 
    (doctor.image.startsWith('http') ? doctor.image : `${backendBase}${doctor.image}`) : 
    '/src/assets/doc1.png'

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate appointment reason based on specialty
    if (doctor && doctor.speciality && formData.reason) {
      const validation = validateAppointmentReason(formData.reason, doctor.speciality)
      
      if (!validation.isValid) {
        setReasonError(validation.message)
        toast.error(validation.message)
        return
      }
      setReasonError('')
    }

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Please login first')
        navigate('/patient-auth')
        return
      }
      const res = await axios.post(`${apiBase}/appointments/book`, {
        doctor: doctorId,
        date: formData.date,
        time: formData.time,
        symptoms: formData.reason
      }, { headers: { Authorization: `Bearer ${token}` } })

      if (res.data.success) {
        toast.success('Appointment booked successfully!')
        navigate('/my-appointments')
      } else {
        toast.error(res.data.message || 'Failed to book appointment')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Book Appointment with {doctor.name}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Date</label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label>Time</label>
          <input
            type="time"
            required
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label>Reason for Appointment</label>
          <p className='text-sm text-blue-600 mb-2'>Doctor Specialty: <span className='font-semibold'>{doctor.speciality}</span></p>
          
          {suggestedReasons.length > 0 && (
            <div className='mb-3'>
              <p className='text-sm text-gray-600 mb-1'>Suggested reasons:</p>
              <select
                className='w-full p-2 border rounded border-green-300 bg-green-50 text-sm mb-2'
                onChange={(e) => {
                  if (e.target.value) {
                    setFormData({ ...formData, reason: e.target.value })
                    setReasonError('')
                  }
                }}
              >
                <option value=''>-- Select a suggested reason --</option>
                {suggestedReasons.map((reason, idx) => (
                  <option key={idx} value={reason}>{reason}</option>
                ))}
              </select>
            </div>
          )}

          <textarea
            required
            value={formData.reason}
            onChange={(e) => {
              setFormData({ ...formData, reason: e.target.value })
              setReasonError('')
            }}
            className={`w-full p-2 border rounded ${reasonError ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            placeholder={suggestedReasons.length > 0 ? 'Enter your reason (relevant to ' + doctor.speciality + ')' : 'Enter reason for appointment'}
            rows='4'
          />
          
          {reasonError && (
            <div className='mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm'>
              {reasonError}
            </div>
          )}
        </div>

        <div>
          <label>Contact Number</label>
          <input
            type="tel"
            required
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Enter your contact number"
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Book Appointment
        </button>
      </form>
    </div>
  )
}

export default BookAppointment
