import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, CheckInIcon, TrashIcon } from '../components/Icons';
import BottomNav from '../components/BottomNav';
import { AttendanceRecord, UserData } from '../types';

interface AttendanceLogPageProps {
  setActivePage: (page: string) => void;
  records: { [date: string]: AttendanceRecord };
  setRecords: React.Dispatch<React.SetStateAction<{ [date: string]: AttendanceRecord }>>;
  userData: UserData;
}

const AttendanceLogPage: React.FC<AttendanceLogPageProps> = ({ setActivePage, records, setRecords, userData }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [notification, setNotification] = useState<string | null>(null);
  const [confirmingCancel, setConfirmingCancel] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.

  const daysInMonth = [];
  for (let i = 1; i <= endOfMonth.getDate(); i++) {
    daysInMonth.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const toISODateString = (date: Date) => {
      return date.toISOString().split('T')[0];
  }

  const handleDayClick = (day: Date) => {
    const dateString = toISODateString(day);
    if (records[dateString]) {
      // Ask for confirmation to un-checkin
      setConfirmingCancel(dateString);
    } else {
      // Check-in
      const now = new Date();
      const newRecord: AttendanceRecord = {
          date: dateString,
          time: now.toTimeString().split(' ')[0]
      };
      setRecords({ ...records, [dateString]: newRecord });
      setNotification(`已为 ${dateString} 打卡成功`);
    }
  };

  const handleConfirmCancel = () => {
    if (!confirmingCancel) return;
    
    const newRecords = { ...records };
    delete newRecords[confirmingCancel];
    setRecords(newRecords);
    setNotification(`已取消 ${confirmingCancel} 的打卡记录`);
    setConfirmingCancel(null);
  };

  const handleClearAllRecords = () => {
    setRecords({});
    setNotification('所有考勤记录已成功清除');
    setShowClearConfirm(false);
  };

  const getDayOfWeek = (dateString: string) => {
      const date = new Date(dateString);
      // Adjust for timezone offset to prevent day shifting when converting from string
      date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
      return date.toLocaleDateString('ja-JP', { weekday: 'short' });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pb-16">
      {notification && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-2 rounded-full shadow-lg z-50 animate-fade-in-out-quick">
            {notification}
        </div>
      )}

      <header className="bg-white shadow-md p-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-center text-gray-800">打卡日历</h1>
      </header>
      
      <main className="flex-grow p-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-200">
              <ChevronLeftIcon />
            </button>
            <h2 className="text-lg font-semibold">{`${currentDate.getFullYear()}年 ${currentDate.getMonth() + 1}月`}</h2>
            <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-200">
              <ChevronRightIcon />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 mb-2">
            {['日', '一', '二', '三', '四', '五', '六'].map(day => <div key={day}>{day}</div>)}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {Array(startDay).fill(null).map((_, index) => <div key={`empty-${index}`}></div>)}
            {daysInMonth.map(day => {
              const dateString = toISODateString(day);
              const isToday = toISODateString(new Date()) === dateString;
              const isCheckedIn = !!records[dateString];
              
              let dayClass = 'relative w-full aspect-square flex items-center justify-center rounded-full text-sm transition-colors duration-200 transform hover:scale-105 focus:outline-none';
          
              if (isCheckedIn) {
                dayClass += ' bg-emerald-500 text-white font-bold hover:bg-emerald-600 shadow-md';
              } else if (isToday) {
                dayClass += ' bg-blue-100 text-blue-700 font-bold';
              } else {
                dayClass += ' bg-white hover:bg-gray-100 text-gray-700';
              }

              if (isToday) {
                  dayClass += ' ring-2 ring-blue-500 ring-offset-1';
              }
              
              return (
                <button 
                  key={dateString}
                  onClick={() => handleDayClick(day)}
                  className={dayClass}
                  aria-label={`Date ${day.getDate()}, ${isCheckedIn ? 'Checked in' : 'Not checked in'}`}
                >
                  {day.getDate()}
                  {isCheckedIn && (
                    <div className="absolute bottom-1.5 right-1.5 w-4 h-4 bg-white/25 rounded-full flex items-center justify-center" aria-hidden="true">
                        <CheckInIcon className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
         <div className="mt-4 bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">本月打卡详情</h3>
              <button
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center space-x-1 text-sm text-red-600 hover:bg-red-50 p-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="清理所有记录"
                disabled={Object.keys(records).length === 0}
              >
                  <TrashIcon className="w-4 h-4" />
                  <span>清理记录</span>
              </button>
            </div>
            <ul className="max-h-60 overflow-y-auto divide-y divide-gray-100">
                {Object.values(records)
                  .filter((r: AttendanceRecord) => new Date(r.date).getMonth() === currentDate.getMonth())
                  .sort((a: AttendanceRecord, b: AttendanceRecord) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((record: AttendanceRecord) => (
                      <li key={record.date} className="p-3 grid grid-cols-3 gap-x-2 items-center">
                          <div className="col-span-2">
                              <p className="font-semibold text-gray-800">{`${record.date} (${getDayOfWeek(record.date)})`}</p>
                              <p className="text-sm text-gray-500 truncate">{`氏名: ${userData.name}`}</p>
                              <p className="text-sm text-gray-500 truncate">{`現場: ${userData.siteName}`}</p>
                          </div>
                          <div className="flex flex-col items-end gap-y-2">
                              <span className="text-gray-700 font-mono text-sm">{record.time}</span>
                              <span className="text-green-600 font-medium bg-green-100 px-2 py-0.5 rounded-full text-xs">正常</span>
                          </div>
                      </li>
                  ))
                }
            </ul>
        </div>
      </main>
      
      <style>{`
        @keyframes fade-in-out-quick {
          0% { opacity: 0; transform: translate(-50%, -20px); }
          15% { opacity: 1; transform: translate(-50%, 0); }
          85% { opacity: 1; transform: translate(-50%, 0); }
          100% { opacity: 0; transform: translate(-50%, -20px); }
        }
        .animate-fade-in-out-quick {
          animation: fade-in-out-quick 3s ease-in-out forwards;
        }
      `}</style>

      <BottomNav activePage="attendanceLog" setActivePage={setActivePage} />

      {confirmingCancel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40" aria-modal="true" role="dialog">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-bold mb-4">确认操作</h3>
            <p className="text-gray-600 mb-6">{`您确定要取消 ${confirmingCancel} 的打卡记录吗？`}</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setConfirmingCancel(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                返回
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                确认取消
              </button>
            </div>
          </div>
        </div>
      )}

      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40" aria-modal="true" role="dialog">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-bold mb-4">确认清除</h3>
            <p className="text-gray-600 mb-6">此操作将永久删除所有考勤记录，无法恢复。您确定要继续吗？</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                返回
              </button>
              <button
                onClick={handleClearAllRecords}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                确认清除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceLogPage;