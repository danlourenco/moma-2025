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
        
        <div v-if="loading && !analysis" class="text-gray-600">
          <div class="animate-pulse flex items-center mb-4">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            Analyzing artwork with Llama 3.2 11B Vision...
          </div>
        </div>

        <div v-if="loading && analysis" class="mb-4">
          <div class="flex items-center text-sm text-blue-600">
            <div class="animate-pulse w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
            Streaming response...
          </div>
        </div>
        
        <div v-if="analysis" class="prose max-w-none">
          <div class="bg-gray-50 p-6 rounded-md border-l-4 border-blue-500 relative">
            <div class="whitespace-pre-wrap">{{ analysis }}<span v-if="loading" class="animate-pulse text-blue-600">|</span></div>
          </div>
          <div v-if="!loading && (modelUsed || analysisTimestamp)" class="mt-4 text-sm text-gray-500">
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
    
    // Use streaming fetch for real-time response
    const response = await fetch('/api/ai/vision-analysis-stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Image,
        analysisStyle: analysisStyle.value,
        artistAge: artistAge.value || undefined
      })
    })

    if (!response.ok) {
      throw new Error('Failed to analyze artwork')
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (reader) {
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))
                
                if (data.type === 'status') {
                  // Could show status messages if needed
                  console.log('Status:', data.message)
                } else if (data.type === 'chunk') {
                  // Append content as it streams in
                  analysis.value += data.content
                } else if (data.type === 'complete') {
                  // Streaming complete
                  modelUsed.value = data.model
                  analysisTimestamp.value = new Date(data.timestamp).toLocaleString()
                  loading.value = false
                } else if (data.type === 'error') {
                  throw new Error(data.message)
                }
              } catch (parseError) {
                // Skip invalid JSON lines
                console.warn('Failed to parse SSE data:', line)
              }
            }
          }
        }
      } finally {
        reader.releaseLock()
      }
    }
    
  } catch (err) {
    error.value = err.message || 'Failed to analyze artwork'
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