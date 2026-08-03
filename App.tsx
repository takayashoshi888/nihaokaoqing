import React, { useState, useEffect } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { UserData, AttendanceRecord, ExpenseRecord, SavedSite } from './types';
import { toISODateString } from './utils/helpers';

import WelcomeScreen from './components/WelcomeScreen';
import LoginPage from './pages/LoginPage';
import ManagementPage from './pages/ManagementPage';
import AttendanceLogPage from './pages/AttendanceLogPage';
import AiPage from './pages/AiPage';
import StatsPage from './pages/StatsPage';
import SiteSettingsPage from './pages/SiteSettingsPage';
import ExpenseManagementPage from './pages/ExpenseManagementPage';

const App = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [userData, setUserData] = useLocalStorage<UserData | null>('userData', null);
  const [sites, setSites] = useLocalStorage<SavedSite[]>('savedSites', []);
  const [records, setRecords] = useLocalStorage<{ [date: string]: AttendanceRecord }>('attendanceRecords', {});
  const [expenses, setExpenses] = useLocalStorage<ExpenseRecord[]>('expenseRecords', []);
  const [activePage, setActivePage] = useState('login');

  // Auto-update sites list when userData changes
  useEffect(() => {
    if (!userData) return;
    setSites(prev => {
      // If site already exists by name+siteName, use it; otherwise add new
      const exists = prev.some(s => s.name === userData.name && s.siteName === userData.siteName);
      if (exists) return prev;
      const newSite: SavedSite = {
        id: Date.now().toString(),
        name: userData.name,
        siteName: userData.siteName,
        createdAt: toISODateString(new Date()),
      };
      return [newSite, ...prev];
    });
  }, [userData?.name, userData?.siteName]);

  useEffect(() => {
    if (userData) {
      setActivePage('management');
    } else {
      setActivePage('login');
    }
  }, [userData]);

  const handleLogin = (newUserData: UserData) => {
    setUserData(newUserData);
    setActivePage('management');
  };

  const handleLogout = () => {
    setActivePage('login');
  };

  const handleViewData = () => {
    setActivePage('management');
  };

  const handleSwitchSite = (site: SavedSite) => {
    setUserData({ name: site.name, siteName: site.siteName });
  };

  const handleDeleteSite = (siteId: string) => {
    setSites(prev => prev.filter(s => s.id !== siteId));
    // If deleted the current active site, switch to first remaining or logout
    if (sites.find(s => s.id === siteId)?.name === userData?.name &&
        sites.find(s => s.id === siteId)?.siteName === userData?.siteName) {
      const remaining = sites.filter(s => s.id !== siteId);
      if (remaining.length > 0) {
        setUserData({ name: remaining[0].name, siteName: remaining[0].siteName });
      } else {
        setUserData(null);
        setActivePage('login');
      }
    }
  };

  if (showWelcome) {
    return <WelcomeScreen onFinish={() => setShowWelcome(false)} />;
  }

  const renderPage = () => {
    if (!userData || activePage === 'login') {
      return <LoginPage onLogin={handleLogin} onViewData={handleViewData} savedUserData={userData} />;
    }

    switch (activePage) {
      case 'management':
        return <ManagementPage userData={userData} onLogout={handleLogout} setActivePage={setActivePage} />;
      case 'attendanceLog':
        return <AttendanceLogPage setActivePage={setActivePage} records={records} setRecords={setRecords} userData={userData} />;
      case 'ai':
        return <AiPage setActivePage={setActivePage} userData={userData} records={records} expenses={expenses} />;
      case 'stats':
        return <StatsPage setActivePage={setActivePage} records={records} expenses={expenses} />;
      case 'siteSettings':
        return (
          <SiteSettingsPage
            setActivePage={setActivePage}
            userData={userData}
            setUserData={setUserData}
            sites={sites}
            setSites={setSites}
            onSwitchSite={handleSwitchSite}
            onDeleteSite={handleDeleteSite}
          />
        );
      case 'expenseManagement':
        return <ExpenseManagementPage setActivePage={setActivePage} expenses={expenses} setExpenses={setExpenses} />;
      default:
        return <ManagementPage userData={userData} onLogout={handleLogout} setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="bg-surface min-h-screen font-body">
      <div key={activePage} className="page-transition">
        {renderPage()}
      </div>
    </div>
  );
};

export default App;
