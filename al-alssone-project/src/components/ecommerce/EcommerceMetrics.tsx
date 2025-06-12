import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GroupIcon, AlertIcon } from "../../icons";
import api from "../../services/axios";
import { FaBell, FaChevronDown, FaChevronUp } from "react-icons/fa";

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
}

interface Notification {
  _id: string;
  message: string;
  type: "info" | "warning" | "alert" | "success";
  status: "sent" | "pending" | "failed";
  scheduledFor: string;
  familyId: string;
  title?: string;
  student?: Student;
}

interface Payment {
  _id: string;
  studentId: string;
  feeId: string;
  familyId: number;
  amountPaid: number;
  status: "paid" | "unpaid" | "overdue";
  dueDate: string;
  studentName?: string;
}

interface DashboardMetrics {
  totalStudents: number;
  unpaidStudents: number;
  unpaidPayments: number;
  paymentRate: number;
  upcomingPayments: Payment[];
}

export default function EcommerceMetrics() {
  const navigate = useNavigate();

  // const [username, setUsername] = useState("admin");
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalStudents: 0,
    unpaidStudents: 0,
    unpaidPayments: 0,
    paymentRate: 0,
    upcomingPayments: [],
  });
  const [recentAlerts, setRecentAlerts] = useState<Notification[]>([]);
  const [loading, setLoading] = useState({
    metrics: true,
    alerts: true,
  });
  const [error, setError] = useState({
    metrics: null as string | null,
    alerts: null as string | null,
  });
    const [expandedNotifications, setExpandedNotifications] = useState<Record<string, boolean>>({});


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading({ metrics: true, alerts: true });
        const [studentsRes, paymentsRes, notificationsRes] = await Promise.all([
          api.get("/students"),
          api.get("/payments?status=unpaid&sort=dueDate"),
          api.get("/notifications"),
        ]);

        const studentsData: Student[] = studentsRes.data.map((s: any) => ({
          _id: s._id,
          firstName: s.firstName,
          lastName: s.lastName,
        }));

        const paymentsWithNames: Payment[] = paymentsRes.data.map((payment: any) => {
          const student = studentsData.find((s) => s._id === payment.studentId);
          return {
            ...payment,
            amountPaid: payment.amountPaid || 0,
            studentName: student ? `${student.firstName} ${student.lastName}` : "Unknown",
          };
        });

        const unpaidStudentsCount = studentsData.filter((student) =>
          paymentsWithNames.some((payment) => payment.studentId === student._id && payment.status !== "paid")
        ).length;

        const totalStudents = studentsData.length;
        const paidPaymentsCount = totalStudents - unpaidStudentsCount;
        const paymentRate = totalStudents > 0 ? Math.round((paidPaymentsCount / totalStudents) * 100) : 0;

        setMetrics({
          totalStudents,
          unpaidStudents: unpaidStudentsCount,
          unpaidPayments: paymentsWithNames.length,
          paymentRate,
          upcomingPayments: paymentsWithNames,
        });

        setRecentAlerts(notificationsRes.data);
        setLoading({ metrics: false, alerts: false });
      } catch (err: any) {
        setError({
          metrics: "Failed to load metrics and payments",
          alerts: "Failed to load notifications",
        });
        setLoading({ metrics: false, alerts: false });
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchDashboardData();
  }, []);

  function getStatusBadge(status: Payment["status"]) {
    const baseClasses = "px-2 py-1 text-xs rounded-full";

    switch (status) {
      case "paid":
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Payé</span>;
      case "overdue":
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>En retard</span>;
      default:
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Non payé</span>;
    }
  }

  function getAmountPaid(amountPaid: Payment["amountPaid"], currency: string = "MAD"): string {
    if (typeof amountPaid !== "number") {
      console.warn("Invalid amountPaid value:", amountPaid);
      return "N/A";
    }

    const formatter = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return formatter.format(amountPaid);
  }


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
  }) 
  };
 
  return (
    <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-black">Tableau de bord</h1>
        <p className="text-gray-600 dark:text-black-400">Bon retour </p>
      </div>

      {/* Main Layout */}
      <div className="flex gap-6">
        {/* Left Column - Metrics + Upcoming Payments */}
        <div className="flex-1 space-y-6">
          {/* Metrics Row */}
          <div className="flex gap-6">
            {/* Metric 1 - Total Students */}
            <div className="w-[234px] rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
              </div>
              <div className="mt-5">
                <span className="text-sm text-gray-500 dark:text-black-400">Total élèves</span>
                {loading.metrics ? (
                  <div className="h-6 w-16 bg-gray-200 rounded mt-2 animate-pulse"></div>
                ) : error.metrics ? (
                  <span className="text-red-500 text-sm">Erreur</span>
                ) : (
                  <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-black/90">{metrics.totalStudents}</h4>
                )}
              </div>
            </div>

            {/* Metric 2 - Unpaid Students */}
            <div className="w-[234px] rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                <AlertIcon className="text-gray-800 size-6 dark:text-white/90" />
              </div>
              <div className="mt-5">
                <span className="text-sm text-gray-500 dark:text-black-400">élèves Impayés</span>
                {loading.metrics ? (
                  <div className="h-6 w-16 bg-gray-200 rounded mt-2 animate-pulse"></div>
                ) : error.metrics ? (
                  <span className="text-red-500 text-sm">Erreur</span>
                ) : (
                  <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-black/90">{metrics.unpaidStudents}</h4>
                )}
              </div>
            </div>

            {/* Metric 3 - Unpaid Payments */}
            <div className="w-[234px] rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                <AlertIcon className="text-gray-800 size-6 dark:text-white/90" />
              </div>
              <div className="mt-5">
                <span className="text-sm text-gray-500 dark:text-black-400">Paiements Impayés</span>
                {loading.metrics ? (
                  <div className="h-6 w-16 bg-gray-200 rounded mt-2 animate-pulse"></div>
                ) : error.metrics ? (
                  <span className="text-red-500 text-sm">Erreur</span>
                ) : (
                  <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-black/90">{metrics.unpaidStudents}</h4>
                )}
              </div>
            </div>
          </div>

          {/* Upcoming Payments Table */}
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex justify-between items-center px-5 py-3 border-b border-gray-300 dark:border-gray-700">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300"> Paiements</h4>
              <button
                onClick={() => navigate("/payments")}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
               Voir tout
              </button>
            </div>
            <table className="w-full table-auto border-collapse border border-gray-300 text-left text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">
              <thead>
                <tr className="bg-gray-100 text-gray-800 dark:bg-black/20 dark:text-black/70">
                  <th className="border border-gray-300 p-3">Nom élève</th>
                  <th className="border border-gray-300 p-3">Montant payé</th>
                  <th className="border border-gray-300 p-3">Statut</th>
                </tr>
              </thead>
              <tbody>
                {metrics.upcomingPayments.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-3 text-center text-gray-500">
                      {loading.metrics ? "Loading payments..." : "No payments"}
                    </td>
                  </tr>
                ) : (
                  metrics.upcomingPayments.slice(0, 10).map((payment) => (
                    <tr
                      key={payment._id}
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-white/[0.07]"
                      onClick={() => navigate(`/payments/${payment._id}`)}
                    >
                      <td className="border border-gray-300 p-3 font-semibold dark:text-black/90">{payment.studentName}</td>
                      <td className="border border-gray-300 p-3">{getAmountPaid(payment.amountPaid)}</td>
                      <td className="border border-gray-300 p-3">{getStatusBadge(payment.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

              {/* Right Column - Alerts */}
         
     {/* Right Column - Notifications */}
      <div className="w-[400px] flex-shrink-0 rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex justify-between items-center px-5 py-3 border-b border-gray-300 dark:border-gray-700">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300">
            <FaBell className="inline mr-2" />
            Notifications
          </h4>
          <button
            onClick={() => navigate("/notifications")}
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            Voir tout
          </button>
        </div>

        {loading.alerts ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Loading notifications...</p>
          </div>
        ) : error.alerts ? (
          <div className="p-4 text-center text-red-500 dark:text-red-400">
            {error.alerts}
            <button
              onClick={() => window.location.reload()}
              className="ml-2 text-blue-500 hover:underline dark:text-blue-400"
            >
              Retry
            </button>
          </div>
        ) : recentAlerts.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No notifications found
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[400px] overflow-y-auto">
            {recentAlerts.slice(0, 5).map(notification => {
              const studentName = notification.student 
                ? `${notification.student.firstName} ${notification.student.lastName}`
                : null;

              return (
                <div
                  key={notification._id}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    notification.status === 'pending' ? 'bg-blue-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'
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
                            notification.status === 'pending' 
                              ? 'text-blue-600 dark:text-blue-400' 
                              : 'text-gray-800 dark:text-gray-200'
                          }`}>
                            {notification.title || "Notification"}
                          </h3>
                          {notification.status && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              notification.status === 'sent' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' :
                              notification.status === 'failed' 
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200' :
                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200'
                            }`}>
                              {notification.status}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(notification.scheduledFor)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpandNotification(notification._id);
                            }}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            {expandedNotifications[notification._id] ? <FaChevronUp /> : <FaChevronDown />}
                          </button>
                        </div>
                      </div>

                      {/* Student Information */}
                      {studentName && (
                        <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                          Student: <span className="font-semibold">{studentName}</span>
                        </div>
                      )}

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
                      {notification.status === 'failed' && (
                        <div className="mt-1 text-xs text-red-500 dark:text-red-400">
                          Error: Failed to send notification
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}