const SPECIALTY_REASONS = {
  'General Physician': {
    recommended: [
      'General Health Checkup & Consultation',
      'Fever, Cold or Flu Symptoms',
      'High Blood Pressure / Hypertension Check',
      'Diabetes Management & Blood Sugar Check',
      'Body Pain, Fatigue & General Weakness',
      'Routine Lab Test / Health Screening Review'
    ],
    keywords: ['fever', 'cold', 'flu', 'cough', 'checkup', 'headache', 'pain', 'weakness', 'fatigue', 'bp', 'blood pressure', 'sugar', 'diabetes', 'routine', 'health', 'infection', 'body', 'consultation', 'general', 'vomiting', 'nausea', 'viral', 'chills', 'typhoid', 'malaria', 'dengue', 'physical', 'screening', 'doctor', 'treatment', 'medical']
  },
  'Gynecologist': {
    recommended: [
      'Menstrual Irregularities / Period Issues',
      'Pregnancy Consultation & Prenatal Care',
      'PCOS / PCOD Management & Hormonal Check',
      'Pelvic Pain & Abdominal Discomfort',
      'Routine Pap Smear & Gynecological Exam',
      'Fertility & Family Planning Counseling'
    ],
    keywords: ['period', 'menstrual', 'pregnancy', 'pregnant', 'prenatal', 'pcos', 'pcod', 'pelvic', 'pap smear', 'gynec', 'gynecologist', 'cramps', 'fertility', 'uterus', 'ovary', 'womens health', 'bleeding', 'hormonal', 'vaginal', 'discharge', 'contraceptive', 'menopause', 'obstetric', 'conception'],
    unrelatedKeywords: ['eye', 'vision', 'tooth', 'dental', 'teeth', 'brain', 'seizure', 'fracture', 'bone', 'skin acne', 'pimple', 'scalp', 'hair loss', 'ear pain', 'audiology']
  },
  'Dermatologist': {
    recommended: [
      'Acne, Pimples & Skin Breakouts',
      'Skin Rash, Allergy & Eczema',
      'Hair Loss, Thinning & Scalp Issues',
      'Pigmentation, Dark Spots & Skin Discoloration',
      'Mole, Warts & Skin Tag Examination',
      'Fungal or Bacterial Skin Infection'
    ],
    keywords: ['skin', 'derma', 'dermatologist', 'acne', 'pimple', 'rash', 'allergy', 'eczema', 'psoriasis', 'hair', 'scalp', 'mole', 'pigmentation', 'fungal', 'itching', 'spots', 'face', 'nail', 'hives', 'wart', 'burn', 'dermatitis', 'glow', 'skincare'],
    unrelatedKeywords: ['pregnancy', 'pregnant', 'period', 'menstrual', 'heart', 'cardiac', 'brain', 'seizure', 'stomach ulcer', 'digestion', 'fracture', 'bone', 'dental', 'tooth']
  },
  'Pediatrician': {
    recommended: [
      'Child Fever, Cough or Cold',
      'Routine Child Vaccination / Immunization',
      'Pediatric Growth & Development Assessment',
      'Child Digestive Issues & Loss of Appetite',
      'Childhood Skin Rash or Allergy',
      'Routine Infant / Child Wellness Exam'
    ],
    keywords: ['child', 'children', 'baby', 'kid', 'pediatric', 'pediatrician', 'infant', 'toddler', 'vaccination', 'vaccine', 'immunization', 'growth', 'fever', 'cough', 'appetite', 'teething', 'newborn', 'milestone', 'pediatric check'],
    unrelatedKeywords: ['adult', 'geriatric', 'pregnancy', 'menstruation', 'period', 'pcos', 'prostate', 'menopause']
  },
  'Neurologist': {
    recommended: [
      'Chronic Migraine & Severe Headaches',
      'Dizziness, Vertigo & Balance Loss',
      'Numbness, Tingling & Nerve Weakness',
      'Seizures, Epilepsy & Convulsions',
      'Memory Loss, Confusion & Brain Fog',
      'Tremors, Movement Disorders & Paralysis'
    ],
    keywords: ['headache', 'migraine', 'dizziness', 'vertigo', 'numbness', 'tingling', 'seizure', 'epilepsy', 'memory', 'nerve', 'brain', 'neuro', 'neurologist', 'tremor', 'paralysis', 'spin', 'fainting', 'stroke', 'head', 'neuralgia', 'neuropathy', 'neurological'],
    unrelatedKeywords: ['pregnancy', 'period', 'menstrual', 'skin acne', 'dental', 'toothache', 'digestive bloating', 'stomach ulcer', 'pregnancy test']
  },
  'Gastroenterologist': {
    recommended: [
      'Severe Stomach Pain & Abdominal Cramps',
      'Acidity, GERD & Acid Reflux',
      'Chronic Indigestion & Frequent Bloating',
      'Constipation, Diarrhea & IBS Symptoms',
      'Fatty Liver & Gallbladder Issues',
      'Nausea, Vomiting & Appetite Loss'
    ],
    keywords: ['stomach', 'acid', 'gerd', 'reflux', 'indigestion', 'bloating', 'diarrhea', 'constipation', 'ibs', 'liver', 'gallbladder', 'gastric', 'gastro', 'gastroenterologist', 'gut', 'bowel', 'abdomen', 'abdominal', 'ulcer', 'digestive', 'stool', 'acidity'],
    unrelatedKeywords: ['pregnancy', 'pregnant', 'period', 'menstrual', 'skin rash', 'hair loss', 'eye vision', 'seizure', 'brain', 'dental']
  }
};

const getSpecialtyRules = (specName) => {
  if (!specName) return null;
  const clean = specName.trim().toLowerCase();
  for (const key in SPECIALTY_REASONS) {
    if (key.toLowerCase() === clean || clean.includes(key.toLowerCase()) || key.toLowerCase().includes(clean)) {
      return { name: key, ...SPECIALTY_REASONS[key] };
    }
  }
  return null;
};

const Appointment = () => {
  const { docId } = useParams()
  const { doctors, bookAppointment, userData } = useContext(AppContext)
  const navigate = useNavigate()

  // Redirect to login if user is not authenticated
  useEffect(() => {
    // Check if we have userData in context or localStorage
    const hasToken = localStorage.getItem('token');
    const hasUserData = userData || localStorage.getItem('userData');
    
    if (!hasUserData && !hasToken) {
      navigate('/patient-auth', { state: { from: `/appointment/${docId}` } });
      return;
    }

    const currentDocUser = userData || (localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : null);
    if (currentDocUser && (currentDocUser.role === 'doctor' || currentDocUser.role === 'admin')) {
      alert('Only patients can book appointments. Redirecting to Dashboard.');
      navigate('/doctor-dashboard');
      return;
    }
    
    // If we have userData in localStorage but not in context, try to load it
    if (!userData && localStorage.getItem('userData')) {
      try {
        const storedUserData = JSON.parse(localStorage.getItem('userData'));
        if (storedUserData && storedUserData.name) {
          setFormData(prev => ({ ...prev, name: storedUserData.name }));
        }
      } catch (error) {
        console.error('Error parsing userData from localStorage:', error);
      }
    }
  }, [userData, navigate, docId]);

  const doctor = doctors.find(d => String(d._id) === String(docId))
  const specRules = getSpecialtyRules(doctor?.specialization || doctor?.speciality)

  // Try to get userData from localStorage if not available in context
  const getUserDataFromStorage = () => {
    if (userData) return userData;
    try {
      const storedUserData = localStorage.getItem('userData');
      return storedUserData ? JSON.parse(storedUserData) : null;
    } catch (error) {
      console.error('Error parsing userData from localStorage:', error);
      return null;
    }
  };
  
  const storedUserData = getUserDataFromStorage();
  
  const [formData, setFormData] = useState({
    name: storedUserData?.name || '',
    phone: '',
    date: '',
    time: '',
    reasonPreset: '',
    reason: ''
  })

  const [errors, setErrors] = useState({})
  const [minDate, setMinDate] = useState('')
  const [availableSlots, setAvailableSlots] = useState([])
  const [bookedTimeSlots, setBookedTimeSlots] = useState([])

  useEffect(() => {
    if (userData && userData.name) {
      setFormData(prev => ({ ...prev, name: userData.name }))
    }

    // Set minimum date to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setMinDate(tomorrow.toISOString().split('T')[0])

    generateTimeSlots()
  }, [userData])

  // Fetch booked slots for the selected doctor & date
  const fetchBookedSlots = async () => {
    if (!docId || !formData.date) {
      setBookedTimeSlots([])
      return
    }
    try {
      const res = await appointmentsAPI.getBookedSlots(docId, formData.date)
      if (res && res.success && Array.isArray(res.bookedSlots)) {
        const times = res.bookedSlots.map(s => s.time)
        setBookedTimeSlots(times)
        if (times.includes(formData.time)) {
          setFormData(prev => ({ ...prev, time: '' }))
        }
      } else {
        setBookedTimeSlots([])
      }
    } catch (err) {
      console.error('Error fetching booked slots:', err)
      setBookedTimeSlots([])
    }
  }

  useEffect(() => {
    fetchBookedSlots()
  }, [docId, formData.date])

  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 9; hour <= 17; hour++) {
      if (hour === 12) continue // Skip lunch
      const amPm = hour >= 12 ? 'PM' : 'AM'
      const hour12 = hour > 12 ? hour - 12 : hour
      slots.push(`${hour12}:00 ${amPm}`)
      if (hour < 17) slots.push(`${hour12}:30 ${amPm}`)
    }
    setAvailableSlots(slots)
  }

  const validatePhone = (phone) => /^\d{10}$/.test(phone)

  const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id)

  const validateReasonForDoctor = (reasonText) => {
    if (!reasonText || !reasonText.trim()) {
      return { valid: false, message: 'Please select or enter a reason for your visit' };
    }

    if (!specRules) return { valid: true };

    const textLower = reasonText.toLowerCase();

    // 1. Check if user selected or typed one of the recommended reasons
    if (specRules.recommended.some(r => r.toLowerCase() === textLower)) {
      return { valid: true };
    }

    // 2. Check if text contains explicitly unrelated keywords
    if (specRules.unrelatedKeywords) {
      const matchedUnrelated = specRules.unrelatedKeywords.find(k => textLower.includes(k));
      if (matchedUnrelated) {
        return {
          valid: false,
          message: `"${reasonText}" appears unrelated to ${specRules.name}. A ${specRules.name} handles conditions like: ${specRules.recommended.slice(0, 3).join(', ')}.`
        };
      }
    }

    // 3. Check if text contains relevant specialty keywords
    if (specRules.keywords) {
      const hasRelevantKeyword = specRules.keywords.some(k => textLower.includes(k));
      if (!hasRelevantKeyword) {
        return {
          valid: false,
          message: `Please specify a reason related to ${specRules.name} (e.g., ${specRules.recommended.slice(0, 2).join(', ')}).`
        };
      }
    }

    return { valid: true };
  };

  const handleReasonPresetChange = (e) => {
    const value = e.target.value;
    if (value === 'OTHER') {
      setFormData(prev => ({ ...prev, reasonPreset: 'OTHER', reason: '' }));
      if (errors.reason) setErrors(prev => ({ ...prev, reason: '' }));
    } else {
      setFormData(prev => ({ ...prev, reasonPreset: value, reason: value }));
      if (errors.reason) setErrors(prev => ({ ...prev, reason: '' }));
    }
  };

  const handleReasonTextChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, reason: value }));
    if (errors.reason) setErrors(prev => ({ ...prev, reason: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validatePhone(formData.phone)) {
      setErrors({ phone: 'Please enter a valid 10-digit phone number' })
      return
    }
    if (!formData.date) return setErrors({ date: 'Please select a date' })
    if (!formData.time) return setErrors({ time: 'Please select a time' })

    const reasonValidation = validateReasonForDoctor(formData.reason);
    if (!reasonValidation.valid) {
      setErrors({ reason: reasonValidation.message });
      return;
    }

    setErrors({})

    if (!isValidObjectId(docId)) {
      alert('Selected doctor is from demo data. Please ask admin to add this doctor first, then try again.')
      return
    }

    // Check if we have userData from context or try to get it from localStorage
    const userDataFromStorage = !userData && localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : null;
    const currentUserData = userData || userDataFromStorage;
    
    // Make sure we have user data before proceeding
    if (!currentUserData) {
      alert('Please log in to book an appointment')
      navigate('/patient-auth', { state: { from: `/appointment/${docId}` } })
      return
    }

    if (currentUserData.role === 'doctor' || currentUserData.role === 'admin') {
      alert('Only patients can book appointments.')
      navigate('/doctor-dashboard')
      return
    }

    const appointment = {
      doctor: docId,
      date: formData.date,
      time: formData.time,
      symptoms: formData.reason
    }

    try {
      const result = await bookAppointment(appointment)
      
      if (result?.success) {
        alert('Appointment booked successfully!')
        navigate('/my-appointments')
      } else {
        alert(result?.message || 'Failed to book appointment. Please try again.')
      }
    } catch (error) {
      console.error('Error booking appointment:', error)
      alert('Something went wrong. Please try again.')
    }
  }

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '')
    if (value.length <= 10) {
      setFormData({ ...formData, phone: value })
      if (errors.phone) setErrors({ ...errors, phone: '' })
    }
  }

  if (!doctor) {
    return <div className="min-h-[80vh] flex items-center justify-center">Doctor not found</div>
  }

  const doctorSpeciality = doctor.specialization || doctor.speciality || 'Doctor';

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Book Appointment</h2>

        {/* Doctor details */}
        <div className="flex items-center p-4 bg-blue-50 rounded-xl mb-6 border border-blue-100">
          <img 
            src={doctor.image ? (doctor.image.startsWith('http') ? doctor.image : `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}${doctor.image}`) : '/src/assets/doc1.png'} 
            alt={doctor.name} 
            className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-white shadow" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/src/assets/doc1.png';
            }}
          />
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{doctor.name}</h3>
            <p className="text-blue-700 font-medium text-sm">{doctorSpeciality}</p>
            <p className="text-xs text-gray-500">{doctor.experience}</p>
            <p className="text-sm text-green-700 font-bold mt-0.5">Consultation Fee: ₹{doctor.fees}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={handlePhoneChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter 10-digit number"
              maxLength="10"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min={minDate}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
            <select
              required
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select time slot</option>
              {availableSlots.map(slot => {
                const isBooked = bookedTimeSlots.includes(slot)
                return (
                  <option key={slot} value={slot} disabled={isBooked}>
                    {slot} {isBooked ? '(Booked)' : ''}
                  </option>
                )
              })}
            </select>
            {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Visit ({doctorSpeciality}) *
            </label>
            
            {specRules && (
              <select
                value={formData.reasonPreset}
                onChange={handleReasonPresetChange}
                className="w-full p-2.5 mb-2 border border-blue-300 rounded-lg bg-blue-50 text-gray-800 text-sm font-medium focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Choose a common reason for {doctorSpeciality} --</option>
                {specRules.recommended.map((r, idx) => (
                  <option key={idx} value={r}>{r}</option>
                ))}
                <option value="OTHER">Other (Type custom reason below)</option>
              </select>
            )}

            <textarea
              required
              value={formData.reason}
              onChange={handleReasonTextChange}
              className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.reason ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              rows="3"
              placeholder={`Describe symptoms related to ${doctorSpeciality}...`}
            ></textarea>
            
            {errors.reason ? (
              <p className="text-red-600 text-xs mt-1.5 font-medium bg-red-50 p-2 rounded border border-red-200">
                ⚠️ {errors.reason}
              </p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">
                Please enter symptoms or reasons relevant to {doctorSpeciality}.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 shadow-md"
          >
            Book Appointment
          </button>
        </form>
      </div>
    </div>
  )
}

export default Appointment
