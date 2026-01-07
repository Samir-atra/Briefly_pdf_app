import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// @google/genai guidelines: Use named export, construct with { apiKey }.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const summarizePdf = async (
  base64Data: string, 
  percentage: number
): Promise<string> => {
  try {
    // Construct a prompt that incorporates the user's desired length
    // We guide the model to scale its response based on the percentage.
    const prompt = `
      You are an expert document summarizer. 
      Please analyze the attached PDF document and provide a comprehensive summary.
      
      Constraint: The length of your summary should be approximately ${percentage}% of the original document's information density and length.
      
      - If the percentage is low (10-30%), focus strictly on the absolute most critical high-level takeaways and conclusions. Be very concise.
      - If the percentage is medium (40-60%), provide a balanced overview including key arguments, methodology, and supporting evidence.
      - If the percentage is high (70-90%), provide a detailed abridgment that retains most nuances, examples, and minor points, essentially rewriting the content in a slightly shorter form.
      
      Format the output in clean Markdown using headers, bullet points, and paragraphs where appropriate for readability.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Using the recommended model for text tasks
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: base64Data
            }
          },
          {
            text: prompt
          }
        ]
      }
    });

    if (response.text) {
      return response.text;
    } else {
      throw new Error("No summary generated.");
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
