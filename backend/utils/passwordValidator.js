/**
 * Backend password validator
 */

function validatePassword(password) {
  const requirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasDigit: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  };

  return requirements;
}

function isPasswordValid(password) {
  const requirements = validatePassword(password);
  return Object.values(requirements).every(Boolean);
}

function getPasswordErrorMessage(password) {
  const requirements = validatePassword(password);
  const missing = [];

  if (!requirements.minLength) missing.push('at least 8 characters');
  if (!requirements.hasUpperCase) missing.push('one uppercase letter (A-Z)');
  if (!requirements.hasLowerCase) missing.push('one lowercase letter (a-z)');
  if (!requirements.hasDigit) missing.push('one digit (0-9)');
  if (!requirements.hasSpecialChar) missing.push('one special character (!@#$%^&*)');

  return `Password must contain: ${missing.join(', ')}`;
}

module.exports = {
  validatePassword,
  isPasswordValid,
  getPasswordErrorMessage
};
