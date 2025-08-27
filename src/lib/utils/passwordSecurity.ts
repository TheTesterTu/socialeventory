import { z } from 'zod';

// Enhanced password validation schema
export const securePasswordSchema = z
  .string()
  .min(12, 'Password must be at least 12 characters')
  .regex(/^(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
  .regex(/^(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
  .regex(/^(?=.*\d)/, 'Password must contain at least one number')
  .regex(/^(?=.*[!@#$%^&*(),.?":{}|<>])/, 'Password must contain at least one special character')
  .refine((password) => !isCommonPassword(password), 'Password is too common, please choose a stronger one');

// List of commonly used passwords to reject
const COMMON_PASSWORDS = [
  'password123',
  '123456789',
  'qwerty123',
  'password1',
  'admin123',
  'welcome123',
  'letmein123',
  'monkey123',
  'dragon123'
];

function isCommonPassword(password: string): boolean {
  const lowerPassword = password.toLowerCase();
  return COMMON_PASSWORDS.some(common => 
    lowerPassword.includes(common) || 
    common.includes(lowerPassword)
  );
}

export const validatePasswordStrength = (password: string): { 
  isValid: boolean; 
  score: number; 
  feedback: string[] 
} => {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length >= 12) score += 20;
  else if (password.length >= 8) score += 10;
  else feedback.push('Use at least 12 characters');

  // Character variety checks
  if (/[a-z]/.test(password)) score += 15;
  else feedback.push('Add lowercase letters');

  if (/[A-Z]/.test(password)) score += 15;
  else feedback.push('Add uppercase letters');

  if (/\d/.test(password)) score += 15;
  else feedback.push('Add numbers');

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 20;
  else feedback.push('Add special characters');

  // Pattern checks
  if (!/(.)\1{2,}/.test(password)) score += 10; // No repeated characters
  else feedback.push('Avoid repeating characters');

  if (!isCommonPassword(password)) score += 5;
  else feedback.push('Avoid common passwords');

  return {
    isValid: score >= 80,
    score,
    feedback
  };
};

export const generateSecurePassword = (length: number = 16): string => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*(),.?":{}|<>';
  
  const allChars = lowercase + uppercase + numbers + symbols;
  let password = '';
  
  // Ensure at least one character from each category
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};