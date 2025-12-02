import type { Pill } from '~/types'

export default defineEventHandler(async (event) => {
    const method = getMethod(event)

    switch (method) {
        case 'GET':
            return await getPills()
        case 'POST':
            const body = await readBody(event)
            return await createPill(body)
        default:
            throw createError({
                statusCode: 405,
                statusMessage: 'Method Not Allowed'
            })
    }
})

async function getPills(): Promise<Pill[]> {
    // In a real application, this would fetch from a database
    // For now, return an empty array as data is stored client-side
    return []
}

async function createPill(data: Omit<Pill, 'id' | 'createdAt' | 'updatedAt'>): Promise<Pill> {
    // In a real application, this would save to a database
    const newPill: Pill = {
        id: crypto.randomUUID(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
    }

    return newPill
}