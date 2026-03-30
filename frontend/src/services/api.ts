const API_URL = import.meta.env.VITE_API_URL || '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erro desconhecido' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` };
}

// ---- Health ----
export const getHealth = () => request<{ status: string; database: string }>('/health');

// ---- Settings ----
export const getSettings = () => request<Record<string, string>>('/settings');

// ---- Bookings ----
export interface Booking {
  id: string;
  check_in: string;
  check_out: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

export interface CreateBookingData {
  check_in: string;
  check_out: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

export const getBookings = (from?: string, to?: string) => {
  const params = new URLSearchParams();
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  const qs = params.toString();
  return request<Booking[]>(`/bookings${qs ? `?${qs}` : ''}`);
};

export const createBooking = (data: CreateBookingData) =>
  request<Booking>('/bookings', { method: 'POST', body: JSON.stringify(data) });

export const updateBookingStatus = (id: string, status: string, token: string) =>
  request<Booking>(`/bookings/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
    headers: authHeaders(token),
  });

// ---- Availability ----
export interface AvailabilityResponse {
  from: string;
  to: string;
  unavailable_dates: string[];
  bookings: { check_in: string; check_out: string }[];
  blackouts: { date_from: string; date_to: string; reason: string }[];
}

export const getAvailability = (from?: string, to?: string) => {
  const params = new URLSearchParams();
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  const qs = params.toString();
  return request<AvailabilityResponse>(`/availability${qs ? `?${qs}` : ''}`);
};

// ---- Blackouts ----
export interface Blackout {
  id: string;
  date_from: string;
  date_to: string;
  reason: string;
  created_at: string;
}

export const getBlackouts = (token: string) =>
  request<Blackout[]>('/availability/blackouts', { headers: authHeaders(token) });

export const createBlackout = (data: { date_from: string; date_to: string; reason?: string }, token: string) =>
  request<Blackout>('/availability/blackouts', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: authHeaders(token),
  });

export const deleteBlackout = (id: string, token: string) =>
  request<{ message: string }>(`/availability/blackouts/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });

// ---- Admin ----
export const adminLogin = (email: string, password: string) =>
  request<{ token: string; admin: { id: string; email: string } }>('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
