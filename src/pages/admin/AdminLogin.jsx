import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShieldCheck, Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../lib/api';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error('Please enter admin email and password.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.login({
        email: email.toLowerCase().trim(),
        password: password.trim(),
      });

      if (res.success && res.token && res.user) {
        if (res.user.role !== 'ADMIN') {
          toast.error('Access denied. Administrator privileges required.');
          return;
        }

        login(res.token, res.user);
        toast.success(`Welcome to Admin Management Portal, ${res.user.name}!`);
        navigate('/admin/dashboard', { replace: true });
      }
    } catch (err) {
      toast.error(err.message || 'Authentication failed. Please verify admin credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decal */}
      <div className="absolute inset-0 bg-radial from-navy to-navy-dark opacity-80"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-navy border border-navy-light rounded-sm shadow-2xl overflow-hidden">
          {/* Top Banner */}
          <div className="p-8 text-center border-b border-navy-light bg-navy-dark/70">
            <img
              src="/assets/images/KRLOGO.jpeg"
              alt="KR Logo"
              className="h-12 w-auto mx-auto mb-4 rounded-sm border border-amber/30"
            />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber/15 text-amber text-[11px] font-bold uppercase tracking-wider mb-2">
              <ShieldCheck size={14} />
              <span>Administrative Portal</span>
            </div>
            <h1 className="text-xl font-heading font-bold text-white">
              KR Material & Manpower
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Secure Staff & Management System Access
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                Admin Email <span className="text-amber">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                <input
                  type="email"
                  required
                  placeholder="admin@kr1.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-sm bg-navy-dark border border-navy-light focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber text-sm text-white font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                Admin Password <span className="text-amber">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-sm bg-navy-dark border border-navy-light focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber text-sm text-white font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber-light text-navy font-bold py-3.5 px-6 rounded-sm transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Authorization...</span>
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  <span>Authenticate & Enter Portal</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="p-4 bg-navy-dark/90 border-t border-navy-light text-center">
            <Link
              to="/"
              className="text-xs text-gray-400 hover:text-amber inline-flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft size={12} />
              <span>Back to Public Website</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
