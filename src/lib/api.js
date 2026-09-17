const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('kr1_token');
  const headers = {
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If body is not FormData, add application/json content type
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle unauthorized (401)
    if (response.status === 401) {
      if (token && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('kr1_token');
        localStorage.removeItem('kr1_user');
        window.dispatchEvent(new Event('auth:logout'));
      }
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data.message || `Request failed with status ${response.status}`;
      const err = new Error(errorMsg);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  // Auth
  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getMe: () => request('/auth/me', { method: 'GET' }),

  changePassword: (passwords) =>
    request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwords),
    }),

  // Applications
  submitApplication: (formData) =>
    request('/applications', {
      method: 'POST',
      body: formData,
    }),

  getPublicApplication: (applicationId) =>
    request(`/applications/public/${applicationId}`, { method: 'GET' }),

  submitPayment: (applicationId, transactionId) =>
    request(`/applications/${applicationId}/payment`, {
      method: 'POST',
      body: JSON.stringify({ transactionId }),
    }),

  // PhonePe Payment Gateway (UPI & QR)
  createPayment: (applicationId) =>
    request('/payment/create', {
      method: 'POST',
      body: JSON.stringify({ applicationId }),
    }),

  getPaymentStatus: (merchantOrderId) =>
    request(`/payment/${merchantOrderId}/status`, { method: 'GET' }),

  getApplicationPaymentStatus: (applicationId) =>
    request(`/payment/application/${applicationId}/status`, { method: 'GET' }),

  getMyApplication: () => request('/applications/my', { method: 'GET' }),

  downloadMyResume: () => {
    const token = localStorage.getItem('kr1_token');
    window.open(`${API_BASE_URL}/applications/my/resume?token=${token}`, '_blank');
  },

  // Admin
  getAdminDashboard: () => request('/admin/dashboard', { method: 'GET' }),

  getAdminApplications: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, String(val));
      }
    });
    return request(`/admin/applications?${searchParams.toString()}`, { method: 'GET' });
  },

  getAdminApplicationById: (id) =>
    request(`/admin/applications/${id}`, { method: 'GET' }),

  updateApplicationStatus: (id, status, remarks) =>
    request(`/admin/applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, remarks }),
    }),

  createAdminApplication: (formData) =>
    request('/admin/applications', {
      method: 'POST',
      body: formData,
    }),

  getResumeDownloadUrl: (id) => {
    const token = localStorage.getItem('kr1_token');
    return `${API_BASE_URL}/admin/applications/${id}/resume?token=${token}`;
  },

  // Referral System & Discounts
  getReferralInfo: () => request('/applications/referral-info', { method: 'GET' }),

  validateReferral: (data) =>
    request('/applications/validate-referral', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAdminReferralSettings: () => request('/admin/settings/referral', { method: 'GET' }),

  updateAdminReferralSettings: (data) =>
    request('/admin/settings/referral', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  adjustCandidateDiscount: (id, data) =>
    request(`/admin/applications/${id}/discount`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};
