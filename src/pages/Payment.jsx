import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  QrCode,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Zap,
  Gift,
  CreditCard,
  Copy,
  Check,
  HelpCircle,
  IndianRupee,
} from 'lucide-react';
import { AnimatedPage } from '../components/layout/AnimatedPage';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';

// UPI payment details — configure these in your .env file
const UPI_ID = import.meta.env.VITE_UPI_ID || 'kr1manpower@phonepe';
const UPI_PAYEE_NAME = import.meta.env.VITE_UPI_PAYEE_NAME || 'KR Material and Manpower';

export function Payment() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [appData, setAppData] = useState(null);

  // UTR / Transaction ID state
  const [transactionId, setTransactionId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isTxnSubmitted, setIsTxnSubmitted] = useState(false);

  // UPI copy button state
  const [copiedUpi, setCopiedUpi] = useState(false);

  // ── Load application data ──────────────────────────────────────────────────
  useEffect(() => {
    if (!applicationId) return;

    const fetchApp = async () => {
      try {
        setLoading(true);
        const res = await api.getPublicApplication(applicationId);
        if (res.success && res.application) {
          setAppData(res.application);
          // Pre-fill UTR if candidate already submitted one
          if (res.application.payment?.transactionId) {
            setTransactionId(res.application.payment.transactionId);
            setIsTxnSubmitted(true);
          }
        }
      } catch (err) {
        toast.error(err.message || 'Unable to load application payment details.');
      } finally {
        setLoading(false);
      }
    };

    fetchApp();
  }, [applicationId]);

  // ── Copy UPI ID ────────────────────────────────────────────────────────────
  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_ID).then(() => {
      setCopiedUpi(true);
      toast.success('UPI ID copied to clipboard!');
      setTimeout(() => setCopiedUpi(false), 2500);
    });
  };

  // ── Submit UTR / Transaction ID ────────────────────────────────────────────
  const handleSubmitPayment = async (e) => {
    e.preventDefault();

    if (!transactionId.trim()) {
      toast.error('Please enter your Transaction ID / UTR number.');
      return;
    }
    if (transactionId.trim().length < 8) {
      toast.error('Transaction ID appears too short. Please enter the full 12-digit UTR.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.submitPayment(applicationId, transactionId.trim());
      if (res.success) {
        setIsTxnSubmitted(true);
        toast.success(
          'Transaction ID submitted! Our team will verify and send your login credentials within a few hours.'
        );
      }
    } catch (err) {
      if (err.data?.isAlreadyVerified) {
        toast.success('Your payment is already verified! Redirecting to login...');
        navigate('/login');
      } else {
        toast.error(err.message || 'Failed to submit Transaction ID. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
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

  // ── Not found ──────────────────────────────────────────────────────────────
  if (!appData) {
    return (
      <div className="min-h-screen pt-28 pb-16 flex items-center justify-center bg-slate-light px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-sm shadow-xl text-center">
          <AlertCircle size={48} className="text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-heading font-bold text-navy mb-2">Application Not Found</h2>
          <p className="text-sm text-gray-600 mb-6">
            We could not find an active application with ID:{' '}
            <code className="font-mono text-navy">{applicationId}</code>
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

  // ── Derived values ─────────────────────────────────────────────────────────
  const isAlreadyVerified =
    appData.status === 'PAYMENT_RECEIVED' ||
    appData.status === 'APPLICATION_PENDING' ||
    appData.status === 'CONFIRMED' ||
    appData.payment?.status === 'RECEIVED';

  const payableAmount = appData.payment?.amount || 1000;
  const hasDiscount =
    appData.referral?.isReferred && (appData.referral?.discountAmount || 0) > 0;

  // Dynamic UPI QR string (encodes UPI ID, payee, amount and app ID as remark)
  const upiString = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_PAYEE_NAME)}&am=${payableAmount}&cu=INR&tn=${encodeURIComponent(applicationId)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiString)}&bgcolor=FFFFFF&color=1a2035&margin=8`;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <AnimatedPage className="bg-slate-light min-h-screen pt-28 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber/10 border border-amber/30 text-amber-dark text-xs font-bold uppercase tracking-wider mb-2">
            <Zap size={14} className="text-amber" />
            <span>Step 2 of 2: Registration Fee Payment</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-navy tracking-tight">
            Complete Your Payment
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Application ID:{' '}
            <strong className="font-mono text-navy bg-white px-2 py-0.5 rounded border border-gray-200">
              {appData.applicationId}
            </strong>
          </p>
        </div>

        {/* Already Verified Banner */}
        {isAlreadyVerified && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-50 border border-emerald-300 p-5 rounded-sm mb-8 flex items-start gap-4 shadow-sm"
          >
            <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={24} />
            <div>
              <h3 className="font-heading font-bold text-emerald-900 text-base">
                Payment Already Verified &amp; Received!
              </h3>
              <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                Your payment of ₹{payableAmount.toLocaleString()} has been received. Your login
                credentials were sent to <strong>{appData.email}</strong>.
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
          </motion.div>
        )}

        {/* Main Payment Card */}
        <div className="bg-white rounded-sm shadow-xl border-t-4 border-amber overflow-hidden">

          {/* Applicant + Amount Banner */}
          <div className="bg-navy p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-amber-light font-semibold uppercase tracking-wider block">
                Applicant
              </span>
              <span className="text-lg font-heading font-bold text-white">{appData.fullName}</span>
              <span className="text-xs text-gray-300 block">{appData.email}</span>
            </div>
            <div className="sm:text-right bg-navy-dark/60 p-3.5 rounded-sm border border-navy-light/60">
              <span className="text-xs text-gray-300 block">Registration Fee</span>
              <div className="flex items-baseline sm:justify-end gap-2">
                {hasDiscount && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{(appData.referral.originalAmount || 1000).toLocaleString()}
                  </span>
                )}
                <span className="text-2xl sm:text-3xl font-heading font-extrabold text-amber">
                  ₹{payableAmount.toLocaleString()}
                </span>
              </div>
              {hasDiscount && (
                <span className="text-[11px] text-emerald-400 font-semibold block mt-0.5">
                  ✓ ₹{appData.referral.discountAmount} Referral Discount Applied
                </span>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">

            {/* Referral Callout */}
            {appData.referral?.isReferred && (
              <div className="bg-amber/10 border border-amber/30 p-3.5 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-navy">
                <div className="flex items-center gap-2 font-medium">
                  <Gift size={16} className="text-amber-dark shrink-0" />
                  <span>
                    Referred by:{' '}
                    <strong>{appData.referral.referrerName || 'Existing Member'}</strong>
                    {appData.referral.referrerPhone && ` (${appData.referral.referrerPhone})`}
                  </span>
                </div>
                <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-xs w-fit">
                  -₹{appData.referral.discountAmount || 200} Discount
                </span>
              </div>
            )}

            {/* QR Code + Instructions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start border border-gray-200 rounded-sm p-5 bg-slate-50/50">

              {/* QR Code Box */}
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center gap-2 mb-3 bg-[#5f259f] text-white px-3 py-1.5 rounded-sm text-xs font-bold self-center">
                  <Smartphone size={13} />
                  <span>PhonePe / GPay / Any UPI</span>
                </div>

                <div className="w-56 h-56 bg-white p-2 border-2 border-dashed border-gray-300 rounded-sm shadow-inner flex items-center justify-center relative">
                  <img
                    src={qrUrl}
                    alt="UPI Payment QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>

                <span className="text-xs font-semibold text-navy mt-3">
                  Scan with any UPI app
                </span>
                <span className="text-[11px] text-gray-500 mt-0.5">
                  Amount: <strong className="text-navy">₹{payableAmount.toLocaleString()}</strong>
                </span>
              </div>

              {/* How to Pay Instructions */}
              <div>
                <h3 className="font-heading font-bold text-navy text-sm flex items-center gap-2 mb-3">
                  <QrCode size={16} className="text-amber shrink-0" />
                  How to Pay
                </h3>
                <ol className="space-y-2.5 text-xs text-gray-700 list-decimal list-inside leading-relaxed">
                  <li>
                    Open <strong>PhonePe</strong>, <strong>Google Pay</strong>, or any UPI app on your phone.
                  </li>
                  <li>
                    Scan the <strong>QR Code</strong> on the left, <em>or</em> pay directly to the UPI ID below.
                  </li>
                  <li>
                    Enter exact amount:{' '}
                    <strong className="text-navy">₹{payableAmount.toLocaleString()}</strong>.
                  </li>
                  <li>
                    Add <strong>Remark / Note</strong>:{' '}
                    <code className="font-mono text-navy bg-gray-100 px-1 rounded text-[11px]">
                      {appData.applicationId}
                    </code>
                  </li>
                  <li>
                    After payment, copy the <strong>12-digit UTR / Transaction ID</strong> from your UPI receipt.
                  </li>
                  <li>
                    Enter it in the form below and click <strong>Submit</strong>.
                  </li>
                </ol>
              </div>
            </div>

            {/* UPI ID Copy Row */}
            <div>
              <span className="text-[11px] text-gray-500 font-semibold block mb-1.5">
                Or Pay Directly to UPI ID:
              </span>
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-2.5 rounded-sm border border-gray-300">
                <CreditCard size={16} className="text-[#5f259f] shrink-0" />
                <span className="font-mono font-bold text-navy text-sm flex-1 truncate">
                  {UPI_ID}
                </span>
                <button
                  type="button"
                  id="copy-upi-btn"
                  onClick={handleCopyUpi}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-navy text-amber hover:bg-navy-light rounded-sm text-xs font-bold transition-colors cursor-pointer"
                  title="Copy UPI ID"
                >
                  {copiedUpi ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedUpi ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* UTR Submission Form */}
            {!isAlreadyVerified && (
              <form onSubmit={handleSubmitPayment} className="space-y-4">
                <div>
                  <label
                    htmlFor="transaction-id-input"
                    className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5"
                  >
                    Enter 12-Digit Transaction ID / UTR Number{' '}
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="transaction-id-input"
                      type="text"
                      required
                      placeholder="e.g. 423987123456 or T24083015..."
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                      className="w-full px-4 py-3.5 rounded-sm border-2 border-gray-300 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber text-sm font-mono text-navy font-bold tracking-wide"
                    />
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                    <HelpCircle size={11} />
                    <span>
                      Found on your payment confirmation screen in PhonePe / Google Pay / Bank app.
                    </span>
                  </p>
                </div>

                {/* Verification In Progress Banner */}
                {isTxnSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-amber/10 border border-amber/30 p-4 rounded-sm flex items-start gap-3"
                  >
                    <Clock className="text-amber shrink-0 mt-0.5" size={18} />
                    <div className="text-xs text-navy">
                      <strong className="block font-heading font-bold mb-0.5">
                        Transaction Submitted — Verification in Progress
                      </strong>
                      Our admin team is verifying Transaction ID{' '}
                      <code className="font-mono bg-white px-1 py-0.5 rounded border border-gray-200 text-[11px]">
                        {transactionId}
                      </code>
                      . You will receive an email with your login credentials once approved.
                    </div>
                  </motion.div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  id="submit-txn-btn"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-3 bg-amber hover:bg-amber-light text-navy font-bold py-4 px-8 rounded-sm transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed text-base transform hover:-translate-y-0.5 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-navy border-t-transparent rounded-full animate-spin" />
                      <span>Submitting Transaction Details...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={20} />
                      <span>
                        {isTxnSubmitted
                          ? 'Update Transaction ID'
                          : 'Submit Transaction ID for Verification'}
                      </span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Trust Footer */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-gray-500 pt-1 border-t border-gray-100">
              <span className="flex items-center gap-1">
                <ShieldCheck size={12} className="text-gray-400" />
                <span>Admin-Verified Payment</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <IndianRupee size={12} className="text-gray-400" />
                <span>One-time Registration Fee</span>
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
