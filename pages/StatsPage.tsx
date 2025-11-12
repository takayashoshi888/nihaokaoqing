import React, { useMemo } from 'react';
import BottomNav from '../components/BottomNav';
import { ChartIcon, CalendarIcon, WalletIcon, ClockIcon } from '../components/Icons';
import { AttendanceRecord, ExpenseRecord } from '../types';

interface StatsPageProps {
  setActivePage: (page: string) => void;
  records: { [date: string]: AttendanceRecord };
  expenses: ExpenseRecord[];
}

const StatCard = ({ icon, title, value, unit, colorClass }: { icon: React.ReactNode, title: string, value: string | number, unit: string, colorClass: string }) => (
    <div className={`bg-white p-4 rounded-lg shadow flex items-start space-x-4`}>
        <div className={`p-3 rounded-full ${colorClass}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">
                {value} <span className="text-base font-normal">{unit}</span>
            </p>
        </div>
    </div>
);


const StatsPage: React.FC<StatsPageProps> = ({ setActivePage, records, expenses }) => {
  const stats = useMemo(() => {
    const allRecords = Object.values(records);
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();

    // --- Attendance Stats ---
    // FIX: Add explicit type for `r` to resolve type error.
    const monthlyRecords = allRecords.filter((r: AttendanceRecord) => {
        const recordDate = new Date(r.date);
        return recordDate.getFullYear() === year && recordDate.getMonth() === month;
    });
    const totalCheckInsThisMonth = monthlyRecords.length;

    let weekdaysSoFar = 0;
    let checkedInWeekdays = 0;
    for (let i = 1; i <= today; i++) {
        const date = new Date(year, month, i);
        if (date.getDay() > 0 && date.getDay() < 6) { // Mon-Fri
            weekdaysSoFar++;
            const dateString = date.toISOString().split('T')[0];
            if (records[dateString]) {
                checkedInWeekdays++;
            }
        }
    }
    const attendanceRate = weekdaysSoFar > 0 ? Math.round((checkedInWeekdays / weekdaysSoFar) * 100) : 0;
    
    // --- Expense Stats ---
    const monthlyExpenses = expenses.filter(e => {
      const expenseDate = new Date(e.date);
      return expenseDate.getFullYear() === year && expenseDate.getMonth() === month;
    });

    const expenseTotals = { transportation: 0, toll: 0, parking: 0, total: 0 };
    monthlyExpenses.forEach(e => {
      expenseTotals[e.type] = (expenseTotals[e.type] || 0) + e.amount;
      expenseTotals.total += e.amount;
    });
    
    // --- Calendar Data for Heatmap ---
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);
    const startDay = startOfMonth.getDay();
    const daysInMonth = endOfMonth.getDate();
    const calendarDays = Array(startDay).fill(null).concat(
        Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1))
    );
    
    // --- Recent Activity ---
    // FIX: Add explicit types for `a` and `b` to resolve type error.
    const recentActivity = allRecords
        .sort((a: AttendanceRecord, b: AttendanceRecord) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

    return {
        totalCheckInsThisMonth,
        attendanceRate,
        expenseTotals,
        calendarDays,
        recentActivity,
        today,
    };
  }, [records, expenses]);

  const statCards = [
    { title: '本月出勤', value: stats.totalCheckInsThisMonth, unit: '天', icon: <CalendarIcon className="w-6 h-6 text-blue-600"/>, colorClass: 'bg-blue-100' },
    { title: '本月总费用', value: stats.expenseTotals.total.toFixed(0), unit: '円', icon: <WalletIcon className="w-6 h-6 text-green-600"/>, colorClass: 'bg-green-100' },
    { title: '出勤率 (工作日)', value: stats.attendanceRate, unit: '%', icon: <ChartIcon className="w-6 h-6 text-orange-600"/>, colorClass: 'bg-orange-100' },
  ];
  
  const expenseCategories = [
      { name: '交通费', value: stats.expenseTotals.transportation, color: 'bg-blue-500' },
      { name: '高速费', value: stats.expenseTotals.toll, color: 'bg-green-500' },
      { name: '停车费', value: stats.expenseTotals.parking, color: 'bg-yellow-500' },
  ];
  
  const getConicGradient = () => {
      if (stats.expenseTotals.total === 0) return 'rgb(229, 231, 235)';
      
      const tPercent = (stats.expenseTotals.transportation / stats.expenseTotals.total) * 100;
      const oPercent = (stats.expenseTotals.toll / stats.expenseTotals.total) * 100;
      
      let gradient = 'conic-gradient(';
      let currentPercentage = 0;
      
      gradient += `#3b82f6 0% ${tPercent}%, `;
      currentPercentage += tPercent;
      gradient += `#22c55e ${currentPercentage}% ${currentPercentage + oPercent}%, `;
      currentPercentage += oPercent;
      gradient += `#eab308 ${currentPercentage}% 100%)`;

      return gradient;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pb-16">
      <header className="bg-white shadow-md p-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-center text-gray-800">数据统计</h1>
      </header>
      <main className="flex-grow p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* FIX: Explicitly pass props to avoid type error with spread operator and key prop. */}
            {statCards.map(card => (
              <StatCard 
                  key={card.title}
                  title={card.title}
                  value={card.value}
                  unit={card.unit}
                  icon={card.icon}
                  colorClass={card.colorClass}
              />
            ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold text-gray-700 mb-4">本月出勤概览</h3>
                <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 mb-2">
                    {['日', '一', '二', '三', '四', '五', '六'].map(day => <div key={day}>{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                    {stats.calendarDays.map((day, index) => {
                        if (day === null) {
                            return <div key={`empty-${index}`}></div>;
                        }
                        const dateString = day.toISOString().split('T')[0];
                        const isCheckedIn = !!records[dateString];
                        const isToday = day.getDate() === stats.today;
                        
                        let dayClass = 'w-full aspect-square flex items-center justify-center rounded-md text-xs';
                        if(isCheckedIn) {
                            dayClass += ' bg-green-500 text-white font-bold';
                        } else {
                            dayClass += ' bg-gray-100 text-gray-600';
                        }
                        if (isToday) {
                            dayClass += ' ring-2 ring-blue-500 ring-offset-1';
                        }
                        
                        return <div key={dateString} className={dayClass}>{day.getDate()}</div>
                    })}
                </div>
            </div>

            <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold text-gray-700 mb-4">本月费用构成</h3>
                {stats.expenseTotals.total > 0 ? (
                    <div className="flex items-center space-x-4">
                        <div className="relative w-32 h-32 flex-shrink-0">
                            <div className="w-full h-full rounded-full" style={{ background: getConicGradient() }}></div>
                            <div className="absolute inset-2 bg-white rounded-full flex flex-col items-center justify-center">
                                <span className="text-xs text-gray-500">总计</span>
                                <span className="font-bold text-lg text-gray-800">{stats.expenseTotals.total.toFixed(0)}</span>
                                <span className="text-xs text-gray-500">円</span>
                            </div>
                        </div>
                        <ul className="space-y-2 text-sm">
                            {expenseCategories.map(cat => (
                                <li key={cat.name} className="flex items-center">
                                    <span className={`w-3 h-3 rounded-full mr-2 ${cat.color}`}></span>
                                    <span className="text-gray-600 w-16">{cat.name}</span>
                                    <span className="font-semibold text-gray-800">
                                        {((cat.value / stats.expenseTotals.total) * 100 || 0).toFixed(0)}%
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-32">
                        <p className="text-center text-gray-500">本月暂无费用数据</p>
                    </div>
                )}
            </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-700 mb-2">最近活动</h3>
            {stats.recentActivity.length > 0 ? (
                <ul className="space-y-2">
                    {stats.recentActivity.map(record => (
                        <li key={record.date} className="flex justify-between items-center p-2 border-b last:border-b-0">
                            <div className="flex items-center space-x-3">
                                <ClockIcon className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="font-medium text-gray-800">{record.date}</p>
                                    <p className="text-xs text-gray-500">{record.time}</p>
                                </div>
                            </div>
                            <span className="text-sm text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">已打卡</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500 py-4">暂无打卡记录</p>
            )}
        </div>
      </main>
      <BottomNav activePage="stats" setActivePage={setActivePage} />
    </div>
  );
};

export default StatsPage;