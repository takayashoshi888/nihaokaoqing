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
import { PaletteIcon } from '../components/PaletteIcon';
import BottomNav from '../components/BottomNav';
import { useTheme, themes, themeInfoMap } from '../hooks/useTheme';

interface ManagementPageProps {
  userData: UserData;
  onLogout: () => void;
  setActivePage: (page: string) => void;
}

const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="theme-toggle flex items-center gap-1.5"
        aria-label="切换主题"
      >
        <PaletteIcon className="w-5 h-5" style={{ color: 'var(--theme-primary-600)' }} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 p-3 min-w-[200px]"
            style={{ animation: 'scaleIn 0.15s ease-out' }}>
            <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase mb-2 px-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
              选择主题
            </p>
            <div className="space-y-1">
              {themes.map((t) => {
                const info = themeInfoMap[t];
                const isActive = theme === t;
                return (
                  <button
                    key={t}
                    onClick={() => { setTheme(t); setOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive ? 'bg-gray-100 dark:bg-slate-700' : 'hover:bg-gray-50 dark:hover:bg-slate-700/50'
                    }`}
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  >
                    <span
                      className="w-5 h-5 rounded-full shadow-sm ring-2 ring-offset-1 ring-white dark:ring-slate-700 flex-shrink-0"
                      style={{ backgroundColor: info.color }}
                    />
                    <span className="text-gray-700 dark:text-slate-200 flex-1 text-left">{info.label}</span>
                    {isActive && (
                      <svg className="w-4 h-4" style={{ color: 'var(--theme-primary-600)' }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const ManagementPage: React.FC<ManagementPageProps> = ({ userData, onLogout, setActivePage }) => {
  const getDayOfWeek = () => {
    return new Date().toLocaleDateString('zh-CN', { weekday: 'long' });
  };

  const menuItems = [
    { name: '现场设置', icon: <GearIcon className="w-5 h-5" />, page: 'siteSettings', color: 'bg-blue-500' },
    { name: '打卡记录', icon: <ClockIcon className="w-5 h-5" />, page: 'attendanceLog', color: 'bg-emerald-500' },
    { name: '费用管理', icon: <WalletIcon className="w-5 h-5" />, page: 'expenseManagement', color: 'bg-amber-500' },
    { name: '数据分析', icon: <ChartIcon className="w-5 h-5" />, page: 'stats', color: 'bg-violet-500' },
    { name: 'AI 助手', icon: <NoteIcon className="w-5 h-5" />, page: 'ai', color: 'bg-rose-500' },
  ];

  return (
    <div className="min-h-screen flex flex-col pb-16 relative">
      {/* Background Image Layer */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url('https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent('abstract geometric engineering blueprint grid pattern, soft gradient steel blue tones, construction structural lines, minimalist professional design, subtle depth, clean modern architectural feel, light airy atmosphere')}&image_size=landscape_16_9')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div className="fixed inset-0 z-[1] bg-white/60 dark:bg-slate-900/75" />

      <div className="relative z-10 flex flex-col flex-grow">
        <header className="page-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full flex items-center justify-center ring-2"
                  style={{ backgroundColor: 'var(--theme-primary-50)', color: 'var(--theme-primary-600)' }}>
                  <AvatarIcon className="w-7 h-7" />
                </div>
                <span className="badge-success absolute -bottom-0.5 -right-0.5" />
              </div>
              <div>
                <p className="font-semibold leading-tight" style={{ fontFamily: 'Poppins, sans-serif', color: 'var(--theme-foreground)' }}>{userData.name}</p>
                <p className="text-xs" style={{ color: 'var(--theme-muted)' }}>{userData.siteName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm hidden sm:block" style={{ color: 'var(--theme-muted)' }}>{getDayOfWeek()}</span>
              <ThemeSelector />
              <button onClick={onLogout} className="btn-ghost p-2 text-red-500 hover:text-red-600" aria-label="退出">
                <LogoutIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-grow p-4">
          <h2 className="section-title">功能菜单</h2>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActivePage(item.page)}
                className="card-interactive"
              >
                <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center shadow-lg mb-3`}>
                  <span className="text-white">{item.icon}</span>
                </div>
                <span className="font-semibold text-sm" style={{ color: 'var(--theme-foreground)' }}>{item.name}</span>
              </button>
            ))}
          </div>
        </main>

        <BottomNav activePage="home" setActivePage={setActivePage} />
      </div>
    </div>
  );
};

export default ManagementPage;
