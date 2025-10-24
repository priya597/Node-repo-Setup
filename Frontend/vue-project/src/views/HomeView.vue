<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-8">
          Multivac Developer Interview Project
        </h1>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <router-link 
            to="/customers" 
            class="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500"
          >
            <div class="text-blue-500 text-4xl mb-4">👥</div>
            <h2 class="text-2xl font-semibold text-gray-900 mb-2">Customers</h2>
            <p class="text-gray-600">View and search customers with their assigned machines</p>
          </router-link>
          
          <router-link 
            to="/machines" 
            class="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-green-500"
          >
            <div class="text-green-500 text-4xl mb-4">⚙️</div>
            <h2 class="text-2xl font-semibold text-gray-900 mb-2">Machines</h2>
            <p class="text-gray-600">Manage machines, assign to customers, and toggle production status</p>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Home view component
</script>
