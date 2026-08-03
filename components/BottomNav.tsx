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
    <footer
      className="fixed bottom-0 left-0 right-0 backdrop-blur-md border-t z-20"
      style={{
        backgroundColor: 'var(--theme-header-bg, rgba(255,255,255,0.9))',
        borderColor: 'var(--theme-border)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <nav className="flex justify-around" style={{ minHeight: '56px' }}>
        {navItems.map((item) => {
          const isActive = item.page === 'home' ? (activePage === 'home' || activePage === 'management' || activePage === 'siteSettings') : activePage === item.page;

          return (
            <button
              key={item.name}
              onClick={() => setActivePage(item.page === 'home' ? 'management' : item.page)}
              className="relative flex flex-col items-center justify-center w-full min-h-[56px] transition-all duration-200 active:scale-[0.97]"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
              aria-label={item.name}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                  style={{ backgroundColor: 'var(--theme-primary-600)' }} />
              )}
              <item.icon
                className="w-6 h-6 mb-0.5 transition-colors duration-200"
                style={{ color: isActive ? 'var(--theme-primary-600)' : 'var(--theme-muted)' }}
              />
              <span
                className={`text-xs transition-colors duration-200 ${isActive ? 'font-semibold' : ''}`}
                style={{ color: isActive ? 'var(--theme-primary-600)' : 'var(--theme-muted)' }}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </nav>
    </footer>
  );
};

export default BottomNav;
