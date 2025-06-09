import React, { useState, useEffect } from 'react';
import { FaBell, FaTrash } from 'react-icons/fa';
import { GroupIcon, AlertIcon } from "../../icons";
import api from "../../services/axios";
// import axios from "axios";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

interface DashboardProps {
  username: string;
}

const EcommerceMetrics: React.FC<DashboardProps> = ({ username }) => {
  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    unpaidStudents: 0,
    unpaidPayments: 0,
    upcomingPayments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [studentsRes, paymentsRes] = await Promise.all([
          api.get('/students'),
          api.get('/payments?status=unpaid')
        ]);

        const unpaidStudents = studentsRes.data.filter(
          student => paymentsRes.data.some(payment => payment.studentId === student._id)
        ).length;

        setMetrics({
          totalStudents: studentsRes.data.length,
          unpaidStudents,
          unpaidPayments: paymentsRes.data.length,
          upcomingPayments: paymentsRes.data.slice(0, 5)
        });
      } catch (err: any) {
        setError(err.message);
        console.error('Dashboard data error:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchNotifications = async () => {
      try {
        const response = await api.get('/notifications');
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoadingNotifications(false);
      }
    };

    fetchDashboardData();
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const NotificationCenter = () => (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full relative hover:bg-gray-200 transition"
      >
        <FaBell className="text-gray-600 text-xl" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-semibold text-lg dark:text-white">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {isLoadingNotifications ? (
              <div className="p-4 text-center dark:text-gray-300">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">No notifications</div>
            ) : (
              <ul>
                {notifications.map(notification => (
                  <li 
                    key={notification._id} 
                    className={`border-b border-gray-100 dark:border-gray-700 ${
                      !notification.read ? 'bg-blue-50 dark:bg-gray-700' : 'dark:bg-gray-800'
                    }`}
                  >
                    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <div className="flex justify-between">
                        <h4 className="font-medium dark:text-white">{notification.title}</h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notification.message}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {notifications.length > 0 && (
            <div className="p-2 border-t border-gray-200 dark:border-gray-700 text-center">
              <a 
                href="/notifications" 
                className="text-sm text-blue-500 hover:underline dark:text-blue-400"
              >
                View all notifications
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (error) {
    return <div className="p-4 text-red-500">Error loading dashboard data: {error}</div>;
  }

  return (
    <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-black">Dashboard</h1>
          <p className="text-gray-600 dark:text-black-400">Welcome back, {username}</p>
        </div>
        <NotificationCenter />
      </div>

      {/* Metrics */}
      <div className="flex gap-6">
        {[
          { label: 'Total Students', value: metrics.totalStudents, icon: <GroupIcon className="text-gray-800 size-6 dark:text-white/90" /> },
          { label: 'Unpaid Students', value: metrics.unpaidStudents, icon: <AlertIcon className="text-gray-800 size-6 dark:text-white/90" /> },
          { label: 'Unpaid Payments', value: metrics.unpaidPayments, icon: <AlertIcon className="text-gray-800 size-6 dark:text-white/90" /> },
        ].map((metric, i) => (
          <div key={i} className="w-[234px] rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              {metric.icon}
            </div>
            <div className="mt-5">
              <span className="text-sm text-gray-500 dark:text-black-400">{metric.label}</span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-black/90">
                {loading ? '...' : metric.value}
              </h4>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Payments */}
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 dark:text-black">Upcoming Payments</h3>
        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300 max-h-[300px] overflow-y-auto">
          {loading ? (
            <div className="text-center py-4">Loading payments...</div>
          ) : metrics.upcomingPayments.length > 0 ? (
            metrics.upcomingPayments.map((payment: any) => (
              <div key={payment._id} className="border-b border-gray-100 pb-3 dark:border-gray-700">
                <div className="flex justify-between">
                  <span>{payment.studentName}</span>
                  <span className="text-gray-500">{new Date(payment.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          ) : (
            <div>No upcoming payments.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EcommerceMetrics;
