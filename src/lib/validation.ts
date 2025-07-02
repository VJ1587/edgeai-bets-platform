import DOMPurify from 'dompurify';
import { z } from 'zod';

// Input sanitization utility
export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input.trim(), { ALLOWED_TAGS: [] });
};

// Password validation schema
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number');

// Username validation schema
export const usernameSchema = z.string()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be less than 20 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens');

// Betting amount validation schema
export const bettingAmountSchema = z.number()
  .min(1, 'Minimum bet amount is $1')
  .max(10000, 'Maximum bet amount is $10,000')
  .positive('Bet amount must be positive');

// Email validation schema
export const emailSchema = z.string()
  .email('Please enter a valid email address')
  .max(254, 'Email is too long');

// Text input validation schema
export const textInputSchema = z.string()
  .min(1, 'This field is required')
  .max(500, 'Text is too long')
  .transform(sanitizeInput);

// Validate and sanitize text input
export const validateAndSanitizeText = (input: string, maxLength = 500): { isValid: boolean; sanitized: string; error?: string } => {
  try {
    const sanitized = sanitizeInput(input);
    
    if (sanitized.length === 0) {
      return { isValid: false, sanitized, error: 'Input cannot be empty' };
    }
    
    if (sanitized.length > maxLength) {
      return { isValid: false, sanitized, error: `Input must be less than ${maxLength} characters` };
    }
    
    return { isValid: true, sanitized };
  } catch (error) {
    return { isValid: false, sanitized: '', error: 'Invalid input' };
  }
};

// Validate betting amount
export const validateBettingAmount = (amount: number): { isValid: boolean; error?: string } => {
  try {
    bettingAmountSchema.parse(amount);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0].message };
    }
    return { isValid: false, error: 'Invalid amount' };
  }
};