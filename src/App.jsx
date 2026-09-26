import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Heart,
  Clock,
  CheckCircle,
  XCircle,
  Edit3,
  Download,
  Upload
} from 'lucide-react';

const SALES_STORAGE_KEY = 'roms_crayfish_sales_v3';
const INVENTORY_STORAGE_KEY = 'roms_crayfish_inventory_v3';
const BERRIED_STORAGE_KEY = 'roms_crayfish_berried_v1';

const INITIAL_SALES = [
  { id: '1', buyerName: 'Juan Dela Cruz', date: new Date().toISOString().split('T')[0], totalPrice: '1200.00' },
  { id: '2', buyerName: 'Maria Santos', date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], totalPrice: '2500.00' },
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

const INITIAL_BERRIED = [
  {
    id: 'b1',
    species: 'Clarkii',
    description: 'Red Clarkii female carrying dark eggs under tail, active and eating well.',
    berriedDate: new Date(Date.now() - 86400000 * 12).toISOString().split('T')[0],
    imageUri: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    status: 'active', // 'active' | 'hatched' | 'failed'
    failReason: '',
  }
];

export default function App() {
  // Navigation Screens: 'navHub', 'salesForm', 'salesRecords', 'salesDashboard', 'crayfishList', 'addCrayfishForm', 'berriedList', 'addBerriedForm', 'berriedDashboard'
  const [currentScreen, setCurrentScreen] = useState('navHub');

  // Sales State
  const [sales, setSales] = useState([]);
  const [buyerName, setBuyerName] = useState('');
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalPrice, setTotalPrice] = useState('');

  // Dashboard Analytics Filter State
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState('monthly');

  // Crayfish Inventory State
  const [inventory, setInventory] = useState([]);
  const [crayfishName, setCrayfishName] = useState('');
  const [crayfishSpecies, setCrayfishSpecies] = useState('');
  const [crayfishDefinition, setCrayfishDefinition] = useState('');
  const [crayfishStock, setCrayfishStock] = useState('10');
  const [crayfishImage, setCrayfishImage] = useState('');

  // Berried Female State
  const [berriedList, setBerriedList] = useState([]);
  const [berriedSpecies, setBerriedSpecies] = useState('Clarkii');
  const [berriedDesc, setBerriedDesc] = useState('');
  const [berriedDate, setBerriedDate] = useState(new Date().toISOString().split('T')[0]);
  const [berriedImage, setBerriedImage] = useState('');
  const [editingBerriedId, setEditingBerriedId] = useState(null);

  // Resolution Modal State (for marking hatched or failed)
  const [resolvingItem, setResolvingItem] = useState(null);
  const [resolutionType, setResolutionType] = useState('hatched'); // 'hatched' | 'failed'
  const [failReasonInput, setFailReasonInput] = useState('');

  // UI Toast Notice
  const [toastMessage, setToastMessage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    try {
      const savedSales = localStorage.getItem(SALES_STORAGE_KEY);
      setSales(savedSales ? JSON.parse(savedSales) : INITIAL_SALES);

      const savedInventory = localStorage.getItem(INVENTORY_STORAGE_KEY);
      setInventory(savedInventory ? JSON.parse(savedInventory) : INITIAL_INVENTORY);

      const savedBerried = localStorage.getItem(BERRIED_STORAGE_KEY);
      setBerriedList(savedBerried ? JSON.parse(savedBerried) : INITIAL_BERRIED);
    } catch (e) {
      console.error('Error reading localStorage:', e);
    }
  }, []);

  const saveSales = (newSales) => {
    setSales(newSales);
    localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify(newSales));
  };

  const saveInventory = (newInventory) => {
    setInventory(newInventory);
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(newInventory));
  };

  const saveBerried = (newList) => {
    setBerriedList(newList);
    localStorage.setItem(BERRIED_STORAGE_KEY, JSON.stringify(newList));
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Export & Import Backup Helpers
  const handleExportBackup = () => {
    const backupData = {
      sales,
      inventory,
      berriedList,
      exportDate: new Date().toISOString()
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `roms_crayfish_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('📥 Backup file downloaded successfully!');
  };

  const handleImportBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.sales && parsed.inventory) {
          saveSales(parsed.sales);
          saveInventory(parsed.inventory);
          if (parsed.berriedList) saveBerried(parsed.berriedList);
          showToast('✅ Data successfully restored from backup!');
          setCurrentScreen('navHub');
        } else {
          showToast('❌ Invalid backup file format.');
        }
      } catch (err) {
        showToast('❌ Error parsing JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  // Calculations for Berried Crayfish Incubation
  const getIncubationDetails = (item) => {
    const start = new Date(item.berriedDate);
    const now = new Date();
    const diffTime = now - start;
    const daysBerried = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

    // Clarkii: ~3 weeks (21 days), Australian Red Claw: ~6-8 weeks (42-56 days)
    const targetDays = item.species === 'Clarkii' ? 21 : 49;
    const daysLeft = targetDays - daysBerried;
    const isReadyToHatch = daysLeft <= 3;

    return { daysBerried, targetDays, daysLeft, isReadyToHatch };
  };

  const handleSaveBerried = (e) => {
    if (e) e.preventDefault();
    if (!berriedDesc.trim()) {
      showToast('❌ Please provide a description for the berried female');
      return;
    }

    if (editingBerriedId) {
      const updated = berriedList.map(item => item.id === editingBerriedId ? {
        ...item,
        species: berriedSpecies,
        description: berriedDesc.trim(),
        berriedDate: berriedDate,
        imageUri: berriedImage || item.imageUri
      } : item);
      saveBerried(updated);
      setEditingBerriedId(null);
      showToast('✅ Berried female updated!');
    } else {
      const newItem = {
        id: Date.now().toString(),
        species: berriedSpecies,
        description: berriedDesc.trim(),
        berriedDate: berriedDate,
        imageUri: berriedImage || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
        status: 'active',
        failReason: ''
      };
      saveBerried([newItem, ...berriedList]);
      showToast('✅ Berried female logged successfully!');
    }

    setBerriedDesc('');
    setBerriedImage('');
    setCurrentScreen('berriedList');
  };

  const handleEditBerried = (item) => {
    setEditingBerriedId(item.id);
    setBerriedSpecies(item.species);
    setBerriedDesc(item.description);
    setBerriedDate(item.berriedDate);
    setBerriedImage(item.imageUri);
    setCurrentScreen('addBerriedForm');
  };

  const handleDeleteBerried = (id) => {
    if (window.confirm('Delete this berried female record?')) {
      saveBerried(berriedList.filter(i => i.id !== id));
      showToast('🗑️ Record removed');
    }
  };

  const handleConfirmResolution = () => {
    if (!resolvingItem) return;
    const updated = berriedList.map(item => {
      if (item.id === resolvingItem.id) {
        return {
          ...item,
          status: resolutionType,
          failReason: resolutionType === 'failed' ? failReasonInput.trim() || 'Unspecified reason' : ''
        };
      }
      return item;
    });
    saveBerried(updated);
    setResolvingItem(null);
    setFailReasonInput('');
    showToast(resolutionType === 'hatched' ? '🎉 Marked as Successfully Hatched!' : '⚠️ Marked as Hatch Failed');
  };

  // Sales handlers
  const handleSaveSale = (e) => {
    if (e) e.preventDefault();
    if (!buyerName.trim() || !totalPrice || !saleDate) {
      showToast('❌ Please fill in all sale fields');
      return;
    }
    const priceNum = parseFloat(totalPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      showToast('❌ Enter a valid positive sale amount');
      return;
    }
    const newSale = { id: Date.now().toString(), buyerName: buyerName.trim(), date: saleDate, totalPrice: priceNum.toFixed(2) };
    saveSales([newSale, ...sales]);
    setBuyerName('');
    setTotalPrice('');
    showToast('✅ Sale recorded!');
    setCurrentScreen('salesRecords');
  };

  const handleDeleteSale = (id) => {
    if (window.confirm('Delete this sales record?')) {
      saveSales(sales.filter(i => i.id !== id));
      showToast('🗑️ Sale removed');
    }
  };

  // Crayfish Catalog handlers
  const handleSaveCrayfish = (e) => {
    if (e) e.preventDefault();
    if (!crayfishName.trim() || !crayfishDefinition.trim()) {
      showToast('❌ Provide name and description');
      return;
    }
    const newItem = {
      id: Date.now().toString(),
      name: crayfishName.trim(),
      species: crayfishSpecies.trim() || 'Freshwater Species',
      definition: crayfishDefinition.trim(),
      stockCount: parseInt(crayfishStock) || 0,
      imageUri: crayfishImage || 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=600&q=80'
    };
    saveInventory([newItem, ...inventory]);
    setCrayfishName('');
    setCrayfishSpecies('');
    setCrayfishDefinition('');
    setCrayfishImage('');
    showToast('✅ Crayfish added to catalog!');
    setCurrentScreen('crayfishList');
  };

  const handleDeleteCrayfish = (id) => {
    if (window.confirm('Delete this crayfish variety?')) {
      saveInventory(inventory.filter(i => i.id !== id));
      showToast('🗑️ Variety removed');
    }
  };

  // Analytics
  const analytics = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const filtered = sales.filter((item) => {
      if (!item.date) return false;
      const itemDate = new Date(item.date);
      if (isNaN(itemDate.getTime())) return false;
      if (analyticsTimeframe === 'daily') return item.date === todayStr;
      if (analyticsTimeframe === 'weekly') return itemDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) && itemDate <= now;
      if (analyticsTimeframe === 'monthly') return itemDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) && itemDate <= now;
      return true;
    });
    const totalRevenue = filtered.reduce((sum, item) => sum + (parseFloat(item.totalPrice) || 0), 0);
    return { filteredSales: filtered, totalRevenue, totalTransactions: filtered.length };
  }, [sales, analyticsTimeframe]);

  // Berried Stats
  const berriedStats = useMemo(() => {
    const active = berriedList.filter(i => i.status === 'active').length;
    const hatched = berriedList.filter(i => i.status === 'hatched').length;
    const failed = berriedList.filter(i => i.status === 'failed').length;
    const finished = hatched + failed;
    const successRate = finished > 0 ? Math.round((hatched / finished) * 100) : (hatched > 0 ? 100 : 0);
    return { active, hatched, failed, successRate };
  }, [berriedList]);

  const allTimeRevenue = useMemo(() => sales.reduce((sum, i) => sum + (parseFloat(i.totalPrice) || 0), 0), [sales]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-2xl animate-bounce text-sm flex items-center gap-2">
          {toastMessage}
        </div>
      )}

      {/* Resolution Modal */}
      {resolvingItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" /> Update Incubation Result
            </h3>
            <p className="text-xs text-slate-400">
              Updating record for <strong className="text-white">{resolvingItem.species}</strong> berried female.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setResolutionType('hatched')}
                className={`py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition ${
                  resolutionType === 'hatched'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" /> Successfully Hatched
              </button>
              <button
                type="button"
                onClick={() => setResolutionType('failed')}
                className={`py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition ${
                  resolutionType === 'failed'
                    ? 'bg-red-500 text-white border-red-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                }`}
              >
                <XCircle className="w-4 h-4" /> Hatch Failed
              </button>
            </div>

            {resolutionType === 'failed' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Reason for Failure
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fungal infection, dropped eggs, poor water params..."
                  value={failReasonInput}
                  onChange={(e) => setFailReasonInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-red-500 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none"
                />
              </div>
            )}

            <div className="pt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={handleConfirmResolution}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 rounded-xl text-sm transition"
              >
                Save Resolution
              </button>
              <button
                type="button"
                onClick={() => setResolvingItem(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-3 rounded-xl text-sm transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-4 py-3 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-xl shadow-lg shadow-emerald-500/20">
              🦐
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase block">
                Crayfish Farm Hub
              </span>
              <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                Rom's Crayfish Hub
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setCurrentScreen('berriedDashboard')}
              className="flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 px-3.5 py-2 rounded-lg transition text-xs font-bold"
            >
              <Heart className="w-4 h-4 fill-rose-400" />
              <span>Berried & Hatching</span>
            </button>
            <button
              onClick={() => setCurrentScreen('navHub')}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 text-emerald-400 px-3.5 py-2 rounded-lg border border-slate-700 transition text-xs font-bold"
            >
              <Layers className="w-4 h-4" />
              <span>Nav Hub</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* 1. NAVIGATION HUB */}
        {currentScreen === 'navHub' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-850 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Farm Portal
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                  Welcome Back, Rom! 👋
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Track sales performance, inventory catalog, and monitor berried female crayfish incubation and hatching success rates in real-time.
                </p>

                {/* Responsive action buttons row */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setCurrentScreen('addBerriedForm')}
                    className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-bold px-4 py-2.5 rounded-xl transition text-sm shadow-lg shadow-rose-500/25"
                  >
                    <Heart className="w-4 h-4 fill-white" /> Log Berried Female
                  </button>
                  <button
                    onClick={() => setCurrentScreen('salesForm')}
                    className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition text-sm shadow-lg shadow-emerald-500/25"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" /> Record New Sale
                  </button>
                </div>
              </div>
            </div>

            {/* Device Data Migration Panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Download className="w-4 h-4 text-teal-400" /> Device Data Migration (Backup / Restore)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Export your sales & berried logs from your old app, then import into the new layout!
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleExportBackup}
                  className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-md shadow-teal-500/20"
                >
                  <Download className="w-4 h-4" /> Export Backup (.json)
                </button>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".json"
                    onChange={handleImportBackup}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs transition"
                  >
                    <Upload className="w-4 h-4 text-teal-400" /> Import Backup File
                  </button>
                </div>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div onClick={() => setCurrentScreen('berriedList')} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl cursor-pointer hover:border-rose-500/50 transition">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Berried</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-2xl font-black text-rose-400">{berriedStats.active}</span>
                  <Heart className="w-5 h-5 text-rose-400" />
                </div>
              </div>

              <div onClick={() => setCurrentScreen('berriedDashboard')} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl cursor-pointer hover:border-emerald-500/50 transition">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hatching Success</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-2xl font-black text-emerald-400">{berriedStats.successRate}%</span>
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
              </div>

              <div onClick={() => setCurrentScreen('salesRecords')} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl cursor-pointer hover:border-blue-500/50 transition">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sales Records</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-2xl font-black text-white">{sales.length}</span>
                  <ShoppingBag className="w-5 h-5 text-blue-400" />
                </div>
              </div>

              <div onClick={() => setCurrentScreen('crayfishList')} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl cursor-pointer hover:border-purple-500/50 transition">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Catalog Varieties</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-2xl font-black text-white">{inventory.length}</span>
                  <Package className="w-5 h-5 text-purple-400" />
                </div>
              </div>
            </div>

            {/* Modules Grid */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                Farm Management Modules
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div onClick={() => setCurrentScreen('berriedList')} className="group bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-rose-500/50 p-6 rounded-2xl transition cursor-pointer flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20 group-hover:scale-110 transition shrink-0">
                    <Heart className="w-6 h-6 fill-rose-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white group-hover:text-rose-400 transition">Berried Female & Hatching Tracker</h4>
                    <p className="text-slate-400 text-sm mt-1">Monitor gestation days, incubation alerts (Clarkii 3 weeks, Australian Red Claw 6-8 weeks), and hatch success rates.</p>
                  </div>
                </div>

                <div onClick={() => setCurrentScreen('salesDashboard')} className="group bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 p-6 rounded-2xl transition cursor-pointer flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition shrink-0">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white group-hover:text-amber-400 transition">Sales Dashboard & Analytics</h4>
                    <p className="text-slate-400 text-sm mt-1">Filter revenue performance by Daily, Weekly (7 days), Monthly (30 days), and All-Time.</p>
                  </div>
                </div>

                <div onClick={() => setCurrentScreen('salesRecords')} className="group bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/50 p-6 rounded-2xl transition cursor-pointer flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition shrink-0">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition">Sales Records Ledger</h4>
                    <p className="text-slate-400 text-sm mt-1">View full customer transactions history, dates, buyer names, and total PHP revenue.</p>
                  </div>
                </div>

                <div onClick={() => setCurrentScreen('crayfishList')} className="group bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/50 p-6 rounded-2xl transition cursor-pointer flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition shrink-0">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white group-hover:text-purple-400 transition">Available Crayfish Catalog</h4>
                    <p className="text-slate-400 text-sm mt-1">Manage stock counts, species care descriptions, and custom variety photo uploads.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. BERRIED LIST SCREEN */}
        {currentScreen === 'berriedList' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <button onClick={() => setCurrentScreen('navHub')} className="flex items-center gap-2 text-slate-400 hover:text-white transition text-xs font-semibold mb-1">
                  <ChevronLeft className="w-3.5 h-3.5" /> Navigation Hub
                </button>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <Heart className="w-6 h-6 fill-rose-400 text-rose-400" /> Berried Female Crayfish Tracker
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Track incubation days, hatching countdowns, and success records</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setEditingBerriedId(null); setBerriedDesc(''); setBerriedImage(''); setCurrentScreen('addBerriedForm'); }}
                  className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white font-bold px-4 py-2.5 rounded-xl transition text-xs shadow-md shadow-rose-500/20"
                >
                  <Plus className="w-4 h-4 stroke-[3]" /> Log Berried Female
                </button>
                <button
                  onClick={() => setCurrentScreen('berriedDashboard')}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold px-4 py-2.5 rounded-xl transition text-xs"
                >
                  <BarChart3 className="w-4 h-4 text-rose-400" /> Success Rate Dashboard
                </button>
              </div>
            </div>

            {berriedList.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
                <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-300">No Berried Females Logged</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">Start logging egg-carrying females to track hatching schedules.</p>
                <button onClick={() => setCurrentScreen('addBerriedForm')} className="bg-rose-500 text-white font-bold px-4 py-2 rounded-xl text-xs">
                  Log First Berried Female
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {berriedList.map((item) => {
                  const { daysBerried, targetDays, daysLeft, isReadyToHatch } = getIncubationDetails(item);
                  return (
                    <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between">
                      <div>
                        <div className="h-48 w-full bg-slate-950 relative overflow-hidden">
                          <img
                            src={item.imageUri}
                            alt={item.species}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80'; }}
                          />
                          <div className="absolute top-3 left-3 flex gap-2">
                            <span className={`text-xs font-extrabold px-3 py-1 rounded-full border shadow-lg ${
                              item.species === 'Clarkii' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                            }`}>
                              {item.species} (Target: {targetDays / 7} wks)
                            </span>
                          </div>

                          <div className="absolute top-3 right-3 flex items-center gap-1.5">
                            <button onClick={() => handleEditBerried(item)} className="bg-slate-900/80 hover:bg-slate-800 text-slate-200 p-2 rounded-lg transition" title="Edit entry">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteBerried(item.id)} className="bg-slate-900/80 hover:bg-red-500 text-slate-200 hover:text-white p-2 rounded-lg transition" title="Delete record">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Status Badge */}
                          <div className="absolute bottom-3 right-3">
                            {item.status === 'active' && (
                              <span className={`text-xs font-bold px-3 py-1 rounded-lg border flex items-center gap-1.5 shadow-md ${
                                isReadyToHatch ? 'bg-rose-500 text-white border-rose-400 animate-pulse' : 'bg-slate-900/90 text-emerald-400 border-emerald-500/30'
                              }`}>
                                <Clock className="w-3.5 h-3.5" />
                                {isReadyToHatch ? '🔥 Ready to Hatch Soon!' : `${daysLeft} days left`}
                              </span>
                            )}
                            {item.status === 'hatched' && (
                              <span className="text-xs font-bold px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 border border-emerald-400 flex items-center gap-1.5 shadow-md">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Successfully Hatched
                              </span>
                            )}
                            {item.status === 'failed' && (
                              <span className="text-xs font-bold px-3 py-1 rounded-lg bg-red-500 text-white border border-red-400 flex items-center gap-1.5 shadow-md">
                                <XCircle className="w-3.5 h-3.5" /> Failed
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-5 space-y-3">
                          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                            <span>Berried Date: {item.berriedDate}</span>
                            <span className="text-rose-400 font-bold">Berried for {daysBerried} days</span>
                          </div>

                          <p className="text-slate-300 text-xs leading-relaxed">
                            {item.description}
                          </p>

                          {item.status === 'failed' && item.failReason && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-2.5 text-xs text-red-300">
                              <strong>Failure Reason:</strong> {item.failReason}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action buttons for status */}
                      {item.status === 'active' && (
                        <div className="p-4 pt-0 border-t border-slate-800/60 mt-2 flex items-center gap-2">
                          <button
                            onClick={() => { setResolvingItem(item); setResolutionType('hatched'); }}
                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Mark Hatched
                          </button>
                          <button
                            onClick={() => { setResolvingItem(item); setResolutionType('failed'); }}
                            className="flex-1 bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-slate-700 font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                          >
                            <XCircle className="w-4 h-4" /> Mark Failed
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

        {/* 3. ADD / EDIT BERRIED FORM */}
        {currentScreen === 'addBerriedForm' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <button onClick={() => setCurrentScreen('berriedList')} className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-semibold">
                <ChevronLeft className="w-4 h-4" /> Back to Berried List
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                  <Heart className="w-5 h-5 fill-rose-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {editingBerriedId ? 'Edit Berried Female Record' : 'Log Berried Female Crayfish'}
                  </h2>
                  <p className="text-xs text-slate-400">Select species incubation rules and log details</p>
                </div>
              </div>

              <form onSubmit={handleSaveBerried} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Crayfish Species
                  </label>
                  <select
                    value={berriedSpecies}
                    onChange={(e) => setBerriedSpecies(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-rose-500 rounded-xl px-4 py-3 text-white text-sm focus:outline-none"
                  >
                    <option value="Clarkii">Clarkii (Incubation Target: ~3 Weeks)</option>
                    <option value="Australian Red Claw">Australian Red Claw (Incubation Target: 6-8 Weeks)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Berried Date (When eggs were spotted)
                  </label>
                  <input
                    type="date"
                    required
                    value={berriedDate}
                    onChange={(e) => setBerriedDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-rose-500 rounded-xl px-4 py-3 text-white text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Description & Tank Notes
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. Female isolated in 10-gallon tank, color of eggs, water temperature..."
                    value={berriedDesc}
                    onChange={(e) => setBerriedDesc(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-rose-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm resize-none focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Photo Upload
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setBerriedImage(reader.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-500/10 file:text-rose-400 hover:file:bg-rose-500/20 cursor-pointer"
                  />
                  {berriedImage && (
                    <div className="mt-3 relative rounded-xl overflow-hidden h-36 border border-slate-800">
                      <img src={berriedImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <button type="submit" className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-rose-500/20 text-sm flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Save Berried Record
                  </button>
                  <button type="button" onClick={() => setCurrentScreen('berriedList')} className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-5 py-3.5 rounded-xl transition text-sm">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 4. BERRIED SUCCESS RATE DASHBOARD */}
        {currentScreen === 'berriedDashboard' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <button onClick={() => setCurrentScreen('navHub')} className="flex items-center gap-2 text-slate-400 hover:text-white transition text-xs font-semibold mb-1">
                  <ChevronLeft className="w-3.5 h-3.5" /> Navigation Hub
                </button>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-rose-400" /> Hatching Success Rate Dashboard
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Comprehensive overview of breeding productivity and failure analysis</p>
              </div>

              <button onClick={() => setCurrentScreen('berriedList')} className="bg-slate-900 border border-slate-800 text-slate-200 font-bold px-4 py-2.5 rounded-xl text-xs hover:bg-slate-850 transition">
                ← Back to Berried List
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Incubation</p>
                <p className="text-3xl font-black text-rose-400 mt-2">{berriedStats.active}</p>
                <span className="text-[10px] text-slate-500 mt-1 block">Females currently berried</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Successful Hatches</p>
                <p className="text-3xl font-black text-emerald-400 mt-2">{berriedStats.hatched}</p>
                <span className="text-[10px] text-slate-500 mt-1 block">Completed broods</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Failed Broods</p>
                <p className="text-3xl font-black text-red-400 mt-2">{berriedStats.failed}</p>
                <span className="text-[10px] text-slate-500 mt-1 block">Dropped / unfertilized eggs</span>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-slate-850 border border-emerald-500/30 p-5 rounded-2xl">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hatching Success Rate</p>
                <p className="text-3xl font-black text-emerald-400 mt-2">{berriedStats.successRate}%</p>
                <span className="text-[10px] text-slate-500 mt-1 block">Overall breeding efficiency</span>
              </div>
            </div>

            {/* Detailed History Log */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-rose-400" /> Completed Incubation Log ({berriedList.filter(i => i.status !== 'active').length})
              </h3>

              {berriedList.filter(i => i.status !== 'active').length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  No completed hatching records yet. Mark active berried females as Hatched or Failed to populate statistics.
                </div>
              ) : (
                <div className="space-y-3">
                  {berriedList.filter(i => i.status !== 'active').map((item) => (
                    <div key={item.id} className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          item.status === 'hatched' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {item.status === 'hatched' ? '🎉' : '⚠️'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{item.species}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                              item.status === 'hatched' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                          {item.failReason && (
                            <p className="text-xs text-red-400 mt-1"><strong>Reason:</strong> {item.failReason}</p>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-mono text-slate-500">Logged: {item.berriedDate}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. SALES FORM SCREEN */}
        {currentScreen === 'salesForm' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <button onClick={() => setCurrentScreen('navHub')} className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-semibold">
                <ChevronLeft className="w-4 h-4" /> Back to Nav Hub
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
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Buyer Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Juan Dela Cruz"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Sale Date</label>
                  <input
                    type="date"
                    required
                    value={saleDate}
                    onChange={(e) => setSaleDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-3 text-white text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Total Price (₱ PHP)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₱</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      placeholder="0.00"
                      value={totalPrice}
                      onChange={(e) => setTotalPrice(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl pl-9 pr-4 py-3 text-white placeholder-slate-500 font-semibold text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <button type="submit" className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3.5 rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4" /> Save Sale Record
                  </button>
                  <button type="button" onClick={() => setCurrentScreen('navHub')} className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-5 py-3.5 rounded-xl transition text-sm">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 6. SALES RECORDS SCREEN */}
        {currentScreen === 'salesRecords' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <button onClick={() => setCurrentScreen('navHub')} className="flex items-center gap-2 text-slate-400 hover:text-white transition text-xs font-semibold mb-1">
                  <ChevronLeft className="w-3.5 h-3.5" /> Navigation Hub
                </button>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6 text-blue-400" /> Sales Ledger
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Total Transactions: <span className="text-white font-bold">{sales.length}</span></p>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentScreen('salesForm')} className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition">
                  + Add New Sale
                </button>
                <button onClick={() => setCurrentScreen('salesDashboard')} className="bg-amber-500 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs transition">
                  Sales Dashboard Analytics
                </button>
              </div>
            </div>

            {sales.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
                <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-300">No Sales Recorded Yet</h3>
                <button onClick={() => setCurrentScreen('salesForm')} className="mt-4 bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs">
                  Create First Sale Entry
                </button>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-950 text-xs font-bold uppercase text-slate-400 tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="py-3.5 px-6">Buyer Name</th>
                        <th className="py-3.5 px-6">Date</th>
                        <th className="py-3.5 px-6 text-right">Total Price</th>
                        <th className="py-3.5 px-6 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {sales.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-850/50 transition">
                          <td className="py-4 px-6 font-bold text-white">{item.buyerName}</td>
                          <td className="py-4 px-6 text-slate-400 text-xs font-mono">📅 {item.date}</td>
                          <td className="py-4 px-6 text-right font-black text-emerald-400 text-base">
                            ₱{parseFloat(item.totalPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <button onClick={() => handleDeleteSale(item.id)} className="text-slate-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition" title="Delete sale">
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

        {/* 7. SALES DASHBOARD SCREEN */}
        {currentScreen === 'salesDashboard' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <button onClick={() => setCurrentScreen('navHub')} className="flex items-center gap-2 text-slate-400 hover:text-white transition text-xs font-semibold mb-1">
                  <ChevronLeft className="w-3.5 h-3.5" /> Navigation Hub
                </button>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-amber-400" /> Sales Analytics Dashboard
                </h2>
              </div>
              <button onClick={() => setCurrentScreen('salesRecords')} className="bg-slate-900 border border-slate-800 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs">
                📋 View Full Sales Log
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-2xl flex items-center gap-1">
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
                    analyticsTimeframe === tab.id ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue in Period</p>
                <p className="text-3xl font-black text-emerald-400 mt-2">
                  ₱{analytics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Transactions</p>
                <p className="text-3xl font-black text-white mt-2">{analytics.totalTransactions}</p>
              </div>
            </div>
          </div>
        )}

        {/* 8. CRAYFISH CATALOG SCREEN */}
        {currentScreen === 'crayfishList' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <button onClick={() => setCurrentScreen('navHub')} className="flex items-center gap-2 text-slate-400 hover:text-white transition text-xs font-semibold mb-1">
                  <ChevronLeft className="w-3.5 h-3.5" /> Navigation Hub
                </button>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <Package className="w-6 h-6 text-purple-400" /> Available Crayfish Catalog
                </h2>
              </div>
              <button onClick={() => setCurrentScreen('addCrayfishForm')} className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition">
                + Add New Crayfish Variety
              </button>
            </div>

            {inventory.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
                Catalog is currently empty.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {inventory.map((item) => (
                  <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between">
                    <div>
                      <div className="h-48 w-full bg-slate-950 relative overflow-hidden">
                        <img src={item.imageUri} alt={item.name} className="w-full h-full object-cover" />
                        <button onClick={() => handleDeleteCrayfish(item.id)} className="absolute top-3 right-3 bg-slate-900/80 hover:bg-red-500 text-slate-300 hover:text-white p-2 rounded-lg transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <span className="absolute bottom-3 left-3 bg-slate-950/80 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-md border border-slate-800">
                          Stock: {item.stockCount} units
                        </span>
                      </div>
                      <div className="p-5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 italic">{item.species}</span>
                        <h3 className="text-lg font-extrabold text-white mt-0.5 mb-2">{item.name}</h3>
                        <p className="text-slate-300 text-xs leading-relaxed">{item.definition}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 9. ADD CRAYFISH FORM SCREEN */}
        {currentScreen === 'addCrayfishForm' && (
          <div className="max-w-xl mx-auto space-y-6">
            <button onClick={() => setCurrentScreen('crayfishList')} className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-semibold">
              <ChevronLeft className="w-4 h-4" /> Back to Catalog
            </button>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4">Add Crayfish to Catalog</h2>
              <form onSubmit={handleSaveCrayfish} className="space-y-4">
                <input
                  type="text"
                  required
                  placeholder="Variety Name (e.g. Electric Blue)"
                  value={crayfishName}
                  onChange={(e) => setCrayfishName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Species (e.g. Procambarus alleni)"
                  value={crayfishSpecies}
                  onChange={(e) => setCrayfishSpecies(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none"
                />
                <input
                  type="number"
                  min="0"
                  value={crayfishStock}
                  onChange={(e) => setCrayfishStock(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none"
                />
                <textarea
                  rows={3}
                  required
                  placeholder="Description & care notes..."
                  value={crayfishDefinition}
                  onChange={(e) => setCrayfishDefinition(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm resize-none focus:outline-none"
                />
                <button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3.5 rounded-xl text-sm transition">
                  Save Crayfish Entry
                </button>
              </form>
            </div>
          </div>
        )}

      </main>

      <footer className="border-t border-slate-800 bg-slate-900 py-6 text-center text-xs text-slate-500">
        <p>© Rom's Crayfish Hub Management System • All sales & breeding data persisted locally</p>
      </footer>
    </div>
  );
}
