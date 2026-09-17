import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Tag,
  Percent,
  Gift,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Users,
  CreditCard,
  ShieldCheck,
  Save,
  RefreshCw,
  ArrowUpRight,
  Search,
} from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import { StatusBadge } from '../../components/ui/StatusBadge';

export function AdminReferralSettings() {
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    referralDiscount: 200,
    baseApplicationFee: 1000,
    isReferralEnabled: true,
    requireVerifiedReferrer: false,
  });
  const [analytics, setAnalytics] = useState({
    totalReferred: 0,
    verifiedReferred: 0,
    totalDiscountGranted: 0,
  });
  const [referredApplications, setReferredApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchReferralData = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminReferralSettings();
      if (res.success) {
        setSettings({
          referralDiscount: res.settings?.referralDiscount ?? 200,
          baseApplicationFee: res.settings?.baseApplicationFee ?? 1000,
          isReferralEnabled: res.settings?.isReferralEnabled ?? true,
          requireVerifiedReferrer: res.settings?.requireVerifiedReferrer ?? false,
        });
        setAnalytics(
          res.analytics || {
            totalReferred: 0,
            verifiedReferred: 0,
            totalDiscountGranted: 0,
          }
        );
        setReferredApplications(res.referredApplications || []);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load referral settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralData();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();

    if (Number(settings.referralDiscount) < 0) {
      toast.error('Discount amount cannot be negative.');
      return;
    }
    if (Number(settings.baseApplicationFee) <= 0) {
      toast.error('Base application fee must be greater than zero.');
      return;
    }
    if (Number(settings.referralDiscount) > Number(settings.baseApplicationFee)) {
      toast.error('Referral discount cannot exceed the base application fee.');
      return;
    }

    try {
      setSaving(true);
      const res = await api.updateAdminReferralSettings(settings);
      if (res.success) {
        toast.success(res.message || 'Referral settings successfully updated.');
        await fetchReferralData();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update referral settings.');
    } finally {
      setSaving(false);
    }
  };

  const filteredApps = referredApplications.filter((app) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      app.applicationId?.toLowerCase().includes(term) ||
      app.personalDetails?.fullName?.toLowerCase().includes(term) ||
      app.referral?.referrerName?.toLowerCase().includes(term) ||
      app.referral?.referrerPhone?.toLowerCase().includes(term)
    );
  });

  const conversionRate =
    analytics.totalReferred > 0
      ? Math.round((analytics.verifiedReferred / analytics.totalReferred) * 100)
      : 0;

  const netDiscountedFee = Math.max(
    0,
    Number(settings.baseApplicationFee) - Number(settings.referralDiscount)
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-sm border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber/10 text-amber-dark rounded-sm">
              <Gift size={20} className="text-amber" />
            </span>
            <h1 className="text-xl font-heading font-extrabold text-navy">
              Referral Program & Member Discount Management
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Control global member discounts, set referrer verification rules, and monitor candidate referrals.
          </p>
        </div>

        <button
          onClick={fetchReferralData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-navy font-bold text-xs rounded-sm transition-colors cursor-pointer w-fit"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Referred */}
        <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-semibold block uppercase">
              Total Referred Candidates
            </span>
            <span className="text-2xl font-heading font-extrabold text-navy mt-1 block">
              {analytics.totalReferred}
            </span>
            <span className="text-[11px] text-gray-400 mt-0.5 block">
              Profiles with referrer details
            </span>
          </div>
          <div className="w-11 h-11 rounded-sm bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users size={22} />
          </div>
        </div>

        {/* Verified Referrals */}
        <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-semibold block uppercase">
              Paid / Verified Referrals
            </span>
            <span className="text-2xl font-heading font-extrabold text-emerald-600 mt-1 block">
              {analytics.verifiedReferred}
            </span>
            <span className="text-[11px] text-gray-400 mt-0.5 block">
              Completed payment successfully
            </span>
          </div>
          <div className="w-11 h-11 rounded-sm bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={22} />
          </div>
        </div>

        {/* Total Discount Value */}
        <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-semibold block uppercase">
              Total Discount Granted
            </span>
            <span className="text-2xl font-heading font-extrabold text-amber-dark mt-1 block">
              ₹{analytics.totalDiscountGranted.toLocaleString()}
            </span>
            <span className="text-[11px] text-gray-400 mt-0.5 block">
              Deductions given to applicants
            </span>
          </div>
          <div className="w-11 h-11 rounded-sm bg-amber/10 text-amber-dark flex items-center justify-center">
            <Tag size={22} className="text-amber" />
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-semibold block uppercase">
              Referral Conversion Rate
            </span>
            <span className="text-2xl font-heading font-extrabold text-navy mt-1 block">
              {conversionRate}%
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block flex items-center gap-1">
              <TrendingUp size={12} />
              <span>{analytics.verifiedReferred} of {analytics.totalReferred} paid</span>
            </span>
          </div>
          <div className="w-11 h-11 rounded-sm bg-purple-50 text-purple-600 flex items-center justify-center">
            <Percent size={22} />
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <div className="bg-white rounded-sm border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-5 bg-slate-50 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-amber" />
            <h2 className="font-heading font-bold text-navy text-sm sm:text-base">
              Global Referral Discount Settings
            </h2>
          </div>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              settings.isReferralEnabled
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-rose-100 text-rose-800'
            }`}
          >
            {settings.isReferralEnabled ? 'Program Active' : 'Program Paused'}
          </span>
        </div>

        <form onSubmit={handleSaveSettings} className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Base Application Fee */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
                Standard Base Application Fee (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-gray-500 font-bold text-sm">₹</span>
                <input
                  type="number"
                  min="0"
                  value={settings.baseApplicationFee}
                  onChange={(e) =>
                    setSettings({ ...settings, baseApplicationFee: e.target.value })
                  }
                  className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:border-amber text-sm font-semibold text-navy"
                />
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Standard fee charged to applicants registering without any referral.
              </p>
            </div>

            {/* Referral Discount Amount */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
                Default Member Referral Discount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-gray-500 font-bold text-sm">₹</span>
                <input
                  type="number"
                  min="0"
                  max={settings.baseApplicationFee}
                  value={settings.referralDiscount}
                  onChange={(e) =>
                    setSettings({ ...settings, referralDiscount: e.target.value })
                  }
                  className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:border-amber text-sm font-semibold text-navy"
                />
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Discount deducted from the base fee when an applicant enters a valid referrer.
              </p>
            </div>
          </div>

          {/* Dynamic Calculation Live Preview */}
          <div className="p-4 bg-navy text-white rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CreditCard size={18} className="text-amber shrink-0" />
              <div>
                <span className="text-xs text-gray-300 block">Candidate Payable Calculation:</span>
                <span className="text-xs font-medium text-white">
                  Base Fee (₹{Number(settings.baseApplicationFee).toLocaleString()}) - Referral Discount (₹{Number(settings.referralDiscount).toLocaleString()})
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-amber-light block uppercase font-semibold">
                Net Payable by Referred Applicant
              </span>
              <span className="text-xl font-heading font-extrabold text-amber">
                ₹{netDiscountedFee.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Program Policy Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            {/* Enable/Disable Toggle */}
            <div className="p-4 bg-slate-50 rounded-sm border border-gray-200 flex items-start gap-3">
              <input
                type="checkbox"
                id="isReferralEnabled"
                checked={settings.isReferralEnabled}
                onChange={(e) =>
                  setSettings({ ...settings, isReferralEnabled: e.target.checked })
                }
                className="w-4 h-4 text-amber border-gray-300 rounded focus:ring-amber mt-0.5 cursor-pointer"
              />
              <label htmlFor="isReferralEnabled" className="cursor-pointer select-none">
                <span className="font-heading font-bold text-xs text-navy block">
                  Enable Referral Program
                </span>
                <span className="text-[11px] text-gray-500 block mt-0.5">
                  When enabled, candidates see the referral input section on the registration form.
                </span>
              </label>
            </div>

            {/* Require Verified Referrer Toggle */}
            <div className="p-4 bg-slate-50 rounded-sm border border-gray-200 flex items-start gap-3">
              <input
                type="checkbox"
                id="requireVerifiedReferrer"
                checked={settings.requireVerifiedReferrer}
                onChange={(e) =>
                  setSettings({ ...settings, requireVerifiedReferrer: e.target.checked })
                }
                className="w-4 h-4 text-amber border-gray-300 rounded focus:ring-amber mt-0.5 cursor-pointer"
              />
              <label htmlFor="requireVerifiedReferrer" className="cursor-pointer select-none">
                <span className="font-heading font-bold text-xs text-navy block">
                  Require Paid / Verified Referrer Only
                </span>
                <span className="text-[11px] text-gray-500 block mt-0.5">
                  If enabled, only members who have paid the registration fee can refer new candidates.
                </span>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-amber font-bold px-6 py-2.5 rounded-sm text-xs transition-colors shadow-md disabled:opacity-60 cursor-pointer"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-amber border-t-transparent rounded-full animate-spin" />
                  <span>Saving Settings...</span>
                </>
              ) : (
                <>
                  <Save size={15} />
                  <span>Save Referral Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Referral Activity Table */}
      <div className="bg-white rounded-sm border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading font-bold text-navy text-sm sm:text-base">
              Recent Referral Activity & Applications ({filteredApps.length})
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Applications registered through employee or member referrals.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search candidate or referrer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-sm text-xs focus:outline-none focus:border-amber text-navy"
            />
          </div>
        </div>

        {filteredApps.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-xs">
            <Gift size={36} className="text-gray-300 mx-auto mb-2" />
            <p className="font-semibold text-gray-600">No referred applications found.</p>
            <p className="mt-0.5">
              When candidates apply using a member referral, their records will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-gray-200 text-gray-600 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Application ID</th>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Referrer Details</th>
                  <th className="py-3 px-4">Discount</th>
                  <th className="py-3 px-4">Payable Fee</th>
                  <th className="py-3 px-4">Payment Status</th>
                  <th className="py-3 px-4">Applied Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredApps.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-navy">
                      <Link
                        to={`/admin/applications/${app._id}`}
                        className="hover:text-amber hover:underline"
                      >
                        {app.applicationId}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-navy block">
                        {app.personalDetails?.fullName}
                      </span>
                      <span className="text-[11px] text-gray-500 block">
                        {app.personalDetails?.phone}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-navy flex items-center gap-1">
                        <Gift size={12} className="text-amber" />
                        <span>{app.referral?.referrerName || 'N/A'}</span>
                      </span>
                      <span className="text-[11px] text-gray-500 block">
                        {app.referral?.referrerPhone || ''}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-600">
                      -₹{app.referral?.discountAmount ?? 200}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-navy">
                      ₹{(app.payment?.amount || 800).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={app.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-gray-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/admin/applications/${app._id}`}
                        className="inline-flex items-center gap-1 text-navy hover:text-amber font-bold text-xs"
                      >
                        <span>View</span>
                        <ArrowUpRight size={13} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
export default AdminReferralSettings;
