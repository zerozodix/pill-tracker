/**
 * Utility functions for date and time operations
 */

/**
 * Format a date to a readable string
 */
export const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions): string => {
    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }

    return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(date)
}

/**
 * Format time to HH:MM format
 */
export const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    })
}

/**
 * Check if a date is today
 */
export const isToday = (date: Date): boolean => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
}

/**
 * Check if a date is tomorrow
 */
export const isTomorrow = (date: Date): boolean => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return date.toDateString() === tomorrow.toDateString()
}

/**
 * Get the start of the day for a given date
 */
export const startOfDay = (date: Date): Date => {
    const newDate = new Date(date)
    newDate.setHours(0, 0, 0, 0)
    return newDate
}

/**
 * Get the end of the day for a given date
 */
export const endOfDay = (date: Date): Date => {
    const newDate = new Date(date)
    newDate.setHours(23, 59, 59, 999)
    return newDate
}

/**
 * Add days to a date
 */
export const addDays = (date: Date, days: number): Date => {
    const newDate = new Date(date)
    newDate.setDate(newDate.getDate() + days)
    return newDate
}

/**
 * Get days between two dates
 */
export const daysBetween = (startDate: Date, endDate: Date): number => {
    const timeDifference = endDate.getTime() - startDate.getTime()
    return Math.ceil(timeDifference / (1000 * 3600 * 24))
}

/**
 * Parse time string (HH:MM) to hours and minutes
 */
export const parseTime = (timeString: string): { hours: number; minutes: number } => {
    const [hours, minutes] = timeString.split(':').map(Number)
    return { hours, minutes }
}

/**
 * Convert 24-hour time to 12-hour format
 */
export const to12HourFormat = (time: string): string => {
    const { hours, minutes } = parseTime(time)
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`
}

/**
 * Get relative time description (e.g., "in 2 hours", "5 minutes ago")
 */
export const getRelativeTime = (date: Date): string => {
    const now = new Date()
    const diffMs = date.getTime() - now.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (Math.abs(diffDays) >= 1) {
        return diffDays > 0 ? `in ${diffDays} day${diffDays > 1 ? 's' : ''}`
            : `${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? 's' : ''} ago`
    }

    if (Math.abs(diffHours) >= 1) {
        return diffHours > 0 ? `in ${diffHours} hour${diffHours > 1 ? 's' : ''}`
            : `${Math.abs(diffHours)} hour${Math.abs(diffHours) > 1 ? 's' : ''} ago`
    }

    if (Math.abs(diffMinutes) >= 1) {
        return diffMinutes > 0 ? `in ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`
            : `${Math.abs(diffMinutes)} minute${Math.abs(diffMinutes) > 1 ? 's' : ''} ago`
    }

    return 'now'
}