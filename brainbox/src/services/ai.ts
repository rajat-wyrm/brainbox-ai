import OpenAI from 'openai';

class AIService {
  private openai: OpenAI;
  
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY || 'demo-key',
      dangerouslyAllowBrowser: true
    });
  }

  async chat(message: string, history: any[] = []) {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are BrainBox AI, an expert learning assistant. You help students understand complex topics, create study plans, generate practice questions, and provide explanations. You're knowledgeable in all academic subjects and can adapt your teaching style to each student's level.`
          },
          ...history,
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('AI Error:', error);
      return "I'm having trouble connecting right now. Please try again.";
    }
  }

  async generateFlashcards(topic: string, count: number = 10) {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Create ${count} high-quality flashcards about "${topic}". Return as JSON array with fields: front, back, difficulty (easy/medium/hard), category.`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Flashcard Generation Error:', error);
      return [];
    }
  }

  async summarize(text: string) {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Summarize the following text in 3-5 bullet points, highlighting key concepts.'
          },
          { role: 'user', content: text }
        ],
        temperature: 0.5,
        max_tokens: 300
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Summarization Error:', error);
      return text;
    }
  }

  async generateQuiz(topic: string, difficulty: string = 'medium') {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Create a ${difficulty} difficulty quiz about "${topic}" with 5 multiple choice questions. Return as JSON with questions, options, correct answers, and explanations.`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Quiz Generation Error:', error);
      return [];
    }
  }
}

export default new AIService();
