import { toISODateString, getDayOfWeek, expenseTypeToChinese } from './helpers';
import { UserData, AttendanceRecord, ExpenseRecord } from '../types';

/** Build a clean HTML report string for printing to PDF */
export const buildReportHtml = (
  userData: UserData,
  records: { [date: string]: AttendanceRecord },
  expenses: ExpenseRecord[],
  summary: string,
): string => {
  const recordsArray = Object.values(records).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const currentMonthExpenses = expenses
    .filter((e) => new Date(e.date).getMonth() === new Date().getMonth())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const totalExpense = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  const rowsRecords = recordsArray.length
    ? recordsArray
        .map(
          (rec) =>
            `<tr><td>${rec.date}</td><td>${getDayOfWeek(rec.date)}</td><td>${userData.name}</td><td>${userData.siteName}</td><td>${rec.time}</td></tr>`,
        )
        .join('')
    : '<tr><td colspan="5" class="tc">暂无记录</td></tr>';

  const rowsExpenses = currentMonthExpenses.length
    ? currentMonthExpenses
        .map(
          (exp) =>
            `<tr><td>${exp.date}</td><td>${expenseTypeToChinese(exp.type)}</td><td>${exp.amount.toFixed(0)} 円</td><td>${exp.description || '-'}</td></tr>`,
        )
        .join('') +
      `<tr class="total-row"><td colspan="2">本月合计</td><td colspan="2">${totalExpense.toFixed(0)} 円</td></tr>`
    : '<tr><td colspan="4" class="tc">暂无记录</td></tr>';

  const today = toISODateString(new Date());

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>考勤与费用报告 – ${userData.siteName}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: "Noto Sans SC", "Microsoft YaHei", "Hiragino Sans GB", sans-serif;
      color: #1e293b;
      line-height: 1.6;
      padding: 30px 40px;
      max-width: 820px;
      margin: 0 auto;
    }
    h1 { font-size: 22px; color: #1e40af; border-bottom: 2px solid #2563eb; padding-bottom: 8px; margin-bottom: 16px; }
    h2 { font-size: 16px; color: #334155; margin-top: 28px; margin-bottom: 10px; }
    .meta { font-size: 13px; color: #64748b; margin-bottom: 20px; }
    .meta span { margin-right: 24px; }
    .summary-box { background: #eff6ff; border-left: 4px solid #2563eb; padding: 14px 18px; border-radius: 0 12px 12px 0; margin-bottom: 20px; font-size: 14px; white-space: pre-wrap; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 24px; }
    th { background: #f1f5f9; text-align: left; padding: 10px 12px; font-weight: 600; color: #475569; border-bottom: 2px solid #cbd5e1; }
    td { padding: 9px 12px; border-bottom: 1px solid #e2e8f0; }
    .total-row td { font-weight: 700; border-top: 2px solid #94a3b8; background: #f8fafc; }
    .tc { text-align: center; color: #94a3b8; }
    .footer { margin-top: 32px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
    @media print {
      body { padding: 20px 30px; }
      @page { size: A4; margin: 15mm; }
    }
  </style>
</head>
<body>
  <h1>考勤与费用报告</h1>
  <div class="meta">
    <span>现场: ${userData.siteName}</span>
    <span>用户: ${userData.name}</span>
    <span>日期: ${today}</span>
  </div>
  ${summary ? `<h2>AI 总结</h2><div class="summary-box">${summary.replace(/\n/g, '<br>')}</div>` : ''}
  <h2>打卡记录</h2>
  <table>
    <thead><tr><th>日期</th><th>曜日</th><th>姓名</th><th>现场</th><th>时间</th></tr></thead>
    <tbody>${rowsRecords}</tbody>
  </table>
  <h2>当月费用报销</h2>
  <table>
    <thead><tr><th>日期</th><th>类型</th><th>金额</th><th>备注</th></tr></thead>
    <tbody>${rowsExpenses}</tbody>
  </table>
  <div class="footer">现场出勤管理系统 自动生成 | ${today}</div>
</body>
</html>`;
};
