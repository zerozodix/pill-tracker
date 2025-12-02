<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 safe-area-inset">
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 justify-between items-center">
          <!-- Logo -->
          <div class="flex items-center">
            <UIcon name="i-heroicons-squares-plus" class="h-8 w-8 text-primary-600" />
            <h1 class="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
              Pill Tracker
            </h1>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <!-- Theme Toggle -->
            <UButton
              :icon="$colorMode.value === 'dark' ? 'i-heroicons-sun' : 'i-heroicons-moon'"
              color="gray"
              variant="ghost"
              size="sm"
              @click="$colorMode.preference = $colorMode.value === 'dark' ? 'light' : 'dark'"
            />
            
            <!-- Settings -->
            <UButton
              icon="i-heroicons-cog-6-tooth"
              color="gray"
              variant="ghost"
              size="sm"
              to="/settings"
            />
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <slot />
    </main>

    <!-- Bottom Navigation for PWA -->
    <nav class="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 safe-area-inset">
      <div class="flex justify-center items-center py-2 gap-4">
        <UButton
          icon="i-heroicons-home"
          color="gray"
          variant="ghost"
          class="px-6 py-3"
          to="/"
          :ui="{ 
            rounded: 'rounded-lg',
            padding: { sm: 'px-6 py-3' }
          }"
        >
          Home
        </UButton>
        
        <UButton
          icon="i-heroicons-plus-circle"
          color="primary"
          variant="ghost"
          class="px-6 py-3"
          to="/add-pill"
          :ui="{ 
            rounded: 'rounded-lg',
            padding: { sm: 'px-6 py-3' }
          }"
        >
          Add
        </UButton>
        
        <UButton
          icon="i-heroicons-chart-bar"
          color="gray"
          variant="ghost"
          class="px-6 py-3"
          to="/history"
          :ui="{ 
            rounded: 'rounded-lg',
            padding: { sm: 'px-6 py-3' }
          }"
        >
          History
        </UButton>
      </div>
    </nav>

    <!-- Notifications using Nuxt UI Toast -->
    <UNotifications />
  </div>
</template>

<script setup>
// Color mode composable
const colorMode = useColorMode()

// Page meta
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' }
  ]
})
</script>

<style scoped>
/* Add bottom padding to main content to account for bottom navigation */
main {
  padding-bottom: 5rem; /* 80px to account for bottom nav */
}
</style>