import React from 'react';
import { HomeIcon, ClockIcon, ChartIcon, MyIcon, WalletIcon } from './Icons';

interface BottomNavProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activePage, setActivePage }) => {
  const navItems = [
    { name: '首页', icon: HomeIcon, page: 'home' },
    { name: '记录', icon: ClockIcon, page: 'attendanceLog' },
    { name: '费用', icon: WalletIcon, page: 'expenseManagement' },
    { name: '统计', icon: ChartIcon, page: 'stats' },
    { name: '我的', icon: MyIcon, page: 'ai' },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-20">
      <nav className="flex justify-around h-16">
        {navItems.map((item) => {
          const isActive = item.page === 'home' ? (activePage === 'home' || activePage === 'management' || activePage === 'siteSettings') : activePage === item.page;
          const colorClass = isActive ? 'text-blue-600' : 'text-gray-500';

          return (
            <button
              key={item.name}
              onClick={() => setActivePage(item.page === 'home' ? 'management' : item.page)}
              className={`flex flex-col items-center justify-center w-full ${colorClass} transition-colors`}
              aria-label={item.name}
            >
              <item.icon className="w-6 h-6 mb-1" />
              <span className="text-xs">{item.name}</span>
            </button>
          );
        })}
      </nav>
    </footer>
  );
};

export default BottomNav;
