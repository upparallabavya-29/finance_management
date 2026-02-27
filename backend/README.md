# Personal Finance Backend

This is the backend for the Personal Finance Dashboard, built with Node.js, Express, and Supabase.

## Tech Stack
- **Node.js**
- **Express.js**
- **Supabase** (Database)
- **Cors** (Middleware)
- **Morgan** (Logging)
- **Dotenv** (Environment Variables)

## Database Schema
- **users**: id (UUID), email, created_at
- **transactions**: id (UUID), user_id, amount, category, date, description, type
- **budgets**: id (UUID), user_id, category, limit_amount, spent_amount, period
- **goals**: id (UUID), user_id, name, target_amount, current_amount, deadline

## API Documentation
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create a new transaction
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create a new budget
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create a new goal

## Installation Steps
1. Navigate to the `backend` directory.
2. Run `npm install`.
3. Create a `.env` file with `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
4. Run `npm run dev` to start the development server.

## Deployment Link
[Backend on Render](https://render.com) (Placeholder)
