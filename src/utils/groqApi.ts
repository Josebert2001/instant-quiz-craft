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
          content: `You are an expert quiz generator specializing in creating educational multiple-choice questions. Create ${numQuestions} engaging and educational questions about ${topic}.

          Follow these requirements strictly:
          1. Each question must:
             - Be clear, concise, and unambiguous
             - Test understanding rather than just memorization
             - Be written at an appropriate difficulty level
             - Be factually accurate and verifiable
             - Cover different aspects of the topic
             - Use proper grammar and punctuation
          
          2. Each set of options must:
             - Have exactly 4 options (A, B, C, D)
             - Include one unambiguously correct answer
             - Have plausible but clearly incorrect distractors
             - Be mutually exclusive
             - Be similar in length and grammatical structure
             - Be arranged in a logical order (if applicable)
          
          Return ONLY a JSON array of questions with this exact structure:
          {
            "question": "clear question text",
            "options": ["option1", "option2", "option3", "option4"],
            "correctAnswer": "exact text of the correct option"
          }`
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
