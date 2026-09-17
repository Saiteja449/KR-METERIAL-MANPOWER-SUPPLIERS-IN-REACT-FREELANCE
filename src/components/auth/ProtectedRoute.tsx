import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProtectedRoute: React.FC = () => {
  const { user, isAuthenticated, loading, isPaymentVerified, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-light">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-amber border-t-transparent rounded-full animate-spin"></div>
          <p className="text-navy font-heading font-semibold">Verifying your session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin has access to all routes
  if (isAdmin) {
    return <Outlet />;
  }

  // If candidate payment is not verified yet, block dashboard and direct to payment page
  if (!isPaymentVerified) {
    const appId = user?.applicationId || '';
    return (
      <div className="min-h-screen pt-28 pb-16 px-4 flex items-center justify-center bg-slate-light">
        <div className="max-w-md w-full bg-white p-8 rounded-sm shadow-xl border-t-4 border-amber text-center">
          <div className="w-16 h-16 bg-amber/10 text-amber rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-2xl font-heading font-bold text-navy mb-3">
            Payment Verification Pending
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Your candidate dashboard is currently locked. Access will be unlocked automatically once our administration team verifies your registration fee payment.
          </p>
          {appId && (
            <div className="bg-slate-50 p-4 rounded-sm border border-gray-200 mb-6">
              <span className="text-xs text-gray-500 block">Application ID</span>
              <span className="font-mono font-bold text-navy text-base">{appId}</span>
            </div>
          )}
          <div className="space-y-3">
            {appId && (
              <Link
                to={`/payment/${appId}`}
                className="w-full inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber-light text-navy font-bold py-3 px-6 rounded-sm transition-all shadow-md"
              >
                <CreditCard size={18} />
                <span>View Payment / Submit Transaction ID</span>
              </Link>
            )}
            <Link
              to="/"
              className="w-full inline-flex items-center justify-center text-sm font-semibold text-gray-600 hover:text-navy py-2 transition-colors"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
};
