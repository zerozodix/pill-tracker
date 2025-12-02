// Core types for the Pill Tracker application

export interface Pill {
    id: string
    name: string
    description?: string
    dosage: string
    frequency: PillFrequency
    instructions?: string
    color?: string
    shape?: PillShape
    sideEffects?: string[]
    createdAt: Date
    updatedAt: Date
}

export interface PillFrequency {
    type: FrequencyType
    value: number
    times: TimeSlot[]
    startDate: Date
    endDate?: Date
}

export interface TimeSlot {
    id: string
    time: string // HH:MM format
    taken: boolean
    takenAt?: Date
}

export interface PillSchedule {
    id: string
    pillId: string
    date: Date
    timeSlots: TimeSlot[]
    completed: boolean
}

export interface PillReminder {
    id: string
    pillId: string
    time: string
    enabled: boolean
    sound: boolean
    vibration: boolean
}

export type FrequencyType =
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'as-needed'
    | 'custom'

export type PillShape =
    | 'round'
    | 'oval'
    | 'capsule'
    | 'square'
    | 'triangle'
    | 'diamond'

export interface User {
    id: string
    name: string
    email?: string
    preferences: UserPreferences
    createdAt: Date
}

export interface UserPreferences {
    theme: 'light' | 'dark' | 'auto'
    notifications: boolean
    reminderSound: boolean
    reminderVibration: boolean
    defaultReminderTime: number // minutes before
    language: string
}

// API Response types
export interface ApiResponse<T = any> {
    data: T
    success: boolean
    message?: string
    error?: string
}

// Form types
export interface PillFormData {
    name: string
    description?: string
    dosage: string
    frequency: Omit<PillFrequency, 'times'>
    instructions?: string
    color?: string
    shape?: PillShape
    sideEffects?: string[]
}

export interface ReminderFormData {
    time: string
    enabled: boolean
    sound: boolean
    vibration: boolean
}

// Navigation types
export interface NavItem {
    name: string
    href: string
    icon?: string
    exact?: boolean
}