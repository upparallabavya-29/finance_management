DO $$ 
DECLARE
  v_user_id UUID := 'REPLACE_WITH_USER_UUID'; 
  v_income_cat_id UUID;
  v_expense_cat_id UUID;
BEGIN
    
    IF EXISTS (SELECT 1 FROM public.users WHERE id = v_user_id) THEN

        INSERT INTO public.categories (user_id, name, type, icon, color) VALUES 
        (v_user_id, 'Salary', 'income', 'briefcase', '#10b981') RETURNING id INTO v_income_cat_id;
        
        INSERT INTO public.categories (user_id, name, type, icon, color) VALUES 
        (v_user_id, 'Groceries', 'expense', 'shopping-cart', '#ef4444') RETURNING id INTO v_expense_cat_id;

        INSERT INTO public.transactions (user_id, category_id, amount, date, description, type) VALUES
        (v_user_id, v_income_cat_id, 5000.00, '2023-10-01', 'October Salary', 'income'),
        (v_user_id, v_expense_cat_id, 150.50, '2023-10-05', 'Weekly Groceries', 'expense'),
        (v_user_id, v_expense_cat_id, 85.00, '2023-10-12', 'Farmers Market', 'expense');
      
        INSERT INTO public.budgets (user_id, category_id, amount, start_date, end_date) VALUES
        (v_user_id, v_expense_cat_id, 600.00, '2023-10-01', '2023-10-31');
        
        INSERT INTO public.savings_goals (user_id, name, target_amount, current_amount, target_date) VALUES
        (v_user_id, 'Emergency Fund', 10000.00, 2500.00, '2024-12-31');

      
        INSERT INTO public.debts (user_id, name, total_amount, remaining_amount, interest_rate, minimum_payment, due_date) VALUES
        (v_user_id, 'Student Loan', 25000.00, 18000.00, 5.5, 300.00, '2023-11-15');

        INSERT INTO public.investments (user_id, name, symbol, quantity, purchase_price, current_value, type) VALUES
        (v_user_id, 'S&P 500 ETF', 'VOO', 10.5, 350.00, 410.25, 'Stock');
        
    END IF;
END $$;
