import React, { useState, useRef } from 'react';
import { generateAiSummary } from '../services/geminiService';
import { UserData, AttendanceRecord, ExpenseRecord } from '../types';
import { AiIcon, DocumentIcon, PdfIcon, ShareIcon } from '../components/Icons';
import { expenseTypeToChinese, getDayOfWeek } from '../utils/helpers';
import { buildReportHtml } from '../utils/reportGenerator';
import BottomNav from '../components/BottomNav';

interface AiPageProps {
  setActivePage: (page: string) => void;
  userData: UserData;
  records: { [date: string]: AttendanceRecord };
  expenses: ExpenseRecord[];
}

const AiPage: React.FC<AiPageProps> = ({ setActivePage, userData, records, expenses }) => {
  const [userQuery, setUserQuery] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleAiQuery = async () => {
    if (!userQuery.trim()) return;
    setIsLoading(true);
    setAiSummary('');
    try {
      const recordsArray = Object.values(records);
      const summary = await generateAiSummary(userData, recordsArray, expenses, userQuery);
      setAiSummary(summary);
    } catch {
      setAiSummary('AI 分析请求失败，请检查网络连接或 API 密钥。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPdf = () => {
    const html = buildReportHtml(userData, records, expenses, aiSummary);
    const blob = new Blob(['\uFEFF' + html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank');
    if (!printWindow) {
      alert('请允许弹出窗口以导出 PDF');
      URL.revokeObjectURL(url);
      return;
    }
    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
        URL.revokeObjectURL(url);
      };
    };
  };

  const handleDownloadHtml = () => {
    const html = buildReportHtml(userData, records, expenses, aiSummary);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `考勤报告_${userData.siteName}_${new Date().toISOString().slice(0, 10)}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const quickPrompts = [
    '本月出勤率和费用汇总',
    '哪些方面需要优化？',
    '生成一份月度报告分析',
  ];

  return (
    <div className="min-h-screen flex flex-col pb-16" style={{ backgroundColor: 'var(--theme-surface)' }}>
      <header className="page-header">
        <h1 className="page-title">AI 助手</h1>
      </header>

      <main className="flex-grow p-4 md:p-6 lg:p-8">
        {/* Query Section */}
        <div className="card mb-4">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mr-2" style={{ backgroundColor: 'var(--theme-primary-50)' }}>
              <AiIcon className="w-5 h-5" style={{ color: 'var(--theme-primary-600)' }} />
            </div>
            <h3 className="font-semibold" style={{ fontFamily: 'Poppins, sans-serif', color: 'var(--theme-foreground)' }}>AI 分析</h3>
          </div>
          <textarea
            className="input-field resize-none mb-3"
            rows={3}
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="输入你的问题，例如：本月出勤率和费用汇总…"
          />
          <div className="flex flex-wrap gap-2 mb-3">
            {quickPrompts.map((p) => (
              <button
                key={p}
                onClick={() => setUserQuery(p)}
                className="px-3 py-1.5 text-xs font-medium rounded-full transition-colors"
                style={{ color: 'var(--theme-accent-600)', backgroundColor: 'var(--theme-accent-50)' }}
              >
                {p}
              </button>
            ))}
          </div>
          <button onClick={handleAiQuery} disabled={isLoading || !userQuery.trim()} className="btn-primary w-full">
            {isLoading ? '分析中…' : '提交查询'}
          </button>
        </div>

        {/* AI Reply */}
        <div className="card mb-4">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mr-2" style={{ backgroundColor: 'var(--theme-primary-50)' }}>
              <DocumentIcon className="w-5 h-5" style={{ color: 'var(--theme-primary-600)' }} />
            </div>
            <h3 className="font-semibold" style={{ fontFamily: 'Poppins, sans-serif', color: 'var(--theme-foreground)' }}>分析结果</h3>
          </div>
          {isLoading ? (
            <div className="flex items-center space-x-2 py-4">
              <span className="w-2 h-2 rounded-full animate-bounce"
                style={{ backgroundColor: 'var(--theme-primary-600)', animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full animate-bounce"
                style={{ backgroundColor: 'var(--theme-primary-600)', animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full animate-bounce"
                style={{ backgroundColor: 'var(--theme-primary-600)', animationDelay: '300ms' }} />
              <span className="text-sm ml-2" style={{ color: 'var(--theme-muted)' }}>AI 正在思考…</span>
            </div>
          ) : aiSummary ? (
            <p className="text-sm whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--theme-foreground)' }}>{aiSummary}</p>
          ) : (
            <p className="text-sm py-4" style={{ color: 'var(--theme-muted)' }}>输入问题开始分析</p>
          )}
        </div>

        {/* Export */}
        <div className="card">
          <h3 className="font-semibold mb-3" style={{ fontFamily: 'Poppins, sans-serif', color: 'var(--theme-foreground)' }}>导出报告</h3>
          <p className="text-xs mb-4" style={{ color: 'var(--theme-muted)' }}>
            点击下方按钮导出 PDF 报告（通过浏览器打印另存为 PDF）或下载 HTML 文件。
          </p>
          <div className="divider mb-4" />
          <div className="flex gap-3">
            <button onClick={handleExportPdf} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <PdfIcon className="w-4 h-4" />
              导出 PDF
            </button>
            <button onClick={handleDownloadHtml} className="btn-accent flex-1 flex items-center justify-center gap-2">
              <ShareIcon className="w-4 h-4" />
              下载 HTML
            </button>
          </div>
        </div>
      </main>

      {/* Hidden iframe for print - ensures proper rendering */}
      <iframe ref={iframeRef} style={{ display: 'none' }} title="print-frame" />

      <BottomNav activePage="ai" setActivePage={setActivePage} />
    </div>
  );
};

export default AiPage;
