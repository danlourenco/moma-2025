export default defineEventHandler(async (event) => {
  const { image, analysisStyle, artistAge } = await readBody(event);

  if (!image) {
    throw createError({
      statusCode: 400,
      statusMessage: "Image data is required",
    });
  }

  try {
    // Create different prompts based on analysis style
    let systemPrompt = "";
    let userPrompt = "";

    const ageContext = artistAge ? ` created by a ${artistAge}-year-old` : "";

    switch (analysisStyle) {
      case "humorous":
        systemPrompt =
          "You are a pretentious art critic who finds profound, overly intellectual meaning in simple children's artwork. You use unnecessarily complex art terminology and interpret heavy themes that children clearly have no knowledge of.";
        userPrompt = `As a humorous exercise, create a highbrow artist statement for this piece of artwork${ageContext}. Make it funnier by interpreting heavier themes that a young artist would clearly have no knowledge about. Use fancy art speak when possible. Be creative and absurd while maintaining an academic tone. Try to keep it to two paragraphs.`;
        break;

      case "sophisticated":
        systemPrompt =
          "You are a world-class art curator known for finding genuine artistic merit and beauty in all forms of creative expression.";
        userPrompt = `Please provide a sophisticated art critique of this artwork${ageContext}. Focus on composition, color theory, emotional expression, and artistic techniques. Treat the work with genuine respect while using professional art terminology.`;
        break;

      case "museum":
        systemPrompt =
          "You are a friendly museum docent explaining artwork to visitors in an engaging, accessible way.";
        userPrompt = `Please describe this artwork${ageContext} as a museum docent would to visitors. Make it engaging and educational, pointing out interesting visual elements and artistic choices. Keep the tone warm and encouraging.`;
        break;

      case "academic":
        systemPrompt =
          "You are an art historian and academic writing a formal analysis of artwork.";
        userPrompt = `Please provide an academic art analysis of this artwork${ageContext}. Discuss visual elements, composition, technique, and possible influences or artistic movements. Use scholarly language and art historical references where appropriate.`;
        break;

      default:
        systemPrompt = "You are a knowledgeable art analyst.";
        userPrompt = `Please analyze this artwork${ageContext}.`;
    }

    // Use Cloudflare's Llama 3.2 11B Vision model
    const response = await hubAI().run(
      "@cf/meta/llama-3.2-11b-vision-instruct",
      {
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
        temperature: 0.8,
      }
    );

    if (!response?.response) {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to generate vision analysis",
      });
    }

    return {
      analysis: response.response,
      model: "@cf/meta/llama-3.2-11b-vision-instruct",
      analysisStyle,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("AI vision analysis error:", error);
    throw createError({
      statusCode: 500,
      statusMessage:
        error.message || "Failed to analyze artwork. Please try again.",
    });
  }
});
