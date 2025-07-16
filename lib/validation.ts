export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => string | null
}

export interface ValidationRules {
  [key: string]: ValidationRule
}

export interface ValidationErrors {
  [key: string]: string
}

export const commonRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => {
      if (value && !value.includes("@")) {
        return "Please enter a valid email address"
      }
      return null
    },
  },
  phone: {
    pattern: /^[+]?[1-9][\d]{0,15}$/,
    custom: (value: string) => {
      if (value && value.length < 10) {
        return "Phone number must be at least 10 digits"
      }
      return null
    },
  },
  password: {
    required: true,
    minLength: 8,
    custom: (value: string) => {
      if (value && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
        return "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      }
      return null
    },
  },
}

export const validateForm = (data: any, rules: ValidationRules): ValidationErrors => {
  const errors: ValidationErrors = {}

  Object.keys(rules).forEach((field) => {
    const rule = rules[field]
    const value = data[field]

    if (rule.required && (!value || value.toString().trim() === "")) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
      return
    }

    if (value && rule.minLength && value.toString().length < rule.minLength) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${rule.minLength} characters`
      return
    }

    if (value && rule.maxLength && value.toString().length > rule.maxLength) {
      errors[field] =
        `${field.charAt(0).toUpperCase() + field.slice(1)} must be no more than ${rule.maxLength} characters`
      return
    }

    if (value && rule.pattern && !rule.pattern.test(value.toString())) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} format is invalid`
      return
    }

    if (rule.custom) {
      const customError = rule.custom(value)
      if (customError) {
        errors[field] = customError
        return
      }
    }
  })

  return errors
}

export const validateField = (value: any, rule: ValidationRule): string | null => {
  if (rule.required && (!value || value.toString().trim() === "")) {
    return "This field is required"
  }

  if (value && rule.minLength && value.toString().length < rule.minLength) {
    return `Must be at least ${rule.minLength} characters`
  }

  if (value && rule.maxLength && value.toString().length > rule.maxLength) {
    return `Must be no more than ${rule.maxLength} characters`
  }

  if (value && rule.pattern && !rule.pattern.test(value.toString())) {
    return "Invalid format"
  }

  if (rule.custom) {
    return rule.custom(value)
  }

  return null
}
