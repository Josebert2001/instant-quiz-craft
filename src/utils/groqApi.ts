interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

const apiKey = process.env.VITE_GROQ_API_KEY;
if (!apiKey) {
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
