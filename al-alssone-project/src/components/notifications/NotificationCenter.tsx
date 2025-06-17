import React, { useState, useEffect, useCallback } from 'react';
import { FaBell, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../../services/axios';
import { Notification, Student } from './types/notification';

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [expandedNotifications, setExpandedNotifications] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const fetchStudentDetails = useCallback(async (studentId: string) => {
    try {
      if (students.find((s: Student) => s._id === studentId)) return; // Already fetched
      
      const response = await api.get<Student>(`/students/${studentId}`);
      setStudents(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Error fetching student:', error);
    }
  }, [students]);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: 20,
        read: filter === 'unread' ? false : undefined
      };
      const response = await api.get<Notification[]>('/notifications', { params });

      // Extract unique student IDs from notifications
      const studentIds = response.data
        .filter(n => n.paymentId?.studentId)
        .map(n => n.paymentId!.studentId)
        .filter((id, index, self) => self.indexOf(id) === index);

      // Fetch student details in parallel
      await Promise.all(studentIds.map(fetchStudentDetails));

      setNotifications(prev => page === 1 ? response.data : [...prev, ...response.data]);
      setHasMore(response.data.length === 20);
    } catch (err: unknown) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [page, filter, fetchStudentDetails]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const toggleExpandNotification = (id: string) => {
    setExpandedNotifications(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getNotificationIcon = (status?: string) => {
    switch (status) {
      case 'paid': return '✅';
      case 'overdue': return '⚠️';
      case 'failed': return '❌';
      default: return 'ℹ️';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
         Retour au tableau de bord
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md text-sm ${filter === 'all' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-600 dark:text-gray-400'}`}
            >
              All
            </button>
            {/* <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-md text-sm ${filter === 'unread' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-600 dark:text-gray-400'}`}
            >
              Unread
            </button> */}
          </div>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {isLoading && page === 1 ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Chargement des notifications...</p>
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500 dark:text-red-400">
              {error}
              <button
                onClick={fetchNotifications}
                className="ml-2 text-blue-500 hover:underline dark:text-blue-400"
              >
                Réessayer
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              Aucune notification trouvée
            </div>
          ) : (
            notifications.map(notification => {
              const studentName = notification.paymentId?.studentId 
                ? students.find((s: Student) => s._id === notification.paymentId?.studentId)?.firstName 
                : null;

              return (
                <div
                  key={notification._id}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    !notification.read ? 'bg-blue-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="mr-3 text-lg">
                      {getNotificationIcon(notification.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <h3 className={`text-sm font-medium ${
                            !notification.read 
                              ? 'text-blue-600 dark:text-blue-400' 
                              : 'text-gray-800 dark:text-gray-200'
                          }`}>
                            {notification.subject}
                          </h3>
                          {notification.status && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              notification.status === 'paid' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' :
                              notification.status === 'overdue' 
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200' :
                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200'
                            }`}>
                              {notification.status}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(notification.createdAt)}
                          </span>
                          <button
                            onClick={() => toggleExpandNotification(notification._id)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            {expandedNotifications[notification._id] ? <FaChevronUp /> : <FaChevronDown />}
                          </button>
                        </div>
                      </div>

                      {/* Student Information */}
                      {studentName && (
                        <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                          Élève: <span className="font-semibold">{studentName}</span>
                        </div>
                      )}

                      {/* Family Information */}
                      {/* {familyName && (
                        <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                          Family: <span className="font-semibold">{familyName}</span>
                        </div>
                      )} */}

                      {/* Scheduled Time */}
                      {notification.scheduledFor && (
                        <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                          Planifié: {formatDate(notification.scheduledFor)}
                        </div>
                      )}

                      {/* Notification Message */}
                      <p className={`mt-2 text-sm text-gray-600 dark:text-gray-300 ${
                        expandedNotifications[notification._id] ? '' : 'line-clamp-2'
                      }`}>
                        {notification.message}
                      </p>

                      {/* Error Message (if failed) */}
                      {notification.errorMessage && (
                        <div className="mt-1 text-xs text-red-500 dark:text-red-400">
                          Erreur: {notification.errorMessage}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {hasMore && !isLoading && (
            <div className="p-4 text-center">
              <button
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;