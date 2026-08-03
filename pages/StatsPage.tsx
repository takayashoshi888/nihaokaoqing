import React, { useMemo } from 'react';
import BottomNav from '../components/BottomNav';
import { ChartIcon, CalendarIcon, WalletIcon, ClockIcon } from '../components/Icons';
import { AttendanceRecord, ExpenseRecord } from '../types';

interface StatsPageProps {
  setActivePage: (page: string) => void;
  records: { [date: string]: AttendanceRecord };
  expenses: ExpenseRecord[];
}

const StatCard = ({ icon, title, value, unit, colorClass }: { icon: React.ReactNode; title: string; value: string | number; unit: string; colorClass: string; key?: React.Key }) => (
    <div className="card flex items-start space-x-4 !p-4">
        <div className={`p-3 rounded-2xl ${colorClass}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-muted font-medium">{title}</p>
            <p className="text-2xl font-bold text-foreground font-heading">
                {value} <span className="text-base font-normal text-muted">{unit}</span>
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
    { title: '本月出勤', value: stats.totalCheckInsThisMonth, unit: '天', icon: <CalendarIcon className="w-6 h-6 text-primary-600"/>, colorClass: 'bg-primary-50' },
    { title: '本月总费用', value: stats.expenseTotals.total.toFixed(0), unit: '円', icon: <WalletIcon className="w-6 h-6 text-accent-600"/>, colorClass: 'bg-accent-50' },
    { title: '出勤率 (工作日)', value: stats.attendanceRate, unit: '%', icon: <ChartIcon className="w-6 h-6 text-orange-600"/>, colorClass: 'bg-orange-50' },
  ];
  
  const expenseCategories = [
      { name: '交通费', value: stats.expenseTotals.transportation, color: 'bg-primary-500' },
      { name: '高速费', value: stats.expenseTotals.toll, color: 'bg-accent-500' },
      { name: '停车费', value: stats.expenseTotals.parking, color: 'bg-amber-500' },
  ];
  
  const getConicGradient = () => {
      if (stats.expenseTotals.total === 0) return '#E4ECFC';
      
      const tPercent = (stats.expenseTotals.transportation / stats.expenseTotals.total) * 100;
      const oPercent = (stats.expenseTotals.toll / stats.expenseTotals.total) * 100;
      
      let gradient = 'conic-gradient(';
      let currentPercentage = 0;
      
      gradient += `var(--theme-primary-600) 0% ${tPercent}%, `;
      currentPercentage += tPercent;
      gradient += `var(--theme-accent-600) ${currentPercentage}% ${currentPercentage + oPercent}%, `;
      currentPercentage += oPercent;
      gradient += `#f59e0b ${currentPercentage}% 100%)`;

      return gradient;
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col pb-16">
      <header className="page-header">
        <h1 className="page-title">数据统计</h1>
      </header>
      <main className="flex-grow p-4 md:p-6 lg:p-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Calendar Heatmap */}
            <div className="lg:col-span-3 card">
                <h3 className="section-title">本月出勤概览</h3>
                <div className="grid grid-cols-7 gap-1 text-center text-sm text-muted mb-2 font-medium">
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
                        
                        let dayClass = 'w-full aspect-square flex items-center justify-center rounded-xl text-xs font-medium transition-all duration-200';
                        if(isCheckedIn) {
                            dayClass += ' bg-accent-500 text-white font-bold shadow-sm shadow-accent-500/20';
                        } else {
                            dayClass += ' bg-surface-alt text-muted';
                        }
                        if (isToday) {
                            dayClass += ' ring-2 ring-primary-500 ring-offset-2';
                        }
                        
                        return <div key={dateString} className={dayClass}>{day.getDate()}</div>
                    })}
                </div>
            </div>

            {/* Donut Chart */}
            <div className="lg:col-span-2 card">
                <h3 className="section-title">本月费用构成</h3>
                {stats.expenseTotals.total > 0 ? (
                    <div className="flex items-center space-x-4">
                        <div className="relative w-32 h-32 flex-shrink-0">
                            <div className="w-full h-full rounded-full" style={{ background: getConicGradient() }}></div>
                            <div className="absolute inset-2 bg-white rounded-full flex flex-col items-center justify-center">
                                <span className="text-xs text-muted">总计</span>
                                <span className="font-bold text-lg text-foreground font-heading">{stats.expenseTotals.total.toFixed(0)}</span>
                                <span className="text-xs text-muted">円</span>
                            </div>
                        </div>
                        <ul className="space-y-2.5 text-sm flex-1">
                            {expenseCategories.map(cat => (
                                <li key={cat.name} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <span className={`w-3 h-3 rounded-full ${cat.color}`}></span>
                                        <span className="text-muted">{cat.name}</span>
                                    </div>
                                    <span className="font-semibold text-foreground">
                                        {((cat.value / stats.expenseTotals.total) * 100 || 0).toFixed(0)}%
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-32">
                        <p className="text-center text-muted">本月暂无费用数据</p>
                    </div>
                )}
            </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
            <h3 className="section-title">最近活动</h3>
            {stats.recentActivity.length > 0 ? (
                <ul className="space-y-1">
                    {stats.recentActivity.map((record, idx) => (
                        <li key={record.date} className={`flex justify-between items-center py-3 ${idx !== 0 ? 'border-t border-border/30' : ''}`}>
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-surface-alt rounded-2xl">
                                    <ClockIcon className="w-4 h-4 text-muted" />
                                </div>
                                <div>
                                    <p className="font-medium text-foreground">{record.date}</p>
                                    <p className="text-xs text-muted">{record.time}</p>
                                </div>
                            </div>
                            <span className="badge-success">已打卡</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-muted py-4">暂无打卡记录</p>
            )}
        </div>
      </main>
      <BottomNav activePage="stats" setActivePage={setActivePage} />
    </div>
  );
};

export default StatsPage;
