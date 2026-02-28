# Architecture & Deployment Guidelines

## 1. System Architecture
The Personal Finance Dashboard is a decoupled full-stack application.
- **Frontend App**: A React SPA built with Vite and Tailwind CSS. State is managed via React Context and data is fetched dynamically using Axios.
- **Backend API**: A Node.js/Express server implementing the Model-View-Controller (MVC) pattern.
- **Database**: Supabase serves as a unified BaaS, handling PostgreSQL data storage, UUID generation, and Row Level Security (RLS).

## 2. ER Diagram Explanation

The relational database strictly normalizes user data. 
- **`users` Table**: The central entity. All other tables rely on a `user_id` Foreign Key cascading back here.
- **`categories` Table**: Links back to `users` (1:N relationship). Defines custom tagging for the transactions.
- **`transactions`, `budgets`, `savings_goals`, `debts`, `investments`**: All link back to `users` via `user_id` (1:N relationship). 
- *Foreign Keys* dictate that if a User is deleted, their cascading financial data is erased instantly to prevent orphaned rows (`ON DELETE CASCADE`).

## 3. Integration Steps (How they talk to each other)
1. The Frontend authenticates the user via Supabase, receiving a JWT session token.
2. The Frontend stores this JWT in local storage/Context API.
3. Upon requesting data, Axios attaches the JWT as a Bearer Token in the headers: `Authorization: Bearer <token>`.
4. The Express Backend `authMiddleware` intersects the request, parses the token, and validates it against Supabase Auth.
5. If valid, the Route Controller triggers a Supabase DB query (inheriting the user's RLS policies autonomously) and returns the JSON payload back to the React UI.

## 4. Production Best Practices
- **Security Check:** RLS policies are hard-coded into the SQL schema. Data leakage is mathematically impossible at the database layer even if a controller fails.
- **Environment Variables**: Never commit `.env` files to GitHub. Supply `SUPABASE_URL` and `SUPABASE_ANON_KEY` as encrypted secrets in the deployment platform (Render/Netlify).
- **Scalability**: By utilizing UUIDs rather than auto-incrementing integers, data shards cleanly across distributed database instances.

## 5. Dual Deployment Guide
**Netlify (Frontend):**
1. Connect Netlify to the frontend repository.
2. Build Settings -> Command: `npm run build`, Publish directory: `dist`.
3. In Advanced Build Settings, add variables for any `VITE_` prefixed backend URLs.

**Render (Backend):**
1. Connect Render to the backend repository.
2. Environment -> Node.
3. Build Command: `npm install`, Start Command: `npm start`.
4. Configure standard environment variables (`PORT`, `SUPABASE_URL`, etc).
