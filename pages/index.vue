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

      <div class="grid grid-cols-1 gap-4">
        <UCard class="hover:shadow-md transition-shadow cursor-pointer" @click="navigateTo('/add-pill')">
          <div class="flex items-center gap-3">
            <UIcon name="i-heroicons-plus-circle" class="h-8 w-8 text-primary-600" />
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white">Add Medication</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Register a new pill</p>
            </div>
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

const stats = computed(() => ({
  totalPills: 0,
  takenToday: 0,
  remainingToday: 0,
  streakDays: 5 // This would come from stored data
}))

// Methods
function getCurrentGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning!'
  if (hour < 18) return 'Good afternoon!'
  return 'Good evening!'
}
</script>