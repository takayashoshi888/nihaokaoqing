import React, { useState, useMemo } from 'react';
import BottomNav from '../components/BottomNav';
import { ExpenseRecord, ExpenseType } from '../types';
import { PlusIcon, EditIcon, TrashIcon, WalletIcon } from '../components/Icons';
import { expenseTypeToChinese } from '../utils/helpers';

interface ExpenseManagementPageProps {
  setActivePage: (page: string) => void;
  expenses: ExpenseRecord[];
  setExpenses: React.Dispatch<React.SetStateAction<ExpenseRecord[]>>;
}

const ExpenseFormModal = ({
  onClose,
  onSave,
  expense,
}: {
  onClose: () => void;
  onSave: (expense: ExpenseRecord) => void;
  expense: ExpenseRecord | null;
}) => {
  const [date, setDate] = useState(expense?.date || new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<ExpenseType>(expense?.type || 'transportation');
  const [amount, setAmount] = useState(expense?.amount || '');
  const [description, setDescription] = useState(expense?.description || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('请输入有效的金额');
      return;
    }
    setError('');
    onSave({
      id: expense?.id || Date.now().toString(),
      date,
      type,
      amount: Math.round(Number(amount)),
      description,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold font-heading text-foreground mb-4">{expense ? '编辑费用' : '添加费用'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">日期</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="input-field"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">类型</label>
            <select value={type} onChange={(e) => setType(e.target.value as ExpenseType)} required className="input-field">
              <option value="transportation">交通费</option>
              <option value="toll">高速费</option>
              <option value="parking">停车费</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">金额 (円)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" step="1" required className="input-field"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">备注 (可选)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="input-field"/>
          </div>
          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost">取消</button>
            <button type="submit" className="btn-primary">保存</button>
          </div>
        </form>
      </div>
    </div>
  );
};


const ExpenseManagementPage: React.FC<ExpenseManagementPageProps> = ({ setActivePage, expenses, setExpenses }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const monthlyStats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const totals = {
      transportation: 0,
      toll: 0,
      parking: 0,
      total: 0,
    };

    expenses
      .filter(e => {
        const expenseDate = new Date(e.date);
        return expenseDate.getFullYear() === currentYear && expenseDate.getMonth() === currentMonth;
      })
      .forEach(e => {
        totals[e.type] += e.amount;
        totals.total += e.amount;
      });

    return totals;
  }, [expenses]);
  
  const handleSaveExpense = (expense: ExpenseRecord) => {
    const index = expenses.findIndex(e => e.id === expense.id);
    if (index > -1) {
      const updatedExpenses = [...expenses];
      updatedExpenses[index] = expense;
      setExpenses(updatedExpenses);
    } else {
      setExpenses([expense, ...expenses]);
    }
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
    setDeletingId(null);
  };

  const openEditModal = (expense: ExpenseRecord) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };
  
  const getPercentage = (value: number, total: number) => {
      if (total === 0) return 0;
      return (value / total) * 100;
  }

  const transportationPercent = getPercentage(monthlyStats.transportation, monthlyStats.total);
  const tollPercent = getPercentage(monthlyStats.toll, monthlyStats.total);
  const parkingPercent = getPercentage(monthlyStats.parking, monthlyStats.total);


  return (
    <div className="min-h-screen bg-surface flex flex-col pb-16">
      <header className="page-header">
        <h1 className="page-title">费用管理</h1>
      </header>

      <main className="flex-grow p-4 space-y-4">
        {/* Monthly Summary */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-3">
            <div className="p-2 bg-primary-50 rounded-2xl">
              <WalletIcon className="w-5 h-5 text-primary-600" />
            </div>
            <h3 className="section-title mb-0">本月费用统计</h3>
          </div>
          <div className="flex justify-between items-center pb-3 mb-3 border-b border-border/50">
            <span className="text-muted font-medium">总计</span>
            <span className="font-bold text-2xl text-primary-600 font-heading">{monthlyStats.total.toFixed(0)} <span className="text-base font-normal text-muted">円</span></span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-500"></span>
                <span className="text-muted">交通费</span>
              </div>
              <span className="font-medium text-foreground">{monthlyStats.transportation.toFixed(0)} 円</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-500"></span>
                <span className="text-muted">高速费</span>
              </div>
              <span className="font-medium text-foreground">{monthlyStats.toll.toFixed(0)} 円</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="text-muted">停车费</span>
              </div>
              <span className="font-medium text-foreground">{monthlyStats.parking.toFixed(0)} 円</span>
            </div>
          </div>
        </div>

        {/* Expense Chart */}
        <div className="card">
          <h3 className="section-title">费用构成</h3>
          {monthlyStats.total > 0 ? (
            <div>
              <div className="w-full bg-surface-alt rounded-full h-5 flex overflow-hidden my-3">
                {transportationPercent > 0 && (
                  <div className="bg-primary-500 h-5 transition-all duration-500 flex items-center justify-center text-xs text-white font-medium" style={{ width: `${transportationPercent}%`, minWidth: transportationPercent > 0 ? '2rem' : '0' }}>
                    {transportationPercent >= 10 ? `${transportationPercent.toFixed(0)}%` : ''}
                  </div>
                )}
                {tollPercent > 0 && (
                  <div className="bg-accent-500 h-5 transition-all duration-500 flex items-center justify-center text-xs text-white font-medium" style={{ width: `${tollPercent}%`, minWidth: tollPercent > 0 ? '2rem' : '0' }}>
                    {tollPercent >= 10 ? `${tollPercent.toFixed(0)}%` : ''}
                  </div>
                )}
                {parkingPercent > 0 && (
                  <div className="bg-amber-500 h-5 transition-all duration-500 flex items-center justify-center text-xs text-white font-medium" style={{ width: `${parkingPercent}%`, minWidth: parkingPercent > 0 ? '2rem' : '0' }}>
                    {parkingPercent >= 10 ? `${parkingPercent.toFixed(0)}%` : ''}
                  </div>
                )}
              </div>
              <div className="flex justify-center space-x-4 text-xs text-muted mt-3">
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-primary-500"></span>
                  <span>交通费 {transportationPercent.toFixed(0)}%</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-accent-500"></span>
                  <span>高速费 {tollPercent.toFixed(0)}%</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span>停车费 {parkingPercent.toFixed(0)}%</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted py-4">本月暂无费用数据</p>
          )}
        </div>

        {/* Expense List */}
        <div className="card !p-0 overflow-hidden">
          <div className="p-5 pb-3">
            <h3 className="section-title mb-0">费用明细</h3>
          </div>
          <ul className="max-h-96 overflow-y-auto">
            {expenses.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((expense, idx) => (
              <li key={expense.id} className={`px-5 py-4 flex justify-between items-center transition-colors duration-150 hover:bg-surface-alt ${idx !== 0 ? 'border-t border-border/30' : 'border-t border-border/30'}`}>
                <div className="flex-1 min-w-0 mr-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-foreground">{expenseTypeToChinese(expense.type)}</span>
                    <span className="font-bold text-primary-600">{expense.amount.toFixed(0)} 円</span>
                  </div>
                  <p className="text-sm text-muted mt-0.5">{expense.date}</p>
                  {expense.description && <p className="text-sm text-muted/70 mt-0.5 truncate">{expense.description}</p>}
                </div>
                <div className="flex space-x-1 flex-shrink-0">
                  <button onClick={() => openEditModal(expense)} className="p-2 text-primary-600 hover:bg-primary-50 rounded-2xl transition-colors duration-200" aria-label="编辑">
                    <EditIcon className="w-5 h-5"/>
                  </button>
                  <button onClick={() => setDeletingId(expense.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-2xl transition-colors duration-200" aria-label="删除">
                    <TrashIcon className="w-5 h-5"/>
                  </button>
                </div>
              </li>
            ))}
            {expenses.length === 0 && <li className="text-center text-muted p-8">暂无费用记录</li>}
          </ul>
        </div>
      </main>
      
      <button onClick={() => { setEditingExpense(null); setIsModalOpen(true); }} className="btn-fab" aria-label="添加费用">
        <PlusIcon className="w-7 h-7"/>
      </button>

      {isModalOpen && <ExpenseFormModal onClose={() => setIsModalOpen(false)} onSave={handleSaveExpense} expense={editingExpense}/>}

      {deletingId && (
        <div className="modal-overlay" onClick={() => setDeletingId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold font-heading text-foreground mb-4">确认删除</h3>
            <p className="text-muted mb-6">您确定要删除这条费用记录吗？此操作无法撤销。</p>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setDeletingId(null)} className="btn-ghost">取消</button>
              <button onClick={() => handleDeleteExpense(deletingId)} className="btn-danger">确认删除</button>
            </div>
          </div>
        </div>
      )}

      <BottomNav activePage="expenseManagement" setActivePage={setActivePage} />
    </div>
  );
};

export default ExpenseManagementPage;
