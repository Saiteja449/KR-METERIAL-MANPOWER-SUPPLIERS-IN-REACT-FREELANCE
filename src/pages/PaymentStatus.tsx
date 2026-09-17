import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Clock,
  Mail,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Home,
  CreditCard,
} from 'lucide-react';
import { AnimatedPage } from '../components/layout/AnimatedPage';
import { api } from '../lib/api';
import { StatusBadge } from '../components/ui/StatusBadge';

export function PaymentStatus() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const [loading, setLoading] = useState(true);
  const [appData, setAppData] = useState<any>(null);

  const fetchStatus = async () => {
    if (!applicationId) return;
    try {
      setLoading(true);
      const res = await api.getPublicApplication(applicationId);
      if (res.success && res.application) {
        setAppData(res.application);
      }
    } catch (err) {
      console.error('Error loading payment status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [applicationId]);

  const isVerified =
    appData?.status === 'PAYMENT_RECEIVED' ||
    appData?.status === 'APPLICATION_PENDING' ||
    appData?.status === 'CONFIRMED';

  return (
    <AnimatedPage className="bg-slate-light min-h-screen pt-28 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-sm shadow-xl border-t-4 border-amber p-8 sm:p-12 text-center">
          {/* Top Icon */}
          <div className="w-16 h-16 bg-amber/10 text-amber rounded-full flex items-center justify-center mx-auto mb-6">
            {isVerified ? (
              <CheckCircle2 size={36} className="text-emerald-500" />
            ) : (
              <Clock size={36} className="text-amber animate-pulse" />
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-navy mb-2">
            {isVerified ? 'Payment Verified Successfully!' : 'Transaction Submitted for Verification'}
          </h1>
          <p className="text-gray-600 text-sm max-w-lg mx-auto mb-6">
            {isVerified
              ? 'Your payment of ₹1,000 has been received and verified. Please check your email for login credentials.'
              : 'Thank you for submitting your payment details. Our administrative team is currently verifying your transaction ID.'}
          </p>

          {/* Details Card */}
          {appData && (
            <div className="bg-slate-50 p-6 rounded-sm border border-gray-200 text-left mb-8 space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-xs text-gray-500 font-semibold uppercase">Application ID</span>
                <span className="font-mono font-bold text-navy text-sm">{appData.applicationId}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-xs text-gray-500 font-semibold uppercase">Applicant Name</span>
                <span className="font-bold text-navy text-sm">{appData.fullName}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-xs text-gray-500 font-semibold uppercase">Transaction ID</span>
                <span className="font-mono font-bold text-navy text-xs bg-white px-2 py-1 border border-gray-300 rounded-xs">
                  {appData.payment?.transactionId || 'Pending'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 font-semibold uppercase">Status</span>
                <StatusBadge status={appData.status} />
              </div>
            </div>
          )}

          {/* Flow Steps */}
          <div className="bg-navy-dark text-white p-6 rounded-sm text-left mb-8 space-y-4">
            <h3 className="font-heading font-bold text-sm text-amber flex items-center gap-2">
              <ShieldCheck size={16} />
              <span>What Happens Next?</span>
            </h3>
            <ul className="space-y-3 text-xs text-gray-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Admin verifies transaction against bank credit records.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail size={16} className="text-amber shrink-0 mt-0.5" />
                <span>
                  Once marked <strong>Payment Received</strong>, an email with your generated login password will be dispatched to <strong>{appData?.email}</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock size={16} className="text-cyan shrink-0 mt-0.5" />
                <span>
                  Log in to access your complete candidate dashboard, profile dossier, and live tracking timeline.
                </span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={fetchStatus}
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-navy text-white hover:bg-navy-light px-6 py-3 rounded-sm text-xs font-bold transition-colors"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Refresh Status</span>
            </button>

            {isVerified ? (
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber-light text-navy font-bold px-6 py-3 rounded-sm text-xs transition-colors shadow-md"
              >
                <span>Proceed to Candidate Login</span>
                <ArrowRight size={14} />
              </Link>
            ) : (
              <Link
                to={`/payment/${applicationId}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber-light text-navy font-bold px-6 py-3 rounded-sm text-xs transition-colors"
              >
                <CreditCard size={14} />
                <span>View Payment QR / Edit ID</span>
              </Link>
            )}

            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-sm text-xs font-bold transition-colors"
            >
              <Home size={14} />
              <span>Home</span>
            </Link>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
