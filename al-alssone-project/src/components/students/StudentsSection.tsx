import React, { useState, useEffect } from "react";
import api from "../../services/axios";
import { FaEye, FaEdit, FaTrashAlt } from "react-icons/fa"; // Importing icons

export default function StudentsSection() {
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
  const [viewedStudent, setViewedStudent] = useState(null); // State for student details
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // State to track if the form is being submitted

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
    setLoading(true); // Start loading

    const dataToSend = {
      ...form,
      birthDate: new Date(form.birthDate),
      registrationDate: new Date(form.registrationDate),
    };

    try {
      let response;
      if (form._id) {
        response = await api.put(`/students/${form._id}`, dataToSend);
        setMessage("Student updated successfully.");
      } else {
        response = await api.post("/students", dataToSend);
        setMessage("Student created successfully.");
      }
      fetchStudents();
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
        isActive: true, // Resetting isActive field
      });
    } catch (error) {
      console.error("Error submitting student:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleEdit = (student) => {
    setForm({
      ...student,
      birthDate: student.birthDate ? student.birthDate.split('T')[0] : "", // Correct date formatting
      registrationDate: student.registrationDate ? student.registrationDate.split('T')[0] : "", // Correct date formatting
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

  const filteredStudents = students.filter((student) =>
    [student.firstName, student.lastName, student.niveau, student.category]
      .some((field) => (field || "").toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(""); // Clear message after 3 seconds
      }, 3000);
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
                <option value="CE6">CE6</option>
              </>
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Family ID (optional)</label>
          <input
            name="familyId"
            value={form.familyId}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Parent Phone Number</label>
          <input
            name="parentPhoneNumber"
            value={form.parentPhoneNumber}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">After-School Care (Garde)</label>
          <input
            type="checkbox"
            name="isGarde"
            checked={form.isGarde}
            onChange={handleChange}
            className="mr-2"
          />
          <span>Yes</span>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Uses School Transport</label>
          <input
            type="checkbox"
            name="usesTransport"
            checked={form.usesTransport}
            onChange={handleChange}
            className="mr-2"
          />
          <span>Yes</span>
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
          disabled={loading} // Disable button when loading
        >
          {loading ? "Submitting..." : form._id ? "Update" : "Create"}
        </button>
      </form>

      {/* Students Table */}
      <div className="p-6 border rounded-2xl shadow-xl space-y-4 bg-white">
        <h2 className="text-2xl font-bold">Students</h2>
        <input
          type="text"
          placeholder="Search by Name, Level, or Category"
          className="border p-2 w-full rounded mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="p-2 border-b">First Name</th>
              <th className="p-2 border-b">Last Name</th>
              <th className="p-2 border-b">Level</th>
              <th className="p-2 border-b">Category</th>
              <th className="p-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student._id}
              className={!student.isActive ? "bg-gray-100 text-gray-400" : "hover:bg-gray-50"}

              >
                <td className="p-2 border-b">{student.firstName}</td>
                <td className="p-2 border-b">{student.lastName}</td>
                <td className="p-2 border-b">{student.niveau}</td>
 <td className="p-2 border-b">{student.category}</td>
 <td className="p-2 border-b space-x-2 text-lg">
 <button onClick={() => setViewedStudent(viewedStudent?._id === student._id ? null : student)}>
 <FaEye className="text-blue-600 hover:text-blue-800" />
 </button>
 <button onClick={() => handleEdit(student)}>
 <FaEdit className="text-green-600 hover:text-green-800" />
 </button>
 <button onClick={() => handleDelete(student._id)}>
 <FaTrashAlt className="text-red-600 hover:text-red-800" />
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 {/* Student Details Viewer */}
 

{viewedStudent && (
 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] md:w-[500px] shadow-lg">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Student Details</h2>
    <p><strong>First Name:</strong> {viewedStudent.firstName}</p>
    <p><strong>Last Name:</strong> {viewedStudent.lastName}</p>
    <p><strong>Birth Date:</strong> {new Date(viewedStudent.birthDate).toLocaleDateString()}</p>
    <p><strong>Category:</strong> {viewedStudent.category}</p>
    <p><strong>Level:</strong> {viewedStudent.niveau}</p>
    <p><strong>Family ID:</strong> {viewedStudent.familyId || "N/A"}</p>
    <p><strong>Registration Date:</strong> {new Date(viewedStudent.registrationDate).toLocaleDateString()}</p>
    <p><strong>Parent Phone:</strong> {viewedStudent.parentPhoneNumber}</p>
    <p><strong>Uses Transport:</strong> {viewedStudent.usesTransport ? "Yes" : "No"}</p>
    <p><strong>Garde:</strong> {viewedStudent.isGarde ? "Yes" : "No"}</p>
    <p><strong>Is Active:</strong> {viewedStudent.isActive ? "Yes" : "No"}</p>
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
</div>
  );}