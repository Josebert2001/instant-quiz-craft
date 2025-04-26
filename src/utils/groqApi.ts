interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

const apiKey = import.meta.env.VITE_GROQ_API_KEY;
if (!apiKey) {
  console.error('Missing GROQ API key. Please follow these steps to set it up:\n' +
    '1. Copy .env.example to .env\n' +
    '2. Add your Groq API key to the .env file\n' +
    '3. Restart the development server');
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
