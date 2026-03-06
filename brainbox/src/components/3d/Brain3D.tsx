import React from 'react';

export const Brain3D = () => {
  return (
    <div className="w-full h-[600px] relative overflow-hidden rounded-2xl bg-gradient-to-b from-blue-600 to-purple-600">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-64 h-64 animate-float">
          <div className="absolute inset-0 bg-blue-400 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
              <span className="text-4xl">??</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FloatingBrain = ({ className }) => {
  return (
    <div className={className || "w-20 h-20"}>
      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
        <span className="text-2xl">??</span>
      </div>
    </div>
  );
};
