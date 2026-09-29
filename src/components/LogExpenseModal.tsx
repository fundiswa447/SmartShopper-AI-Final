import React, { useState } from 'react';
import { X, Plus, DollarSign, ShoppingBag, Utensils, Bus, BookOpen, Laptop, Coffee } from 'lucide-react';
import { Currency, ExpenseItem } from '../types';

interface LogExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  onAddExpense: (expense: ExpenseItem) => void;
}

export const LogExpenseModal: React.FC<LogExpenseModalProps> = ({
  isOpen,
  onClose,
  currency,
  onAddExpense,
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseItem['category']>('Groceries');
  const [store, setStore] = useState('Checkers');

  if (!isOpen) return null;

  const categories: ExpenseItem['category'][] = [
    'Groceries',
    'Transport',
    'Clothing',
    'Textbooks',
    'Tech',
    'Dining',
    'Entertainment',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount || Number(amount) <= 0) return;

    let iconType: ExpenseItem['iconType'] = 'grocery';
    if (category === 'Transport') iconType = 'transit';
    else if (category === 'Clothing') iconType = 'clothing';
    else if (category === 'Textbooks') iconType = 'book';
    else if (category === 'Tech') iconType = 'tech';
    else if (category === 'Dining') iconType = 'dining';

    const now = new Date();
    const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const newExpense: ExpenseItem = {
      id: `exp-${Date.now()}`,
      title: title.trim(),
      category,
      amountZar: currency === 'USD' ? Number(amount) * 18.2 : Number(amount),
      date: localDate,
      formattedDate: `${now.toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' })}, ${now.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}`,
      iconType,
      store: store || undefined,
    };

    onAddExpense(newExpense);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-xl border border-gray-100 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-lg font-bold text-gray-900">Log Student Expense</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">Description / Item Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Checkers groceries, bus pass, textbook"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:bg-white focus:border-[#135d38] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">
              Amount ({currency === 'ZAR' ? 'Rands (ZAR)' : 'USD ($)'})
            </label>
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus-within:bg-white focus-within:border-[#135d38]">
              <span className="text-gray-400 text-xs font-bold mr-2">
                {currency === 'ZAR' ? 'R' : '$'}
              </span>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-transparent text-xs text-gray-900 focus:outline-hidden font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:bg-white focus:border-[#135d38] focus:outline-hidden cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Store / Vendor</label>
              <input
                type="text"
                placeholder="e.g. Checkers, Campus PnP"
                value={store}
                onChange={(e) => setStore(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:bg-white focus:border-[#135d38] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#135d38] hover:bg-[#0f4d2e] text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Record Expense</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
