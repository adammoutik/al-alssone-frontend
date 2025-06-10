import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/axios";
import { FaEye, FaEdit, FaTrashAlt, FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function StudentsListPage() {
  const [students, setStudents] = useState([]);
  const [viewedStudent, setViewedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedNiveau, setSelectedNiveau] = useState("");
  const [message, setMessage] = useState("");

  // Récupérer les étudiants
  const fetchStudents = async () => {
    try {
      const response = await api.get("/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des étudiants :", error);
      setMessage("Une erreur est survenue lors de la récupération des étudiants.");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet étudiant ?")) {
      try {
        await api.delete(`/students/${id}`);
        fetchStudents();
        setMessage("Étudiant supprimé avec succès.");
      } catch (error) {
        console.error("Erreur lors de la suppression de l'étudiant :", error);
        setMessage("Échec de la suppression de l'étudiant.");
      }
    }
  };

  // Filtrer les étudiants
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

  // Effacer automatiquement les messages après 3 secondes
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Générer rapport PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Liste des étudiants", 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Généré le : ${new Date().toLocaleDateString()}`, 14, 30);

    const tableData = filteredStudents.map((student) => [
      student.studentCode || "N/A",
      `${student.firstName} ${student.lastName}`,
      student.niveau,
      student.category,
      student.isActive ? "Actif" : "Inactif",
    ]);

    const headers = [["Code Étudiant", "Nom", "Niveau", "Catégorie", "Statut"]];

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

    doc.save(`rapport_etudiants_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Liste des étudiants</h1>
        <div className="flex space-x-3">
          <button
            onClick={generatePDF}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center"
          >
            <FaFilePdf className="mr-2" />
            Exporter en PDF
          </button>
          <Link
            to="/students/create"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Créer un nouvel étudiant
          </Link>
        </div>
      </div>

      {message && <p className="text-sm text-blue-600 mb-4">{message}</p>}

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Rechercher par nom..."
          className="border p-2 rounded w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border p-2 rounded w-full"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Toutes les catégories</option>
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
              <th className="p-3 text-left">Code Étudiant</th>
              <th className="p-3 text-left">Nom</th>
              <th className="p-3 text-left">Niveau</th>
              <th className="p-3 text-left">Catégorie</th>
              <th className="p-3 text-left">Statut</th>
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
                <td className="p-3">{student.isActive ? "Actif" : "Inactif"}</td>
                <td className="p-3">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setViewedStudent(student)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Voir détails"
                    >
                      <FaEye />
                    </button>
                    <Link
                      to={`/students/edit/${student._id}`}
                      className="text-green-500 hover:text-green-700"
                      title="Modifier"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => handleDelete(student._id)}
                      className="text-red-500 hover:text-red-700"
                      title="Supprimer"
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

      {viewedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] md:w-[500px] shadow-lg">
            <h3 className="text-xl font-bold mb-4">Détails de l'étudiant</h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="font-semibold">Code Étudiant :</p>
                <p>{viewedStudent.studentCode || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold">Prénom :</p>
                <p>{viewedStudent.firstName}</p>
              </div>
              <div>
                <p className="font-semibold">Nom :</p>
                <p>{viewedStudent.lastName}</p>
              </div>
              <div>
                <p className="font-semibold">Date de naissance :</p>
                <p>{new Date(viewedStudent.birthDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-semibold">Catégorie :</p>
                <p className="capitalize">{viewedStudent.category}</p>
              </div>
              <div>
                <p className="font-semibold">Niveau :</p>
                <p>{viewedStudent.niveau}</p>
              </div>
              <div>
                <p className="font-semibold">ID Famille :</p>
                <p>{viewedStudent.familyId || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold">Date d'inscription :</p>
                <p>{new Date(viewedStudent.registrationDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-semibold">Téléphone parent :</p>
                <p>{viewedStudent.parentPhoneNumber}</p>
              </div>
              <div>
                <p className="font-semibold">Transport scolaire :</p>
                <p>{viewedStudent.usesTransport ? "Oui" : "Non"}</p>
              </div>
              <div>
                <p className="font-semibold">Garderie :</p>
                <p>{viewedStudent.isGarde ? "Oui" : "Non"}</p>
              </div>
              <div>
                <p className="font-semibold">Statut :</p>
                <p>{viewedStudent.isActive ? "Actif" : "Inactif"}</p>
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
    </div>
  );
}
