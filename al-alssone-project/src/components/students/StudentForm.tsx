import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/axios";

export default function CreateStudentPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    category: "maternelle",
    niveau: "TPS",
    familyId: "",
    isGarde: false,
    usesTransport: false,
    registrationDate: "",
    parentPhoneNumber: "",
    isActive: true,
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const dataToSend = {
        ...form,
        birthDate: new Date(form.birthDate),
        registrationDate: new Date(form.registrationDate),
      };

      await api.post("/students", dataToSend);
      setMessage("Student created successfully!");
      
      // Redirect to students list after 1.5 seconds
      setTimeout(() => {
        navigate("/students");
      }, 1500);
      
    } catch (error) {
      console.error("Error submitting student:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Student</h1>
      
      {message && <p className="text-sm text-blue-600 mb-4">{message}</p>}

      <form onSubmit={handleSubmit} className="p-6 border rounded-2xl shadow-xl space-y-4 bg-white">
        {/* Keep all your existing form fields exactly as they are */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
            <input
              name="birthDate"
              type="date"
              value={form.birthDate}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
            <select
              name="niveau"
              value={form.niveau}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            >
              {form.category === "maternelle" ? (
                <>
                  <option value="TPS">TPS</option>
                  <option value="PS">PS</option>
                  <option value="MS">MS</option>
                  <option value="GS">GS</option>
                </>
              ) : (
                <>
                  <option value="CP">CP</option>
                  <option value="CE1">CE1</option>
                  <option value="CE2">CE2</option>
                  <option value="CM1">CM1</option>
                  <option value="CM2">CM2</option>
                </>
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Registration Date</label>
            <input
              name="registrationDate"
              type="date"
              value={form.registrationDate}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parent Phone</label>
            <input
              name="parentPhoneNumber"
              value={form.parentPhoneNumber}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isGarde"
                checked={form.isGarde}
                onChange={handleChange}
              />
              <span>After-School Care</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="usesTransport"
                checked={form.usesTransport}
                onChange={handleChange}
              />
              <span>Uses Transport</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
              />
              <span>Active</span>
            </label>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Processing..." : "Create Student"}
          </button>
        </div>
      </form>
    </div>
  );
}