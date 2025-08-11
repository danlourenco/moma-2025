export default defineEventHandler(async (event) => {
  try {
    // Submit the required "agree" prompt to accept the Llama 3.2 license
    const response = await hubAI().run('@cf/meta/llama-3.2-11b-vision-instruct', {
      messages: [
        {
          role: 'user',
          content: 'agree'
        }
      ],
      max_tokens: 10
    })

    return {
      success: true,
      message: 'Successfully agreed to Llama 3.2 11B Vision model license',
      response: response.response
    }
    
  } catch (error) {
    console.error('License agreement error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to agree to model license'
    })
  }
})