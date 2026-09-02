/**
 * Appointment reason validator based on doctor specialty
 */

export const specialtyReasonMap = {
  cardiology: {
    label: 'Cardiology',
    validReasons: [
      'Chest pain',
      'Heart palpitations',
      'Shortness of breath',
      'High blood pressure',
      'Irregular heartbeat',
      'Heart disease check-up',
      'Post-heart attack follow-up',
      'Valve problems',
      'Arrhythmia',
      'Cardiac consultation'
    ],
    keywords: ['heart', 'chest', 'cardiac', 'blood pressure', 'palpitation', 'arrhythmia', 'valve', 'coronary']
  },
  dermatology: {
    label: 'Dermatology',
    validReasons: [
      'Acne',
      'Eczema',
      'Psoriasis',
      'Rash',
      'Skin infection',
      'Moles check',
      'Skin cancer screening',
      'Warts',
      'Allergic reaction',
      'Hair loss',
      'Dermatitis',
      'Skin condition consultation'
    ],
    keywords: ['skin', 'rash', 'acne', 'eczema', 'psoriasis', 'wart', 'mole', 'dermatitis', 'itch']
  },
  orthopedics: {
    label: 'Orthopedics',
    validReasons: [
      'Back pain',
      'Joint pain',
      'Fracture',
      'Arthritis',
      'Knee pain',
      'Shoulder pain',
      'Neck pain',
      'Sports injury',
      'Bone problem',
      'Muscle strain',
      'Ligament injury',
      'Orthopedic consultation'
    ],
    keywords: ['pain', 'fracture', 'bone', 'joint', 'arthritis', 'knee', 'back', 'shoulder', 'spine', 'orthopedic']
  },
  neurology: {
    label: 'Neurology',
    validReasons: [
      'Headache',
      'Migraine',
      'Dizziness',
      'Numbness',
      'Tingling',
      'Seizure',
      'Memory problems',
      'Stroke symptoms',
      'Nerve pain',
      'Parkinson\'s consultation',
      'Brain disorder',
      'Neurological consultation'
    ],
    keywords: ['headache', 'migraine', 'dizzy', 'seizure', 'nerve', 'neurological', 'neuropathy', 'brain']
  },
  ophthalmology: {
    label: 'Ophthalmology',
    validReasons: [
      'Vision problems',
      'Eye pain',
      'Blurred vision',
      'Eye infection',
      'Cataracts',
      'Glaucoma screening',
      'Eye exam',
      'Contact lens fitting',
      'Glasses prescription',
      'Red eye',
      'Floaters',
      'Ophthalmology consultation'
    ],
    keywords: ['eye', 'vision', 'blind', 'cataract', 'glaucoma', 'cornea', 'retina', 'sight']
  },
  pediatrics: {
    label: 'Pediatrics',
    validReasons: [
      'Child check-up',
      'Vaccination',
      'Growth monitoring',
      'Developmental concerns',
      'Childhood illness',
      'Behavior issues',
      'Ear infection',
      'Respiratory infection',
      'Digestive issues',
      'Allergy in children',
      'Pediatric consultation',
      'Baby wellness'
    ],
    keywords: ['child', 'baby', 'pediatric', 'infant', 'kid', 'vaccination', 'developmental', 'growth']
  },
  psychiatry: {
    label: 'Psychiatry',
    validReasons: [
      'Depression',
      'Anxiety',
      'Stress management',
      'Sleep problems',
      'Mood disorders',
      'Mental health consultation',
      'Therapy',
      'Medication consultation',
      'Emotional distress',
      'Behavioral issues',
      'Addiction',
      'Psychiatric assessment'
    ],
    keywords: ['depression', 'anxiety', 'stress', 'mood', 'mental', 'psychiatric', 'therapy', 'emotional']
  },
  urology: {
    label: 'Urology',
    validReasons: [
      'Urinary problems',
      'Kidney stones',
      'Urinary tract infection',
      'Prostate issues',
      'Erectile dysfunction',
      'Bladder problems',
      'Incontinence',
      'Male infertility',
      'Urological consultation',
      'Pain during urination',
      'Urinary blockage'
    ],
    keywords: ['urinary', 'kidney', 'prostate', 'bladder', 'urine', 'urological', 'uti', 'incontinence']
  },
  gastroenterology: {
    label: 'Gastroenterology',
    validReasons: [
      'Stomach pain',
      'Acid reflux',
      'Diarrhea',
      'Constipation',
      'Nausea',
      'Vomiting',
      'Digestive issues',
      'Ulcer',
      'IBS',
      'Gastroenterology consultation',
      'Inflammatory bowel disease',
      'Digestive bleeding'
    ],
    keywords: ['stomach', 'digest', 'reflux', 'gastro', 'intestine', 'bowel', 'ulcer', 'ibs', 'nausea']
  },
  general: {
    label: 'General Practice',
    validReasons: [
      'General check-up',
      'Fever',
      'Cold',
      'Cough',
      'Common illness',
      'Health consultation',
      'Preventive care',
      'Medication review',
      'General wellness'
    ],
    keywords: ['fever', 'cold', 'cough', 'flu', 'common', 'general', 'illness', 'checkup']
  }
};

/**
 * Validate if the reason is appropriate for the doctor's specialty
 */
export const validateAppointmentReason = (reason, specialty) => {
  if (!reason || !specialty) {
    return { isValid: false, message: 'Reason and specialty are required' };
  }

  const normalizedSpecialty = specialty.toLowerCase().trim();
  const normalizedReason = reason.toLowerCase().trim();

  // Find matching specialty
  const matchedSpecialty = Object.keys(specialtyReasonMap).find(
    key => normalizedSpecialty.includes(key) || key.includes(normalizedSpecialty)
  );

  if (!matchedSpecialty) {
    // If specialty not found, allow any reason
    return { isValid: true, message: 'Reason accepted' };
  }

  const specialtyData = specialtyReasonMap[matchedSpecialty];
  
  // Check if reason matches valid reasons or keywords
  const reasonMatches = specialtyData.validReasons.some(
    validReason => normalizedReason.includes(validReason.toLowerCase())
  );

  const keywordMatches = specialtyData.keywords.some(
    keyword => normalizedReason.includes(keyword)
  );

  if (reasonMatches || keywordMatches) {
    return { 
      isValid: true, 
      message: 'Reason accepted',
      specialty: specialtyData.label 
    };
  }

  return {
    isValid: false,
    message: `The reason provided doesn't match ${specialtyData.label}. Please provide a relevant reason.`,
    suggestedReasons: specialtyData.validReasons.slice(0, 5),
    specialty: specialtyData.label
  };
};

/**
 * Get suggested reasons for a specialty
 */
export const getSuggestedReasons = (specialty) => {
  const normalizedSpecialty = specialty.toLowerCase().trim();
  
  const matchedSpecialty = Object.keys(specialtyReasonMap).find(
    key => normalizedSpecialty.includes(key) || key.includes(normalizedSpecialty)
  );

  if (matchedSpecialty) {
    return specialtyReasonMap[matchedSpecialty].validReasons;
  }

  return [];
};
