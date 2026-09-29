import React, { useState } from 'react';
import { ArrowLeft, Mail, Send, CheckCircle2 } from 'lucide-react';

interface ForgotPasswordScreenProps {
  onBackToLogin: () => void;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  onBackToLogin,
}) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setMessage('');

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: cleanEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'We could not send the reset email.'
        );
      }

      setSent(true);
      setMessage(
        'Password reset email sent. Please check your email inbox.'
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <button
            type="button"
            onClick={onBackToLogin}
            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition mb-8"
          >
            <ArrowLeft size={18} />
            Back to Sign In
          </button>

          {!sent ? (
            <>
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                <Mail className="text-indigo-600" size={30} />
              </div>

              <h1 className="text-3xl font-bold text-slate-900 mb-3">
                Forgot Password?
              </h1>

              <p className="text-slate-600 mb-8">
                Enter the email address you used when creating your
                SmartShopper account. We'll send you a password reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {error && (
                  <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 rounded-xl transition"
                >
                  <Send size={18} />

                  {loading ? 'Sending...' : 'Send Reset Email'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2
                  className="text-green-600"
                  size={34}
                />
              </div>

              <h1 className="text-3xl font-bold text-slate-900 mb-3">
                Check Your Email
              </h1>

              <p className="text-slate-600 mb-4">
                {message}
              </p>

              <p className="text-sm text-slate-500 mb-8">
                Check your inbox and spam folder. The reset link will
                expire after 30 minutes.
              </p>

              <button
                type="button"
                onClick={onBackToLogin}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition"
              >
                Back to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;