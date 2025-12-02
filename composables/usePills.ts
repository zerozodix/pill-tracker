import type { Pill } from '~/types'

/**
 * Composable for managing pills
 */
export const usePills = () => {
  // Reactive state
  const pills = ref<Pill[]>([])
  const currentPill = ref<Pill | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Fetch all pills
   */
  const fetchPills = async () => {
    try {
      loading.value = true
      error.value = null
      
      // In a real app, this would be an API call
      // For now, we'll use localStorage
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
      error.value = 'Failed to fetch pills'
      console.error('Error fetching pills:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Add a new pill
   */
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
      
      // Save to localStorage
      if (import.meta.client) {
        localStorage.setItem('pills', JSON.stringify(pills.value))
      }

      return newPill
    } catch (err) {
      error.value = 'Failed to add pill'
      console.error('Error adding pill:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Update an existing pill
   */
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

      // Save to localStorage
      if (import.meta.client) {
        localStorage.setItem('pills', JSON.stringify(pills.value))
      }

      return pills.value[index]
    } catch (err) {
      error.value = 'Failed to update pill'
      console.error('Error updating pill:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete a pill
   */
  const deletePill = async (pillId: string) => {
    try {
      loading.value = true
      error.value = null

      pills.value = pills.value.filter(p => p.id !== pillId)
      
      // Save to localStorage
      if (import.meta.client) {
        localStorage.setItem('pills', JSON.stringify(pills.value))
      }
    } catch (err) {
      error.value = 'Failed to delete pill'
      console.error('Error deleting pill:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Get a pill by ID
   */
  const getPillById = (pillId: string) => {
    return computed(() => pills.value.find(p => p.id === pillId))
  }

  /**
   * Get pills due for today
   */
  const getTodaysPills = () => {
    return computed(() => {
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
            // Implement weekly logic based on frequency.value
            const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
            return daysSinceStart % 7 < frequency.value
          case 'monthly':
            // Implement monthly logic
            return today.getDate() <= frequency.value
          case 'as-needed':
            return true
          default:
            return false
        }
      })
    })
  }

  // Initialize on client side
  onMounted(() => {
    fetchPills()
  })

  return {
    // State
    pills: readonly(pills),
    currentPill: readonly(currentPill),
    loading: readonly(loading),
    error: readonly(error),

    // Methods
    fetchPills,
    addPill,
    updatePill,
    deletePill,
    getPillById,
    getTodaysPills
  }
}