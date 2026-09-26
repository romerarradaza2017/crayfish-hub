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
  AlertCircle,
  HeartPulse,
  Egg,
  CheckCircle,
  XCircle,
  Clock,
  Edit3
} from 'lucide-react';

const SALES_STORAGE_KEY = 'roms_crayfish_sales_v3';
const INVENTORY_STORAGE_KEY = 'roms_crayfish_inventory_v3';
const BREEDING_STORAGE_KEY = 'roms_crayfish_breeding_v1';

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

const INITIAL_BREEDING = [
  {
    id: 'b1',
    species: 'Clarkii',
    description: 'Tank 3 breeding female, robust berry load with bright dark eggs.',
    berriedDate: new Date(Date.now() - 86400000 * 14).toISOString().split('T')[0],
    imageUri: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=600&q=80',
    status: 'active',
    failReason: '',
  },
  {
    id: 'b2',
    species: 'Australian Red Claw',
    description: 'Large broodstock female in warm filtered setup.',
    berriedDate: new Date(Date.now() - 86400000 * 45).toISOString().split('T')[0],
    imageUri: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    status: 'active',
    failReason: '',
  }
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('navHub');

  const [sales, setSales] = useState([]);
  const [buyerName, setBuyerName] = useState('');
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalPrice, setTotalPrice] = useState('');

  const [analyticsTimeframe, setAnalyticsTimeframe] = useState('monthly');

  const [inventory, setInventory] = useState([]);
  const [crayfishName, setCrayfishName] = useState('');
  const [crayfishSpecies, setCrayfishSpecies] = useState('');
  const [crayfishDefinition, setCrayfishDefinition] = useState('');
  const [crayfishStock, setCrayfishStock] = useState('10');
  const [crayfishImage, setCrayfishImage] = useState('');

  // Breeding & Hatching Tracking State
  const [breedingEntries, setBreedingEntries] = useState([]);
  const [editingBreedId, setEditingBreedId] = useState(null);
  const [breedSpecies, setBreedSpecies] = useState('Clarkii');
  const [breedDescription, setBreedDescription] = useState('');
  const [breedDate, setBreedDate] = useState(new Date().toISOString().split('T')[0]);
  const [breedImage, setBreedImage] = useState('');
  
  const [resolutionModalItem, setResolutionModalItem] = useState(null);
  const [resolutionType, setResolutionType] = useState('hacked');
  const [failReasonInput, setFailReasonInput] = useState('');

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

      const savedBreeding = localStorage.getItem(BREEDING_STORAGE_KEY);
      if (savedBreeding) {
        setBreedingEntries(JSON.parse(savedBreeding));
      } else {
        setBreedingEntries(INITIAL_BREEDING);
        localStorage.setItem(BREEDING_STORAGE_KEY, JSON.stringify(INITIAL_BREEDING));
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

  const saveBreeding = (newEntries) => {
    setBreedingEntries(newEntries);
    try {
      localStorage.setItem(BREEDING_STORAGE_KEY, JSON.stringify(newEntries));
    } catch (e) {
      console.error('Error saving breeding data:', e);
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

  const handleImageChange = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result);
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

  const handleSaveBreedingEntry = (e) => {
    if (e) e.preventDefault();
    if (!breedDescription.trim()) {
      showToast('❌ Please provide a description for the berried female');
      return;
    }

    if (editingBreedId) {
      const updated = breedingEntries.map((item) => {
        if (item.id === editingBreedId) {
          return {
            ...item,
            species: breedSpecies,
            description: breedDescription.trim(),
            berriedDate: breedDate,
            imageUri: breedImage || item.imageUri || 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=600&q=80'
          };
        }
        return item;
      });
      saveBreeding(updated);
      showToast('✅ Berried entry updated successfully!');
    } else {
      const newEntry = {
        id: 'b_' + Date.now(),
        species: breedSpecies,
        description: breedDescription.trim(),
        berriedDate: breedDate,
        imageUri: breedImage || 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=600&q=80',
        status: 'active',
        failReason: ''
      };
      const updated = [newEntry, ...breedingEntries];
      saveBreeding(updated);
      showToast('✅ New berried female tracked successfully!');
    }

    setEditingBreedId(null);
    setBreedSpecies('Clarkii');
    setBreedDescription('');
    setBreedDate(new Date().toISOString().split('T')[0]);
    setBreedImage('');
    setCurrentScreen('breedingDashboard');
  };

  const handleEditBreedClick = (item) => {
    setEditingBreedId(item.id);
    setBreedSpecies(item.species);
    setBreedDescription(item.description);
    setBreedDate(item.berriedDate);
    setBreedImage(item.imageUri);
    setCurrentScreen('addBreedingForm');
  };

  const handleDeleteBreed = (id) => {
    if (window.confirm('Are you sure you want to delete this breeding entry?')) {
      const updated = breedingEntries.filter((item) => item.id !== id);
      saveBreeding(updated);
      showToast('🗑️ Breeding record removed');
    }
  };

  const handleResolveBreedStatus = (e) => {
    if (e) e.preventDefault();
    if (!resolutionModalItem) return;

    if (resolutionType === 'failed' && !failReasonInput.trim()) {
      showToast('❌ Please specify the reason for failure');
      return;
    }

    const updated = breedingEntries.map((item) => {
      if (item.id === resolutionModalItem.id) {
        return {
          ...item,
          status: resolutionType,
          failReason: resolutionType === 'failed' ? failReasonInput.trim() : ''
        };
      }
      return item;
    });

    saveBreeding(updated);
    showToast(resolutionType === 'hacked' ? '🎉 Marked as Successfully Hatched!' : '⚠️ Marked as Hatching Failed');
    setResolutionModalItem(null);
    setFailReasonInput('');
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
      return true;
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

  const breedingAnalytics = useMemo(() => {
    const total = breedingEntries.length;
    const active = breedingEntries.filter(b => b.status === 'active').length;
    const hatched = breedingEntries.filter(b => b.status === 'hacked').length;
    const failed = breedingEntries.filter(b => b.status === 'failed').length;
    const completed = hatched + failed;
    const successRate = completed > 0 ? (hatched / completed) * 100 : 0;

    return {
      total,
      active,
      hatched,
      failed,
      successRate
    };
  }, [breedingEntries]);

  const getBreedingStatusDetails = (item) => {
    const berriedDateObj = new Date(item.berriedDate);
    const now = new Date();
    const diffTime = now - berriedDateObj;
    const daysBerried = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

    let minDays = 18;
    let maxDays = 21;
    let expectedLabel = '3 Weeks (21 Days)';

    if (item.species === 'Australian Red Claw') {
      minDays = 40;
      maxDays = 56;
      expectedLabel = '6-8 Weeks (42-56 Days)';
    }

    const isAboutToHatch = daysBerried >= minDays && daysBerried <= maxDays;
    const isOverdue = daysBerried > maxDays;

    return {
      daysBerried,
      expectedLabel,
      isAboutToHatch,
      isOverdue
    };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-700 shadow-2xl px-5 py-3 rounded-xl text-sm font-bold animate-bounce text-emerald-400 flex items-center gap-2">
          {toastMessage}
        </div>
      )}

      {resolutionModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Egg className="w-5 h-5 text-amber-400" /> Update Hatching Status
              </h3>
              <button
                onClick={() => setResolutionModalItem(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <p className="text-xs text-slate-400 mb-1">Target Entry:</p>
              <p className="text-sm font-semibold text-white">{resolutionModalItem.species} - {resolutionModalItem.description}</p>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Select Outcome
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setResolutionType('hacked')}
                  className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                    resolutionType === 'hacked'
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-750'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" /> Successfully Hatched 🎉
                </button>
                <button
                  type="button"
                  onClick={() => setResolutionType('failed')}
                  className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                    resolutionType === 'failed'
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-750'
                  }`}
                >
                  <XCircle className="w-4 h-4" /> Hatch Failed ⚠️
                </button>
              </div>
            </div>

            {resolutionType === 'failed' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-red-400 uppercase tracking-wider">
                  Reason for Failure <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Water parameters spiked, dropped eggs due to stress, fungus infection..."
                  value={failReasonInput}
                  onChange={(e) => setFailReasonInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-red-500 rounded-xl p-3 text-white text-sm focus:outline-none resize-none"
                />
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleResolveBreedStatus}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl transition text-sm shadow-md"
              >
                Confirm & Save Record
              </button>
              <button
                type="button"
                onClick={() => setResolutionModalItem(null)}
                className="bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold px-4 py-3 rounded-xl transition text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-4 py-3 sm:px-8">
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

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditingBreedId(null);
                setBreedSpecies('Clarkii');
                setBreedDescription('');
                setBreedDate(new Date().toISOString().split('T')[0]);
                setBreedImage('');
                setCurrentScreen('addBreedingForm');
              }}
              className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-2 rounded-lg transition text-xs font-bold"
            >
              <Egg className="w-4 h-4" />
              <span className="hidden md:inline">Track Berried Female</span>
            </button>

            <button
              onClick={() => setCurrentScreen('navHub')}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-750 text-emerald-400 hover:text-emerald-300 px-3.5 py-2 rounded-lg border border-slate-700 transition text-xs font-bold"
            >
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">Nav Menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main View Controller */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {currentScreen === 'navHub' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Farm Portal
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                  Welcome Back, Rom! 👋
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                  Manage customer purchases, track berried female crayfish & hatching success rates, and maintain your crayfish inventory catalog all in one place.
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setCurrentScreen('breedingDashboard')}
                    className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl transition shadow-lg shadow-amber-500/25 text-sm"
                  >
                    <HeartPulse className="w-4 h-4" /> Breeding & Hatching Tracker
                  </button>
                  <button
                    onClick={() => setCurrentScreen('salesForm')}
                    className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition shadow-lg shadow-emerald-500/25 text-sm"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" /> Record New Sale
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div 
                onClick={() => setCurrentScreen('breedingDashboard')}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-5 rounded-2xl flex items-center justify-between cursor-pointer transition"
              >
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Berried</p>
                  <p className="text-2xl font-black text-amber-400 mt-1">{breedingAnalytics.active}</p>
                </div>
                <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center border border-amber-500/20">
                  <Egg className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Hatch Success Rate</p>
                  <p className="text-2xl font-black text-emerald-400 mt-1">
                    {breedingAnalytics.successRate.toFixed(0)}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-500/20">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">All-Time Revenue</p>
                  <p className="text-2xl font-black text-white mt-1">
                    ₱{allTimeRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center border border-blue-500/20">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Catalog Varieties</p>
                  <p className="text-2xl font-black text-white mt-1">{inventory.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center border border-purple-500/20">
                  <Package className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                Farm Management Modules
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div 
                  onClick={() => setCurrentScreen('breedingDashboard')}
                  className="group bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 p-6 rounded-2xl transition cursor-pointer flex items-start gap-4 shadow-lg hover:shadow-amber-500/5"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition shrink-0">
                    <HeartPulse className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-bold text-white group-hover:text-amber-400 transition">
                        Breeding & Hatching
                      </h4>
                      <span className="bg-amber-500/20 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        New
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                      Track berried females, monitor incubation days, hatch alerts, and success rates.
                    </p>
                  </div>
                </div>

                <div 
                  onClick={() => setCurrentScreen('salesForm')}
                  className="group bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 p-6 rounded-2xl transition cursor-pointer flex items-start gap-4 shadow-lg hover:shadow-emerald-500/5"
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
                  className="group bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/50 p-6 rounded-2xl transition cursor-pointer flex items-start gap-4 shadow-lg hover:shadow-blue-500/5"
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
                  className="group bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 p-6 rounded-2xl transition cursor-pointer flex items-start gap-4 shadow-lg hover:shadow-amber-500/5"
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
                      Interactive timeframe filter: Daily, Weekly, Monthly, and All-Time sales performance.
                    </p>
                  </div>
                </div>

                <div 
                  onClick={() => setCurrentScreen('crayfishList')}
                  className="group bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/50 p-6 rounded-2xl transition cursor-pointer flex items-start gap-4 shadow-lg hover:shadow-purple-500/5"
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

        {currentScreen === 'breedingDashboard' && (
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
                  <HeartPulse className="w-6 h-6 text-amber-400" /> Breeding & Hatching Tracker
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Monitor berried females, incubation countdowns, hatching success rates, and failure logs
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingBreedId(null);
                  setBreedSpecies('Clarkii');
                  setBreedDescription('');
                  setBreedDate(new Date().toISOString().split('T')[0]);
                  setBreedImage('');
                  setCurrentScreen('addBreedingForm');
                }}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl transition text-xs shadow-md shadow-amber-500/20"
              >
                <Plus className="w-4 h-4 stroke-[3]" /> Track Berried Female
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-slate-900 to-slate-900/90 border border-amber-500/30 p-5 rounded-2xl relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Berried</span>
                  <Egg className="w-5 h-5 text-amber-400" />
                </div>
                <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-2">
                  {breedingAnalytics.active}
                </p>
                <span className="text-[10px] text-slate-400 mt-1 block">Females currently brooding eggs</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hatch Success Rate</span>
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2">
                  {breedingAnalytics.successRate.toFixed(0)}%
                </p>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {breedingAnalytics.hatched} Hatched / {breedingAnalytics.hatched + breedingAnalytics.failed} Completed
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Successfully Hatched</span>
                  <CheckCircle className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-2xl sm:text-3xl font-black text-blue-400 mt-2">
                  {breedingAnalytics.hatched}
                </p>
                <span className="text-[10px] text-slate-400 mt-1 block">Total successful broods</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Failed Broods</span>
                  <XCircle className="w-5 h-5 text-red-400" />
                </div>
                <p className="text-2xl sm:text-3xl font-black text-red-400 mt-2">
                  {breedingAnalytics.failed}
                </p>
                <span className="text-[10px] text-slate-400 mt-1 block">Logged failure reasons</span>
              </div>
            </div>

            {breedingEntries.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
                <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-300">No Berried Females Tracked</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">Start recording berried crayfish to monitor hatching schedules.</p>
                <button
                  onClick={() => setCurrentScreen('addBreedingForm')}
                  className="bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Track First Berried Female
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {breedingEntries.map((item) => {
                  const details = getBreedingStatusDetails(item);
                  return (
                    <div
                      key={item.id}
                      className={`bg-slate-900 border rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between transition ${
                        item.status === 'active' && details.isAboutToHatch
                          ? 'border-amber-500 shadow-amber-500/10 ring-1 ring-amber-500/50'
                          : 'border-slate-800'
                      }`}
                    >
                      <div>
                        <div className="h-48 w-full bg-slate-950 relative overflow-hidden group">
                          <img
                            src={item.imageUri}
                            alt={item.species}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=600&q=80';
                            }}
                          />
                          <div className="absolute top-3 right-3 flex items-center gap-1.5">
                            <button
                              onClick={() => handleEditBreedClick(item)}
                              className="bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white p-2 rounded-lg transition"
                              title="Edit entry"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBreed(item.id)}
                              className="bg-slate-900/80 hover:bg-red-500 text-slate-300 hover:text-white p-2 rounded-lg transition"
                              title="Delete record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="absolute bottom-3 left-3 flex items-center gap-2">
                            <span className={`text-xs font-extrabold px-3 py-1 rounded-lg border uppercase tracking-wider ${
                              item.status === 'active' 
                                ? 'bg-amber-500/90 text-slate-950 border-amber-400' 
                                : item.status === 'hacked'
                                ? 'bg-emerald-500/90 text-slate-950 border-emerald-400'
                                : 'bg-red-500/90 text-white border-red-400'
                            }`}>
                              {item.status === 'active' && '🥚 Berried (Active)'}
                              {item.status === 'hacked' && '🎉 Successfully Hatched'}
                              {item.status === 'failed' && '⚠️ Hatch Failed'}
                            </span>
                          </div>
                        </div>

                        <div className="p-5 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                              🧬 {item.species}
                            </span>
                            <span className="text-xs font-mono text-slate-400">
                              Berried Date: {item.berriedDate}
                            </span>
                          </div>

                          <p className="text-slate-300 text-xs leading-relaxed">
                            {item.description}
                          </p>

                          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-400 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-blue-400" /> Duration Berried:
                              </span>
                              <strong className="text-white font-mono">{details.daysBerried} Days</strong>
                            </div>

                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-400">Expected Timeline:</span>
                              <span className="text-slate-300 font-medium">{details.expectedLabel}</span>
                            </div>

                            {item.status === 'active' && details.isAboutToHatch && (
                              <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 animate-pulse">
                                🚨 Hatching Alert: Expected soon! Check tank parameters.
                              </div>
                            )}

                            {item.status === 'failed' && item.failReason && (
                              <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-xs px-3 py-1.5 rounded-lg">
                                <strong>Failure Reason:</strong> {item.failReason}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {item.status === 'active' && (
                        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center gap-2">
                          <button
                            onClick={() => {
                              setResolutionModalItem(item);
                              setResolutionType('hacked');
                              setFailReasonInput('');
                            }}
                            className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 font-bold py-2 px-3 rounded-xl transition text-xs flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Mark Hatched
                          </button>
                          <button
                            onClick={() => {
                              setResolutionModalItem(item);
                              setResolutionType('failed');
                              setFailReasonInput('');
                            }}
                            className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 font-bold py-2 px-3 rounded-xl transition text-xs flex items-center justify-center gap-1.5"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Mark Failed
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {currentScreen === 'addBreedingForm' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentScreen('breedingDashboard')}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-semibold"
              >
                <ChevronLeft className="w-4 h-4" /> Back to Breeding Dashboard
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                  <Egg className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {editingBreedId ? 'Edit Berried Female Entry' : 'Track New Berried Female'}
                  </h2>
                  <p className="text-xs text-slate-400">Record species, berried date, and upload reference photo</p>
                </div>
              </div>

              <form onSubmit={handleSaveBreedingEntry} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Crayfish Species
                  </label>
                  <select
                    value={breedSpecies}
                    onChange={(e) => setBreedSpecies(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-3 text-white focus:outline-none transition text-sm font-medium"
                  >
                    <option value="Clarkii">Clarkii (Expected Incubation: ~3 Weeks / 18-21 Days)</option>
                    <option value="Australian Red Claw">Australian Red Claw (Expected Incubation: ~6-8 Weeks / 40-56 Days)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Berried Date
                  </label>
                  <input
                    type="date"
                    required
                    value={breedDate}
                    onChange={(e) => setBreedDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-3 text-white focus:outline-none transition text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Description & Tank Setup Notes
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="e.g. Tank 4 isolation breeder box, excellent egg count, water temp 26°C..."
                    value={breedDescription}
                    onChange={(e) => setBreedDescription(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none transition text-sm resize-none"
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
                      onChange={(e) => handleImageChange(e, setBreedImage)}
                      className="w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500/10 file:text-amber-400 hover:file:bg-amber-500/20 cursor-pointer"
                    />

                    {breedImage && (
                      <div className="relative rounded-xl overflow-hidden h-40 border border-slate-800">
                        <img src={breedImage} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setBreedImage('')}
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
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3.5 rounded-xl transition shadow-lg shadow-amber-500/20 text-sm flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Save Breeding Entry
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentScreen('breedingDashboard')}
                    className="bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold px-5 py-3.5 rounded-xl transition text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
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
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none transition text-sm"
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
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-white focus:outline-none transition text-sm"
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
                      className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-9 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none transition text-sm font-semibold"
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
                    className="bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold px-5 py-3.5 rounded-xl transition text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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

            {sales.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
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
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-950/80 text-xs font-bold uppercase text-slate-400 tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="py-3.5 px-4 sm:px-6">Buyer Name</th>
                        <th className="py-3.5 px-4 sm:px-6">Date</th>
                        <th className="py-3.5 px-4 sm:px-6 text-right">Total Price</th>
                        <th className="py-3.5 px-4 sm:px-6 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {sales.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-850/50 transition">
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
                  className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold px-4 py-2.5 rounded-xl border border-slate-800 text-xs"
                >
                  📋 View Full Sales Log
                </button>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl flex items-center gap-1">
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
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-slate-900 to-slate-900/90 border border-emerald-500/30 p-5 rounded-2xl relative overflow-hidden">
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
                <span className="text-[10px] text-slate-400 mt-1 block">Total revenue generated in this timeframe</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Transactions</span>
                  <ShoppingBag className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-2xl sm:text-3xl font-black text-white mt-2">
                  {analytics.totalTransactions}
                </p>
                <span className="text-[10px] text-slate-400 mt-1 block">Completed orders recorded</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Sale</span>
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-2xl sm:text-3xl font-black text-purple-300 mt-2">
                  ₱{analytics.avgTransaction.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <span className="text-[10px] text-slate-400 mt-1 block">Revenue per transaction</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Highest Sale</span>
                  <BarChart3 className="w-5 h-5 text-amber-400" />
                </div>
                <p className="text-2xl sm:text-3xl font-black text-amber-300 mt-2">
                  ₱{analytics.maxSale.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <span className="text-[10px] text-slate-400 mt-1 block">Peak transaction value</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
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
                      className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between hover:border-slate-700 transition"
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

            {inventory.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
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
                    className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-48 w-full bg-slate-950 relative overflow-hidden group">
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
                        <span className="absolute bottom-3 left-3 bg-slate-950/80 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-md border border-slate-800">
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

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
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
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none transition text-sm"
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
                      className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none transition text-sm"
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
                      className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-4 py-3 text-white focus:outline-none transition text-sm"
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
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none transition text-sm resize-none"
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
                      onChange={(e) => handleImageChange(e, setCrayfishImage)}
                      className="w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-500/10 file:text-purple-400 hover:file:bg-purple-500/20 cursor-pointer"
                    />

                    {crayfishImage && (
                      <div className="relative rounded-xl overflow-hidden h-40 border border-slate-800">
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
                    className="bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold px-5 py-3.5 rounded-xl transition text-sm"
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
        <p>© Rom's Crayfish Hub Management System • All breeding & sales data persisted locally</p>
      </footer>
    </div>
  );
}
