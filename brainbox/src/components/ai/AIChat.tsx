import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Bot, User, Copy, Check, ThumbsUp, ThumbsDown, 
  RefreshCw, Code, FileText, BookOpen, Sparkles,
  Download, Share2, MoreVertical, X, Maximize2, Minimize2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import aiService from '../../services/ai';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  tokens?: number;
  model?: string;
}

export const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI learning assistant. I can help you with:\n\n" +
               "• 📚 Understanding complex topics\n" +
               "• 🎯 Creating study plans\n" +
               "• 📝 Generating practice questions\n" +
               "• 💡 Explaining concepts in simple terms\n" +
               "• 🗂️ Summarizing notes and articles\n\n" +
               "What would you like to learn today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [suggestions] = useState([
    'Explain quantum computing simply',
    'Create a study plan for calculus',
    'Generate flashcards about photosynthesis',
    'Summarize the theory of relativity'
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.slice(-10).map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await aiService.chat(input, history);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response || "I'm sorry, I couldn't process that request.",
        timestamp: new Date(),
        model: 'gpt-4'
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast.error('Failed to get AI response');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('Copied to clipboard');
  };

  const regenerateResponse = async () => {
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMessage) {
      setMessages(prev => prev.slice(0, -1));
      setInput(lastUserMessage.content);
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([messages[0]]);
    toast.success('Chat cleared');
  };

  const exportChat = () => {
    const chatText = messages.map(m => 
      `[${m.role.toUpperCase()}] ${m.timestamp.toLocaleString()}\n${m.content}\n`
    ).join('\n---\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brainbox-chat-${new Date().toISOString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Chat exported');
  };

  return (
    <div className={`flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
      isFullscreen ? 'fixed inset-4 z-50' : 'h-[700px]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bot className="text-white" size={28} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">BrainBox AI Assistant</h2>
            <p className="text-xs text-white/80">Powered by GPT-4 • Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            className="p-2 hover:bg-white/10 rounded-lg transition text-white/80 hover:text-white"
            title="Clear chat"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={exportChat}
            className="p-2 hover:bg-white/10 rounded-lg transition text-white/80 hover:text-white"
            title="Export chat"
          >
            <Download size={18} />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 hover:bg-white/10 rounded-lg transition text-white/80 hover:text-white"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          <button
            onClick={() => setIsFullscreen(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition text-white/80 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-800">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`mb-6 ${message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600'
                }`}>
                  {message.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
                </div>

                {/* Message content */}
                <div>
                  <div className={`p-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  }`}>
                    {message.role === 'assistant' ? (
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        className="prose prose-sm dark:prose-invert max-w-none"
                      >
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                    
                    {/* Message metadata */}
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                        {message.model && (
                          <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-600 rounded-full">
                            {message.model}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action buttons for assistant messages */}
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mt-2 ml-2">
                      <button
                        onClick={() => copyToClipboard(message.content, message.id)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition"
                        title="Copy"
                      >
                        {copiedId === message.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-gray-500" />}
                      </button>
                      <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition" title="Like">
                        <ThumbsUp size={14} className="text-gray-500" />
                      </button>
                      <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition" title="Dislike">
                        <ThumbsDown size={14} className="text-gray-500" />
                      </button>
                      {index === messages.length - 1 && !loading && (
                        <button
                          onClick={regenerateResponse}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition"
                          title="Regenerate"
                        >
                          <RefreshCw size={14} className="text-gray-500" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-gray-500"
          >
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
            </div>
            <span className="text-sm">AI is thinking...</span>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setInput(suggestion)}
                className="px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-full hover:border-blue-500 dark:hover:border-blue-500 transition"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="p-4 bg-white dark:bg-gray-900 border-t dark:border-gray-800">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              rows={1}
              className="w-full p-3 pr-12 border dark:border-gray-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              style={{ minHeight: '50px', maxHeight: '150px' }}
            />
            <button
              onClick={() => setInput('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={16} />
            </button>
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:hover:shadow-none transition flex items-center gap-2"
          >
            <Send size={18} />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          BrainBox AI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
};
