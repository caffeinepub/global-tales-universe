// Validation helpers for user profile inputs

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateUsername(username: string): ValidationResult {
  if (!username || username.trim().length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' };
  }
  
  // Allow letters, numbers, and underscores only
  const validPattern = /^[a-zA-Z0-9_]+$/;
  if (!validPattern.test(username)) {
    return { valid: false, error: 'Username can only contain letters, numbers, and underscores' };
  }
  
  return { valid: true };
}

export function validateImageFile(file: File): ValidationResult {
  const maxSize = 2 * 1024 * 1024; // 2MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPG and PNG images are allowed' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'Image must be smaller than 2MB' };
  }
  
  return { valid: true };
}

export function validateImageUrl(url: string): ValidationResult {
  if (!url || url.trim().length === 0) {
    return { valid: false, error: 'URL cannot be empty' };
  }
  
  try {
    new URL(url);
    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
}
