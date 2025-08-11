export default defineEventHandler(async (event) => {
  const { description, artistAge } = await readBody(event)

  if (!description) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Artwork description is required'
    })
  }

  try {
    // Create a sophisticated art critique prompt
    const ageContext = artistAge ? ` created by a ${artistAge}-year-old artist` : ''
    
    const prompt = `You are a sophisticated art curator at the Museum of Modern Art (MoMA). You have been asked to write a thoughtful, encouraging art critique for a piece of children's artwork${ageContext}.

Artwork description: ${description}

Please write a museum-quality critique that:
1. Treats the work with genuine respect and sophistication
2. Identifies interesting artistic elements (color choices, composition, emotional expression)
3. References art historical movements or techniques when appropriate
4. Celebrates the unique perspective and creativity
5. Uses encouraging but genuine museum-level language
6. Keeps the tone warm but professional (like a docent speaking to visitors)

Write 2-3 paragraphs that would make any child and parent proud to see their art treated with such respect.`

    // Use NuxtHub AI to generate the critique
    const response = await hubAI().run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        {
          role: 'system',
          content: 'You are a world-class art curator known for your ability to find profound meaning and beauty in all forms of artistic expression, especially children\'s art.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    })

    if (!response?.response) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to generate AI critique'
      })
    }

    return {
      critique: response.response,
      model: '@cf/meta/llama-3.1-8b-instruct',
      timestamp: new Date().toISOString()
    }
    
  } catch (error) {
    console.error('AI critique generation error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate art critique. Please try again.'
    })
  }
})