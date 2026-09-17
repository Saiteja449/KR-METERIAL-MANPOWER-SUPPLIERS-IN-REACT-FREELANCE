import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Shield,
  CreditCard,
  Gift,
  Tag,
  Percent,
} from 'lucide-react';
import { AnimatedPage } from '../components/layout/AnimatedPage';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';

export function Apply() {
  const navigate = useNavigate();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);

  // Referral State
  const [referralConfig, setReferralConfig] = useState({
    isReferralEnabled: true,
    referralDiscount: 200,
    baseApplicationFee: 1000,
  });
  const [hasReferral, setHasReferral] = useState(false);
  const [referrerName, setReferrerName] = useState('');
  const [referrerPhone, setReferrerPhone] = useState('');
  const [isReferralVerified, setIsReferralVerified] = useState(false);
  const [verifyingReferral, setVerifyingReferral] = useState(false);
  const [verifiedReferralInfo, setVerifiedReferralInfo] = useState(null);
  const [referralError, setReferralError] = useState('');

  useEffect(() => {
    const fetchReferralInfo = async () => {
      try {
        const res = await api.getReferralInfo();
        if (res.success) {
          setReferralConfig({
            isReferralEnabled: res.isReferralEnabled ?? true,
            referralDiscount: res.referralDiscount ?? 200,
            baseApplicationFee: res.baseApplicationFee ?? 1000,
          });
        }
      } catch (e) {
        // Fallback to defaults
      }
    };
    fetchReferralInfo();
  }, []);

  // Form State
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

  const handleVerifyReferral = async () => {
    setReferralError('');
    if (!referrerName.trim()) {
      setReferralError("Please enter the referrer's full registered name.");
      toast.error("Please enter the referrer's full registered name.");
      return;
    }
    const cleanPhone = referrerPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setReferralError('Please enter a valid 10-digit mobile number for the referrer.');
      toast.error('Please enter a valid 10-digit mobile number.');
      return;
    }

    try {
      setVerifyingReferral(true);
      const res = await api.validateReferral({
        referrerName: referrerName.trim(),
        referrerPhone: referrerPhone.trim(),
        candidatePhone: personalDetails.phone.trim(),
        candidateEmail: personalDetails.email.trim(),
      });

      if (res.isValid) {
        setIsReferralVerified(true);
        setVerifiedReferralInfo(res);
        setReferralError('');
        toast.success(res.message || 'Referral successfully verified!');
      } else {
        setIsReferralVerified(false);
        setVerifiedReferralInfo(null);
        setReferralError(res.message || 'Referral could not be verified.');
        toast.error(res.message || 'Referral could not be verified.');
      }
    } catch (err) {
      setIsReferralVerified(false);
      setVerifiedReferralInfo(null);
      setReferralError(err.message || 'Failed to verify referral.');
      toast.error(err.message || 'Failed to verify referral.');
    } finally {
      setVerifyingReferral(false);
    }
  };

  const baseFee = referralConfig.baseApplicationFee || 1000;
  const discountApplied =
    hasReferral && isReferralVerified
      ? verifiedReferralInfo?.discountAmount || referralConfig.referralDiscount
      : 0;
  const payableFee = Math.max(0, baseFee - discountApplied);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!personalDetails.fullName.trim()) {
      toast.error('Please enter your full name.');
      return;
    }
    if (!personalDetails.email.trim() || !personalDetails.email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (!personalDetails.phone.trim() || personalDetails.phone.length < 10) {
      toast.error('Please enter a valid 10-digit phone number.');
      return;
    }
    if (!personalDetails.address.trim() || !personalDetails.city.trim() || !personalDetails.state.trim() || !personalDetails.pincode.trim()) {
      toast.error('Please complete your full residential address details.');
      return;
    }

    if (applicantType === 'experienced' && !workExperience.totalExperience.trim()) {
      toast.error('Please specify your total work experience.');
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
      toast.error('Please complete all Graduation / Diploma details.');
      return;
    }

    if (!resumeFile) {
      toast.error('Resume attachment is required. Please upload your resume.');
      return;
    }

    if (hasReferral && !isReferralVerified) {
      toast.error('Please click "Verify Referral" to validate your referrer before submitting.');
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
      formData.append('resume', resumeFile);

      if (hasReferral && isReferralVerified) {
        formData.append(
          'referral',
          JSON.stringify({
            isReferred: true,
            referrerName: verifiedReferralInfo?.referrerName || referrerName.trim(),
            referrerPhone: referrerPhone.trim(),
            referrerApplicationId: verifiedReferralInfo?.referrerApplicationId || '',
            discountAmount: discountApplied,
          })
        );
      } else {
        formData.append('referral', JSON.stringify({ isReferred: false }));
      }

      const res = await api.submitApplication(formData);

      if (res.success) {
        toast.success('Application submitted successfully! Redirecting to payment screen...');
        navigate(`/payment/${res.applicationId}`);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit application. Please check your inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatedPage className="bg-slate-light min-h-screen pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber/10 border border-amber/30 text-amber-dark text-xs font-bold uppercase tracking-wider mb-3"
          >
            <Shield size={14} className="text-amber" />
            <span>Official Candidate Portal Registration</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-heading font-extrabold text-navy tracking-tight"
          >
            Apply for Industrial & Marine Deployment
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 mt-2 text-sm sm:text-base max-w-2xl mx-auto"
          >
            Register your profile with KR Material & Manpower Suppliers. Complete your application and verification to access deployed projects and roles.
          </motion.p>
        </div>

        {/* Form Container */}
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

          {/* Section 2: Career Information */}
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
                  className={`py-3.5 px-4 rounded-sm border text-center font-heading font-bold text-sm transition-all ${
                    applicantType === 'fresher'
                      ? 'bg-navy text-amber border-navy shadow-md'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-navy-light'
                  }`}
                >
                  Fresher (Entry Level)
                </button>
                <button
                  type="button"
                  onClick={() => setApplicantType('experienced')}
                  className={`py-3.5 px-4 rounded-sm border text-center font-heading font-bold text-sm transition-all ${
                    applicantType === 'experienced'
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
                  As a <strong>Fresher</strong> applicant, comprehensive training, orientation, and industrial compliance certifications will be provided prior to project deployment. Please provide your skills or interest areas below.
                </p>
              </div>
            )}
          </div>

          {/* Section 3: Educational Qualifications */}
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

            {/* Graduation / Degree */}
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

          {/* Section 4: Resume Upload */}
          <div>
            <div className="flex items-center gap-3 pb-3 border-b border-gray-200 mb-6">
              <div className="w-8 h-8 rounded-full bg-navy text-amber flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h2 className="text-xl font-heading font-bold text-navy flex items-center gap-2">
                <FileText size={20} className="text-amber" />
                <span>Resume Upload</span>
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
                      Click to browse or drag and drop your resume
                    </p>
                    <p className="text-xs text-gray-500">
                      Supported formats: PDF, DOC, DOCX (Max size: 5MB)
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

          {/* Section 5: Member Referral & Discount (Optional) */}
          {referralConfig.isReferralEnabled && (
            <div className="border border-amber/40 bg-gradient-to-br from-amber/5 via-white to-amber/10 rounded-sm p-6 sm:p-7 relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-amber/20 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber/20 text-amber-dark flex items-center justify-center font-bold">
                    <Gift size={18} className="text-amber-dark" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-navy text-base flex items-center gap-2">
                      <span>Employee / Member Referral Discount</span>
                      <span className="text-[11px] bg-amber text-navy font-extrabold px-2 py-0.5 rounded-full">
                        Save ₹{referralConfig.referralDiscount}
                      </span>
                    </h3>
                    <p className="text-xs text-gray-500">
                      Referred by an existing KR registered member or employee? Enter their details to receive an instant ₹{referralConfig.referralDiscount} discount.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hasReferral}
                    onChange={(e) => {
                      setHasReferral(e.target.checked);
                      if (!e.target.checked) {
                        setIsReferralVerified(false);
                        setVerifiedReferralInfo(null);
                        setReferralError('');
                      }
                    }}
                    className="w-4 h-4 text-amber border-gray-300 rounded focus:ring-amber cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-navy">
                    I was referred by an existing KR registered member / employee
                  </span>
                </label>

                {hasReferral && (
                  <div className="mt-4 p-4 sm:p-5 bg-white rounded-sm border border-gray-200 shadow-xs space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
                          Referrer Full Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Rahul Sharma"
                          value={referrerName}
                          onChange={(e) => {
                            setReferrerName(e.target.value);
                            setIsReferralVerified(false);
                            setVerifiedReferralInfo(null);
                            setReferralError('');
                          }}
                          className="w-full px-3.5 py-2.5 rounded-sm border border-gray-300 focus:outline-none focus:border-amber text-sm text-navy"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
                          Referrer Mobile Number <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          placeholder="e.g. 9876543210"
                          value={referrerPhone}
                          onChange={(e) => {
                            setReferrerPhone(e.target.value);
                            setIsReferralVerified(false);
                            setVerifiedReferralInfo(null);
                            setReferralError('');
                          }}
                          className="w-full px-3.5 py-2.5 rounded-sm border border-gray-300 focus:outline-none focus:border-amber text-sm text-navy"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleVerifyReferral}
                        disabled={verifyingReferral || !referrerName.trim() || !referrerPhone.trim()}
                        className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-amber font-bold px-4 py-2 rounded-sm text-xs transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {verifyingReferral ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-amber border-t-transparent rounded-full animate-spin" />
                            <span>Verifying Referrer...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={14} />
                            <span>Verify Referral</span>
                          </>
                        )}
                      </button>

                      {isReferralVerified && verifiedReferralInfo && (
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-sm">
                          <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                          <span>
                            ✓ Referral Verified! Referred by {verifiedReferralInfo.referrerName} (₹{verifiedReferralInfo.discountAmount} discount applied)
                          </span>
                        </div>
                      )}
                    </div>

                    {referralError && (
                      <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-sm flex items-start gap-2">
                        <AlertCircle size={15} className="shrink-0 mt-0.5" />
                        <span>{referralError}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section 6: Payment Notice & Submission */}
          <div className="bg-navy p-6 rounded-sm text-white space-y-4">
            <div className="flex items-start gap-3">
              <CreditCard className="text-amber shrink-0 mt-1" size={24} />
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-navy-light/60 pb-3">
                  <div>
                    <h4 className="font-heading font-bold text-base text-amber-light">
                      Registration & Verification Fee
                    </h4>
                    <span className="text-xs text-gray-300">
                      Standard fee: ₹{baseFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    {discountApplied > 0 && (
                      <span className="text-xs text-gray-400 line-through mr-2">
                        ₹{baseFee.toLocaleString()}
                      </span>
                    )}
                    <span className="text-2xl sm:text-3xl font-heading font-extrabold text-amber">
                      ₹{payableFee.toLocaleString()}
                    </span>
                  </div>
                </div>

                {discountApplied > 0 && (
                  <div className="flex items-center justify-between text-xs py-2 text-emerald-400 font-semibold border-b border-navy-light/40">
                    <span className="flex items-center gap-1.5">
                      <Gift size={13} />
                      <span>Member Referral Discount Applied:</span>
                    </span>
                    <span>-₹{discountApplied.toLocaleString()}</span>
                  </div>
                )}

                <p className="text-xs text-gray-300 leading-relaxed mt-2.5">
                  Upon clicking submit, you will be redirected to the secure PhonePe Payment Gateway to pay the fee of ₹{payableFee.toLocaleString()} using any UPI app or Dynamic QR code. Once confirmed, your candidate login credentials will be generated and emailed to you automatically.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
            <Link
              to="/login"
              className="text-xs font-semibold text-navy hover:text-amber transition-colors"
            >
              Already submitted? Track status / Login here &rarr;
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-amber hover:bg-amber-light text-navy font-bold px-8 py-4 rounded-sm transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed text-base transform hover:-translate-y-0.5 cursor-pointer"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-navy border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Application...</span>
                </>
              ) : (
                <>
                  <span>Submit & Proceed to Payment (₹{payableFee.toLocaleString()})</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AnimatedPage>
  );
}
