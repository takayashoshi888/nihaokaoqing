
import { GoogleGenAI } from "@google/genai";
import { AttendanceRecord, UserData, ExpenseRecord } from '../types';

export const generateAiSummary = async (userData: UserData, records: AttendanceRecord[], expenses: ExpenseRecord[], userQuery: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "错误：API密钥未配置。请确保您的环境中已设置API_KEY。";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const recordsText = records.length > 0
      ? records.map(r => `${r.date} at ${r.time}`).join('\n')
      : '无';

    const expensesText = expenses.length > 0
      ? expenses.map(e => `${e.date}: ${e.type} - ${e.amount}円 (${e.description || '无备注'})`).join('\n')
      : '无';

    const prompt = `
      作为一名数据分析助理，请根据以下考勤和费用数据以及用户问题生成一份简洁的中文总结。

      用户信息:
      - 姓名: ${userData.name}
      - 现场名称: ${userData.siteName}

      考勤记录 (日期和时间):
      ${recordsText}

      费用记录:
      ${expensesText}

      用户问题: "${userQuery}"

      请根据以上信息回答用户的问题。如果只是要求总结，请提供一份整体考勤和费用情况的摘要。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "抱歉，与AI助手通信时发生错误。请稍后再试。";
  }
};