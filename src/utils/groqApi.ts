interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

// Try to get API key from environment variables
const apiKey = import.meta.env.VITE_GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;

if (!apiKey) {
  const isVercel = process.env.VERCEL === '1';
  const errorMessage = isVercel
    ? 'GROQ API key not found in Vercel environment. Please add VITE_GROQ_API_KEY in your Vercel project settings under Environment Variables.'
    : 'GROQ API key not found. Please add VITE_GROQ_API_KEY to your .env file.';
  
  console.error(errorMessage);
  throw new Error(errorMessage);
}

export async function generateQuizWithGroq(topic: string, numQuestions = 10, model = 'llama-3.3-70b-versatile'): Promise<QuizQuestion[]> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { 
          role: 'system', 
          content: `You are an expert quiz generator specializing in educational multiple-choice questions.

INSTRUCTIONS:
- Generate exactly ${numQuestions} unique, engaging, and educational questions about "${topic}".
- Each question must test understanding, not just memorization, and be appropriate for a general audience.

QUESTION REQUIREMENTS:
- Each question must:
  • Be clear, concise, and unambiguous
  • Be factually accurate and verifiable
  • Use proper grammar and punctuation
  • Cover a different aspect or subtopic (avoid repetition)
  • Be written at a consistent difficulty level

OPTIONS REQUIREMENTS:
- For each question, provide exactly 4 options (A, B, C, D):
  • Only one option is unambiguously correct
  • The other 3 are plausible but clearly incorrect distractors
  • All options must be mutually exclusive
  • All options should be similar in length and grammatical structure
  • Arrange options in a logical or natural order (if applicable)

OUTPUT FORMAT:
Return ONLY a JSON array (no explanations, no markdown) with this exact structure:
[
  {
    "question": "clear question text",
    "options": ["option1", "option2", "option3", "option4"],
    "correctAnswer": "exact text of the correct option"
  },
  ...
]
`
        },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'No error details available');
    throw new Error(`GROQ API Error (${response.status}): ${response.statusText}\n${errorBody}`);
  }

  const data = await response.json();

  try {
    const content = data.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from GROQ API');
    }

    // Remove any potential markdown code block syntax and clean whitespace
    const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
    const quizContent = JSON.parse(cleanContent);
    
    if (!Array.isArray(quizContent)) {
      throw new Error('Response is not an array');
    }
    
    // Validate each question thoroughly
    quizContent.forEach((q, i) => {
      if (!q.question || typeof q.question !== 'string') {
        throw new Error(`Invalid question at index ${i}: Missing or invalid question text`);
      }
      if (!Array.isArray(q.options) || q.options.length !== 4) {
        throw new Error(`Invalid options at index ${i}: Must have exactly 4 options`);
      }
      if (!q.correctAnswer || !q.options.includes(q.correctAnswer)) {
        throw new Error(`Invalid correct answer at index ${i}: Answer must be one of the options`);
      }
    });

    return quizContent;
  } catch (error) {
    console.error('Failed to parse quiz content:', error);
    console.error('Raw content:', data.choices[0]?.message?.content);
    throw new Error(`Failed to generate valid quiz questions: ${error.message}`);
  }
}
