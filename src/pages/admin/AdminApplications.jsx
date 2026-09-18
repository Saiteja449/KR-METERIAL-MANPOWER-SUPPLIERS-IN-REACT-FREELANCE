import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Eye,
  RefreshCw,
  Users,
  CheckCircle,
  Clock,
  ExternalLink,
  PlusCircle,
} from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Pagination } from '../../components/ui/Pagination';

export function AdminApplications() {
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  // Filters state from URL params
  const currentStatus = searchParams.get('status') || 'ALL';
  const currentType = searchParams.get('type') || 'ALL';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'createdAt';
  const currentOrder = searchParams.get('order') || 'desc';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(currentSearch);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getAdminApplications({
        status: currentStatus !== 'ALL' ? currentStatus : undefined,
        applicantType: currentType !== 'ALL' ? currentType : undefined,
        search: currentSearch || undefined,
        sortBy: currentSort,
        sortOrder: currentOrder,
        page: currentPage,
        limit: 10,
      });

      if (res.success) {
        setApplications(res.applications || []);
        setPagination(
          res.pagination || {
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 1,
          }
        );
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch applications.');
    } finally {
      setLoading(false);
    }
  }, [currentStatus, currentType, currentSearch, currentSort, currentOrder, currentPage]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const updateFilter = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value && value !== 'ALL') {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    nextParams.set('page', '1'); // Reset to page 1 on filter change
    setSearchParams(nextParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilter('search', searchInput.trim());
  };

  const handlePageChange = (page) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(page));
    setSearchParams(nextParams);
  };

  const statusTabs = [
    { label: 'All', value: 'ALL' },
    { label: 'Payment Pending', value: 'PAYMENT_PENDING' },
    { label: 'Payment Received', value: 'PAYMENT_RECEIVED' },
    { label: 'Under Review', value: 'APPLICATION_PENDING' },
    { label: 'Confirmed', value: 'CONFIRMED' },
    { label: 'Rejected', value: 'REJECTED' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-navy">
            Application Management
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Search, filter, review dossiers, and update candidate verification statuses
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/applications/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber hover:bg-amber-light text-navy font-extrabold text-xs rounded-sm shadow-sm transition-all transform hover:-translate-y-0.5"
          >
            <PlusCircle size={14} />
            <span>+ Add New Candidate</span>
          </Link>
          <button
            onClick={fetchApplications}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-navy font-bold text-xs rounded-sm shadow-xs transition-colors self-start sm:self-auto"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200">
        {statusTabs.map((tab) => {
          const isActive = currentStatus === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => updateFilter('status', tab.value)}
              className={`px-4 py-2 rounded-sm text-xs font-semibold whitespace-nowrap transition-colors ${isActive
                  ? 'bg-navy text-amber shadow-sm font-bold'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-sm border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by Name, Email, Phone, App ID, or Transaction ID..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-sm border border-gray-300 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber text-xs text-navy"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-navy text-white hover:bg-navy-light font-bold text-xs rounded-sm transition-colors"
          >
            Search
          </button>
          {currentSearch && (
            <button
              type="button"
              onClick={() => {
                setSearchInput('');
                updateFilter('search', '');
              }}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-xs rounded-sm transition-colors"
            >
              Clear
            </button>
          )}
        </form>

        {/* Filters & Sorting */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Applicant Type */}
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Filter size={14} className="text-gray-400" />
            <select
              value={currentType}
              onChange={(e) => updateFilter('type', e.target.value)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-sm text-xs font-semibold text-navy focus:outline-none focus:border-amber"
            >
              <option value="ALL">All Categories</option>
              <option value="fresher">Freshers Only</option>
              <option value="experienced">Experienced Only</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <ArrowUpDown size={14} className="text-gray-400" />
            <select
              value={`${currentSort}-${currentOrder}`}
              onChange={(e) => {
                const [sort, order] = e.target.value.split('-');
                const nextParams = new URLSearchParams(searchParams);
                nextParams.set('sort', sort);
                nextParams.set('order', order);
                nextParams.set('page', '1');
                setSearchParams(nextParams);
              }}
              className="px-3 py-2 bg-white border border-gray-300 rounded-sm text-xs font-semibold text-navy focus:outline-none focus:border-amber"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="personalDetails.fullName-asc">Applicant Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-amber border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-gray-500 font-semibold">Loading applications...</span>
          </div>
        ) : applications.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-navy text-white uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Application ID</th>
                    <th className="py-3.5 px-4">Applicant Profile</th>
                    <th className="py-3.5 px-4">Category / Exp</th>
                    <th className="py-3.5 px-4">Payment & UTR</th>
                    <th className="py-3.5 px-4">Current Status</th>
                    <th className="py-3.5 px-4">Registered Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-navy">
                        <Link
                          to={`/admin/applications/${app.applicationId}`}
                          className="hover:text-amber transition-colors"
                        >
                          {app.applicationId}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-navy block text-xs">
                          {app.personalDetails?.fullName}
                        </span>
                        <span className="text-gray-500 text-[11px] block">
                          {app.personalDetails?.email}
                        </span>
                        <span className="text-gray-500 text-[11px] block">
                          {app.personalDetails?.phone}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="uppercase text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded-xs text-gray-700 block w-fit">
                          {app.applicantType}
                        </span>
                        {app.applicantType === 'experienced' && (
                          <span className="text-[11px] text-gray-600 block mt-0.5">
                            {app.workExperience?.totalExperience || 'N/A'}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-xs block w-fit ${app.payment?.status === 'RECEIVED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                              }`}
                          >
                            ₹{app.payment?.amount || 1499} • {app.payment?.status}
                          </span>
                          {app.payment?.transactionId ? (
                            <span className="font-mono text-[11px] text-gray-700 block">
                              UTR: {app.payment.transactionId}
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-400 italic block">
                              No UTR submitted
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={app.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-gray-500 text-[11px]">
                        {new Date(app.createdAt).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/admin/applications/${app.applicationId}`}
                          className="inline-flex items-center gap-1.5 bg-navy hover:bg-navy-light text-white hover:text-amber font-bold px-3 py-1.5 rounded-sm text-xs transition-colors shadow-xs"
                        >
                          <Eye size={12} />
                          <span>View Dossier</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="border-t border-gray-200 p-2">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                totalCount={pagination.total}
                pageSize={pagination.limit}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <Users size={36} className="mx-auto text-gray-300 mb-3" />
            <h3 className="font-heading font-bold text-navy text-sm">No Applications Found</h3>
            <p className="text-xs text-gray-500 mt-1">
              Try adjusting your search query, status tab, or category filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
