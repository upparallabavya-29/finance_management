-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Categories table (income/expense)
CREATE TYPE category_type AS ENUM ('income', 'expense');

CREATE TABLE public.categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    type category_type NOT NULL,
    icon TEXT,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Transactions table
CREATE TABLE public.transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    amount DECIMAL(12, 2) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    type category_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Budgets table
CREATE TABLE public.budgets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Savings Goals table
CREATE TABLE public.savings_goals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    target_amount DECIMAL(12, 2) NOT NULL,
    current_amount DECIMAL(12, 2) DEFAULT 0.00 NOT NULL,
    target_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Debts table
CREATE TABLE public.debts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    remaining_amount DECIMAL(12, 2) NOT NULL,
    interest_rate DECIMAL(5, 2),
    minimum_payment DECIMAL(12, 2),
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Investments table
CREATE TABLE public.investments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    symbol TEXT,
    quantity DECIMAL(12, 4),
    purchase_price DECIMAL(12, 2),
    current_value DECIMAL(12, 2) NOT NULL,
    type TEXT, -- e.g., 'Stock', 'Crypto', 'Real Estate'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Savings Goals table
CREATE TABLE public.savings_goals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    target_amount DECIMAL(12, 2) NOT NULL,
    current_amount DECIMAL(12, 2) DEFAULT 0.00 NOT NULL,
    target_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS) policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;

-- Creating policies for public.users
CREATE POLICY "Users can view their own profile."
    ON public.users FOR SELECT
    USING ( auth.uid() = id );

CREATE POLICY "Users can update their own profile."
    ON public.users FOR UPDATE
    USING ( auth.uid() = id );

-- Creating policies for public.categories
CREATE POLICY "Users can view their own categories."
    ON public.categories FOR SELECT
    USING ( auth.uid() = user_id );

CREATE POLICY "Users can insert their own categories."
    ON public.categories FOR INSERT
    WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update their own categories."
    ON public.categories FOR UPDATE
    USING ( auth.uid() = user_id );

CREATE POLICY "Users can delete their own categories."
    ON public.categories FOR DELETE
    USING ( auth.uid() = user_id );

-- Creating policies for public.transactions
CREATE POLICY "Users can view their own transactions."
    ON public.transactions FOR SELECT
    USING ( auth.uid() = user_id );

CREATE POLICY "Users can insert their own transactions."
    ON public.transactions FOR INSERT
    WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update their own transactions."
    ON public.transactions FOR UPDATE
    USING ( auth.uid() = user_id );

CREATE POLICY "Users can delete their own transactions."
    ON public.transactions FOR DELETE
    USING ( auth.uid() = user_id );

-- Creating policies for public.budgets
CREATE POLICY "Users can view their own budgets."
    ON public.budgets FOR SELECT
    USING ( auth.uid() = user_id );

CREATE POLICY "Users can insert their own budgets."
    ON public.budgets FOR INSERT
    WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update their own budgets."
    ON public.budgets FOR UPDATE
    USING ( auth.uid() = user_id );

CREATE POLICY "Users can delete their own budgets."
    ON public.budgets FOR DELETE
    USING ( auth.uid() = user_id );

-- Creating policies for public.savings_goals
CREATE POLICY "Users can view their own savings goals."
    ON public.savings_goals FOR SELECT
    USING ( auth.uid() = user_id );

CREATE POLICY "Users can insert their own savings goals."
    ON public.savings_goals FOR INSERT
    WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update their own savings goals."
    ON public.savings_goals FOR UPDATE
    USING ( auth.uid() = user_id );

CREATE POLICY "Users can delete their own savings goals."
    ON public.savings_goals FOR DELETE
    USING ( auth.uid() = user_id );

-- Creating policies for public.debts
CREATE POLICY "Users can view their own debts."
    ON public.debts FOR SELECT
    USING ( auth.uid() = user_id );

CREATE POLICY "Users can insert their own debts."
    ON public.debts FOR INSERT
    WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update their own debts."
    ON public.debts FOR UPDATE
    USING ( auth.uid() = user_id );

CREATE POLICY "Users can delete their own debts."
    ON public.debts FOR DELETE
    USING ( auth.uid() = user_id );

-- Creating policies for public.investments
CREATE POLICY "Users can view their own investments."
    ON public.investments FOR SELECT
    USING ( auth.uid() = user_id );

CREATE POLICY "Users can insert their own investments."
    ON public.investments FOR INSERT
    WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update their own investments."
    ON public.investments FOR UPDATE
    USING ( auth.uid() = user_id );

CREATE POLICY "Users can delete their own investments."
    ON public.investments FOR DELETE
    USING ( auth.uid() = user_id );

-- Function to handle new user signup and create a public.users record
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function after a user is created in auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
