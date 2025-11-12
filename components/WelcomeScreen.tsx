import React, { useEffect } from 'react';

interface WelcomeScreenProps {
  onFinish: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-900 to-blue-700 text-white">
      <div className="text-center animate-fade-in-out">
        <h1 className="text-4xl font-bold mb-2">欢迎您, 老板</h1>
        <p className="text-lg">现场考勤管理系统</p>
      </div>
      <style>{`
        @keyframes fade-in-out {
          0% { opacity: 0; transform: scale(0.9); }
          20% { opacity: 1; transform: scale(1); }
          80% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.9); }
        }
        .animate-fade-in-out {
          animation: fade-in-out 5s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default WelcomeScreen;
