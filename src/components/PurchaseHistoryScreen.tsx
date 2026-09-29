import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Check, PartyPopper, Plus, ReceiptText, Repeat2 } from 'lucide-react';
import type { Currency, ExpenseItem, SavedShoppingList, SavedShoppingListItem } from '../types';
import { formatPrice } from '../data/mockData';

interface PurchaseHistoryScreenProps {
  expenses: ExpenseItem[];
  currency: Currency;
  remainingBudgetZar: number;
  savedShoppingLists: SavedShoppingList[];
  onAddToShoppingList: (title: string) => void;
  onRepeatShoppingList: (list: SavedShoppingList) => void;
  onUpdateSavedShoppingList: (listId: string, items: SavedShoppingListItem[]) => void;
}

export function PurchaseHistoryScreen({
  expenses,
  currency,
  remainingBudgetZar,
  savedShoppingLists,
  onAddToShoppingList,
  onRepeatShoppingList,
  onUpdateSavedShoppingList,
}: PurchaseHistoryScreenProps) {
  const [celebrationListId, setCelebrationListId] = useState<string | null>(null);

  useEffect(() => {
    if (!celebrationListId) return;
    const timeoutId = window.setTimeout(() => setCelebrationListId(null), 2200);
    return () => window.clearTimeout(timeoutId);
  }, [celebrationListId]);
  const months = useMemo(() => {
    const groups = new Map<string, ExpenseItem[]>();
    expenses.forEach((expense) => {
      const date = new Date(expense.date.length === 10 ? `${expense.date}T12:00:00` : expense.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      groups.set(key, [...(groups.get(key) || []), expense]);
    });
    return Array.from(groups.entries())
      .sort(([first], [second]) => second.localeCompare(first))
      .map(([key, purchases]) => ({
        key,
        title: new Date(`${key}-01T12:00:00`).toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' }),
        purchases: purchases.sort((first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()),
        total: purchases.reduce((sum, purchase) => sum + purchase.amountZar, 0),
      }));
  }, [expenses]);

  const toggleSavedListItem = (listId: string, itemId: string) => {
    const targetList = savedShoppingLists.find((list) => list.id === listId);
    if (!targetList) return;

    const nextItems = targetList.items.map((item) => item.id === itemId ? { ...item, checked: !item.checked } : item);
    onUpdateSavedShoppingList(listId, nextItems);

    if (nextItems.length > 0 && nextItems.every((item) => item.checked)) {
      setCelebrationListId(listId);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-7 px-6 py-8">
      <header className="flex items-end justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-800"><ReceiptText className="h-4 w-4" /> Account records</p>
          <h1 className="mt-2 text-3xl font-black text-gray-900">Purchase history</h1>
          <p className="mt-1 text-sm text-gray-500">Expenses, saved receipts, and repeatable shopping lists.</p>
        </div>
        <span className="text-sm font-semibold text-gray-500">{expenses.length} records</span>
      </header>

      <section className="rounded-3xl border border-emerald-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-800">Saved shopping to-do list</p>
            <h2 className="mt-1 text-xl font-black text-gray-900">Completed receipts ready to repeat</h2>
          </div>
          <span className="text-xs font-semibold text-gray-500">{savedShoppingLists.length} saved list{savedShoppingLists.length === 1 ? '' : 's'}</span>
        </div>

        {savedShoppingLists.length ? (
          <div className="mt-4 space-y-4">
            {savedShoppingLists.map((list) => {
              const allChecked = list.items.length > 0 && list.items.every((item) => item.checked);
              return (
                <article key={list.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">{list.title}</h3>
                      <p className="mt-1 text-[11px] text-gray-500">{new Date(list.savedAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => onRepeatShoppingList(list)} className="inline-flex items-center gap-1.5 border border-emerald-800 px-3 py-2 text-[11px] font-bold text-emerald-900 hover:bg-emerald-50">
                        <Repeat2 className="h-3.5 w-3.5" /> Repeat list
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2">
                    {list.items.map((item) => (
                      <label key={item.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-transparent bg-white px-3 py-2 hover:border-emerald-200">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => toggleSavedListItem(list.id, item.id)}
                          className="h-4 w-4 accent-emerald-700"
                        />
                        <span className={item.checked ? 'text-sm text-gray-400 line-through' : 'text-sm text-gray-800'}>
                          {item.quantity > 1 ? `${item.quantity} × ${item.name}` : item.name}
                        </span>
                      </label>
                    ))}
                  </div>

                  {allChecked && (
                    <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-900">
                      <Check className="h-4 w-4" /> Yay, you saved! {formatPrice(remainingBudgetZar, currency)} left in your budget.
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center">
            <ReceiptText className="mx-auto h-7 w-7 text-gray-300" />
            <h3 className="mt-3 text-base font-bold text-gray-700">No saved receipts yet</h3>
            <p className="mt-1 text-sm text-gray-500">Your saved trip receipts will appear here as a checklist you can repeat later.</p>
          </div>
        )}
      </section>

      {celebrationListId && (
        <div className="fixed inset-x-0 top-8 z-50 flex justify-center px-4">
          <div role="status" aria-live="polite" className="flex items-center gap-3 rounded-2xl border border-emerald-300 bg-emerald-700 px-5 py-3 text-sm font-black text-white shadow-2xl">
            <PartyPopper className="h-5 w-5" />
            <span>Yay, you saved! <span className="block text-xs font-semibold text-emerald-100">{formatPrice(remainingBudgetZar, currency)} left in your budget</span></span>
          </div>
        </div>
      )}

      {months.length ? months.map((month) => (
        <section key={month.key} className="border border-gray-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
            <h2 className="flex items-center gap-2 text-base font-bold text-gray-900"><CalendarDays className="h-4 w-4 text-emerald-700" />{month.title}</h2>
            <p className="text-sm font-bold text-gray-800">Monthly spend: {formatPrice(month.total, currency)}</p>
          </div>
          <div className="divide-y divide-gray-100">
            {month.purchases.map((purchase) => {
              const date = new Date(purchase.date.length === 10 ? `${purchase.date}T12:00:00` : purchase.date);
              return (
                <article key={purchase.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-gray-900">{purchase.title}</h3>
                    <p className="mt-1 text-xs text-gray-500">
                      {date.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
                      {purchase.store ? ` · ${purchase.store}` : ''} · {purchase.category}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <span className="text-sm font-bold text-gray-900">{formatPrice(purchase.amountZar, currency)}</span>
                    {purchase.category !== 'Transport' && (
                      <button type="button" onClick={() => onAddToShoppingList(purchase.title)} title="Add this purchase to your shopping list" className="inline-flex items-center gap-1.5 border border-gray-200 px-3 py-2 text-xs font-semibold text-emerald-900 hover:bg-emerald-50">
                        <Plus className="h-3.5 w-3.5" /> Add again
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )) : (
        <div className="border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <ReceiptText className="mx-auto h-8 w-8 text-gray-300" />
          <h2 className="mt-3 text-base font-bold text-gray-800">No purchases yet</h2>
          <p className="mt-1 text-sm text-gray-500">Completed shopping trips and logged expenses will appear here by month.</p>
        </div>
      )}
    </div>
  );
}
