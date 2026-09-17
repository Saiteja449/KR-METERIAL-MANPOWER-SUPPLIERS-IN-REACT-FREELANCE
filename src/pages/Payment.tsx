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
  Copy,
  Check,
  HelpCircle,
} from 'lucide-react';
import { AnimatedPage } from '../components/layout/AnimatedPage';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';

export function Payment() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [appData, setAppData] = useState<any>(null);
  const [transactionId, setTransactionId] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  const upiId = import.meta.env.VITE_PHONEPE_UPI_ID || '9666193543@ybl';
  const payeeName = import.meta.env.VITE_PHONEPE_PAYEE_NAME || 'KR Material and Manpower';

  useEffect(() => {
    if (!applicationId) return;

    const fetchApp = async () => {
      try {
        setLoading(true);
        const res = await api.getPublicApplication(applicationId);
        if (res.success && res.application) {
          setAppData(res.application);
          if (res.application.payment?.transactionId) {
            setTransactionId(res.application.payment.transactionId);
          }
        }
      } catch (err: any) {
        toast.error(err.message || 'Unable to load application payment details.');
      } finally {
        setLoading(false);
      }
    };

    fetchApp();
  }, [applicationId]);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    toast.success('UPI ID copied to clipboard!');
    setTimeout(() => setCopiedUpi(false), 3000);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!transactionId.trim()) {
      toast.error('Please enter your 12-digit UPI Transaction ID / UTR.');
      return;
    }

    if (!applicationId) return;

    try {
      setSubmitting(true);
      const res = await api.submitPayment(applicationId, transactionId.trim());

      if (res.success) {
        toast.success('Transaction ID submitted successfully! Waiting for verification.');
        navigate(`/payment-status/${applicationId}`);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit transaction details.');
    } finally {
      setSubmitting(false);
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
    appData.status === 'CONFIRMED';

  const isTxnSubmitted = !!appData.payment?.transactionId && appData.payment?.status === 'PENDING';

  return (
    <AnimatedPage className="bg-slate-light min-h-screen pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber/10 border border-amber/30 text-amber-dark text-xs font-bold uppercase tracking-wider mb-2">
            <CreditCard size={14} className="text-amber" />
            <span>Step 2 of 2: Payment Verification</span>
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
                Your payment of ₹1,000 has been verified by the administration team. You can log in using the credentials sent to your email to access your dashboard.
              </p>
              <div className="mt-4">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 bg-navy text-amber hover:bg-navy-light font-bold px-5 py-2.5 rounded-sm text-xs transition-colors"
                >
                  <span>Go to Candidate Login</span>
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
            <div className="sm:text-right bg-navy-dark/60 p-3 rounded-sm border border-navy-light/60">
              <span className="text-xs text-gray-300 block">Registration Fee</span>
              <span className="text-2xl sm:text-3xl font-heading font-extrabold text-amber">
                ₹1,000
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-10 space-y-8">
            {/* PhonePe QR Code Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-b border-gray-200 pb-8">
              {/* QR Container */}
              <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-gray-200 rounded-sm text-center">
                {/* PhonePe Header Branding */}
                <div className="flex items-center gap-2 mb-3 bg-[#5f259f] text-white px-3 py-1 rounded-sm text-xs font-bold">
                  <span>PhonePe UPI Payment</span>
                </div>

                {/* Styled Dynamic QR Code Display */}
                <div className="w-52 h-52 bg-white p-3 border-2 border-dashed border-gray-300 rounded-sm shadow-inner flex flex-col items-center justify-center relative">
                  {/* Generated QR visual representation */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                      `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=1000&cu=INR&tn=${appData.applicationId}`
                    )}`}
                    alt="PhonePe Payment QR"
                    className="w-full h-full object-contain"
                  />
                </div>

                <span className="text-xs font-mono font-bold text-navy mt-3">
                  Scan with PhonePe / GPay / Paytm
                </span>
                <span className="text-[11px] text-gray-500">Amount: ₹1,000</span>
              </div>

              {/* Step-by-Step Payment Instructions */}
              <div className="space-y-4">
                <h3 className="font-heading font-bold text-navy text-base flex items-center gap-2">
                  <QrCode size={18} className="text-amber" />
                  <span>How to Pay:</span>
                </h3>

                <ol className="space-y-3 text-xs text-gray-700 list-decimal list-inside font-sans leading-relaxed">
                  <li>
                    Open <strong>PhonePe</strong>, <strong>Google Pay</strong>, or any UPI app on your phone.
                  </li>
                  <li>
                    Scan the <strong>PhonePe QR Code</strong> on the left, or pay directly to the UPI ID.
                  </li>
                  <li>
                    Enter exact payment amount: <strong className="text-navy">₹1,000</strong>.
                  </li>
                  <li>
                    Add Note/Remark: <strong className="text-navy font-mono">{appData.applicationId}</strong>.
                  </li>
                  <li>
                    After payment completes, copy the <strong>12-digit UTR / Transaction ID</strong> from your UPI app receipt.
                  </li>
                  <li>
                    Enter the Transaction ID below and click <strong>Submit Transaction ID</strong>.
                  </li>
                </ol>

                {/* Direct UPI copy */}
                <div className="pt-2">
                  <span className="text-[11px] text-gray-500 font-semibold block mb-1">
                    Or Pay to Official UPI ID:
                  </span>
                  <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-sm border border-gray-300">
                    <span className="font-mono font-bold text-navy text-xs flex-1 truncate">
                      {upiId}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="p-1.5 bg-navy text-amber hover:bg-navy-light rounded-sm text-xs flex items-center gap-1 transition-colors"
                      title="Copy UPI ID"
                    >
                      {copiedUpi ? <Check size={14} /> : <Copy size={14} />}
                      <span className="text-[10px] font-bold">{copiedUpi ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Submission Form */}
            <form onSubmit={handleSubmitPayment} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
                  Enter 12-Digit Transaction ID / UTR Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. 423987123456 or T24083015..."
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-sm border-2 border-gray-300 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber text-sm font-mono text-navy font-bold tracking-wide uppercase"
                  />
                </div>
                <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                  <HelpCircle size={12} />
                  <span>Found on your payment confirmation screen in PhonePe / Google Pay / Bank app.</span>
                </p>
              </div>

              {isTxnSubmitted && (
                <div className="bg-amber/10 border border-amber/30 p-4 rounded-sm flex items-center gap-3">
                  <Clock className="text-amber shrink-0" size={20} />
                  <div className="text-xs text-navy">
                    <strong className="block font-heading font-bold">Transaction Submitted — Verification in Progress</strong>
                    Our admin team is currently verifying Transaction ID <code>{appData.payment.transactionId}</code>. You will receive an email once approved.
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-3 bg-amber hover:bg-amber-light text-navy font-bold py-4 px-8 rounded-sm transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed text-base transform hover:-translate-y-0.5"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-navy border-t-transparent rounded-full animate-spin" />
                    <span>Submitting Transaction Details...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={20} />
                    <span>{isTxnSubmitted ? 'Update Transaction ID' : 'Submit Transaction ID for Verification'}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer Support */}
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
