# FinLit Empower

FinLit Empower is a React app that helps users manage their finances: an expenditure tracker, an investment advisor, and a financial literacy quiz — all backed by deterministic, rule-based financial analysis running as Vercel serverless functions (no ML model, no external AI calls).

## Features

- **Expenditure Tracker:** Enter monthly spending and get a 50/30/20 budget-rule breakdown with a donut chart and tailored tips.
- **Investment Advisor:** A weighted scoring algorithm (age, horizon, return expectations, stated preferences) produces a risk profile and a recommended asset allocation.
- **Financial Literacy Quiz:** A 10-question quiz scored against a fixed answer key, with feedback and tips by score band.

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Vercel serverless functions (`/api`), plain JavaScript algorithms in `api/_lib/finance.js`

## Local development

```bash
npm install
npm run dev        # frontend only, on Vite's dev server
# or, to also run the /api functions locally:
npx vercel dev
```

## Deploying

Import the repo at https://vercel.com/new — it's a zero-config Vite project with `/api` functions. No environment variables are required.
