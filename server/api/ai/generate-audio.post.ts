import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js'

export default defineEventHandler(async (event) => {
  const { text, voiceId = 'ClCJCctiyh2dhHQ3SBL6' } = await readBody(event)

  if (!text) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Text is required for audio generation'
    })
  }

  const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY
  if (!elevenLabsApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'ElevenLabs API key not configured'
    })
  }

  try {
    console.log('Generating audio for text length:', text.length)
    console.log('Using voice ID:', voiceId)

    // Initialize ElevenLabs client
    const elevenlabs = new ElevenLabsClient({
      apiKey: elevenLabsApiKey
    })

    // Generate audio using the official SDK
    const audio = await elevenlabs.textToSpeech.convert(voiceId, {
      text: text,
      model_id: 'eleven_multilingual_v2',
      output_format: 'mp3_44100_128',
      voice_settings: {
        stability: 0.7,
        similarity_boost: 0.8,
        style: 0.2,
        use_speaker_boost: true
      }
    })

    // Convert audio stream to buffer
    const chunks: Uint8Array[] = []
    const reader = audio.getReader()

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(value)
      }
    } finally {
      reader.releaseLock()
    }

    // Combine chunks into single buffer
    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0)
    const audioData = new Uint8Array(totalLength)
    let offset = 0
    for (const chunk of chunks) {
      audioData.set(chunk, offset)
      offset += chunk.length
    }

    console.log('Audio generated, size:', audioData.length, 'bytes')

    // Generate unique filename for the audio
    const audioId = crypto.randomUUID()
    const filename = `audio-${audioId}.mp3`

    // Store in NuxtHub blob storage
    const blob = await hubBlob().put(filename, audioData, {
      contentType: 'audio/mpeg',
      addRandomSuffix: false
    })

    console.log('Audio stored in blob storage:', blob.pathname)

    return {
      success: true,
      audioId,
      blobPath: blob.pathname,
      filename,
      size: audioData.length,
      voiceId,
      textLength: text.length,
      timestamp: new Date().toISOString()
    }

  } catch (error) {
    console.error('Audio generation error:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to generate audio: ${error.message}`
    })
  }
})