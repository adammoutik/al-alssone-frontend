import React, { useState, useEffect } from "react";
import api from "../../services/axios";
import {
  FaEye,
  FaEdit,
  FaTrashAlt,
  FaUserPlus,
  FaEnvelope
} from "react-icons/fa";

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  category: string;
  niveau: string;
}

interface Family {
  _id: string;
  familyName: string;
  email: string;
  children: Student[];
  discountPercentage: number;
  IsEligible: boolean;
}

export default function FamiliesManager() {
  const [families, setFamilies] = useState<Family[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [form, setForm] = useState({
    familyName: "",
    email: "",
    discountPercentage: 20,
    isEligible: false,
    discountChild: "",
    id: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [addChildForm, setAddChildForm] = useState({
    familyId: "",
    studentId: "",
  });
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [modalMessage, setModalMessage] = useState({ text: "", type: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [familiesRes, studentsRes] = await Promise.all([
          api.get("/families"),
          api.get("/students"),
        ]);
        setFamilies(familiesRes.data || []);
        setStudents(studentsRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    try {
      const payload = {
        familyName: form.familyName,
        email: form.email,
        discountPercentage: form.discountPercentage,
        IsEligible: form.isEligible,
        discountChild: form.discountChild || undefined
      };

      if (form.id) {
        await api.put(`/families/${form.id}`, payload);
        setMessage({ text: "Famille modifiees avec succès!", type: "success" });
      } else {
        await api.post("/families", payload);
        setMessage({ text: "Famille créés avec succès!", type: "success" });
      }
      const familiesRes = await api.get("/families");
      setFamilies(familiesRes.data || []);
      resetForm();
    } catch (err) {
      console.error("Error saving family:", err);
      setMessage({
        text: err.response?.data?.message || "Error saving family. Please try again.",
        type: "error",
      });
    }
  };

  const handleEdit = (family) => {
    setForm({
      familyName: family.familyName || "",
      email: family.email || "",
      discountPercentage: family.discountPercentage || 20,
      isEligible: family.IsEligible || false,
      discountChild: family.discountChild?._id || "",
      id: family._id,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this family?")) {
      try {
        await api.delete(`/families/${id}`);
        setMessage({ text: "Family deleted successfully!", type: "success" });
        const familiesRes = await api.get("/families");
        setFamilies(familiesRes.data || []);
      } catch (err) {
        console.error("Error deleting family:", err);
        setMessage({ 
          text: err.response?.data?.message || "Error deleting family.", 
          type: "error" 
        });
      }
    }
  };

  const handleAddChild = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/families/${addChildForm.familyId}/children`, {
        studentId: addChildForm.studentId,
      });
      setModalMessage({ text: "L'enfant ajouter a la famille avec succes", type: "success" });
      setTimeout(() => {
        const fetchData = async () => {
          const familiesRes = await api.get("/families");
          setFamilies(familiesRes.data || []);
        };
        fetchData();
        setShowAddChildModal(false);
        setAddChildForm({ familyId: "", studentId: "" });
        setModalMessage({ text: "", type: "" });
      }, 1500);
    } catch (err) {
      console.error("Error adding child:", err);
      setModalMessage({
        text: err.response?.data?.message || "Error adding child to family",
        type: "error",
      });
    }
  };

  const resetForm = () => {
    setForm({
      familyName: "",
      email: "",
      discountPercentage: 20,
      isEligible: false,
      discountChild: "",
      id: null,
    });
  };

  const renderChildren = (family) => {
    if (!family.children || family.children.length === 0) {
      return <span className="text-gray-500">Aucun enfant</span>;
    }

    return (
      <div className="space-y-1">
        {family.children.map((student, index) => (
          <div key={student._id || index} className="flex items-center justify-between">
            <div className="flex items-center">
              <span>{student.firstName} {student.lastName}</span>
              {family.discountChild?._id === student._id && (
                <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  Réduction
                </span>
              )}
            </div>
            {/* <button
              onClick={() => setViewedStudent(student)}
              className="text-blue-400 hover:text-blue-600 ml-2"
              title="View student details"
            >
              <FaEye />
            </button> */}
          </div>
        ))}
      </div>
    );
  };

  const filteredFamilies = families.filter((family) =>
    family?.familyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    family?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Form Section */}
      <form onSubmit={handleSubmit} className="p-6 border rounded-2xl shadow-xl space-y-4 bg-white h-fit">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
          {form.id ? "Modifier Famille" : "Créer Famille"}
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
            Nom de la famille <span className="text-red-500">*</span>
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
            Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="border p-2 w-full rounded pl-10"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
          Percentage de la réduction
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
              name="isEligible"
              checked={form.isEligible}
              onChange={handleChange}
            />
            <span className="text-sm font-medium text-gray-700">
Est éligible aux réductions ?            </span>
          </label>
        </div>

        {form.isEligible && form.id && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
             Enfant avec Réduction
            </label>
            <select
              name="discountChild"
              value={form.discountChild}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            >
              <option value="">Sélectionnez un enfant pour la réduction</option>
              {families
                .find(f => f._id === form.id)
                ?.children
                ?.map(child => (
                  <option key={child._id} value={child._id}>
                    {child.firstName} {child.lastName}
                  </option>
                ))}
            </select>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {form.id ? "Update" : "Create"}
          </button>
          {form.id && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
            >
              Fermer
            </button>
          )}
        </div>
      </form>

      {/* Families Table */}
      <div className="p-6 border rounded-2xl shadow-xl space-y-4 bg-white h-fit">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Liste des Families</h2>

        <input
          type="text"
          placeholder="Search by family name or email"
          className="border p-2 w-full mb-4 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {filteredFamilies.length === 0 ? (
          <p className="text-center py-4 text-gray-500">
            {families.length === 0 ? "No families found" : "No matching families found"}
          </p>
        ) : (
          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full table-auto border rounded">
              <thead className="sticky top-0 bg-gray-200 text-gray-700">
                <tr>
                  <th className="p-2 border">Nom de la famille</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">enfants</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFamilies.map((family) => (
                  <tr key={family._id} className="hover:bg-gray-50">
                    <td className="p-2 border">{family.familyName || "-"}</td>
                    <td className="p-2 border">{family.email || "-"}</td>
                    <td className="p-2 border max-w-[200px]">
                      {renderChildren(family)}
                    </td>
                   
                    <td className="p-2 border space-x-2">
                      <button
                        onClick={() => handleEdit(family)}
                        className="text-blue-400 hover:text-blue-800 transition"
                        title="Modifier une famille"
                      >
                        <FaEdit className="inline-block mr-1" />
                      </button>
                      <button
                        onClick={() => handleDelete(family._id)}
                        className="text-red-400 hover:text-red-800 transition"
                        title="Supprimer une famille"
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
                        title="Ajouter un enfant"
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

      {/* Add Child Modal */}
      {showAddChildModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form onSubmit={handleAddChild} className="bg-white p-6 rounded-xl w-[90%] md:w-[500px] shadow-lg">
            <h3 className="text-xl font-bold mb-4">Ajouter un enfant a une famille</h3>
            
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
                Selectionner un enfant
              </label>
              <select
                className="border p-2 w-full rounded"
                value={addChildForm.studentId}
                onChange={(e) => setAddChildForm({...addChildForm, studentId: e.target.value})}
                required
              >
                {students.map(student => (
                  <option key={student._id} value={student._id}>
                    {student.firstName} {student.lastName} 
                    {student.category && ` (${student.category}`}
                    {student.niveau && ` - ${student.niveau})`}
                    {families.some(family => 
                      family.children && family.children.some(child => child._id === student._id)
                    ) && " [Assigné]"}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Les élèves marqués par '[Assigné]' sont déjà dans une famille
              </p>
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
                Fermer
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
               Ajouter un enfant
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}