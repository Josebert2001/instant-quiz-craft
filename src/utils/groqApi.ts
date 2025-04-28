interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

// Try to get API key from environment variables
const apiKey = import.meta.env.VITE_GROQ_API_KEY;
if (!apiKey) {
  console.error('Missing GROQ API key. Please follow these steps to set it up:\n' +
    '1. For local development: Copy .env.example to .env and add your Groq API key\n' +
    '2. For Vercel deployment: Add VITE_GROQ_API_KEY to your Vercel environment variables\n' +
    '3. Restart the development server or redeploy');
  throw new Error('No API key found. Please set your Groq API key in the environment variables.');
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
