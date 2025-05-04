import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/axios";
import { FaEye, FaEdit, FaTrashAlt, FaSync } from "react-icons/fa";

interface Fee {
  _id: string;
  type: string;
  category: string;
  description: string;
  amount: number;
  isActive: boolean;
  frequency: string;
}

interface Payment {
  _id: string;
  studentId: string;
  feeId: Fee[]; // Now properly typed as array of Fee objects
  familyId?: string;
  amountPaid: number;
  discountApplied?: boolean;
  period: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  studentName?: string;
}

type FormState = {
  _id: string;
  studentId: string;
  feeId: string[]; // Store only IDs in form
  familyId: string;
  amountPaid: string;
  discountApplied: boolean;
  period: string;
  status: string;
};

const initialFormState: FormState = {
  _id: "",
  studentId: "",
  feeId: [],
  familyId: "",
  amountPaid: "",
  discountApplied: false,
  period: "",
  status: 'unpaid'
};

export default function PaymentsDashboard() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [viewedPayment, setViewedPayment] = useState<Payment | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState({ 
    table: false, 
    form: false,
    details: false 
  });
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<{_id: string, name: string}[]>([]);
  const [fees, setFees] = useState<Fee[]>([]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, table: true }));
      setError(null);
      
      const [paymentsRes, studentsRes, feesRes] = await Promise.all([
        api.get("/payments"),
        api.get("/students"),
        api.get("/fees")
      ]);

      const studentsData = studentsRes.data.map((s: any) => ({
        _id: s._id,
        name: `${s.firstName} ${s.lastName}`
      }));

      const feesData = feesRes.data;

      const paymentsData = paymentsRes.data.map((payment: any) => ({
        ...payment,
        studentName: studentsData.find(s => s._id === payment.studentId)?.name || "Unknown"
      }));

      setStudents(studentsData);
      setFees(feesData);
      setPayments(paymentsData);
      
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || "Failed to load data. Please try again.");
      setPayments([]);
    } finally {
      setLoading(prev => ({ ...prev, table: false }));
    }
  }, []);

  const fetchPaymentDetails = async (paymentId: string) => {
    try {
      setLoading(prev => ({ ...prev, details: true }));
      const response = await api.get(`/payments/${paymentId}`);
      return response.data;
    } catch (err) {
      console.error("Error fetching payment details:", err);
      return null;
    } finally {
      setLoading(prev => ({ ...prev, details: false }));
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setForm(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMultiSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selectedValues: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setForm(prev => ({ ...prev, feeId: selectedValues }));
  };

  const validateForm = (): boolean => {
    if (!form.studentId) {
      setMessage({ text: "Student is required", type: "error" });
      return false;
    }
    if (form.feeId.length === 0) {
      setMessage({ text: "At least one fee must be selected", type: "error" });
      return false;
    }
    if (!form.amountPaid || isNaN(Number(form.amountPaid))) {
      setMessage({ text: "Valid amount is required", type: "error" });
      return false;
    }
    if (!form.period) {
      setMessage({ text: "Period is required", type: "error" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(prev => ({ ...prev, form: true }));
    setMessage({ text: "", type: "" });

    try {
      const paymentData = {
        studentId: form.studentId,
        feeId: form.feeId,
        familyId: form.familyId || undefined,
        amountPaid: Number(form.amountPaid),
        discountApplied: form.discountApplied,
        period: form.period,
        status: form.status.toLowerCase()
      };

      if (form._id) {
        await api.patch(`/payments/${form._id}`, paymentData, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        setMessage({ text: "Payment updated successfully", type: "success" });
      } else {
        await api.post("/payments", paymentData);
        setMessage({ text: "Payment created successfully", type: "success" });
      }
      
      await fetchData();
      setForm(initialFormState);
    } catch (err: any) {
      console.error("Error saving payment:", err);
      const errorMsg = err.response?.data?.message || 
                      (err.response?.status === 204 ? "Update successful but no content returned" : 
                      "Error saving payment. Please try again.");
      setMessage({ 
        text: errorMsg, 
        type: "error" 
      });
    } finally {
      setLoading(prev => ({ ...prev, form: false }));
    }
  };

  const handleViewPayment = async (payment: Payment) => {
    const paymentWithDetails = await fetchPaymentDetails(payment._id);
    if (paymentWithDetails) {
      setViewedPayment({
        ...paymentWithDetails,
        studentName: students.find(s => s._id === paymentWithDetails.studentId)?.name || "Unknown"
      });
    } else {
      setMessage({ text: "Failed to load payment details", type: "error" });
    }
  };

  const handleEdit = (payment: Payment) => {
    setForm({
      _id: payment._id,
      studentId: payment.studentId,
      feeId: payment.feeId.map(fee => fee._id),
      familyId: payment.familyId || "",
      amountPaid: payment.amountPaid.toString(),
      discountApplied: payment.discountApplied || false,
      period: payment.period,
      status: payment.status
    });
    setMessage({ text: "", type: "" });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) return;
    
    try {
      setLoading(prev => ({ ...prev, table: true }));
      await api.delete(`/payments/${id}`);
      setMessage({ text: "Payment deleted successfully", type: "success" });
      await fetchData();
    } catch (err: any) {
      console.error("Error deleting payment:", err);
      setMessage({ 
        text: err.response?.data?.message || "Failed to delete payment", 
        type: "error" 
      });
    } finally {
      setLoading(prev => ({ ...prev, table: false }));
    }
  };

  const filteredPayments = payments.filter(payment => {
    const searchContent = [
      payment.studentName?.toLowerCase() || "",
      payment.amountPaid?.toString() || "",
      payment.period?.toLowerCase() || "",
      payment.status?.toLowerCase() || "",
      payment.feeId.map(f => f.type).join(" ") || ""
    ].join(" ");
    return searchContent.includes(searchTerm.toLowerCase());
  });

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        {error}
        <button 
          onClick={fetchData}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Form Section */}
      <form onSubmit={handleSubmit} className="p-6 border rounded-2xl shadow-xl space-y-4 bg-white h-fit">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
          {form._id ? "Update Payment" : "Create Payment"}
        </h2>

        {message.text && (
          <div className={`p-2 rounded ${
            message.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}>
            {message.text}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student*</label>
            <select
              name="studentId"
              value={form.studentId}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            >
              <option value="">Select a student</option>
              {students.map(student => (
                <option key={student._id} value={student._id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fees*</label>
            <select
              name="feeId"
              multiple
              value={form.feeId}
              onChange={handleMultiSelect}
              className="border p-2 w-full rounded h-auto min-h-[42px]"
              required
              size={3}
            >
              {fees.map(fee => (
                <option key={fee._id} value={fee._id}>
                  {fee.type} ({fee.category}) - {fee.amount} MAD
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Family ID (optional)</label>
            <input
              name="familyId"
              value={form.familyId}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              placeholder="Family ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid*</label>
            <input
              name="amountPaid"
              type="number"
              value={form.amountPaid}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="discountApplied"
                checked={form.discountApplied}
                onChange={handleChange}
              />
              <span>Discount Applied</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Period*</label>
            <input
              name="period"
              value={form.period}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
              placeholder="YYYY-MM-DD"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status*</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            >
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading.form}
            className={`w-full p-3 rounded-md mt-4 ${
              loading.form 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading.form ? "Processing..." : form._id ? "Update Payment" : "Create Payment"}
          </button>
        </div>
      </form>

      {/* Payments Table Section */}
      <div className="p-6 border rounded-2xl shadow-xl bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Payments List</h2>
          <button 
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            disabled={loading.table}
          >
            <FaSync className={loading.table ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
        
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search payments..."
            className="border p-2 w-full rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading.table ? (
          <div className="text-center py-4">Loading payments...</div>
        ) : filteredPayments.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            {searchTerm ? "No matching payments found" : "No payments available"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Student</th>
                  <th className="p-2 text-left">Amount</th>
                  <th className="p-2 text-left">Period</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment._id} className="border-t hover:bg-gray-50">
                    <td className="p-2">{payment.studentName}</td>
                    <td className="p-2">{payment.amountPaid} MAD</td>
                    <td className="p-2">{payment.period}</td>
                    <td className="p-2 capitalize">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        payment.status.toLowerCase() === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="p-2 flex space-x-2">
                      <button
                        onClick={() => handleViewPayment(payment)}
                        className="text-blue-500 hover:text-blue-700 p-1"
                        title="View"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEdit(payment)}
                        className="text-yellow-500 hover:text-yellow-700 p-1"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(payment._id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Modal with Fee Details */}
      {viewedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Payment Details</h3>
            {loading.details ? (
              <div className="text-center py-4">Loading details...</div>
            ) : (
              <div className="space-y-2">
                <p><strong>Student:</strong> {viewedPayment.studentName}</p>
                
                <div className="mt-2">
                  <p className="font-medium">Fees:</p>
                  <ul className="list-disc pl-5">
                    {viewedPayment.feeId.map((fee, index) => (
                      <li key={index} className="py-1">
                        <p><strong>Type:</strong> {fee.type}</p>
                        <p><strong>Category:</strong> {fee.category}</p>
                        <p><strong>Amount:</strong> {fee.amount} MAD</p>
                        <p><strong>Frequency:</strong> {fee.frequency}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                {viewedPayment.familyId && <p><strong>Family ID:</strong> {viewedPayment.familyId}</p>}
                <p><strong>Amount Paid:</strong> {viewedPayment.amountPaid} MAD</p>
                <p><strong>Discount Applied:</strong> {viewedPayment.discountApplied ? "Yes" : "No"}</p>
                <p><strong>Period:</strong> {viewedPayment.period}</p>
                <p><strong>Status:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    viewedPayment.status.toLowerCase() === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {viewedPayment.status}
                  </span>
                </p>
                <p><strong>Created:</strong> {new Date(viewedPayment.createdAt).toLocaleString()}</p>
                <p><strong>Last Updated:</strong> {new Date(viewedPayment.updatedAt).toLocaleString()}</p>
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewedPayment(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                disabled={loading.details}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}