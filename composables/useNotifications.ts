/**
 * Composable for managing pill reminders and notifications
 */
export const useNotifications = () => {
    const isSupported = ref(false)
    const permission = ref<NotificationPermission>('default')

    /**
     * Check if notifications are supported and get permission status
     */
    const checkSupport = () => {
        if (import.meta.client) {
            isSupported.value = 'Notification' in window
            if (isSupported.value) {
                permission.value = Notification.permission
            }
        }
    }

    /**
     * Request notification permission
     */
    const requestPermission = async (): Promise<NotificationPermission> => {
        if (!isSupported.value) {
            throw new Error('Notifications not supported')
        }

        try {
            const result = await Notification.requestPermission()
            permission.value = result
            return result
        } catch (error) {
            console.error('Error requesting notification permission:', error)
            throw error
        }
    }

    /**
     * Show a notification
     */
    const showNotification = (title: string, options?: NotificationOptions) => {
        if (!isSupported.value || permission.value !== 'granted') {
            console.warn('Notifications not available or not permitted')
            return null
        }

        return new Notification(title, {
            icon: '/icon-192x192.png',
            badge: '/icon-192x192.png',
            ...options
        })
    }

    /**
     * Schedule a pill reminder
     */
    const schedulePillReminder = (pillName: string, time: string) => {
        if (!isSupported.value || permission.value !== 'granted') {
            return
        }

        const now = new Date()
        const [hours, minutes] = time.split(':').map(Number)
        const reminderTime = new Date()
        reminderTime.setHours(hours, minutes, 0, 0)

        // If the time has passed today, schedule for tomorrow
        if (reminderTime <= now) {
            reminderTime.setDate(reminderTime.getDate() + 1)
        }

        const timeUntilReminder = reminderTime.getTime() - now.getTime()

        setTimeout(() => {
            showNotification(`Time for ${pillName}`, {
                body: `It's time to take your ${pillName}`,
                tag: `pill-reminder-${pillName}`,
                requireInteraction: true
            })
        }, timeUntilReminder)
    }

    // Initialize on client side
    onMounted(() => {
        checkSupport()
    })

    return {
        isSupported: readonly(isSupported),
        permission: readonly(permission),
        checkSupport,
        requestPermission,
        showNotification,
        schedulePillReminder
    }
}