import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/axios";

export default function CreerEtudiantPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    dateDeNaissance: "",
    categorie: "maternelle",
    niveau: "TPS",
    familleId: "",
    isGarde: false,
    utiliseTransport: false,
    dateInscription: "",
    telephoneParent: "",
    estActif: true,
  });
  const [message, setMessage] = useState("");
  const [chargement, setChargement] = useState(false);

  const gererChangement = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }));
  };

  const gererSoumission = async (e) => {
    e.preventDefault();
    setChargement(true);
    setMessage("");

    try {
      const donneesAEnvoyer = {
        ...form,
        dateDeNaissance: new Date(form.dateDeNaissance),
        dateInscription: new Date(form.dateInscription),
      };

      await api.post("/students", donneesAEnvoyer);
      setMessage("Étudiant créé avec succès !");
      
      // Redirection vers la liste des étudiants après 1.5 secondes
      setTimeout(() => {
        navigate("/students");
      }, 1500);
      
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
      setMessage("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Créer un nouvel étudiant</h1>
      
      {message && <p className="text-sm text-blue-600 mb-4">{message}</p>}

      <form onSubmit={gererSoumission} className="p-6 border rounded-2xl shadow-xl space-y-4 bg-white">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <input
              name="prenom"
              value={form.prenom}
              onChange={gererChangement}
              className="border p-2 w-full rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              name="nom"
              value={form.nom}
              onChange={gererChangement}
              className="border p-2 w-full rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
            <input
              name="dateDeNaissance"
              type="date"
              value={form.dateDeNaissance}
              onChange={gererChangement}
              className="border p-2 w-full rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <select
              name="categorie"
              value={form.categorie}
              onChange={gererChangement}
              className="border p-2 w-full rounded"
            >
              <option value="maternelle">Maternelle</option>
              <option value="primaire">Primaire</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
            <select
              name="niveau"
              value={form.niveau}
              onChange={gererChangement}
              className="border p-2 w-full rounded"
            >
              {form.categorie === "maternelle" ? (
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Date d'inscription</label>
            <input
              name="dateInscription"
              type="date"
              value={form.dateInscription}
              onChange={gererChangement}
              className="border p-2 w-full rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone du parent</label>
            <input
              name="telephoneParent"
              value={form.telephoneParent}
              onChange={gererChangement}
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
                onChange={gererChangement}
              />
              <span>Garderie après l'école</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="utiliseTransport"
                checked={form.utiliseTransport}
                onChange={gererChangement}
              />
              <span>Utilise le transport</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="estActif"
                checked={form.estActif}
                onChange={gererChangement}
              />
              <span>Actif</span>
            </label>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            disabled={chargement}
          >
            {chargement ? "Traitement..." : "Créer l'étudiant"}
          </button>
        </div>
      </form>
    </div>
  );
}
