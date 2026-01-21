import { useState } from 'react';
import { Transaction, Category } from '../types';
import { formatCurrency, formatDate } from '../utils';

interface HistoryTabProps {
  transactions: Transaction[];
  categories: Category[];
  selectedYear: number;
  selectedMonth: number;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  onEditTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => void;
  onDeleteTransaction: (id: string) => void;
}

export default function HistoryTab({
  transactions,
  categories,
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange,
  onEditTransaction,
  onDeleteTransaction,
}: HistoryTabProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Omit<Transaction, 'id'> | null>(null);

  const filteredTransactions = transactions
    .filter(t => {
      const date = new Date(t.date);
      return date.getFullYear() === selectedYear && date.getMonth() === selectedMonth - 1;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const years = Array.from(new Set(transactions.map(t => new Date(t.date).getFullYear()))).sort((a, b) => b - a);
  if (years.length === 0 || !years.includes(selectedYear)) {
    years.unshift(selectedYear);
  }

  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || categoryId;
  };

  const getCategoryColor = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.color || '#6b7280';
  };

  const handleStartEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditForm({
      amount: transaction.amount,
      category: transaction.category,
      type: transaction.type,
      date: transaction.date,
      description: transaction.description,
    });
  };

  const handleSaveEdit = () => {
    if (editingId && editForm) {
      onEditTransaction(editingId, editForm);
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const filteredCategories = editForm ? categories.filter(c => c.type === editForm.type) : [];

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

      {/* Transactions List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">取引履歴</h2>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            この期間の取引はありません
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredTransactions.map(transaction => (
              <div key={transaction.id} className="p-6">
                {editingId === transaction.id && editForm ? (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditForm({ ...editForm, type: 'income', category: '' })}
                        className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                          editForm.type === 'income'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        収入
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditForm({ ...editForm, type: 'expense', category: '' })}
                        className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                          editForm.type === 'expense'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        支出
                      </button>
                    </div>

                    <input
                      type="number"
                      value={editForm.amount}
                      onChange={(e) => setEditForm({ ...editForm, amount: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />

                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">選択してください</option>
                      {filteredCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>

                    <input
                      type="date"
                      value={editForm.date}
                      onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />

                    <input
                      type="text"
                      value={editForm.description || ''}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      placeholder="メモ"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEdit}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                      >
                        保存
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                      >
                        キャンセル
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white"
                          style={{ backgroundColor: getCategoryColor(transaction.category) }}
                        >
                          {getCategoryName(transaction.category)}
                        </span>
                        <span className="text-sm text-gray-600">{formatDate(transaction.date)}</span>
                      </div>
                      {transaction.description && (
                        <p className="text-gray-700 mb-2">{transaction.description}</p>
                      )}
                      <p className={`text-2xl font-bold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStartEdit(transaction)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="編集"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('この取引を削除しますか?')) {
                            onDeleteTransaction(transaction.id);
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="削除"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
