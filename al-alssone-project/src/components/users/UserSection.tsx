import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import CreateUser from "./CreateUser"; // Import the Modal component

interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: "admin" | "assistant";
  phoneNumber: number;
  firstName: string;
  lastName: string;
}

const userData: User[] = [
  {
    _id: "1",
    username: "aya123",
    email: "aya@example.com",
    password: "secure123", // Normally not shown in UI
    role: "assistant",
    phoneNumber: 212612345678,
    firstName: "Aya",
    lastName: "El Amrani",
  },
  {
    _id: "2",
    username: "yassine_b",
    email: "yassine@example.com",
    password: "secure456",
    role: "admin",
    phoneNumber: 212678901234,
    firstName: "Yassine",
    lastName: "Benali",
  },
];

export default function UserSection() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredUsers = userData.filter((user) =>
    user.lastName.toLowerCase().includes(search.toLowerCase())
  );

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-700">Liste des utilisateurs</h2>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Rechercher par nom"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-5 py-3 text-sm border rounded-md shadow-sm border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
            onClick={toggleModal}
          >
            Ajouter un utilisateur
          </button>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-large text-gray-900">Nom</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-large text-gray-900">Prénom</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-large text-gray-900">Nom d'utilisateur</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-large text-gray-900">Email</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-large text-gray-900">Téléphone</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-large text-gray-900">Rôle</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-large text-gray-900">Actions</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800">{user.lastName}</TableCell>
                <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800">{user.firstName}</TableCell>
                <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800">{user.username}</TableCell>
                <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800">{user.email}</TableCell>
                <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800">{user.phoneNumber}</TableCell>
                <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 capitalize">{user.role}</TableCell>
                <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800">
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:underline text-sm">Modifier</button>
                    <button className="text-red-600 hover:underline text-sm">Supprimer</button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal for adding a new user */}
      <CreateUser isOpen={isModalOpen} onClose={toggleModal}>
        <div>
          {/* Add the user form here or leave it to the CreateUser component */}
        </div>
      </CreateUser>
    </div>
  );
}
