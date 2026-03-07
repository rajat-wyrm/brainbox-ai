import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';

const StudyTimer: React.FC = () => {
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'pomodoro' | 'short' | 'long'>('pomodoro');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const resetTimer = () => {
    setIsActive(false);
    setTime(mode === 'pomodoro' ? 25 * 60 : mode === 'short' ? 5 * 60 : 15 * 60);
  };

  return (
    <div className="text-center">
      <div className="text-4xl font-bold mb-4 font-mono">
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </div>
      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={() => setIsActive(!isActive)}
          className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:scale-105 transition"
        >
          {isActive ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button
          onClick={resetTimer}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition"
        >
          <RotateCcw size={20} />
        </button>
      </div>
      <div className="flex gap-2 text-xs">
        {[
          { id: 'pomodoro', label: 'Pomodoro', time: 25 },
          { id: 'short', label: 'Short', time: 5 },
          { id: 'long', label: 'Long', time: 15 },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setMode(m.id as any);
              setTime(m.time * 60);
              setIsActive(false);
            }}
            className={`flex-1 py-2 rounded-lg transition ${
              mode === m.id
                ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StudyTimer;
