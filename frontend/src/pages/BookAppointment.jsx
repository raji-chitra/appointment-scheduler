import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const BookAppointment = () => {
  const navigate = useNavigate()
  const { doctorId } = useParams()
  const doctors = JSON.parse(localStorage.getItem('doctors') || '[]')
  const doctor = doctors.find(d => d._id === doctorId)

  const currentUser = JSON.parse(localStorage.getItem('user'))

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    reason: '',
    contact: ''
  })

  if (!doctor) return <div>Doctor not found</div>

  const handleSubmit = (e) => {
    e.preventDefault()

    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]')

    const newAppointment = {
      id: Math.random().toString(36).substr(2, 9),
      patientId: currentUser.id,
      doctorId: doctor._id,          // IMPORTANT: use _id here
      doctorName: doctor.name,
      specialization: doctor.speciality,
      date: formData.date,
      time: formData.time,
      reason: formData.reason,
      contact: formData.contact,
      status: 'confirmed',
      fee: doctor.fee || 'N/A',
      bookedOn: new Date().toLocaleDateString(),
    }

    appointments.push(newAppointment)
    localStorage.setItem('appointments', JSON.stringify(appointments))

    alert('Appointment booked successfully!')
    navigate('/my-appointments')
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
          <label>Reason</label>
          <textarea
            required
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Enter reason"
          />
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
