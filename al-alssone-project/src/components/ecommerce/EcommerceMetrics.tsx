import React, { useState, useEffect } from 'react';
// import { GroupIcon, AlertIcon, PaymentIcon } from "../../icons";
import api from "../../services/axios";
import { GroupIcon } from 'lucide-react';
import { AlertIcon } from '../../icons';

interface Notification {
  _id: string;
  status: 'paid' | 'unpaid' | 'overdue';
  message: string;
  studentName: string;
  createdAt: string;
  amount?: number;
}

interface Payment {
  _id: string;
  studentName: string;
  amount?: number;
  dueDate: string;
  status: 'paid' | 'unpaid' | 'overdue';
}

interface DashboardProps {
  username: string;
}

const EcommerceMetrics: React.FC<DashboardProps> = ({ username }) => {
  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    unpaidStudents: 0,
    unpaidPayments: 0,
    totalUnpaidAmount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [upcomingPayments, setUpcomingPayments] = useState<Payment[]>([]);

  // Status colors
  const statusColors = {
    paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    unpaid: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setError(null);
        const [studentsRes, paymentsRes, notificationsRes] = await Promise.all([
          api.get('/students'),
          api.get('/payments'),
          api.get('/notifications')
        ]);

        const unpaidPayments = paymentsRes.data.filter(p => p.status === 'unpaid');
        const overduePayments = paymentsRes.data.filter(p => p.status === 'overdue');
        const totalUnpaidAmount = [...unpaidPayments, ...overduePayments]
          .reduce((sum, payment) => sum + (payment.amount || 0), 0);

        setMetrics({
          totalStudents: studentsRes.data.length,
          unpaidStudents: studentsRes.data.filter(
            student => paymentsRes.data.some(
              p => p.studentId === student._id && (p.status === 'unpaid' || p.status === 'overdue')
            )
          ).length,
          unpaidPayments: unpaidPayments.length + overduePayments.length,
          totalUnpaidAmount
        });

        // Process payments
        const sortedPayments = [...paymentsRes.data]
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
          .map(payment => ({
            ...payment,
            studentName: studentsRes.data.find(s => s._id === payment.studentId)?.name || 'Unknown',
            amount: payment.amount || 0
          }));

        setUpcomingPayments(sortedPayments);

        // Process notifications
        const notificationsWithNames = notificationsRes.data.map(notification => ({
          ...notification,
          studentName: studentsRes.data.find(s => s._id === notification.studentId)?.name || 'Unknown',
          amount: notification.amount || 0
        }));

        setNotifications(notificationsWithNames.slice(0, 5));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Dashboard data error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-xl max-w-2xl mx-auto mt-8">
        <h3 className="text-lg font-medium text-red-800 dark:text-red-200">Error loading dashboard</h3>
        <p className="mt-2 text-red-700 dark:text-red-300">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back, {username}</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Total Students */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xs border border-gray-100 dark:border-gray-700 p-4 transition-all hover:shadow-sm">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 dark:bg-gray-700 mr-4">
              <GroupIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Students</p>
              <h4 className="text-xl font-semibold text-gray-800 dark:text-white">
                {loading ? '...' : metrics.totalStudents.toLocaleString()}
              </h4>
            </div>
          </div>
        </div>

        {/* Unpaid Students */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xs border border-gray-100 dark:border-gray-700 p-4 transition-all hover:shadow-sm">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-50 dark:bg-gray-700 mr-4">
              <AlertIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Unpaid Students</p>
              <h4 className="text-xl font-semibold text-gray-800 dark:text-white">
                {loading ? '...' : metrics.unpaidStudents.toLocaleString()}
              </h4>
            </div>
          </div>
        </div>

        {/* Unpaid Payments */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xs border border-gray-100 dark:border-gray-700 p-4 transition-all hover:shadow-sm">
          <div className="flex items-center">
             <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-50 dark:bg-gray-700 mr-4">
              <AlertIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Unpaid Payments</p>
              <h4 className="text-xl font-semibold text-gray-800 dark:text-white">
                {loading ? '...' : metrics.unpaidPayments.toLocaleString()}
              </h4>
             
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Upcoming Payments */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xs border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Payment Overview</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">All upcoming and overdue payments</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Student
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                        Loading payments...
                      </td>
                    </tr>
                  ) : upcomingPayments.length > 0 ? (
                    upcomingPayments.map((payment) => (
                      <tr 
                        key={payment._id} 
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                                {payment.studentName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-800 dark:text-white">
                                {payment.studentName}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">
                          ${payment.amount.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-800 dark:text-white">
                            {new Date(payment.dueDate).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(payment.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${statusColors[payment.status]}`}>
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                        No payments found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Notifications */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xs border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Alerts</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Latest payment notifications</p>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[500px] overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">Loading notifications...</div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">No notifications</div>
              ) : (
                notifications.map(notification => (
                  <div 
                    key={notification._id} 
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      notification.status === 'overdue' ? 'bg-red-50/50 dark:bg-red-900/20' : 
                      notification.status === 'unpaid' ? 'bg-yellow-50/50 dark:bg-yellow-900/20' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 mt-1 w-2 h-2 rounded-full ${
                        statusColors[notification.status]
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-medium text-gray-800 dark:text-white">
                            {notification.studentName}
                          </p>
                          {notification.amount > 0 && (
                            <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                              ${notification.amount.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {notification.message}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            statusColors[notification.status]
                          }`}>
                            {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcommerceMetrics;