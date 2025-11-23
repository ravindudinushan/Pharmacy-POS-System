import { useState } from 'react';
import { ReceiptIcon, SearchIcon } from 'lucide-react';
interface Sale {
  id: string;
  billId: string;
  date: string;
  cashier: string;
  items: any[];
  subtotal: number;
  total: number;
  profit: number;
  paymentMethod: 'Cash' | 'Card';
}
interface SalesHistoryProps {
  sales: Sale[];
}
export default function SalesHistory({
  sales
}: SalesHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredSales = sales.filter(sale => sale.billId.toLowerCase().includes(searchTerm.toLowerCase()) || sale.cashier.toLowerCase().includes(searchTerm.toLowerCase()));
  // Calculate today's profit
  const today = new Date().toDateString();
  const todaySales = sales.filter(sale => new Date(sale.date).toDateString() === today);
  const todayProfit = todaySales.reduce((sum, sale) => sum + sale.profit, 0);
  // Calculate monthly profit
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlySales = sales.filter(sale => {
    const saleDate = new Date(sale.date);
    return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
  });
  const monthlyProfit = monthlySales.reduce((sum, sale) => sum + sale.profit, 0);
  return <div className="p-8">
      <div className="flex items-center space-x-3 mb-8">
        <ReceiptIcon className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">Sales History</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">
                Today's Profit
              </p>
              <p className="text-3xl font-bold text-gray-800">
                ${todayProfit.toFixed(2)}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-full">
              <ReceiptIcon className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">
                Monthly Profit
              </p>
              <p className="text-3xl font-bold text-gray-800">
                ${monthlyProfit.toFixed(2)}
              </p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-full">
              <ReceiptIcon className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Search by Bill ID or cashier name..." />
          </div>
        </div>
        {filteredSales.length === 0 ? <p className="text-gray-600 text-center py-8">
            No sales recorded yet.
          </p> : <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold text-sm">
                    Bill ID
                  </th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold text-sm">
                    Date & Time
                  </th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold text-sm">
                    Cashier
                  </th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold text-sm">
                    Total
                  </th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold text-sm">
                    Profit
                  </th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold text-sm">
                    Payment
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.slice().reverse().map(sale => <tr key={sale.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-800 text-sm font-medium">
                        {sale.billId}
                      </td>
                      <td className="py-3 px-4 text-gray-800 text-sm">
                        {sale.date}
                      </td>
                      <td className="py-3 px-4 text-gray-800 text-sm">
                        {sale.cashier}
                      </td>
                      <td className="py-3 px-4 text-gray-800 text-sm">
                        ${sale.total.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-green-600 text-sm font-semibold">
                        ${sale.profit.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${sale.paymentMethod === 'Cash' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {sale.paymentMethod}
                        </span>
                      </td>
                    </tr>)}
              </tbody>
            </table>
          </div>}
      </div>
    </div>;
}