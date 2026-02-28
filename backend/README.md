# Personal Finance Dashboard - Backend

## Overview
This is the Node.js and Express RESTful API backend for the Personal Finance Dashboard. It follows the MVC architecture pattern to serve data securely to the frontend client from the Supabase PostgreSQL database.

## Tech Stack
- Node.js & Express.js (MVC)
- Supabase (PostgreSQL Database & Auth)
- JSON Web Tokens (JWT) for route protection
- CORS & dotenv for configuration

## API Documentation
The API provides several CRUD endpoints protected by JWT validation middleware:
- `GET /api/transactions` - Fetch all transactions
- `GET /api/budgets` - Fetch active budgets
- `GET /api/debts` - Fetch debts and loans
- `GET /api/investments` - Fetch robust portfolio details

*Note: You must pass a Bearer token in the `Authorization` header to access protected routes.*

## Database Schema
The database is fully normalized in Supabase utilizing Row Level Security (RLS) to ensure tenant privacy. Tables include:
- `users`, `categories`, `transactions`, `budgets`, `savings_goals`, `debts`, `investments`.

## Installation Steps
1. Clone this repository (or navigate to the backend folder).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file referencing your Supabase instance:
   ```env
   PORT=5000
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment Guide
This Node.js backend is designed to be deployed to Render.
1. Push your code to GitHub.
2. Link your repository to Render as a "Web Service".
3. Set your Build Command to `npm install`.
4. Set your Start Command to `npm start`.
5. Populate the Render Environment Variables tab with your `.env` contents.
