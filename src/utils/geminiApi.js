/**
 * Study engine integration using Google Gemini API.
 */

const GEMINI_MODEL = "gemini-2.5-flash";

// Reads API Key from environment variable VITE_GEMINI_API_KEY
export const getApiKey = () => {
  return import.meta.env.VITE_GEMINI_API_KEY || window.LILIVIEW_API_KEY || "";
};

async function callGemini(prompt, jsonSchema = null) {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error("Gemini API Key is not configured.");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey.trim()}`;

  const requestBody = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.3,
      responseMimeType: "application/json"
    }
  };

  if (jsonSchema) {
    requestBody.generationConfig.responseSchema = jsonSchema;
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const errMsg = errData.error?.message || response.statusText;
    throw new Error(`API Error (${response.status}): ${errMsg}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error("Received empty response from study engine.");
  }

  try {
    return JSON.parse(rawText);
  } catch (err) {
    console.error("JSON Parsing Error:", rawText);
    throw new Error("Failed to parse structured output from study engine.");
  }
}

/**
 * Generate Complete Reviewer, Quiz, and Flashcards from extracted PDF text.
 */
export async function generateStudyMaterial(pdfTitle, pdfText) {
  const truncatedText = pdfText.length > 50000 ? pdfText.slice(0, 50000) + "\n...[Text truncated for size]" : pdfText;

  const prompt = `
You are an expert, encouraging personal tutor creating a complete study kit for a student studying "${pdfTitle}".
Based on the following extracted document text, generate a comprehensive study kit containing:
1. A COMPLETE REVIEWER (Summary, Core Concepts, Key Definitions, Deep-Dive breakdowns, and a Quick Cheat Sheet).
2. A QUIZ (10 multiple-choice questions with 4 options each, correct answer index 0-3, and clear explanations).
3. FLASHCARDS (12-15 double-sided flashcards with a clear Question, Detailed Answer, Topic tag, and a helpful Hint).

Document Title: ${pdfTitle}

Document Content:
${truncatedText}

OUTPUT RULES:
- Output MUST strictly be valid JSON adhering to the specified schema.
- The reviewer MUST be detailed, clear, organized, and helpful for exam preparation.
- Make all explanations encouraging, aesthetic, and crystal clear.
`;

  const schema = {
    type: "OBJECT",
    properties: {
      reviewer: {
        type: "OBJECT",
        properties: {
          title: { type: "STRING" },
          overview: { type: "STRING" },
          coreConcepts: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                concept: { type: "STRING" },
                summary: { type: "STRING" },
                details: { type: "ARRAY", items: { type: "STRING" } }
              },
              required: ["concept", "summary", "details"]
            }
          },
          keyDefinitions: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                term: { type: "STRING" },
                definition: { type: "STRING" },
                context: { type: "STRING" }
              },
              required: ["term", "definition"]
            }
          },
          deepDive: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                topic: { type: "STRING" },
                content: { type: "STRING" }
              },
              required: ["topic", "content"]
            }
          },
          cheatSheet: {
            type: "ARRAY",
            items: { type: "STRING" }
          }
        },
        required: ["title", "overview", "coreConcepts", "keyDefinitions", "deepDive", "cheatSheet"]
      },
      quiz: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            id: { type: "INTEGER" },
            question: { type: "STRING" },
            options: { type: "ARRAY", items: { type: "STRING" } },
            correctIndex: { type: "INTEGER" },
            explanation: { type: "STRING" },
            topic: { type: "STRING" }
          },
          required: ["id", "question", "options", "correctIndex", "explanation"]
        }
      },
      flashcards: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            id: { type: "INTEGER" },
            topic: { type: "STRING" },
            question: { type: "STRING" },
            answer: { type: "STRING" },
            hint: { type: "STRING" }
          },
          required: ["id", "topic", "question", "answer"]
        }
      }
    },
    required: ["reviewer", "quiz", "flashcards"]
  };

  return await callGemini(prompt, schema);
}
