import type { ValidationResult } from '../core/types.js';

export function validateName(
  value: string, minLength: number, fieldName: string): ValidationResult {
  if (!value) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  if (!/^[A-Z]/.test(value)) {
    return { isValid: false, error: `${fieldName} must start with an uppercase letter` };
  }

  if (!/^[A-Za-z-]+$/.test(value)) {
    return { isValid: false, error: `${fieldName} allowed only English letters and hyphen` };
  }

  if (value.length < minLength) {
    return { isValid: false, error: `${fieldName} must be at least ${minLength} characters` };
  }

  return { isValid: true };
}