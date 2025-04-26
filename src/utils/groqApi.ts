interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

// Try to get API key from either local env or Vercel env
const apiKey = import.meta.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY;
if (!apiKey) {
  console.error('Missing GROQ API key. Please follow these steps to set it up:\n' +
    '1. For local development: Copy .env.example to .env and add your Groq API key\n' +
    '2. For Vercel deployment: Add GROQ_API_KEY to your Vercel environment variables\n' +
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
        { role: 'system', content: `Generate a quiz with ${numQuestions} questions on the topic: ${topic}` },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Error generating quiz: ${response.statusText}`);
  }

  const data = await response.json();

  // Parse the response from the LLM to extract the quiz questions
  const quizContent = JSON.parse(data.choices[0].message.content);
  return quizContent;
}
