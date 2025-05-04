import React, { useState, useEffect } from "react";
import api from "../../services/axios";
import { FaEye, FaEdit, FaTrashAlt } from "react-icons/fa";

export default function FamiliesSection() {
  const [families, setFamilies] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    familyName: "",
    children: [],
    isEligible: false,
    discountPercentage: 20,
    id: null,
  });
  const [viewedFamily, setViewedFamily] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");

  const fetchFamilies = async () => {
    try {
      const response = await api.get("/families");
      setFamilies(response.data);
    } catch (error) {
      console.error("Error fetching families:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.get("/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchFamilies();
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const dataToSend = {
      ...form,
      discountPercentage: Number(form.discountPercentage),
    };

    try {
      if (form.id !== null) {
        await api.put(`/families/${form.id}`, dataToSend);
        setMessage("Family updated successfully.");
      } else {
        await api.post("/families", dataToSend);
        setMessage("Family created successfully.");
      }

      fetchFamilies();
      setForm({
        familyName: "",
        children: [],
        isEligible: false,
        discountPercentage: 20,
        id: null,
      });
    } catch (error) {
      console.error("Error submitting family:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  const handleEdit = (family) => {
    setForm({
      ...family,
      id: family._id,
    });
    setMessage("");
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/families/${id}`);
      fetchFamilies();
      setMessage("Family deleted successfully.");
    } catch (error) {
      console.error("Error deleting family:", error);
      setMessage("Failed to delete family.");
    }
  };

  const handleAddChild = (e) => {
    const selectedId = e.target.value;
    if (!form.children.includes(selectedId)) {
      setForm((prev) => ({
        ...prev,
        children: [...prev.children, selectedId],
      }));
    }
  };

  const handleRemoveChild = (id) => {
    setForm((prev) => ({
      ...prev,
      children: prev.children.filter((childId) => childId !== id),
    }));
  };

  const filteredFamilies = families.filter((family) =>
    family.familyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Form Section */}
      <form onSubmit={handleSubmit} className="p-6 border rounded-2xl shadow-xl space-y-4 bg-white h-fit">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
          {form.id ? "Update Family" : "Create Family"}
        </h2>

        {message && <p className="text-sm text-blue-600">{message}</p>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Family Name</label>
          <input
            name="familyName"
            type="text"
            value={form.familyName}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Eligible</label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isEligible"
              checked={form.isEligible}
              onChange={handleChange}
            />
            <span>Yes</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage</label>
          <input
            name="discountPercentage"
            type="number"
            value={form.discountPercentage}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Add Child</label>
          <select
            value=""
            onChange={handleAddChild}
            className="border p-2 w-full rounded"
          >
            <option value="">-- Select student to add --</option>
            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.prenom} {student.nom}
              </option>
            ))}
          </select>

          {form.children.length > 0 && (
            <ul className="mt-2 text-sm text-gray-700 space-y-1">
              {form.children.map((id) => {
                const student = students.find((s) => s._id === id);
                return (
                  <li key={id} className="flex justify-between items-center">
                    <span>{student ? `${student.prenom} ${student.nom}` : id}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveChild(id)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      Remove
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
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

        <div className="overflow-x-auto max-h-[400px]">
          <table className="w-full table-auto border rounded">
            <thead className="sticky top-0 bg-gray-200 text-gray-700">
              <tr>
                <th className="p-2 border">Family Name</th>
                <th className="p-2 border">Eligible</th>
                <th className="p-2 border">Discount</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFamilies.map((family) => (
                <tr
                  key={family._id}
                  className={!family.isEligible ? "bg-gray-100 text-gray-400" : "hover:bg-gray-50"}
                >
                  <td className="p-2 border capitalize">{family.familyName}</td>
                  <td className="p-2 border">{family.isEligible ? "Yes" : "No"}</td>
                  <td className="p-2 border">{family.discountPercentage}%</td>
                  <td className="p-2 border space-x-2">
                    <button
                      onClick={() => setViewedFamily(family)}
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {viewedFamily && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] md:w-[500px] shadow-lg">
            <h3 className="text-xl font-bold mb-4">Family Details</h3>
            <p><strong>Family Name:</strong> {viewedFamily.familyName}</p>
            <p><strong>Eligible:</strong> {viewedFamily.isEligible ? "Yes" : "No"}</p>
            <p><strong>Discount:</strong> {viewedFamily.discountPercentage}%</p>
            <p>
              <strong>Children:</strong>{" "}
              {viewedFamily.children
                ?.map((id) => {
                  const student = students.find((s) => s._id === id);
                  return student ? `${student.prenom} ${student.nom}` : id;
                })
                .join(", ") || "N/A"}
            </p>

            <div className="mt-4 flex justify-end">
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
    </div>
  );
}
