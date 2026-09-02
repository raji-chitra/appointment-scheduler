import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const specialities = [
  { label: "General Physician", slug: "general-physician" },
  { label: "Gynecologist", slug: "gynecologist" },
  { label: "Dermatologist", slug: "dermatologist" },
  { label: "Pediatrician", slug: "pediatrician" },
  { label: "Neurologist", slug: "neurologist" },
  { label: "Gastroenterologist", slug: "gastroenterologist" },
];

const normalizeSpeciality = (str) => {
  if (!str) return '';
  let cleaned = decodeURIComponent(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '');
  
  if (cleaned.includes('neuro')) return 'neurologist';
  if (cleaned.includes('derma')) return 'dermatologist';
  if (cleaned.includes('pediatr')) return 'pediatrician';
  if (cleaned.includes('gynec')) return 'gynecologist';
  if (cleaned.includes('gastro')) return 'gastroenterologist';
  if (cleaned.includes('physician') || cleaned.includes('general')) return 'generalphysician';

  if (cleaned.endsWith('s')) {
    cleaned = cleaned.slice(0, -1);
  }
  return cleaned;
};

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  const isSpecSelected = (spec) => {
    if (!speciality) return false;
    const target = normalizeSpeciality(speciality);
    return target === normalizeSpeciality(spec.slug) || target === normalizeSpeciality(spec.label);
  };

  const getLabelFromSlug = (slug) => {
    if (!slug) return '';
    const found = specialities.find((s) => isSpecSelected(s));
    return found ? found.label : decodeURIComponent(slug);
  };

  const applyFilter = () => {
    if (speciality) {
      const targetNorm = normalizeSpeciality(speciality);
      setFilterDoc(
        doctors.filter((doc) => {
          const docSpec = normalizeSpeciality(doc.specialization || doc.speciality || '');
          return docSpec === targetNorm;
        })
      );
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <p className="text-gray-600 text-lg">
        Browse through the doctors{" "}
        {speciality ? `specializing in ${getLabelFromSlug(speciality)}` : ""}
      </p>

      <div className="flex flex-col sm:flex-row items-start gap-6 mt-6">
        {/* Sidebar Filters */}
        <div className="flex flex-col gap-4 text-sm text-gray-600 w-full sm:w-60">
          {specialities.map((spec) => {
            const active = isSpecSelected(spec);
            return (
              <p
                key={spec.slug}
                onClick={() =>
                  active
                    ? navigate("/doctors")
                    : navigate(`/doctors/${spec.slug}`)
                }
                className={`pl-3 py-2 border border-gray-300 rounded cursor-pointer transition-all text-center sm:text-left font-medium
                  ${
                    active
                      ? "bg-blue-600 text-white border-blue-600 shadow"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {spec.label}
              </p>
            );
          })}
        </div>

        {/* Doctors List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
          {filterDoc.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(`/doctor-details/${item._id}`)}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white"
            >
              <img
                className="w-full h-56 object-cover bg-blue-50"
                src={item.image ? (item.image.startsWith('http') ? item.image : `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}${item.image}`) : '/src/assets/doc1.png'}
                alt={item.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/src/assets/doc1.png';
                }}
              />
              <div className="p-4">
                <div className="flex items-center gap-2 text-sm text-green-500 mb-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Available</span>
                </div>
                <p className="text-gray-900 text-lg font-semibold">
                  {item.name}
                </p>
                <p className="text-gray-600 text-sm font-medium">{item.specialization || item.speciality}</p>
              </div>
            </div>
          ))}

          {filterDoc.length === 0 && (
            <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-600 text-lg font-medium">
                No doctors found for "{getLabelFromSlug(speciality)}"
              </p>
              <button
                onClick={() => navigate('/doctors')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
              >
                View All Doctors
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
