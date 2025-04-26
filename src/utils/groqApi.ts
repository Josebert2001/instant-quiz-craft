
interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export const generateQuizWithGroq = async (topic: string): Promise<QuizQuestion[]> => {
  const apiKey = localStorage.getItem('groqApiKey');
  if (!apiKey) {
    throw new Error('No API key found. Please add your Groq API key first.');
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3-70b-instruct',
        messages: [
          {
            role: 'system',
            content: 'You are a quiz generator. Generate a quiz with 3 multiple choice questions. Each question should have 4 options and one correct answer. Return the response in JSON format with an array of objects, each containing: question, options (array of 4 strings), and correctAnswer (matching one of the options).'
          },
          {
            role: 'user',
            content: `Generate a quiz about: ${topic}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to generate quiz');
    }

    // Parse the response from the LLM to extract the quiz questions
    const quizContent = JSON.parse(data.choices[0].message.content);
    return quizContent;
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw error;
  }
};
