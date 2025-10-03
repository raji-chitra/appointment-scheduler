import React, { useState, useContext } from 'react'
import { AppointmentsContext } from '../App'
import { AuthContext } from '../App'

const AdminDashboard = () => {
  const { doctors, appointments, addDoctor, removeDoctor } = useContext(AppointmentsContext)
  const { user } = useContext(AuthContext)
  const [showAddDoctor, setShowAddDoctor] = useState(false)
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    speciality: '',
    experience: '',
    fees: '',
    degree: 'MBBS',
    image: 'https://via.placeholder.com/150'
  })

  const handleAddDoctor = () => {
    addDoctor(newDoctor)
    setShowAddDoctor(false)
    setNewDoctor({ name: '', speciality: '', experience: '', fees: '', degree: 'MBBS', image: 'https://via.placeholder.com/150' })
  }

  const handleRemoveDoctor = (doctorId) => {
    if (window.confirm('Are you sure you want to remove this doctor?')) {
      removeDoctor(doctorId)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}</h1>
      <p className="text-gray-600 mb-6">Admin Dashboard</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Stats Cards */}
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800">Total Doctors</h3>
          <p className="text-2xl font-bold text-blue-600">{doctors.length}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800">Total Appointments</h3>
          <p className="text-2xl font-bold text-green-600">{appointments.length}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-800">Pending Appointments</h3>
          <p className="text-2xl font-bold text-purple-600">
            {appointments.filter(a => a.status === 'pending').length}
          </p>
        </div>
      </div>

      {/* Doctor Management */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Doctor Management</h2>
          <button 
            onClick={() => setShowAddDoctor(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Doctor
          </button>
        </div>

        {showAddDoctor && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold mb-3">Add New Doctor</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Doctor Name"
                value={newDoctor.name}
                onChange={(e) => setNewDoctor({...newDoctor, name: e.target.value})}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Speciality"
                value={newDoctor.speciality}
                onChange={(e) => setNewDoctor({...newDoctor, speciality: e.target.value})}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Experience (e.g., 5 Years)"
                value={newDoctor.experience}
                onChange={(e) => setNewDoctor({...newDoctor, experience: e.target.value})}
                className="p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Fees"
                value={newDoctor.fees}
                onChange={(e) => setNewDoctor({...newDoctor, fees: e.target.value})}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Degree"
                value={newDoctor.degree}
                onChange={(e) => setNewDoctor({...newDoctor, degree: e.target.value})}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Image URL"
                value={newDoctor.image}
                onChange={(e) => setNewDoctor({...newDoctor, image: e.target.value})}
                className="p-2 border rounded"
              />
            </div>
            <div className="flex gap-2 mt-3">
              <button 
                onClick={handleAddDoctor}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Save Doctor
              </button>
              <button 
                onClick={() => setShowAddDoctor(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Doctor</th>
                <th className="px-4 py-2 text-left">Speciality</th>
                <th className="px-4 py-2 text-left">Experience</th>
                <th className="px-4 py-2 text-left">Fees</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor._id} className="border-b">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <img src={doctor.image} alt={doctor.name} className="w-10 h-10 rounded-full mr-3" />
                      <div>
                        <p className="font-semibold">{doctor.name}</p>
                        <p className="text-sm text-gray-600">{doctor.degree}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{doctor.speciality}</td>
                  <td className="px-4 py-3">{doctor.experience}</td>
                  <td className="px-4 py-3">${doctor.fees}</td>
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => handleRemoveDoctor(doctor._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard