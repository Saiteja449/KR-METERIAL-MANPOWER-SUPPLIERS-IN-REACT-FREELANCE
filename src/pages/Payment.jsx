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
  Home,
  Edit3,
} from 'lucide-react';
import { AnimatedPage } from '../components/layout/AnimatedPage';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';

// UPI ID for the copy button
const UPI_ID = import.meta.env.VITE_UPI_ID || '9666193543@ybl';

// Static QR code image path (in /public/assets/images/)
const QR_IMAGE_PATH = '/assets/images/image.png';

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
  const [showEditUtr, setShowEditUtr] = useState(false);

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
      const res = await api.submitPayment(applicationId, transactionId.trim().toUpperCase());
      if (res.success) {
        setIsTxnSubmitted(true);
        setShowEditUtr(false);
        toast.success(
          'Transaction ID updated successfully! Our team will verify and send your login credentials.'
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
          <p className="text-sm font-heading font-semibold text-navy">Loading application details...</p>
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

  const payableAmount = appData.payment?.amount || 1499;
  const hasDiscount =
    appData.referral?.isReferred && (appData.referral?.discountAmount || 0) > 0;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <AnimatedPage className="bg-slate-light min-h-screen pt-28 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── CASE 1: PAYMENT / UTR ALREADY SUBMITTED (CONFIRMATION & RECEIPT) ── */}
        {isTxnSubmitted ? (
          <div>
            {/* Page Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>Application &amp; Payment Submitted</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-navy tracking-tight">
                Application Submitted Successfully!
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Official Reference ID:{' '}
                <strong className="font-mono text-navy bg-white px-2.5 py-0.5 rounded border border-gray-300">
                  {appData.applicationId}
                </strong>
              </p>
            </div>

            {/* Already Verified Banner */}
            {isAlreadyVerified && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-50 border border-emerald-300 p-5 rounded-sm mb-6 flex items-start gap-4 shadow-sm"
              >
                <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={24} />
                <div>
                  <h3 className="font-heading font-bold text-emerald-900 text-base">
                    Payment Verified &amp; Account Activated!
                  </h3>
                  <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                    Your registration payment of ₹{payableAmount.toLocaleString()} has been verified. Your login credentials were sent to <strong>{appData.email}</strong>.
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

            {/* Main Confirmation Card */}
            <div className="bg-white rounded-sm shadow-xl border-t-4 border-amber overflow-hidden space-y-6">
              {/* Applicant Header Banner */}
              <div className="bg-navy p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-amber-light font-semibold uppercase tracking-wider block">
                    Applicant Profile
                  </span>
                  <span className="text-lg font-heading font-bold text-white">{appData.fullName}</span>
                  <span className="text-xs text-gray-300 block">{appData.email}</span>
                </div>
                <div className="sm:text-right bg-navy-dark/60 p-3.5 rounded-sm border border-navy-light/60">
                  <span className="text-xs text-gray-300 block">Registration Fee</span>
                  <span className="text-2xl sm:text-3xl font-heading font-extrabold text-amber">
                    ₹{payableAmount.toLocaleString()}
                  </span>
                  {hasDiscount && (
                    <span className="text-[11px] text-emerald-400 font-semibold block mt-0.5">
                      ✓ ₹{appData.referral.discountAmount} Referral Discount Applied
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                {/* Status Callout Box */}
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-sm p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="text-emerald-600 shrink-0 mt-0.5" size={26} />
                    <div>
                      <h3 className="font-heading font-bold text-emerald-950 text-base">
                        Payment Transaction Details Received
                      </h3>
                      <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                        We have recorded your payment submission. Our administrative verification team is actively processing your application.
                      </p>
                    </div>
                  </div>

                  {/* Submission Summary Table */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-emerald-200/80 text-xs text-navy">
                    <div className="bg-white p-3 rounded-sm border border-emerald-100">
                      <span className="text-gray-500 block text-[11px] uppercase font-semibold">
                        Application ID
                      </span>
                      <strong className="font-mono text-sm text-navy">{appData.applicationId}</strong>
                    </div>

                    <div className="bg-white p-3 rounded-sm border border-emerald-100">
                      <span className="text-gray-500 block text-[11px] uppercase font-semibold">
                        Payment UTR / Transaction ID
                      </span>
                      <strong className="font-mono text-sm text-navy">{transactionId || 'Submitted'}</strong>
                    </div>

                    <div className="bg-white p-3 rounded-sm border border-emerald-100">
                      <span className="text-gray-500 block text-[11px] uppercase font-semibold">
                        Registration Amount
                      </span>
                      <strong className="text-sm text-navy">₹{payableAmount.toLocaleString()}</strong>
                    </div>

                    <div className="bg-white p-3 rounded-sm border border-emerald-100">
                      <span className="text-gray-500 block text-[11px] uppercase font-semibold">
                        Current Status
                      </span>
                      <strong className="text-sm text-amber-700 flex items-center gap-1 mt-0.5">
                        <Clock size={13} className="text-amber animate-pulse" />
                        <span>{isAlreadyVerified ? 'Payment Verified' : 'Awaiting Admin Verification'}</span>
                      </strong>
                    </div>
                  </div>
                </div>

                {/* What Happens Next Section */}
                <div className="bg-slate-50 border border-gray-200 rounded-sm p-5">
                  <h4 className="font-heading font-bold text-navy text-sm mb-3 flex items-center gap-2">
                    <Clock size={16} className="text-amber" />
                    <span>What Happens Next?</span>
                  </h4>
                  <ol className="space-y-2.5 text-xs text-gray-700 list-decimal list-inside leading-relaxed">
                    <li>
                      Our administrative desk will verify your Transaction ID{' '}
                      <code className="font-mono font-bold text-navy bg-white px-1.5 py-0.5 rounded border border-gray-200">
                        {transactionId}
                      </code>{' '}
                      against our bank payment settlement.
                    </li>
                    <li>
                      Once verified, your <strong>Candidate Portal login credentials</strong> (email &amp; secure password) will be generated and automatically sent to <strong>{appData.email}</strong>.
                    </li>
                    <li>
                      You can then log in to view your candidate profile, download your application dossier, and track your industrial/marine deployment.
                    </li>
                  </ol>
                </div>

                {/* Optional Update UTR Section (only if candidate made a typo) */}
                {!isAlreadyVerified && (
                  <div className="pt-2 border-t border-gray-100">
                    {!showEditUtr ? (
                      <button
                        type="button"
                        onClick={() => setShowEditUtr(true)}
                        className="text-xs text-gray-500 hover:text-navy inline-flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                      >
                        <Edit3 size={12} />
                        <span>Need to update your Transaction ID / UTR number?</span>
                      </button>
                    ) : (
                      <form onSubmit={handleSubmitPayment} className="space-y-3 bg-slate-50 p-4 rounded-sm border border-gray-200">
                        <label className="block text-xs font-bold uppercase tracking-wider text-navy">
                          Update 12-Digit Transaction ID / UTR
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            placeholder="Enter corrected UTR number"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                            className="flex-1 px-3 py-2 rounded-sm border border-gray-300 font-mono text-sm text-navy uppercase font-bold"
                          />
                          <button
                            type="submit"
                            disabled={submitting}
                            className="bg-navy hover:bg-navy-light text-amber font-bold px-4 py-2 rounded-sm text-xs transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            {submitting ? 'Updating...' : 'Save UTR'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowEditUtr(false)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-sm text-xs font-bold transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-gray-100">
                  <Link
                    to="/login"
                    className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber-light text-navy font-bold py-3.5 px-6 rounded-sm text-sm transition-all shadow-md text-center"
                  >
                    <span>Proceed to Candidate Login</span>
                    <ArrowRight size={16} />
                  </Link>

                  <Link
                    to="/"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-navy font-bold py-3.5 px-6 rounded-sm border border-gray-300 text-sm transition-colors text-center"
                  >
                    <Home size={16} />
                    <span>Back to Home</span>
                  </Link>
                </div>

                {/* Footer Help */}
                <div className="text-center text-xs text-gray-500 pt-2">
                  Need immediate verification assistance? Contact our desk at{' '}
                  <a href="tel:+919666193543" className="text-navy font-bold hover:underline">
                    +91 9666193543
                  </a>{' '}
                  or{' '}
                  <a href="mailto:info@kr1.in" className="text-navy font-bold hover:underline">
                    info@kr1.in
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ── CASE 2: LEGACY APPLICATION WITHOUT UTR (ENTER PAYMENT DETAILS) ── */
          <div>
            {/* Page Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber/10 border border-amber/30 text-amber-dark text-xs font-bold uppercase tracking-wider mb-2">
                <Zap size={14} className="text-amber" />
                <span>Registration Fee Payment</span>
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

            {/* Main Payment Card */}
            <div className="bg-white rounded-sm shadow-xl border-t-4 border-amber overflow-hidden">
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
                  <span className="text-2xl sm:text-3xl font-heading font-extrabold text-amber">
                    ₹{payableAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                {/* QR Code + Instructions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start border border-gray-200 rounded-sm p-5 bg-slate-50/50">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex items-center gap-2 mb-3 bg-[#5f259f] text-white px-3 py-1.5 rounded-sm text-xs font-bold self-center">
                      <Smartphone size={13} />
                      <span>PhonePe / GPay / Any UPI</span>
                    </div>

                    <div className="w-56 h-56 bg-white p-2 border-2 border-gray-200 rounded-sm shadow-sm flex items-center justify-center">
                      <img
                        src={QR_IMAGE_PATH}
                        alt="PhonePe UPI Payment QR Code"
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

                  <div>
                    <h3 className="font-heading font-bold text-navy text-sm flex items-center gap-2 mb-3">
                      <QrCode size={16} className="text-amber shrink-0" />
                      How to Pay
                    </h3>
                    <ol className="space-y-2.5 text-xs text-gray-700 list-decimal list-inside leading-relaxed">
                      <li>Open PhonePe, Google Pay, or any UPI app.</li>
                      <li>Scan the QR code or pay to UPI ID below.</li>
                      <li>Enter amount: <strong>₹{payableAmount.toLocaleString()}</strong>.</li>
                      <li>Copy the 12-digit UTR from your receipt and submit below.</li>
                    </ol>

                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <span className="text-[11px] text-gray-500 font-semibold block mb-1">
                        Pay to UPI ID:
                      </span>
                      <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-sm border border-gray-300">
                        <CreditCard size={15} className="text-[#5f259f] shrink-0" />
                        <span className="font-mono font-bold text-navy text-xs flex-1 truncate">
                          {UPI_ID}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="px-2.5 py-1 bg-navy text-amber rounded-sm text-xs font-bold"
                        >
                          {copiedUpi ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* UTR Form */}
                <form onSubmit={handleSubmitPayment} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
                      Enter 12-Digit Transaction ID / UTR Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 423987123456 or T24083015..."
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                      className="w-full px-4 py-3.5 rounded-sm border-2 border-gray-300 font-mono text-sm text-navy font-bold tracking-wide"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-3 bg-amber hover:bg-amber-light text-navy font-bold py-4 px-8 rounded-sm transition-all shadow-xl text-base disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? 'Submitting...' : 'Submit Transaction ID for Verification'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

      </div>
    </AnimatedPage>
  );
}
