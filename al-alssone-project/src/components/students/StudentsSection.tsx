import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import CreateStudent from "./CreateStudent"; // Import the Modal component

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: Date;
  category: "maternelle" | "primaire";
  niveau: string;
  registrationDate: Date;
  parentPhoneNumber: string;
  familyId?: string;
  isGarde?: boolean;
  usesTransport?: boolean;
}

const studentData: Student[] = [
  {
    id: 1,
    firstName: "Aya",
    lastName: "El Amrani",
    birthDate: new Date("2018-04-10"),
    category: "maternelle",
    niveau: "Grande Section",
    registrationDate: new Date("2024-09-01"),
    parentPhoneNumber: "0612345678",
    isGarde: true,
    usesTransport: false,
  },
  {
    id: 2,
    firstName: "Yassine",
    lastName: "Benali",
    birthDate: new Date("2015-11-23"),
    category: "primaire",
    niveau: "CE1",
    registrationDate: new Date("2023-09-01"),
    parentPhoneNumber: "0678123456",
    isGarde: false,
    usesTransport: true,
  },
];

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function StudentsSection() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  const filteredStudents = studentData.filter((student) =>
    student.lastName.toLowerCase().includes(search.toLowerCase())
  );

  const toggleModal = () => setIsModalOpen(!isModalOpen); // Toggle modal visibility

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-700">Liste des élèves</h2>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Rechercher un élève par nom"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-5 py-3 text-sm border rounded-md shadow-sm border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
            onClick={toggleModal} // Open the modal
          >
            Ajouter un élève
          </button>
         
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-large text-gray-900">
                Nom
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-large text-gray-900">
                Prénom
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-large text-gray-900">
                Date de naissance
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-large text-gray-900">
                Catégorie
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-large text-gray-900">
                Niveau
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-large text-gray-900">
                Date d'inscription
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-large text-gray-900">
                Téléphone parent
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-large text-gray-900">
                Garde
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-large text-gray-900">
                Transport
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-large text-gray-900">
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100">
            {filteredStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-sm text-gray-800">
                  {student.lastName}
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-sm text-gray-800">
                  {student.firstName}
                </TableCell>
                <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500">
                  {formatDate(student.birthDate)}
                </TableCell>
                <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 capitalize">
                  {student.category}
                </TableCell>
                <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500">
                  {student.niveau}
                </TableCell>
                <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500">
                  {formatDate(student.registrationDate)}
                </TableCell>
                <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500">
                  {student.parentPhoneNumber}
                </TableCell>
                <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500">
                  {student.isGarde ? "Oui" : "Non"}
                </TableCell>
                <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500">
                  {student.usesTransport ? "Oui" : "Non"}
                </TableCell>
                <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500">
                  <div className="flex gap-2">
                    <button className="text-green-600 hover:underline text-sm">Modifier</button>
                    <button className="text-red-600 hover:underline text-sm">Supprimer</button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal for adding a new student */}
      <CreateStudent isOpen={isModalOpen} onClose={toggleModal}>
  {/* Add the student form here */}
  <div>
    {/* You can add form fields here, similar to the modal we created earlier */}
  </div>
</CreateStudent>

    </div>
  );
}
