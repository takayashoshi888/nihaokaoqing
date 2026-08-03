import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, CheckInIcon, TrashIcon } from '../components/Icons';
import BottomNav from '../components/BottomNav';
import { AttendanceRecord, UserData } from '../types';
import { toISODateString, getDayOfWeek } from '../utils/helpers';

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

  return (
    <div className="min-h-screen bg-surface flex flex-col pb-16">
      {notification && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-accent-600 text-white px-6 py-3 rounded-2xl shadow-lg shadow-accent-600/25 z-50 animate-fade-in-out-quick font-medium">
            {notification}
        </div>
      )}

      <header className="page-header">
        <h1 className="page-title">打卡日历</h1>
      </header>
      
      <main className="flex-grow p-4 md:p-6 lg:p-8">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <button onClick={handlePrevMonth} className="w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-surface-alt transition-colors duration-200" aria-label="上个月">
              <ChevronLeftIcon />
            </button>
            <h2 className="text-lg font-semibold font-heading text-foreground">{`${currentDate.getFullYear()}年 ${currentDate.getMonth() + 1}月`}</h2>
            <button onClick={handleNextMonth} className="w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-surface-alt transition-colors duration-200" aria-label="下个月">
              <ChevronRightIcon />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center text-sm text-muted mb-2 font-medium">
            {['日', '一', '二', '三', '四', '五', '六'].map(day => <div key={day}>{day}</div>)}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {Array(startDay).fill(null).map((_, index) => <div key={`empty-${index}`}></div>)}
            {daysInMonth.map(day => {
              const dateString = toISODateString(day);
              const isToday = toISODateString(new Date()) === dateString;
              const isCheckedIn = !!records[dateString];
              
              let dayClass = 'relative w-full aspect-square flex items-center justify-center rounded-2xl text-sm transition-all duration-200 active:scale-95 focus:outline-none';
          
              if (isCheckedIn) {
                dayClass += ' bg-accent-500 text-white font-semibold shadow-lg shadow-accent-500/25';
              } else if (isToday) {
                dayClass += ' bg-primary-50 text-primary-700 font-bold';
              } else {
                dayClass += ' bg-surface-alt hover:bg-primary-50 text-foreground';
              }

              if (isToday) {
                  dayClass += ' ring-2 ring-primary-500 ring-offset-2';
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
                    <div className="absolute bottom-1 right-1 w-4 h-4 bg-white/30 rounded-full flex items-center justify-center" aria-hidden="true">
                        <CheckInIcon className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-4 card">
          <div className="flex justify-between items-center mb-2">
            <h3 className="section-title">本月打卡详情</h3>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center space-x-1.5 text-sm text-red-600 hover:bg-red-50 px-3 py-2 rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              aria-label="清理所有记录"
              disabled={Object.keys(records).length === 0}
            >
              <TrashIcon className="w-4 h-4" />
              <span>清理记录</span>
            </button>
          </div>

          <div className="divider mb-3"></div>

          <ul className="max-h-60 overflow-y-auto divide-y divide-border/50">
            {Object.values(records)
              .filter((r: AttendanceRecord) => new Date(r.date).getMonth() === currentDate.getMonth())
              .sort((a: AttendanceRecord, b: AttendanceRecord) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((record: AttendanceRecord) => (
                  <li key={record.date} className="py-3 first:pt-0 last:pb-0 grid grid-cols-3 gap-x-2 items-center">
                    <div className="col-span-2">
                      <p className="font-semibold text-foreground">{`${record.date} (${getDayOfWeek(record.date)})`}</p>
                      <p className="text-sm text-muted truncate">{`氏名: ${userData.name}`}</p>
                      <p className="text-sm text-muted truncate">{`現場: ${userData.siteName}`}</p>
                    </div>
                    <div className="flex flex-col items-end gap-y-2">
                      <span className="text-foreground font-mono text-sm">{record.time}</span>
                      <span className="badge-success">正常</span>
                    </div>
                  </li>
              ))
            }
            {Object.values(records).filter((r: AttendanceRecord) => new Date(r.date).getMonth() === currentDate.getMonth()).length === 0 && (
              <li className="py-8 text-center text-muted">本月暂无打卡记录</li>
            )}
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
        <div className="modal-overlay" aria-modal="true" role="dialog" onClick={() => setConfirmingCancel(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold font-heading text-foreground mb-4">确认操作</h3>
            <p className="text-muted mb-6">{`您确定要取消 ${confirmingCancel} 的打卡记录吗？`}</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmingCancel(null)}
                className="btn-ghost"
              >
                返回
              </button>
              <button
                onClick={handleConfirmCancel}
                className="btn-danger"
              >
                确认取消
              </button>
            </div>
          </div>
        </div>
      )}

      {showClearConfirm && (
        <div className="modal-overlay" aria-modal="true" role="dialog" onClick={() => setShowClearConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold font-heading text-foreground mb-4">确认清除</h3>
            <p className="text-muted mb-6">此操作将永久删除所有考勤记录，无法恢复。您确定要继续吗？</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="btn-ghost"
              >
                返回
              </button>
              <button
                onClick={handleClearAllRecords}
                className="btn-danger"
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
