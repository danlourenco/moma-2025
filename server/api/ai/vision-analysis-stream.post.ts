export default defineEventHandler(async (event) => {
  const { image, analysisStyle, artistAge } = await readBody(event)

  if (!image) {
    throw createError({
      statusCode: 400,
      statusMessage: "Image data is required",
    })
  }

  // Set headers for Server-Sent Events
  setHeader(event, 'Content-Type', 'text/event-stream')
  setHeader(event, 'Cache-Control', 'no-cache')
  setHeader(event, 'Connection', 'keep-alive')
  setHeader(event, 'Access-Control-Allow-Origin', '*')

  const encoder = new TextEncoder()

  // Create a readable stream for SSE
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Send initial status
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'status', message: 'Analyzing artwork...' })}\n\n`)
        )

        // Create different prompts based on analysis style
        let systemPrompt = ""
        let userPrompt = ""
        const ageContext = artistAge ? ` created by a ${artistAge}-year-old` : ""

        switch (analysisStyle) {
          case "humorous":
            systemPrompt = "You are a pretentious art critic who finds profound, overly intellectual meaning in simple children's artwork. You use unnecessarily complex art terminology and interpret heavy themes that children clearly have no knowledge of."
            userPrompt = `As a humorous exercise, create a highbrow artist statement for this piece of artwork${ageContext}. Make it funnier by interpreting heavier themes that a young artist would clearly have no knowledge about. Use fancy art speak when possible. Be creative and absurd while maintaining an academic tone. Try to keep it to two paragraphs.`
            break

          case "sophisticated":
            systemPrompt = "You are a world-class art curator known for finding genuine artistic merit and beauty in all forms of creative expression."
            userPrompt = `Please provide a sophisticated art critique of this artwork${ageContext}. Focus on composition, color theory, emotional expression, and artistic techniques. Treat the work with genuine respect while using professional art terminology.`
            break

          case "museum":
            systemPrompt = "You are a friendly museum docent explaining artwork to visitors in an engaging, accessible way."
            userPrompt = `Please describe this artwork${ageContext} as a museum docent would to visitors. Make it engaging and educational, pointing out interesting visual elements and artistic choices. Keep the tone warm and encouraging.`
            break

          case "academic":
            systemPrompt = "You are an art historian and academic writing a formal analysis of artwork."
            userPrompt = `Please provide an academic art analysis of this artwork${ageContext}. Discuss visual elements, composition, technique, and possible influences or artistic movements. Use scholarly language and art historical references where appropriate.`
            break

          default:
            systemPrompt = "You are a knowledgeable art analyst."
            userPrompt = `Please analyze this artwork${ageContext}.`
        }

        // Use Cloudflare's Llama 3.2 11B Vision model
        // Note: streaming may not be supported, so we'll simulate it
        const response = await hubAI().run("@cf/meta/llama-3.2-11b-vision-instruct", {
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: userPrompt,
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${image}`,
                  },
                },
              ],
            },
          ],
          max_tokens: 800,
          temperature: 0.8
        })

        console.log('AI Response received:', response)

        // Check if response has streaming data
        if (response.readable) {
          console.log('Using native streaming...')
          const reader = response.getReader()
          const decoder = new TextDecoder()

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
                    if (data.response) {
                      // Send the chunk to the client
                      controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({ 
                          type: 'chunk', 
                          content: data.response 
                        })}\n\n`)
                      )
                    }
                  } catch (e) {
                    // Skip invalid JSON
                  }
                }
              }
            }
          } finally {
            reader.releaseLock()
          }
        } else {
          // Handle regular response
          console.log('Using fallback chunking...')
          const content = response.response || response || "AI model returned empty response"
          
          console.log('Content to stream:', content)
          
          if (content && content !== "No response generated") {
            // Simulate streaming by sending chunks
            const words = content.split(' ')
            for (let i = 0; i < words.length; i += 2) {
              const chunk = words.slice(i, i + 2).join(' ') + ' '
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ 
                  type: 'chunk', 
                  content: chunk 
                })}\n\n`)
              )
              // Small delay to simulate streaming
              await new Promise(resolve => setTimeout(resolve, 50))
            }
          } else {
            // Send error if no content
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ 
                type: 'chunk', 
                content: 'The AI model did not generate a response. This might be due to content policy restrictions or an issue with the image. Please try a different image or analysis style.' 
              })}\n\n`)
            )
          }
        }

        // Send completion signal
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ 
            type: 'complete', 
            model: '@cf/meta/llama-3.2-11b-vision-instruct',
            timestamp: new Date().toISOString()
          })}\n\n`)
        )

      } catch (error) {
        console.error('Streaming error:', error)
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ 
            type: 'error', 
            message: error.message || 'Failed to analyze artwork' 
          })}\n\n`)
        )
      } finally {
        controller.close()
      }
    }
  })

  return sendStream(event, stream)
})