import React, { useState, useEffect } from "react";
import api from "../../services/axios";
import { FaEye, FaEdit, FaTrashAlt } from "react-icons/fa";

export default function StudentsSection() {
  // State management
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    _id: "",
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
  const [viewedStudent, setViewedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch students
  const fetchStudents = async () => {
    try {
      const response = await api.get("/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      setMessage("An error occurred while fetching students.");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Form handlers
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

      if (form._id) {
        await api.put(`/students/${form._id}`, dataToSend);
        setMessage("Student updated successfully.");
      } else {
        await api.post("/students", dataToSend);
        setMessage("Student created successfully.");
      }
      
      fetchStudents();
      resetForm();
    } catch (error) {
      console.error("Error submitting student:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Student actions
  const handleEdit = (student) => {
    setForm({
      ...student,
      birthDate: student.birthDate ? student.birthDate.split('T')[0] : "",
      registrationDate: student.registrationDate ? student.registrationDate.split('T')[0] : ""
    });
    setMessage("");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await api.delete(`/students/${id}`);
        fetchStudents();
        setMessage("Student deleted successfully.");
      } catch (error) {
        console.error("Error deleting student:", error);
        setMessage("Failed to delete student.");
      }
    }
  };

  const resetForm = () => {
    setForm({
      _id: "",
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
  };

  // Filter students
  const filteredStudents = students.filter(student =>
    [student.firstName, student.lastName, student.niveau, student.category]
      .some(field => (field || "").toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Auto-clear messages
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Form Section */}
      <form onSubmit={handleSubmit} className="p-6 border rounded-2xl shadow-xl space-y-4 bg-white h-fit">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
          {form._id ? "Update Student" : "Create Student"}
        </h2>

        {message && <p className="text-sm text-blue-600">{message}</p>}

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
            {loading ? "Processing..." : form._id ? "Update" : "Create"}
          </button>
        </div>
      </form>

      {/* Students Table */}
      <div className="p-6 border rounded-2xl shadow-xl space-y-4 bg-white">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Students List</h2>
          <input
            type="text"
            placeholder="Search students..."
            className="border p-2 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto max-h-[400px]">
          <table className="w-full table-auto">
            <thead className="sticky top-0 bg-gray-100">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Level</th>
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr 
                  key={student._id} 
                  className={`border-t ${!student.isActive ? "bg-gray-100 text-gray-400" : "hover:bg-gray-50"}`}
                >
                  <td className="p-2">{student.firstName} {student.lastName}</td>
                  <td className="p-2">{student.niveau}</td>
                  <td className="p-2 capitalize">{student.category}</td>
                  <td className="p-2">{student.isActive ? "Active" : "Inactive"}</td>
                  <td className="p-2">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setViewedStudent(student)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaEye />
                      </button>
                      <button 
                        onClick={() => handleEdit(student)}
                        className="text-green-500 hover:text-green-700"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDelete(student._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Details Modal - Matching FamiliesManager Style */}
      {viewedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] md:w-[500px] shadow-lg">
            <h3 className="text-xl font-bold mb-4">Student Details</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="font-semibold">First Name:</p>
                <p>{viewedStudent.firstName}</p>
              </div>
              <div>
                <p className="font-semibold">Last Name:</p>
                <p>{viewedStudent.lastName}</p>
              </div>
              <div>
                <p className="font-semibold">Birth Date:</p>
                <p>{new Date(viewedStudent.birthDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-semibold">Category:</p>
                <p className="capitalize">{viewedStudent.category}</p>
              </div>
              <div>
                <p className="font-semibold">Level:</p>
                <p>{viewedStudent.niveau}</p>
              </div>
              <div>
                <p className="font-semibold">Family ID:</p>
                <p>{viewedStudent.familyId || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold">Registration Date:</p>
                <p>{new Date(viewedStudent.registrationDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-semibold">Parent Phone:</p>
                <p>{viewedStudent.parentPhoneNumber}</p>
              </div>
              <div>
                <p className="font-semibold">Transport:</p>
                <p>{viewedStudent.usesTransport ? "Yes" : "No"}</p>
              </div>
              <div>
                <p className="font-semibold">After-School Care:</p>
                <p>{viewedStudent.isGarde ? "Yes" : "No"}</p>
              </div>
              <div>
                <p className="font-semibold">Status:</p>
                <p>{viewedStudent.isActive ? "Active" : "Inactive"}</p>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setViewedStudent(null)}
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