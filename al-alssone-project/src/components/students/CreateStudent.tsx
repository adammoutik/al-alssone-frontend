import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import DatePicker from "../form/date-picker.tsx";
import { ReactNode } from "react";

// Update the props interface to include children
interface CreateStudentProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode; // Declare children as a prop
}

const CreateStudent: React.FC<CreateStudentProps> = ({ isOpen, onClose, children }) => {

  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };

  const toggleModal = () => onClose(); // Close the modal when toggled

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full max-h-[90vh] overflow-y-auto">
            {children} {/* Render the children prop here */}
            <h2 className="text-xl font-semibold mb-4">Ajouter un élève</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="input">Nom</Label>
                <Input type="text" id="input" />
              </div>
              <div>
                <Label htmlFor="inputTwo">Prénom</Label>
                <Input type="text" id="inputTwo"  />
              </div>

              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Select
                  options={[{ value: "maternelle", label: "Maternelle" }, { value: "primaire", label: "Primaire" }]}
                  placeholder="Select category"
                  onChange={handleSelectChange}
                  className="dark:bg-dark-900"
                />
              </div>
              <div>
                <Label htmlFor="inputTwo">Niveau</Label>
                <Input type="text" id="inputTwo" placeholder="niveau" />
              </div>
              <div>
                <Label htmlFor="birthDate">Date de naissance</Label>
                <DatePicker
                  id="birthDate"
                  placeholder="Select a date"
                  onChange={(dates, currentDateString) => {
                    console.log({ dates, currentDateString });
                  }}
                />
              </div>
              <div>
                <Label htmlFor="inputTwo">Parent phone number</Label>
                <Input type="text" id="inputTwo" placeholder="98665432" />
              </div>
              <div>
                <Label htmlFor="birthDate">Date of registration</Label>
                <DatePicker
                  id="birthDate"
                  placeholder="Select a date"
                  onChange={(dates, currentDateString) => {
                    console.log({ dates, currentDateString });
                  }}
                />
              </div>
              <div>
                <Label htmlFor="category">Garde</Label>
                <Select
                  options={[{ value: "Oui", label: "Oui" }, { value: "Non", label: "Non" }]}
                  onChange={handleSelectChange}
                  className="dark:bg-dark-900"
                />
              </div>
              <div>
                <Label htmlFor="category">Transport</Label>
                <Select
                  options={[{ value: "Oui", label: "Oui" }, { value: "Non", label: "Non" }]}
                  onChange={handleSelectChange}
                  className="dark:bg-dark-900"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-500"
                  onClick={toggleModal} // Close the modal
                >
                  Annuler
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateStudent;
