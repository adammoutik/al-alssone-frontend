import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Student {
  _id?: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  category: string;
  niveau: string;
  familyId?: string;
  registrationDate: string;
  parentPhoneNumber: string;
  usesTransport: boolean;
  isGarde: boolean;
  isActive: boolean;
}

interface Family {
  _id: string;
  familyName: string;
}

export default function StudentForm() {
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Student>({
    firstName: '',
    lastName: '',
    birthDate: '',
    category: '',
    niveau: '',
    registrationDate: new Date().toISOString().split('T')[0],
    parentPhoneNumber: '',
    usesTransport: false,
    isGarde: false,
    isActive: true
  });

  useEffect(() => {
    fetchFamilies();
  }, []);

  const fetchFamilies = async () => {
    try {
      const response = await axios.get('/families');
      setFamilies(response.data);
    } catch (err) {
      setError('Failed to fetch families');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData._id) {
        await axios.put(`/students/${formData._id}`, formData);
      } else {
        await axios.post('/students', formData);
      }
      // Reset form or handle success
      setFormData({
        firstName: '',
        lastName: '',
        birthDate: '',
        category: '',
        niveau: '',
        registrationDate: new Date().toISOString().split('T')[0],
        parentPhoneNumber: '',
        usesTransport: false,
        isGarde: false,
        isActive: true
      });
    } catch (err) {
      setError('Failed to save student');
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Add New Student</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Birth Date</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select Category</option>
              <option value="maternelle">Maternelle</option>
              <option value="primaire">Primaire</option>
              <option value="college">Collège</option>
              <option value="lycee">Lycée</option>
            </select>
          </div>
          <div>
            <label className="block mb-2">Niveau</label>
            <select
              name="niveau"
              value={formData.niveau}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select Niveau</option>
              <option value="PS">Petite Section</option>
              <option value="MS">Moyenne Section</option>
              <option value="GS">Grande Section</option>
              <option value="CP">CP</option>
              <option value="CE1">CE1</option>
              <option value="CE2">CE2</option>
              <option value="CM1">CM1</option>
              <option value="CM2">CM2</option>
              <option value="6eme">6ème</option>
              <option value="5eme">5ème</option>
              <option value="4eme">4ème</option>
              <option value="3eme">3ème</option>
              <option value="2nde">2nde</option>
              <option value="1ere">1ère</option>
              <option value="Terminale">Terminale</option>
            </select>
          </div>
          <div>
            <label className="block mb-2">Family</label>
            <select
              name="familyId"
              value={formData.familyId || ''}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select Family</option>
              {families.map(family => (
                <option key={family._id} value={family._id}>
                  {family.familyName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">Parent Phone Number</label>
            <input
              type="tel"
              name="parentPhoneNumber"
              value={formData.parentPhoneNumber}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="usesTransport"
                checked={formData.usesTransport}
                onChange={handleInputChange}
                className="mr-2"
              />
              Uses Transport
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isGarde"
                checked={formData.isGarde}
                onChange={handleInputChange}
                className="mr-2"
              />
              Garde
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="mr-2"
              />
              Active
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {formData._id ? 'Update Student' : 'Add Student'}
        </button>
      </form>
    </div>
  );
}