import { PackageIcon, AlertTriangleIcon, DollarSignIcon } from 'lucide-react';
import { Item } from '../App';
interface DashboardProps {
  items: Item[];
}
export default function Dashboard({
  items
}: DashboardProps) {
  const totalItems = items.reduce((sum, item) => sum + item.stock, 0);
  const lowStockItems = items.filter(item => item.stock < 50);
  const totalValue = items.reduce((sum, item) => sum + item.price * item.stock, 0);
  const metrics = [{
    label: 'Total Items',
    value: totalItems,
    icon: PackageIcon,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600'
  }, {
    label: 'Low Stock Alerts',
    value: lowStockItems.length,
    icon: AlertTriangleIcon,
    color: 'from-orange-500 to-red-600',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600'
  }, {
    label: 'Total Inventory Value',
    value: `$${totalValue.toFixed(2)}`,
    icon: DollarSignIcon,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600'
  }];
  return <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">
                    {metric.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-800">
                    {metric.value}
                  </p>
                </div>
                <div className={`${metric.bgColor} p-4 rounded-full`}>
                  <Icon className={`w-8 h-8 ${metric.textColor}`} />
                </div>
              </div>
            </div>;
      })}
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <AlertTriangleIcon className="w-6 h-6 text-orange-600" />
          <h2 className="text-xl font-bold text-gray-800">Low Stock Items</h2>
        </div>
        {lowStockItems.length === 0 ? <p className="text-gray-600">
            No low stock items. All inventory levels are adequate.
          </p> : <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold text-sm">
                    Item ID
                  </th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold text-sm">
                    Item Name
                  </th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold text-sm">
                    Stock
                  </th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map(item => <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800 text-sm">
                      {item.id}
                    </td>
                    <td className="py-3 px-4 text-gray-800 text-sm">
                      {item.name}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.stock < 30 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                        {item.stock}
                      </span>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>}
      </div>
    </div>;
}