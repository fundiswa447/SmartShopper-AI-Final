import React, { useEffect, useState } from 'react';
import {
ArrowLeft,
ArrowRight,
Bot,
Eye,
EyeOff,
LockKeyhole,
Mail,
ShieldCheck,
ShoppingBag,
ShoppingCart,
Tag,
User,
Wallet,
} from 'lucide-react';

const signupSlides = [
  {
    label: 'SMART SHOPPING',
    title: 'Spend with confidence.',
    description: 'Compare prices, discover affordable options, and make every student rand work harder.',
    icon: ShoppingCart,
    accent: 'bg-emerald-300 text-emerald-950',
  },
  {
    label: 'BUDGET CONTROL',
    title: 'Make your budget feel simple.',
    description: 'Track spending and see what is left before your next campus shop.',
    icon: Wallet,
    accent: 'bg-amber-300 text-amber-950',
  },
  {
    label: 'DEALS & PRICES',
    title: 'Catch the better deal.',
    description: 'Find useful price drops across South African stores without the guesswork.',
    icon: Tag,
    accent: 'bg-rose-300 text-rose-950',
  },
  {
    label: 'AI ASSISTANT',
    title: 'A smarter way to shop.',
    description: 'Ask for help, compare options, and get practical recommendations in seconds.',
    icon: Bot,
    accent: 'bg-cyan-300 text-cyan-950',
  },
];

interface CreateAccountScreenProps {
onAccountCreated: (name: string, email: string, password: string) => void;
onBackToLogin: () => void;
}

export function CreateAccountScreen({
onAccountCreated,
onBackToLogin,
}: CreateAccountScreenProps) {
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');

const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [error, setError] = useState('');
const [currentSlide, setCurrentSlide] = useState(0);

useEffect(() => {
  const timer = window.setInterval(() => {
    setCurrentSlide((previous) => (previous + 1) % signupSlides.length);
  }, 5000);

  return () => window.clearInterval(timer);
}, []);

const slide = signupSlides[currentSlide];
const SlideIcon = slide.icon;

const handleSubmit = (event: React.FormEvent) => {
event.preventDefault();
setError('');

const cleanName = name.trim();
const cleanEmail = email.trim().toLowerCase();

if (!cleanName || !cleanEmail || !password || !confirmPassword) {
  setError('Please complete all fields.');
  return;
}

if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
  setError('Please enter a valid email address.');
  return;
}

if (password.length < 6) {
  setError('Password must be at least 6 characters.');
  return;
}

if (password !== confirmPassword) {
  setError('Passwords do not match.');
  return;
}

const accounts = JSON.parse(
  localStorage.getItem('smartshopper_accounts') || '[]'
);

const accountExists = accounts.some(
  (account: { email: string }) =>
    account.email.toLowerCase() === cleanEmail
);

if (accountExists) {
  setError('An account with this email already exists.');
  return;
}

onAccountCreated(cleanName, cleanEmail, password);

};

return (
<div className="min-h-screen bg-[#f4f8f6] flex">
{/* Left panel */}
<div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-950 via-teal-800 to-slate-950 text-white p-12 relative overflow-hidden">
<div className="absolute -top-28 -right-20 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl" />
<div className="absolute -bottom-32 -left-20 w-96 h-96 bg-amber-300/15 rounded-full blur-3xl" />

    <div className="relative z-10 flex flex-col justify-between w-full">
      <div>
        <div className="flex items-center gap-3 mb-12">
          <div className="w-11 h-11 rounded-xl bg-emerald-300 text-emerald-950 flex items-center justify-center shadow-lg shadow-emerald-950/30">
            <ShoppingBag size={24} />
          </div>

          <div>
            <div className="text-xl font-bold">SmartShopper</div>
            <div className="text-xs text-emerald-100/70">
              AI-powered student shopping
            </div>
          </div>
        </div>

        <div className="max-w-lg">
          <div className="inline-flex items-center gap-2 bg-amber-300 text-amber-950 px-3 py-2 rounded-full text-xs font-bold mb-6 shadow-lg shadow-amber-950/20">
            <ShieldCheck size={16} />
            BUILT FOR SMARTER SHOPPING
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl ${slide.accent}`}>
              <SlideIcon size={28} />
            </div>
            <span className="text-xs font-black tracking-[0.2em] text-emerald-200">{slide.label}</span>
          </div>

          <h1 className="text-5xl font-black leading-tight mb-5 max-w-xl">
            {slide.title}
          </h1>

          <p className="text-lg text-emerald-50/80 leading-relaxed max-w-lg min-h-20">
            {slide.description}
          </p>
        </div>
      </div>

      <div className="flex items-end justify-between max-w-lg border-t border-emerald-100/20 pt-6">
        <div className="flex items-center gap-2">
          {signupSlides.map((item, index) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setCurrentSlide(index)}
              aria-label={`Show ${item.label.toLowerCase()} slide`}
              className={`h-2 rounded-full transition-all ${index === currentSlide ? 'w-10 bg-amber-300' : 'w-2 bg-white/40 hover:bg-white/70'}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentSlide((currentSlide - 1 + signupSlides.length) % signupSlides.length)}
            className="w-9 h-9 rounded-full border border-white/20 bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Previous slide"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => setCurrentSlide((currentSlide + 1) % signupSlides.length)}
            className="w-9 h-9 rounded-full bg-amber-300 text-amber-950 flex items-center justify-center hover:bg-amber-200 transition-colors"
            aria-label="Next slide"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  </div>

  {/* Right panel */}
  <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-[#f8fbf9]">
    <div className="w-full max-w-md">
      <button
        type="button"
        onClick={onBackToLogin}
        className="flex items-center gap-2 text-gray-500 hover:text-emerald-800 text-sm mb-8 transition-colors"
      >
        <ArrowLeft size={17} />
        Back to login
      </button>

      <div className="mb-8">
        <div className="lg:hidden flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-100">
            <ShoppingBag size={24} />
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

        <div className="inline-flex items-center gap-2 text-emerald-700 text-xs font-black uppercase tracking-wider mb-3">
          <User size={15} />
          Create your profile
        </div>

        <h2 className="text-3xl font-bold text-gray-900">
          Create your account
        </h2>

        <p className="text-gray-500 mt-2">
          Join SmartShopper and take control of your shopping.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full name
          </label>

          <div className="relative">
            <User
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your full name"
              className="w-full pl-11 pr-4 py-3.5 border border-gray-200 bg-white rounded-2xl outline-none shadow-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

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
              placeholder="At least 6 characters"
              className="w-full pl-11 pr-12 py-3.5 border border-gray-200 bg-white rounded-2xl outline-none shadow-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Confirm password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm password
          </label>

          <div className="relative">
            <LockKeyhole
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              placeholder="Enter your password again"
              className="w-full pl-11 pr-12 py-3.5 border border-gray-200 bg-white rounded-2xl outline-none shadow-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3.5 rounded-2xl transition shadow-lg shadow-emerald-100"
        >
          Create Account
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-7">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onBackToLogin}
          className="font-semibold text-emerald-700 hover:text-emerald-800"
        >
          Sign in
        </button>
      </p>
    </div>
  </div>
</div>

);
}