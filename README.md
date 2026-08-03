<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 現場出勤管理 (On-Site Attendance Management)

施工現場向けの出勤・経費管理アプリケーション。React + TypeScript + Vite + Tailwind CSS で構築。

## 機能

| 機能 | 説明 |
|------|------|
| **ユーザー設定** | 名前・現場名の登録・編集（Modal フォーム） |
| **出勤打刻** | カレンダー形式で日別に出勤/欠勤を記録、月次ナビゲーション |
| **経費管理** | 交通費・高速代・駐車料金の記録、横棒グラフで費目別集計 |
| **データ分析** | 出勤率・経費総額の統計カード、カレンダーヒートマップ、円グラフ |
| **AI アシスタント** | Gemini API による出勤・経費データの分析とアドバイス、PDF エクスポート |
| **テーマ切替** | 5種類のカラーテーマ（ビジネスブルー / 活力オレンジ / 桜ピンク / 自然グリーン / ダーク） |
| **背景画像** | AI生成の建設現場テーマ背景 |

## 技術スタック

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 6
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **AI**: Google Gemini API (`@google/genai`)
- **State**: React Context + `useLocalStorage` カスタムフック
- **Fonts**: Poppins (見出し) + Open Sans (本文)

## アーキテクチャ

```
nihaokaoqing/
├── components/          # UI コンポーネント
│   ├── BottomNav.tsx    # ボトムナビゲーション
│   ├── ErrorBoundary.tsx # エラーバウンダリ
│   ├── Icons.tsx        # SVG アイコンライブラリ
│   ├── PaletteIcon.tsx  # テーマ選択アイコン
│   └── WelcomeScreen.tsx # ウェルカム画面
├── hooks/               # カスタムフック
│   ├── useLocalStorage.ts # localStorage 永続化
│   └── useTheme.tsx     # 5テーマ切替 (Context + Provider)
├── pages/               # 画面コンポーネント
│   ├── LoginPage.tsx    # ユーザー情報設定
│   ├── ManagementPage.tsx  # コントロールパネル
│   ├── AttendanceLogPage.tsx # 打刻カレンダー
│   ├── ExpenseManagementPage.tsx # 経費管理
│   ├── StatsPage.tsx    # データ分析
│   ├── AiPage.tsx       # AI アシスタント
│   └── SiteSettingsPage.tsx # 現場設定
├── services/
│   └── geminiService.ts # Gemini API 連携
├── utils/
│   └── helpers.ts       # 共通ユーティリティ関数
├── index.css            # グローバルスタイル + テーマCSS変数
├── index.tsx            # エントリポイント
├── App.tsx              # ルートコンポーネント
├── types.ts             # 型定義
├── tailwind.config.js   # Tailwind 設定
├── vite.config.ts       # Vite 設定
└── index.html           # HTML テンプレート
```

## ローカル実行

**前提条件:** Node.js

1. 依存関係のインストール:
   ```bash
   npm install
   ```
2. `.env` ファイルに `GEMINI_API_KEY` を設定
3. 開発サーバー起動:
   ```bash
   npm run dev
   ```

## ビルド

```bash
npm run build
```

## テーマシステム

5種類のカラーテーマを CSS カスタムプロパティで実装。`<html data-theme="xxx">` 属性で切替。

| テーマ | 識別子 | メインカラー |
|--------|--------|-------------|
| ビジネスブルー | `blue` | `#2563EB` |
| 活力オレンジ | `orange` | `#EA580C` |
| 桜ピンク | `sakura` | `#DB2777` |
| 自然グリーン | `nature` | `#16A34A` |
| ダーク | `dark` | `#60A5FA` |

## ライセンス

MIT
