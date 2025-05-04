import React, { useState, useEffect } from "react";
import api from "../../services/axios";
import { FaEye, FaEdit, FaTrashAlt, FaUserPlus } from "react-icons/fa";

export default function FamiliesManager() {
  // State declarations
  const [families, setFamilies] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    familyName: "",
    discountPercentage: 20,
    IsEligible: true,
    id: null,
  });
  const [viewedFamily, setViewedFamily] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [addChildForm, setAddChildForm] = useState({
    familyId: "",
    studentId: "",
  });
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [modalMessage, setModalMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all families and students
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [familiesRes, studentsRes] = await Promise.all([
        api.get("/families"),
        api.get("/students"),
      ]);
      setFamilies(familiesRes.data || []);
      setStudents(studentsRes.data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again later.");
      setMessage({ text: "Failed to load data", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Form handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    try {
      if (form.id) {
        await api.put(`/families/${form.id}`, form);
        setMessage({ text: "Family updated successfully!", type: "success" });
      } else {
        await api.post("/families", form);
        setMessage({ text: "Family created successfully!", type: "success" });
      }
      fetchData();
      resetForm();
    } catch (err) {
      console.error("Error saving family:", err);
      setMessage({ text: "Error saving family. Please try again.", type: "error" });
    }
  };

  // Family actions
  const handleViewFamily = (family) => {
    try {
      const familyToView = {
        ...family,
        familyName: family.familyName || "",
        children: family.children ? [...family.children] : []
      };
      setViewedFamily(familyToView);
    } catch (error) {
      console.error("Error setting viewed family:", error);
      setMessage({ text: "Error showing family details", type: "error" });
    }
  };

  const handleEdit = (family) => {
    setForm({
      familyName: family.familyName || "",
      discountPercentage: family.discountPercentage || 20,
      IsEligible: family.IsEligible !== undefined ? family.IsEligible : true,
      id: family._id,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this family?")) {
      try {
        await api.delete(`/families/${id}`);
        setMessage({ text: "Family deleted successfully!", type: "success" });
        fetchData();
      } catch (err) {
        console.error("Error deleting family:", err);
        setMessage({ text: "Error deleting family.", type: "error" });
      }
    }
  };

  // Child management
  const handleAddChild = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/families/${addChildForm.familyId}/children`, {
        studentId: addChildForm.studentId,
      });
      setModalMessage({ 
        text: "Child added to family successfully!", 
        type: "success" 
      });
      setTimeout(() => {
        fetchData();
        setShowAddChildModal(false);
        setAddChildForm({ familyId: "", studentId: "" });
        setModalMessage({ text: "", type: "" });
      }, 1500);
    } catch (err) {
      console.error("Error adding child:", err);
      setModalMessage({ 
        text: err.response?.data?.message || "Family already has maximum number of children (2)", 
        type: "error" 
      });
    }
  };

  const resetForm = () => {
    setForm({
      familyName: "",
      discountPercentage: 20,
      IsEligible: true,
      id: null,
    });
  };

  // Filter families safely
  const filteredFamilies = families.filter((family) => {
    if (!family || !family.familyName) return false;
    return family.familyName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return <div className="p-6 text-center">Loading families...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Form Section */}
      <form onSubmit={handleSubmit} className="p-6 border rounded-2xl shadow-xl space-y-4 bg-white h-fit">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
          {form.id ? "Update Family" : "Create Family"}
        </h2>

        {message.text && (
          <p className={`text-sm ${
            message.type === "error" ? "text-red-500" : "text-green-500"
          }`}>
            {message.text}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Family Name
          </label>
          <input
            type="text"
            name="familyName"
            value={form.familyName}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Discount Percentage
          </label>
          <input
            type="number"
            name="discountPercentage"
            value={form.discountPercentage}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            min="0"
            max="100"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="IsEligible"
              checked={form.IsEligible}
              onChange={handleChange}
            />
            <span className="text-sm font-medium text-gray-700">
              Is Eligible for Discounts?
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {form.id ? "Update" : "Create"}
        </button>
      </form>

      {/* Families Table */}
      <div className="p-6 border rounded-2xl shadow-xl space-y-4 bg-white h-fit">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Families List</h2>

        <input
          type="text"
          placeholder="Search by family name"
          className="border p-2 w-full mb-4 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {filteredFamilies.length === 0 ? (
          <p className="text-center py-4 text-gray-500">
            {families.length === 0 ? "No families found" : "No matching families found"}
          </p>
        ) : (
          <div className="overflow-x-auto max-h-[400px]">
            <table className="w-full table-auto border rounded">
              <thead className="sticky top-0 bg-gray-200 text-gray-700">
                <tr>
                  <th className="p-2 border">Family Name</th>
                  <th className="p-2 border">Children</th>
                  <th className="p-2 border">Discount</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFamilies.map((family) => (
                  <tr key={family._id} className="hover:bg-gray-50">
                    <td className="p-2 border">{family.familyName || "-"}</td>
                    <td className="p-2 border">{family.children?.length || 0}</td>
                    <td className="p-2 border">{family.discountPercentage || 0}%</td>
                    <td className="p-2 border">
                      {family.IsEligible ? "Eligible" : "Not Eligible"}
                    </td>
                    <td className="p-2 border space-x-2">
                      <button
                        onClick={() => handleViewFamily(family)}
                        className="text-green-400 hover:text-green-800 transition"
                      >
                        <FaEye className="inline-block mr-1" />
                      </button>
                      <button
                        onClick={() => handleEdit(family)}
                        className="text-blue-400 hover:text-blue-800 transition"
                      >
                        <FaEdit className="inline-block mr-1" />
                      </button>
                      <button
                        onClick={() => handleDelete(family._id)}
                        className="text-red-400 hover:text-red-800 transition"
                      >
                        <FaTrashAlt className="inline-block mr-1" />
                      </button>
                      <button
                        onClick={() => {
                          setAddChildForm({ ...addChildForm, familyId: family._id });
                          setShowAddChildModal(true);
                          setModalMessage({ text: "", type: "" });
                        }}
                        className="text-purple-400 hover:text-purple-800 transition"
                      >
                        <FaUserPlus className="inline-block mr-1" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Family Modal */}
      {viewedFamily && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] md:w-[500px] shadow-lg">
            <h3 className="text-xl font-bold mb-4">Family Details</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="font-semibold">Family Name:</p>
                <p>{viewedFamily.familyName || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold">Children Count:</p>
                <p>{viewedFamily.children?.length || 0}</p>
              </div>
              <div>
                <p className="font-semibold">Discount:</p>
                <p>{viewedFamily.discountPercentage || 0}%</p>
              </div>
              <div>
                <p className="font-semibold">Status:</p>
                <p>{viewedFamily.IsEligible ? "Eligible" : "Not Eligible"}</p>
              </div>
            </div>
            
            {viewedFamily.children?.length > 0 && (
              <div className="mt-3">
                <h4 className="font-semibold mb-2">Children Details:</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-left">Category</th>
                        <th className="p-2 text-left">Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewedFamily.children
                        .filter(studentId => studentId)
                        .map((studentId) => {
                          const child = students.find(s => s?._id === studentId);
                          return child ? (
                            <tr key={student._id} className="border-t">
                              <td className="p-2">{student.firstName} {student.lastName}</td>
                              <td className="p-2 capitalize">{student.category}</td>
                              <td className="p-2">{student.niveau}</td>
                            </tr>
                          ) : (
                            <tr key={`unknown-${studentId}`} className="border-t">
                              <td colSpan="3" className="p-2 text-gray-500">
                                Unknown child (ID: {studentId})
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewedFamily(null)}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Child Modal */}
      {showAddChildModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form onSubmit={handleAddChild} className="bg-white p-6 rounded-xl w-[90%] md:w-[500px] shadow-lg">
            <h3 className="text-xl font-bold mb-4">Add Child to Family</h3>
            
            {modalMessage.text && (
              <div className={`mb-4 p-3 rounded ${
                modalMessage.type === "error" 
                  ? "bg-red-100 text-red-700" 
                  : "bg-green-100 text-green-700"
              }`}>
                {modalMessage.text}
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Student
              </label>
              <select
                className="border p-2 w-full rounded"
                value={addChildForm.studentId}
                onChange={(e) => setAddChildForm({...addChildForm, studentId: e.target.value})}
                required
              >
                <option value="">Select a student</option>
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.firstName} {student.lastName} ({student.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddChildModal(false);
                  setModalMessage({ text: "", type: "" });
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add Child
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}