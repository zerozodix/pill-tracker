<template>
  <div class="space-y-6">
    <UCard>
      <template #header>
        <div class="flex items-center gap-3">
          <UButton
            icon="i-heroicons-arrow-left"
            color="gray"
            variant="ghost"
            size="sm"
            @click="navigateTo('/')"
          />
          <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Add New Medication</h1>
        </div>
      </template>

      <UForm :schema="pillSchema" :state="state" @submit="onSubmit" class="space-y-4">
        <UFormGroup label="Medication Name" name="name" required>
          <UInput v-model="state.name" placeholder="Enter medication name" />
        </UFormGroup>

        <UFormGroup label="Dosage" name="dosage" required>
          <UInput v-model="state.dosage" placeholder="e.g., 500mg, 1 tablet" />
        </UFormGroup>

        <UFormGroup label="Frequency" name="frequency" required>
          <USelect
            v-model="state.frequency"
            :options="frequencyOptions"
            placeholder="Select frequency"
          />
        </UFormGroup>

        <UFormGroup label="Time(s)" name="times" required>
          <div class="space-y-2">
            <div v-for="(time, index) in state.times" :key="index" class="flex gap-2">
              <UInput
                v-model="state.times[index]"
                type="time"
                class="flex-1"
              />
              <UButton
                v-if="state.times.length > 1"
                icon="i-heroicons-trash"
                color="red"
                variant="ghost"
                size="sm"
                @click="removeTime(index)"
              />
            </div>
            <UButton
              label="Add Time"
              icon="i-heroicons-plus"
              variant="ghost"
              size="sm"
              @click="addTime"
            />
          </div>
        </UFormGroup>

        <UFormGroup label="Start Date" name="startDate">
          <UInput v-model="state.startDate" type="date" />
        </UFormGroup>

        <UFormGroup label="End Date (Optional)" name="endDate">
          <UInput v-model="state.endDate" type="date" />
        </UFormGroup>

        <UFormGroup label="Notes" name="notes">
          <UTextarea
            v-model="state.notes"
            placeholder="Additional notes about this medication"
            rows="3"
          />
        </UFormGroup>

        <UFormGroup label="Color" name="color">
          <div class="flex gap-2">
            <button
              v-for="color in colorOptions"
              :key="color.value"
              type="button"
              :class="[
                'w-8 h-8 rounded-full border-2',
                state.color === color.value ? 'border-gray-900 dark:border-white' : 'border-gray-300'
              ]"
              :style="{ backgroundColor: color.hex }"
              @click="state.color = color.value"
            />
          </div>
        </UFormGroup>

        <div class="flex gap-3 pt-4">
          <UButton
            label="Cancel"
            color="gray"
            variant="ghost"
            class="flex-1"
            @click="navigateTo('/')"
          />
          <UButton
            type="submit"
            label="Save Medication"
            class="flex-1"
            :loading="loading"
          />
        </div>
      </UForm>
    </UCard>
  </div>
</template>

<script setup>
import { z } from 'zod'

// Page meta
definePageMeta({
  title: 'Add Medication'
})

// Form schema using Zod
const pillSchema = z.object({
  name: z.string().min(1, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  times: z.array(z.string()).min(1, 'At least one time is required'),
  startDate: z.string(),
  endDate: z.string().optional(),
  notes: z.string().optional(),
  color: z.string()
})

// Form state
const state = reactive({
  name: '',
  dosage: '',
  frequency: 'daily',
  times: ['08:00'],
  startDate: new Date().toISOString().split('T')[0],
  endDate: '',
  notes: '',
  color: 'blue'
})

const loading = ref(false)

// Options
const frequencyOptions = [
  { label: 'Once daily', value: 'daily' },
  { label: 'Twice daily', value: 'twice-daily' },
  { label: 'Three times daily', value: 'three-times' },
  { label: 'Four times daily', value: 'four-times' },
  { label: 'As needed', value: 'as-needed' },
  { label: 'Custom', value: 'custom' }
]

const colorOptions = [
  { label: 'Blue', value: 'blue', hex: '#3B82F6' },
  { label: 'Green', value: 'green', hex: '#10B981' },
  { label: 'Red', value: 'red', hex: '#EF4444' },
  { label: 'Orange', value: 'orange', hex: '#F97316' },
  { label: 'Purple', value: 'purple', hex: '#8B5CF6' },
  { label: 'Pink', value: 'pink', hex: '#EC4899' },
  { label: 'Yellow', value: 'yellow', hex: '#EAB308' },
  { label: 'Gray', value: 'gray', hex: '#6B7280' }
]

// Watch frequency changes to update times array
watch(() => state.frequency, (newFrequency) => {
  switch (newFrequency) {
    case 'daily':
      state.times = ['08:00']
      break
    case 'twice-daily':
      state.times = ['08:00', '20:00']
      break
    case 'three-times':
      state.times = ['08:00', '13:00', '20:00']
      break
    case 'four-times':
      state.times = ['08:00', '13:00', '18:00', '22:00']
      break
    default:
      // Keep current times for as-needed or custom
      break
  }
})

// Methods
function addTime() {
  state.times.push('08:00')
}

function removeTime(index) {
  state.times.splice(index, 1)
}

async function onSubmit() {
  loading.value = true
  const toast = useToast()
  
  try {
    // Here you would save to your data store/API
    console.log('Saving medication:', state)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.add({
      title: 'Success!',
      description: `${state.name} has been added to your medications`,
      icon: 'i-heroicons-check-circle',
      timeout: 3000
    })
    
    // Navigate back to home
    await navigateTo('/')
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to save medication. Please try again.',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 5000,
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}
</script>