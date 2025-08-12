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
          
          <!-- Audio Generation Section -->
          <div v-if="analysis && !loading" class="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h3 class="text-lg font-semibold text-purple-800 mb-3">🎧 Audio Narration</h3>
            
            <div v-if="!audioGenerated && !generatingAudio" class="space-y-3">
              <p class="text-sm text-purple-700">Generate an AI voice narration of this art critique:</p>
              <button 
                @click="generateAudio"
                class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                Generate Audio Narration
              </button>
            </div>

            <div v-if="generatingAudio" class="flex items-center text-purple-600">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
              Generating audio with ElevenLabs...
            </div>

            <div v-if="audioGenerated && audioUrl" class="space-y-3">
              <p class="text-sm text-green-700">✅ Audio generated successfully!</p>
              <audio 
                controls 
                class="w-full"
                preload="none"
              >
                <source :src="audioUrl" type="audio/mpeg">
                Your browser does not support the audio element.
              </audio>
              <div class="text-xs text-gray-500">
                Audio ID: {{ audioInfo.audioId }} | Size: {{ formatBytes(audioInfo.size) }} | Voice: {{ audioInfo.voiceId }}
              </div>
            </div>

            <div v-if="audioError" class="text-red-600 text-sm">
              ❌ Error: {{ audioError }}
            </div>
          </div>
          
          <div v-if="!loading && (modelUsed || analysisTimestamp)" class="mt-4 text-sm text-gray-500">
            Model: {{ modelUsed }} | Generated: {{ analysisTimestamp }}
          </div>
        </div>
        
        <div v-if="error" class="text-red-600 bg-red-50 p-4 rounded-md">
          Error: {{ error }}
        </div>
      </div>

      <!-- Usage Instructions -->
      <div class="mt-8">
        <h2 class="text-xl font-semibold mb-4">How to Use</h2>
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div class="space-y-4 text-sm text-blue-800">
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
              <div>
                <strong>Upload Artwork:</strong> Click "Select artwork image" and choose a photo of any artwork - child drawings, paintings, sketches, etc.
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
              <div>
                <strong>Choose Analysis Style:</strong> Select from humorous (pretentious art critic), sophisticated, museum docent, or academic analysis.
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
              <div>
                <strong>Set Artist Age:</strong> Optional - helps the AI tailor its response appropriately.
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
              <div>
                <strong>Generate & Listen:</strong> Watch the AI analysis stream in real-time, then generate audio narration!
              </div>
            </div>
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

// Audio generation state
const generatingAudio = ref(false)
const audioGenerated = ref(false)
const audioUrl = ref('')
const audioInfo = ref(null)
const audioError = ref('')

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

const generateAudio = async () => {
  if (!analysis.value) return
  
  generatingAudio.value = true
  audioError.value = ''
  
  try {
    const response = await $fetch('/api/ai/generate-audio', {
      method: 'POST',
      body: {
        text: analysis.value,
        voiceId: 'ClCJCctiyh2dhHQ3SBL6' // Your specified voice ID
      }
    })
    
    if (response.success) {
      audioInfo.value = response
      // Create blob URL for the audio
      audioUrl.value = `/api/_hub/blob/${response.filename}`
      audioGenerated.value = true
    }
  } catch (err) {
    audioError.value = err.data?.message || err.message || 'Failed to generate audio'
  } finally {
    generatingAudio.value = false
  }
}

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// SEO
useHead({
  title: 'AI Vision Art Analysis - MoMA 2025',
  meta: [
    { name: 'description', content: 'Upload artwork images and get AI-powered visual analysis and artist statements' }
  ]
})
</script>