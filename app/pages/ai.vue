<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">AI Art Description Generator Test</h1>

      <!-- Test Input -->
      <div class="bg-white rounded-lg shadow p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4">Test AI Art Critique</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Artwork Description (what you see in the artwork)
            </label>
            <textarea v-model="artworkDescription" class="w-full p-3 border border-gray-300 rounded-md" rows="3"
              placeholder="e.g., A child's crayon drawing of a house with a red roof, yellow walls, green grass, and a smiling sun in the blue sky" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Artist Age (optional)
            </label>
            <input v-model="artistAge" type="number" class="w-32 p-3 border border-gray-300 rounded-md" placeholder="5"
              min="1" max="100" />
          </div>

          <button @click="generateCritique" :disabled="loading || !artworkDescription.trim()"
            class="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ loading ? 'Generating...' : 'Generate Art Critique' }}
          </button>
        </div>
      </div>

      <!-- AI Response -->
      <div v-if="critique || loading" class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">AI Art Critique</h2>

        <div v-if="loading" class="text-gray-600">
          <div class="animate-pulse">Analyzing artwork and generating sophisticated critique...</div>
        </div>

        <div v-if="critique" class="prose max-w-none">
          <div class="bg-gray-50 p-4 rounded-md border-l-4 border-blue-500">
            {{ critique }}
          </div>
        </div>

        <div v-if="error" class="text-red-600 bg-red-50 p-4 rounded-md">
          Error: {{ error }}
        </div>
      </div>

      <!-- Example Prompts -->
      <div class="mt-8">
        <h2 class="text-xl font-semibold mb-4">Try These Examples</h2>
        <div class="grid gap-4 md:grid-cols-2">
          <button @click="loadExample(1)"
            class="text-left p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div class="font-medium text-blue-600">Child's House Drawing</div>
            <div class="text-sm text-gray-600 mt-1">Classic crayon house with sun and family</div>
          </button>

          <button @click="loadExample(2)"
            class="text-left p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div class="font-medium text-blue-600">Abstract Fingerpainting</div>
            <div class="text-sm text-gray-600 mt-1">Colorful abstract expression with handprints</div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const artworkDescription = ref('')
const artistAge = ref(5)
const critique = ref('')
const loading = ref(false)
const error = ref('')

const generateCritique = async () => {
  if (!artworkDescription.value.trim()) return

  loading.value = true
  error.value = ''
  critique.value = ''

  try {
    const response = await $fetch('/api/ai/critique', {
      method: 'POST',
      body: {
        description: artworkDescription.value.trim(),
        artistAge: artistAge.value || undefined
      }
    })

    critique.value = response.critique
  } catch (err) {
    error.value = err.data?.message || err.message || 'Failed to generate critique'
  } finally {
    loading.value = false
  }
}

const loadExample = (exampleNum) => {
  if (exampleNum === 1) {
    artworkDescription.value = "A child's crayon drawing of a house with a red triangular roof, yellow square walls, two blue windows with curtains, a brown door, green grass at the bottom, and a bright yellow sun with radiating lines in the blue sky. There are also stick figures of a family holding hands in front of the house."
    artistAge.value = 6
  } else if (exampleNum === 2) {
    artworkDescription.value = "An abstract fingerpainting with swirls of blue, red, and yellow paint mixed together. Multiple handprints are visible in different colors overlapping each other, creating a layered effect with some areas where colors have blended into purple and orange."
    artistAge.value = 4
  }
}

// SEO
useHead({
  title: 'AI Art Critique Test - MoMA 2025',
  meta: [
    { name: 'description', content: 'Test the AI art critique generation for children\'s artwork' }
  ]
})
</script>