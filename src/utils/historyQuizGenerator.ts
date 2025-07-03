import { Question, QuizSettings } from "@/types/quiz";

const apiKey = import.meta.env.VITE_GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;

if (!apiKey) {
  const isVercel = process.env.VERCEL === '1';
  const errorMessage = isVercel
    ? 'GROQ API key not found in Vercel environment. Please add VITE_GROQ_API_KEY in your Vercel project settings under Environment Variables.'
    : 'GROQ API key not found. Please add VITE_GROQ_API_KEY to your .env file.';
  
  console.error(errorMessage);
  throw new Error(errorMessage);
}

const getDifficultyPrompt = (difficulty: string): string => {
  switch (difficulty) {
    case 'beginner':
      return 'Generate questions suitable for high school students with basic historical knowledge. Focus on major events, dates, and key figures. Avoid complex analysis or obscure details.';
    case 'advanced':
      return 'Generate challenging questions requiring deep historical understanding, critical analysis, and knowledge of complex cause-and-effect relationships. Include nuanced details and historiographical perspectives.';
    case 'intermediate':
    default:
      return 'Generate questions at a college-level difficulty that test solid understanding of historical concepts, connections between events, and moderate analytical thinking.';
  }
};

const getQuestionTypePrompts = (types: string[]): string => {
  const prompts = [];
  
  if (types.includes('multiple-choice')) {
    prompts.push('multiple-choice questions with 4 options each');
  }
  if (types.includes('true-false')) {
    prompts.push('true/false questions');
  }
  if (types.includes('fill-blank')) {
    prompts.push('fill-in-the-blank questions');
  }
  if (types.includes('matching')) {
    prompts.push('matching pair questions');
  }
  
  return prompts.join(', ');
};

const getPeriodContext = (period: string): string => {
  const contexts = {
    ancient: 'Ancient Civilizations (3500 BCE - 500 CE) including Egypt, Greece, Rome, Mesopotamia, and early Asian civilizations',
    medieval: 'Medieval Period (500 - 1500 CE) covering the Middle Ages, Byzantine Empire, Islamic Golden Age, Crusades, and feudalism',
    renaissance: 'Renaissance & Exploration (1400 - 1700 CE) including the Italian Renaissance, Age of Discovery, Scientific Revolution, and Reformation',
    industrial: 'Industrial Revolution (1750 - 1900 CE) covering technological advancement, urbanization, labor movements, and social changes',
    modern: 'Modern Era (1900 - Present) including World Wars, Cold War, decolonization, and contemporary global developments'
  };
  
  return contexts[period as keyof typeof contexts] || period;
};

export async function generateHistoryQuiz(settings: QuizSettings): Promise<Question[]> {
  const { period, numQuestions, difficulty, questionTypes, model } = settings;
  const difficultyPrompt = getDifficultyPrompt(difficulty);
  const periodContext = getPeriodContext(period);
  const questionTypePrompts = getQuestionTypePrompts(questionTypes);

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
          content: `You are an expert history educator and quiz generator specializing in creating engaging, educational, and historically accurate questions.

HISTORICAL PERIOD: ${periodContext}

INSTRUCTIONS:
- Generate exactly ${numQuestions} unique, engaging, and historically accurate questions about this period.
- ${difficultyPrompt}
- Create a mix of ${questionTypePrompts}.
- Each question must be factually accurate and verifiable from reputable historical sources.
- Include diverse aspects: political, social, economic, cultural, and technological history.

QUESTION REQUIREMENTS:
- Each question must:
  • Be clear, concise, and unambiguous
  • Test historical understanding appropriate for the ${difficulty} level
  • Cover different aspects of the historical period
  • Include proper historical context
  • Be engaging and thought-provoking

ANSWER REQUIREMENTS:
- For multiple-choice: Provide exactly 4 options with only one correct answer
- For true/false: Provide a clear statement that is definitively true or false
- For fill-blank: Create a sentence with one key term missing
- All questions must include detailed explanations that provide historical context

POINT SYSTEM:
- Beginner questions: 10 points each
- Intermediate questions: 15 points each  
- Advanced questions: 20 points each

OUTPUT FORMAT:
Return ONLY a JSON array with this exact structure:
[
  {
    "id": "unique_id",
    "question": "question text",
    "type": "multiple-choice|true-false|fill-blank|matching",
    "options": ["option1", "option2", "option3", "option4"], // only for multiple-choice
    "correctAnswer": "correct answer text",
    "explanation": "detailed historical explanation with context",
    "points": 10|15|20,
    "difficulty": "${difficulty}",
    "topic": "specific historical topic",
    "period": "${period}"
  }
]
`
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
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

    const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
    const quizContent = JSON.parse(cleanContent);
    
    if (!Array.isArray(quizContent)) {
      throw new Error('Response is not an array');
    }
    
    // Validate each question
    quizContent.forEach((q, i) => {
      if (!q.question || typeof q.question !== 'string') {
        throw new Error(`Invalid question at index ${i}: Missing or invalid question text`);
      }
      if (!q.type || !['multiple-choice', 'true-false', 'fill-blank', 'matching'].includes(q.type)) {
        throw new Error(`Invalid question type at index ${i}: ${q.type}`);
      }
      if (q.type === 'multiple-choice' && (!Array.isArray(q.options) || q.options.length !== 4)) {
        throw new Error(`Invalid options at index ${i}: Multiple choice must have exactly 4 options`);
      }
      if (!q.correctAnswer) {
        throw new Error(`Invalid correct answer at index ${i}: Missing correct answer`);
      }
      if (!q.explanation) {
        throw new Error(`Invalid explanation at index ${i}: Missing explanation`);
      }
    });

    return quizContent;
  } catch (error) {
    console.error('Failed to parse quiz content:', error);
    console.error('Raw content:', data.choices[0]?.message?.content);
    throw new Error(`Failed to generate valid history quiz: ${error.message}`);
  }
}