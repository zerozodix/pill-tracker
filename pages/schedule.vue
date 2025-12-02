<template>
  <div class="space-y-6">
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Today's Schedule</h1>
          <UButton
            icon="i-heroicons-calendar"
            color="gray"
            variant="ghost"
            size="sm"
            @click="showDatePicker = true"
          />
        </div>
      </template>

      <!-- Date Selector -->
      <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
        <UButton
          v-for="day in weekDays"
          :key="day.date"
          :label="day.label"
          :variant="isToday(day.date) ? 'solid' : 'ghost'"
          :color="isToday(day.date) ? 'primary' : 'gray'"
          size="sm"
          class="whitespace-nowrap"
          @click="selectedDate = day.date"
        />
      </div>

      <!-- Schedule for selected date -->
      <div v-if="scheduledPills.length === 0" class="text-center py-8">
        <UIcon name="i-heroicons-calendar-x" class="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <p class="text-gray-500 dark:text-gray-400">No medications scheduled for this date</p>
      </div>

      <div v-else class="space-y-4">
        <div v-for="timeSlot in groupedPills" :key="timeSlot.time" class="space-y-3">
          <h3 class="font-medium text-gray-900 dark:text-white">{{ timeSlot.time }}</h3>
          
          <div class="grid gap-3">
            <UCard
              v-for="pill in timeSlot.pills"
              :key="pill.id"
              :ui="{
                body: { padding: 'p-4' },
                ring: `ring-1 ${pill.taken ? 'ring-green-200 bg-green-50 dark:ring-green-800 dark:bg-green-950' : 'ring-gray-200 dark:ring-gray-700'}`
              }"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div 
                    class="w-4 h-4 rounded-full border-2"
                    :class="pill.taken ? 'bg-green-500 border-green-500' : 'border-gray-300'"
                  />
                  <div class="flex items-center gap-3">
                    <div
                      class="w-3 h-3 rounded-full"
                      :style="{ backgroundColor: pill.color }"
                    />
                    <div>
                      <h4 class="font-medium text-gray-900 dark:text-white">{{ pill.name }}</h4>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ pill.dosage }}</p>
                      <p v-if="pill.notes" class="text-xs text-gray-400 mt-1">{{ pill.notes }}</p>
                    </div>
                  </div>
                </div>
                
                <div class="flex items-center gap-2">
                  <UButton
                    v-if="!pill.taken && !isPastDue(pill.time)"
                    label="Take"
                    size="xs"
                    @click="markAsTaken(pill.id)"
                  />
                  <UBadge
                    v-else-if="pill.taken"
                    label="Taken"
                    color="green"
                    size="xs"
                  />
                  <UBadge
                    v-else-if="isPastDue(pill.time)"
                    label="Missed"
                    color="red"
                    size="xs"
                  />
                  
                  <UDropdown :items="getPillActions(pill)">
                    <UButton
                      icon="i-heroicons-ellipsis-horizontal"
                      color="gray"
                      variant="ghost"
                      size="xs"
                    />
                  </UDropdown>
                </div>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Progress Summary -->
    <UCard>
      <template #header>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Today's Progress</h2>
      </template>
      
      <div class="space-y-4">
        <!-- Progress Bar -->
        <div>
          <div class="flex justify-between text-sm mb-2">
            <span class="text-gray-600 dark:text-gray-400">Taken</span>
            <span class="font-medium">{{ takenCount }} / {{ totalCount }}</span>
          </div>
          <UProgress :value="progressPercentage" :max="100" />
        </div>
        
        <!-- Stats Grid -->
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <div class="text-lg font-bold text-green-600">{{ takenCount }}</div>
            <div class="text-xs text-gray-500">Taken</div>
          </div>
          <div>
            <div class="text-lg font-bold text-orange-600">{{ remainingCount }}</div>
            <div class="text-xs text-gray-500">Remaining</div>
          </div>
          <div>
            <div class="text-lg font-bold text-red-600">{{ missedCount }}</div>
            <div class="text-xs text-gray-500">Missed</div>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup>
// Page meta
definePageMeta({
  title: 'Schedule'
})

// State
const selectedDate = ref(new Date().toISOString().split('T')[0])
const showDatePicker = ref(false)

// Sample data - replace with your data store
const pills = ref([
  {
    id: 1,
    name: 'Vitamin D',
    dosage: '1000 IU',
    time: '08:00',
    taken: false,
    color: '#3B82F6',
    notes: 'Take with breakfast'
  },
  {
    id: 2,
    name: 'Omega-3',
    dosage: '500mg',
    time: '12:00',
    taken: true,
    color: '#10B981',
    notes: 'Take with lunch'
  },
  {
    id: 3,
    name: 'Magnesium',
    dosage: '200mg',
    time: '21:00',
    taken: false,
    color: '#8B5CF6',
    notes: 'Take before bed'
  },
  {
    id: 4,
    name: 'Vitamin C',
    dosage: '500mg',
    time: '08:00',
    taken: false,
    color: '#F97316',
    notes: ''
  }
])

// Computed
const weekDays = computed(() => {
  const days = []
  const today = new Date()
  
  for (let i = -3; i <= 3; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    
    days.push({
      date: date.toISOString().split('T')[0],
      label: i === 0 ? 'Today' : date.toLocaleDateString('en', { weekday: 'short', month: 'numeric', day: 'numeric' })
    })
  }
  
  return days
})

const scheduledPills = computed(() => {
  // Filter pills for selected date
  return pills.value // In real app, filter by date
})

const groupedPills = computed(() => {
  const groups = scheduledPills.value.reduce((acc, pill) => {
    if (!acc[pill.time]) {
      acc[pill.time] = []
    }
    acc[pill.time].push(pill)
    return acc
  }, {})

  return Object.entries(groups)
    .map(([time, pills]) => ({
      time: formatTime(time),
      pills: pills.sort((a, b) => a.name.localeCompare(b.name))
    }))
    .sort((a, b) => a.time.localeCompare(b.time))
})

const takenCount = computed(() => scheduledPills.value.filter(p => p.taken).length)
const totalCount = computed(() => scheduledPills.value.length)
const remainingCount = computed(() => {
  return scheduledPills.value.filter(p => !p.taken && !isPastDue(p.time)).length
})
const missedCount = computed(() => {
  return scheduledPills.value.filter(p => !p.taken && isPastDue(p.time)).length
})
const progressPercentage = computed(() => {
  return totalCount.value > 0 ? Math.round((takenCount.value / totalCount.value) * 100) : 0
})

// Methods
function isToday(date) {
  return date === new Date().toISOString().split('T')[0]
}

function formatTime(time) {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('en', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  })
}

function isPastDue(time) {
  if (!isToday(selectedDate.value)) return false
  
  const now = new Date()
  const pillTime = new Date()
  const [hours, minutes] = time.split(':')
  pillTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)
  
  return now > pillTime
}

function markAsTaken(pillId) {
  const toast = useToast()
  const pill = pills.value.find(p => p.id === pillId)
  
  if (pill) {
    pill.taken = true
    toast.add({
      title: 'Medication Taken!',
      description: `${pill.name} marked as taken`,
      icon: 'i-heroicons-check-circle',
      timeout: 3000
    })
  }
}

function markAsSkipped(pillId) {
  const toast = useToast()
  const pill = pills.value.find(p => p.id === pillId)
  
  if (pill) {
    // In real app, you'd track skipped separately
    toast.add({
      title: 'Medication Skipped',
      description: `${pill.name} marked as skipped`,
      icon: 'i-heroicons-x-circle',
      timeout: 3000,
      color: 'orange'
    })
  }
}

function editPill(pillId) {
  // Navigate to edit page
  navigateTo(`/edit-pill/${pillId}`)
}

function getPillActions(pill) {
  const actions = []
  
  if (!pill.taken) {
    actions.push([
      {
        label: 'Mark as Taken',
        icon: 'i-heroicons-check',
        click: () => markAsTaken(pill.id)
      },
      {
        label: 'Skip',
        icon: 'i-heroicons-x-mark',
        click: () => markAsSkipped(pill.id)
      }
    ])
  }
  
  actions.push([
    {
      label: 'Edit',
      icon: 'i-heroicons-pencil',
      click: () => editPill(pill.id)
    }
  ])
  
  return actions
}
</script>