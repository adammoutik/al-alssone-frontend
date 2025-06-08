import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const fetchNotifications = async (params = {}) => {
  const response = await api.get('/notifications', { params });
  return response.data;
};

export const fetchNotificationStats = async () => {
  const response = await api.get('/notifications/stats');
  return response.data;
};

export const sendTestEmail = async (email: string) => {
  const response = await api.post('/notifications/test-email', { to: email });
  return response.data;
};

export const sendTestReminder = async () => {
  const response = await api.post('/notifications/test-payment-reminder');
  return response.data;
};

export const sendTestOverdue = async () => {
  const response = await api.post('/notifications/test-overdue');
  return response.data;
};

export const sendTestReceipt = async () => {
  const response = await api.post('/notifications/test-receipt');
  return response.data;
};