import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/axios";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";

interface User {
  _id: string;
  email: string;
  username: string;
  phoneNumber: number;
  firstName: string;
  lastName: string;
  role: string;
  password?: string;
}

export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [tempUser, setTempUser] = useState<Partial<User>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        // First get the authenticated user's ID
        const authResponse = await api.get("http://localhost:3000/auth", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!authResponse.data?._id) {
          throw new Error("User ID not found in auth response");
        }

        // Then fetch the full user details
        const userResponse = await api.get(
          `http://localhost:3000/users/${authResponse.data._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUser(userResponse.data);
        setTempUser(userResponse.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setError("Failed to load user data");
        localStorage.removeItem("token");
        navigate("/signin");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempUser(prev => ({
      ...prev,
      [name]: name === "phoneNumber" ? parseInt(value) || 0 : value,
    }));
  };

  const handleEditClick = () => {
    if (user) {
      setTempUser(user);
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setTempUser(user);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const dataToSend = { ...tempUser };
      if (!dataToSend.password) {
        delete dataToSend.password;
      }

      const response = await api.patch(
        `http://localhost:3000/users/${user._id}`,
        dataToSend,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update user:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading user data...</div>;
  }

  if (!user) {
    return <div className="p-4 text-center text-red-500">{error || "User not found"}</div>;
  }

  return (
    <div className="max-w-2xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
      <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        {/* Header and error display */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Mon Profil
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {isEditing ? "Modifiez vos informations" : "Consultez vos informations personnelles"}
            </p>
          </div>
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl mr-4">
              {user.firstName?.charAt(0)}
              {user.lastName?.charAt(0)}
            </div>
            {!isEditing && (
              <button
                onClick={handleEditClick}
                className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                aria-label="Modifier le profil"
              >
                <FiEdit2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-md dark:bg-red-900 dark:text-red-100">
            {error}
          </div>
        )}

        {/* Profile form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label>Prénom</Label>
                <Input
                  type="text"
                  name="firstName"
                  value={tempUser.firstName || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label>Nom</Label>
                <Input
                  type="text"
                  name="lastName"
                  value={tempUser.lastName || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={tempUser.email || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label>Nom d'utilisateur</Label>
                <Input
                  type="text"
                  name="username"
                  value={tempUser.username || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label>Numéro de téléphone</Label>
                <Input
                  type="number"
                  name="phoneNumber"
                  value={tempUser.phoneNumber || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label>Rôle</Label>
                <Input
                  type="text"
                  value={user.role}
                  disabled
                  className="bg-gray-50 dark:bg-gray-700"
                />
              </div>
            </div>

            {isEditing && (
              <div>
                <Label>Nouveau mot de passe</Label>
                <Input
                  type="password"
                  name="password"
                  value={tempUser.password || ""}
                  onChange={handleChange}
                  placeholder="Laissez vide pour ne pas changer"
                />
              </div>
            )}
          </div>

          {isEditing && (
            <div className="flex justify-end gap-4 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                <FiX className="inline mr-2" />
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                {isLoading ? (
                  'Enregistrement...'
                ) : (
                  <>
                    <FiSave className="inline mr-2" />
                    Enregistrer
                  </>
                )}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}