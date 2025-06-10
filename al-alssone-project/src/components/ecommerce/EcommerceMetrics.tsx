import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GroupIcon, AlertIcon } from "../../icons";
import api from "../../services/axios";

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

  const [username, setUsername] = useState("admin");
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

 function getNotificationStatusBadge(status: Notification["status"]) {
  const baseClasses = "px-2 py-1 text-xs rounded-full";

  switch (status) {
    case "sent":
      return <span className={`${baseClasses} bg-green-100 text-green-800`}>Envoyé</span>;
    case "failed":
      return <span className={`${baseClasses} bg-red-100 text-red-800`}>Échec</span>;
    default:
      return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>En attente</span>;
  }
}


  function formatDateTime(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleString();
  }

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
                <span className="text-sm text-gray-500 dark:text-black-400">Total Étudiants</span>
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
                      {loading.metrics ? "Loading payments..." : "No upcoming payments"}
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
          {/* Right Column - Recent Alerts */}
        <div className="w-[400px] h-[380px] flex-shrink-0 rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-white/[0.03]">
          <h2 className="text-lg font-semibold p-5 text-gray-800 dark:text-black/90">Notifications récentes</h2>

          {loading.alerts ? (
            <div className="p-5 animate-pulse text-gray-500">Loading ...</div>
          ) : error.alerts ? (
            <div className="p-5 text-red-500">Impossible de charger les notifications</div>
          ) : (
            <>
              <ul className="divide-y divide-gray-200 dark:divide-white/10 max-h-[400px] overflow-y-auto">
                {recentAlerts.slice(0, 4).map((alert) => (
                  <li
                    key={alert._id}
                    className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 dark:hover:bg-black/10 cursor-pointer"
                    onClick={() => {
                      if (alert.type === "alert") {
                        navigate("/notifications");
                      }
                    }}
                  >
                    {/* <div className="min-w-[50px]">{getAlertIcon(alert.type)}</div> */}

                    <div className="flex-grow">
                      {/* <p className="font-semibold text-gray-800 dark:text-black/90">{alert.title || "Alert"}</p> */}
                      <p className="text-xs text-gray-500 dark:text-black/60">{alert.message}</p>
                      <p className="text-xs text-gray-400 dark:text-black/30">{formatDateTime(alert.scheduledFor)}</p>
                    </div>

                    <div>{getNotificationStatusBadge(alert.status)}</div>
                  </li>
                ))}
              </ul>

              {recentAlerts.length > 4 && (
                <div className="p-4 flex justify-end">
                  <button
                    className="text-sm font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600"
                    onClick={() => navigate("/notifications")}
                  >
                    Voir tout
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 