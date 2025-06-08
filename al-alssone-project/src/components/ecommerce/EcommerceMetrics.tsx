import React, { useState, useEffect } from 'react';
import { FaBell, FaCheck, FaTrash } from 'react-icons/fa';
import { GroupIcon, AlertIcon } from "../../icons";
import api from "../../services/axios";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/notifications');
        setNotifications(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

 

  

  return (
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
            {/* <div className="flex space-x-2">
              <button 
                onClick={markAllAsRead}
                className="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400"
                disabled={unreadCount === 0}
              >
                Mark all as read
              </button>
            </div> */}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
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
                      {/* <div className="mt-2 flex justify-end space-x-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification._id)}
                            className="text-xs text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 flex items-center"
                            title="Mark as read"
                          >
                            <FaCheck className="mr-1" /> Read
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification._id)}
                          className="text-xs text-gray-500 hover:text-red-500 dark:hover:text-red-400 flex items-center"
                          title="Delete"
                        >
                          <FaTrash className="mr-1" /> Delete
                        </button>
                      </div> */}
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
};

export default function EcommerceMetrics() {
  const username = "admin";
  const [notifications, setNotifications] = useState<Notification[]>([]);

  function getTimeRemaining(dueDate: string) {
    const currentDate = new Date();
    const targetDate = new Date(dueDate);
    const timeDiff = targetDate.getTime() - currentDate.getTime();
    
    if (timeDiff <= 0) return "Overdue";
    
    const daysRemaining = Math.floor(timeDiff / (1000 * 3600 * 24));
    return `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} left`;
  }

  useEffect(() => {
    // Fetch notifications for the activity feed
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/notifications');
        setNotifications(response.data.slice(0, 5)); // Only show 5 most recent
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
      {/* Welcome Header with Notification Bell */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-black">Dashboard</h1>
          <p className="text-gray-600 dark:text-black-400">Welcome back, {username}</p>
        </div>
        <NotificationCenter />
      </div>

      {/* Main Layout */}
      <div className="flex gap-6">
        {/* Left Column - Metrics + Upcoming Payments */}
        <div className="flex-1 space-y-6">
          {/* Metrics Row */}
          <div className="flex gap-6">
            {/* Metric 1 */}
            <div className="w-[234px] rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
              </div>
              <div className="mt-5">
                <span className="text-sm text-gray-500 dark:text-black-400">Total Students</span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-black/90">0</h4>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="w-[234px] rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                <AlertIcon className="text-gray-800 size-6 dark:text-white/90" />
              </div>
              <div className="mt-5">
                <span className="text-sm text-gray-500 dark:text-black-400">Unpaid Students</span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-black/90">0</h4>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="w-[234px] rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                <AlertIcon className="text-gray-800 size-6 dark:text-white/90" />
              </div>
              <div className="mt-5">
                <span className="text-sm text-gray-500 dark:text-black-400">Unpaid Payments</span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-black/90">0</h4>
              </div>
            </div>
          </div>

          {/* Upcoming Payments */}
          <div className="w-full sm:w-[420px] md:w-[480px] lg:w-[760px] shrink-0 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 dark:text-black">Upcoming Payments</h3>
            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300 max-h-[300px] overflow-y-auto">
              {/* Payment items... */}
            </div>
          </div>
        </div>

        {/* Right Column - Activity Feed & Notifications */}
        <div className="w-[360px] shrink-0 space-y-6">
          {/* Notification Summary
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 dark:text-black">Recent Alerts</h3>
            <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300 max-h-[240px] overflow-y-auto">
              {notifications.map(notification => (
                <li key={notification._id} className="border-b border-gray-100 pb-2 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <strong className="font-medium dark:text-gray-200">{notification.title}</strong>
                    <span className="text-xs text-gray-500">
                      {new Date(notification.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm dark:text-gray-400">{notification.message}</p>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Original Activity Feed */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 dark:text-black">Activity Feed</h3>
            <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300 max-h-[240px] overflow-y-auto">
              {/* Your existing activity items */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}