import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  CreditCard,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Zap,
  Lock,
  Gift,
} from 'lucide-react';
import { AnimatedPage } from '../components/layout/AnimatedPage';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';

export function Payment() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [initiating, setInitiating] = useState(false);
  const [appData, setAppData] = useState(null);

  useEffect(() => {
    if (!applicationId) return;

    const fetchApp = async () => {
      try {
        setLoading(true);
        const res = await api.getPublicApplication(applicationId);
        if (res.success && res.application) {
          setAppData(res.application);
        }
      } catch (err) {
        toast.error(err.message || 'Unable to load application payment details.');
      } finally {
        setLoading(false);
      }
    };

    fetchApp();
  }, [applicationId]);

  const handlePayNow = async () => {
    if (!applicationId) return;

    try {
      setInitiating(true);
      const res = await api.createPayment(applicationId);

      if (res.success && res.paymentUrl) {
        toast.success('Redirecting to PhonePe Payment Gateway...');
        // Direct browser redirect to PhonePe's official checkout page
        window.location.href = res.paymentUrl;
      } else {
        toast.error(res.message || 'Unable to initialize PhonePe payment.');
        setInitiating(false);
      }
    } catch (err) {
      if (err.data?.isAlreadyVerified) {
        toast.success('Payment already verified! Redirecting to login...');
        navigate('/login');
      } else {
        toast.error(err.message || 'Failed to initiate PhonePe payment. Please try again.');
      }
      setInitiating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-16 flex items-center justify-center bg-slate-light">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-heading font-semibold text-navy">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!appData) {
    return (
      <div className="min-h-screen pt-28 pb-16 flex items-center justify-center bg-slate-light px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-sm shadow-xl text-center">
          <AlertCircle size={48} className="text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-heading font-bold text-navy mb-2">Application Not Found</h2>
          <p className="text-sm text-gray-600 mb-6">
            We could not find an active application with ID: <code className="font-mono text-navy">{applicationId}</code>
          </p>
          <Link
            to="/apply"
            className="inline-flex bg-amber hover:bg-amber-light text-navy font-bold px-6 py-3 rounded-sm text-sm"
          >
            Submit New Application
          </Link>
        </div>
      </div>
    );
  }

  const isAlreadyVerified =
    appData.status === 'PAYMENT_RECEIVED' ||
    appData.status === 'APPLICATION_PENDING' ||
    appData.status === 'CONFIRMED' ||
    appData.payment?.status === 'RECEIVED';

  return (
    <AnimatedPage className="bg-slate-light min-h-screen pt-28 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber/10 border border-amber/30 text-amber-dark text-xs font-bold uppercase tracking-wider mb-2">
            <Zap size={14} className="text-amber" />
            <span>Step 2 of 2: Registration Fee Payment</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-navy tracking-tight">
            Complete Application Payment
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Application ID:{' '}
            <strong className="font-mono text-navy bg-white px-2 py-0.5 rounded border border-gray-200">
              {appData.applicationId}
            </strong>
          </p>
        </div>

        {/* Status notice if already verified */}
        {isAlreadyVerified && (
          <div className="bg-emerald-50 border border-emerald-300 p-5 rounded-sm mb-8 flex items-start gap-4 shadow-sm">
            <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={24} />
            <div>
              <h3 className="font-heading font-bold text-emerald-900 text-base">
                Payment Already Verified & Received!
              </h3>
              <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                Your payment of ₹{(appData.payment?.amount || 1000).toLocaleString()} has been received. Your login credentials were sent to your registered email address ({appData.email}).
              </p>
              <div className="mt-4">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 bg-navy text-amber hover:bg-navy-light font-bold px-5 py-2.5 rounded-sm text-xs transition-colors shadow-md"
                >
                  <span>Proceed to Candidate Login</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Main Payment Container */}
        <div className="bg-white rounded-sm shadow-xl border-t-4 border-amber overflow-hidden">
          {/* Summary Banner */}
          <div className="bg-navy p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-amber-light font-semibold uppercase tracking-wider block">
                Applicant Name
              </span>
              <span className="text-lg font-heading font-bold text-white">
                {appData.fullName}
              </span>
              <span className="text-xs text-gray-300 block">{appData.email}</span>
            </div>
            <div className="sm:text-right bg-navy-dark/60 p-3.5 rounded-sm border border-navy-light/60">
              <span className="text-xs text-gray-300 block">Registration Fee</span>
              <div className="flex items-baseline sm:justify-end gap-2">
                {appData.referral?.isReferred && appData.referral?.discountAmount > 0 && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{(appData.referral.originalAmount || 1000).toLocaleString()}
                  </span>
                )}
                <span className="text-2xl sm:text-3xl font-heading font-extrabold text-amber">
                  ₹{(appData.payment?.amount || 1000).toLocaleString()}
                </span>
              </div>
              {appData.referral?.isReferred && appData.referral?.discountAmount > 0 && (
                <span className="text-[11px] text-emerald-400 font-semibold block mt-0.5">
                  ✓ ₹{appData.referral.discountAmount} Referral Discount Applied
                </span>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Referral Info Callout if applicable */}
            {appData.referral?.isReferred && (
              <div className="bg-amber/10 border border-amber/30 p-3.5 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-navy">
                <div className="flex items-center gap-2 font-medium">
                  <Gift size={16} className="text-amber-dark shrink-0" />
                  <span>
                    Referred by: <strong>{appData.referral.referrerName || 'Existing Member'}</strong>
                    {appData.referral.referrerPhone && ` (${appData.referral.referrerPhone})`}
                  </span>
                </div>
                <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-xs w-fit">
                  -₹{appData.referral.discountAmount || 200} Discount
                </span>
              </div>
            )}

            {/* PhonePe UPI & QR Highlighting Box */}
            <div className="bg-gradient-to-br from-purple-50 via-slate-50 to-amber-50/30 p-6 rounded-sm border border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-[#5f259f] text-white px-2.5 py-1 rounded-sm text-xs font-bold tracking-wide flex items-center gap-1.5">
                  <Smartphone size={14} />
                  <span>PhonePe UPI & QR Gateway</span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-xs">
                  Instant Auto-Verification
                </span>
              </div>

              <h3 className="text-base font-heading font-bold text-navy mb-1.5">
                Pay with Any UPI App or Dynamic QR Code
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                Clicking the button below will securely redirect you to PhonePe's payment gateway. You can pay using:
              </p>

              {/* Supported UPI & QR Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-medium">
                <div className="bg-white border border-gray-200 py-2.5 px-2 rounded-sm shadow-2xs text-navy font-bold flex flex-col items-center gap-1">
                  <Smartphone size={18} className="text-[#5f259f]" />
                  <span>PhonePe UPI</span>
                </div>
                <div className="bg-white border border-gray-200 py-2.5 px-2 rounded-sm shadow-2xs text-navy font-bold flex flex-col items-center gap-1">
                  <Smartphone size={18} className="text-blue-600" />
                  <span>Google Pay</span>
                </div>
                <div className="bg-white border border-gray-200 py-2.5 px-2 rounded-sm shadow-2xs text-navy font-bold flex flex-col items-center gap-1">
                  <Smartphone size={18} className="text-cyan-600" />
                  <span>Paytm / BHIM</span>
                </div>
                <div className="bg-white border border-gray-200 py-2.5 px-2 rounded-sm shadow-2xs text-navy font-bold flex flex-col items-center gap-1">
                  <QrCode size={18} className="text-amber" />
                  <span>Dynamic QR</span>
                </div>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="border border-gray-200 rounded-sm p-4 bg-slate-50/50 space-y-2.5 text-xs text-gray-700">
              <div className="flex items-center gap-2 text-navy font-semibold">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>Zero manual entry — no need to copy UPI IDs or enter 12-digit UTR numbers</span>
              </div>
              <div className="flex items-center gap-2 text-navy font-semibold">
                <Lock size={16} className="text-blue-600 shrink-0" />
                <span>100% secure 256-bit encrypted checkout handled directly by PhonePe</span>
              </div>
              <div className="flex items-center gap-2 text-navy font-semibold">
                <Zap size={16} className="text-amber shrink-0" />
                <span>Immediate login credentials dispatched to your email upon payment success</span>
              </div>
            </div>

            {/* Action CTA */}
            {!isAlreadyVerified && (
              <button
                type="button"
                onClick={handlePayNow}
                disabled={initiating}
                className="w-full inline-flex items-center justify-center gap-3 bg-[#5f259f] hover:bg-[#4d1d82] text-white font-bold py-4 px-8 rounded-sm transition-all shadow-xl hover:shadow-2xl disabled:opacity-60 disabled:cursor-not-allowed text-base transform hover:-translate-y-0.5 cursor-pointer"
              >
                {initiating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Connecting to PhonePe Gateway...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={20} className="text-amber" />
                    <span>Pay ₹{(appData.payment?.amount || 1000).toLocaleString()} via PhonePe (UPI / QR)</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            )}

            <div className="flex items-center justify-center gap-4 text-[11px] text-gray-500 pt-2">
              <span className="flex items-center gap-1">
                <Lock size={12} className="text-gray-400" />
                <span>RBI Authorized PG</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck size={12} className="text-gray-400" />
                <span>Instant Auto-Confirmation</span>
              </span>
              <span>•</span>
              <span>Support: info@kr1.in</span>
            </div>
          </div>
        </div>

        {/* Footer Help */}
        <div className="mt-8 text-center text-xs text-gray-500">
          Need assistance with payment? Contact our finance desk at{' '}
          <a href="tel:+919666193543" className="text-navy font-bold hover:underline">
            +91 9666193543
          </a>{' '}
          or{' '}
          <a href="mailto:info@kr1.in" className="text-navy font-bold hover:underline">
            info@kr1.in
          </a>
        </div>
      </div>
    </AnimatedPage>
  );
}
