// api/paymentService.ts
import axios from 'axios';

const API_URL = '/api/payments';

export const getPayments = async (params?: {
  studentId?: string;
  familyId?: string;
  period?: string;
}) => {
  try {
    const response = await axios.get(API_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
};

export const getPaymentDetails = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment details:', error);
    throw error;
  }
};

export const createPayment = async (paymentData: any) => {
  try {
    const response = await axios.post(API_URL, paymentData);
    return response.data;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};