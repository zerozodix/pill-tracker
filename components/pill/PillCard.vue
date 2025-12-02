<template>
  <UCard class="pill-card">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div 
            class="pill-shape w-8 h-8 rounded-full flex-shrink-0"
            :class="pillColorClass"
            :style="pillShapeStyle"
          />
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">{{ pill.name }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ pill.dosage }}</p>
          </div>
        </div>
        
        <UDropdown :items="menuItems" :popper="{ placement: 'bottom-end' }">
          <UButton 
            icon="i-heroicons-ellipsis-vertical" 
            variant="ghost" 
            size="sm"
            square
          />
        </UDropdown>
      </div>
    </template>

    <div class="space-y-3">
      <!-- Next dose time -->
      <div v-if="nextDoseTime" class="flex items-center gap-2">
        <UIcon name="i-heroicons-clock" class="text-blue-500" />
        <span class="text-sm">Next: {{ formatTime(nextDoseTime) }}</span>
        <span class="text-xs text-gray-500">{{ getRelativeTime(nextDoseTime) }}</span>
      </div>

      <!-- Frequency information -->
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-calendar-days" class="text-green-500" />
        <span class="text-sm">{{ frequencyText }}</span>
      </div>

      <!-- Instructions (if any) -->
      <div v-if="pill.instructions" class="flex items-start gap-2">
        <UIcon name="i-heroicons-information-circle" class="text-amber-500 mt-0.5" />
        <span class="text-sm text-gray-600 dark:text-gray-300">{{ pill.instructions }}</span>
      </div>

      <!-- Action buttons -->
      <div class="flex gap-2 pt-2">
        <UButton 
          variant="soft" 
          color="success" 
          size="sm" 
          @click="markAsTaken"
          :disabled="loading"
        >
          <UIcon name="i-heroicons-check" />
          Mark Taken
        </UButton>
        
        <UButton 
          variant="soft" 
          color="primary" 
          size="sm" 
          @click="editPill"
        >
          <UIcon name="i-heroicons-pencil" />
          Edit
        </UButton>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { Pill } from '~/types'

interface Props {
  pill: Pill
  showActions?: boolean
}

interface Emits {
  (e: 'edit', pill: Pill): void
  (e: 'delete', pillId: string): void
  (e: 'markTaken', pillId: string): void
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true
})

const emit = defineEmits<Emits>()

// State
const loading = ref(false)

// Computed properties
const pillColorClass = computed(() => {
  const colorMap: Record<string, string> = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    orange: 'bg-orange-500'
  }
  return colorMap[props.pill.color || 'blue'] || 'bg-blue-500'
})

const pillShapeStyle = computed(() => {
  const shapeMap: Record<string, Record<string, string>> = {
    round: { borderRadius: '50%' },
    oval: { borderRadius: '50%', transform: 'scaleX(0.8)' },
    square: { borderRadius: '4px' },
    capsule: { borderRadius: '16px' },
    triangle: { clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' },
    diamond: { transform: 'rotate(45deg)' }
  }
  return shapeMap[props.pill.shape || 'round'] || shapeMap.round
})

const frequencyText = computed(() => {
  const { frequency } = props.pill
  switch (frequency.type) {
    case 'daily':
      return `${frequency.times.length} time${frequency.times.length > 1 ? 's' : ''} daily`
    case 'weekly':
      return `${frequency.value} day${frequency.value > 1 ? 's' : ''} per week`
    case 'monthly':
      return `${frequency.value} time${frequency.value > 1 ? 's' : ''} per month`
    case 'as-needed':
      return 'As needed'
    default:
      return 'Custom schedule'
  }
})

const nextDoseTime = computed(() => {
  const now = new Date()
  const times = props.pill.frequency.times
  
  // Find the next time slot for today
  const today = new Date().toISOString().split('T')[0]
  for (const timeSlot of times) {
    const doseTime = new Date(`${today}T${timeSlot.time}:00`)
    if (doseTime > now && !timeSlot.taken) {
      return doseTime
    }
  }
  
  // If no more times today, find first time tomorrow
  if (times.length > 0) {
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowDate = tomorrow.toISOString().split('T')[0]
    return new Date(`${tomorrowDate}T${times[0].time}:00`)
  }
  
  return null
})

const menuItems = computed(() => [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square',
    click: editPill
  }],
  [{
    label: 'Delete',
    icon: 'i-heroicons-trash',
    click: deletePill
  }]
])

// Methods
const markAsTaken = async () => {
  try {
    loading.value = true
    emit('markTaken', props.pill.id)
  } finally {
    loading.value = false
  }
}

const editPill = () => {
  emit('edit', props.pill)
}

const deletePill = () => {
  emit('delete', props.pill.id)
}
</script>

<style scoped>
.pill-card {
  @apply transition-all duration-200 hover:shadow-md;
}

.pill-shape {
  @apply shadow-sm;
}
</style>