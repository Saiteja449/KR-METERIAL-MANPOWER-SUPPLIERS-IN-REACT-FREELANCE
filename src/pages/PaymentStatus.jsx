import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Clock,
  Mail,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Home,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { AnimatedPage } from '../components/layout/AnimatedPage';
import { api } from '../lib/api';
import { StatusBadge } from '../components/ui/StatusBadge';

export function PaymentStatus() {
  const { applicationId } = useParams();
  const [searchParams] = useSearchParams();
  const merchantOrderId = searchParams.get('merchantOrderId');

  const [loading, setLoading] = useState(true);
  const [statusData, setStatusData] = useState(null);
  const [error, setError] = useState(null);

  const fetchStatus = async () => {
    if (!applicationId) return;

    try {
      setLoading(true);
      setError(null);

      // Prefer merchantOrderId status check if available, otherwise check by applicationId
      if (merchantOrderId) {
        const res = await api.getPaymentStatus(merchantOrderId);
        if (res.success) {
          setStatusData(res);
        }
      } else {
        const res = await api.getApplicationPaymentStatus(applicationId);
        if (res.success) {
          setStatusData(res);
        }
      }
    } catch (err) {
      console.error('Error loading payment status:', err);
      setError(err.message || 'Unable to retrieve verified payment status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [applicationId, merchantOrderId]);

  const paymentStatus = statusData?.payment?.status;
  const isVerified =
    statusData?.isVerified ||
    paymentStatus === 'SUCCESS' ||
    statusData?.applicationStatus === 'PAYMENT_RECEIVED' ||
    statusData?.applicationStatus === 'APPLICATION_PENDING' ||
    statusData?.applicationStatus === 'CONFIRMED';

  const isFailed = paymentStatus === 'FAILED';

  return (
    <AnimatedPage className="bg-slate-light min-h-screen pt-28 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-sm shadow-xl border-t-4 border-amber p-8 sm:p-12 text-center">
          {/* Top Status Icon */}
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${isVerified
                ? 'bg-emerald-100 text-emerald-600'
                : isFailed
                  ? 'bg-rose-100 text-rose-600'
                  : 'bg-amber/10 text-amber'
              }`}
          >
            {isVerified ? (
              <CheckCircle2 size={38} className="text-emerald-500" />
            ) : isFailed ? (
              <AlertTriangle size={38} className="text-rose-500" />
            ) : (
              <Clock size={38} className="text-amber animate-pulse" />
            )}
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-navy mb-2">
            {isVerified
              ? 'Payment Verified Successfully!'
              : isFailed
                ? 'Payment Not Completed'
                : 'Payment Processing...'}
          </h1>

          <p className="text-gray-600 text-sm max-w-lg mx-auto mb-6">
            {isVerified
              ? `Your registration fee of ₹${(statusData?.amount || statusData?.payment?.amount || 1499).toLocaleString()} has been verified via PhonePe. Your candidate login credentials have been dispatched to your email.`
              : isFailed
                ? 'The payment was not completed or was cancelled on the gateway. No worry — you can easily retry your UPI/QR payment.'
                : 'PhonePe is processing your transaction confirmation. Please click Refresh if you just finished paying.'}
          </p>

          {/* Details Card */}
          {statusData && (
            <div className="bg-slate-50 p-6 rounded-sm border border-gray-200 text-left mb-8 space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-xs text-gray-500 font-semibold uppercase">Application ID</span>
                <span className="font-mono font-bold text-navy text-sm">
                  {statusData.applicationId || applicationId}
                </span>
              </div>

              {statusData.applicantName && (
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-xs text-gray-500 font-semibold uppercase">Applicant Name</span>
                  <span className="font-bold text-navy text-sm">{statusData.applicantName}</span>
                </div>
              )}

              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-xs text-gray-500 font-semibold uppercase">Amount</span>
                <span className="font-bold text-navy text-sm">
                  ₹{(statusData.amount || statusData.payment?.amount || 1499).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-xs text-gray-500 font-semibold uppercase">Payment Method</span>
                <span className="font-bold text-navy text-xs bg-purple-100 text-[#5f259f] px-2 py-0.5 rounded-xs">
                  PhonePe {statusData.payment?.paymentMode || 'UPI / QR'}
                </span>
              </div>

              {statusData.payment?.transactionId && (
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-xs text-gray-500 font-semibold uppercase">Transaction Reference</span>
                  <span className="font-mono font-bold text-navy text-xs bg-white px-2 py-1 border border-gray-300 rounded-xs">
                    {statusData.payment.transactionId}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 font-semibold uppercase">Application Status</span>
                <StatusBadge status={statusData.applicationStatus || 'PAYMENT_PENDING'} />
              </div>
            </div>
          )}

          {/* Flow Steps for Verified */}
          {isVerified && (
            <div className="bg-navy-dark text-white p-6 rounded-sm text-left mb-8 space-y-4">
              <h3 className="font-heading font-bold text-sm text-amber flex items-center gap-2">
                <ShieldCheck size={16} />
                <span>Account Activated Successfully</span>
              </h3>
              <ul className="space-y-3 text-xs text-gray-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>PhonePe instant payment confirmed and registered in system.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Mail size={16} className="text-amber shrink-0 mt-0.5" />
                  <span>
                    Your generated login password has been sent to your registered email address.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ArrowRight size={16} className="text-cyan shrink-0 mt-0.5" />
                  <span>
                    Log in now to access your complete candidate dashboard and track application status.
                  </span>
                </li>
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={fetchStatus}
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-navy text-white hover:bg-navy-light px-6 py-3 rounded-sm text-xs font-bold transition-colors cursor-pointer"
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
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#5f259f] hover:bg-[#4d1d82] text-white font-bold px-6 py-3 rounded-sm text-xs transition-colors shadow-md"
              >
                <RotateCcw size={14} />
                <span>Retry UPI / QR Payment</span>
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
