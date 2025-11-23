import { XIcon, PrinterIcon } from 'lucide-react';
interface ReceiptProps {
  data: any;
  onClose: () => void;
}
export default function Receipt({
  data,
  onClose
}: ReceiptProps) {
  const handlePrint = () => {
    window.print();
  };
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center print:hidden">
          <h2 className="text-lg font-bold text-gray-800">Receipt</h2>
          <div className="flex space-x-2">
            <button onClick={handlePrint} className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition text-sm">
              <PrinterIcon className="w-4 h-4" />
              <span>Print</span>
            </button>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2">
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-6" id="receipt-content">
          <div className="text-center mb-4">
            <h1 className="text-xl font-bold text-gray-800">Pharmacy POS</h1>
            <p className="text-xs text-gray-600">
              123 Medical Street, Healthcare City
            </p>
            <p className="text-xs text-gray-600">Phone: (555) 123-4567</p>
          </div>
          <div className="border-t border-b border-gray-300 py-3 mb-4 text-sm">
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">Bill ID:</span>
              <span className="font-semibold text-gray-800">{data.billId}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">Date:</span>
              <span className="text-gray-800">{data.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cashier:</span>
              <span className="text-gray-800">{data.cashier}</span>
            </div>
          </div>
          <div className="mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-2 text-gray-700 text-xs">Item</th>
                  <th className="text-center py-2 text-gray-700 text-xs">
                    Qty
                  </th>
                  <th className="text-right py-2 text-gray-700 text-xs">
                    Price
                  </th>
                  <th className="text-right py-2 text-gray-700 text-xs">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item: any) => <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-2 text-gray-800">
                      <div className="text-xs font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.id}</div>
                    </td>
                    <td className="py-2 text-center text-gray-800">
                      {item.quantity}
                    </td>
                    <td className="py-2 text-right text-gray-800">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="py-2 text-right text-gray-800 font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
          <div className="space-y-1 mb-4 text-sm">
            <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t border-gray-300">
              <span>Total:</span>
              <span>${data.total.toFixed(2)}</span>
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-700">Payment:</span>
              <span className="font-semibold text-gray-800">
                {data.paymentMethod}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Amount Paid:</span>
              <span className="font-semibold text-gray-800">
                ${data.amountPaid.toFixed(2)}
              </span>
            </div>
            {data.balance > 0 && <div className="flex justify-between">
                <span className="text-gray-700">Balance:</span>
                <span className="font-semibold text-green-600">
                  ${data.balance.toFixed(2)}
                </span>
              </div>}
          </div>
          <div className="text-center mt-4 pt-4 border-t border-gray-300">
            <p className="text-xs text-gray-600">
              Thank you for your purchase!
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Please keep this receipt
            </p>
          </div>
        </div>
      </div>
    </div>;
}