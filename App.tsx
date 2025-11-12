import React, { useState, useEffect } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { UserData, AttendanceRecord, ExpenseRecord } from './types';

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
  const [records, setRecords] = useLocalStorage<{ [date: string]: AttendanceRecord }>('attendanceRecords', {});
  const [expenses, setExpenses] = useLocalStorage<ExpenseRecord[]>('expenseRecords', []);
  const [activePage, setActivePage] = useState('login'); // login, management, attendanceLog, etc.

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
    // Keep user data for convenience, but go to login page
    setActivePage('login');
  };
  
  const handleViewData = () => {
      setActivePage('management');
  }

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
        return <AttendanceLogPage setActivePage={setActivePage} records={records} setRecords={setRecords} />;
      case 'ai':
        return <AiPage setActivePage={setActivePage} userData={userData} records={records} expenses={expenses} />;
      case 'stats':
        return <StatsPage setActivePage={setActivePage} records={records} expenses={expenses} />;
      case 'siteSettings':
        return <SiteSettingsPage setActivePage={setActivePage} userData={userData} setUserData={setUserData}/>
      case 'expenseManagement':
        return <ExpenseManagementPage setActivePage={setActivePage} expenses={expenses} setExpenses={setExpenses} />;
      default:
        return <ManagementPage userData={userData} onLogout={handleLogout} setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {renderPage()}
    </div>
  );
};

export default App;