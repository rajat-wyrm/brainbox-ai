import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, BookOpen } from 'lucide-react';

const FlashcardPreview: React.FC = () => {
  const cards = [
    { id: 1, front: 'What is React?', back: 'A JavaScript library for building UIs', progress: 80 },
    { id: 2, front: 'What is TypeScript?', back: 'Typed superset of JavaScript', progress: 60 },
    { id: 3, front: 'What is Tailwind?', back: 'Utility-first CSS framework', progress: 40 },
  ];

  return (
    <div className="space-y-3">
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group cursor-pointer"
        >
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition">
            <div className="flex items-center gap-3">
              <BookOpen size={18} className="text-purple-400" />
              <div>
                <p className="font-medium">{card.front}</p>
                <p className="text-xs text-white/40">{card.back.substring(0, 30)}...</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
                  style={{ width: `${card.progress}%` }}
                />
              </div>
              <ChevronRight size={16} className="text-white/40 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default FlashcardPreview;
