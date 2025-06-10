import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/axios";
import { FaEye, FaEdit, FaTrashAlt, FaSync } from "react-icons/fa";

interface User {
  _id: string;
  username: string;
  email: string;
  role: "admin" | "assistant";
  phoneNumber: number;
  firstName: string;
  lastName: string;
  createdAt?: string;
}

type FormState = {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: "admin" | "assistant";
  phoneNumber: string;
  firstName: string;
  lastName: string;
};

const initialFormState: FormState = {
  _id: "",
  username: "",
  email: "",
  password: "",
  role: "assistant",
  phoneNumber: "",
  firstName: "",
  lastName: "",
};

export default function UserSection() {
  // Gestion de l'état
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [viewedUser, setViewedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState({ table: false, form: false });
  const [error, setError] = useState<string | null>(null);

  // Récupérer les utilisateurs avec gestion d'erreur améliorée
  const fetchUsers = useCallback(async () => {
    try {
      console.log("[DEBUG] Démarrage de la récupération des utilisateurs...");
      setLoading(prev => ({ ...prev, table: true }));
      setError(null);
      
      const response = await api.get("/users");
      console.log("[DEBUG] Réponse API :", response);
      
      if (!response.data) {
        console.error("[ERREUR] Aucune donnée reçue dans la réponse");
        throw new Error("Aucune donnée utilisateur reçue du serveur");
      }
      
      if (!Array.isArray(response.data)) {
        console.error("[ERREUR] Les données ne sont pas un tableau :", response.data);
        throw new Error("Le serveur a retourné un format de données invalide");
      }

      const processedUsers = response.data.map(user => ({
        _id: user._id || "",
        username: user.username || "",
        email: user.email || "",
        role: user.role === "admin" ? "admin" : "assistant",
        phoneNumber: Number(user.phoneNumber) || 0,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        createdAt: user.createdAt
      }));

      console.log("[DEBUG] Utilisateurs traités :", processedUsers);
      setUsers(processedUsers);
      
    } catch (err: any) {
      console.error("[ERREUR] Échec de la récupération des utilisateurs :", {
        message: err.message,
        response: err.response,
        stack: err.stack
      });
      setError(err.response?.data?.message || "Échec du chargement des utilisateurs. Veuillez réessayer.");
      setUsers([]);
    } finally {
      setLoading(prev => ({ ...prev, table: false }));
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Gestionnaires du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ 
      ...prev, 
      [name]: name === "phoneNumber" ? value.replace(/\D/g, '') : value 
    }));
  };

  const validateForm = (): boolean => {
    if (!form.username.trim()) {
      setMessage({ text: "Le nom d'utilisateur est obligatoire", type: "error" });
      return false;
    }
    if (!form.email.trim()) {
      setMessage({ text: "L'email est obligatoire", type: "error" });
      return false;
    }
    if (!form._id && !form.password.trim()) {
      setMessage({ text: "Le mot de passe est obligatoire pour les nouveaux utilisateurs", type: "error" });
      return false;
    }
    if (form.phoneNumber && form.phoneNumber.length < 10) {
      setMessage({ text: "Le numéro de téléphone doit contenir au moins 10 chiffres", type: "error" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(prev => ({ ...prev, form: true }));
    setMessage({ text: "", type: "" });

    try {
      const userData = {
        username: form.username.trim(),
        email: form.email.trim(),
        role: form.role,
        phoneNumber: form.phoneNumber ? Number(form.phoneNumber) : 0,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        ...(form.password ? { password: form.password } : {})
      };

      if (form._id) {
        await api.patch(`/users/${form._id}`, userData);
        setMessage({ text: "Utilisateur mis à jour avec succès", type: "success" });
      } else {
        await api.post("/users/create", userData);
        setMessage({ text: "Utilisateur créé avec succès", type: "success" });
      }
      
      await fetchUsers();
      setForm(initialFormState);
    } catch (err: any) {
      console.error("[ERREUR] Échec de la sauvegarde de l'utilisateur :", err);
      setMessage({ 
        text: err.response?.data?.message || "Erreur lors de la sauvegarde de l'utilisateur. Veuillez réessayer.", 
        type: "error" 
      });
    } finally {
      setLoading(prev => ({ ...prev, form: false }));
    }
  };

  // Actions utilisateur
  const handleViewUser = (user: User) => {
    setViewedUser({
      _id: user._id,
      username: user.username || "N/A",
      email: user.email || "N/A",
      role: user.role || "assistant",
      phoneNumber: user.phoneNumber || 0,
      firstName: user.firstName || "N/A",
      lastName: user.lastName || "N/A",
      createdAt: user.createdAt
    });
  };

  const handleEdit = (user: User) => {
    setForm({
      _id: user._id,
      username: user.username || "",
      email: user.email || "",
      password: "",
      role: user.role || "assistant",
      phoneNumber: user.phoneNumber?.toString() || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
    });
    setMessage({ text: "", type: "" });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;
    
    try {
      setLoading(prev => ({ ...prev, table: true }));
      await api.delete(`/users/${id}`);
      setMessage({ text: "Utilisateur supprimé avec succès", type: "success" });
      await fetchUsers();
    } catch (err: any) {
      console.error("[ERREUR] Échec de la suppression de l'utilisateur :", err);
      setMessage({ 
        text: err.response?.data?.message || "Échec de la suppression de l'utilisateur", 
        type: "error" 
      });
    } finally {
      setLoading(prev => ({ ...prev, table: false }));
    }
  };

  // Filtrer les utilisateurs avec le terme de recherche
  const filteredUsers = React.useMemo(() => {
    return users.filter(user => {
      const searchContent = [
        user.username?.toLowerCase() || "",
        user.email?.toLowerCase() || "",
        user.phoneNumber?.toString() || "",
        user.role?.toLowerCase() || "",
        user.firstName?.toLowerCase() || "",
        user.lastName?.toLowerCase() || ""
      ].join(" ");
      return searchContent.includes(searchTerm.toLowerCase());
    });
  }, [users, searchTerm]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Section Formulaire */}
      <form onSubmit={handleSubmit} className="p-6 border rounded-2xl shadow-xl space-y-4 bg-white h-fit">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
          {form._id ? "Mettre à jour l'utilisateur" : "Créer un utilisateur"}
        </h2>

        {message.text && (
          <div className={`p-2 rounded ${
            message.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}>
            {message.text}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur*</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
              minLength={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe{form._id ? " (laisser vide pour ne pas changer)" : "*"}
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              minLength={form._id ? 0 : 6}
              required={!form._id}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rôle*</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            >
              <option value="assistant">Assistant</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone</label>
            <input
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              maxLength={15}
              pattern="\d*"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom de famille</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
          disabled={loading.form}
        >
          {loading.form ? "Traitement..." : (form._id ? "Mettre à jour" : "Créer")}
        </button>

    
      </form>

      {/* Section Table des utilisateurs */}
      <section className="p-6 border rounded-2xl shadow-xl bg-white">
        <h2 className="text-2xl font-bold mb-4">Utilisateurs</h2>

        <div className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="border p-2 rounded flex-grow"
          />
          <button
            onClick={fetchUsers}
            disabled={loading.table}
            className="bg-green-600 px-4 py-2 rounded text-white hover:bg-green-700 disabled:bg-green-300 flex items-center gap-2"
            title="Actualiser la liste"
          >
            <FaSync />
          </button>
        </div>

        {loading.table && <p>Chargement des utilisateurs...</p>}
        {error && <p className="text-red-600">{error}</p>}

        <div className="overflow-x-auto max-h-[600px]">
          <table className="min-w-full table-auto border-collapse border border-gray-300 text-left">
            <thead>
              <tr className="bg-gray-100 sticky top-0">
                <th className="border border-gray-300 px-4 py-2">Nom d'utilisateur</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Rôle</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 && !loading.table && (
                <tr>
                  <td colSpan={5} className="text-center p-4 text-gray-500">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              )}

              {filteredUsers.map(user => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{user.username}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                  <td className="border border-gray-300 px-4 py-2 capitalize">{user.role}</td>
                  <td className="border border-gray-300 px-4 py-2 flex gap-2">
                    <button
                      onClick={() => handleViewUser(user)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Voir"
                    >
                      <FaEye />
                    </button>

                    <button
                      onClick={() => handleEdit(user)}
                      className="text-green-600 hover:text-green-800"
                      title="Modifier"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Supprimer"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Affichage détaillé de l'utilisateur */}
        {viewedUser && (
          <div className="mt-6 p-4 border rounded bg-gray-50">
            <h3 className="text-xl font-semibold mb-2">Détails de l'utilisateur</h3>
            <p><strong>Nom d'utilisateur:</strong> {viewedUser.username}</p>
            <p><strong>Email:</strong> {viewedUser.email}</p>
            <p><strong>Rôle:</strong> {viewedUser.role}</p>
            <p><strong>Téléphone:</strong> {viewedUser.phoneNumber}</p>
            <p><strong>Prénom:</strong> {viewedUser.firstName}</p>
            <p><strong>Nom de famille:</strong> {viewedUser.lastName}</p>
            <p><strong>Créé le:</strong> {viewedUser.createdAt ? new Date(viewedUser.createdAt).toLocaleString() : "N/A"}</p>

            <button
              className="mt-3 underline text-blue-600 hover:text-blue-800"
              onClick={() => setViewedUser(null)}
            >
              Fermer
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
