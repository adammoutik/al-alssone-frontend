import { useState, useEffect } from "react";
import axios from "axios";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";

export default function UserProfile() {
  // Replace this with how you get the current logged-in user ID in your app
  const userId = "current-user-id";

  const [user, setUser] = useState({
    email: "",
    username: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
    password: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempUser, setTempUser] = useState(user);

  // Fetch user info on mount
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get(`/users/${userId}`);
        setUser(res.data);
        setTempUser(res.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    }
    fetchUser();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempUser({ ...tempUser, [name]: value });
  };

  const handleEditClick = () => {
    setTempUser(user);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const dataToSend = { ...tempUser };
      if (!dataToSend.password) {
        dataToSend.password = " ";
      }

      const res = await axios.patch(`/users/${userId}`, dataToSend);
      setUser(res.data);
      setIsEditing(false);
      alert("Profil mis à jour !");
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("Erreur lors de la mise à jour du profil");
    }
  };

  return (
    <div className="max-w-2xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
      <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Mon Profil
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {isEditing
                ? "Modifiez vos informations"
                : "Consultez vos informations personnelles"}
            </p>
          </div>

          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl mr-4">
              {user.firstName?.charAt(0)}
              {user.lastName?.charAt(0)}
            </div>

            {!isEditing ? (
              <button
                onClick={handleEditClick}
                className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                aria-label="Modifier le profil"
              >
                <FiEdit2 className="w-5 h-5" />
              </button>
            ) : null}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label>Prénom</Label>
                <div className="relative mt-1">
                  <Input
                    type="text"
                    name="firstName"
                    value={tempUser.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50 dark:bg-gray-700" : ""}
                  />
                </div>
              </div>

              <div>
                <Label>Nom</Label>
                <div className="relative mt-1">
                  <Input
                    type="text"
                    name="lastName"
                    value={tempUser.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50 dark:bg-gray-700" : ""}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label>Email</Label>
                <div className="relative mt-1">
                  <Input
                    type="email"
                    name="email"
                    value={tempUser.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50 dark:bg-gray-700" : ""}
                  />
                </div>
              </div>

              <div>
                <Label>Nom d'utilisateur</Label>
                <div className="relative mt-1">
                  <Input
                    type="text"
                    name="username"
                    value={tempUser.username}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50 dark:bg-gray-700" : ""}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Numéro de téléphone</Label>
              <div className="relative mt-1">
                <Input
                  type="tel"
                  name="phoneNumber"
                  value={tempUser.phoneNumber}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50 dark:bg-gray-700" : ""}
                />
              </div>
            </div>

            {isEditing && (
              <div>
                <Label>Nouveau mot de passe</Label>
                <div className="relative mt-1">
                  <Input
                    type="password"
                    name="password"
                    value={tempUser.password}
                    onChange={handleChange}
                    placeholder="Laissez vide pour ne pas changer"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Minimum 8 caractères avec des chiffres et lettres
                </p>
              </div>
            )}
          </div>

          {isEditing && (
            <div className="flex justify-end gap-4 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
              >
                <FiX className="inline mr-2" />
                Annuler
              </Button>
              <Button
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <FiSave className="inline mr-2" />
                Enregistrer
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
