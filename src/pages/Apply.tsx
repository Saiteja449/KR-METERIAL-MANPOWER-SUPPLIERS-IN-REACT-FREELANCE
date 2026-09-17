import React, { useState } from 'react';
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
} from 'lucide-react';
import { AnimatedPage } from '../components/layout/AnimatedPage';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';

export function Apply() {
  const navigate = useNavigate();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [applicantType, setApplicantType] = useState<'fresher' | 'experienced'>('fresher');

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

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
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

      const res = await api.submitApplication(formData);

      if (res.success) {
        toast.success('Application submitted successfully! Redirecting to payment screen...');
        navigate(`/payment/${res.applicationId}`);
      }
    } catch (err: any) {
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

          {/* Section 5: Payment Notice & Submission */}
          <div className="bg-navy p-6 rounded-sm text-white space-y-4">
            <div className="flex items-start gap-3">
              <CreditCard className="text-amber shrink-0 mt-1" size={24} />
              <div>
                <h4 className="font-heading font-bold text-base text-amber-light">
                  Registration & Verification Fee: ₹1,000
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed mt-1">
                  Upon clicking submit, you will be redirected to the PhonePe QR Payment screen. After scanning and paying ₹1,000, submit your Transaction ID. Once verified by admin, your login credentials will be generated and emailed to you immediately.
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
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-amber hover:bg-amber-light text-navy font-bold px-8 py-4 rounded-sm transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed text-base transform hover:-translate-y-0.5"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-navy border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Application...</span>
                </>
              ) : (
                <>
                  <span>Submit & Proceed to Payment (₹1,000)</span>
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
