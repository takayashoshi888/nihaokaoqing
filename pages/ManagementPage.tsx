import React from 'react';
import { UserData } from '../types';
import {
  GearIcon,
  ClockIcon,
  ChartIcon,
  NoteIcon,
  LogoutIcon,
  UserIcon as AvatarIcon,
  WalletIcon,
} from '../components/Icons';
import BottomNav from '../components/BottomNav';

interface ManagementPageProps {
  userData: UserData;
  onLogout: () => void;
  setActivePage: (page: string) => void;
}

const ManagementPage: React.FC<ManagementPageProps> = ({ userData, onLogout, setActivePage }) => {
  const getDayOfWeek = () => {
    return new Date().toLocaleDateString('zh-CN', { weekday: 'long' });
  };
  
  const menuItems = [
    { name: '现场设置', icon: <GearIcon />, page: 'siteSettings' },
    { name: '打卡记录', icon: <ClockIcon />, page: 'attendanceLog' },
    { name: '费用管理', icon: <WalletIcon />, page: 'expenseManagement' },
    { name: '数据分析', icon: <ChartIcon />, page: 'stats' },
    { name: 'AI 助手', icon: <NoteIcon />, page: 'ai' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pb-16">
      <header className="bg-white shadow-md p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center ring-2 ring-blue-500">
              <AvatarIcon className="w-8 h-8 text-gray-500" />
            </div>
            <div>
              <p className="font-bold text-lg text-gray-800">{userData.name}</p>
              <p className="text-sm text-gray-500">{userData.siteName}</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full ml-2 border-2 border-white self-start"></div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 hidden sm:block">{getDayOfWeek()}</span>
            <button onClick={onLogout} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50" aria-label="退出">
              <LogoutIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow p-4">
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActivePage(item.page)}
              className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center space-y-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 transform hover:scale-105"
            >
              <div className="text-blue-500">{React.cloneElement(item.icon, { className: 'w-10 h-10' })}</div>
              <span className="font-semibold">{item.name}</span>
            </button>
          ))}
        </div>
      </main>

      <BottomNav activePage="home" setActivePage={setActivePage} />
    </div>
  );
};

export default ManagementPage;
