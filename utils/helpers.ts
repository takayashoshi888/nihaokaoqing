import { ExpenseType } from '../types';

/** 将费用类型转为中文 */
export const expenseTypeToChinese = (type: ExpenseType): string => {
  const map: Record<ExpenseType, string> = {
    transportation: '交通费',
    toll: '高速费',
    parking: '停车费',
  };
  return map[type] || '未知费用';
};

/** 获取日期的星期简称 (日语) */
export const getDayOfWeek = (dateString: string): string => {
  const date = new Date(dateString);
  date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
  return date.toLocaleDateString('ja-JP', { weekday: 'short' });
};

/** 格式化日期为 YYYY-MM-DD */
export const toISODateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/** 获取当前年月 */
export const getCurrentYearMonth = () => {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() };
};
