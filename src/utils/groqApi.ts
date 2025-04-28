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
          content: `You are a quiz generator. Generate a quiz with ${numQuestions} questions on the topic: ${topic}. 
          Return ONLY a JSON array where each object has the following structure:
          {
            "question": "the question text",
            "options": ["option1", "option2", "option3", "option4"],
            "correctAnswer": "the correct option text"
          }
          Do not include any additional text or explanation, only the JSON array.`
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Error generating quiz: ${response.statusText}`);
  }

  const data = await response.json();

  try {
    // First try parsing the content directly
    const content = data.choices[0].message.content;
    // Remove any potential markdown code block syntax
    const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
    const quizContent = JSON.parse(cleanContent);
    
    // Validate the structure
    if (!Array.isArray(quizContent)) {
      throw new Error('Response is not an array');
    }
    
    // Validate each question
    quizContent.forEach((q, i) => {
      if (!q.question || !Array.isArray(q.options) || !q.correctAnswer) {
        throw new Error(`Invalid question format at index ${i}`);
      }
    });

    return quizContent;
  } catch (error) {
    console.error('Failed to parse quiz content:', error);
    console.error('Raw content:', data.choices[0].message.content);
    throw new Error('Failed to generate valid quiz questions. Please try again.');
  }
}
