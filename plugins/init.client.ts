export default defineNuxtPlugin(async () => {
    // Initialize app data on client side only
    if (import.meta.client) {
        const pillStore = usePillStore()

        // Load pills from localStorage
        await pillStore.loadPills()

        // Set up notification permissions if needed
        const { requestPermission, permission } = useNotifications()

        // Automatically request notification permission if not yet determined
        if (permission.value === 'default') {
            try {
                await requestPermission()
            } catch (error) {
                console.log('User declined notification permission')
            }
        }
    }
})