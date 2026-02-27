import './globals.css';
import MainLayout from '@/components/MainLayout';
import { TransactionProvider } from '@/context/TransactionContext';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'FinanceFlow - Personal Finance Dashboard',
  description: 'Manage your income, expenses, and savings with FinanceFlow.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <TransactionProvider>
            <MainLayout>
              {children}
            </MainLayout>
          </TransactionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
