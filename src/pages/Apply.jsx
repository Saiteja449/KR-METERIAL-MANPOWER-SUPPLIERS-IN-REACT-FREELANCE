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
  QrCode,
  Copy,
  Check,
  Smartphone,
  ShieldCheck,
  HelpCircle,
  IndianRupee,
} from 'lucide-react';
import { AnimatedPage } from '../components/layout/AnimatedPage';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';

// Payment UPI Constants
const UPI_ID = import.meta.env.VITE_UPI_ID || '9666193543@ybl';
const QR_IMAGE_PATH = '/assets/images/image.png';

export function Apply() {
  const navigate = useNavigate();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);

  // Payment Transaction ID / UTR State
  const [transactionId, setTransactionId] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_ID).then(() => {
      setCopiedUpi(true);
      toast.success('UPI ID copied to clipboard!');
      setTimeout(() => setCopiedUpi(false), 2500);
    });
  };

  // Referral State
  const [referralConfig, setReferralConfig] = useState({
    isReferralEnabled: true,
    referralDiscountPercent: 10,
    referralDiscount: 150,
    baseApplicationFee: 1499,
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
            referralDiscountPercent: res.referralDiscountPercent ?? 10,
            referralDiscount: res.referralDiscount ?? 150,
            baseApplicationFee: res.baseApplicationFee ?? 1499,
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
    qualificationLevel: '12th / Intermediate',
    instituteName: '',
    boardOrUniversity: '',
    yearOfPassing: '',
    percentageOrCgpa: '',
    specialization: '',
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

  const baseFee = referralConfig.baseApplicationFee || 1499;
  const discountPercent = referralConfig.referralDiscountPercent || 10;
  const discountAmount = Math.round((baseFee * discountPercent) / 100);
  const isReferralActive = hasReferral && (isReferralVerified || (referrerName.trim() && referrerPhone.trim().replace(/\D/g, '').length >= 10));
  const discountApplied = isReferralActive ? discountAmount : 0;
  const payableFee = Math.max(0, baseFee - discountApplied);

  const handleVerifyReferral = async () => {
    setReferralError('');
    if (!referrerName.trim()) {
      setReferralError("Please enter the referrer's name.");
      toast.error("Please enter the referrer's name.");
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
        toast.success(res.message || '10% referral discount applied!');
      } else {
        setIsReferralVerified(false);
        setVerifiedReferralInfo(null);
        setReferralError(res.message || 'Referral could not be applied.');
        toast.error(res.message || 'Referral could not be applied.');
      }
    } catch (err) {
      // Since anyone can refer, accept details and apply discount
      setIsReferralVerified(true);
      setVerifiedReferralInfo({
        referrerName: referrerName.trim(),
        referrerPhone: cleanPhone,
        discountAmount,
      });
      setReferralError('');
      toast.success(`10% referral discount applied! (-₹${discountAmount})`);
    } finally {
      setVerifyingReferral(false);
    }
  };

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
      !education.instituteName.trim() ||
      !education.boardOrUniversity.trim() ||
      !education.yearOfPassing ||
      !education.percentageOrCgpa.trim()
    ) {
      toast.error('Please complete all fields in the Educational Qualifications section.');
      return;
    }

    if (!resumeFile) {
      toast.error('Resume attachment is required. Please upload your resume.');
      return;
    }

    if (hasReferral) {
      if (!referrerName.trim()) {
        toast.error('Please enter the name of the person who referred you.');
        return;
      }
      const cleanRefPhone = referrerPhone.replace(/\D/g, '');
      if (!cleanRefPhone || cleanRefPhone.length < 10) {
        toast.error('Please enter a valid 10-digit mobile number for the referrer.');
        return;
      }
    }

    // Payment Transaction ID / UTR Validation
    if (!transactionId.trim()) {
      toast.error('Payment Transaction ID / UTR number is required. Please complete UPI payment and enter your UTR.');
      const txnInput = document.getElementById('transaction-id-input');
      if (txnInput) {
        txnInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        txnInput.focus();
      }
      return;
    }

    if (transactionId.trim().length < 8) {
      toast.error('Transaction ID appears too short. Please enter a valid Transaction ID / UTR number.');
      const txnInput = document.getElementById('transaction-id-input');
      if (txnInput) {
        txnInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        txnInput.focus();
      }
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
      formData.append('transactionId', transactionId.trim().toUpperCase());

      if (hasReferral && referrerName.trim() && referrerPhone.trim().replace(/\D/g, '').length >= 10) {
        formData.append(
          'referral',
          JSON.stringify({
            isReferred: true,
            referrerName: referrerName.trim(),
            referrerPhone: referrerPhone.trim(),
            referrerApplicationId: verifiedReferralInfo?.referrerApplicationId || '',
            discountAmount: discountAmount,
          })
        );
      } else {
        formData.append('referral', JSON.stringify({ isReferred: false }));
      }

      const res = await api.submitApplication(formData);

      if (res.success) {
        toast.success('Application and payment details submitted successfully! Awaiting verification.');
        navigate(`/payment/${res.applicationId}`);
      }
    } catch (err) {
      if (err.data?.applicationId) {
        toast.error(`${err.message} Redirecting to your payment tracking screen...`);
        navigate(`/payment/${err.data.applicationId}`);
      } else {
        toast.error(err.message || 'Failed to submit application. Please check your inputs.');
      }
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
            Register your profile with KR1 Material & Manpower Suppliers. Complete your application and verification to access deployed projects and roles.
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

            {/* Single Highest Education Section */}
            <div className="p-5 bg-slate-50 rounded-sm border border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Qualification Level */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
                    Highest Qualification Level <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={education.qualificationLevel}
                    onChange={(e) => setEducation({ ...education, qualificationLevel: e.target.value })}
                    className="w-full px-4 py-3 rounded-sm border border-gray-300 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber text-sm text-navy bg-white"
                  >
                    <option value="Below 10th">Below 10th</option>
                    <option value="10th / SSC">10th / SSC / Matriculation</option>
                    <option value="12th / Intermediate">12th / Intermediate (MPC / BPC / CEC)</option>
                    <option value="ITI / Vocational">ITI / Vocational Certificate</option>
                    <option value="Diploma / Polytechnic">Diploma / Polytechnic</option>
                    <option value="Graduate (B.Tech / B.Sc / B.Com etc.)">Graduate (B.Tech / B.Sc / B.Com etc.)</option>
                    <option value="Post Graduate (M.Tech / MBA / M.Sc etc.)">Post Graduate (M.Tech / MBA / M.Sc etc.)</option>
                  </select>
                </div>

                {/* Institution Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
                    School / College / Institute Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Govt High School / Sri Chaitanya Junior College / JNTUK"
                    value={education.instituteName}
                    onChange={(e) => setEducation({ ...education, instituteName: e.target.value })}
                    className="w-full px-4 py-3 rounded-sm border border-gray-300 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber text-sm text-navy bg-white"
                  />
                </div>

                {/* Board / University */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
                    Board / University / Council <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. State Board / CBSE / JNTUK / Andhra University"
                    value={education.boardOrUniversity}
                    onChange={(e) => setEducation({ ...education, boardOrUniversity: e.target.value })}
                    className="w-full px-4 py-3 rounded-sm border border-gray-300 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber text-sm text-navy bg-white"
                  />
                </div>

                {/* Specialization (optional) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
                    Specialization / Stream
                    <span className="text-[11px] font-normal text-gray-400 ml-1">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mechanical / MPC / Marine / Electrical"
                    value={education.specialization}
                    onChange={(e) => setEducation({ ...education, specialization: e.target.value })}
                    className="w-full px-4 py-3 rounded-sm border border-gray-300 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber text-sm text-navy bg-white"
                  />
                </div>

                {/* Year of Passing */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
                    Year of Passing <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1970"
                    max={new Date().getFullYear() + 2}
                    placeholder="e.g. 2022"
                    value={education.yearOfPassing}
                    onChange={(e) => setEducation({ ...education, yearOfPassing: e.target.value })}
                    className="w-full px-4 py-3 rounded-sm border border-gray-300 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber text-sm text-navy bg-white"
                  />
                </div>

                {/* Percentage / CGPA */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
                    Percentage / CGPA <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 78% or 7.8 CGPA"
                    value={education.percentageOrCgpa}
                    onChange={(e) => setEducation({ ...education, percentageOrCgpa: e.target.value })}
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
                      <span>Referral Program Discount</span>
                      <span className="text-[11px] bg-amber text-navy font-extrabold px-2 py-0.5 rounded-full">
                        10% Discount (Save ₹{discountAmount})
                      </span>
                    </h3>
                    <p className="text-xs text-gray-500">
                      Were you referred by someone (friend, relative, colleague, or member)? Enter their details below to receive an instant 10% discount!
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
                    I was referred by someone (Friend / Colleague / Member)
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
                            <span>Applying 10% Discount...</span>
                          </>
                        ) : (
                          <>
                            <Percent size={14} />
                            <span>Apply 10% Discount</span>
                          </>
                        )}
                      </button>

                      {isReferralActive && (
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-sm">
                          <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                          <span>
                            ✓ 10% Referral Discount Applied! (-₹{discountAmount})
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

          {/* Section 5: Registration Fee Payment & Transaction Details (Mandatory) */}
          <div className="bg-white rounded-sm border-2 border-navy/20 shadow-lg overflow-hidden">
            {/* Header / Fee Summary */}
            <div className="bg-navy p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber text-navy flex items-center justify-center font-bold text-sm shrink-0">
                  5
                </div>
                <div>
                  <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                    <CreditCard size={20} className="text-amber" />
                    <span>Registration Fee Payment</span>
                  </h3>
                  <span className="text-xs text-gray-300">
                    Mandatory one-time registration and verification fee
                  </span>
                </div>
              </div>

              <div className="sm:text-right bg-navy-dark/70 px-4 py-3 rounded-sm border border-navy-light/60">
                <span className="text-xs text-gray-300 block">Total Payable Fee</span>
                <div className="flex items-baseline sm:justify-end gap-2">
                  {discountApplied > 0 && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{baseFee.toLocaleString()}
                    </span>
                  )}
                  <span className="text-2xl sm:text-3xl font-heading font-extrabold text-amber">
                    ₹{payableFee.toLocaleString()}
                  </span>
                </div>
                {discountApplied > 0 && (
                  <span className="text-[11px] text-emerald-400 font-semibold block mt-0.5">
                    ✓ ₹{discountApplied} Referral Discount Applied
                  </span>
                )}
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* QR Code and Instructions Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start border border-gray-200 rounded-sm p-5 bg-slate-50/70">
                {/* QR Code Side */}
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center gap-2 mb-3 bg-[#5f259f] text-white px-3 py-1.5 rounded-sm text-xs font-bold self-center shadow-xs">
                    <Smartphone size={13} />
                    <span>PhonePe / GPay / Any UPI App</span>
                  </div>

                  <div className="w-56 h-56 bg-white p-2.5 border-2 border-gray-300 rounded-sm shadow-sm flex items-center justify-center">
                    <img
                      src={QR_IMAGE_PATH}
                      alt="PhonePe UPI Payment QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <span className="text-xs font-semibold text-navy mt-3">
                    Scan with any UPI app on your phone
                  </span>
                  <span className="text-[11px] text-gray-600 mt-0.5">
                    Amount to Pay:{' '}
                    <strong className="text-navy font-bold">₹{payableFee.toLocaleString()}</strong>
                  </span>
                </div>

                {/* Step-by-Step Instructions */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-heading font-bold text-navy text-sm flex items-center gap-2 mb-2.5">
                      <QrCode size={16} className="text-amber shrink-0" />
                      <span>How to Complete Payment</span>
                    </h4>
                    <ol className="space-y-2 text-xs text-gray-700 list-decimal list-inside leading-relaxed">
                      <li>
                        Open <strong>PhonePe</strong>, <strong>Google Pay</strong>, or any UPI app.
                      </li>
                      <li>
                        Scan the <strong>QR Code</strong> on the left, or pay to the UPI ID below.
                      </li>
                      <li>
                        Enter exact amount:{' '}
                        <strong className="text-navy">₹{payableFee.toLocaleString()}</strong>.
                      </li>
                      <li>
                        After paying, copy the <strong>12-digit UTR / Transaction ID</strong> from your UPI confirmation receipt.
                      </li>
                      <li>
                        Paste the UTR number in the box below before clicking submit.
                      </li>
                    </ol>
                  </div>

                  {/* UPI ID Box */}
                  <div className="pt-2 border-t border-gray-200">
                    <span className="text-[11px] text-gray-500 font-semibold block mb-1.5">
                      Direct UPI ID:
                    </span>
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-sm border border-gray-300">
                      <CreditCard size={15} className="text-[#5f259f] shrink-0" />
                      <span className="font-mono font-bold text-navy text-xs flex-1 truncate">
                        {UPI_ID}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="flex items-center gap-1.5 px-3 py-1 bg-navy text-amber hover:bg-navy-light rounded-sm text-xs font-bold transition-colors cursor-pointer"
                        title="Copy UPI ID"
                      >
                        {copiedUpi ? <Check size={13} /> : <Copy size={13} />}
                        <span>{copiedUpi ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction ID / UTR Input */}
              <div className="space-y-2">
                <label
                  htmlFor="transaction-id-input"
                  className="block text-xs font-bold uppercase tracking-wider text-navy"
                >
                  Enter 12-Digit Payment Transaction ID / UTR Number{' '}
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="transaction-id-input"
                    type="text"
                    required
                    placeholder="e.g. 423987123456 or T24083015..."
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3.5 rounded-sm border-2 border-gray-300 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber text-sm font-mono text-navy font-bold tracking-wide"
                  />
                </div>
                <p className="text-[11px] text-gray-500 flex items-center gap-1">
                  <HelpCircle size={12} className="text-gray-400 shrink-0" />
                  <span>
                    Your 12-digit UTR is visible on your PhonePe / Google Pay / Bank receipt after transferring ₹{payableFee.toLocaleString()}.
                  </span>
                </p>
              </div>

              {/* Trust Footer */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-gray-500 pt-3 border-t border-gray-100">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={13} className="text-emerald-600" />
                  <span>Administrative Verification Required</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <IndianRupee size={13} className="text-amber" />
                  <span>One-time Registration Fee</span>
                </span>
                <span>•</span>
                <span>Support: +91 9666193543 | info@kr1.in</span>
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
                  <span>Submitting Application & Payment...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={20} />
                  <span>Submit Application & Payment (₹{payableFee.toLocaleString()})</span>
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
