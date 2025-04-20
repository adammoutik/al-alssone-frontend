import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import { ReactNode } from "react";

// Update the props interface to include children
interface CreateStudentProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode; // Declare children as a prop
}

const CreateUser: React.FC<CreateStudentProps> = ({ isOpen, onClose, children }) => {

  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };

  const toggleModal = () => onClose(); // Close the modal when toggled

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            {children} {/* Render the children prop here */}
            <h2 className="text-xl font-semibold mb-4">Ajouter un utilisateur</h2>
            <div className="space-y-4">
            <div>
                <Label htmlFor="input">firstName</Label>
                <Input type="text" id="input" />
              </div>
              <div>
                <Label htmlFor="input">lastName</Label>
                <Input type="text" id="input" />
              </div>
              <div>
                <Label htmlFor="input">Username</Label>
                <Input type="text" id="input" />
              </div>
              <div>
                <Label htmlFor="inputTwo">email</Label>
                <Input type="email" id="inputTwo" placeholder="info@gmail.com" />
              </div>
              <div>
                <Label htmlFor="inputTwo">phoneNumber</Label>
                <Input type="text" id="inputTwo" placeholder="987654321" />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  options={[
                    { value: "admin", label: "admin" },
                    { value: "assistant", label: "assistant" },
                  ]}
                  placeholder="Select role"
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

export default CreateUser;
