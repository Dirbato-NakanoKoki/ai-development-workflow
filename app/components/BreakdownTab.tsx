import { Transaction, Category } from '../types';
import { getCategoryBreakdown, formatCurrency } from '../utils';
import PieChart from './PieChart';

interface BreakdownTabProps {
  transactions: Transaction[];
  categories: Category[];
  selectedYear: number;
  selectedMonth: number;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
}

export default function BreakdownTab({
  transactions,
  categories,
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange,
}: BreakdownTabProps) {
  const years = Array.from(new Set(transactions.map(t => new Date(t.date).getFullYear()))).sort((a, b) => b - a);
  if (years.length === 0 || !years.includes(selectedYear)) {
    years.unshift(selectedYear);
  }

  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const incomeBreakdown = getCategoryBreakdown(transactions, categories, selectedYear, selectedMonth, 'income');
  const expenseBreakdown = getCategoryBreakdown(transactions, categories, selectedYear, selectedMonth, 'expense');

  const totalIncome = incomeBreakdown.reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = expenseBreakdown.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6">
      {/* Month Selector */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">期間選択</h2>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">年</label>
            <select
              value={selectedYear}
              onChange={(e) => onYearChange(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}年</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">月</label>
            <select
              value={selectedMonth}
              onChange={(e) => onMonthChange(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {months.map(month => (
                <option key={month} value={month}>{month}月</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900">
        {selectedYear}年{selectedMonth}月のカテゴリ別内訳
      </h2>

      {/* Income Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-6">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <h3 className="text-xl font-bold text-gray-900">収入カテゴリ</h3>
          <span className="ml-auto text-xl font-bold text-green-600">{formatCurrency(totalIncome)}</span>
        </div>

        {incomeBreakdown.length === 0 ? (
          <p className="text-center text-gray-500 py-8">今月の収入がまだ記録されていません</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center justify-center">
              <PieChart data={incomeBreakdown} />
            </div>
            <div className="space-y-3">
              {incomeBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="font-medium text-gray-900">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatCurrency(item.amount)}</p>
                    <p className="text-sm text-gray-600">{item.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Expense Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-6">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
          </svg>
          <h3 className="text-xl font-bold text-gray-900">支出カテゴリ</h3>
          <span className="ml-auto text-xl font-bold text-red-600">{formatCurrency(totalExpense)}</span>
        </div>

        {expenseBreakdown.length === 0 ? (
          <p className="text-center text-gray-500 py-8">今月の支出がまだ記録されていません</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center justify-center">
              <PieChart data={expenseBreakdown} />
            </div>
            <div className="space-y-3">
              {expenseBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="font-medium text-gray-900">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatCurrency(item.amount)}</p>
                    <p className="text-sm text-gray-600">{item.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
