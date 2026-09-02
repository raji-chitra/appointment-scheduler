import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

// import doctor images from assets
import doc1 from "../assets/doc1.png";
import doc2 from "../assets/doc2.png";
import doc3 from "../assets/doc3.png";
import doc4 from "../assets/doc4.png";
import doc5 from "../assets/doc5.png";
import doc6 from "../assets/doc6.png";
import doc7 from "../assets/doc7.png";
import doc8 from "../assets/doc8.png";

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  // Fallback static doctors data if context data is empty
  const fallbackDoctors = [
    { id: 1, name: "Dr. Richard James", specialization: "Cardiologist", image: doc1 },
    { id: 2, name: "Dr. Emily Larson", specialization: "Gynecologist", image: doc2 },
    { id: 3, name: "Dr. Sarah Patel", specialization: "Dermatologist", image: doc3 },
    { id: 4, name: "Dr. Christopher Lee", specialization: "Neurologist", image: doc4 },
    { id: 5, name: "Dr. Jennifer Garcia", specialization: "Pediatrician", image: doc5 },
    { id: 6, name: "Dr. Daniel Kim", specialization: "Orthopedic", image: doc6 },
    { id: 7, name: "Dr. Monica Brown", specialization: "ENT Specialist", image: doc7 },
    { id: 8, name: "Dr. David Wilson", specialization: "General Physician", image: doc8 },
  ];

  // Use context doctors if available, otherwise use fallback
  const displayDoctors = doctors && doctors.length > 0 ? doctors.slice(0, 10) : fallbackDoctors;

  const handleBookAppointment = (doctor) => {
    // Navigate to doctor details page
    navigate(`/doctor-details/${doctor._id || doctor.id}`);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {displayDoctors.map((doctor) => (
        <div
          key={doctor._id || doctor.id}
          className="bg-white rounded-xl shadow p-4 text-center hover:shadow-lg transition cursor-pointer group"
        >
          {/* Doctor Image */}
          <div 
            onClick={() => handleBookAppointment(doctor)}
            className="relative overflow-hidden rounded-full mx-auto mb-4 w-24 h-24"
          >
            <img
              src={
                doctor.image
                  ? doctor.image.startsWith('http')
                    ? doctor.image
                    : `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}${doctor.image}`
                  : doc1
              }
              alt={doctor.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                e.target.src = doc1;
              }}
            />
          </div>
          
          {/* Doctor Info */}
          <h3 className="font-semibold text-lg text-gray-800">{doctor.name}</h3>
          <p className="text-sm text-gray-500">{doctor.specialization || doctor.speciality}</p>
          
          {/* Available Badge */}
          <div className="flex items-center justify-center gap-1 mt-2 mb-3">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <p className="text-xs text-green-500 font-medium">Available</p>
          </div>
          
          {/* Button */}
          <button 
            onClick={() => handleBookAppointment(doctor)}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Book Appointment
          </button>
        </div>
      ))}
    </div>
  );
};

export default TopDoctors;
