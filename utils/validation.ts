/**
 * Validation utility functions
 */

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * Validate time format (HH:MM)
 */
export const isValidTime = (time: string): boolean => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    return timeRegex.test(time)
}

/**
 * Validate that a string is not empty
 */
export const isNotEmpty = (value: string): boolean => {
    return value.trim().length > 0
}

/**
 * Validate that a string has minimum length
 */
export const hasMinLength = (value: string, minLength: number): boolean => {
    return value.trim().length >= minLength
}

/**
 * Validate that a string has maximum length
 */
export const hasMaxLength = (value: string, maxLength: number): boolean => {
    return value.trim().length <= maxLength
}

/**
 * Validate that a number is within a range
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
    return value >= min && value <= max
}

/**
 * Validate that a date is not in the past
 */
export const isNotPastDate = (date: Date): boolean => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date >= today
}

/**
 * Validate pill name (alphanumeric, spaces, hyphens, and common symbols)
 */
export const isValidPillName = (name: string): boolean => {
    const pillNameRegex = /^[a-zA-Z0-9\s\-_().]+$/
    return isNotEmpty(name) && pillNameRegex.test(name) && hasMaxLength(name, 100)
}

/**
 * Validate dosage format (number followed by unit)
 */
export const isValidDosage = (dosage: string): boolean => {
    const dosageRegex = /^\d+(\.\d+)?\s*(mg|g|ml|l|units?|tablets?|capsules?|drops?|tsp|tbsp|oz|cc)$/i
    return dosageRegex.test(dosage.trim())
}

/**
 * Sanitize string input (remove potentially harmful characters)
 */
export const sanitizeString = (input: string): string => {
    return input.trim().replace(/[<>]/g, '')
}

/**
 * Comprehensive form validation
 */
export interface ValidationResult {
    isValid: boolean
    errors: string[]
}

export const validatePillForm = (data: {
    name: string
    dosage: string
    frequency: { value: number; type: string }
}): ValidationResult => {
    const errors: string[] = []

    if (!isValidPillName(data.name)) {
        errors.push('Pill name must contain only letters, numbers, and common symbols (max 100 characters)')
    }

    if (!isValidDosage(data.dosage)) {
        errors.push('Dosage must include a number and unit (e.g., "10 mg", "1 tablet")')
    }

    if (!isInRange(data.frequency.value, 1, 10)) {
        errors.push('Frequency value must be between 1 and 10')
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}