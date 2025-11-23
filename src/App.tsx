import { useState } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import POS from './components/POS';
import UserManagement from './components/UserManagement';
import SalesHistory from './components/SalesHistory';
export interface User {
  id: string;
  username: string;
  password: string;
  role: 'Admin' | 'Cashier';
  fullName: string;
}
export interface Item {
  id: string;
  name: string;
  category: string;
  purchasePrice: number;
  price: number;
  stock: number;
}
export interface CartItem extends Item {
  quantity: number;
}
export interface Sale {
  id: string;
  billId: string;
  date: string;
  cashier: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  profit: number;
  paymentMethod: 'Cash' | 'Card';
}
const initialUsers: User[] = [{
  id: '1',
  username: 'admin',
  password: 'admin123',
  role: 'Admin',
  fullName: 'Admin User'
}, {
  id: '2',
  username: 'cashier',
  password: 'cashier123',
  role: 'Cashier',
  fullName: 'Cashier User'
}];
const initialItems: Item[] = [{
  id: 'MED001',
  name: 'Paracetamol 500mg',
  category: 'Pain Relief',
  purchasePrice: 3.5,
  price: 5.99,
  stock: 150
}, {
  id: 'MED002',
  name: 'Ibuprofen 400mg',
  category: 'Pain Relief',
  purchasePrice: 4.5,
  price: 7.5,
  stock: 45
}, {
  id: 'MED003',
  name: 'Amoxicillin 250mg',
  category: 'Antibiotics',
  purchasePrice: 8.0,
  price: 12.99,
  stock: 30
}, {
  id: 'MED004',
  name: 'Vitamin C 1000mg',
  category: 'Supplements',
  purchasePrice: 5.5,
  price: 8.99,
  stock: 200
}, {
  id: 'MED005',
  name: 'Cough Syrup',
  category: 'Cold & Flu',
  purchasePrice: 4.0,
  price: 6.5,
  stock: 25
}, {
  id: 'MED006',
  name: 'Aspirin 100mg',
  category: 'Pain Relief',
  purchasePrice: 2.5,
  price: 4.99,
  stock: 180
}, {
  id: 'MED007',
  name: 'Antihistamine',
  category: 'Allergy',
  purchasePrice: 6.0,
  price: 9.99,
  stock: 40
}];
export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [items, setItems] = useState<Item[]>(initialItems);
  const [sales, setSales] = useState<Sale[]>([]);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const handleLogin = (username: string, password: string) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('dashboard');
  };
  const addSale = (sale: Sale) => {
    setSales([...sales, sale]);
  };
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }
  return <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} currentUser={currentUser} onLogout={handleLogout} />
      <div className="flex-1 overflow-auto">
        {currentPage === 'dashboard' && <Dashboard items={items} />}
        {currentPage === 'inventory' && <Inventory items={items} setItems={setItems} />}
        {currentPage === 'pos' && <POS items={items} setItems={setItems} currentUser={currentUser} addSale={addSale} />}
        {currentPage === 'sales' && <SalesHistory sales={sales} />}
        {currentPage === 'users' && currentUser.role === 'Admin' && <UserManagement users={users} setUsers={setUsers} />}
      </div>
    </div>;
}