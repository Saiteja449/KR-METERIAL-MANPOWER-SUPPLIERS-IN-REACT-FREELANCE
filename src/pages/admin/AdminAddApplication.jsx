import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  FileText,
  Upload,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Gift,
  Tag,
} from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';

export function AdminAddApplication() {
  const navigate = useNavigate();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);

  // Form State matching Apply.jsx
  const [applicantType, setApplicantType] = useState('fresher');

  const [personalDetails, setPersonalDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
    altPhone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [workExperience, setWorkExperience] = useState({
    totalExperience: '',
    currentCompany: '',
    designation: '',
    relevantExperience: '',
    skills: '',
    currentSalary: '',
    expectedSalary: '',
    noticePeriod: '',
  });

  const [education, setEducation] = useState({
    tenthOrTwelfth: {
      qualificationType: '12th / Intermediate',
      board: '',
      instituteName: '',
      yearOfPassing: '',
      percentageOrCgpa: '',
    },
    graduation: {
      degree: '',
      specialization: '',
      university: '',
      collegeName: '',
      yearOfPassing: '',
      percentageOrCgpa: '',
    },
  });

  const [paymentDetails, setPaymentDetails] = useState({
    amount: '1499',
    paymentStatus: 'RECEIVED',
    transactionId: 'ADMIN_OFFLINE_VERIFIED',
  });

  const [referralDetails, setReferralDetails] = useState({
    isReferred: false,
    referrerName: '',
    referrerPhone: '',
    discountAmount: '150',
  });

  const [applicationStatus, setApplicationStatus] = useState('PAYMENT_RECEIVED');
  const [remarks, setRemarks] = useState('Manual candidate registration created by Administrator.');
  const [sendEmail, setSendEmail] = useState(true);

  const [resumeFile, setResumeFile] = useState(null);
  const [fileError, setFileError] = useState('');

  const handleFileChange = (e) => {
    setFileError('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      const validExts = ['.pdf', '.doc', '.docx'];
      const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

      if (!validTypes.includes(file.type) && !validExts.includes(fileExt)) {
        setFileError('Please upload a PDF, DOC, or DOCX document.');
        setResumeFile(null);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setFileError('File size exceeds 5MB limit.');
        setResumeFile(null);
        return;
      }

      setResumeFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations exactly matching Apply.jsx
    if (!personalDetails.fullName.trim()) {
      toast.error('Please enter the candidate full name.');
      return;
    }
    if (!personalDetails.email.trim() || !personalDetails.email.includes('@')) {
      toast.error('Please enter a valid candidate email address.');
      return;
    }
    if (!personalDetails.phone.trim() || personalDetails.phone.length < 10) {
      toast.error('Please enter a valid 10-digit phone number.');
      return;
    }
    if (
      !personalDetails.address.trim() ||
      !personalDetails.city.trim() ||
      !personalDetails.state.trim() ||
      !personalDetails.pincode.trim()
    ) {
      toast.error('Please complete full residential address details.');
      return;
    }

    if (applicantType === 'experienced' && !workExperience.totalExperience.trim()) {
      toast.error('Please specify total work experience.');
      return;
    }

    if (
      !education.tenthOrTwelfth.board.trim() ||
      !education.tenthOrTwelfth.instituteName.trim() ||
      !education.tenthOrTwelfth.yearOfPassing ||
      !education.tenthOrTwelfth.percentageOrCgpa.trim()
    ) {
      toast.error('Please complete all fields for 10th / 12th Education.');
      return;
    }

    if (
      !education.graduation.degree.trim() ||
      !education.graduation.specialization.trim() ||
      !education.graduation.university.trim() ||
      !education.graduation.collegeName.trim() ||
      !education.graduation.yearOfPassing ||
      !education.graduation.percentageOrCgpa.trim()
    ) {
      toast.error('Please complete all Graduation / Highest Degree details.');
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append('applicantType', applicantType);
      formData.append('personalDetails', JSON.stringify(personalDetails));
      formData.append(
        'workExperience',
        JSON.stringify({
          ...workExperience,
          skills: workExperience.skills
            ? workExperience.skills.split(',').map((s) => s.trim()).filter(Boolean)
            : [],
        })
      );
      formData.append('education', JSON.stringify(education));
      formData.append('amount', paymentDetails.amount);
      formData.append('paymentStatus', paymentDetails.paymentStatus);
      formData.append('transactionId', paymentDetails.transactionId);
      formData.append('status', applicationStatus);
      formData.append('remarks', remarks);
      formData.append('sendEmail', String(sendEmail));

      if (referralDetails.isReferred) {
        formData.append(
          'referral',
          JSON.stringify({
            isReferred: true,
            referrerName: referralDetails.referrerName.trim(),
            referrerPhone: referralDetails.referrerPhone.trim(),
            discountAmount: Number(referralDetails.discountAmount) || 0,
            originalAmount: 1499,
          })
        );
      }

      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      const res = await api.createAdminApplication(formData);

      if (res.success && res.application) {
        toast.success(
          `Application ${res.application.applicationId} registered successfully! ${res.generatedPassword ? `Credentials emailed: ${res.generatedPassword}` : ''
          }`
        );
        navigate(`/admin/applications/${res.application.applicationId}`);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create candidate application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white p-5 rounded-sm border border-gray-200 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/applications"
            className="p-2 bg-slate-100 hover:bg-slate-200 text-navy rounded-sm transition-colors"
            title="Back to All Applications"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-heading font-extrabold text-navy">
              Add New Candidate Entry
            </h1>
            <p className="text-xs text-gray-500">
              Manual registration for walk-in applicants, offline records, or direct recruitment deployments
            </p>
          </div>
        </div>
      </div>

      {/* Main Form (Replicating exact Apply.jsx sections & fields) */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-sm shadow-xl border-t-4 border-amber p-6 sm:p-10 space-y-10"
      >
        {/* Section 1: Personal Information */}
        <div>
          <div className="flex items-center gap-3 pb-3 border-b border-gray-200 mb-6">
            <div className="w-8 h-8 rounded-full bg-navy text-amber flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h2 className="text-xl font-heading font-bold text-navy flex items-center gap-2">
              <User size={20} className="text-amber" />
              <span>Personal Information</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={personalDetails.fullName}
                onChange={(e) =>
                  setPersonalDetails({ ...personalDetails, fullName: e.target.value })
                }
                className="w-full px-4 py-3 rounded-sm border border-gray-300 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber text-sm text-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={personalDetails.email}
                  onChange={(e) =>
                    setPersonalDetails({ ...personalDetails, email: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-sm border border-gray-300 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber text-sm text-navy"
                />
              </div>
              <span className="text-[11px] text-gray-500 mt-1 block">
                Login credentials will be sent to this email upon payment verification.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                <input
                  type="tel"
                  required
                  placeholder="+91 9876543210"
                  value={personalDetails.phone}
                  onChange={(e) =>
                    setPersonalDetails({ ...personalDetails, phone: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-sm border border-gray-300 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber text-sm text-navy"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
                Alternate Phone (Optional)
              </label>
              <input
                type="tel"
                placeholder="+91 9123456789"
                value={personalDetails.altPhone}
                onChange={(e) =>
                  setPersonalDetails({ ...personalDetails, altPhone: e.target.value })
                }
                className="w-full px-4 py-3 rounded-sm border border-gray-300 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber text-sm text-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
                City <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Kakinada / Visakhapatnam"
                value={personalDetails.city}
                onChange={(e) =>
                  setPersonalDetails({ ...personalDetails, city: e.target.value })
                }
                className="w-full px-4 py-3 rounded-sm border border-gray-300 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber text-sm text-navy"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
                Address Line <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                <input
                  type="text"
                  required
                  placeholder="House / Flat No., Street, Landmark"
                  value={personalDetails.address}
                  onChange={(e) =>
                    setPersonalDetails({ ...personalDetails, address: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-sm border border-gray-300 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber text-sm text-navy"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
                State <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Andhra Pradesh"
                value={personalDetails.state}
                onChange={(e) =>
                  setPersonalDetails({ ...personalDetails, state: e.target.value })
                }
                className="w-full px-4 py-3 rounded-sm border border-gray-300 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber text-sm text-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
                Pincode <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="533002"
                value={personalDetails.pincode}
                onChange={(e) =>
                  setPersonalDetails({ ...personalDetails, pincode: e.target.value })
                }
                className="w-full px-4 py-3 rounded-sm border border-gray-300 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber text-sm text-navy"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Career Information (Matching Apply.jsx exactly) */}
        <div>
          <div className="flex items-center gap-3 pb-3 border-b border-gray-200 mb-6">
            <div className="w-8 h-8 rounded-full bg-navy text-amber flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h2 className="text-xl font-heading font-bold text-navy flex items-center gap-2">
              <Briefcase size={20} className="text-amber" />
              <span>Career Information</span>
            </h2>
          </div>

          {/* Applicant Type Toggle */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-2">
              Applicant Type <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setApplicantType('fresher')}
                className={`py-3.5 px-4 rounded-sm border text-center font-heading font-bold text-sm transition-all ${applicantType === 'fresher'
                    ? 'bg-navy text-amber border-navy shadow-md'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-navy-light'
                  }`}
              >
                Fresher (Entry Level)
              </button>
              <button
                type="button"
                onClick={() => setApplicantType('experienced')}
                className={`py-3.5 px-4 rounded-sm border text-center font-heading font-bold text-sm transition-all ${applicantType === 'experienced'
                    ? 'bg-navy text-amber border-navy shadow-md'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-navy-light'
                  }`}
              >
                Experienced Professional
              </button>
            </div>
          </div>

          {/* Conditional Fields for Experienced */}
          {applicantType === 'experienced' ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-5 bg-slate-50 p-5 rounded-sm border border-gray-200"
            >
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
                  Total Work Experience <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 3 Years 6 Months"
                  value={workExperience.totalExperience}
                  onChange={(e) =>
                    setWorkExperience({ ...workExperience, totalExperience: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-sm border border-gray-300 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber text-sm text-navy bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
                  Current / Previous Company
                </label>
                <input
                  type="text"
                  placeholder="e.g. Larsen & Toubro / ONGC"
                  value={workExperience.currentCompany}
                  onChange={(e) =>
                    setWorkExperience({ ...workExperience, currentCompany: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-sm border border-gray-300 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber text-sm text-navy bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
                  Designation / Role
                </label>
                <input
                  type="text"
                  placeholder="e.g. Marine Engineer / Rig Supervisor / Welder"
                  value={workExperience.designation}
                  onChange={(e) =>
                    setWorkExperience({ ...workExperience, designation: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-sm border border-gray-300 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber text-sm text-navy bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
                  Notice Period
                </label>
                <input
                  type="text"
                  placeholder="e.g. 15 Days / Immediate / 1 Month"
                  value={workExperience.noticePeriod}
                  onChange={(e) =>
                    setWorkExperience({ ...workExperience, noticePeriod: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-sm border border-gray-300 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber text-sm text-navy bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
                  Key Technical & Practical Skills (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rigging, Safety Protocols, Hydraulic Systems, Offshore Welding, TIG/MIG"
                  value={workExperience.skills}
                  onChange={(e) =>
                    setWorkExperience({ ...workExperience, skills: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-sm border border-gray-300 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber text-sm text-navy bg-white"
                />
              </div>
            </motion.div>
          ) : (
            <div className="bg-amber/10 border border-amber/20 p-4 rounded-sm flex items-start gap-3">
              <CheckCircle2 className="text-amber shrink-0 mt-0.5" size={18} />
              <p className="text-xs text-navy leading-relaxed">
                As a <strong>Fresher</strong> applicant, comprehensive training, orientation, and industrial compliance certifications will be provided prior to project deployment. Please provide skills or interest areas above.
              </p>
            </div>
          )}
        </div>

        {/* Section 3: Educational Qualifications (Matching Apply.jsx exactly) */}
        <div>
          <div className="flex items-center gap-3 pb-3 border-b border-gray-200 mb-6">
            <div className="w-8 h-8 rounded-full bg-navy text-amber flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h2 className="text-xl font-heading font-bold text-navy flex items-center gap-2">
              <GraduationCap size={20} className="text-amber" />
              <span>Educational Qualifications</span>
            </h2>
          </div>

          {/* 10th / 12th / Intermediate */}
          <div className="mb-6 p-5 bg-slate-50 rounded-sm border border-gray-200">
            <h3 className="font-heading font-bold text-sm text-navy uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>12th / Intermediate / 10th Qualification</span>
              <span className="text-[11px] font-semibold text-amber bg-navy px-2 py-0.5 rounded-sm">
                Required
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
                  Qualification Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={education.tenthOrTwelfth.qualificationType}
                  onChange={(e) =>
                    setEducation({
                      ...education,
                      tenthOrTwelfth: {
                        ...education.tenthOrTwelfth,
                        qualificationType: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-3 rounded-sm border border-gray-300 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber text-sm text-navy bg-white"
                >
                  <option value="12th / Intermediate">12th / Intermediate (MPC/BPC/CEC)</option>
                  <option value="10th / SSC">10th / SSC / Matriculation</option>
                  <option value="Diploma / Polytechnic">Diploma / Polytechnic</option>
                  <option value="ITI / Vocational">ITI / Vocational Certificate</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
                  Board / Council <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. State Board / CBSE / ICSE / BIEAP"
                  value={education.tenthOrTwelfth.board}
                  onChange={(e) =>
                    setEducation({
                      ...education,
                      tenthOrTwelfth: {
                        ...education.tenthOrTwelfth,
                        board: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-3 rounded-sm border border-gray-300 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber text-sm text-navy bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
                  School / College Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sri Chaitanya Junior College / Govt High School"
                  value={education.tenthOrTwelfth.instituteName}
                  onChange={(e) =>
                    setEducation({
                      ...education,
                      tenthOrTwelfth: {
                        ...education.tenthOrTwelfth,
                        instituteName: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-3 rounded-sm border border-gray-300 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber text-sm text-navy bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
                  Year of Passing <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1980"
                  max={new Date().getFullYear()}
                  placeholder="e.g. 2022"
                  value={education.tenthOrTwelfth.yearOfPassing}
                  onChange={(e) =>
                    setEducation({
                      ...education,
                      tenthOrTwelfth: {
                        ...education.tenthOrTwelfth,
                        yearOfPassing: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-3 rounded-sm border border-gray-300 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber text-sm text-navy bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
                  Percentage / CGPA <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 85% or 8.5 CGPA"
                  value={education.tenthOrTwelfth.percentageOrCgpa}
                  onChange={(e) =>
                    setEducation({
                      ...education,
                      tenthOrTwelfth: {
                        ...education.tenthOrTwelfth,
                        percentageOrCgpa: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-3 rounded-sm border border-gray-300 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber text-sm text-navy bg-white"
                />
              </div>
            </div>
          </div>

          {/* Graduation / Highest Degree */}
          <div className="p-5 bg-slate-50 rounded-sm border border-gray-200">
            <h3 className="font-heading font-bold text-sm text-navy uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Graduation / Highest Degree / Diploma</span>
              <span className="text-[11px] font-semibold text-amber bg-navy px-2 py-0.5 rounded-sm">
                Required
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
                  Degree / Course <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B.Tech / B.Sc / B.Com / Diploma"
                  value={education.graduation.degree}
                  onChange={(e) =>
                    setEducation({
                      ...education,
                      graduation: {
                        ...education.graduation,
                        degree: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-3 rounded-sm border border-gray-300 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber text-sm text-navy bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
                  Specialization / Branch <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mechanical / Civil / Marine / Electrical"
                  value={education.graduation.specialization}
                  onChange={(e) =>
                    setEducation({
                      ...education,
                      graduation: {
                        ...education.graduation,
                        specialization: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-3 rounded-sm border border-gray-300 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber text-sm text-navy bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
                  University <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. JNTUK / Andhra University"
                  value={education.graduation.university}
                  onChange={(e) =>
                    setEducation({
                      ...education,
                      graduation: {
                        ...education.graduation,
                        university: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-3 rounded-sm border border-gray-300 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber text-sm text-navy bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
                  College Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ideal Institute of Technology"
                  value={education.graduation.collegeName}
                  onChange={(e) =>
                    setEducation({
                      ...education,
                      graduation: {
                        ...education.graduation,
                        collegeName: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-3 rounded-sm border border-gray-300 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber text-sm text-navy bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
                  Year of Passing <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1980"
                  max={new Date().getFullYear() + 2}
                  placeholder="e.g. 2024"
                  value={education.graduation.yearOfPassing}
                  onChange={(e) =>
                    setEducation({
                      ...education,
                      graduation: {
                        ...education.graduation,
                        yearOfPassing: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-3 rounded-sm border border-gray-300 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber text-sm text-navy bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
                  Percentage / CGPA <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 78% or 7.8 CGPA"
                  value={education.graduation.percentageOrCgpa}
                  onChange={(e) =>
                    setEducation({
                      ...education,
                      graduation: {
                        ...education.graduation,
                        percentageOrCgpa: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-3 rounded-sm border border-gray-300 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber text-sm text-navy bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Resume Upload (Optional for admin entry) */}
        <div>
          <div className="flex items-center gap-3 pb-3 border-b border-gray-200 mb-6">
            <div className="w-8 h-8 rounded-full bg-navy text-amber flex items-center justify-center font-bold text-sm">
              4
            </div>
            <h2 className="text-xl font-heading font-bold text-navy flex items-center gap-2">
              <FileText size={20} className="text-amber" />
              <span>Resume Document (Optional)</span>
            </h2>
          </div>

          <div className="border-2 border-dashed border-gray-300 hover:border-amber rounded-sm p-6 sm:p-8 text-center transition-colors bg-slate-50 relative">
            <input
              type="file"
              id="resume-upload"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-navy/10 text-navy flex items-center justify-center mb-3">
                <Upload size={24} />
              </div>
              {resumeFile ? (
                <div className="space-y-1">
                  <p className="font-heading font-bold text-navy text-sm flex items-center justify-center gap-1.5">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>{resumeFile.name}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB • Click or drag to replace
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="font-heading font-bold text-navy text-sm">
                    Click to browse or drag and drop candidate resume
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX (Max size: 5MB) • Optional for manual admin registration
                  </p>
                </div>
              )}
            </div>
          </div>

          {fileError && (
            <p className="text-xs text-rose-600 font-semibold mt-2 flex items-center gap-1">
              <AlertCircle size={14} />
              <span>{fileError}</span>
            </p>
          )}
        </div>

        {/* Section 5: Member Referral Details (Optional) */}
        <div className="bg-slate-50 border border-gray-200 rounded-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={referralDetails.isReferred}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setReferralDetails({ ...referralDetails, isReferred: checked });
                  if (checked) {
                    const disc = Number(referralDetails.discountAmount) || 150;
                    setPaymentDetails((prev) => ({
                      ...prev,
                      amount: String(Math.max(0, 1499 - disc)),
                    }));
                  } else {
                    setPaymentDetails((prev) => ({ ...prev, amount: '1499' }));
                  }
                }}
                className="w-4 h-4 text-amber border-gray-300 rounded focus:ring-amber cursor-pointer"
              />
              <span className="font-heading font-bold text-navy text-sm flex items-center gap-1.5">
                <Gift size={16} className="text-amber" />
                <span>Attach Member Referral Discount to this Registration</span>
              </span>
            </label>
            <span className="text-[11px] text-gray-500 font-medium">Optional</span>
          </div>

          {referralDetails.isReferred && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold uppercase text-[10px] mb-1">
                  Referrer Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={referralDetails.referrerName}
                  onChange={(e) =>
                    setReferralDetails({ ...referralDetails, referrerName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-amber text-navy text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold uppercase text-[10px] mb-1">
                  Referrer Mobile Number
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={referralDetails.referrerPhone}
                  onChange={(e) =>
                    setReferralDetails({ ...referralDetails, referrerPhone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-amber text-navy text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold uppercase text-[10px] mb-1">
                  Discount Amount (₹)
                </label>
                <input
                  type="number"
                  value={referralDetails.discountAmount}
                  onChange={(e) => {
                    const disc = e.target.value;
                    setReferralDetails({ ...referralDetails, discountAmount: disc });
                    setPaymentDetails((prev) => ({
                      ...prev,
                      amount: String(Math.max(0, 1499 - (Number(disc) || 0))),
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-amber text-navy text-xs font-bold bg-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 6: Verification & Status Settings */}
        <div className="bg-navy p-6 sm:p-8 rounded-sm text-white shadow-md border-t-4 border-amber space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-navy-light">
            <CreditCard size={20} className="text-amber" />
            <h2 className="font-heading font-bold text-amber text-base uppercase tracking-wider">
              6. Verification, Payment & Account Settings
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
            <div>
              <label className="block text-gray-300 font-semibold uppercase text-[10px] mb-1.5">
                Registration Amount (₹)
              </label>
              <input
                type="number"
                value={paymentDetails.amount}
                onChange={(e) =>
                  setPaymentDetails({ ...paymentDetails, amount: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-navy-dark border border-navy-light rounded-sm text-white font-bold text-xs focus:outline-none focus:border-amber"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold uppercase text-[10px] mb-1.5">
                Payment Status
              </label>
              <select
                value={paymentDetails.paymentStatus}
                onChange={(e) => {
                  const pStatus = e.target.value;
                  setPaymentDetails({ ...paymentDetails, paymentStatus: pStatus });
                  if (pStatus === 'RECEIVED' && applicationStatus === 'PAYMENT_PENDING') {
                    setApplicationStatus('PAYMENT_RECEIVED');
                  }
                }}
                className="w-full px-3.5 py-2.5 bg-navy-dark border border-navy-light rounded-sm text-white font-bold text-xs focus:outline-none focus:border-amber"
              >
                <option value="RECEIVED">RECEIVED (Direct Verified)</option>
                <option value="PENDING">PENDING</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 font-semibold uppercase text-[10px] mb-1.5">
                Transaction / Reference ID
              </label>
              <input
                type="text"
                placeholder="e.g. CASH_VERIFIED or UTR12345"
                value={paymentDetails.transactionId}
                onChange={(e) =>
                  setPaymentDetails({ ...paymentDetails, transactionId: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-navy-dark border border-navy-light rounded-sm text-white font-mono text-xs focus:outline-none focus:border-amber"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold uppercase text-[10px] mb-1.5">
                Initial Application Status
              </label>
              <select
                value={applicationStatus}
                onChange={(e) => setApplicationStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-navy-dark border border-navy-light rounded-sm text-white font-bold text-xs focus:outline-none focus:border-amber"
              >
                <option value="PAYMENT_RECEIVED">Payment Received</option>
                <option value="APPLICATION_PENDING">Application Pending (Under Review)</option>
                <option value="CONFIRMED">Confirmed / Selected</option>
                <option value="PAYMENT_PENDING">Payment Pending</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-gray-300 font-semibold uppercase text-[10px] mb-1.5">
                Admin Remarks / Note
              </label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-navy-dark border border-navy-light rounded-sm text-white text-xs focus:outline-none focus:border-amber"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="inline-flex items-center gap-2.5 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                className="w-4 h-4 text-amber rounded focus:ring-amber"
              />
              <span className="text-gray-200">
                Automatically generate temporary login password and dispatch welcome email to candidate
              </span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
          <Link
            to="/admin/applications"
            className="text-xs font-semibold text-gray-600 hover:text-navy transition-colors"
          >
            &larr; Return to Applications Directory
          </Link>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to="/admin/applications"
              className="w-1/2 sm:w-auto text-center px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-sm text-xs transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="w-1/2 sm:w-auto inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber-light text-navy font-bold px-8 py-3.5 rounded-sm text-sm transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 transform hover:-translate-y-0.5"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin" />
                  <span>Registering Entry...</span>
                </>
              ) : (
                <>
                  <PlusCircle size={16} />
                  <span>Register & Save Candidate Entry</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
