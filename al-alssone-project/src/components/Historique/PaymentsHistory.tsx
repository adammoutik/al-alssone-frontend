// src/components/PaymentsHistory.tsx
import React, { useState, useEffect } from 'react';
import api from '../../services/axios';
import { FaTrash, FaEye, FaSpinner, FaSearch, FaSync } from 'react-icons/fa';

interface Payment {
  _id: string;
  studentId: string;
  amount: number;
  period: string;
  status: 'paid' | 'unpaid' | 'overdue';
  isArchived: boolean;
  archivedAt?: string;
  studentName?: string;
}

const PaymentsHistory = () => {
  const [allPayments, setAllPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter to show only archived payments
  const archivedPayments = allPayments.filter(payment => payment.isArchived);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/payments');
      setAllPayments(response.data);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
      alert("Error loading payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Filter by search term
  const filteredPayments = archivedPayments.filter(payment => 
    `${payment.studentName} ${payment.period} ${payment.status}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center p-8"><FaSpinner className="animate-spin text-2xl" /></div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Archived Payments History</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search..."
            className="border p-2 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            onClick={fetchPayments}
            className="bg-blue-500 text-white p-2 rounded"
          >
            <FaSync />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4">Student</th>
              <th className="py-2 px-4">Amount</th>
              <th className="py-2 px-4">Period</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Archived On</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map(payment => (
              <tr key={payment._id} className="border-b">
                <td className="py-2 px-4">{payment.studentName || `Student ${payment.studentId.slice(-4)}`}</td>
                <td className="py-2 px-4">{payment.amount} MAD</td>
                <td className="py-2 px-4">{payment.period}</td>
                <td className="py-2 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                    payment.status === 'overdue' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {payment.status}
                  </span>
                </td>
                <td className="py-2 px-4">
                  {payment.archivedAt ? new Date(payment.archivedAt).toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsHistory;