import React from 'react';
import { X, Bell, TrendingDown, AlertTriangle, Sparkles, Check, Trash2 } from 'lucide-react';
import { Currency, ScreenId } from '../types';
import { formatPrice } from '../data/mockData';

export interface AppNotification {
  id: string;
  type: 'price_drop' | 'budget_warning' | 'deal_match';
  title: string;
  message: string;
  timeAgo: string;
  read: boolean;
  savingsZar?: number;
  targetScreen?: ScreenId;
}

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onClearAll: () => void;
  onNavigate: (screen: ScreenId) => void;
  currency: Currency;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onClearAll,
  onNavigate,
  currency,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-2xs transition-opacity"
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-gray-100 flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#135d38] flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-base text-gray-900">Student Price & Budget Alerts</h3>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between text-xs pb-2">
              <span className="text-gray-400 font-medium">
                {notifications.filter((n) => !n.read).length} Unread Alerts
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={onMarkAllRead}
                  className="text-xs text-[#135d38] hover:underline font-semibold"
                >
                  Mark all read
                </button>
                <button
                  onClick={onClearAll}
                  className="text-xs text-gray-400 hover:text-red-600 transition-colors"
                >
                  Clear all
                </button>
              </div>
            </div>

            {notifications.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#135d38] mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-gray-900">You're all caught up!</h4>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">
                  Click 'Track' on any grocery item, sneaker, or jacket to get alerted when prices drop in South African stores.
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    if (notif.targetScreen) {
                      onNavigate(notif.targetScreen);
                      onClose();
                    }
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                    !notif.read
                      ? 'bg-emerald-50/40 border-emerald-200/80 shadow-2xs'
                      : 'bg-white border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {notif.type === 'price_drop' && (
                        <span className="p-1 rounded-md bg-emerald-100 text-[#135d38]">
                          <TrendingDown className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {notif.type === 'budget_warning' && (
                        <span className="p-1 rounded-md bg-amber-100 text-amber-800">
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {notif.type === 'deal_match' && (
                        <span className="p-1 rounded-md bg-blue-100 text-blue-800">
                          <Sparkles className="w-3.5 h-3.5" />
                        </span>
                      )}
                      <h4 className="font-bold text-xs text-gray-900">{notif.title}</h4>
                    </div>
                    <span className="text-[10px] text-gray-400 shrink-0">{notif.timeAgo}</span>
                  </div>

                  <p className="text-xs text-gray-600 pl-7">{notif.message}</p>

                  {notif.savingsZar && (
                    <div className="pl-7 pt-1">
                      <span className="inline-block text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                        Potential Student Savings: {formatPrice(notif.savingsZar, currency)}
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-400">
            Powered by SmartShopper Gemini Agent
          </div>
        </div>
      </div>
    </div>
  );
};
