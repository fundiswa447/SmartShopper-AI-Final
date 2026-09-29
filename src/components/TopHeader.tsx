import React from 'react';
import { Search, Bell, Wallet, ArrowRight, LogIn } from 'lucide-react';
import { Currency, ScreenId } from '../types';
import { formatPrice } from '../data/mockData';

interface TopHeaderProps {
  currentScreen: ScreenId;
  currency: Currency;
  remainingBudgetZar: number;
  onCurrencyToggle: (c: Currency) => void;
  onOpenNotifications: () => void;
  onSelectScreen: (s: ScreenId) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: (q: string) => void;
  notificationCount: number;
  userName: string;
  isAuthenticated?: boolean;
  onSignIn?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentScreen,
  currency,
  remainingBudgetZar,
  onCurrencyToggle,
  onOpenNotifications,
  onSelectScreen,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  notificationCount,
  userName,
  isAuthenticated = true,
  onSignIn,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery);
    }
  };

  return (
    <header className="h-18 px-8 border-b border-gray-100 bg-white flex items-center justify-between sticky top-0 z-30">
      {/* Left title / Breadcrumb */}
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
          {currentScreen === 'home' && 'SmartShopper AI'}
          {currentScreen === 'dashboard' && 'Financial Overview'}
          {currentScreen === 'shoppinglist' && 'Shopping List'}
          {currentScreen === 'assistant' && 'AI Shopping Assistant'}
          {currentScreen === 'search' && 'Explore Student Deals'}
          {currentScreen === 'pricewatch' && 'Grocery Price Watch'}
          {currentScreen === 'profile' && 'Student Profile & Budget'}
        </h2>
      </div>

      {/* Middle Global Search */}
      <form
        onSubmit={handleSubmit}
        className="hidden md:flex items-center relative w-96 max-w-md"
      >
        <div className="absolute left-3.5 text-gray-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          id="global-search-input"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={
            currentScreen === 'pricewatch'
              ? 'Search specific grocery items...'
              : 'Search deals across Checkers, PnP, Woolies, Takealot...'
          }
          className="w-full bg-[#f3f6f8] text-gray-800 placeholder-gray-400 text-xs py-2.5 pl-10 pr-10 rounded-full border border-transparent focus:border-emerald-500 focus:bg-white focus:outline-hidden transition-all shadow-2xs"
        />
        {searchQuery.trim() && (
          <button
            type="submit"
            className="absolute right-2 p-1.5 rounded-full bg-[#135d38] text-white hover:bg-emerald-800 transition-colors cursor-pointer"
            id="global-search-submit-btn"
          >
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </form>

      {!isAuthenticated && onSignIn && (
        <button
          type="button"
          onClick={onSignIn}
          className="hidden md:inline-flex items-center gap-2 bg-[#135d38] hover:bg-[#0f4d2e] text-white px-4 py-2.5 rounded-full text-xs font-bold transition-colors cursor-pointer"
          id="header-sign-in-btn"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Sign In</span>
        </button>
      )}

      {/* Right Actions: Currency Toggle, Budget Badge, Notification Bell, User Avatar */}
      <div className="flex items-center gap-3.5">
        {/* Currency Switcher */}
        <div className="flex items-center bg-gray-100 p-0.5 rounded-full text-xs font-semibold">
          <button
            type="button"
            onClick={() => onCurrencyToggle('ZAR')}
            className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
              currency === 'ZAR'
                ? 'bg-[#135d38] text-white shadow-2xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="South African Rand (ZAR)"
          >
            ZAR (R)
          </button>
          <button
            type="button"
            onClick={() => onCurrencyToggle('USD')}
            className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
              currency === 'USD'
                ? 'bg-[#135d38] text-white shadow-2xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="US Dollar (USD)"
          >
            USD ($)
          </button>
        </div>

        {/* Budget Badge */}
        <button
          onClick={() => onSelectScreen('dashboard')}
          className="flex items-center gap-2 bg-[#eaf6ef] text-[#135d38] px-3.5 py-1.5 rounded-full text-xs font-semibold hover:bg-emerald-100/80 transition-colors cursor-pointer border border-emerald-200/50"
          id="header-budget-badge"
          title="Click to view monthly budget breakdown"
        >
          <Wallet className="w-3.5 h-3.5 text-[#135d38]" />
          <span>
            Budget: <strong className="font-bold">{formatPrice(remainingBudgetZar, currency)}</strong> left
          </span>
        </button>

        {/* Notification Bell with Badge */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          id="header-notifications-btn"
          aria-label="Open notifications"
        >
          <Bell className="w-4.5 h-4.5" />
          {notificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          )}
        </button>

        {/* User Profile Avatar */}
        <button
          onClick={() => onSelectScreen('profile')}
          className="flex items-center gap-2 pl-1 group cursor-pointer focus:outline-hidden"
          id="header-user-avatar-btn"
          title="View profile settings"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden border border-emerald-300 ring-2 ring-emerald-50">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80"
              alt={userName}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
            />
          </div>
        </button>
      </div>
    </header>
  );
};
