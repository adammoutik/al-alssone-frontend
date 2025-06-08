import React, { useState, useEffect, useCallback } from 'react';
import { FaBell, FaCheck, FaTrash, FaChevronDown, FaChevronUp, FaFilter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../../services/axios';

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [expandedNotifications, setExpandedNotifications] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: 20,
        read: filter === 'unread' ? false : undefined
      };
      const response = await api.get('/notifications', { params });
      setNotifications(prev => page === 1 ? response.data : [...prev, ...response.data]);
      setHasMore(response.data.length === 20);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [page, filter]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/mark-all-read');
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const toggleExpandNotification = (id: string) => {
    setExpandedNotifications(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'warning': return '⚠️';
      case 'alert': return '🚨';
      case 'success': return '✅';
      default: return 'ℹ️';
    }
  };

  const handleFilterChange = (newFilter: 'all' | 'unread') => {
    setFilter(newFilter);
    setPage(1); // Reset to first page when changing filters
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          <FaBell className="inline mr-2" />
          Notifications
        </h1>
        <button 
          onClick={() => navigate(-1)}
          className="text-sm text-blue-500 hover:underline"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <FaFilter className="text-gray-500" />
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-3 py-1 rounded-full text-sm ${filter === 'all' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-600 dark:text-gray-300'}`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange('unread')}
              className={`px-3 py-1 rounded-full text-sm ${filter === 'unread' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-600 dark:text-gray-300'}`}
            >
              Unread
            </button>
          </div>
          
        
        </div>

        {/* Notification List */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {isLoading && page === 1 ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Loading notifications...</p>
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500 dark:text-red-400">
              {error}
              <button
                onClick={fetchNotifications}
                className="ml-2 text-blue-500 hover:underline dark:text-blue-400"
              >
                Retry
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No notifications found
            </div>
          ) : (
            notifications.map(notification => (
              <div
                key={notification._id}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 ${!notification.read ? 'bg-blue-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}`}
              >
                <div className="flex items-start">
                  <div className="mr-3 text-lg">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className={`text-sm font-medium ${!notification.read ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-gray-200'}`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => toggleExpandNotification(notification._id)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {expandedNotifications[notification._id] ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                      </div>
                    </div>
                    
                    <p className={`mt-1 text-sm text-gray-600 dark:text-gray-300 ${
                      expandedNotifications[notification._id] ? '' : 'line-clamp-2'
                    }`}>
                      {notification.message}
                    </p>

                    {notification.actionUrl && (
                      <a
                        href={notification.actionUrl}
                        className="inline-block mt-2 text-xs text-blue-500 hover:underline dark:text-blue-400"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View details
                      </a>
                    )}

                   
                  </div>
                </div>
              </div>
            ))
          )}

          {hasMore && !isLoading && (
            <div className="p-4 text-center">
              <button
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;