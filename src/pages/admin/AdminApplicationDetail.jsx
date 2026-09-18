import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  FileText,
  Download,
  CreditCard,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Send,
  Building,
  Gift,
  Tag,
  Edit3,
} from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Modal } from '../../components/ui/Modal';

export function AdminApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [application, setApplication] = useState(null);

  // Status Change State
  const [selectedStatus, setSelectedStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalActionType, setModalActionType] = useState('CHANGE_STATUS');

  // Discount Adjustment State
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustDiscount, setAdjustDiscount] = useState(0);
  const [adjustRemarks, setAdjustRemarks] = useState('');
  const [adjusting, setAdjusting] = useState(false);
  const [downloadingResume, setDownloadingResume] = useState(false);

  const fetchApplication = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await api.getAdminApplicationById(id);
      const appData = res.application || res.data;
      if (res.success && appData) {
        setApplication(appData);
        setSelectedStatus(appData.status);
      } else {
        toast.error(res.message || 'Application record could not be loaded.');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch application.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const handleOpenStatusModal = (statusToSet, actionType) => {
    setSelectedStatus(statusToSet);
    setModalActionType(actionType);
    setIsConfirmModalOpen(true);
  };

  const handleStatusSelectChange = (e) => {
    const nextStatus = e.target.value;
    setSelectedStatus(nextStatus);
    setRemarks('');
    setModalActionType('CHANGE_STATUS');
    setIsConfirmModalOpen(true);
  };

  const handleConfirmStatusUpdate = async () => {
    if (!id || !selectedStatus) return;
    try {
      setUpdating(true);
      const res = await api.updateApplicationStatus(id, selectedStatus, remarks);
      const appData = res.application || res.data;
      if (res.success && appData) {
        setApplication(appData);
        toast.success(`Application status successfully updated to ${selectedStatus}`);
        setIsConfirmModalOpen(false);
      } else {
        toast.error(res.message || 'Failed to update application status.');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDownloadResume = async () => {
    if (!id) return;
    try {
      setDownloadingResume(true);
      const fileName = application?.resume?.originalName || `Resume_${application?.applicationId || id}.pdf`;
      await api.downloadAdminResume(id, fileName);
      toast.success('Resume download started!');
    } catch (err) {
      console.error('Download resume error:', err);
      toast.error(err.message || 'Failed to download resume.');
    } finally {
      setDownloadingResume(false);
    }
  };

  const handleOpenAdjustModal = () => {
    setAdjustDiscount(application?.referral?.discountAmount ?? 0);
    setAdjustRemarks('');
    setIsAdjustModalOpen(true);
  };

  const handleConfirmAdjustDiscount = async (e) => {
    if (e) e.preventDefault();
    if (!id || !application) return;

    const discountVal = Number(adjustDiscount);
    if (isNaN(discountVal) || discountVal < 0) {
      toast.error('Discount cannot be a negative value.');
      return;
    }

    const originalBase = application.referral?.originalAmount || 1499;
    if (discountVal > originalBase) {
      toast.error(`Discount cannot exceed the base application fee of ₹${originalBase}.`);
      return;
    }

    try {
      setAdjusting(true);
      const res = await api.adjustCandidateDiscount(application._id || id, {
        discountAmount: discountVal,
        remarks: adjustRemarks,
      });

      if (res.success) {
        toast.success(res.message || 'Fee discount adjusted successfully.');
        setIsAdjustModalOpen(false);
        await fetchApplication();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to adjust discount.');
    } finally {
      setAdjusting(false);
    }
  };

  if (loading && !application) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-heading font-semibold text-navy">Loading candidate dossier...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="bg-white p-12 rounded-sm text-center">
        <AlertCircle size={48} className="text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-heading font-bold text-navy">Application Not Found</h2>
        <p className="text-xs text-gray-500 mt-1 mb-6">Could not find record for ID: {id}</p>
        <Link
          to="/admin/applications"
          className="inline-flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-sm text-xs font-bold"
        >
          <ArrowLeft size={14} />
          <span>Back to Applications</span>
        </Link>
      </div>
    );
  }

  const isPaymentVerified = application.payment?.status === 'RECEIVED';

  return (
    <div className="space-y-6">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-sm border border-gray-200 shadow-xs">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/applications"
            className="p-2 bg-slate-100 hover:bg-slate-200 text-navy rounded-sm transition-colors"
            title="Back to All Applications"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-extrabold text-navy text-lg">
                {application.applicationId}
              </span>
              <StatusBadge status={application.status} size="md" />
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Applicant: <strong className="text-navy">{application.personalDetails?.fullName}</strong> • Registered on{' '}
              {new Date(application.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchApplication}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-navy font-bold text-xs rounded-sm transition-colors"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleDownloadResume}
            className="inline-flex items-center gap-2 px-4 py-2 bg-navy hover:bg-navy-light text-amber font-bold text-xs rounded-sm transition-colors shadow-xs"
          >
            <Download size={14} />
            <span>Download Resume</span>
          </button>
        </div>
      </div>

      {/* Main Grid: 2/3 and 1/3 layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Dossier Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Verification Highlight Card */}
          <div className={`p-6 rounded-sm border-2 shadow-sm ${isPaymentVerified ? 'bg-emerald-50/70 border-emerald-300' : 'bg-amber/10 border-amber/40'
            }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isPaymentVerified ? 'bg-emerald-600 text-white' : 'bg-amber text-navy'
                  }`}>
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-navy">
                    Registration Fee Verification (₹{(application.payment?.amount || 1499).toLocaleString()})
                  </h3>
                  <p className="text-xs text-gray-600">
                    Payment Status: <strong className={isPaymentVerified ? 'text-emerald-700' : 'text-amber-800'}>
                      {application.payment?.status}
                    </strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenAdjustModal}
                  className="inline-flex items-center gap-1.5 bg-white border border-gray-300 hover:bg-slate-50 text-navy font-bold px-3.5 py-2 rounded-sm text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <Tag size={14} className="text-amber" />
                  <span>Adjust Discount</span>
                </button>

                {!isPaymentVerified && (
                  <button
                    onClick={() => handleOpenStatusModal('PAYMENT_RECEIVED', 'MARK_PAYMENT')}
                    className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-sm text-xs shadow-md transition-colors cursor-pointer"
                  >
                    <CheckCircle2 size={16} />
                    <span>Mark Payment Received</span>
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
              <div>
                <span className="text-gray-500 font-semibold uppercase text-[10px] block">Payable Amount</span>
                <span className="font-bold text-navy text-sm">₹{(application.payment?.amount || 1499).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-500 font-semibold uppercase text-[10px] block">Transaction ID / UTR</span>
                <span className="font-mono font-bold text-navy text-sm bg-white px-2 py-1 border border-gray-200 rounded-xs block truncate">
                  {application.payment?.transactionId || 'Not submitted yet'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 font-semibold uppercase text-[10px] block">Submitted Timestamp</span>
                <span className="text-gray-700 text-xs block">
                  {application.payment?.submittedAt
                    ? new Date(application.payment.submittedAt).toLocaleString()
                    : 'Awaiting submission'}
                </span>
              </div>
            </div>
          </div>

          {/* Referral Information Dossier Card */}
          <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200 mb-4">
              <h3 className="text-sm font-heading font-bold text-navy uppercase tracking-wider flex items-center gap-2">
                <Gift size={16} className="text-amber" />
                <span>Member Referral & Discount Details</span>
              </h3>
              <button
                type="button"
                onClick={handleOpenAdjustModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-navy font-bold text-xs rounded-sm transition-colors cursor-pointer w-fit"
              >
                <Edit3 size={13} className="text-amber" />
                <span>Edit Discount / Payable</span>
              </button>
            </div>

            {application.referral?.isReferred ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-gray-500 font-semibold uppercase text-[10px] block">
                    Referrer Full Name
                  </span>
                  <span className="font-bold text-navy text-sm">
                    {application.referral.referrerName || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 font-semibold uppercase text-[10px] block">
                    Referrer Mobile
                  </span>
                  <span className="font-medium text-navy text-sm">
                    {application.referral.referrerPhone || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 font-semibold uppercase text-[10px] block">
                    Referrer Application ID
                  </span>
                  {application.referral.referrerApplicationId ? (
                    <Link
                      to={`/admin/applications/${application.referral.referrerApplicationId}`}
                      className="font-mono font-bold text-amber hover:underline text-sm"
                    >
                      {application.referral.referrerApplicationId} &rarr;
                    </Link>
                  ) : (
                    <span className="text-gray-400 font-mono">Matched by phone</span>
                  )}
                </div>
                <div>
                  <span className="text-gray-500 font-semibold uppercase text-[10px] block">
                    Discount Amount
                  </span>
                  <span className="font-bold text-emerald-600 text-sm">
                    -₹{(application.referral.discountAmount || 0).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 font-semibold uppercase text-[10px] block">
                    Original Base Fee
                  </span>
                  <span className="font-medium text-gray-700 text-sm">
                    ₹{(application.referral.originalAmount || 1499).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 font-semibold uppercase text-[10px] block">
                    Referral Status
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-xs mt-0.5">
                    <CheckCircle2 size={12} />
                    <span>Verified Referral</span>
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-500">
                <p>No referral was attached during registration (Standard direct application).</p>
                <button
                  type="button"
                  onClick={handleOpenAdjustModal}
                  className="text-navy hover:text-amber font-bold underline cursor-pointer text-xs"
                >
                  + Grant custom discount
                </button>
              </div>
            )}
          </div>

          {/* Personal Information */}
          <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-xs">
            <h3 className="text-sm font-heading font-bold text-navy uppercase tracking-wider pb-3 border-b border-gray-200 mb-4 flex items-center gap-2">
              <User size={16} className="text-amber" />
              <span>Personal Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-500 font-semibold uppercase text-[10px] block">Full Name</span>
                <span className="font-bold text-navy text-sm">{application.personalDetails?.fullName}</span>
              </div>
              <div>
                <span className="text-gray-500 font-semibold uppercase text-[10px] block">Email Address</span>
                <span className="font-medium text-navy text-sm">{application.personalDetails?.email}</span>
              </div>
              <div>
                <span className="text-gray-500 font-semibold uppercase text-[10px] block">Phone Number</span>
                <span className="font-medium text-navy text-sm">{application.personalDetails?.phone}</span>
              </div>
              <div>
                <span className="text-gray-500 font-semibold uppercase text-[10px] block">Alternate Phone</span>
                <span className="font-medium text-navy text-sm">
                  {application.personalDetails?.altPhone || 'N/A'}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-gray-500 font-semibold uppercase text-[10px] block">Address</span>
                <span className="font-medium text-navy text-sm">
                  {application.personalDetails?.address}, {application.personalDetails?.city},{' '}
                  {application.personalDetails?.state} - {application.personalDetails?.pincode}
                </span>
              </div>
            </div>
          </div>

          {/* Work Experience */}
          <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-xs">
            <h3 className="text-sm font-heading font-bold text-navy uppercase tracking-wider pb-3 border-b border-gray-200 mb-4 flex items-center gap-2">
              <Briefcase size={16} className="text-amber" />
              <span>Career & Work Experience</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500 font-semibold uppercase text-[10px] block">Applicant Category</span>
                  <span className="font-bold text-navy uppercase bg-slate-100 px-2 py-0.5 rounded-xs inline-block mt-0.5">
                    {application.applicantType}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 font-semibold uppercase text-[10px] block">Total Experience</span>
                  <span className="font-bold text-navy text-sm">
                    {application.workExperience?.totalExperience || '0 years (Fresher)'}
                  </span>
                </div>
                {application.applicantType === 'experienced' && (
                  <>
                    <div>
                      <span className="text-gray-500 font-semibold uppercase text-[10px] block">Company</span>
                      <span className="font-medium text-navy text-sm">
                        {application.workExperience?.currentCompany || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-semibold uppercase text-[10px] block">Designation</span>
                      <span className="font-medium text-navy text-sm">
                        {application.workExperience?.designation || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-semibold uppercase text-[10px] block">Notice Period</span>
                      <span className="font-medium text-navy text-sm">
                        {application.workExperience?.noticePeriod || 'Immediate'}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {application.workExperience?.skills && application.workExperience.skills.length > 0 && (
                <div>
                  <span className="text-gray-500 font-semibold uppercase text-[10px] block mb-2">Key Skills</span>
                  <div className="flex flex-wrap gap-2">
                    {application.workExperience.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="bg-navy/5 text-navy font-semibold text-xs px-2.5 py-1 rounded-sm border border-gray-200"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Educational Qualifications */}
          <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-xs">
            <h3 className="text-sm font-heading font-bold text-navy uppercase tracking-wider pb-3 border-b border-gray-200 mb-4 flex items-center gap-2">
              <GraduationCap size={16} className="text-amber" />
              <span>Educational Qualifications</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 10th/12th */}
              {application.education?.tenthOrTwelfth && (
                <div className="p-4 bg-slate-50 rounded-sm border border-gray-200">
                  <span className="text-[10px] font-bold text-amber-dark uppercase tracking-wider block">
                    {application.education.tenthOrTwelfth.qualificationType}
                  </span>
                  <h4 className="font-heading font-bold text-navy text-xs mt-1">
                    {application.education.tenthOrTwelfth.instituteName}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Board: {application.education.tenthOrTwelfth.board}
                  </p>
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200 text-xs">
                    <span className="text-gray-500">Year: {application.education.tenthOrTwelfth.yearOfPassing}</span>
                    <span className="font-bold text-navy font-mono">
                      {application.education.tenthOrTwelfth.percentageOrCgpa}
                    </span>
                  </div>
                </div>
              )}

              {/* Graduation */}
              {application.education?.graduation && (
                <div className="p-4 bg-slate-50 rounded-sm border border-gray-200">
                  <span className="text-[10px] font-bold text-amber-dark uppercase tracking-wider block">
                    {application.education.graduation.degree} ({application.education.graduation.specialization})
                  </span>
                  <h4 className="font-heading font-bold text-navy text-xs mt-1">
                    {application.education.graduation.collegeName}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    University: {application.education.graduation.university}
                  </p>
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200 text-xs">
                    <span className="text-gray-500">Year: {application.education.graduation.yearOfPassing}</span>
                    <span className="font-bold text-navy font-mono">
                      {application.education.graduation.percentageOrCgpa}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Actions & History */}
        <div className="space-y-6">
          {/* Status Update Control Box */}
          <div className="bg-navy p-6 rounded-sm text-white shadow-md border-t-4 border-amber">
            <h3 className="font-heading font-bold text-sm text-amber uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldCheck size={16} />
              <span>Update Application Status</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold uppercase text-[10px] mb-1.5">
                  Select New Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2.5 bg-navy-dark border border-navy-light rounded-sm text-white font-semibold text-xs focus:outline-none focus:border-amber"
                >
                  <option value="PAYMENT_PENDING">Payment Pending</option>
                  <option value="PAYMENT_RECEIVED">Payment Received</option>
                  <option value="APPLICATION_PENDING">Application Pending (Under Review)</option>
                  <option value="CONFIRMED">Confirmed / Selected</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold uppercase text-[10px] mb-1.5">
                  Remarks / Notes (Included in notification email)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Verified payment against bank statement. Documents under evaluation."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3 py-2 bg-navy-dark border border-navy-light rounded-sm text-white text-xs focus:outline-none focus:border-amber"
                />
              </div>

              <button
                type="button"
                onClick={() => handleOpenStatusModal(selectedStatus, 'CHANGE_STATUS')}
                disabled={updating}
                className="w-full inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber-light text-navy font-bold py-3 px-4 rounded-sm transition-colors text-xs shadow-md disabled:opacity-50"
              >
                <Send size={14} />
                <span>Save Status & Send Email Notification</span>
              </button>
            </div>
          </div>

          {/* Resume Quick Access */}
          <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-xs">
            <h3 className="font-heading font-bold text-navy text-sm pb-3 border-b border-gray-200 mb-4 flex items-center gap-2">
              <FileText size={16} className="text-amber" />
              <span>Resume File</span>
            </h3>

            <div className="p-4 bg-slate-50 rounded-sm border border-gray-200 text-center space-y-3">
              <p className="font-mono text-xs font-bold text-navy truncate">
                {application.resume?.originalName || 'Candidate_Resume.pdf'}
              </p>
              <span className="text-[10px] text-gray-500 block">
                {(application.resume?.size / (1024 * 1024)).toFixed(2)} MB • Uploaded on{' '}
                {new Date(application.resume?.uploadedAt || application.createdAt).toLocaleDateString()}
              </span>
              <button
                onClick={handleDownloadResume}
                className="w-full inline-flex items-center justify-center gap-2 bg-navy hover:bg-navy-light text-amber font-bold py-2 px-4 rounded-sm text-xs transition-colors"
              >
                <Download size={14} />
                <span>Download Resume</span>
              </button>
            </div>
          </div>

          {/* Status Timeline History */}
          <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-xs">
            <h3 className="font-heading font-bold text-navy text-sm pb-3 border-b border-gray-200 mb-4 flex items-center gap-2">
              <Clock size={16} className="text-amber" />
              <span>Status Audit Trail</span>
            </h3>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {application.statusHistory && application.statusHistory.length > 0 ? (
                application.statusHistory.map((item, idx) => (
                  <div key={idx} className="relative pl-5 border-l-2 border-amber/50 pb-2">
                    <span className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-amber" />
                    <span className="text-[10px] text-gray-400 block">
                      {new Date(item.changedAt).toLocaleString()}
                    </span>
                    <span className="font-bold text-navy text-xs block mt-0.5">{item.newStatus}</span>
                    <span className="text-[11px] text-gray-600 block">
                      Updated by: <strong>{item.changedByName || 'System'}</strong>
                    </span>
                    {item.remarks && (
                      <p className="text-[11px] text-gray-500 mt-1 italic bg-slate-50 p-1.5 rounded-xs border border-gray-200">
                        "{item.remarks}"
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400">No status audit records found.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title={
          modalActionType === 'MARK_PAYMENT'
            ? 'Confirm Payment Verification'
            : 'Confirm Status Change'
        }
      >
        <div className="space-y-4 text-xs text-gray-700">
          <p>
            You are about to change the status of application{' '}
            <strong className="text-navy font-mono">{application.applicationId}</strong> to:{' '}
            <strong className="text-navy">{selectedStatus}</strong>.
          </p>

          {selectedStatus === 'PAYMENT_RECEIVED' && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-sm text-emerald-900 leading-relaxed">
              <strong>Important:</strong> Marking as <strong>Payment Received</strong> will automatically create candidate credentials, unlock their dashboard, and send a welcome email with their temporary login password to <strong>{application.personalDetails?.email}</strong>.
            </div>
          )}

          {remarks && (
            <div className="p-3 bg-slate-50 border border-gray-200 rounded-sm">
              <span className="font-bold text-navy block mb-1">Remarks Included:</span>
              <span className="text-gray-600 italic">"{remarks}"</span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsConfirmModalOpen(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-sm text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmStatusUpdate}
              disabled={updating}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-amber hover:bg-amber-light text-navy font-bold rounded-sm text-xs shadow-sm transition-colors disabled:opacity-50"
            >
              {updating ? 'Updating & Sending Email...' : 'Confirm & Apply Update'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Discount & Fee Adjustment Modal */}
      <Modal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        title="Adjust Candidate Discount & Fee"
      >
        <form onSubmit={handleConfirmAdjustDiscount} className="space-y-4 text-xs text-gray-700">
          <p>
            Adjust the referral discount or payable fee for{' '}
            <strong className="text-navy">{application.personalDetails?.fullName}</strong> (
            <span className="font-mono">{application.applicationId}</span>).
          </p>

          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-sm border border-gray-200">
            <div>
              <span className="text-[10px] text-gray-500 uppercase font-semibold block">Base Fee</span>
              <span className="font-bold text-navy text-sm">
                ₹{(application.referral?.originalAmount || 1499).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 uppercase font-semibold block">Current Payable</span>
              <span className="font-bold text-navy text-sm">
                ₹{(application.payment?.amount || 1499).toLocaleString()}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-navy font-bold uppercase text-[10px] mb-1">
              Referral Discount Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500 font-bold text-xs">₹</span>
              <input
                type="number"
                min="0"
                max={application.referral?.originalAmount || 1499}
                value={adjustDiscount}
                onChange={(e) => setAdjustDiscount(e.target.value)}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-amber text-xs font-semibold text-navy"
              />
            </div>
            <span className="text-[11px] text-gray-500 mt-1 block">
              New net payable fee will be:{' '}
              <strong className="text-navy">
                ₹{Math.max(0, (application.referral?.originalAmount || 1499) - (Number(adjustDiscount) || 0)).toLocaleString()}
              </strong>
            </span>
          </div>

          <div>
            <label className="block text-navy font-bold uppercase text-[10px] mb-1">
              Admin Adjustment Remarks / Justification
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Special management approved discount / adjusted via corporate referral"
              value={adjustRemarks}
              onChange={(e) => setAdjustRemarks(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-amber text-xs"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsAdjustModalOpen(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-sm text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={adjusting}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-amber hover:bg-amber-light text-navy font-bold rounded-sm text-xs shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
            >
              {adjusting ? 'Saving Adjustment...' : 'Apply Fee Adjustment'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
