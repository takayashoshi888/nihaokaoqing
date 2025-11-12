import React, { useState, useMemo } from 'react';
import BottomNav from '../components/BottomNav';
import { ExpenseRecord, ExpenseType } from '../types';
import { PlusIcon, EditIcon, TrashIcon, WalletIcon } from '../components/Icons';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold mb-4">{expense ? '编辑费用' : '添加费用'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">日期</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">类型</label>
            <select value={type} onChange={(e) => setType(e.target.value as ExpenseType)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500">
              <option value="transportation">交通费</option>
              <option value="toll">高速费</option>
              <option value="parking">停车费</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">金额 (円)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" step="1" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">备注 (可选)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"/>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end space-x-4 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">取消</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">保存</button>
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
  
  const expenseTypeToChinese = (type: ExpenseType) => {
    switch (type) {
      case 'transportation': return '交通费';
      case 'toll': return '高速费';
      case 'parking': return '停车费';
      default: return '未知';
    }
  };

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
    <div className="min-h-screen bg-gray-100 flex flex-col pb-16">
      <header className="bg-white shadow-md p-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-center text-gray-800">费用管理</h1>
      </header>

      <main className="flex-grow p-4 space-y-4">
        {/* Monthly Summary */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-gray-700 mb-3">本月费用统计</h3>
          <div className="flex justify-between items-center border-b pb-2 mb-2">
            <span className="text-gray-600">总计</span>
            <span className="font-bold text-lg text-blue-600">{monthlyStats.total.toFixed(0)} 円</span>
          </div>
          <div className="text-sm space-y-1 text-gray-500">
            <div className="flex justify-between"><span>交通费:</span> <span>{monthlyStats.transportation.toFixed(0)} 円</span></div>
            <div className="flex justify-between"><span>高速费:</span> <span>{monthlyStats.toll.toFixed(0)} 円</span></div>
            <div className="flex justify-between"><span>停车费:</span> <span>{monthlyStats.parking.toFixed(0)} 円</span></div>
          </div>
        </div>

        {/* Expense Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-700 mb-3">费用构成</h3>
            {monthlyStats.total > 0 ? (
                <div>
                    <div className="w-full bg-gray-200 rounded-full h-4 flex overflow-hidden my-2">
                        <div className="bg-blue-500 h-4 transition-all duration-500" style={{ width: `${transportationPercent}%` }} title={`交通费: ${transportationPercent.toFixed(1)}%`}></div>
                        <div className="bg-green-500 h-4 transition-all duration-500" style={{ width: `${tollPercent}%` }} title={`高速费: ${tollPercent.toFixed(1)}%`}></div>
                        <div className="bg-yellow-500 h-4 transition-all duration-500" style={{ width: `${parkingPercent}%` }} title={`停车费: ${parkingPercent.toFixed(1)}%`}></div>
                    </div>
                    <div className="flex justify-center space-x-4 text-xs text-gray-600 mt-3">
                        <div className="flex items-center"><span className="w-3 h-3 bg-blue-500 rounded-full mr-1.5"></span>交通费</div>
                        <div className="flex items-center"><span className="w-3 h-3 bg-green-500 rounded-full mr-1.5"></span>高速费</div>
                        <div className="flex items-center"><span className="w-3 h-3 bg-yellow-500 rounded-full mr-1.5"></span>停车费</div>
                    </div>
                </div>
            ) : (
                <p className="text-center text-gray-500 py-4">本月暂无费用数据</p>
            )}
        </div>

        {/* Expense List */}
        <div className="bg-white rounded-lg shadow">
           <h3 className="font-semibold text-gray-700 p-4 border-b">费用明细</h3>
           <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {expenses.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(expense => (
                    <li key={expense.id} className="p-4 flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-gray-800">{expenseTypeToChinese(expense.type)} - {expense.amount.toFixed(0)} 円</p>
                            <p className="text-sm text-gray-500">{expense.date}</p>
                            {expense.description && <p className="text-sm text-gray-400 mt-1">{expense.description}</p>}
                        </div>
                        <div className="flex space-x-2">
                            <button onClick={() => openEditModal(expense)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full" aria-label="编辑"><EditIcon className="w-5 h-5"/></button>
                            <button onClick={() => setDeletingId(expense.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full" aria-label="删除"><TrashIcon className="w-5 h-5"/></button>
                        </div>
                    </li>
                ))}
                {expenses.length === 0 && <p className="text-center text-gray-500 p-8">暂无费用记录</p>}
           </ul>
        </div>
      </main>
      
      <button onClick={() => { setEditingExpense(null); setIsModalOpen(true); }} className="fixed bottom-20 right-5 bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors" aria-label="添加费用">
            <PlusIcon className="w-8 h-8"/>
      </button>

      {isModalOpen && <ExpenseFormModal onClose={() => setIsModalOpen(false)} onSave={handleSaveExpense} expense={editingExpense}/>}

      {deletingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-bold mb-4">确认删除</h3>
            <p className="text-gray-600 mb-6">您确定要删除这条费用记录吗？此操作无法撤销。</p>
            <div className="flex justify-end space-x-4">
              <button onClick={() => setDeletingId(null)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">取消</button>
              <button onClick={() => handleDeleteExpense(deletingId)} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">确认删除</button>
            </div>
          </div>
        </div>
      )}

      <BottomNav activePage="expenseManagement" setActivePage={setActivePage} />
    </div>
  );
};

export default ExpenseManagementPage;
