<template>
  <UModal v-model="isOpen" :prevent-close="loading">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">
            {{ isEdit ? 'Edit Pill' : 'Add New Pill' }}
          </h3>
          <UButton
            icon="i-heroicons-x-mark"
            variant="ghost"
            size="sm"
            square
            @click="closeModal"
            :disabled="loading"
          />
        </div>
      </template>

      <UForm 
        :schema="schema" 
        :state="formData" 
        @submit="handleSubmit"
        class="space-y-6"
      >
        <!-- Pill Name -->
        <UFormGroup label="Pill Name" name="name" required>
          <UInput 
            v-model="formData.name" 
            placeholder="e.g., Aspirin, Vitamin D"
            :disabled="loading"
          />
        </UFormGroup>

        <!-- Description -->
        <UFormGroup label="Description" name="description">
          <UTextarea 
            v-model="formData.description" 
            placeholder="Optional description or notes"
            :rows="2"
            :disabled="loading"
          />
        </UFormGroup>

        <!-- Dosage -->
        <UFormGroup label="Dosage" name="dosage" required>
          <UInput 
            v-model="formData.dosage" 
            placeholder="e.g., 10 mg, 1 tablet, 5 ml"
            :disabled="loading"
          />
        </UFormGroup>

        <!-- Frequency Type -->
        <UFormGroup label="Frequency" name="frequency.type" required>
          <USelect
            v-model="formData.frequency.type"
            :options="frequencyOptions"
            placeholder="How often?"
            :disabled="loading"
          />
        </UFormGroup>

        <!-- Frequency Value (for weekly/monthly) -->
        <UFormGroup 
          v-if="showFrequencyValue"
          :label="frequencyValueLabel"
          name="frequency.value"
        >
          <UInput 
            v-model.number="formData.frequency.value"
            type="number"
            :min="1"
            :max="31"
            :disabled="loading"
          />
        </UFormGroup>

        <!-- Time Slots -->
        <div v-if="formData.frequency.type !== 'as-needed'">
          <UFormGroup label="Times per day" required>
            <div class="space-y-3">
              <div 
                v-for="(timeSlot, index) in formData.frequency.times"
                :key="timeSlot.id"
                class="flex items-center gap-3"
              >
                <UInput 
                  v-model="timeSlot.time"
                  type="time"
                  class="flex-1"
                  :disabled="loading"
                />
                <UButton
                  v-if="formData.frequency.times.length > 1"
                  icon="i-heroicons-trash"
                  variant="soft"
                  color="error"
                  size="sm"
                  square
                  @click="removeTimeSlot(index)"
                  :disabled="loading"
                />
              </div>
              
              <UButton
                v-if="formData.frequency.times.length < 6"
                icon="i-heroicons-plus"
                variant="soft"
                size="sm"
                @click="addTimeSlot"
                :disabled="loading"
              >
                Add Time
              </UButton>
            </div>
          </UFormGroup>
        </div>

        <!-- Start Date -->
        <UFormGroup label="Start Date" name="frequency.startDate" required>
          <UInput 
            v-model="startDateString"
            type="date"
            :disabled="loading"
          />
        </UFormGroup>

        <!-- End Date (optional) -->
        <UFormGroup label="End Date (Optional)" name="frequency.endDate">
          <UInput 
            v-model="endDateString"
            type="date"
            :disabled="loading"
          />
        </UFormGroup>

        <!-- Pill Appearance -->
        <div class="grid grid-cols-2 gap-4">
          <UFormGroup label="Color" name="color">
            <USelect
              v-model="formData.color"
              :options="colorOptions"
              placeholder="Pill color"
              :disabled="loading"
            />
          </UFormGroup>

          <UFormGroup label="Shape" name="shape">
            <USelect
              v-model="formData.shape"
              :options="shapeOptions"
              placeholder="Pill shape"
              :disabled="loading"
            />
          </UFormGroup>
        </div>

        <!-- Instructions -->
        <UFormGroup label="Instructions" name="instructions">
          <UTextarea 
            v-model="formData.instructions" 
            placeholder="e.g., Take with food, Before bedtime"
            :rows="2"
            :disabled="loading"
          />
        </UFormGroup>

        <!-- Side Effects -->
        <UFormGroup label="Known Side Effects" name="sideEffects">
          <UTextarea 
            v-model="sideEffectsString" 
            placeholder="Enter side effects, one per line"
            :rows="3"
            :disabled="loading"
          />
        </UFormGroup>

        <!-- Form Actions -->
        <div class="flex gap-3 justify-end pt-4">
          <UButton
            variant="soft"
            @click="closeModal"
            :disabled="loading"
          >
            Cancel
          </UButton>
          
          <UButton
            type="submit"
            :loading="loading"
            :disabled="!isFormValid"
          >
            {{ isEdit ? 'Update Pill' : 'Add Pill' }}
          </UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { Pill, PillFormData, FrequencyType, PillShape } from '~/types'

interface Props {
  modelValue: boolean
  pill?: Pill
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', data: PillFormData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Computed model
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// State
const loading = ref(false)
const isEdit = computed(() => !!props.pill)

// Form data
const formData = reactive<PillFormData & { frequency: { times: { id: string; time: string; taken: boolean }[] } }>({
  name: '',
  description: '',
  dosage: '',
  frequency: {
    type: 'daily' as FrequencyType,
    value: 1,
    times: [{ id: crypto.randomUUID(), time: '09:00', taken: false }],
    startDate: new Date()
  },
  instructions: '',
  color: 'blue',
  shape: 'round' as PillShape,
  sideEffects: []
})

// Form validation schema
const schema = z.object({
  name: z.string().min(1, 'Pill name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.object({
    type: z.enum(['daily', 'weekly', 'monthly', 'as-needed', 'custom']),
    value: z.number().min(1).max(31),
    startDate: z.date()
  })
})

// Options
const frequencyOptions = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'As needed', value: 'as-needed' }
]

const colorOptions = [
  { label: 'Blue', value: 'blue' },
  { label: 'Red', value: 'red' },
  { label: 'Green', value: 'green' },
  { label: 'Yellow', value: 'yellow' },
  { label: 'Purple', value: 'purple' },
  { label: 'Pink', value: 'pink' },
  { label: 'Orange', value: 'orange' }
]

const shapeOptions = [
  { label: 'Round', value: 'round' },
  { label: 'Oval', value: 'oval' },
  { label: 'Capsule', value: 'capsule' },
  { label: 'Square', value: 'square' },
  { label: 'Triangle', value: 'triangle' },
  { label: 'Diamond', value: 'diamond' }
]

// Computed
const showFrequencyValue = computed(() => {
  return ['weekly', 'monthly'].includes(formData.frequency.type)
})

const frequencyValueLabel = computed(() => {
  switch (formData.frequency.type) {
    case 'weekly':
      return 'Days per week'
    case 'monthly':
      return 'Days per month'
    default:
      return 'Value'
  }
})

const startDateString = computed({
  get: () => formData.frequency.startDate.toISOString().split('T')[0],
  set: (value) => formData.frequency.startDate = new Date(value)
})

const endDateString = computed({
  get: () => formData.frequency.endDate?.toISOString().split('T')[0] || '',
  set: (value) => formData.frequency.endDate = value ? new Date(value) : undefined
})

const sideEffectsString = computed({
  get: () => formData.sideEffects?.join('\n') || '',
  set: (value) => formData.sideEffects = value.split('\n').filter(s => s.trim())
})

const isFormValid = computed(() => {
  return formData.name.trim() && 
         formData.dosage.trim() && 
         formData.frequency.times.length > 0
})

// Methods
const addTimeSlot = () => {
  formData.frequency.times.push({
    id: crypto.randomUUID(),
    time: '12:00',
    taken: false
  })
}

const removeTimeSlot = (index: number) => {
  formData.frequency.times.splice(index, 1)
}

const resetForm = () => {
  Object.assign(formData, {
    name: '',
    description: '',
    dosage: '',
    frequency: {
      type: 'daily' as FrequencyType,
      value: 1,
      times: [{ id: crypto.randomUUID(), time: '09:00', taken: false }],
      startDate: new Date()
    },
    instructions: '',
    color: 'blue',
    shape: 'round' as PillShape,
    sideEffects: []
  })
}

const loadPillData = () => {
  if (props.pill) {
    Object.assign(formData, {
      name: props.pill.name,
      description: props.pill.description || '',
      dosage: props.pill.dosage,
      frequency: {
        type: props.pill.frequency.type,
        value: props.pill.frequency.value,
        times: props.pill.frequency.times.map(t => ({ ...t })),
        startDate: new Date(props.pill.frequency.startDate),
        endDate: props.pill.frequency.endDate ? new Date(props.pill.frequency.endDate) : undefined
      },
      instructions: props.pill.instructions || '',
      color: props.pill.color || 'blue',
      shape: props.pill.shape || 'round',
      sideEffects: props.pill.sideEffects || []
    })
  }
}

const handleSubmit = async () => {
  try {
    loading.value = true
    
    const submitData = {
      name: formData.name,
      description: formData.description,
      dosage: formData.dosage,
      frequency: {
        type: formData.frequency.type,
        value: formData.frequency.value,
        startDate: formData.frequency.startDate,
        endDate: formData.frequency.endDate,
        times: formData.frequency.times
      },
      instructions: formData.instructions,
      color: formData.color,
      shape: formData.shape,
      sideEffects: formData.sideEffects
    }
    
    emit('submit', submitData as any)
    closeModal()
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  isOpen.value = false
  resetForm()
}

// Watchers
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    loadPillData()
  }
})

watch(() => formData.frequency.type, (newType) => {
  if (newType === 'as-needed') {
    formData.frequency.times = []
  } else if (formData.frequency.times.length === 0) {
    formData.frequency.times = [{ id: crypto.randomUUID(), time: '09:00', taken: false }]
  }
})
</script>