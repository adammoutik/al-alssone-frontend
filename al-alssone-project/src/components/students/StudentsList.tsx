import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/axios";
import { FaEye, FaEdit, FaTrashAlt } from "react-icons/fa";

export default function StudentsListPage() {
  const [students, setStudents] = useState([]);
  const [viewedStudent, setViewedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");

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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Students List</h1>
        <Link 
          to="/students/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create New Student
        </Link>
      </div>

      {message && <p className="text-sm text-blue-600 mb-4">{message}</p>}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search students..."
          className="border p-2 rounded w-full md:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Level</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              <tr 
                key={student._id} 
                className={`border-t ${!student.isActive ? "bg-gray-50 text-gray-400" : "hover:bg-gray-50"}`}
              >
                <td className="p-3">{student.firstName} {student.lastName}</td>
                <td className="p-3">{student.niveau}</td>
                <td className="p-3 capitalize">{student.category}</td>
                <td className="p-3">{student.isActive ? "Active" : "Inactive"}</td>
                <td className="p-3">
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => setViewedStudent(student)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEye />
                    </button>
                    <Link 
                      to={`/students/edit/${student._id}`}
                      className="text-green-500 hover:text-green-700"
                    >
                      <FaEdit />
                    </Link>
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

      {/* Keep your existing modal exactly as is */}
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