<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <h1 class="text-3xl font-bold text-gray-900">Machines</h1>
          <router-link 
            to="/" 
            class="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Home
          </router-link>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Add Machine Form -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Add New Machine</h2>
          
          <form @submit.prevent="addMachine" class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                Machine Name *
              </label>
              <input
                id="name"
                v-model="newMachine.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter machine name"
              />
            </div>

            <div>
              <label for="model" class="block text-sm font-medium text-gray-700 mb-1">
                Model *
              </label>
              <input
                id="model"
                v-model="newMachine.model"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter model"
              />
            </div>

            <div>
              <label for="serialNumber" class="block text-sm font-medium text-gray-700 mb-1">
                Serial Number *
              </label>
              <input
                id="serialNumber"
                v-model="newMachine.serialNumber"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter serial number"
              />
            </div>

            <div>
              <label for="customerId" class="block text-sm font-medium text-gray-700 mb-1">
                Assign to Customer
              </label>
              <select
                id="customerId"
                v-model="newMachine.customerId"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a customer (optional)</option>
                <option 
                  v-for="customer in customers" 
                  :key="customer.id" 
                  :value="customer.id"
                >
                  {{ customer.companyName }}
                </option>
              </select>
            </div>

            <div class="flex items-center">
              <input
                id="isProducing"
                v-model="newMachine.isProducing"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="isProducing" class="ml-2 block text-sm text-gray-700">
                Currently Producing
              </label>
            </div>

            <button
              type="submit"
              :disabled="addingMachine"
              class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ addingMachine ? 'Adding...' : 'Add Machine' }}
            </button>
          </form>
        </div>

        <!-- Machines List -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">All Machines</h2>
          
          <!-- Loading State -->
          <div v-if="loading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <p class="mt-2 text-gray-600">Loading machines...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <p class="text-red-800">{{ error }}</p>
          </div>

          <!-- Machines List -->
          <div v-else-if="machines.length > 0" class="space-y-4">
            <div 
              v-for="machine in machines" 
              :key="machine.id"
              class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900">{{ machine.name }}</h3>
                  <p class="text-sm text-gray-600">{{ machine.model }} - {{ machine.serialNumber }}</p>
                  
                  <div v-if="machine.customer" class="mt-2">
                    <span class="text-sm text-blue-600">
                      Assigned to: {{ machine.customer.companyName }}
                    </span>
                  </div>
                  <div v-else class="mt-2">
                    <span class="text-sm text-gray-500">Not assigned to any customer</span>
                  </div>
                </div>
                
                <div class="flex items-center space-x-2">
                  <button
                    @click="toggleProducing(machine.id)"
                    :class="machine.isProducing ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'"
                    class="px-3 py-1 text-white text-sm rounded-md transition-colors"
                  >
                    {{ machine.isProducing ? 'Producing' : 'Not Producing' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-8">
            <div class="text-gray-400 text-4xl mb-2">⚙️</div>
            <p class="text-gray-600">No machines found</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { machineApi, customerApi } from '../services/api.js'

const machines = ref([])
const customers = ref([])
const loading = ref(false)
const error = ref('')
const addingMachine = ref(false)

const newMachine = ref({
  name: '',
  model: '',
  serialNumber: '',
  customerId: '',
  isProducing: false
})

const fetchMachines = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await machineApi.getAll()
    machines.value = response.data
  } catch (err) {
    error.value = 'Failed to fetch machines. Please try again.'
    console.error('Error fetching machines:', err)
  } finally {
    loading.value = false
  }
}

const fetchCustomers = async () => {
  try {
    const response = await customerApi.getAll()
    customers.value = response.data
  } catch (err) {
    console.error('Error fetching customers:', err)
  }
}

const addMachine = async () => {
  addingMachine.value = true
  try {
    const machineData = {
      ...newMachine.value,
      customerId: newMachine.value.customerId || null
    }
    
    await machineApi.create(machineData)
    
    // Reset form
    newMachine.value = {
      name: '',
      model: '',
      serialNumber: '',
      customerId: '',
      isProducing: false
    }
    
    // Refresh machines list
    await fetchMachines()
  } catch (err) {
    error.value = 'Failed to add machine. Please try again.'
    console.error('Error adding machine:', err)
  } finally {
    addingMachine.value = false
  }
}

const toggleProducing = async (machineId) => {
  try {
    await machineApi.toggleProducing(machineId)
    await fetchMachines() // Refresh the list
  } catch (err) {
    error.value = 'Failed to toggle producing status. Please try again.'
    console.error('Error toggling producing status:', err)
  }
}

onMounted(() => {
  fetchMachines()
  fetchCustomers()
})
</script>
