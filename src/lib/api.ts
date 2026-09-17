const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}

export async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('kr1_token');
  const headers: HeadersInit = {
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  // If body is not FormData, add application/json content type
  if (options.body && !(options.body instanceof FormData)) {
    (headers as Record<string, string>)['Content-Type'] = 'application/json';
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
      (err as any).status = response.status;
      (err as any).data = data;
      throw err;
    }

    return data as T;
  } catch (error: any) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  // Auth
  login: (credentials: { email: string; password: string }) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getMe: () => request('/auth/me', { method: 'GET' }),

  changePassword: (passwords: { currentPassword: string; newPassword: string }) =>
    request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwords),
    }),

  // Applications
  submitApplication: (formData: FormData) =>
    request('/applications', {
      method: 'POST',
      body: formData,
    }),

  getPublicApplication: (applicationId: string) =>
    request(`/applications/public/${applicationId}`, { method: 'GET' }),

  submitPayment: (applicationId: string, transactionId: string) =>
    request(`/applications/${applicationId}/payment`, {
      method: 'POST',
      body: JSON.stringify({ transactionId }),
    }),

  getMyApplication: () => request('/applications/my', { method: 'GET' }),

  downloadMyResume: () => {
    const token = localStorage.getItem('kr1_token');
    window.open(`${API_BASE_URL}/applications/my/resume?token=${token}`, '_blank');
  },

  // Admin
  getAdminDashboard: () => request('/admin/dashboard', { method: 'GET' }),

  getAdminApplications: (params: {
    search?: string;
    status?: string;
    applicantType?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, String(val));
      }
    });
    return request(`/admin/applications?${searchParams.toString()}`, { method: 'GET' });
  },

  getAdminApplicationById: (id: string) =>
    request(`/admin/applications/${id}`, { method: 'GET' }),

  updateApplicationStatus: (id: string, status: string, remarks?: string) =>
    request(`/admin/applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, remarks }),
    }),

  createAdminApplication: (formData: FormData) =>
    request('/admin/applications', {
      method: 'POST',
      body: formData,
    }),

  getResumeDownloadUrl: (id: string) => {
    const token = localStorage.getItem('kr1_token');
    return `${API_BASE_URL}/admin/applications/${id}/resume?token=${token}`;
  },
};
