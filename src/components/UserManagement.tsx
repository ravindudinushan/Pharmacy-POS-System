import { useState } from 'react';
import { PlusIcon, EditIcon, TrashIcon, XIcon, CheckIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { User } from '../App';
interface UserManagementProps {
  users: User[];
  setUsers: (users: User[]) => void;
}
export default function UserManagement({
  users,
  setUsers
}: UserManagementProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    role: 'Cashier' as 'Admin' | 'Cashier'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!editingUser && users.some(user => user.username === formData.username)) {
      newErrors.username = 'Username already exists';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleAdd = () => {
    if (!validateForm()) return;
    const newUser: User = {
      id: Date.now().toString(),
      username: formData.username,
      password: formData.password,
      fullName: formData.fullName,
      role: formData.role
    };
    setUsers([...users, newUser]);
    resetForm();
  };
  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: user.password,
      fullName: user.fullName,
      role: user.role
    });
    setShowAddForm(true);
  };
  const handleUpdate = () => {
    if (!validateForm()) return;
    setUsers(users.map(user => user.id === editingUser?.id ? {
      ...user,
      username: formData.username,
      password: formData.password,
      fullName: formData.fullName,
      role: formData.role
    } : user));
    resetForm();
  };
  const handleDelete = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
    setDeleteConfirm(null);
  };
  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      fullName: '',
      role: 'Cashier'
    });
    setErrors({});
    setShowAddForm(false);
    setEditingUser(null);
    setShowPassword(false);
  };
  return <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <button onClick={() => setShowAddForm(true)} className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition shadow-lg">
          <PlusIcon className="w-5 h-5" />
          <span>Add New User</span>
        </button>
      </div>
      {showAddForm && <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h2>
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input type="text" value={formData.username} onChange={e => setFormData({
            ...formData,
            username: e.target.value
          })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="johndoe" />
              {errors.username && <p className="text-red-600 text-sm mt-1">{errors.username}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input type="text" value={formData.fullName} onChange={e => setFormData({
            ...formData,
            fullName: e.target.value
          })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="John Doe" />
              {errors.fullName && <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={e => setFormData({
              ...formData,
              password: e.target.value
            })} className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select value={formData.role} onChange={e => setFormData({
            ...formData,
            role: e.target.value as 'Admin' | 'Cashier'
          })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="Cashier">Cashier</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button onClick={resetForm} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              Cancel
            </button>
            <button onClick={editingUser ? handleUpdate : handleAdd} className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition">
              {editingUser ? 'Update User' : 'Add User'}
            </button>
          </div>
        </div>}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                  Username
                </th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                  Full Name
                </th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                  Role
                </th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-800">{user.username}</td>
                  <td className="py-3 px-4 text-gray-800">{user.fullName}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button onClick={() => handleEdit(user)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                        <EditIcon className="w-5 h-5" />
                      </button>
                      {deleteConfirm === user.id ? <div className="flex space-x-1">
                          <button onClick={() => handleDelete(user.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition">
                            <CheckIcon className="w-5 h-5" />
                          </button>
                          <button onClick={() => setDeleteConfirm(null)} className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition">
                            <XIcon className="w-5 h-5" />
                          </button>
                        </div> : <button onClick={() => setDeleteConfirm(user.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" disabled={users.length === 1}>
                          <TrashIcon className="w-5 h-5" />
                        </button>}
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
}