import { useState } from 'react';
import { SearchIcon, PlusIcon, MinusIcon, TrashIcon, ShoppingCartIcon } from 'lucide-react';
import { Item, CartItem, User } from '../App';
import Receipt from './Receipt';
interface POSProps {
  items: Item[];
  setItems: (items: Item[]) => void;
  currentUser: User;
  addSale: (sale: any) => void;
}
export default function POS({
  items,
  setItems,
  currentUser,
  addSale
}: POSProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card'>('Cash');
  const [amountPaid, setAmountPaid] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [error, setError] = useState('');
  const filteredItems = items.filter(item => item.id.toLowerCase().includes(searchTerm.toLowerCase()) || item.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const addToCart = (item: Item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      if (existingItem.quantity >= item.stock) {
        setError(`Cannot add more. Only ${item.stock} in stock.`);
        setTimeout(() => setError(''), 3000);
        return;
      }
      setCart(cart.map(cartItem => cartItem.id === item.id ? {
        ...cartItem,
        quantity: cartItem.quantity + 1
      } : cartItem));
    } else {
      if (item.stock === 0) {
        setError('Item out of stock.');
        setTimeout(() => setError(''), 3000);
        return;
      }
      setCart([...cart, {
        ...item,
        quantity: 1
      }]);
    }
  };
  const updateQuantity = (id: string, change: number) => {
    const item = items.find(i => i.id === id);
    const cartItem = cart.find(c => c.id === id);
    if (!item || !cartItem) return;
    const newQuantity = cartItem.quantity + change;
    if (newQuantity > item.stock) {
      setError(`Only ${item.stock} in stock.`);
      setTimeout(() => setError(''), 3000);
      return;
    }
    if (newQuantity <= 0) {
      setCart(cart.filter(c => c.id !== id));
    } else {
      setCart(cart.map(c => c.id === id ? {
        ...c,
        quantity: newQuantity
      } : c));
    }
  };
  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;
  // Calculate profit
  const profit = cart.reduce((sum, item) => sum + (item.price - item.purchasePrice) * item.quantity, 0);
  const handleCheckout = () => {
    if (cart.length === 0) {
      setError('Cart is empty.');
      setTimeout(() => setError(''), 3000);
      return;
    }
    if (paymentMethod === 'Cash') {
      const paid = parseFloat(amountPaid);
      if (!paid || paid < total) {
        setError('Insufficient payment amount.');
        setTimeout(() => setError(''), 3000);
        return;
      }
    }
    // Deduct stock
    const updatedItems = items.map(item => {
      const cartItem = cart.find(c => c.id === item.id);
      if (cartItem) {
        return {
          ...item,
          stock: item.stock - cartItem.quantity
        };
      }
      return item;
    });
    setItems(updatedItems);
    // Generate receipt
    const receipt = {
      billId: `BILL${Date.now()}`,
      date: new Date().toLocaleString(),
      cashier: currentUser.fullName,
      items: cart,
      subtotal,
      total,
      profit,
      paymentMethod,
      amountPaid: paymentMethod === 'Cash' ? parseFloat(amountPaid) : total,
      balance: paymentMethod === 'Cash' ? parseFloat(amountPaid) - total : 0
    };
    // Add sale to history
    addSale({
      id: Date.now().toString(),
      ...receipt
    });
    setReceiptData(receipt);
    setShowReceipt(true);
    setCart([]);
    setAmountPaid('');
  };
  return <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Point of Sale</h1>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>}
      <div className="grid grid-cols-2 gap-6">
        {/* Items List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Available Items
          </h2>
          <div className="mb-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Search by Item ID or name..." />
            </div>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredItems.map(item => <div key={item.id} onClick={() => addToCart(item)} className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.id} • {item.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">
                      ${item.price.toFixed(2)}
                    </p>
                    <p className={`text-sm ${item.stock < 30 ? 'text-red-600' : 'text-gray-600'}`}>
                      Stock: {item.stock}
                    </p>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
        {/* Cart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <ShoppingCartIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">
              Cart ({cart.length})
            </h2>
          </div>
          <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
            {cart.length === 0 ? <p className="text-gray-600 text-center py-8">Cart is empty</p> : cart.map(item => <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.id}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-600 hover:bg-red-50 p-1 rounded">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 bg-gray-100 hover:bg-gray-200 rounded">
                        <MinusIcon className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 bg-gray-100 hover:bg-gray-200 rounded">
                        <PlusIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        ${item.price.toFixed(2)} each
                      </p>
                      <p className="font-bold text-blue-600">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>)}
          </div>
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between text-xl font-bold text-gray-800">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <div className="flex space-x-4">
                <button onClick={() => setPaymentMethod('Cash')} className={`flex-1 py-2 rounded-lg font-semibold transition ${paymentMethod === 'Cash' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  Cash
                </button>
                <button onClick={() => setPaymentMethod('Card')} className={`flex-1 py-2 rounded-lg font-semibold transition ${paymentMethod === 'Card' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  Card
                </button>
              </div>
            </div>
            {paymentMethod === 'Cash' && <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount Paid
                </label>
                <input type="number" step="0.01" value={amountPaid} onChange={e => setAmountPaid(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0.00" />
                {amountPaid && parseFloat(amountPaid) >= total && <p className="text-green-600 text-sm mt-2">
                    Balance: ${(parseFloat(amountPaid) - total).toFixed(2)}
                  </p>}
              </div>}
            <button onClick={handleCheckout} disabled={cart.length === 0} className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
              Complete Sale
            </button>
          </div>
        </div>
      </div>
      {showReceipt && receiptData && <Receipt data={receiptData} onClose={() => setShowReceipt(false)} />}
    </div>;
}