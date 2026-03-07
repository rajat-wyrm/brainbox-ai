import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';

const AIChatWidget: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! How can I help you study today?', isAI: true },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    setMessages([...messages, { id: Date.now(), text: message, isAI: false }]);
    setMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        text: "I'm analyzing your question... I'll help you understand this topic better!", 
        isAI: true 
      }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-64">
      <div className="flex-1 overflow-auto space-y-3 mb-3">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.isAI ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] p-2 rounded-xl ${
                msg.isAI
                  ? 'bg-white/10'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask AI..."
          className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        />
        <button
          onClick={handleSend}
          className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:scale-105 transition"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default AIChatWidget;
