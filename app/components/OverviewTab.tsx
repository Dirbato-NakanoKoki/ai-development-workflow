import { useState } from 'react';
import { Transaction, Category, MonthlyData } from '../types';
import { formatCurrency } from '../utils';

interface OverviewTabProps {
  transactions: Transaction[];
  categories: Category[];
  totalBalance: number;
  monthlyData: MonthlyData;
  selectedYear: number;
  selectedMonth: number;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export default function OverviewTab({
  totalBalance,
  monthlyData,
  selectedYear,
  selectedMonth,
  categories,
  onAddTransaction,
}: OverviewTabProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  const filteredCategories = categories.filter(c => c.type === type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    onAddTransaction({
      amount: parseFloat(amount),
      category,
      type,
      date,
      description: description || undefined,
    });

    setAmount('');
    setCategory('');
    setDescription('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm mb-1">資産残高</p>
            <p className={`text-3xl font-bold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalBalance)}
            </p>
          </div>
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {selectedYear}年{selectedMonth}月の収支
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-green-700 text-sm mb-1">収入</p>
            <p className="text-2xl font-bold text-green-700">{formatCurrency(monthlyData.income)}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-red-700 text-sm mb-1">支出</p>
            <p className="text-2xl font-bold text-red-700">{formatCurrency(monthlyData.expense)}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-gray-700">収支</p>
            <p className={`text-xl font-bold ${monthlyData.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {monthlyData.balance >= 0 ? '+' : ''}{formatCurrency(monthlyData.balance)}
            </p>
          </div>
        </div>
      </div>

      {/* Add Transaction Button */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full bg-blue-600 text-white rounded-lg py-4 font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新しい取引を追加
        </button>
      )}

      {/* Add Transaction Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">新しい取引</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">種類</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setType('income');
                    setCategory('');
                  }}
                  className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                    type === 'income'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  収入
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setType('expense');
                    setCategory('');
                  }}
                  className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                    type === 'expense'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  支出
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">金額</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">カテゴリ</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">選択してください</option>
                {filteredCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">日付</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">メモ (任意)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="説明を入力..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                追加
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                キャンセル
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
