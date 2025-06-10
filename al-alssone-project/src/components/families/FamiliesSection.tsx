import React, { useState, useEffect } from "react";
import api from "../../services/axios";
import {
  FaEye,
  FaEdit,
  FaTrashAlt,
  FaUserPlus,
  FaEnvelope
} from "react-icons/fa";

export default function FamiliesManager() {
  const [families, setFamilies] = useState([]);
  const [students, setStudents] = useState([]);
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
  const [error, setError] = useState(null);

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
        console.error("Erreur lors de la récupération des données :", err);
        setError("Échec du chargement des données. Veuillez réessayer plus tard.");
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
        setMessage({ text: "Famille mise à jour avec succès !", type: "success" });
      } else {
        await api.post("/families", payload);
        setMessage({ text: "Famille créée avec succès !", type: "success" });
      }
      const familiesRes = await api.get("/families");
      setFamilies(familiesRes.data || []);
      resetForm();
    } catch (err) {
      console.error("Erreur lors de la sauvegarde de la famille :", err);
      setMessage({
        text: err.response?.data?.message || "Erreur lors de la sauvegarde de la famille. Veuillez réessayer.",
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
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette famille ?")) {
      try {
        await api.delete(`/families/${id}`);
        setMessage({ text: "Famille supprimée avec succès !", type: "success" });
        const familiesRes = await api.get("/families");
        setFamilies(familiesRes.data || []);
      } catch (err) {
        console.error("Erreur lors de la suppression de la famille :", err);
        setMessage({ 
          text: err.response?.data?.message || "Erreur lors de la suppression de la famille.", 
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
      setModalMessage({ text: "Enfant ajouté à la famille avec succès !", type: "success" });
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
      console.error("Erreur lors de l'ajout de l'enfant :", err);
      setModalMessage({
        text: err.response?.data?.message || "Erreur lors de l'ajout de l'enfant à la famille",
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
      return <span className="text-gray-500">Pas d'enfants</span>;
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
          </div>
        ))}
      </div>
    );
  };

  const filteredFamilies = families.filter((family) =>
    family?.familyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    family?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Section formulaire */}
      <form onSubmit={handleSubmit} className="p-6 border rounded-2xl shadow-xl space-y-4 bg-white h-fit">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
          {form.id ? "Modifier la famille" : "Créer une famille"}
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
            Pourcentage de réduction
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
              Éligible aux réductions ?
            </span>
          </label>
        </div>

        {form.isEligible && form.id && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enfant bénéficiant de la réduction
            </label>
            <select
              name="discountChild"
              value={form.discountChild}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            >
              <option value="">-- Sélectionner un enfant --</option>
              {families
                .find((f) => f._id === form.id)
                ?.children?.map((child) => (
                  <option key={child._id} value={child._id}>
                    {child.firstName} {child.lastName}
                  </option>
                ))}
            </select>
          </div>
        )}

        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            {form.id ? "Mettre à jour" : "Créer"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded"
          >
            Annuler
          </button>
        </div>
      </form>

      {/* Section tableau */}
      <div className="p-6 bg-white rounded-2xl shadow-xl overflow-auto">
        <h2 className="text-2xl font-bold mb-4">Liste des familles</h2>

        <input
          type="text"
          placeholder="Rechercher une famille..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded mb-4 w-full"
        />

        {filteredFamilies.length === 0 ? (
          <p className="text-gray-500">Aucune famille trouvée.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2 text-left">Nom de la famille</th>
                <th className="border px-4 py-2 text-left">Email</th>
                <th className="border px-4 py-2 text-left">Enfants</th>
                <th className="border px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFamilies.map((family) => (
                <tr key={family._id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{family.familyName}</td>
                  <td className="border px-4 py-2">{family.email}</td>
                  <td className="border px-4 py-2">{renderChildren(family)}</td>
                  <td className="border px-4 py-2 text-center space-x-2">
                    <button
                      title="Modifier"
                      onClick={() => handleEdit(family)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      title="Supprimer"
                      onClick={() => handleDelete(family._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrashAlt />
                    </button>
                    <button
                      title="Ajouter un enfant"
                      onClick={() => {
                        setShowAddChildModal(true);
                        setAddChildForm({ familyId: family._id, studentId: "" });
                      }}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FaUserPlus />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal pour ajouter un enfant */}
      {showAddChildModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded p-6 max-w-md w-full shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Ajouter un enfant à la famille</h3>

            {modalMessage.text && (
              <p className={`text-sm ${
                modalMessage.type === "error" ? "text-red-500" : "text-green-500"
              } mb-4`}>
                {modalMessage.text}
              </p>
            )}

            <form onSubmit={handleAddChild}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enfant
                </label>
                <select
                  required
                  value={addChildForm.studentId}
                  onChange={(e) =>
                    setAddChildForm((prev) => ({
                      ...prev,
                      studentId: e.target.value,
                    }))
                  }
                  className="border p-2 rounded w-full"
                >
                  <option value="">-- Sélectionner un enfant --</option>
                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.firstName} {student.lastName} - {student.level}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddChildModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
