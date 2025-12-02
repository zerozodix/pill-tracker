export default defineNuxtRouteMiddleware((to, from) => {
    // Example middleware - you can add authentication logic here
    // For now, just log navigation
    console.log(`Navigating from ${from?.path || 'unknown'} to ${to.path}`)
})