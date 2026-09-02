import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [doctorData, setDoctorData] = useState(null);
  const [filter, setFilter] = useState('pending'); // pending, accepted, rejected, all
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState({});

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('userData');
      
      if (!token || !userData) {
        navigate('/doctor-login');
        return;
      }
      
      try {
        const parsedUser = JSON.parse(userData);
        console.log('Doctor data:', parsedUser);
        
        if (parsedUser.role !== 'doctor') {
          navigate('/doctor-login');
          return;
        }
        
        setDoctorData(parsedUser);
        fetchAppointments(token);
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/doctor-login');
      }
    };
    
    checkAuth();
  }, [navigate]);

  const fetchAppointments = async (token) => {
    setLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const response = await axios.get(`${apiBase}/appointments/doctor/pending-appointments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token
        }
      });
      
      if (response.data.success) {
        setAppointments(response.data.appointments);
        setError('');
      } else {
        setError(response.data.message || 'Failed to fetch appointments');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      const errMsg = error.response?.data?.message || error.response?.data?.error || 'Error fetching appointments. Please try again.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptAppointment = async (appointmentId) => {
    const token = localStorage.getItem('token');
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const response = await axios.put(
        `${apiBase}/appointments/${appointmentId}/accept`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-auth-token': token
          }
        }
      );

      if (response.data.success) {
        alert('Appointment accepted successfully!');
        // Update appointment in list
        setAppointments(appointments.map(apt => 
          apt._id === appointmentId ? { ...apt, appointmentStatus: 'accepted' } : apt
        ));
      } else {
        alert(response.data.message || 'Failed to accept appointment');
      }
    } catch (error) {
      console.error('Error accepting appointment:', error);
      alert(error.response?.data?.message || 'Error accepting appointment. Please try again.');
    }
  };

  const handleRejectAppointment = async (appointmentId) => {
    if (!rejectionReason[appointmentId]) {
      alert('Please provide a reason for rejection');
      return;
    }

    const token = localStorage.getItem('token');
    setRejectingId(appointmentId);
    
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const response = await axios.put(
        `${apiBase}/appointments/${appointmentId}/reject`,
        { reason: rejectionReason[appointmentId] },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-auth-token': token
          }
        }
      );

      if (response.data.success) {
        alert('Appointment rejected successfully!');
        // Update appointment in list
        setAppointments(appointments.map(apt => 
          apt._id === appointmentId ? { ...apt, appointmentStatus: 'rejected', rejectionReason: rejectionReason[appointmentId] } : apt
        ));
        // Clear rejection reason
        setRejectionReason({ ...rejectionReason, [appointmentId]: '' });
      } else {
        alert(response.data.message || 'Failed to reject appointment');
      }
    } catch (error) {
      console.error('Error rejecting appointment:', error);
      alert(error.response?.data?.message || 'Error rejecting appointment. Please try again.');
    } finally {
      setRejectingId(null);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Filter appointments
  const filteredAppointments = filter === 'all' 
    ? appointments 
    : appointments.filter(apt => apt.appointmentStatus === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const pendingCount = appointments.filter(apt => apt.appointmentStatus === 'pending').length;
  const acceptedCount = appointments.filter(apt => apt.appointmentStatus === 'accepted').length;
  const rejectedCount = appointments.filter(apt => apt.appointmentStatus === 'rejected').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, Dr. {doctorData?.name}
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your appointments and patient consultations
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <div className="text-3xl font-bold text-yellow-600">{pendingCount}</div>
            <div className="text-gray-600 mt-2">Pending Appointments</div>
            <p className="text-sm text-gray-500 mt-1">Awaiting your decision</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="text-3xl font-bold text-green-600">{acceptedCount}</div>
            <div className="text-gray-600 mt-2">Accepted Appointments</div>
            <p className="text-sm text-gray-500 mt-1">Confirmed with patients</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <div className="text-3xl font-bold text-red-600">{rejectedCount}</div>
            <div className="text-gray-600 mt-2">Rejected Appointments</div>
            <p className="text-sm text-gray-500 mt-1">Unable to accept</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {[
            { key: 'pending', label: 'Pending', color: 'yellow' },
            { key: 'accepted', label: 'Accepted', color: 'green' },
            { key: 'rejected', label: 'Rejected', color: 'red' },
            { key: 'all', label: 'All', color: 'gray' }
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === f.key
                  ? `bg-${f.color}-600 text-white`
                  : `bg-white text-gray-700 border border-gray-300 hover:bg-gray-50`
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Appointments Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              {filter === 'all' ? 'All Appointments' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Appointments`}
            </h2>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 m-6 rounded">
              {error}
            </div>
          )}

          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No {filter === 'all' ? '' : filter + ' '} appointments found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 uppercase text-sm font-semibold leading-normal">
                    <th className="py-4 px-6 text-left">Patient</th>
                    <th className="py-4 px-6 text-left">Date & Time</th>
                    <th className="py-4 px-6 text-left">Reason</th>
                    <th className="py-4 px-6 text-left">Status</th>
                    <th className="py-4 px-6 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm">
                  {filteredAppointments.map((appointment) => (
                    <tr key={appointment._id} className="border-b hover:bg-gray-50 transition">
                      <td className="py-4 px-6">
                        <div className="font-semibold">{appointment.patient?.name || 'Unknown'}</div>
                        <div className="text-xs text-gray-500">{appointment.patient?.email || 'No email'}</div>
                        <div className="text-xs text-gray-500">{appointment.patient?.phone || 'No phone'}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium">{appointment.date ? formatDate(appointment.date) : 'Invalid Date'}</div>
                        <div className="text-xs text-gray-500">Time: {appointment.time}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm">{appointment.symptoms || 'Not specified'}</div>
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(appointment.appointmentStatus || 'pending')}
                      </td>
                      <td className="py-4 px-6">
                        {appointment.appointmentStatus === 'pending' ? (
                          <div className="flex gap-2 items-center">
                            <button
                              onClick={() => handleAcceptAppointment(appointment._id)}
                              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded text-xs transition"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => setRejectingId(appointment._id)}
                              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded text-xs transition"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : appointment.appointmentStatus === 'accepted' ? (
                          <div className="flex gap-2 items-center">
                            <span className="text-green-600 font-semibold text-xs bg-green-50 px-2 py-1 rounded">Accepted</span>
                            <button
                              onClick={() => setRejectingId(appointment._id)}
                              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded text-xs transition"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2 items-center">
                            <div className="text-xs">
                              <div className="text-red-600 font-semibold">Cancelled</div>
                              {appointment.rejectionReason && (
                                <div className="text-gray-500 italic text-[11px]">{appointment.rejectionReason}</div>
                              )}
                            </div>
                            <button
                              onClick={() => handleAcceptAppointment(appointment._id)}
                              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded text-xs transition ml-auto"
                            >
                              Accept
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Rejection / Cancellation Reason Modal */}
        {rejectingId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Cancel Appointment</h3>
              <p className="text-gray-600 mb-4">Please provide a reason for cancelling this appointment:</p>
              
              <textarea
                value={rejectionReason[rejectingId] || ''}
                onChange={(e) => setRejectionReason({ ...rejectionReason, [rejectingId]: e.target.value })}
                placeholder="Enter cancellation reason..."
                className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
                rows="4"
              />

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setRejectingId(null);
                    setRejectionReason({ ...rejectionReason, [rejectingId]: '' });
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                >
                  Close
                </button>
                <button
                  onClick={() => handleRejectAppointment(rejectingId)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Confirm Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;