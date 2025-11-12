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
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-4 shadow-md">
        <h1 className="text-xl font-bold text-center">现场出勤管理</h1>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-700">用户信息设置</h2>
          
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="请输入您的姓名"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              aria-label="姓名"
            />
          </div>
          
          <div className="relative">
            <LocationIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="请输入现场名称"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              aria-label="现场名称"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="flex items-center justify-center pt-4">
            <button
              onClick={handleLogin}
              className="group w-40 h-40 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full flex flex-col items-center justify-center shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              <CheckInIcon className="w-12 h-12 mb-2 transition-transform duration-300 group-hover:rotate-12" />
              <span className="text-xl font-semibold">开始出勤</span>
            </button>
          </div>
        </div>

        {savedUserData && (
           <button
             onClick={onViewData}
             className="fixed bottom-6 right-6 bg-red-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-red-700 transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300"
           >
             查看数据
           </button>
        )}
      </main>
    </div>
  );
};

export default LoginPage;
