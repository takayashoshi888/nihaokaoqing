import React, { useState } from 'react';
import { UserIcon, LocationIcon, CheckInIcon } from '../components/Icons';
import { UserData } from '../types';

interface LoginPageProps {
  onLogin: (userData: UserData) => void;
  onViewData: () => void;
  savedUserData: UserData | null;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onViewData, savedUserData }) => {
  const [name, setName] = useState(savedUserData?.name || '');
  const [siteName, setSiteName] = useState(savedUserData?.siteName || '');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!name.trim() || !siteName.trim()) {
      setError('姓名和现场名称不能为空');
      return;
    }
    setError('');
    onLogin({ name, siteName });
  };

  return (
    <div className="min-h-screen flex flex-col relative" style={{ fontFamily: "'Open Sans', sans-serif" }}>
      {/* Background Image Layer */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url('https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent('modern construction site management office, architectural blueprints overlay, professional engineering workspace, soft natural daylight, clean corporate aesthetic, steel blue and white color scheme, geometric grid subtle pattern, high quality professional photography')}&image_size=landscape_16_9')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {/* Gradient overlay for readability */}
      <div className="fixed inset-0 z-[1]" style={{
        background: 'linear-gradient(135deg, rgba(30,58,138,0.75), rgba(29,78,216,0.55), rgba(15,23,42,0.75))'
      }} />
      <div className="fixed inset-0 z-[1] bg-slate-950/70 hidden" data-theme-dark-overlay />

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col flex-grow min-h-screen">
        <header className="p-4 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-center text-white drop-shadow-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>现场出勤管理</h1>
        </header>
        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md backdrop-blur-xl rounded-3xl shadow-2xl p-8 space-y-6 border border-white/20"
            style={{ backgroundColor: 'var(--theme-modal-card, rgba(255,255,255,0.9))' }}>
            <h2 className="text-center text-2xl font-bold" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--theme-foreground)' }}>用户信息设置</h2>
            <p className="text-center text-sm -mt-4" style={{ color: 'var(--theme-muted)' }}>请输入您的信息以开始出勤</p>

            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--theme-muted)' }} />
              <input
                type="text"
                placeholder="请输入您的姓名"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field w-full pl-12 pr-4 py-3.5"
                aria-label="姓名"
              />
            </div>

            <div className="relative">
              <LocationIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--theme-muted)' }} />
              <input
                type="text"
                placeholder="请输入现场名称"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="input-field w-full pl-12 pr-4 py-3.5"
                aria-label="现场名称"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 rounded-xl py-2">{error}</p>
            )}

            <div className="flex items-center justify-center pt-4">
              <button
                onClick={handleLogin}
                className="group w-40 h-40 text-white rounded-full flex flex-col items-center justify-center transition-all duration-300 focus:outline-none"
                style={{
                  background: 'linear-gradient(135deg, var(--theme-primary-600), var(--theme-primary-700))',
                  boxShadow: '0 4px 14px 0 var(--theme-shadow)',
                }}
              >
                <CheckInIcon className="w-12 h-12 mb-2 transition-transform duration-300 group-hover:rotate-12" />
                <span className="text-xl font-semibold">开始出勤</span>
              </button>
            </div>
          </div>

          {savedUserData && (
             <button
               onClick={onViewData}
               className="fixed bottom-6 right-6 text-white px-6 py-3 rounded-2xl transition-all duration-300 focus:outline-none z-20"
               style={{
                 background: 'linear-gradient(135deg, var(--theme-accent-600), var(--theme-accent-700))',
                 boxShadow: '0 4px 14px 0 rgba(0,0,0,0.15)',
               }}
             >
               查看数据
             </button>
          )}
        </main>
      </div>
    </div>
  );
};

export default LoginPage;
