import React from 'react';
import { motion } from 'framer-motion';

const AnalyticsChart: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <p className="text-white/40 mb-2">Chart coming soon...</p>
        <div className="flex gap-2 justify-center">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: Math.random() * 100 + 50 }}
              transition={{ delay: i * 0.1 }}
              className="w-8 bg-gradient-to-t from-purple-600 to-blue-600 rounded-t-lg"
              style={{ height: `${Math.random() * 100 + 50}px` }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsChart;
