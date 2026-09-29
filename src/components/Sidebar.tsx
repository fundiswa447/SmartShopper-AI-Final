import React from 'react';
import { Home, LayoutGrid, ListChecks, Bot, Search, ShoppingBag, User, Sparkles, LogOut, ReceiptText } from 'lucide-react';
import { ScreenId } from '../types';

interface SidebarProps {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  onLogout?: () => void;
  showProTip?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onSelectScreen,
  onLogout,
  showProTip = false,
}) => {
  const navItems = [
    { id: 'home' as ScreenId, label: 'Home', icon: Home },
    { id: 'dashboard' as ScreenId, label: 'Dashboard', icon: LayoutGrid },
    { id: 'shoppinglist' as ScreenId, label: 'Shopping List', icon: ListChecks },
    { id: 'assistant' as ScreenId, label: 'Assistant', icon: Bot },
    { id: 'search' as ScreenId, label: 'Search', icon: Search },
    { id: 'pricewatch' as ScreenId, label: 'Price Watch', icon: ShoppingBag },
    { id: 'history' as ScreenId, label: 'Purchase History', icon: ReceiptText },
    { id: 'profile' as ScreenId, label: 'Profile', icon: User },
  ];

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-gray-100 flex flex-col justify-between p-5 min-h-screen">
      <div>
        {/* Brand Logo Header */}
        <button
          onClick={() => onSelectScreen('home')}
          className="flex items-center gap-3 mb-8 text-left w-full group cursor-pointer focus:outline-hidden"
          id="sidebar-logo-button"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800 shadow-xs group-hover:scale-105 transition-transform">
            <svg
              className="w-5 h-5 text-[#135d38]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-900 leading-tight tracking-tight flex items-center gap-1.5">
              SmartShopper
            </h1>
            <p className="text-xs text-gray-500 font-medium">Student Budgeting AI</p>
          </div>
        </button>

        {/* Navigation Menu */}
        <nav className="space-y-1.5" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => onSelectScreen(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#135d38] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon
                  className={`w-4.5 h-4.5 transition-colors ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                  }`}
                  strokeWidth={isActive ? 2.3 : 2}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="w-full mt-3 flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            id="sidebar-logout-btn"
          >
            <LogOut className="w-4.5 h-4.5 text-red-500" />
            <span>Log out</span>
          </button>
        )}
      </div>

      {/* Pro Tip card for Search & Price Watch screen or bottom container */}
      <div className="pt-6">
        {showProTip && (
          <div className="bg-emerald-50/70 border border-emerald-100/80 rounded-xl p-3.5 text-xs text-emerald-950 mb-4 shadow-xs">
            <div className="flex items-center gap-1.5 font-semibold text-[#135d38] mb-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pro Tip</span>
            </div>
            <p className="text-gray-600 text-[11px] leading-relaxed">
              Set a price alert on items above your budget to get notified when they drop across Checkers, Pick n Pay & Superbalist.
            </p>
          </div>
        )}

        <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-xs text-gray-400">
          <span className="text-[11px]">South Africa Retail</span>
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Catalogue Prices
          </span>
        </div>
      </div>
    </aside>
  );
};
