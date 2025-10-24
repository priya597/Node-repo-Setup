<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <h1 class="text-3xl font-bold text-gray-900">Customers</h1>
          <router-link 
            to="/" 
            class="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Home
          </router-link>
        </div>
      </div>

      <!-- Search -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="search" class="block text-sm font-medium text-gray-700 mb-2">
              Search by Company Name
            </label>
            <input
              id="search"
              v-model="searchQuery"
              type="text"
              placeholder="Enter company name..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @input="searchCustomers"
            />
          </div>
          <button
            @click="clearSearch"
            class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p class="mt-2 text-gray-600">Loading customers...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-8">
        <p class="text-red-800">{{ error }}</p>
      </div>

      <!-- Customers List -->
      <div v-else-if="customers.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="customer in customers" 
          :key="customer.id"
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ customer.companyName }}</h3>
          <div class="space-y-2 text-sm text-gray-600">
            <p><strong>Contact:</strong> {{ customer.contactName }}</p>
            <p><strong>Email:</strong> {{ customer.email }}</p>
            <p><strong>Phone:</strong> {{ customer.phone }}</p>
            <p><strong>Address:</strong> {{ customer.address }}</p>
          </div>
          
          <!-- Assigned Machines -->
          <div v-if="customer.machines && customer.machines.length > 0" class="mt-4">
            <h4 class="font-medium text-gray-900 mb-2">Assigned Machines:</h4>
            <div class="space-y-1">
              <div 
                v-for="machine in customer.machines" 
                :key="machine.id"
                class="text-sm bg-gray-100 px-2 py-1 rounded"
              >
                {{ machine.name }} ({{ machine.model }})
                <span 
                  :class="machine.isProducing ? 'text-green-600' : 'text-red-600'"
                  class="ml-2"
                >
                  {{ machine.isProducing ? '🟢 Producing' : '🔴 Not Producing' }}
                </span>
              </div>
            </div>
          </div>
          <div v-else class="mt-4 text-sm text-gray-500">
            No machines assigned
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="text-gray-400 text-6xl mb-4">👥</div>
        <h3 class="text-xl font-medium text-gray-900 mb-2">No customers found</h3>
        <p class="text-gray-600">
          {{ searchQuery ? 'Try adjusting your search criteria' : 'No customers available' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { customerApi } from '../services/api.js'

const customers = ref([])
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')

const fetchCustomers = async (companyName = '') => {
  loading.value = true
  error.value = ''
  try {
    const response = await customerApi.getAll(companyName)
    customers.value = response.data
  } catch (err) {
    error.value = 'Failed to fetch customers. Please try again.'
    console.error('Error fetching customers:', err)
  } finally {
    loading.value = false
  }
}

const searchCustomers = () => {
  fetchCustomers(searchQuery.value)
}

const clearSearch = () => {
  searchQuery.value = ''
  fetchCustomers()
}

onMounted(() => {
  fetchCustomers()
})
</script>
