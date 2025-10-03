import React, { useContext, useState } from 'react'
import { AppointmentsContext } from '../App'
import { AuthContext } from '../App'

const MyAppointments = () => {
  const { appointments, doctors, updateAppointmentStatus } = useContext(AppointmentsContext)
  const { user } = useContext(AuthContext)
  const [cancellingId, setCancellingId] = useState(null)

  // Filter appointments for current user
  const userAppointments = appointments.filter(appt => appt.patientId === user.id)

  const canCancelAppointment = (appointmentDate, appointmentTime) => {
    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}:00`)
    const currentDateTime = new Date()
    const timeDifference = appointmentDateTime - currentDateTime
    const hoursDifference = timeDifference / (1000 * 60 * 60)
    
    // Allow cancellation if more than 24 hours remaining
    return hoursDifference > 24
  }

  const handleCancelAppointment = async (appointmentId, appointmentDate, appointmentTime) => {
    if (!canCancelAppointment(appointmentDate, appointmentTime)) {
      alert('You can only cancel appointments at least 24 hours in advance.')
      return
    }

    setCancellingId(appointmentId)
    
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      updateAppointmentStatus(appointmentId, 'cancelled')
      alert('Appointment cancelled successfully!')
    }
    
    setCancellingId(null)
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    }

    return (
      <span className={`px-2 py-1 rounded text-xs ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    )
  }

  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Please log in to view your appointments.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] p-6">
      <h1 className="text-3xl font-bold mb-6">My Appointments</h1>
      
      {userAppointments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">You don't have any appointments yet.</p>
          <button 
            onClick={() => window.location.href = '/doctors'}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Book an Appointment
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {userAppointments.map((appt) => {
            const doctor = doctors.find(doc => doc._id === appt.doctorId)
            const canCancel = canCancelAppointment(appt.date, appt.time) && appt.status === 'confirmed'
            
            return (
              <div key={appt.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <img src={doctor?.image || 'https://via.placeholder.com/60'} alt={doctor?.name} className="w-16 h-16 rounded-full mr-4" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{doctor?.name || 'Unknown Doctor'}</h3>
                    <p className="text-gray-600">{doctor?.speciality || 'General Physician'}</p>
                    <p className="text-sm text-gray-500">{doctor?.degree || 'MD'}</p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(appt.status)}
                    <p className="text-sm text-gray-500 mt-1">Fee: ${doctor?.fees || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="font-medium">{appt.date} at {appt.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Reason</p>
                    <p className="font-medium">{appt.reason}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-medium">{appt.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Booked On</p>
                    <p className="font-medium">
                      {appt.createdAt ? new Date(appt.createdAt).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                </div>

                {appt.status === 'confirmed' && (
                  <div className="flex gap-3">
                    {canCancel ? (
                      <button
                        onClick={() => handleCancelAppointment(appt.id, appt.date, appt.time)}
                        disabled={cancellingId === appt.id}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:bg-red-300"
                      >
                        {cancellingId === appt.id ? 'Cancelling...' : 'Cancel Appointment'}
                      </button>
                    ) : (
                      <p className="text-sm text-red-600">
                        Cannot cancel - less than 24 hours until appointment
                      </p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MyAppointments