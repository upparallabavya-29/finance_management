import { useEffect, useState } from 'react'
import { budgetService } from '../services/api'

const Budgets = () => {
    const [budgets, setBudgets] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                const res = await budgetService.getBudgets()
                setBudgets(res.data.data)
            } catch (error) {
                console.error('Error fetching budgets:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchBudgets()
    }, [])

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Budgets</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {budgets.map(budget => (
                        <div key={budget.id} className="bg-white shadow rounded-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">{budget.category}</h3>
                                <span className="text-sm text-gray-500 capitalize">{budget.period}</span>
                            </div>
                            <div className="relative pt-1">
                                <div className="flex mb-2 items-center justify-between">
                                    <div>
                                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                            {Math.round((budget.spent_amount / budget.limit_amount) * 100)}% Used
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-semibold inline-block text-blue-600">
                                            ${budget.spent_amount} / ${budget.limit_amount}
                                        </span>
                                    </div>
                                </div>
                                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                                    <div style={{ width: `${Math.min(100, (budget.spent_amount / budget.limit_amount) * 100)}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Budgets
