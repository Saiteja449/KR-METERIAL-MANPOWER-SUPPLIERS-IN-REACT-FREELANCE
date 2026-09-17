import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Clock,
  CheckCircle,
  Hourglass,
  CheckCheck,
  XCircle,
  CreditCard,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import { StatusBadge } from '../../components/ui/StatusBadge';

export function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const toast = useToast();

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminDashboard();
      if (res.success) {
        setDashboardData(res);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading && !dashboardData) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-heading font-semibold text-navy">Loading dashboard metrics...</p>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {
    total: 0,
    paymentPending: 0,
    paymentReceived: 0,
    applicationPending: 0,
    confirmed: 0,
    rejected: 0,
    totalRevenue: 0,
  };

  const statCards = [
    {
      title: 'Total Applications',
      value: stats.total,
      icon: <Users size={22} />,
      bg: 'bg-navy',
      textColor: 'text-white',
      badgeColor: 'bg-white/10 text-white',
      link: '/admin/applications',
    },
    {
      title: 'Payment Pending',
      value: stats.paymentPending,
      icon: <Clock size={22} />,
      bg: 'bg-amber-500',
      textColor: 'text-white',
      badgeColor: 'bg-black/15 text-white',
      link: '/admin/applications?status=PAYMENT_PENDING',
    },
    {
      title: 'Payment Received',
      value: stats.paymentReceived,
      icon: <CheckCircle size={22} />,
      bg: 'bg-emerald-600',
      textColor: 'text-white',
      badgeColor: 'bg-white/15 text-white',
      link: '/admin/applications?status=PAYMENT_RECEIVED',
    },
    {
      title: 'Under Review',
      value: stats.applicationPending,
      icon: <Hourglass size={22} />,
      bg: 'bg-cyan-600',
      textColor: 'text-white',
      badgeColor: 'bg-white/15 text-white',
      link: '/admin/applications?status=APPLICATION_PENDING',
    },
    {
      title: 'Confirmed / Selected',
      value: stats.confirmed,
      icon: <CheckCheck size={22} />,
      bg: 'bg-green-700',
      textColor: 'text-white',
      badgeColor: 'bg-white/15 text-white',
      link: '/admin/applications?status=CONFIRMED',
    },
    {
      title: 'Rejected',
      value: stats.rejected,
      icon: <XCircle size={22} />,
      bg: 'bg-rose-600',
      textColor: 'text-white',
      badgeColor: 'bg-white/15 text-white',
      link: '/admin/applications?status=REJECTED',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-navy">
            Administrator Dashboard
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time candidate metrics, payment verifications, and application statuses
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-navy font-bold text-xs rounded-sm shadow-xs transition-colors"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh Stats</span>
          </button>
          <Link
            to="/admin/applications"
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber hover:bg-amber-light text-navy font-bold text-xs rounded-sm shadow-sm transition-colors"
          >
            <span>View All Applications</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className={`${card.bg} ${card.textColor} p-5 rounded-sm shadow-md flex flex-col justify-between hover:shadow-lg transition-transform transform hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between">
              <span className={`p-2 rounded-sm ${card.badgeColor}`}>{card.icon}</span>
              <span className="text-3xl font-heading font-extrabold">{card.value}</span>
            </div>
            <span className="text-xs font-heading font-semibold mt-4 block opacity-90">
              {card.title}
            </span>
          </Link>
        ))}
      </div>

      {/* Total Revenue Box */}
      <div className="bg-navy p-6 rounded-sm text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t-4 border-amber shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber/20 text-amber flex items-center justify-center">
            <CreditCard size={24} />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-white">
              Total Verified Registration Collections
            </h3>
            <p className="text-xs text-gray-300">
              Based on {stats.paymentReceived + stats.applicationPending + stats.confirmed} verified applicant payments (₹1,000 / applicant)
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl sm:text-3xl font-heading font-extrabold text-amber">
            ₹{stats.totalRevenue.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Action Table: Pending Payment Verifications */}
      <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert size={18} className="text-amber" />
            <h2 className="font-heading font-bold text-sm text-navy uppercase tracking-wider">
              Pending Payment Verifications ({dashboardData?.pendingPaymentVerifications?.length || 0})
            </h2>
          </div>
          <Link
            to="/admin/applications?status=PAYMENT_PENDING"
            className="text-xs font-bold text-amber-dark hover:underline"
          >
            View all pending payments &rarr;
          </Link>
        </div>

        {dashboardData?.pendingPaymentVerifications && dashboardData.pendingPaymentVerifications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-100 text-navy uppercase text-[10px] font-bold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Application ID</th>
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Transaction ID (UTR)</th>
                  <th className="py-3 px-4">Submitted At</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dashboardData.pendingPaymentVerifications.map((app: any) => (
                  <tr key={app._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-navy">
                      <Link to={`/admin/applications/${app.applicationId}`} className="hover:underline">
                        {app.applicationId}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-navy block">{app.personalDetails?.fullName}</span>
                      <span className="text-gray-500 text-[11px] block">{app.personalDetails?.email}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-navy bg-amber/10 border border-amber/30 px-2 py-1 rounded-xs">
                        {app.payment?.transactionId || 'Awaiting Input'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500">
                      {app.payment?.submittedAt
                        ? new Date(app.payment.submittedAt).toLocaleString()
                        : new Date(app.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/admin/applications/${app.applicationId}`}
                        className="inline-flex items-center gap-1 bg-amber hover:bg-amber-light text-navy font-bold px-3 py-1.5 rounded-sm text-xs transition-colors shadow-xs"
                      >
                        <span>Review & Verify</span>
                        <ArrowRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-gray-500">
            ✓ No pending payment verifications at this moment.
          </div>
        )}
      </div>

      {/* Recent Applications Table */}
      <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-navy" />
            <h2 className="font-heading font-bold text-sm text-navy uppercase tracking-wider">
              Recent Application Registrations
            </h2>
          </div>
          <Link to="/admin/applications" className="text-xs font-bold text-navy hover:text-amber">
            View full directory &rarr;
          </Link>
        </div>

        {dashboardData?.recentApplications && dashboardData.recentApplications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-100 text-navy uppercase text-[10px] font-bold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Application ID</th>
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4">Registered Date</th>
                  <th className="py-3 px-4 text-right">Dossier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dashboardData.recentApplications.map((app: any) => (
                  <tr key={app._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-navy">
                      <Link to={`/admin/applications/${app.applicationId}`} className="hover:underline">
                        {app.applicationId}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-navy block">{app.personalDetails?.fullName}</span>
                      <span className="text-gray-500 text-[11px] block">{app.personalDetails?.phone}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="uppercase text-[11px] font-semibold bg-gray-100 px-2 py-0.5 rounded-xs text-gray-700">
                        {app.applicantType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={app.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-gray-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/admin/applications/${app.applicationId}`}
                        className="inline-flex items-center gap-1 text-navy hover:text-amber font-bold text-xs"
                      >
                        <span>Open</span>
                        <ExternalLink size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-gray-500">
            No applications submitted yet.
          </div>
        )}
      </div>
    </div>
  );
}
