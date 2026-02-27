import { useEffect, useState } from 'react'
import { transactionService, budgetService, goalService } from '../services/api'

const Dashboard = () => {
    const [stats, setStats] = useState({ transactions: [], budgets: [], goals: [] })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [txRes, bgRes, glRes] = await Promise.all([
                    transactionService.getTransactions(),
                    budgetService.getBudgets(),
                    goalService.getGoals()
                ])
                setStats({
                    transactions: txRes.data.data,
                    budgets: bgRes.data.data,
                    goals: glRes.data.data
                })
            } catch (error) {
                console.error('Error fetching dashboard data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) return <div>Loading dashboard...</div>

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="Total Transactions" value={stats.transactions.length} />
                <Card title="Active Budgets" value={stats.budgets.length} />
                <Card title="Financial Goals" value={stats.goals.length} />
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
                <ul className="divide-y divide-gray-200">
                    {stats.transactions.slice(0, 5).map(tx => (
                        <li key={tx.id} className="py-4 flex justify-between">
                            <span>{tx.description}</span>
                            <span className={tx.type === 'expense' ? 'text-red-500' : 'text-green-500'}>
                                {tx.type === 'expense' ? '-' : '+'}${tx.amount}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

const Card = ({ title, value }) => (
    <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-sm font-medium text-gray-500 truncate">{title}</h3>
        <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
    </div>
)

export default Dashboard
