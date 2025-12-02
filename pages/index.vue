<template>
  <div class="space-y-6">
    <!-- Welcome Card -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-3">
          <UIcon name="i-heroicons-hand-raised" class="h-6 w-6 text-primary-600" />
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Welcome to Pill Tracker
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ getCurrentGreeting() }}
            </p>
          </div>
        </div>
      </template>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <UCard class="hover:shadow-md transition-shadow cursor-pointer" @click="navigateTo('/add-pill')">
          <div class="flex items-center gap-3">
            <UIcon name="i-heroicons-plus-circle" class="h-8 w-8 text-primary-600" />
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white">Add Medication</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Register a new pill</p>
            </div>
          </div>
        </UCard>

        <UCard class="hover:shadow-md transition-shadow cursor-pointer" @click="navigateTo('/schedule')">
          <div class="flex items-center gap-3">
            <UIcon name="i-heroicons-clock" class="h-8 w-8 text-orange-500" />
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white">View Schedule</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Check today's pills</p>
            </div>
          </div>
        </UCard>
      </div>
    </UCard>

    <!-- Today's Schedule -->
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Today's Schedule
          </h2>
          <UBadge :label="todaysPills.length.toString()" color="primary" />
        </div>
      </template>

      <div v-if="todaysPills.length === 0" class="text-center py-8">
        <UIcon name="i-heroicons-face-smile" class="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <p class="text-gray-500 dark:text-gray-400">No pills scheduled for today</p>
        <UButton
          label="Add your first pill"
          icon="i-heroicons-plus"
          class="mt-3"
          @click="navigateTo('/add-pill')"
        />
      </div>

      <div v-else class="space-y-3">
        <UCard
          v-for="pill in todaysPills"
          :key="pill.id"
          :ui="{ 
            body: { padding: 'p-3' },
            ring: 'ring-1 ring-gray-200 dark:ring-gray-700'
          }"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-3 h-3 rounded-full" :class="pill.taken ? 'bg-green-500' : 'bg-orange-500'"></div>
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white">{{ pill.name }}</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ pill.dosage }} • {{ pill.time }}</p>
              </div>
            </div>
            
            <UButton
              v-if="!pill.taken"
              label="Mark Taken"
              size="xs"
              @click="markAsTaken(pill.id)"
            />
            <UBadge v-else label="Taken" color="green" size="xs" />
          </div>
        </UCard>
      </div>
    </UCard>

    <!-- Quick Stats -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <UCard>
        <div class="text-center">
          <div class="text-2xl font-bold text-primary-600">{{ stats.totalPills }}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Total Pills</div>
        </div>
      </UCard>
      
      <UCard>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">{{ stats.takenToday }}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Taken Today</div>
        </div>
      </UCard>
      
      <UCard>
        <div class="text-center">
          <div class="text-2xl font-bold text-orange-600">{{ stats.remainingToday }}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Remaining</div>
        </div>
      </UCard>
      
      <UCard>
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">{{ stats.streakDays }}d</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Streak</div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup>
// Page meta
definePageMeta({
  title: 'Pill Tracker - Home'
})

// Reactive data for demo
const todaysPills = ref([
  {
    id: 1,
    name: 'Vitamin D',
    dosage: '1000 IU',
    time: '8:00 AM',
    taken: false
  },
  {
    id: 2,
    name: 'Omega-3',
    dosage: '500mg',
    time: '12:00 PM',
    taken: true
  },
  {
    id: 3,
    name: 'Magnesium',
    dosage: '200mg',
    time: '9:00 PM',
    taken: false
  }
])

const stats = computed(() => ({
  totalPills: todaysPills.value.length,
  takenToday: todaysPills.value.filter(p => p.taken).length,
  remainingToday: todaysPills.value.filter(p => !p.taken).length,
  streakDays: 5 // This would come from stored data
}))

// Methods
function getCurrentGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning!'
  if (hour < 18) return 'Good afternoon!'
  return 'Good evening!'
}

function markAsTaken(pillId) {
  const toast = useToast()
  const pill = todaysPills.value.find(p => p.id === pillId)
  if (pill) {
    pill.taken = true
    toast.add({
      title: 'Pill Taken!',
      description: `${pill.name} marked as taken`,
      icon: 'i-heroicons-check-circle',
      timeout: 3000
    })
  }
}
</script>