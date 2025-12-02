import { defineStore } from 'pinia'
import type { Pill, PillSchedule } from '~/types'

export const usePillStore = defineStore('pills', () => {
    // State
    const pills = ref<Pill[]>([])
    const schedule = ref<PillSchedule[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    // Getters
    const todaysPills = computed(() => {
        const today = new Date()
        return pills.value.filter(pill => {
            const { frequency } = pill
            const startDate = new Date(frequency.startDate)
            const endDate = frequency.endDate ? new Date(frequency.endDate) : null

            // Check if pill is active today
            if (today < startDate || (endDate && today > endDate)) {
                return false
            }

            // Check frequency type
            switch (frequency.type) {
                case 'daily':
                    return true
                case 'weekly':
                    const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
                    return daysSinceStart % 7 < frequency.value
                case 'monthly':
                    return today.getDate() <= frequency.value
                case 'as-needed':
                    return true
                default:
                    return false
            }
        })
    })

    const pillsCount = computed(() => pills.value.length)

    const upcomingReminders = computed(() => {
        const now = new Date()
        const upcoming: Array<{ pill: Pill; time: Date }> = []

        todaysPills.value.forEach(pill => {
            pill.frequency.times.forEach(timeSlot => {
                if (!timeSlot.taken) {
                    const today = new Date().toISOString().split('T')[0]
                    const reminderTime = new Date(`${today}T${timeSlot.time}:00`)

                    if (reminderTime > now) {
                        upcoming.push({ pill, time: reminderTime })
                    }
                }
            })
        })

        return upcoming.sort((a, b) => a.time.getTime() - b.time.getTime())
    })

    // Actions
    const loadPills = async () => {
        try {
            loading.value = true
            error.value = null

            if (import.meta.client) {
                const storedPills = localStorage.getItem('pills')
                if (storedPills) {
                    pills.value = JSON.parse(storedPills).map((pill: any) => ({
                        ...pill,
                        createdAt: new Date(pill.createdAt),
                        updatedAt: new Date(pill.updatedAt),
                        frequency: {
                            ...pill.frequency,
                            startDate: new Date(pill.frequency.startDate),
                            endDate: pill.frequency.endDate ? new Date(pill.frequency.endDate) : undefined
                        }
                    }))
                }
            }
        } catch (err) {
            error.value = 'Failed to load pills'
            console.error('Error loading pills:', err)
        } finally {
            loading.value = false
        }
    }

    const savePills = () => {
        if (import.meta.client) {
            localStorage.setItem('pills', JSON.stringify(pills.value))
        }
    }

    const addPill = async (pillData: Omit<Pill, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
            loading.value = true
            error.value = null

            const newPill: Pill = {
                id: crypto.randomUUID(),
                ...pillData,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            pills.value.push(newPill)
            savePills()

            return newPill
        } catch (err) {
            error.value = 'Failed to add pill'
            console.error('Error adding pill:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    const updatePill = async (pillId: string, updates: Partial<Pill>) => {
        try {
            loading.value = true
            error.value = null

            const index = pills.value.findIndex(p => p.id === pillId)
            if (index === -1) {
                throw new Error('Pill not found')
            }

            pills.value[index] = {
                ...pills.value[index],
                ...updates,
                updatedAt: new Date()
            }

            savePills()
            return pills.value[index]
        } catch (err) {
            error.value = 'Failed to update pill'
            console.error('Error updating pill:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    const deletePill = async (pillId: string) => {
        try {
            loading.value = true
            error.value = null

            pills.value = pills.value.filter(p => p.id !== pillId)
            savePills()
        } catch (err) {
            error.value = 'Failed to delete pill'
            console.error('Error deleting pill:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    const markPillTaken = async (pillId: string, timeSlotId: string) => {
        const pill = pills.value.find(p => p.id === pillId)
        if (!pill) return

        const timeSlot = pill.frequency.times.find(t => t.id === timeSlotId)
        if (!timeSlot) return

        timeSlot.taken = true
        timeSlot.takenAt = new Date()

        await updatePill(pillId, pill)
    }

    const getPillById = (pillId: string) => {
        return pills.value.find(p => p.id === pillId)
    }

    return {
        // State
        pills: readonly(pills),
        schedule: readonly(schedule),
        loading: readonly(loading),
        error: readonly(error),

        // Getters
        todaysPills,
        pillsCount,
        upcomingReminders,

        // Actions
        loadPills,
        addPill,
        updatePill,
        deletePill,
        markPillTaken,
        getPillById
    }
})