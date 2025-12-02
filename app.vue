<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>

<script setup>
// PWA composables
const { $pwa } = useNuxtApp()

// Set page meta for PWA
useHead({
  title: 'Pill Tracker',
  meta: [
    { name: 'description', content: 'Track your medication schedule with ease' },
    { name: 'theme-color', content: '#3B82F6' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }
  ]
})

// Handle PWA updates
onMounted(() => {
  if ($pwa?.needRefresh) {
    // Show update notification using Nuxt UI Toast
    const toast = useToast()
    toast.add({
      title: 'App Update Available',
      description: 'A new version is available. Tap to update.',
      timeout: 0,
      actions: [{
        label: 'Update',
        click: () => {
          $pwa.updateServiceWorker()
        }
      }, {
        label: 'Later',
        click: () => {
          toast.clear()
        }
      }]
    })
  }
})
</script>

<style>
/* Global app styles following Nuxt UI guidelines */
#__nuxt {
  height: 100vh;
  overflow: hidden;
}
</style>