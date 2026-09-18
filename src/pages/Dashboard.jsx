import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
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
  LogOut,
  Calendar,
  ShieldCheck,
  Building2,
  Award,
} from 'lucide-react';
import { AnimatedPage } from '../components/layout/AnimatedPage';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../lib/api';
import { StatusBadge } from '../components/ui/StatusBadge';

export function Dashboard() {
  const { user, logout } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        const res = await api.getMyApplication();
        const appData = res.application || res.data;
        if (res.success && appData) {
          setApplication(appData);
        }
      } catch (err) {
        toast.error(err.message || 'Failed to load your application profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, []);

  const handleDownloadResume = async () => {
    try {
      const fileName = application?.resume?.originalName || 'My_Resume.pdf';
      await api.downloadCandidateResume(fileName);
      toast.success('Resume download started!');
    } catch (err) {
      console.error('Failed to download resume:', err);
      toast.error(err.message || 'Failed to download resume.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-16 flex items-center justify-center bg-slate-light">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-heading font-semibold text-navy">Loading Candidate Portal...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen pt-28 pb-16 flex items-center justify-center bg-slate-light px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-sm shadow-xl text-center">
          <p className="text-gray-600 text-sm mb-4">No application details found for this profile.</p>
          <button
            onClick={logout}
            className="px-6 py-2.5 bg-navy text-white text-xs font-bold rounded-sm"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    {
      id: 'submitted',
      label: 'Application Submitted',
      isCompleted: true,
      isActive: false,
    },
    {
      id: 'payment',
      label: 'Payment Verified',
      isCompleted: application.payment?.status === 'RECEIVED',
      isActive: application.payment?.status === 'PENDING',
    },
    {
      id: 'review',
      label: 'Under Review',
      isCompleted:
        application.status === 'APPLICATION_PENDING' ||
        application.status === 'CONFIRMED' ||
        application.status === 'REJECTED',
      isActive: application.status === 'APPLICATION_PENDING',
    },
    {
      id: 'decision',
      label:
        application.status === 'REJECTED'
          ? 'Application Rejected'
          : application.status === 'CONFIRMED'
            ? 'Confirmed / Selected'
            : 'Final Confirmation',
      isCompleted: application.status === 'CONFIRMED' || application.status === 'REJECTED',
      isActive: application.status === 'CONFIRMED',
      isRejected: application.status === 'REJECTED',
    },
  ];

  return (
    <AnimatedPage className="bg-slate-light min-h-screen pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="bg-navy rounded-sm shadow-xl border-t-4 border-amber p-6 sm:p-8 text-white mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold text-amber tracking-wider uppercase">
                Active Candidate Account
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
              Welcome, {application.personalDetails?.fullName || user?.name}!
            </h1>
            <p className="text-xs text-gray-300 mt-1 flex flex-wrap items-center gap-4">
              <span>
                Application ID:{' '}
                <strong className="font-mono text-amber bg-navy-dark px-2 py-0.5 rounded-xs">
                  {application.applicationId}
                </strong>
              </span>
              <span>
                Submitted on:{' '}
                {new Date(application.createdAt).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-navy-dark/70 p-4 rounded-sm border border-navy-light/60 text-right">
              <span className="text-[11px] text-gray-400 block uppercase font-semibold">
                Current Status
              </span>
              <div className="mt-1">
                <StatusBadge status={application.status} size="lg" />
              </div>
            </div>
            <button
              onClick={logout}
              className="p-3 bg-navy-light hover:bg-rose-900/60 text-gray-300 hover:text-white rounded-sm transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-white rounded-sm shadow-md border border-gray-200 p-6 sm:p-8 mb-8">
          <h2 className="text-lg font-heading font-bold text-navy mb-6 flex items-center gap-2">
            <Clock size={20} className="text-amber" />
            <span>Application Progress Timeline</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
            {steps.map((step, idx) => {
              return (
                <div
                  key={step.id}
                  className={`p-4 rounded-sm border text-center transition-all ${step.isRejected
                      ? 'bg-rose-50 border-rose-300 text-rose-800'
                      : step.isCompleted
                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
                        : step.isActive
                          ? 'bg-amber/10 border-amber text-navy font-bold shadow-sm'
                          : 'bg-gray-50 border-gray-200 text-gray-400'
                    }`}
                >
                  <div className="flex items-center justify-center mb-2">
                    {step.isRejected ? (
                      <span className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold">
                        ✕
                      </span>
                    ) : step.isCompleted ? (
                      <span className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                        ✓
                      </span>
                    ) : (
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step.isActive ? 'bg-amber text-navy' : 'bg-gray-300 text-gray-600'
                          }`}
                      >
                        {idx + 1}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-heading font-bold">{step.label}</h4>
                  <span className="text-[10px] block mt-1 opacity-80">
                    {step.isRejected
                      ? 'Review Concluded'
                      : step.isCompleted
                        ? 'Completed'
                        : step.isActive
                          ? 'In Progress'
                          : 'Pending'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Application Dossier Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: 2/3 width */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal & Contact Details */}
            <div className="bg-white rounded-sm shadow-md border border-gray-200 p-6 sm:p-8">
              <h3 className="text-base font-heading font-bold text-navy pb-3 border-b border-gray-200 mb-5 flex items-center gap-2">
                <User size={18} className="text-amber" />
                <span>Personal & Contact Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-500 font-semibold block uppercase text-[10px]">Full Name</span>
                  <span className="font-bold text-navy text-sm">{application.personalDetails?.fullName}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-semibold block uppercase text-[10px]">Email Address</span>
                  <span className="font-semibold text-navy text-sm">{application.personalDetails?.email}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-semibold block uppercase text-[10px]">Phone Number</span>
                  <span className="font-semibold text-navy text-sm">{application.personalDetails?.phone}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-semibold block uppercase text-[10px]">Alternate Phone</span>
                  <span className="font-semibold text-navy text-sm">
                    {application.personalDetails?.altPhone || 'N/A'}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-gray-500 font-semibold block uppercase text-[10px]">Address</span>
                  <span className="font-medium text-navy text-sm">
                    {application.personalDetails?.address}, {application.personalDetails?.city},{' '}
                    {application.personalDetails?.state} - {application.personalDetails?.pincode}
                  </span>
                </div>
              </div>
            </div>

            {/* Career & Experience */}
            <div className="bg-white rounded-sm shadow-md border border-gray-200 p-6 sm:p-8">
              <h3 className="text-base font-heading font-bold text-navy pb-3 border-b border-gray-200 mb-5 flex items-center gap-2">
                <Briefcase size={18} className="text-amber" />
                <span>Career & Professional Profile</span>
              </h3>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-500 font-semibold block uppercase text-[10px]">
                      Applicant Category
                    </span>
                    <span className="inline-block mt-1 font-bold text-navy uppercase bg-slate-100 px-2 py-0.5 rounded-xs">
                      {application.applicantType}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-semibold block uppercase text-[10px]">
                      Total Work Experience
                    </span>
                    <span className="font-bold text-navy text-sm">
                      {application.workExperience?.totalExperience || 'Fresher'}
                    </span>
                  </div>
                  {application.applicantType === 'experienced' && (
                    <>
                      <div>
                        <span className="text-gray-500 font-semibold block uppercase text-[10px]">
                          Current / Past Company
                        </span>
                        <span className="font-medium text-navy text-sm">
                          {application.workExperience?.currentCompany || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 font-semibold block uppercase text-[10px]">
                          Designation
                        </span>
                        <span className="font-medium text-navy text-sm">
                          {application.workExperience?.designation || 'N/A'}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {application.workExperience?.skills && application.workExperience.skills.length > 0 && (
                  <div>
                    <span className="text-gray-500 font-semibold block uppercase text-[10px] mb-2">
                      Registered Skills & Competencies
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {application.workExperience.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="bg-navy/5 text-navy font-semibold text-xs px-2.5 py-1 rounded-sm border border-gray-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Educational Qualifications */}
            <div className="bg-white rounded-sm shadow-md border border-gray-200 p-6 sm:p-8">
              <h3 className="text-base font-heading font-bold text-navy pb-3 border-b border-gray-200 mb-5 flex items-center gap-2">
                <GraduationCap size={18} className="text-amber" />
                <span>Educational Qualifications</span>
              </h3>

              <div className="space-y-6">
                {/* 10th/12th */}
                {application.education?.tenthOrTwelfth && (
                  <div className="p-4 bg-slate-50 rounded-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-heading font-bold text-xs text-navy uppercase">
                        {application.education.tenthOrTwelfth.qualificationType}
                      </h4>
                      <span className="text-xs font-bold text-amber-dark font-mono">
                        {application.education.tenthOrTwelfth.percentageOrCgpa}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 font-medium">
                      {application.education.tenthOrTwelfth.instituteName} ({application.education.tenthOrTwelfth.board})
                    </p>
                    <span className="text-[11px] text-gray-500 block mt-1">
                      Year of Passing: {application.education.tenthOrTwelfth.yearOfPassing}
                    </span>
                  </div>
                )}

                {/* Graduation */}
                {application.education?.graduation && (
                  <div className="p-4 bg-slate-50 rounded-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-heading font-bold text-xs text-navy uppercase">
                        {application.education.graduation.degree} - {application.education.graduation.specialization}
                      </h4>
                      <span className="text-xs font-bold text-amber-dark font-mono">
                        {application.education.graduation.percentageOrCgpa}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 font-medium">
                      {application.education.graduation.collegeName} ({application.education.graduation.university})
                    </p>
                    <span className="text-[11px] text-gray-500 block mt-1">
                      Year of Passing: {application.education.graduation.yearOfPassing}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: 1/3 width */}
          <div className="space-y-8">
            {/* Resume Card */}
            <div className="bg-white rounded-sm shadow-md border border-gray-200 p-6">
              <h3 className="text-base font-heading font-bold text-navy pb-3 border-b border-gray-200 mb-4 flex items-center gap-2">
                <FileText size={18} className="text-amber" />
                <span>Uploaded Resume</span>
              </h3>

              <div className="p-4 bg-slate-50 rounded-sm border border-gray-200 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-navy/10 text-navy flex items-center justify-center mx-auto">
                  <FileText size={20} />
                </div>
                <p className="text-xs font-bold text-navy truncate">
                  {application.resume?.originalName || 'Candidate_Resume.pdf'}
                </p>
                <span className="text-[10px] text-gray-500 block">
                  Uploaded on{' '}
                  {new Date(application.resume?.uploadedAt || application.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={handleDownloadResume}
                  className="w-full inline-flex items-center justify-center gap-2 bg-navy hover:bg-navy-light text-amber font-bold py-2.5 px-4 rounded-sm text-xs transition-colors shadow-sm"
                >
                  <Download size={14} />
                  <span>Download Resume</span>
                </button>
              </div>
            </div>

            {/* Payment Details Card */}
            <div className="bg-white rounded-sm shadow-md border border-gray-200 p-6">
              <h3 className="text-base font-heading font-bold text-navy pb-3 border-b border-gray-200 mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-amber" />
                <span>Payment Information</span>
              </h3>

              <div className="space-y-3 text-xs">
                {application.referral?.isReferred && (
                  <>
                    <div className="flex justify-between items-center py-1 border-b border-gray-100">
                      <span className="text-gray-500">Standard Fee:</span>
                      <span className="text-gray-700">₹{(application.referral.originalAmount || 1499).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-gray-100">
                      <span className="text-gray-500">Referral Discount:</span>
                      <span className="font-semibold text-emerald-600">-₹{application.referral.discountAmount || 0}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-gray-100">
                      <span className="text-gray-500">Referred By:</span>
                      <span className="font-medium text-navy">{application.referral.referrerName || 'KR Member'}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between items-center py-1 border-b border-gray-100">
                  <span className="text-gray-500">Amount Paid:</span>
                  <span className="font-bold text-navy">₹{(application.payment?.amount || 1499).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-gray-100">
                  <span className="text-gray-500">Transaction ID:</span>
                  <span className="font-mono font-bold text-navy text-[11px]">
                    {application.payment?.transactionId || 'Verified by Admin'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-gray-100">
                  <span className="text-gray-500">Payment Status:</span>
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-xs">
                    {application.payment?.status === 'RECEIVED' ? 'RECEIVED / VERIFIED' : application.payment?.status}
                  </span>
                </div>
                {application.payment?.verifiedAt && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-500">Verified On:</span>
                    <span className="text-gray-700">
                      {new Date(application.payment.verifiedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Status History Timeline */}
            <div className="bg-white rounded-sm shadow-md border border-gray-200 p-6">
              <h3 className="text-base font-heading font-bold text-navy pb-3 border-b border-gray-200 mb-4 flex items-center gap-2">
                <Clock size={18} className="text-amber" />
                <span>Audit & Updates History</span>
              </h3>

              <div className="space-y-4">
                {application.statusHistory && application.statusHistory.length > 0 ? (
                  application.statusHistory.map((item, idx) => (
                    <div key={idx} className="relative pl-5 border-l-2 border-amber/40 pb-2">
                      <span className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-amber" />
                      <span className="text-[10px] text-gray-500 block">
                        {new Date(item.changedAt).toLocaleString()}
                      </span>
                      <p className="text-xs font-bold text-navy mt-0.5">{item.newStatus}</p>
                      {item.remarks && (
                        <p className="text-[11px] text-gray-600 mt-0.5">{item.remarks}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400">No status updates recorded yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
