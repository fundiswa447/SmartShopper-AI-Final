import React, { useState } from 'react';
import {
  Wallet,
  Sparkles,
  Plus,
  AlertTriangle,
  ArrowRight,
  Utensils,
  Bus,
  ShoppingBag,
  BookOpen,
  Laptop,
  Coffee,
  History,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Currency, ScreenId, ExpenseItem, BudgetPeriod } from '../types';
import { formatPrice } from '../data/mockData';

function getEasterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function getSouthAfricanPublicHolidays(year: number): Map<string, string> {
  const holidays = new Map<string, string>();
  const addHoliday = (date: Date, name: string) => {
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    holidays.set(key, [holidays.get(key), name].filter(Boolean).join(', '));
    if (date.getDay() === 0) {
      const observed = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
      const observedKey = `${observed.getFullYear()}-${String(observed.getMonth() + 1).padStart(2, '0')}-${String(observed.getDate()).padStart(2, '0')}`;
      holidays.set(observedKey, [holidays.get(observedKey), `${name} (observed)`].filter(Boolean).join(', '));
    }
  };

  [
    [1, 1, "New Year's Day"],
    [3, 21, 'Human Rights Day'],
    [4, 27, 'Freedom Day'],
    [5, 1, "Workers' Day"],
    [6, 16, 'Youth Day'],
    [8, 9, "National Women's Day"],
    [9, 24, 'Heritage Day'],
    [12, 16, 'Day of Reconciliation'],
    [12, 25, 'Christmas Day'],
    [12, 26, 'Day of Goodwill'],
  ].forEach(([month, day, name]) => addHoliday(new Date(year, Number(month) - 1, Number(day)), String(name)));

  const easterSunday = getEasterSunday(year);
  const goodFriday = new Date(year, easterSunday.getMonth(), easterSunday.getDate() - 2);
  const familyDay = new Date(year, easterSunday.getMonth(), easterSunday.getDate() + 1);
  addHoliday(goodFriday, 'Good Friday');
  addHoliday(familyDay, 'Family Day');

  return holidays;
}

interface DashboardScreenProps {
  currency: Currency;
  userName: string;
  totalBudgetZar: number;
  spentBudgetZar: number;
  remainingBudgetZar: number;
  expenses: ExpenseItem[];
  budgetPeriods: BudgetPeriod[];
  onOpenLogModal: () => void;
  onNavigate: (screen: ScreenId, query?: string) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  currency,
  userName,
  totalBudgetZar,
  spentBudgetZar,
  remainingBudgetZar,
  expenses,
  budgetPeriods,
  onOpenLogModal,
  onNavigate,
}) => {
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());

  const percentSpent =
    totalBudgetZar > 0
      ? Math.min(100, Math.round((spentBudgetZar / totalBudgetZar) * 100))
      : spentBudgetZar > 0 ? 100 : 0;

  const activePeriod =
    budgetPeriods.find((period) => period.status === 'active') || null;

  const previousPeriods = budgetPeriods
    .filter((period) => period.status === 'closed')
    .sort(
      (a, b) =>
        new Date(b.startDate).getTime() -
        new Date(a.startDate).getTime()
    );

  // Calculate spending from actual expenses so history stays accurate.
  const getPeriodSpent = (periodId: string) => {
    return expenses
      .filter((expense) => expense.budgetPeriodId === periodId)
      .reduce((total, expense) => total + expense.amountZar, 0);
  };

  const formatPeriodDate = (date: string) => {
    if (!date) return '—';

    return new Date(date).toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Category sums
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amountZar;
    return acc;
  }, {} as Record<string, number>);

  const monthBars = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(new Date().getFullYear(), new Date().getMonth() - 5 + index, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const total = expenses.reduce((sum, expense) => {
      const expenseDate = new Date(expense.date.length === 10 ? `${expense.date}T12:00:00` : expense.date);
      return expenseDate.getFullYear() === date.getFullYear() && expenseDate.getMonth() === date.getMonth()
        ? sum + expense.amountZar
        : sum;
    }, 0);
    return { key, label: date.toLocaleDateString('en-ZA', { month: 'short' }), total };
  });
  const maxMonthlySpend = Math.max(1, ...monthBars.map((month) => month.total));
  const firstDayOfMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
  const calendarDayOffset = (firstDayOfMonth.getDay() + 6) % 7;
  const daysInCalendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
  const dailySpending = expenses.reduce((totals, expense) => {
    const date = new Date(expense.date.length === 10 ? `${expense.date}T12:00:00` : expense.date);
    if (date.getFullYear() === calendarMonth.getFullYear() && date.getMonth() === calendarMonth.getMonth()) {
      const key = date.getDate();
      totals[key] = (totals[key] || 0) + expense.amountZar;
    }
    return totals;
  }, {} as Record<number, number>);
  const monthlyCalendarCells = [
    ...Array.from({ length: calendarDayOffset }, () => null),
    ...Array.from({ length: daysInCalendarMonth }, (_, index) => index + 1),
  ];
  const publicHolidays = getSouthAfricanPublicHolidays(calendarMonth.getFullYear());
  const salesDays = new Set<number>([
    5, 9, 15, 18, 22, 28,
  ].filter((day) => day <= daysInCalendarMonth));
  const savedBudgetDays = new Set<number>([
    2, 6, 11, 16, 20, 24, 30,
  ].filter((day) => day <= daysInCalendarMonth));

  const categoryConfigs: Record<
    string,
    { color: string; barBg: string }
  > = {
    Groceries: {
      color: 'text-emerald-700',
      barBg: 'bg-[#135d38]',
    },
    Transport: {
      color: 'text-blue-700',
      barBg: 'bg-blue-600',
    },
    Clothing: {
      color: 'text-amber-700',
      barBg: 'bg-amber-500',
    },
    Textbooks: {
      color: 'text-purple-700',
      barBg: 'bg-purple-600',
    },
    Tech: {
      color: 'text-indigo-700',
      barBg: 'bg-indigo-600',
    },
    Entertainment: {
      color: 'text-rose-700',
      barBg: 'bg-rose-500',
    },
    Dining: {
      color: 'text-orange-700',
      barBg: 'bg-orange-500',
    },
  };

  const getExpenseIcon = (type: ExpenseItem['iconType']) => {
    switch (type) {
      case 'dining':
        return <Utensils className="w-4 h-4 text-orange-600" />;
      case 'transit':
        return <Bus className="w-4 h-4 text-blue-600" />;
      case 'clothing':
        return <ShoppingBag className="w-4 h-4 text-amber-600" />;
      case 'book':
        return <BookOpen className="w-4 h-4 text-purple-600" />;
      case 'tech':
        return <Laptop className="w-4 h-4 text-indigo-600" />;
      default:
        return <Coffee className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Top Welcome & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Welcome back, {userName}
          </h1>

          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Here is your financial overview for your current budget period.
          </p>
        </div>

        <button
          onClick={onOpenLogModal}
          id="dashboard-log-expense-btn"
          className="bg-[#135d38] hover:bg-[#0f4d2e] text-white px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs hover:shadow-md cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Log Expense</span>
        </button>
      </div>

      {spentBudgetZar > totalBudgetZar && (
        <div role="alert" className="flex items-start gap-3 border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-700" />
          <p><strong>Budget exceeded.</strong> You have spent {formatPrice(spentBudgetZar - totalBudgetZar, currency)} over this period's budget. Review upcoming purchases before shopping.</p>
        </div>
      )}

      {/* Top 2 Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Available Budget Card */}
        <div className="lg:col-span-7 bg-white border border-gray-100 rounded-3xl p-7 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Available Budget
              </span>

              <div className="w-9 h-9 rounded-full bg-emerald-50 text-[#135d38] flex items-center justify-center">
                <Wallet className="w-4.5 h-4.5" />
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
                {formatPrice(remainingBudgetZar, currency)}
              </span>

              <span className="text-sm font-semibold text-gray-500">
                left
              </span>
            </div>

            <p className="text-xs text-gray-500 mb-6">
              Spent:{' '}
              <strong>{formatPrice(spentBudgetZar, currency)}</strong> / Total
              Budget: {formatPrice(totalBudgetZar, currency)}
            </p>

            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-6 flex">
              <div
                className="h-full bg-linear-to-r from-[#135d38] via-amber-500 to-red-500 rounded-full transition-all duration-500"
                style={{ width: `${percentSpent}%` }}
              />
            </div>
          </div>

          <div className="bg-[#fff9ea] border border-amber-200/70 rounded-2xl p-3.5 flex items-center gap-3 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />

            <p className="font-medium">
              You've used <strong>{percentSpent}%</strong> of your current
              budget.
            </p>
          </div>
        </div>

        {/* AI Insights Card */}
        <div className="lg:col-span-5 bg-linear-to-br from-[#f2f8f5] to-white border border-emerald-100 rounded-3xl p-7 shadow-xs flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fbf3d5] text-[#855302] text-xs font-semibold mb-4 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
              <span>AI Insights</span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
              SmartShopper can help you find lower-cost alternatives.
            </h3>

            <p className="text-xs text-gray-600 leading-relaxed mb-6">
              Compare products across stores and keep your shopping decisions
              aligned with your current budget.
            </p>
          </div>

          <div className="pt-4 border-t border-emerald-100/80 flex items-center justify-between">
            <span className="text-[11px] text-emerald-800 font-semibold">
              Compare student deals
            </span>

            <button
              onClick={() => onNavigate('search', 'textbooks')}
              className="px-4 py-2 bg-white hover:bg-emerald-50 border border-emerald-200 text-[#135d38] rounded-xl text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer flex items-center gap-1"
            >
              <span>Review Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Budget History */}
      <div className="bg-white border border-gray-100 rounded-3xl p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#135d38] flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900">
                Budget History
              </h3>

              <p className="text-xs text-gray-400 mt-0.5">
                Previous budgets and spending are preserved when you start a
                new budget.
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold text-gray-500">
            {previousPeriods.length} previous period
            {previousPeriods.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Current Period */}
        {activePeriod && (
          <div className="mt-5 p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />

                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                    Current Budget
                  </span>
                </div>

                <p className="text-[11px] text-gray-500">
                  Started {formatPeriodDate(activePeriod.startDate)}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-5 text-right">
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">
                    Budget
                  </p>
                  <p className="text-sm font-black text-gray-900">
                    {formatPrice(activePeriod.budgetZar, currency)}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">
                    Spent
                  </p>
                  <p className="text-sm font-black text-gray-900">
                    {formatPrice(spentBudgetZar, currency)}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">
                    Remaining
                  </p>
                  <p className="text-sm font-black text-emerald-700">
                    {formatPrice(remainingBudgetZar, currency)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Previous Periods */}
        {previousPeriods.length > 0 ? (
          <div className="mt-5 space-y-3">
            {previousPeriods.map((period) => {
              const periodSpent = getPeriodSpent(period.id);
              const periodRemaining = Math.max(
                0,
                period.budgetZar - periodSpent
              );

              const periodPercent =
                period.budgetZar > 0
                  ? Math.min(
                      100,
                      Math.round((periodSpent / period.budgetZar) * 100)
                    )
                  : 0;

              return (
                <div
                  key={period.id}
                  className="p-5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                        <CalendarDays className="w-4 h-4 text-gray-500" />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          Budget Period
                        </p>

                        <p className="text-[11px] text-gray-400 mt-1">
                          {formatPeriodDate(period.startDate)} —{' '}
                          {formatPeriodDate(
                            period.endDate || period.startDate
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 text-right">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">
                          Budget
                        </p>
                        <p className="text-xs sm:text-sm font-bold text-gray-900">
                          {formatPrice(period.budgetZar, currency)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">
                          Spent
                        </p>
                        <p className="text-xs sm:text-sm font-bold text-gray-900">
                          {formatPrice(periodSpent, currency)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">
                          Left
                        </p>
                        <p className="text-xs sm:text-sm font-bold text-emerald-700">
                          {formatPrice(periodRemaining, currency)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] text-gray-400 font-medium">
                        Spending
                      </span>

                      <span className="text-[10px] text-gray-400 font-semibold">
                        {periodPercent}%
                      </span>
                    </div>

                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gray-500 rounded-full"
                        style={{ width: `${periodPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-5 text-center py-8 rounded-2xl bg-gray-50 border border-dashed border-gray-200">
            <History className="w-7 h-7 text-gray-300 mx-auto mb-2" />

            <p className="text-sm font-semibold text-gray-500">
              No previous budget periods yet
            </p>

            <p className="text-xs text-gray-400 mt-1">
              When you create a new budget, your current budget will be saved
              here automatically.
            </p>
          </div>
        )}
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Monthly spending</h2>
              <p className="mt-1 text-xs text-gray-500">Six-month report from saved purchase records</p>
            </div>
            <span className="text-xs font-semibold text-gray-500">{formatPrice(monthBars.reduce((sum, month) => sum + month.total, 0), currency)} total</span>
          </div>
          <div className="mt-5 grid h-44 grid-cols-6 items-end gap-3" role="img" aria-label="Bar chart of monthly spending for the last six months">
            {monthBars.map((month) => (
              <div key={month.key} className="flex h-full flex-col items-center justify-end gap-2">
                <span className="text-center text-[10px] font-semibold text-gray-600">{formatPrice(month.total, currency)}</span>
                <div className="flex h-28 w-full items-end border-b border-gray-200">
                  <div className="w-full bg-emerald-700" style={{ height: `${month.total ? Math.max(4, (month.total / maxMonthlySpend) * 100) : 0}%` }} title={`${month.label}: ${formatPrice(month.total, currency)}`} />
                </div>
                <span className="text-xs text-gray-500">{month.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Spending calendar</h2>
              <p className="mt-1 text-xs text-gray-500">Select a month to review daily totals</p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setCalendarMonth((month) => new Date(month.getFullYear(), month.getMonth() - 1, 1))} aria-label="Previous month" className="border border-gray-200 p-2 hover:bg-gray-50"><ChevronLeft className="h-4 w-4" /></button>
              <span className="min-w-28 text-center text-xs font-bold text-gray-800">{calendarMonth.toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' })}</span>
              <button type="button" onClick={() => setCalendarMonth((month) => new Date(month.getFullYear(), month.getMonth() + 1, 1))} aria-label="Next month" className="border border-gray-200 p-2 hover:bg-gray-50"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-semibold text-gray-600">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-emerald-800"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Holiday</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-blue-800"><span className="h-2 w-2 rounded-full bg-blue-500" /> Sale window</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-amber-800"><span className="h-2 w-2 rounded-full bg-amber-500" /> Saved on budget</span>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-1 text-center">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => <span key={`${day}-${index}`} className="py-1 text-[10px] font-bold text-gray-400">{day}</span>)}
            {monthlyCalendarCells.map((day, index) => {
              const holidayKey = typeof day === 'number'
                ? `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                : '';
              const holidayName = publicHolidays.get(holidayKey);
              const isHoliday = Boolean(holidayName);
              const isSale = typeof day === 'number' && salesDays.has(day);
              const isSavedBudget = typeof day === 'number' && savedBudgetDays.has(day);
              const isSpendingDay = typeof day === 'number' && Boolean(dailySpending[day]);

              return (
                <div
                  key={day ?? `blank-${index}`}
                  className={`min-h-14 border p-1 ${
                    isHoliday ? 'border-emerald-300 bg-emerald-50' :
                    isSale ? 'border-blue-300 bg-blue-50' :
                    isSavedBudget ? 'border-amber-300 bg-amber-50' :
                    isSpendingDay ? 'border-amber-200 bg-amber-50' :
                    'border-gray-100'
                  }`}
                >
                  {day && <>
                    <span className="block text-[10px] font-semibold text-gray-600">{day}</span>
                    {holidayName && <span title={holidayName} className="mt-0.5 block truncate text-[8px] font-bold leading-tight text-emerald-700">{holidayName}</span>}
                    {isSale && <span className="mt-0.5 block text-[8px] font-bold text-blue-700">Sale</span>}
                    {isSavedBudget && <span className="mt-0.5 block text-[8px] font-bold text-amber-700">Saved</span>}
                    {dailySpending[day] && <span className="mt-0.5 block truncate text-[8px] font-bold text-emerald-800" title={formatPrice(dailySpending[day], currency)}>{formatPrice(dailySpending[day], currency)}</span>}
                  </>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom 2 Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Spending by Category */}
        <div className="lg:col-span-6 bg-white border border-gray-100 rounded-3xl p-7 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="text-base font-bold text-gray-900">
              Spending by Category
            </h3>

            <span className="text-xs text-gray-400 font-medium">
              {expenses.length} transactions
            </span>
          </div>

          {Object.keys(categoryTotals).length > 0 ? (
            <div className="space-y-4">
              {(Object.entries(categoryTotals) as [string, number][]).map(
                ([cat, total]) => {
                  const config = categoryConfigs[cat] || {
                    color: 'text-gray-700',
                    barBg: 'bg-gray-600',
                  };

                  const categoryPercent =
                    spentBudgetZar > 0
                      ? Math.min(
                          100,
                          Math.round((total / spentBudgetZar) * 100)
                        )
                      : 0;

                  return (
                    <div key={cat} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span
                          className={`font-semibold ${config.color}`}
                        >
                          {cat}
                        </span>

                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-[11px]">
                            {categoryPercent}%
                          </span>

                          <span className="font-bold text-gray-900">
                            {formatPrice(total, currency)}
                          </span>
                        </div>
                      </div>

                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${config.barBg} transition-all duration-500`}
                          style={{ width: `${categoryPercent}%` }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Wallet className="w-8 h-8 text-gray-300 mx-auto mb-2" />

              <p className="text-sm font-semibold text-gray-500">
                No expenses recorded yet
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Add your first expense to start tracking your spending.
              </p>
            </div>
          )}
        </div>

        {/* Recent Purchases */}
        <div className="lg:col-span-6 bg-white border border-gray-100 rounded-3xl p-7 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="text-base font-bold text-gray-900">
              Recent Purchases
            </h3>

            <button
              onClick={onOpenLogModal}
              className="text-xs font-semibold text-[#135d38] hover:underline cursor-pointer"
            >
              + Add Purchase
            </button>
          </div>

          {expenses.length > 0 ? (
            <div className="space-y-3.5">
              {expenses.slice(0, 5).map((exp) => (
                <div
                  key={exp.id}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shadow-2xs">
                      {getExpenseIcon(exp.iconType)}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-gray-900">
                        {exp.title}
                      </h4>

                      <p className="text-[11px] text-gray-400">
                        {exp.store ? `${exp.store} • ` : ''}
                        {exp.formattedDate}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-gray-900">
                    -{formatPrice(exp.amountZar, currency)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Coffee className="w-8 h-8 text-gray-300 mx-auto mb-2" />

              <p className="text-sm font-semibold text-gray-500">
                No purchases recorded yet
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Your logged purchases will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};