import { Transaction, Category, CategoryBreakdown, MonthlyData } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'salary', name: '給与', type: 'income', color: '#10b981' },
  { id: 'bonus', name: 'ボーナス', type: 'income', color: '#34d399' },
  { id: 'other-income', name: 'その他収入', type: 'income', color: '#6ee7b7' },
  { id: 'food', name: '食費', type: 'expense', color: '#ef4444' },
  { id: 'medical', name: '医療費', type: 'expense', color: '#f87171' },
  { id: 'transportation', name: '交通費', type: 'expense', color: '#fb923c' },
  { id: 'utilities', name: '光熱費', type: 'expense', color: '#fbbf24' },
  { id: 'entertainment', name: '娯楽費', type: 'expense', color: '#a78bfa' },
  { id: 'shopping', name: '買い物', type: 'expense', color: '#ec4899' },
  { id: 'other-expense', name: 'その他支出', type: 'expense', color: '#f472b6' },
];

export const loadTransactions = (): Transaction[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('transactions');
  return stored ? JSON.parse(stored) : [];
};

export const saveTransactions = (transactions: Transaction[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('transactions', JSON.stringify(transactions));
};

export const loadCategories = (): Category[] => {
  if (typeof window === 'undefined') return DEFAULT_CATEGORIES;
  const stored = localStorage.getItem('categories');
  return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES;
};

export const saveCategories = (categories: Category[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('categories', JSON.stringify(categories));
};

export const getMonthlyData = (transactions: Transaction[], year: number, month: number): MonthlyData => {
  const filtered = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getFullYear() === year && date.getMonth() === month - 1;
  });

  const income = filtered
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = filtered
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    income,
    expense,
    balance: income - expense,
  };
};

export const getCategoryBreakdown = (
  transactions: Transaction[],
  categories: Category[],
  year: number,
  month: number,
  type: 'income' | 'expense'
): CategoryBreakdown[] => {
  const filtered = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getFullYear() === year && date.getMonth() === month - 1 && t.type === type;
  });

  const categoryTotals = new Map<string, number>();
  filtered.forEach(t => {
    const current = categoryTotals.get(t.category) || 0;
    categoryTotals.set(t.category, current + t.amount);
  });

  const total = Array.from(categoryTotals.values()).reduce((sum, amount) => sum + amount, 0);

  return Array.from(categoryTotals.entries())
    .map(([categoryId, amount]) => {
      const category = categories.find(c => c.id === categoryId);
      return {
        category: category?.name || categoryId,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
        color: category?.color || '#6b7280',
      };
    })
    .sort((a, b) => b.amount - a.amount);
};

export const formatCurrency = (amount: number): string => {
  return `¥${amount.toLocaleString('ja-JP')}`;
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
};

export const getCurrentYearMonth = (): { year: number; month: number } => {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  };
};
