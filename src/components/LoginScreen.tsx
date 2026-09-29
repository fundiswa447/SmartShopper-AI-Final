import React, { useEffect, useState } from 'react';
import {
ArrowLeft,
ArrowRight,
Bot,
CheckCircle2,
Eye,
EyeOff,
LockKeyhole,
Mail,
MapPin,
ShoppingBag,
ShoppingCart,
Sparkles,
Tag,
TrendingDown,
Wallet,
} from 'lucide-react';

interface LoginScreenProps {
onLogin: (name: string) => void;
onCreateAccount: () => void;
onForgotPassword: () => void;
}

interface SavedAccount {
name: string;
email: string;
password: string;
}

const slides = [
{
title: 'Shop smarter, not harder.',
label: 'SMART SHOPPING',
description:
'Compare products, discover affordable options and make smarter shopping decisions.',
icon: ShoppingCart,
points: ['Compare prices', 'Find affordable products', 'Make informed choices'],
},
{
title: 'Stay in control of your budget.',
label: 'BUDGET CONTROL',
description:
'Keep track of your spending and see how much money you have left for the month.',
icon: Wallet,
points: ['Track expenses', 'Monitor your budget', 'Plan your spending'],
},
{
title: 'Discover better deals.',
label: 'DEALS & PRICES',
description:
'Find useful deals and price drops that can help students spend less.',
icon: Tag,
points: ['Student deals', 'Price drops', 'Potential savings'],
},
{
title: 'Find stores around you.',
label: 'STORE DISCOVERY',
description:
'Discover stores and shopping options around your area.',
icon: MapPin,
points: ['Nearby stores', 'Store discovery', 'Shopping options'],
},
{
title: 'Your AI shopping assistant.',
label: 'AI ASSISTANT',
description:
'Ask questions, compare options and get help making shopping decisions.',
icon: Bot,
points: ['Ask questions', 'Compare products', 'Get shopping guidance'],
},
];

export function LoginScreen({
onLogin,
onCreateAccount,
onForgotPassword,
}: LoginScreenProps) {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

const [showPassword, setShowPassword] = useState(false);
const [rememberMe, setRememberMe] = useState(true);
const [error, setError] = useState('');

const [currentSlide, setCurrentSlide] = useState(0);
const [isPaused, setIsPaused] = useState(false);

const slide = slides[currentSlide];
const SlideIcon = slide.icon;

useEffect(() => {
if (isPaused) return;

const timer = window.setInterval(() => {
  setCurrentSlide((previous) => (previous + 1) % slides.length);
}, 5000);

return () => window.clearInterval(timer);

}, [isPaused]);

const goToPreviousSlide = () => {
setCurrentSlide(
(previous) => (previous - 1 + slides.length) % slides.length
);
};

const goToNextSlide = () => {
setCurrentSlide((previous) => (previous + 1) % slides.length);
};

const handleSubmit = (event: React.FormEvent) => {
event.preventDefault();
setError('');

const cleanEmail = email.trim().toLowerCase();

if (!cleanEmail || !password) {
  setError('Please enter your email and password.');
  return;
}

const accounts: SavedAccount[] = JSON.parse(
  localStorage.getItem('smartshopper_accounts') || '[]'
);

const account = accounts.find(
  (savedAccount) =>
    savedAccount.email.toLowerCase() === cleanEmail
);

if (!account) {
  setError(
    'No account was found with this email. Please create an account first.'
  );
  return;
}

if (account.password !== password) {
  setError('Incorrect password. Please try again.');
  return;
}

localStorage.setItem('smartshopper_current_email', account.email);

if (rememberMe) {
  localStorage.setItem('smartshopper_remember_me', 'true');
} else {
  localStorage.removeItem('smartshopper_remember_me');
}

onLogin(account.name);

};

return (
<div className="min-h-screen bg-[#f4f8f6] flex">
{/* LEFT SIDE */}
<div
className="hidden lg:flex lg:w-[55%] p-10 relative overflow-hidden"
onMouseEnter={() => setIsPaused(true)}
onMouseLeave={() => setIsPaused(false)}
>
<div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-teal-800 to-slate-950" />

    <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-emerald-300/15 blur-3xl" />
    <div className="absolute -bottom-40 -left-32 w-[30rem] h-[30rem] rounded-full bg-amber-300/15 blur-3xl" />

    <div className="relative z-10 w-full flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-amber-300 text-amber-950 flex items-center justify-center shadow-lg shadow-emerald-950/30">
          <ShoppingBag size={25} />
        </div>

        <div>
          <div className="text-xl font-bold text-white">
            SmartShopper
          </div>
          <div className="text-xs text-emerald-100/70">
            AI-powered student shopping
          </div>
        </div>
      </div>

      {/* Main slide */}
      <div className="flex-1 flex items-center">
        <div className="w-full max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-300 text-amber-950 text-xs font-black tracking-wider mb-6">
            <Sparkles size={14} />
            {slide.label}
          </div>

          <div className="flex items-start gap-6">
            <div className="w-20 h-20 shrink-0 rounded-3xl bg-emerald-300 text-emerald-950 flex items-center justify-center shadow-xl shadow-emerald-950/30">
              <SlideIcon size={38} />
            </div>

            <div>
              <h1 className="text-5xl xl:text-6xl font-bold text-white leading-tight">
                {slide.title}
              </h1>

              <p className="text-lg text-white/75 leading-relaxed mt-5 max-w-xl">
                {slide.description}
              </p>
            </div>
          </div>

          {/* Feature points */}
          <div className="grid grid-cols-3 gap-3 mt-10 max-w-xl">
            {slide.points.map((point) => (
              <div
                key={point}
                className="rounded-2xl bg-white/10 border border-emerald-100/20 px-4 py-4 backdrop-blur-sm"
              >
                <CheckCircle2
                  size={18}
                  className="text-white mb-2"
                />

                <div className="text-sm font-medium text-white">
                  {point}
                </div>
              </div>
            ))}
          </div>

          {/* Decorative shopping cards */}
          <div className="grid grid-cols-3 gap-4 mt-8 max-w-xl">
            <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
              <ShoppingCart size={20} />
              <div className="text-xs text-white/60 mt-3">
                Shopping
              </div>
              <div className="font-semibold mt-1">Compare</div>
            </div>

            <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
              <TrendingDown size={20} />
              <div className="text-xs text-white/60 mt-3">
                Prices
              </div>
              <div className="font-semibold mt-1">Save</div>
            </div>

            <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
              <Wallet size={20} />
              <div className="text-xs text-white/60 mt-3">
                Budget
              </div>
              <div className="font-semibold mt-1">Control</div>
            </div>
          </div>
        </div>
      </div>

      {/* Slideshow controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide
                  ? 'w-8 bg-amber-300'
                  : 'w-2 bg-white/35 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={goToPreviousSlide}
            className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 transition"
            aria-label="Previous slide"
          >
            <ArrowLeft size={18} />
          </button>

          <button
            type="button"
            onClick={goToNextSlide}
            className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 transition"
            aria-label="Next slide"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  </div>

  {/* RIGHT SIDE */}
  <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-[#f8fbf9]">
    <div className="w-full max-w-md">
      {/* Mobile logo */}
      <div className="lg:hidden flex items-center gap-3 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-100">
          <ShoppingBag size={25} />
        </div>

        <div>
          <div className="text-xl font-bold text-gray-900">
            SmartShopper
          </div>

          <div className="text-xs text-gray-500">
            AI-powered student shopping
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-emerald-700 text-xs font-black uppercase tracking-wider mb-3">
          <LockKeyhole size={16} />
          Secure sign in
        </div>

        <h2 className="text-3xl font-bold text-gray-900">
          Welcome back
        </h2>

        <p className="text-gray-500 mt-2">
          Sign in to continue shopping smarter.
        </p>

      </div>

      {error && (
        <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email address
          </label>

          <div className="relative">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full pl-11 pr-4 py-3.5 border border-gray-200 bg-white rounded-2xl outline-none shadow-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>

          <div className="relative">
            <LockKeyhole
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="w-full pl-11 pr-12 py-3.5 border border-gray-200 bg-white rounded-2xl outline-none shadow-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              aria-label={
                showPassword ? 'Hide password' : 'Show password'
              }
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Remember + forgot */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) =>
                setRememberMe(event.target.checked)
              }
              className="w-4 h-4 accent-emerald-700"
            />
            Remember me
          </label>

          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Forgot password?
          </button>
        </div>

        {/* Sign in */}
        <button
          type="submit"
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3.5 rounded-2xl transition shadow-lg shadow-emerald-100"
        >
          Sign In
        </button>
      </form>

      {/* Create account */}
      <div className="relative my-7">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>

        <div className="relative flex justify-center">
          <span className="bg-[#f8fbf9] px-4 text-xs text-gray-400">
            NEW TO SMARTSHOPPER?
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onCreateAccount}
        className="w-full border-2 border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50 text-gray-800 font-semibold py-3.5 rounded-2xl transition"
      >
        Create an Account
      </button>

      <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-7">
        <LockKeyhole size={13} />
        Your account information stays on this device.
      </div>
    </div>
  </div>
</div>

);
}