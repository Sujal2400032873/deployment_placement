// Email validation using simple regex pattern
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation - minimum 6 characters
export const validatePassword = (password) => {
  return password && password.length >= 6;
};

// Name validation - not empty and at least 2 characters
export const validateName = (name) => {
  return name && name.trim().length >= 2;
};

// Phone validation - basic check for digits and dashes
export const validatePhone = (phone) => {
  const phoneRegex = /^[\d\s\-+()]+$/;
  return !phone || phoneRegex.test(phone);
};

// Job title validation
export const validateJobTitle = (title) => {
  return title && title.trim().length >= 3;
};

// Company name validation
export const validateCompanyName = (name) => {
  return name && name.trim().length >= 2;
};
