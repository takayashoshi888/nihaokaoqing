import React, { useState } from 'react';
import { generateAiSummary } from '../services/geminiService';
import { UserData, AttendanceRecord, ExpenseRecord, ExpenseType } from '../types';
import { AiIcon, DocumentIcon, PdfIcon, ShareIcon } from '../components/Icons';
import BottomNav from '../components/BottomNav';

interface AiPageProps {
  setActivePage: (page: string) => void;
  userData: UserData;
  records: { [date: string]: AttendanceRecord };
  expenses: ExpenseRecord[];
}

const AiPage: React.FC<AiPageProps> = ({ setActivePage, userData, records, expenses }) => {
  const [query, setQuery] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateSummary = async (userQuery = "请总结一下本月的考勤和费用情况。") => {
    setIsLoading(true);
    setSummary('');
    const recordsArray: AttendanceRecord[] = Object.values(records);
    const expensesArray: ExpenseRecord[] = expenses;
    const result = await generateAiSummary(userData, recordsArray, expensesArray, userQuery);
    setSummary(result);
    setIsLoading(false);
  };
  
  const handleQuerySubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(!query.trim()) return;
      handleGenerateSummary(query);
  }
  
  const expenseTypeToChinese = (type: ExpenseType) => {
    switch (type) {
      case 'transportation': return '交通费';
      case 'toll': return '高速费';
      case 'parking': return '停车费';
      default: return '未知费用';
    }
  };
  
  const handleExportPdf = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write('<html><head><title>考勤与费用报告</title>');
      printWindow.document.write('<style>body{font-family: sans-serif; margin: 20px;} h1, h2{color: #333;} table{width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 30px;} th, td{border: 1px solid #ddd; padding: 8px; text-align: left;} th{background-color: #f2f2f2;} .summary{background-color: #eef; padding: 15px; border-radius: 5px; margin-bottom: 20px;} .total{font-weight: bold; text-align: right;}</style>');
      printWindow.document.write('</head><body>');
      printWindow.document.write(`<h1>考勤与费用报告 - ${userData.name}</h1>`);
      printWindow.document.write(`<p><b>现场:</b> ${userData.siteName}</p>`);
      if(summary) {
        printWindow.document.write('<h2>AI 总结</h2>');
        printWindow.document.write(`<div class="summary">${summary.replace(/\n/g, '<br>')}</div>`);
      }

      // Attendance Records
      printWindow.document.write('<h2>打卡记录</h2>');
      printWindow.document.write('<table><thead><tr><th>日期</th><th>时间</th></tr></thead><tbody>');
      const recordsArray: AttendanceRecord[] = Object.values(records);
      recordsArray.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).forEach((rec) => {
          printWindow.document.write(`<tr><td>${rec.date}</td><td>${rec.time}</td></tr>`);
      });
      if (recordsArray.length === 0) {
        printWindow.document.write('<tr><td colspan="2">无记录</td></tr>');
      }
      printWindow.document.write('</tbody></table>');

      // Expense Records
      printWindow.document.write('<h2>费用报销单</h2>');
      printWindow.document.write('<table><thead><tr><th>日期</th><th>类型</th><th>金额 (円)</th><th>备注</th></tr></thead><tbody>');
      let totalExpense = 0;
      const currentMonthExpenses = expenses.filter(e => new Date(e.date).getMonth() === new Date().getMonth());
      currentMonthExpenses.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).forEach((exp) => {
          printWindow.document.write(`<tr><td>${exp.date}</td><td>${expenseTypeToChinese(exp.type)}</td><td>${exp.amount.toFixed(0)}</td><td>${exp.description || ''}</td></tr>`);
          totalExpense += exp.amount;
      });
       if (currentMonthExpenses.length === 0) {
        printWindow.document.write('<tr><td colspan="4">无记录</td></tr>');
      } else {
        printWindow.document.write(`<tr><td colspan="2" class="total">本月总计:</td><td colspan="2">${totalExpense.toFixed(0)} 円</td></tr>`);
      }
      printWindow.document.write('</tbody></table>');

      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pb-16">
      <header className="bg-white shadow-md p-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-center text-gray-800">AI 助手 & 导出</h1>
      </header>

      <main className="flex-grow p-4 space-y-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold text-gray-700 mb-2">智能查询</h2>
          <form onSubmit={handleQuerySubmit} className="flex space-x-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="询问关于考勤或费用的问题..."
              className="flex-grow p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400" disabled={isLoading}>
              查询
            </button>
          </form>
          <div className="flex space-x-2 mt-2">
            <button onClick={() => handleGenerateSummary("本月出勤几天？")} className="text-xs bg-gray-200 px-2 py-1 rounded-full hover:bg-gray-300">本月出勤几天？</button>
            <button onClick={() => handleGenerateSummary("本月花了多少交通费？")} className="text-xs bg-gray-200 px-2 py-1 rounded-full hover:bg-gray-300">交通费？</button>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow min-h-[150px]">
            <div className="flex items-center mb-2">
                <AiIcon className="w-6 h-6 text-blue-600 mr-2"/>
                <h2 className="font-semibold text-gray-700">AI 回复</h2>
            </div>
            {isLoading ? (
                <div className="flex justify-center items-center h-24">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="text-gray-600 whitespace-pre-wrap prose prose-sm max-w-none">{summary || '请开始查询或生成总结。'}</div>
            )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold text-gray-700 mb-3">功能操作</h2>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleGenerateSummary()} className="flex items-center justify-center p-3 bg-blue-100 text-blue-700 rounded-lg space-x-2 hover:bg-blue-200 transition-colors disabled:opacity-50" disabled={isLoading}>
              <DocumentIcon />
              <span>AI 总结</span>
            </button>
             <button onClick={handleExportPdf} className="flex items-center justify-center p-3 bg-green-100 text-green-700 rounded-lg space-x-2 hover:bg-green-200 transition-colors">
              <PdfIcon />
              <span>导出PDF</span>
            </button>
          </div>
        </div>
      </main>

      <BottomNav activePage="ai" setActivePage={setActivePage} />
    </div>
  );
};

export default AiPage;