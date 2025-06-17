import  { useState, useEffect, FormEvent } from "react";
import { Link } from "react-router-dom";
import api from "../../services/axios";
import { FaEye, FaEdit, FaTrashAlt, FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface Student {
  _id: string;
  studentCode?: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  category: string;
  niveau: string;
  familyId: string;
  isGarde: boolean;
  usesTransport: boolean;
  registrationDate: string;
  parentPhoneNumber: string;
  isActive: boolean;
}

export default function StudentsListPage() {
  const [form, setForm] = useState<Student>({
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
  const [students, setStudents] = useState<Student[]>([]);
  const [viewedStudent, setViewedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedNiveau, setSelectedNiveau] = useState("");
  const [message, setMessage] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch students
  const fetchStudents = async () => {
    try {
      const response = await api.get("/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      setMessage("Error fetching students");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle edit
  const handleEdit = (student: Student) => {
    setForm({
      ...student,
      birthDate: student.birthDate ? student.birthDate.split('T')[0] : "",
      registrationDate: student.registrationDate ? student.registrationDate.split('T')[0] : "",
    });
    setShowEditModal(true);
    setMessage("");
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/students/${form._id}`, form);
      fetchStudents();
      setMessage("Student updated successfully");
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating student:", error);
      setMessage("Error updating student");
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await api.delete(`/students/${id}`);
        fetchStudents();
        setMessage("Student deleted successfully");
      } catch (error) {
        console.error("Error deleting student:", error);
        setMessage("Error deleting student");
      }
    }
  };

  // Filter students
  const filteredStudents = students.filter((student) => {
    const nameMatch =
      [student.firstName, student.lastName]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const categoryMatch =
      !selectedCategory || student.category === selectedCategory;

    const niveauMatch = !selectedNiveau || student.niveau === selectedNiveau;

    return nameMatch && categoryMatch && niveauMatch;
  });

  // Clear messages after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Generate PDF report
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Students List", 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    const tableData = filteredStudents.map((student) => [
      student.studentCode || "N/A",
      `${student.firstName} ${student.lastName}`,
      student.niveau,
      student.category,
      student.isActive ? "Active" : "Inactive",
    ]);

    const headers = [["Student Code", "Name", "Level", "Category", "Status"]];

    doc.autoTable({
      head: headers,
      body: tableData,
      startY: 40,
      styles: { fontSize: 10, cellPadding: 3, valign: "middle" },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 40 },
    });

    doc.save(`students_report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Liste des Élèves</h1>
        <div className="flex space-x-3">
          <button
            onClick={generatePDF}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center"
          >
            <FaFilePdf className="mr-2" />
            Exporter PDF
          </button>
          <Link
            to="/students/create"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
             Créé un Élève
          </Link>
        </div>
      </div>

      {message && (
        <div className={`p-3 mb-4 rounded ${
          message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
        }`}>
          {message}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          className="border p-2 rounded w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border p-2 rounded w-full"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Tous les Categories</option>
          <option value="maternelle">Maternelle</option>
          <option value="primaire">Primaire</option>
        </select>
        <select
          className="border p-2 rounded w-full"
          value={selectedNiveau}
          onChange={(e) => setSelectedNiveau(e.target.value)}
        >
          <option value="">Tous les niveaux</option>
          <option value="TPS">TPS</option>
          <option value="PS">PS</option>
          <option value="MS">MS</option>
          <option value="GS">GS</option>
          <option value="CP">CP</option>
          <option value="CE1">CE1</option>
          <option value="CE2">CE2</option>
          <option value="CM1">CM1</option>
          <option value="CM2">CM2</option>
          <option value="CE6">CE6</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Code d'Élève</th>
              <th className="p-3 text-left">Nom</th>
              <th className="p-3 text-left">Niveau</th>
              <th className="p-3 text-left">Categorie</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr
                key={student._id}
                className={`border-t ${
                  !student.isActive ? "bg-gray-50 text-gray-400" : "hover:bg-gray-50"
                }`}
              >
                <td className="p-3">{student.studentCode || "N/A"}</td>
                <td className="p-3">{student.firstName} {student.lastName}</td>
                <td className="p-3">{student.niveau}</td>
                <td className="p-3 capitalize">{student.category}</td>
                <td className="p-3">{student.isActive ? "Active" : "Inactive"}</td>
                <td className="p-3">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setViewedStudent(student)}
                      className="text-blue-500 hover:text-blue-700"
                      title="View details"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleEdit(student)}
                      className="text-green-500 hover:text-green-700"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(student._id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
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

      {/* View Student Modal */}
      {viewedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] md:w-[500px] shadow-lg">
            <h3 className="text-xl font-bold mb-4">Details d'Élève</h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="font-semibold">Code d'Élève:</p>
                <p>{viewedStudent.studentCode || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold">Prénom:</p>
                <p>{viewedStudent.firstName}</p>
              </div>
              <div>
                <p className="font-semibold">Nom:</p>
                <p>{viewedStudent.lastName}</p>
              </div>
              <div>
                <p className="font-semibold">Date de naissance:</p>
                <p>{new Date(viewedStudent.birthDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-semibold">Categorie:</p>
                <p className="capitalize">{viewedStudent.category}</p>
              </div>
              <div>
                <p className="font-semibold">niveau:</p>
                <p>{viewedStudent.niveau}</p>
              </div>
             
              <div>
                <p className="font-semibold">Date d'inscription:</p>
                <p>{new Date(viewedStudent.registrationDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-semibold">Parent Phone:</p>
                <p>{viewedStudent.parentPhoneNumber}</p>
              </div>
              <div>
                <p className="font-semibold">Utilise le transport:</p>
                <p>{viewedStudent.usesTransport ? "Oui" : "Non"}</p>
              </div>
              <div>
                <p className="font-semibold">After School Care:</p>
                <p>{viewedStudent.isGarde ? "Oui" : "Non"}</p>Garde après l'école
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
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] md:w-[500px] shadow-lg">
            <h3 className="text-xl font-bold mb-4">Modifier Élève</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="col-span-1">
                  <label className="block font-semibold mb-1">Prénom</label>
                  <input
                    type="text"
                    className="border p-2 rounded w-full"
                    value={form.firstName}
                    onChange={(e) => setForm({...form, firstName: e.target.value})}
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label className="block font-semibold mb-1">Nom</label>
                  <input
                    type="text"
                    className="border p-2 rounded w-full"
                    value={form.lastName}
                    onChange={(e) => setForm({...form, lastName: e.target.value})}
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label className="block font-semibold mb-1">Date de naissance</label>
                  <input
                    type="date"
                    className="border p-2 rounded w-full"
                    value={form.birthDate}
                    onChange={(e) => setForm({...form, birthDate: e.target.value})}
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label className="block font-semibold mb-1">Categorie</label>
                  <select
                    className="border p-2 rounded w-full"
                    value={form.category}
                    onChange={(e) => setForm({...form, category: e.target.value})}
                    required
                  >
                    <option value="maternelle">Maternelle</option>
                    <option value="primaire">Primaire</option>
                  </select>
                </div>
                <div className="col-span-1">
                  <label className="block font-semibold mb-1">Niveau</label>
                  <select
                    className="border p-2 rounded w-full"
                    value={form.niveau}
                    onChange={(e) => setForm({...form, niveau: e.target.value})}
                    required
                  >
                    <option value="TPS">TPS</option>
                    <option value="PS">PS</option>
                    <option value="MS">MS</option>
                    <option value="GS">GS</option>
                    <option value="CP">CP</option>
                    <option value="CE1">CE1</option>
                    <option value="CE2">CE2</option>
                    <option value="CM1">CM1</option>
                    <option value="CM2">CM2</option>
                    <option value="CE6">CE6</option>
                  </select>
                </div>
              
                <div className="col-span-1">
                  <label className="block font-semibold mb-1">Téléphone du parent</label>
                  <input
                    type="text"
                    className="border p-2 rounded w-full"
                    value={form.parentPhoneNumber}
                    onChange={(e) => setForm({...form, parentPhoneNumber: e.target.value})}
                    required
                  />
                </div>
                <div className="col-span-1 flex items-center">
                  <input
                    type="checkbox"
                    id="isGarde"
                    className="mr-2"
                    checked={form.isGarde}
                    onChange={(e) => setForm({...form, isGarde: e.target.checked})}
                  />
                  <label htmlFor="isGarde">Garde après l'école</label>
                </div>
                <div className="col-span-1 flex items-center">
                  <input
                    type="checkbox"
                    id="usesTransport"
                    className="mr-2"
                    checked={form.usesTransport}
                    onChange={(e) => setForm({...form, usesTransport: e.target.checked})}
                  />
                  <label htmlFor="usesTransport">Utilise le transportt</label>
                </div>
                <div className="col-span-1 flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    className="mr-2"
                    checked={form.isActive}
                    onChange={(e) => setForm({...form, isActive: e.target.checked})}
                  />
                  <label htmlFor="isActive">Active</label>
                </div>
              </div>

              <div className="mt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Fermer
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}