/**
 * Study engine integration using Google Gemini API.
 */

const GEMINI_MODEL = "gemini-2.5-flash";

export const getApiKey = () => {
  return import.meta.env.VITE_GEMINI_API_KEY || window.LILIVIEW_API_KEY || "";
};

async function callGemini(prompt, jsonSchema = null) {
  const apiKey = getApiKey();
  
  if (!apiKey || apiKey.length < 5) {
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

  // 30 second timeout controller
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errMsg = errData.error?.message || response.statusText;
      if (response.status === 400 || response.status === 403) {
        throw new Error(`API Key Error (${response.status}): Key was rejected by Google.`);
      }
      throw new Error(`API Error (${response.status}): ${errMsg}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error("Received empty response from study engine.");
    }

    return JSON.parse(rawText);
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error("Request timed out. The PDF text might be too large.");
    }
    throw err;
  }
}

/**
 * Generate Complete Reviewer, Quiz, and Flashcards from extracted PDF text.
 */
export async function generateStudyMaterial(pdfTitle, pdfText) {
  const truncatedText = pdfText.length > 25000 ? pdfText.slice(0, 25000) + "\n...[Text truncated for fast response]" : pdfText;

  const prompt = `
You are an expert tutor creating a complete study kit for "${pdfTitle}".
Based on the text below, generate:
1. REVIEWER (Summary, 4 Core Concepts, 5 Key Definitions, 3 Deep-Dive topics, 5 Cheat Sheet takeaways).
2. QUIZ (8 multiple-choice questions with 4 options each, correctIndex 0-3, and clear explanation).
3. FLASHCARDS (10 double-sided cards with Question, Answer, Topic, and Hint).

Document Content:
${truncatedText}
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
                definition: { type: "STRING" }
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
