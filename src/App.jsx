import React, { useState, useEffect, useMemo } from 'react';
import {
DollarSign,
Calendar,
Plus,
ChevronLeft,
LayoutDashboard,
ShoppingBag,
Package,
TrendingUp,
Image as ImageIcon,
Trash2,
X,
Layers,
Search,
Filter,
BarChart3,
CheckCircle2,
AlertCircle
} from 'lucide-react';

const SALES_STORAGE_KEY = 'roms_crayfish_sales_v3';
const INVENTORY_STORAGE_KEY = 'roms_crayfish_inventory_v3';

// Sample initial data if local storage is empty
const INITIAL_SALES = [
{ id: '1', buyerName: 'Juan Dela Cruz', date: new Date().toISOString().split('T')[0], totalPrice: '1200.00' },
{ id: '2', buyerName: 'Maria Santos', date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], totalPrice: '2500.00' },
{ id: '3', buyerName: 'Alex Rivera', date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0], totalPrice: '1800.00' },
{ id: '4', buyerName: 'Elena Torralba', date: new Date(Date.now() - 86400000 * 12).toISOString().split('T')[0], totalPrice: '3200.00' },
{ id: '5', buyerName: 'Roberto Gomez', date: new Date(Date.now() - 86400000 * 25).toISOString().split('T')[0], totalPrice: '4500.00' },
{ id: '6', buyerName: 'Clara Benson', date: new Date(Date.now() - 86400000 * 38).toISOString().split('T')[0], totalPrice: '2100.00' },
];

const INITIAL_INVENTORY = [
{
id: '101',
name: 'Electric Blue Crayfish',
species: 'Procambarus alleni',
definition: 'Vibrant sky-blue freshwater crayfish. Reaches 4-5 inches. Prefers hidden rock crevices, moderate water flow, and clean water.',
imageUri: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=600&q=80',
stockCount: 15,
},
{
id: '102',
name: 'Red Claw Crayfish',
species: 'Cherax quadricarinatus',
definition: 'Tropical Australian species known for blue-green body and distinctive red patch on male claws. Grows rapidly up to 8-10 inches.',
imageUri: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
stockCount: 8,
},
];

export default function App() {
// Navigation Screens: 'navHub', 'salesForm', 'salesRecords', 'salesDashboard', 'crayfishList', 'addCrayfishForm'
const [currentScreen, setCurrentScreen] = useState('navHub');

// Sales State
const [sales, setSales] = useState([]);
const [buyerName, setBuyerName] = useState('');
const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
const [totalPrice, setTotalPrice] = useState('');

// Dashboard Analytics Filter State: 'daily' | 'weekly' | 'monthly' | 'all'
const [analyticsTimeframe, setAnalyticsTimeframe] = useState('monthly');

// Crayfish Inventory State
const [inventory, setInventory] = useState([]);
const [crayfishName, setCrayfishName] = useState('');
const [crayfishSpecies, setCrayfishSpecies] = useState('');
const [crayfishDefinition, setCrayfishDefinition] = useState('');
const [crayfishStock, setCrayfishStock] = useState('10');
const [crayfishImage, setCrayfishImage] = useState('');

// UI Toast Notice
const [toastMessage, setToastMessage] = useState(null);

useEffect(() => {
try {
const savedSales = localStorage.getItem(SALES_STORAGE_KEY);
if (savedSales) {
setSales(JSON.parse(savedSales));
} else {
setSales(INITIAL_SALES);
localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify(INITIAL_SALES));
}

  const savedInventory = localStorage.getItem(INVENTORY_STORAGE_KEY);
  if (savedInventory) {
    setInventory(JSON.parse(savedInventory));
  } else {
    setInventory(INITIAL_INVENTORY);
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(INITIAL_INVENTORY));
  }
} catch (e) {
  console.error('Error reading localStorage:', e);
}


}, []);

const saveSales = (newSales) => {
setSales(newSales);
try {
localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify(newSales));
} catch (e) {
console.error('Error saving sales:', e);
}
};

const saveInventory = (newInventory) => {
setInventory(newInventory);
try {
localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(newInventory));
} catch (e) {
console.error('Error saving inventory:', e);
}
};

const showToast = (msg) => {
setToastMessage(msg);
setTimeout(() => setToastMessage(null), 3000);
};

const handleSaveSale = (e) => {
if (e) e.preventDefault();
if (!buyerName.trim() || !totalPrice || !saleDate) {
showToast('❌ Please fill in Buyer Name, Date, and Total Price');
return;
}

const priceNum = parseFloat(totalPrice);
if (isNaN(priceNum) || priceNum <= 0) {
  showToast('❌ Please enter a valid positive sale amount');
  return;
}

const newSale = {
  id: Date.now().toString(),
  buyerName: buyerName.trim(),
  date: saleDate,
  totalPrice: priceNum.toFixed(2),
};

const updated = [newSale, ...sales];
saveSales(updated);

// Reset Form
setBuyerName('');
setSaleDate(new Date().toISOString().split('T')[0]);
setTotalPrice('');
showToast('✅ Sale record saved successfully!');
setCurrentScreen('salesRecords');


};

const handleDeleteSale = (id) => {
if (window.confirm('Are you sure you want to delete this sales record?')) {
const updated = sales.filter((item) => item.id !== id);
saveSales(updated);
showToast('🗑️ Sales record removed');
}
};

const handleImageChange = (e) => {
const file = e.target.files[0];
if (file) {
const reader = new FileReader();
reader.onloadend = () => {
setCrayfishImage(reader.result);
};
reader.readAsDataURL(file);
}
};

const handleSaveCrayfish = (e) => {
if (e) e.preventDefault();
if (!crayfishName.trim() || !crayfishDefinition.trim()) {
showToast('❌ Please provide a Crayfish Name and Description');
return;
}

const newCrayfish = {
  id: Date.now().toString(),
  name: crayfishName.trim(),
  species: crayfishSpecies.trim() || 'Freshwater Species',
  definition: crayfishDefinition.trim(),
  stockCount: parseInt(crayfishStock) || 0,
  imageUri: crayfishImage || 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=600&q=80',
};

const updated = [newCrayfish, ...inventory];
saveInventory(updated);

// Reset Form
setCrayfishName('');
setCrayfishSpecies('');
setCrayfishDefinition('');
setCrayfishStock('10');
setCrayfishImage('');
showToast('✅ Crayfish entry added to catalog!');
setCurrentScreen('crayfishList');


};

const handleDeleteCrayfish = (id) => {
if (window.confirm('Are you sure you want to delete this crayfish variety?')) {
const updated = inventory.filter((item) => item.id !== id);
saveInventory(updated);
showToast('🗑️ Crayfish variety removed');
}
};

const analytics = useMemo(() => {
const now = new Date();
const todayStr = now.toISOString().split('T')[0];

const filtered = sales.filter((item) => {
  if (!item.date) return false;
  const itemDate = new Date(item.date);
  if (isNaN(itemDate.getTime())) return false;

  if (analyticsTimeframe === 'daily') {
    return item.date === todayStr;
  } else if (analyticsTimeframe === 'weekly') {
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return itemDate >= sevenDaysAgo && itemDate <= now;
  } else if (analyticsTimeframe === 'monthly') {
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return itemDate >= thirtyDaysAgo && itemDate <= now;
  }
  return true; // 'all'
});

const totalRevenue = filtered.reduce((sum, item) => sum + (parseFloat(item.totalPrice) || 0), 0);
const totalTransactions = filtered.length;
const avgTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
const maxSale = filtered.reduce((max, item) => Math.max(max, parseFloat(item.totalPrice) || 0), 0);

return {
  filteredSales: filtered,
  totalRevenue,
  totalTransactions,
  avgTransaction,
  maxSale,
};


}, [sales, analyticsTimeframe]);

const allTimeRevenue = useMemo(() => {
return sales.reduce((sum, item) => sum + (parseFloat(item.totalPrice) || 0), 0);
}, [sales]);

return (

{/* Toast Notification */}
{toastMessage && (

{toastMessage}

)}

  {/* Main Top Bar Header */}
  <header className="bg-slate-800/90 backdrop-blur-md border-b border-slate-700/80 sticky top-0 z-40 px-4 py-3 sm:px-8">
    <div className="max-w-6xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-xl shadow-lg shadow-emerald-500/20">
          🦐
        </div>
        <div>
          <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase block">
            Crayfish Farm Management
          </span>
          <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
            Rom's Crayfish Hub
          </h1>
        </div>
      </div>

      <button
        onClick={() => setCurrentScreen('navHub')}
        className="flex items-center gap-2 bg-slate-700/80 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 px-3.5 py-2 rounded-lg border border-slate-600 transition text-xs font-bold"
      >
        <Layers className="w-4 h-4" />
        <span className="hidden sm:inline">Nav Menu</span>
      </button>
    </div>
  </header>

  {/* Main Body Layout */}
  <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
    {/* 1. NAVIGATION HUB SCREEN */}
    {currentScreen === 'navHub' && (
      <div className="space-y-6 animate-fadeIn">
        {/* Hero Welcome Card */}
        <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-800/80 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Farm Portal
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
              Welcome Back, Rom! 👋
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              Manage customer purchases, monitor monthly revenue trends with dynamic analytics, and maintain your crayfish inventory catalog all in one place.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setCurrentScreen('salesForm')}
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition shadow-lg shadow-emerald-500/25 text-sm"
              >
                <Plus className="w-4 h-4 stroke-[3]" /> Record New Sale
              </button>
              <button
                onClick={() => setCurrentScreen('salesDashboard')}
                className="inline-flex items-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold px-5 py-2.5 rounded-xl transition text-sm"
              >
                <BarChart3 className="w-4 h-4" /> Sales Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stat Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Sales Records</p>
              <p className="text-2xl font-black text-white mt-1">{sales.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center border border-blue-500/20">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">All-Time Revenue</p>
              <p className="text-2xl font-black text-emerald-400 mt-1">
                ₱{allTimeRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-500/20">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Catalog Varieties</p>
              <p className="text-2xl font-black text-white mt-1">{inventory.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center border border-purple-500/20">
              <Package className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Main Navigation Modules */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Farm Management Modules
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              onClick={() => setCurrentScreen('salesForm')}
              className="group bg-slate-800 hover:bg-slate-750 border border-slate-700/80 hover:border-emerald-500/50 p-6 rounded-2xl transition cursor-pointer flex items-start gap-4 shadow-lg hover:shadow-emerald-500/5"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition shrink-0">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white group-hover:text-emerald-400 transition">
                  Enter New Sale
                </h4>
                <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                  Log customer buyer names, sale dates, and total transaction prices directly.
                </p>
              </div>
            </div>

            <div 
              onClick={() => setCurrentScreen('salesRecords')}
              className="group bg-slate-800 hover:bg-slate-750 border border-slate-700/80 hover:border-blue-500/50 p-6 rounded-2xl transition cursor-pointer flex items-start gap-4 shadow-lg hover:shadow-blue-500/5"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition shrink-0">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition">
                  Sales Records
                </h4>
                <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                  View full ledger history of all sold crayfish orders with quick access to analytics.
                </p>
              </div>
            </div>

            <div 
              onClick={() => setCurrentScreen('salesDashboard')}
              className="group bg-slate-800 hover:bg-slate-750 border border-slate-700/80 hover:border-amber-500/50 p-6 rounded-2xl transition cursor-pointer flex items-start gap-4 shadow-lg hover:shadow-amber-500/5"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition shrink-0">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-bold text-white group-hover:text-amber-400 transition">
                    Sales Dashboard
                  </h4>
                  <span className="bg-amber-500/20 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Analytics
                  </span>
                </div>
                <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                  Interactive timeframe filter: Daily, Weekly (7 days), Monthly (30 days), and All-Time sales performance.
                </p>
              </div>
            </div>

            <div 
              onClick={() => setCurrentScreen('crayfishList')}
              className="group bg-slate-800 hover:bg-slate-750 border border-slate-700/80 hover:border-purple-500/50 p-6 rounded-2xl transition cursor-pointer flex items-start gap-4 shadow-lg hover:shadow-purple-500/5"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition shrink-0">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white group-hover:text-purple-400 transition">
                  Available Crayfish Catalog
                </h4>
                <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                  Manage stock varieties, view full species info, upload custom images, and update inventory.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* 2. ENTER SALE FORM SCREEN */}
    {currentScreen === 'salesForm' && (
      <div className="max-w-xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentScreen('navHub')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-semibold"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Nav Hub
          </button>
          <button
            onClick={() => setCurrentScreen('salesRecords')}
            className="text-xs text-blue-400 hover:underline font-semibold"
          >
            View Existing Records ({sales.length})
          </button>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Record New Crayfish Sale</h2>
              <p className="text-xs text-slate-400">Fill out buyer info and price details</p>
            </div>
          </div>

          <form onSubmit={handleSaveSale} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Buyer Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Juan Dela Cruz"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none transition text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Sale Date
              </label>
              <input
                type="date"
                required
                value={saleDate}
                onChange={(e) => setSaleDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-3 text-white focus:outline-none transition text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Total Price (₱ PHP)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                  ₱
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  placeholder="0.00"
                  value={totalPrice}
                  onChange={(e) => setTotalPrice(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl pl-9 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none transition text-sm font-semibold"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <button
                type="submit"
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3.5 rounded-xl transition shadow-lg shadow-emerald-500/20 text-sm flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Save Sale Record
              </button>
              <button
                type="button"
                onClick={() => setCurrentScreen('navHub')}
                className="bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold px-5 py-3.5 rounded-xl transition text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* 3. SALES RECORDS LIST SCREEN */}
    {currentScreen === 'salesRecords' && (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button
              onClick={() => setCurrentScreen('navHub')}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition text-xs font-semibold mb-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Navigation Hub
            </button>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-blue-400" /> Sales Ledger
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Total Recorded Transactions: <span className="text-white font-bold">{sales.length}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentScreen('salesForm')}
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition text-xs shadow-md shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> Add New Sale
            </button>

            <button
              onClick={() => setCurrentScreen('salesDashboard')}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black px-4 py-2.5 rounded-xl transition text-xs shadow-lg shadow-amber-500/20"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Sales Dashboard Analytics</span>
            </button>
          </div>
        </div>

        {/* Quick Banner Linking To Dashboard */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-300">Looking for Sales Breakdown?</h4>
              <p className="text-xs text-slate-300">
                Filter income by Daily, Weekly (7 Days), Monthly (30 Days), or All-Time.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentScreen('salesDashboard')}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-lg transition whitespace-nowrap self-end sm:self-auto"
          >
            Open Analytics →
          </button>
        </div>

        {/* Sales Table / List */}
        {sales.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-12 text-center">
            <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-300">No Sales Recorded Yet</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Start logging sales transactions to build your ledger.</p>
            <button
              onClick={() => setCurrentScreen('salesForm')}
              className="bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs"
            >
              Create First Sale Entry
            </button>
          </div>
        ) : (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900/80 text-xs font-bold uppercase text-slate-400 tracking-wider border-b border-slate-700">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Buyer Name</th>
                    <th className="py-3.5 px-4 sm:px-6">Date</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Total Price</th>
                    <th className="py-3.5 px-4 sm:px-6 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {sales.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-750/50 transition">
                      <td className="py-4 px-4 sm:px-6 font-bold text-white">
                        {item.buyerName}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-slate-400 text-xs font-mono">
                        📅 {item.date}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-right font-black text-emerald-400 text-base">
                        ₱{parseFloat(item.totalPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-center">
                        <button
                          onClick={() => handleDeleteSale(item.id)}
                          className="text-slate-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition"
                          title="Delete sale"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    )}

    {/* 4. SALES ANALYTICS DASHBOARD */}
    {currentScreen === 'salesDashboard' && (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button
              onClick={() => setCurrentScreen('navHub')}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition text-xs font-semibold mb-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Navigation Hub
            </button>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-amber-400" /> Sales Analytics Dashboard
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Analyze crayfish farm revenue performance over key periods
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentScreen('salesRecords')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2.5 rounded-xl border border-slate-700 text-xs"
            >
              📋 View Full Sales Log
            </button>
          </div>
        </div>

        {/* Timeframe Selector Filter Tabs */}
        <div className="bg-slate-800/90 border border-slate-700 p-1.5 rounded-2xl flex items-center gap-1">
          {[
            { id: 'daily', label: 'Daily (Today)' },
            { id: 'weekly', label: '7 Days' },
            { id: 'monthly', label: '30 Days' },
            { id: 'all', label: 'All Time' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setAnalyticsTimeframe(tab.id)}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold transition text-center ${
                analyticsTimeframe === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Analytics Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-800/90 border border-emerald-500/30 p-5 rounded-2xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {analyticsTimeframe === 'daily' && 'Today Sales'}
                {analyticsTimeframe === 'weekly' && 'Last 7 Days Revenue'}
                {analyticsTimeframe === 'monthly' && 'Last 30 Days Revenue'}
                {analyticsTimeframe === 'all' && 'All-Time Total Revenue'}
              </span>
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2">
              ₱{analytics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Total revenue generated in this timeframe
            </span>
          </div>

          <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Transactions
              </span>
              <ShoppingBag className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white mt-2">
              {analytics.totalTransactions}
            </p>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Completed orders recorded
            </span>
          </div>

          <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Average Sale
              </span>
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-purple-300 mt-2">
              ₱{analytics.avgTransaction.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Revenue per transaction
            </span>
          </div>

          <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Highest Sale
              </span>
              <BarChart3 className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-amber-300 mt-2">
              ₱{analytics.maxSale.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Peak transaction value
            </span>
          </div>
        </div>

        {/* Filtered Transactions List */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-amber-400" />
              Sales in Selected Period ({analytics.filteredSales.length})
            </h3>
            <span className="text-xs text-slate-400">
              Filter: <strong className="text-amber-400 capitalize">{analyticsTimeframe}</strong>
            </span>
          </div>

          {analytics.filteredSales.length === 0 ? (
            <div className="py-10 text-center">
              <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-slate-400 text-sm font-medium">No sales recorded for this specific time filter.</p>
              <p className="text-slate-500 text-xs mt-1">Try switching to 30 Days or All Time tab.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {analytics.filteredSales.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900/70 border border-slate-700/60 p-3.5 rounded-xl flex items-center justify-between hover:border-slate-600 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
                      ₱
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{item.buyerName}</p>
                      <p className="text-xs text-slate-400 font-mono">📅 {item.date}</p>
                    </div>
                  </div>

                  <span className="text-base font-black text-emerald-400">
                    ₱{parseFloat(item.totalPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )}

    {/* 5. CRAYFISH CATALOG INVENTORY LIST SCREEN */}
    {currentScreen === 'crayfishList' && (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button
              onClick={() => setCurrentScreen('navHub')}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition text-xs font-semibold mb-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Navigation Hub
            </button>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Package className="w-6 h-6 text-purple-400" /> Available Crayfish Catalog
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Current farm stock and species definitions
            </p>
          </div>

          <button
            onClick={() => setCurrentScreen('addCrayfishForm')}
            className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-bold px-4 py-2.5 rounded-xl transition text-xs shadow-md shadow-purple-500/20"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Add New Crayfish Variety
          </button>
        </div>

        {/* Catalog Grid */}
        {inventory.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-12 text-center">
            <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-300">Catalog is Currently Empty</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Add your available crayfish species to display them here.</p>
            <button
              onClick={() => setCurrentScreen('addCrayfishForm')}
              className="bg-purple-500 text-white font-bold px-4 py-2 rounded-xl text-xs"
            >
              Add Crayfish Entry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inventory.map((item) => (
              <div
                key={item.id}
                className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="h-48 w-full bg-slate-900 relative overflow-hidden group">
                    <img
                      src={item.imageUri}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <button
                      onClick={() => handleDeleteCrayfish(item.id)}
                      className="absolute top-3 right-3 bg-slate-900/80 hover:bg-red-500 text-slate-300 hover:text-white p-2 rounded-lg transition"
                      title="Remove from catalog"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <span className="absolute bottom-3 left-3 bg-slate-950/80 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-md border border-slate-700">
                      Stock: {item.stockCount} units
                    </span>
                  </div>

                  <div className="p-5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 italic">
                      {item.species || 'Freshwater Species'}
                    </span>
                    <h3 className="text-lg font-extrabold text-white mt-0.5 mb-2">
                      {item.name}
                    </h3>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {item.definition}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )}

    {/* 6. ADD CRAYFISH ITEM FORM SCREEN */}
    {currentScreen === 'addCrayfishForm' && (
      <div className="max-w-xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentScreen('crayfishList')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-semibold"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Catalog
          </button>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Add Crayfish to Catalog</h2>
              <p className="text-xs text-slate-400">Describe species parameters and upload a picture</p>
            </div>
          </div>

          <form onSubmit={handleSaveCrayfish} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Crayfish Name / Variety Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Electric Blue Crayfish"
                value={crayfishName}
                onChange={(e) => setCrayfishName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-purple-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none transition text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Scientific / Species Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Procambarus alleni"
                  value={crayfishSpecies}
                  onChange={(e) => setCrayfishSpecies(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-purple-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none transition text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  In-Stock Count
                </label>
                <input
                  type="number"
                  min="0"
                  value={crayfishStock}
                  onChange={(e) => setCrayfishStock(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-purple-500 rounded-xl px-4 py-3 text-white focus:outline-none transition text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Definition & Traits Description
              </label>
              <textarea
                rows={4}
                required
                placeholder="Describe size, color, care requirements, ideal water temperature..."
                value={crayfishDefinition}
                onChange={(e) => setCrayfishDefinition(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-purple-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none transition text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Photo Upload
              </label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-500/10 file:text-purple-400 hover:file:bg-purple-500/20 cursor-pointer"
                />

                {crayfishImage && (
                  <div className="relative rounded-xl overflow-hidden h-40 border border-slate-700">
                    <img src={crayfishImage} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setCrayfishImage('')}
                      className="absolute top-2 right-2 bg-slate-900/80 text-white p-1.5 rounded-lg text-xs"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <button
                type="submit"
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-purple-500/20 text-sm flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Save Crayfish Entry
              </button>
              <button
                type="button"
                onClick={() => setCurrentScreen('crayfishList')}
                className="bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold px-5 py-3.5 rounded-xl transition text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </main>

  <footer className="border-t border-slate-800 bg-slate-900 py-6 text-center text-xs text-slate-500">
    <p>© Rom's Crayfish Hub Management System • All sales data persisted locally</p>
  </footer>
</div>


);
}