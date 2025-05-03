import React, { useState, useEffect } from "react";
import api from "../../services/axios";
import { FaEye, FaEdit, FaTrashAlt } from "react-icons/fa"; // Importing icons

export default function FeesDashboard() {
  const [fees, setFees] = useState([]);
  const [form, setForm] = useState({
    type: "registration",
    category: "maternelle",
    description: "",
    amount: "",
    isActive: true,
    frequency: "Monthly",
    id: null,
  });
  const [viewedFee, setViewedFee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");

  const fetchFees = async () => {
    try {
      const response = await api.get("/fees");
      setFees(response.data);
    } catch (error) {
      console.error("Error fetching fees:", error);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setForm({
      ...form,
      [name]: inputType === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const dataToSend = {
      ...form,
      amount: Number(form.amount),
    };

    try {
      if (form.id !== null) {
        await api.put(`/fees/${form.id}`, dataToSend);
        setMessage("Fee updated successfully.");
      } else {
        await api.post("/fees", dataToSend);
        setMessage("Fee created successfully.");
      }

      fetchFees();
      setForm({
        type: "registration",
        category: "maternelle",
        description: "",
        amount: "",
        isActive: true,
        frequency: "Monthly",
        id: null,
      });
    } catch (error) {
      console.error("Error submitting fee:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  const handleEdit = (fee) => {
    setForm({
      ...fee,
      id: fee._id, // 👈 Ensure MongoDB _id is used
    });
    setMessage("");
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/fees/${id}`);
      fetchFees();
      setMessage("Fee deleted successfully.");
    } catch (error) {
      console.error("Error deleting fee:", error);
      setMessage("Failed to delete fee.");
    }
  };

  const filteredFees = fees.filter((fee) =>
    [fee.type, fee.category, fee.description]
      .some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Form Section */}
      <form onSubmit={handleSubmit} className="p-6 border rounded-2xl shadow-xl space-y-4 bg-white h-fit">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
          {form.id ? "Update Fee" : "Create Fee"}
        </h2>

        {message && <p className="text-sm text-blue-600">{message}</p>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fee Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          >
            <option value="registration">Registration</option>
            <option value="insurance">Insurance</option>
            <option value="childcare">Childcare</option>
            <option value="education">Education</option>
            <option value="transport">Transport</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fee Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          >
            <option value="maternelle">Maternelle</option>
            <option value="primaire">Primaire</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            placeholder="Short description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount (MAD)</label>
          <input
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Is Active?</label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
            />
            <span>Yes</span>
          </label>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {form.id ? "Update" : "Create"}
        </button>
      </form>

      {/* Fees Table */}
      <div className="p-6 border rounded-2xl shadow-xl space-y-4 bg-white h-fit">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Fees List</h2>

        <input
          type="text"
          placeholder="Search by type or category"
          className="border p-2 w-full mb-4 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="overflow-x-auto max-h-[400px]">
          <table className="w-full table-auto border rounded">
            <thead className="sticky top-0 bg-gray-200 text-gray-700">
              <tr>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFees.map((fee) => (
                <tr
                  key={fee._id}
                  className={!fee.isActive ? "bg-gray-100 text-gray-400" : "hover:bg-gray-50"}
                >
                  <td className="p-2 border capitalize">{fee.type}</td>
                  <td className="p-2 border capitalize">{fee.category}</td>
                  <td className="p-2 border">{fee.amount}</td>
                  <td className="p-2 border">{fee.isActive ? "Active" : "Inactive"}</td>
                  <td className="p-2 border space-x-2">
                    <button
                      onClick={() => setViewedFee(fee)}
                      className="text-green-400 hover:text-green-800 transition"
                    >
                      <FaEye className="inline-block mr-1" /> 
                    </button>
                    <button
                      onClick={() => handleEdit(fee)}
                      className="text-blue-400 hover:text-blue-800 transition"
                    >
                      <FaEdit className="inline-block mr-1" /> 
                    </button>
                    <button
                      onClick={() => handleDelete(fee._id)}
                      className="text-red-400 hover:text-red-800 transition"
                    >
                      <FaTrashAlt className="inline-block mr-1" /> 
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {viewedFee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] md:w-[500px] shadow-lg">
            <h3 className="text-xl font-bold mb-4">Fee Details</h3>
            <p><strong>Type:</strong> {viewedFee.type}</p>
            <p><strong>Category:</strong> {viewedFee.category}</p>
            <p><strong>Description:</strong> {viewedFee.description || "N/A"}</p>
            <p><strong>Amount:</strong> {viewedFee.amount} MAD</p>
            <p><strong>Status:</strong> {viewedFee.isActive ? "Active" : "Inactive"}</p>
            {viewedFee.frequency && <p><strong>Frequency:</strong> {viewedFee.frequency}</p>}

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setViewedFee(null)}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
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
