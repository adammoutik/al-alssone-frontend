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
  // State management
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [viewedUser, setViewedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState({ table: false, form: false });
  const [error, setError] = useState<string | null>(null);

  // Fetch users with enhanced error handling
  const fetchUsers = useCallback(async () => {
    try {
      console.log("[DEBUG] Starting user fetch...");
      setLoading(prev => ({ ...prev, table: true }));
      setError(null);
      
      const response = await api.get("/users");
      console.log("[DEBUG] API Response:", response);
      
      if (!response.data) {
        console.error("[ERROR] No data received in response");
        throw new Error("No user data received from server");
      }
      
      if (!Array.isArray(response.data)) {
        console.error("[ERROR] Data is not an array:", response.data);
        throw new Error("Server returned invalid data format");
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

      console.log("[DEBUG] Processed users:", processedUsers);
      setUsers(processedUsers);
      
    } catch (err: any) {
      console.error("[ERROR] Failed to fetch users:", {
        message: err.message,
        response: err.response,
        stack: err.stack
      });
      setError(err.response?.data?.message || "Failed to load users. Please try again.");
      setUsers([]);
    } finally {
      setLoading(prev => ({ ...prev, table: false }));
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Form handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ 
      ...prev, 
      [name]: name === "phoneNumber" ? value.replace(/\D/g, '') : value 
    }));
  };

  const validateForm = (): boolean => {
    if (!form.username.trim()) {
      setMessage({ text: "Username is required", type: "error" });
      return false;
    }
    if (!form.email.trim()) {
      setMessage({ text: "Email is required", type: "error" });
      return false;
    }
    if (!form._id && !form.password.trim()) {
      setMessage({ text: "Password is required for new users", type: "error" });
      return false;
    }
    if (form.phoneNumber && form.phoneNumber.length < 10) {
      setMessage({ text: "Phone number must be at least 10 digits", type: "error" });
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
        setMessage({ text: "User updated successfully", type: "success" });
      } else {
        await api.post("/users/create", userData);
        setMessage({ text: "User created successfully", type: "success" });
      }
      
      await fetchUsers();
      setForm(initialFormState);
    } catch (err: any) {
      console.error("[ERROR] Failed to save user:", err);
      setMessage({ 
        text: err.response?.data?.message || "Error saving user. Please try again.", 
        type: "error" 
      });
    } finally {
      setLoading(prev => ({ ...prev, form: false }));
    }
  };

  // User actions
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
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    
    try {
      setLoading(prev => ({ ...prev, table: true }));
      await api.delete(`/users/${id}`);
      setMessage({ text: "User deleted successfully", type: "success" });
      await fetchUsers();
    } catch (err: any) {
      console.error("[ERROR] Failed to delete user:", err);
      setMessage({ 
        text: err.response?.data?.message || "Failed to delete user", 
        type: "error" 
      });
    } finally {
      setLoading(prev => ({ ...prev, table: false }));
    }
  };

  // Filter users with search term
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
      {/* Form Section */}
      <form onSubmit={handleSubmit} className="p-6 border rounded-2xl shadow-xl space-y-4 bg-white h-fit">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
          {form._id ? "Update User" : "Create User"}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Username*</label>
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
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {form._id ? "New Password (leave blank to keep)" : "Password*"}
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required={!form._id}
              minLength={6}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name*</label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name*</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              name="phoneNumber"
              type="tel"
              value={form.phoneNumber}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              pattern="[0-9]*"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role*</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            >
              <option value="assistant">Assistant</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading.form}
            className={`w-full p-3 rounded-md mt-4 ${
              loading.form 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading.form ? "Processing..." : form._id ? "Update User" : "Create User"}
          </button>
        </div>
      </form>

      {/* Users Table Section */}
      <div className="p-6 border rounded-2xl shadow-xl bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Users List</h2>
          <button 
            onClick={fetchUsers}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            disabled={loading.table}
          >
            <FaSync className={loading.table ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
        
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search users..."
            className="border p-2 w-full rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {error ? (
          <div className="text-center text-red-500 p-4">
            {error}
            <button 
              onClick={fetchUsers}
              className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Retry
            </button>
          </div>
        ) : loading.table ? (
          <div className="text-center py-4">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            {searchTerm ? "No matching users found" : "No users available"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Role</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-t hover:bg-gray-50">
                    <td className="p-2">{user.firstName} {user.lastName}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2 capitalize">{user.role}</td>
                    <td className="p-2 flex space-x-2">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="text-blue-500 hover:text-blue-700 p-1"
                        title="View"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-yellow-500 hover:text-yellow-700 p-1"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">User Details</h3>
            <div className="space-y-2">
              <p><strong>Name:</strong> {viewedUser.firstName} {viewedUser.lastName}</p>
              <p><strong>Username:</strong> {viewedUser.username}</p>
              <p><strong>Email:</strong> {viewedUser.email}</p>
              <p><strong>Phone:</strong> {viewedUser.phoneNumber}</p>
              <p><strong>Role:</strong> {viewedUser.role}</p>
              {viewedUser.createdAt && (
                <p><strong>Created:</strong> {new Date(viewedUser.createdAt).toLocaleString()}</p>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewedUser(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}