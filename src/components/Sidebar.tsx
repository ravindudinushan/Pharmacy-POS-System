import { LayoutDashboardIcon, PackageIcon, ShoppingCartIcon, UsersIcon, LogOutIcon, ReceiptIcon } from 'lucide-react';
import { User } from '../App';
interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  currentUser: User;
  onLogout: () => void;
}
export default function Sidebar({
  currentPage,
  setCurrentPage,
  currentUser,
  onLogout
}: SidebarProps) {
  const menuItems = [{
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboardIcon
  }, {
    id: 'inventory',
    label: 'Inventory',
    icon: PackageIcon
  }, {
    id: 'pos',
    label: 'Point of Sale',
    icon: ShoppingCartIcon
  }, {
    id: 'sales',
    label: 'Sales History',
    icon: ReceiptIcon
  }, ...(currentUser.role === 'Admin' ? [{
    id: 'users',
    label: 'User Management',
    icon: UsersIcon
  }] : [])];
  return <div className="w-64 bg-gradient-to-b from-blue-900 to-purple-900 text-white flex flex-col">
      <div className="p-6 border-b border-blue-800">
        <h1 className="text-2xl font-bold">Pharmacy POS</h1>
        <div className="mt-4 bg-blue-800 bg-opacity-50 rounded-lg p-3">
          <p className="text-sm text-blue-200">Logged in as</p>
          <p className="font-semibold">{currentUser.fullName}</p>
          <p className="text-xs text-blue-300 mt-1">{currentUser.role}</p>
        </div>
      </div>
      <nav className="flex-1 p-4">
        {menuItems.map(item => {
        const Icon = item.icon;
        return <button key={item.id} onClick={() => setCurrentPage(item.id)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition ${currentPage === item.id ? 'bg-white text-blue-900 font-semibold' : 'hover:bg-blue-800 text-blue-100'}`}>
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>;
      })}
      </nav>
      <div className="p-4 border-t border-blue-800">
        <button onClick={onLogout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-600 transition text-blue-100">
          <LogOutIcon className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>;
}