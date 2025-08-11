<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">AI Vision Art Analysis Test</h1>
      
      <!-- Image Upload Section -->
      <div class="bg-white rounded-lg shadow p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4">Upload Artwork Image</h2>
        
        <!-- File Upload -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Select artwork image
          </label>
          <input 
            ref="fileInput"
            type="file" 
            accept="image/*"
            @change="handleFileUpload"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <!-- Image Preview -->
        <div v-if="imagePreview" class="mb-6">
          <img 
            :src="imagePreview" 
            alt="Artwork preview"
            class="max-w-md max-h-64 rounded-lg border shadow-sm"
          />
        </div>

        <!-- Prompt Style Selection -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Analysis Style
          </label>
          <select v-model="analysisStyle" class="w-full p-3 border border-gray-300 rounded-md">
            <option value="humorous">Humorous Artist Statement (Your Example)</option>
            <option value="sophisticated">Sophisticated Art Critique</option>
            <option value="museum">Museum Docent Description</option>
            <option value="academic">Academic Art Analysis</option>
          </select>
        </div>

        <!-- Artist Age -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Artist Age (optional)
          </label>
          <input 
            v-model="artistAge"
            type="number" 
            class="w-32 p-3 border border-gray-300 rounded-md"
            placeholder="3"
            min="1"
            max="100"
          />
        </div>
        
        <button 
          @click="analyzeArtwork"
          :disabled="loading || !selectedFile"
          class="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Analyzing Image...' : 'Analyze Artwork' }}
        </button>
      </div>

      <!-- AI Analysis Results -->
      <div v-if="analysis || loading" class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">AI Vision Analysis</h2>
        
        <div v-if="loading" class="text-gray-600">
          <div class="animate-pulse flex items-center">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            Using Llama 3.2 11B Vision to analyze the artwork...
          </div>
        </div>
        
        <div v-if="analysis" class="prose max-w-none">
          <div class="bg-gray-50 p-6 rounded-md border-l-4 border-blue-500">
            <div class="whitespace-pre-wrap">{{ analysis }}</div>
          </div>
          <div class="mt-4 text-sm text-gray-500">
            Model: {{ modelUsed }} | Generated: {{ analysisTimestamp }}
          </div>
        </div>
        
        <div v-if="error" class="text-red-600 bg-red-50 p-4 rounded-md">
          Error: {{ error }}
        </div>
      </div>

      <!-- Example Images Section -->
      <div class="mt-8">
        <h2 class="text-xl font-semibold mb-4">Test with Example Images</h2>
        <div class="text-sm text-gray-600 mb-4">
          Upload your own artwork images, or use these examples to test the AI vision capabilities.
        </div>
        <div class="grid gap-4 md:grid-cols-3">
          <div class="text-center p-4 bg-white rounded-lg shadow">
            <div class="w-full h-32 bg-gradient-to-br from-yellow-200 via-red-200 to-blue-200 rounded-lg mb-2 flex items-center justify-center">
              <span class="text-xs text-gray-600">Upload your artwork</span>
            </div>
            <div class="text-sm font-medium">Child's Drawing</div>
          </div>
          
          <div class="text-center p-4 bg-white rounded-lg shadow">
            <div class="w-full h-32 bg-gradient-to-br from-purple-200 via-pink-200 to-orange-200 rounded-lg mb-2 flex items-center justify-center">
              <span class="text-xs text-gray-600">Upload your artwork</span>
            </div>
            <div class="text-sm font-medium">Abstract Art</div>
          </div>

          <div class="text-center p-4 bg-white rounded-lg shadow">
            <div class="w-full h-32 bg-gradient-to-br from-green-200 via-blue-200 to-indigo-200 rounded-lg mb-2 flex items-center justify-center">
              <span class="text-xs text-gray-600">Upload your artwork</span>
            </div>
            <div class="text-sm font-medium">Nature Scene</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const fileInput = ref(null)
const selectedFile = ref(null)
const imagePreview = ref('')
const analysisStyle = ref('humorous')
const artistAge = ref(3)
const analysis = ref('')
const loading = ref(false)
const error = ref('')
const modelUsed = ref('')
const analysisTimestamp = ref('')

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file && file.type.startsWith('image/')) {
    selectedFile.value = file
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const analyzeArtwork = async () => {
  if (!selectedFile.value) return
  
  loading.value = true
  error.value = ''
  analysis.value = ''
  
  try {
    // Convert image to base64
    const base64Image = await fileToBase64(selectedFile.value)
    
    const response = await $fetch('/api/ai/vision-analysis', {
      method: 'POST',
      body: {
        image: base64Image,
        analysisStyle: analysisStyle.value,
        artistAge: artistAge.value || undefined
      }
    })
    
    analysis.value = response.analysis
    modelUsed.value = response.model
    analysisTimestamp.value = new Date(response.timestamp).toLocaleString()
  } catch (err) {
    error.value = err.data?.message || err.message || 'Failed to analyze artwork'
  } finally {
    loading.value = false
  }
}

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      // Remove the data:image/...;base64, prefix
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = error => reject(error)
  })
}

// SEO
useHead({
  title: 'AI Vision Art Analysis - MoMA 2025',
  meta: [
    { name: 'description', content: 'Upload artwork images and get AI-powered visual analysis and artist statements' }
  ]
})
</script>