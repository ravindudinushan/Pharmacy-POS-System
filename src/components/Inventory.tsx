import { useState } from 'react';
import { SearchIcon, PlusIcon, EditIcon, TrashIcon, XIcon, CheckIcon } from 'lucide-react';
import { Item } from '../App';
interface InventoryProps {
  items: Item[];
  setItems: (items: Item[]) => void;
}
export default function Inventory({
  items,
  setItems
}: InventoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: '',
    purchasePrice: '',
    price: '',
    stock: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const filteredItems = items.filter(item => item.id.toLowerCase().includes(searchTerm.toLowerCase()) || item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.category.toLowerCase().includes(searchTerm.toLowerCase()));
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.id) newErrors.id = 'Item ID is required';
    if (!formData.name) newErrors.name = 'Item name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.purchasePrice || parseFloat(formData.purchasePrice) <= 0) newErrors.purchasePrice = 'Valid purchase price is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid sale price is required';
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Valid stock quantity is required';
    if (!editingItem && items.some(item => item.id === formData.id)) {
      newErrors.id = 'Item ID already exists';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleAdd = () => {
    if (!validateForm()) return;
    const newItem: Item = {
      id: formData.id,
      name: formData.name,
      category: formData.category,
      purchasePrice: parseFloat(formData.purchasePrice),
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock)
    };
    setItems([...items, newItem]);
    resetForm();
  };
  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setFormData({
      id: item.id,
      name: item.name,
      category: item.category,
      purchasePrice: item.purchasePrice.toString(),
      price: item.price.toString(),
      stock: item.stock.toString()
    });
    setShowAddForm(true);
  };
  const handleUpdate = () => {
    if (!validateForm()) return;
    setItems(items.map(item => item.id === editingItem?.id ? {
      ...item,
      name: formData.name,
      category: formData.category,
      purchasePrice: parseFloat(formData.purchasePrice),
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock)
    } : item));
    resetForm();
  };
  const handleDelete = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    setDeleteConfirm(null);
  };
  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      category: '',
      purchasePrice: '',
      price: '',
      stock: ''
    });
    setErrors({});
    setShowAddForm(false);
    setEditingItem(null);
  };
  const getStockColor = (stock: number) => {
    if (stock < 30) return 'text-red-600 bg-red-50';
    if (stock < 50) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };
  return <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Inventory Management
        </h1>
        <button onClick={() => setShowAddForm(true)} className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition shadow-lg">
          <PlusIcon className="w-5 h-5" />
          <span>Add New Item</span>
        </button>
      </div>
      {showAddForm && <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </h2>
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item ID
              </label>
              <input type="text" value={formData.id} onChange={e => setFormData({
            ...formData,
            id: e.target.value
          })} disabled={!!editingItem} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" placeholder="MED001" />
              {errors.id && <p className="text-red-600 text-sm mt-1">{errors.id}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Name
              </label>
              <input type="text" value={formData.name} onChange={e => setFormData({
            ...formData,
            name: e.target.value
          })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Paracetamol 500mg" />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input type="text" value={formData.category} onChange={e => setFormData({
            ...formData,
            category: e.target.value
          })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Pain Relief" />
              {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purchase Price ($)
              </label>
              <input type="number" step="0.01" value={formData.purchasePrice} onChange={e => setFormData({
            ...formData,
            purchasePrice: e.target.value
          })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="3.50" />
              {errors.purchasePrice && <p className="text-red-600 text-sm mt-1">
                  {errors.purchasePrice}
                </p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sale Price ($)
              </label>
              <input type="number" step="0.01" value={formData.price} onChange={e => setFormData({
            ...formData,
            price: e.target.value
          })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="5.99" />
              {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity
              </label>
              <input type="number" value={formData.stock} onChange={e => setFormData({
            ...formData,
            stock: e.target.value
          })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="100" />
              {errors.stock && <p className="text-red-600 text-sm mt-1">{errors.stock}</p>}
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button onClick={resetForm} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              Cancel
            </button>
            <button onClick={editingItem ? handleUpdate : handleAdd} className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition">
              {editingItem ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </div>}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Search by Item ID, name, or category..." />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                  Item ID
                </th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                  Item Name
                </th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                  Category
                </th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                  Purchase Price
                </th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                  Sale Price
                </th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                  Stock
                </th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-800 font-medium">
                    {item.id}
                  </td>
                  <td className="py-3 px-4 text-gray-800">{item.name}</td>
                  <td className="py-3 px-4 text-gray-600">{item.category}</td>
                  <td className="py-3 px-4 text-gray-800">
                    ${item.purchasePrice.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-gray-800">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStockColor(item.stock)}`}>
                      {item.stock}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                        <EditIcon className="w-5 h-5" />
                      </button>
                      {deleteConfirm === item.id ? <div className="flex space-x-1">
                          <button onClick={() => handleDelete(item.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition">
                            <CheckIcon className="w-5 h-5" />
                          </button>
                          <button onClick={() => setDeleteConfirm(null)} className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition">
                            <XIcon className="w-5 h-5" />
                          </button>
                        </div> : <button onClick={() => setDeleteConfirm(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
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