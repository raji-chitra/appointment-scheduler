/**
 * Password validation utility with strength checking
 */

export const validatePassword = (password) => {
  const requirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasDigit: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  };

  return requirements;
};

export const getPasswordStrength = (password) => {
  if (!password) return { level: 0, label: 'No password', color: 'bg-gray-300' };

  const requirements = validatePassword(password);
  const metRequirements = Object.values(requirements).filter(Boolean).length;

  if (metRequirements <= 1) {
    return { level: 1, label: 'Weak', color: 'bg-red-500' };
  } else if (metRequirements === 2) {
    return { level: 2, label: 'Fair', color: 'bg-yellow-500' };
  } else if (metRequirements === 3 || metRequirements === 4) {
    return { level: 3, label: 'Good', color: 'bg-blue-500' };
  } else if (metRequirements === 5) {
    return { level: 4, label: 'Strong', color: 'bg-green-500' };
  }

  return { level: 0, label: 'No password', color: 'bg-gray-300' };
};

export const isPasswordValid = (password) => {
  const requirements = validatePassword(password);
  return Object.values(requirements).every(Boolean);
};

export const getPasswordRequirements = (password) => {
  const requirements = validatePassword(password);
  return {
    minLength: {
      met: requirements.minLength,
      label: 'At least 8 characters'
    },
    hasUpperCase: {
      met: requirements.hasUpperCase,
      label: 'One uppercase letter (A-Z)'
    },
    hasLowerCase: {
      met: requirements.hasLowerCase,
      label: 'One lowercase letter (a-z)'
    },
    hasDigit: {
      met: requirements.hasDigit,
      label: 'One digit (0-9)'
    },
    hasSpecialChar: {
      met: requirements.hasSpecialChar,
      label: 'One special character (!@#$%^&*)'
    }
  };
};
