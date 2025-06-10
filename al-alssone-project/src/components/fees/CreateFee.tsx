import React, { useState, useEffect } from "react";
import api from "../../services/axios";
import { FaEye, FaEdit, FaTrashAlt } from "react-icons/fa"; // Import des icônes

export default function TableauFrais() {
  const [frais, setFrais] = useState([]);
  const [formulaire, setFormulaire] = useState({
    type: "inscription",
    categorie: "maternelle",
    description: "",
    montant: "",
    estActif: true,
    frequence: "Mensuel",
    id: null,
  });
  const [fraisVue, setFraisVue] = useState(null);
  const [termeRecherche, setTermeRecherche] = useState("");
  const [message, setMessage] = useState("");

  const recupererFrais = async () => {
    try {
      const reponse = await api.get("/fees");
      setFrais(reponse.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des frais :", error);
    }
  };

  useEffect(() => {
    recupererFrais();
  }, []);

  const gererChangement = (e) => {
    const { name, value, type: typeInput, checked } = e.target;
    setFormulaire({
      ...formulaire,
      [name]: typeInput === "checkbox" ? checked : value,
    });
  };

  const gererSoumission = async (e) => {
    e.preventDefault();
    setMessage("");

    const donneesAEnvoyer = {
      ...formulaire,
      montant: Number(formulaire.montant),
    };

    try {
      if (formulaire.id !== null) {
        await api.put(`/fees/${formulaire.id}`, donneesAEnvoyer);
        setMessage("Frais mis à jour avec succès.");
      } else {
        await api.post("/fees", donneesAEnvoyer);
        setMessage("Frais créés avec succès.");
      }

      recupererFrais();
      setFormulaire({
        type: "inscription",
        categorie: "maternelle",
        description: "",
        montant: "",
        estActif: true,
        frequence: "Mensuel",
        id: null,
      });
    } catch (error) {
      console.error("Erreur lors de la soumission des frais :", error);
      setMessage("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  const gererEdition = (fee) => {
    setFormulaire({
      ...fee,
      id: fee._id, // 👈 Utiliser l'id MongoDB
    });
    setMessage("");
  };

  const gererSuppression = async (id) => {
    try {
      await api.delete(`/fees/${id}`);
      recupererFrais();
      setMessage("Frais supprimés avec succès.");
    } catch (error) {
      console.error("Erreur lors de la suppression des frais :", error);
      setMessage("Échec de la suppression des frais.");
    }
  };

  const fraisFiltres = frais.filter((fee) =>
    [fee.type, fee.category]
      .some((champ) => champ?.toLowerCase().includes(termeRecherche.toLowerCase()))
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Section formulaire */}
      <form onSubmit={gererSoumission} className="p-6 border rounded-2xl shadow-xl space-y-4 bg-white h-fit">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
          {formulaire.id ? "Modifier un frais" : "Créer un frais"}
        </h2>

        {message && <p className="text-sm text-blue-600">{message}</p>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type de frais</label>
          <select
            name="type"
            value={formulaire.type}
            onChange={gererChangement}
            className="border p-2 w-full rounded"
          >
            <option value="inscription">Inscription</option>
            <option value="assurance">Assurance</option>
            <option value="garde">Garde d'enfants</option>
            <option value="education">Éducation</option>
            <option value="transport">Transport</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie de frais</label>
          <select
            name="categorie"
            value={formulaire.categorie}
            onChange={gererChangement}
            className="border p-2 w-full rounded"
          >
            <option value="maternelle">Maternelle</option>
            <option value="primaire">Primaire</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formulaire.description}
            onChange={gererChangement}
            className="border p-2 w-full rounded"
            placeholder="Brève description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Montant (MAD)</label>
          <input
            name="montant"
            type="number"
            value={formulaire.montant}
            onChange={gererChangement}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Actif ?</label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="estActif"
              checked={formulaire.estActif}
              onChange={gererChangement}
            />
            <span>Oui</span>
          </label>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {formulaire.id ? "Modifier" : "Créer"}
        </button>
      </form>

      {/* Tableau des frais */}
      <div className="p-6 border rounded-2xl shadow-xl space-y-4 bg-white h-fit">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Liste des frais</h2>

        <input
          type="text"
          placeholder="Rechercher par type ou catégorie"
          className="border p-2 w-full mb-4 rounded"
          value={termeRecherche}
          onChange={(e) => setTermeRecherche(e.target.value)}
        />

        <div className="overflow-x-auto max-h-[400px]">
          <table className="w-full table-auto border rounded">
            <thead className="sticky top-0 bg-gray-200 text-gray-700">
              <tr>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Catégorie</th>
                <th className="p-2 border">Montant</th>
                <th className="p-2 border">Statut</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fraisFiltres.map((fee) => (
                <tr
                  key={fee._id}
                  className={!fee.isActive ? "bg-gray-100 text-gray-400" : "hover:bg-gray-50"}
                >
                  <td className="p-2 border capitalize">{fee.type}</td>
                  <td className="p-2 border capitalize">{fee.category}</td>
                  <td className="p-2 border">{fee.amount}</td>
                  <td className="p-2 border">{fee.isActive ? "Actif" : "Inactif"}</td>
                  <td className="p-2 border space-x-2">
                    <button
                      onClick={() => setFraisVue(fee)}
                      className="text-green-400 hover:text-green-800 transition"
                    >
                      <FaEye className="inline-block mr-1" /> 
                    </button>
                    <button
                      onClick={() => gererEdition(fee)}
                      className="text-blue-400 hover:text-blue-800 transition"
                    >
                      <FaEdit className="inline-block mr-1" /> 
                    </button>
                    <button
                      onClick={() => gererSuppression(fee._id)}
                      className="text-red-400 hover:text-red-800 transition"
                    >
                      <FaTrashAlt className="inline-block mr-1" /> 
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de visualisation */}
      {fraisVue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] md:w-[500px] shadow-lg">
            <h3 className="text-xl font-bold mb-4">Détails du frais</h3>
            <p><strong>Type :</strong> {fraisVue.type}</p>
            <p><strong>Catégorie :</strong> {fraisVue.category}</p>
            <p><strong>Description :</strong> {fraisVue.description || "N/A"}</p>
            <p><strong>Montant :</strong> {fraisVue.amount} MAD</p>
            <p><strong>Statut :</strong> {fraisVue.isActive ? "Actif" : "Inactif"}</p>
            {fraisVue.frequency && <p><strong>Fréquence :</strong> {fraisVue.frequency}</p>}

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setFraisVue(null)}
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
