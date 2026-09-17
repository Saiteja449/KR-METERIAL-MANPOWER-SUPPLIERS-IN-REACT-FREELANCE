import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { AnimatedPage } from '../components/layout/AnimatedPage';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../lib/api';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [pendingAppId, setPendingAppId] = useState<string | null>(null);
  const [notRegistered, setNotRegistered] = useState(false);

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPendingAppId(null);
    setNotRegistered(false);

    if (!email.trim() || !password.trim()) {
      toast.error('Please enter your email address and password.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.login({
        email: email.toLowerCase().trim(),
        password: password.trim(),
      });

      if (res.success && res.token && res.user) {
        login(res.token, res.user);
        toast.success(`Welcome back, ${res.user.name}!`);

        if (res.user.role === 'ADMIN') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          // If candidate payment is pending
          if (
            res.user.application?.status === 'PAYMENT_PENDING' ||
            res.user.application?.paymentStatus === 'PENDING'
          ) {
            navigate(`/payment/${res.user.applicationId || ''}`, { replace: true });
          } else {
            navigate(from === '/login' ? '/dashboard' : from, { replace: true });
          }
        }
      }
    } catch (err: any) {
      if (err.data?.paymentPending && err.data?.applicationId) {
        setPendingAppId(err.data.applicationId);
        toast.warning(err.message, 'Payment Pending');
      } else if (err.data?.notRegistered) {
        setNotRegistered(true);
        toast.error(err.message, 'Account Not Found');
      } else {
        toast.error(err.message || 'Invalid email or password. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatedPage className="bg-slate-light min-h-screen pt-32 pb-24 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6">
        {/* Brand Card */}
        <div className="bg-white rounded-sm shadow-xl border-t-4 border-amber overflow-hidden">
          {/* Header */}
          <div className="bg-navy p-8 text-center text-white">
            <div className="w-12 h-12 rounded-full bg-amber/20 text-amber flex items-center justify-center mx-auto mb-3">
              <ShieldCheck size={28} />
            </div>
            <h1 className="text-2xl font-heading font-extrabold text-white tracking-tight">
              Candidate Portal Login
            </h1>
            <p className="text-xs text-gray-300 mt-1">
              Sign in using the credentials received via email
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Payment Pending Alert Banner */}
            {pendingAppId && (
              <div className="p-4 bg-amber/15 border-2 border-amber/50 rounded-sm text-navy text-xs space-y-2">
                <div className="flex items-center gap-2 font-heading font-bold text-amber-900">
                  <ShieldCheck size={16} className="text-amber-600" />
                  <span>Application Found — Payment Pending</span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Your application [<strong>{pendingAppId}</strong>] has been registered, but payment of ₹1,000 is still pending verification. Complete payment to receive your login password.
                </p>
                <Link
                  to={`/payment/${pendingAppId}`}
                  className="inline-flex items-center gap-1.5 bg-amber hover:bg-amber-light text-navy font-bold px-3.5 py-2 rounded-xs text-xs transition-colors shadow-xs"
                >
                  <span>Go to Payment Screen</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            )}

            {/* Not Registered Alert Banner */}
            {notRegistered && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-sm text-xs space-y-2">
                <p className="text-rose-800 font-semibold">
                  No registered application or account found with this email.
                </p>
                <Link
                  to="/apply"
                  className="inline-flex items-center gap-1.5 bg-navy text-white hover:bg-navy-light font-bold px-3.5 py-2 rounded-xs text-xs transition-colors"
                >
                  <span>Apply & Register Profile Now</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            )}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
                Registered Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-sm border border-gray-300 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber text-sm text-navy"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-sm border border-gray-300 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber text-sm text-navy"
                />
              </div>
              <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-1.5">
                <HelpCircle size={12} />
                <span>Temporary password sent via email after payment verification.</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber-light text-navy font-bold py-3.5 px-6 rounded-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  <span>Login to Candidate Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Card Footer */}
          <div className="p-6 bg-slate-50 border-t border-gray-100 text-center space-y-3">
            <p className="text-xs text-gray-600">
              New Applicant?{' '}
              <Link to="/apply" className="font-bold text-navy hover:text-amber transition-colors">
                Apply & Register here &rarr;
              </Link>
            </p>
            <div>
              <Link
                to="/admin/login"
                className="text-[11px] font-semibold text-gray-400 hover:text-navy transition-colors inline-flex items-center gap-1"
              >
                <span>Staff / Admin Management Login</span>
                <ArrowRight size={10} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
