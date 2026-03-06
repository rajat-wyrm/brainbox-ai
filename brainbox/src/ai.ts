// Simple AI service without external dependencies
class AIService {
  async chat(message: string, history: any[] = []) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/v1/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? 'Bearer ' + token : ''
        },
        body: JSON.stringify({ message, history })
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('AI Chat Error:', error);
      return { error: 'Failed to get AI response' };
    }
  }

  async generateFlashcards(text: string) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/v1/ai/generate-flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? 'Bearer ' + token : ''
        },
        body: JSON.stringify({ text })
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Flashcard Generation Error:', error);
      return { error: 'Failed to generate flashcards' };
    }
  }
}

export default new AIService();
