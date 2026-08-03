import React, { useEffect, useState } from 'react';

interface WelcomeScreenProps {
  onFinish: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onFinish }) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(onFinish, 400);
    }, 5000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  const handleSkip = () => {
    setIsFading(true);
    setTimeout(onFinish, 400);
  };

  return (
    <div className={`flex items-center justify-center h-screen text-white relative transition-opacity duration-500 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}
      style={{
        background: 'linear-gradient(135deg, var(--theme-primary-900), var(--theme-primary-700), var(--theme-primary-600))',
      }}>
      <div className="text-center animate-fade-in-out">
        <h1 className="text-5xl font-bold mb-3 tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>欢迎您, 老板</h1>
        <p className="text-xl text-blue-100" style={{ fontFamily: "'Open Sans', sans-serif" }}>现场考勤管理系统</p>
      </div>
      <button
        onClick={handleSkip}
        className="absolute bottom-10 right-6 px-5 py-2.5 bg-white/15 backdrop-blur-md text-white text-sm rounded-2xl border border-white/20 hover:bg-white/25 active:scale-[0.97] transition-all duration-300"
        style={{ fontFamily: "'Open Sans', sans-serif" }}
      >
        跳过
      </button>
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
