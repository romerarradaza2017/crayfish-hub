import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  ChevronLeft,
  ShoppingBag,
  Package,
  TrendingUp,
  Trash2,
  X,
  Layers,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Heart,
  CheckCircle,
  Edit3
} from 'lucide-react';

const SALES_STORAGE_KEY = 'roms_crayfish_sales_v4';
const INVENTORY_STORAGE_KEY = 'roms_crayfish_inventory_v4';
const BREEDING_STORAGE_KEY = 'roms_crayfish_breeding_v4';

const INITIAL_SALES = [
  { id: '1', buyerName: 'Juan Dela Cruz', date: new Date().toISOString().split('T')[0], totalPrice: '1200.00' },
  { id: '2', buyerName: 'Maria Santos', date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], totalPrice: '2500.00' },
];

const INITIAL_INVENTORY = [
  {
    id: '101',
    name: 'Electric Blue Crayfish',
    species: 'Procambarus alleni',
    definition: 'Vibrant sky-blue freshwater crayfish. Reaches 4-5 inches.',
    imageUri: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=600&q=80',
    stockCount: 15,
  },
  {
    id: '102',
    name: 'Red Claw Crayfish',
    species: 'Cherax quadricarinatus',
    definition: 'Tropical Australian species with distinctive red patch on male claws.',
    imageUri: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    stockCount: 8,
  },
];

const INITIAL_BREEDING = [
  {
    id: 'b1',
    species: 'Clarkii',
    description: 'Carrying green eggs under tail, active in cave setup.',
    berriedDate: new Date(Date.now() - 86400000 * 12).toISOString().split('T')[0],
    imageUri: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=600&q=80',
    status: 'active',
    failReason: '',
  },
  {
    id: 'b2',
    species: 'Australian Red Claw',
    description: 'First time berried female in tank 3.',
    berriedDate: new Date(Date.now() - 86400000 * 35).toISOString().split('T')[0],
    imageUri: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    status: 'hatched',
    failReason: '',
  }
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('navHub');
  const [toastMessage, setToastMessage] = useState(null);

  // Sales state
  const [sales, setSales] = useState([]);
  const [buyerName, setBuyerName] = useState('');
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalPrice, setTotalPrice] = useState('');
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState('monthly');

  // Inventory state
  const [inventory, setInventory] = useState([]);
  const [crayfishName, setCrayfishName] = useState('');
  const [crayfishSpecies, setCrayfishSpecies] = useState('');
  const [crayfishDefinition, setCrayfishDefinition] = useState('');
  const [crayfishStock, setCrayfishStock] = useState('10');
  const [crayfishImage, setCrayfishImage] = useState('');

  // Breeding & Berried State
  const [breedingList, setBreedingList] = useState([]);
  const [breedSpecies, setBreedSpecies] = useState('Clarkii');
  const [breedDescription, setBreedDescription] = useState('');
  const [breedDate, setBreedDate] = useState(new Date().toISOString().split('T')[0]);
  const [breedImage, setBreedImage] = useState('');
  
  // Edit / Modal State for Breeding Entry
  const [editingBreedId, setEditingBreedId] = useState(null);
  const [statusModalItem, setStatusModalItem] = useState(null);
  const [modalNewStatus, setModalNewStatus] = useState('hatched');
  const [modalFailReason, setModalFailReason] = useState('');

  useEffect(() => {
    try {
      const savedSales = localStorage.getItem(SALES_STORAGE_KEY);
      if (savedSales) setSales(JSON.parse(savedSales));
      else { setSales(INITIAL_SALES); localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify(INITIAL_SALES)); }

      const savedInventory = localStorage.getItem(INVENTORY_STORAGE_KEY);
      if (savedInventory) setInventory(JSON.parse(savedInventory));
      else { setInventory(INITIAL_INVENTORY); localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(INITIAL_INVENTORY)); }

      const savedBreeding = localStorage.getItem(BREEDING_STORAGE_KEY);
      if (savedBreeding) setBreedingList(JSON.parse(savedBreeding));
      else { setBreedingList(INITIAL_BREEDING); localStorage.setItem(BREEDING_STORAGE_KEY, JSON.stringify(INITIAL_BREEDING)); }
    } catch (e) {
      console.error('Error loading storage:', e);
    }
  }, []);

  const saveSales = (updated) => { setSales(updated); localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify(updated)); };
  const saveInventory = (updated) => { setInventory(updated); localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(updated)); };
  const saveBreeding = (updated) => { setBreedingList(updated); localStorage.setItem(BREEDING_STORAGE_KEY, JSON.stringify(updated)); };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getIncubationDetails = (species, berriedDateStr) => {
    const berriedDate = new Date(berriedDateStr);
    const now = new Date();
    const diffDays = Math.floor((now - berriedDate) / (1000 * 60 * 60 * 24));
    
    const isClarkii = species.toLowerCase().includes('clarkii');
    const targetDays = isClarkii ? 21 : 49;
    const daysRemaining = targetDays - diffDays;
    const aboutToHatch = daysRemaining <= 3 && daysRemaining >= 0;

    return {
      diffDays: Math.max(0, diffDays),
      targetDays,
      daysRemaining,
      aboutToHatch,
      isClarkii
    };
  };

  const breedingAnalytics = useMemo(() => {
    const total = breedingList.length;
    const active = breedingList.filter(b => b.status === 'active').length;
    const hatched = breedingList.filter(b => b.status === 'hatched').length;
    const failed = breedingList.filter(b => b.status === 'failed').length;
    const completed = hatched + failed;
    const successRate = completed > 0 ? Math.round((hatched / completed) * 100) : 0;

    return { total, active, hatched, failed, successRate };
  }, [breedingList]);

  const handleSaveBreeding = (e) => {
    if (e) e.preventDefault();
    if (!breedDescription.trim() || !breedDate) {
      showToast('❌ Please provide description and berried date');
      return;
    }

    if (editingBreedId) {
      const updated = breedingList.map(item => item.id === editingBreedId ? {
        ...item,
        species: breedSpecies,
        description: breedDescription.trim(),
        berriedDate: breedDate,
        imageUri: breedImage || item.imageUri
      } : item);
      saveBreeding(updated);
      setEditingBreedId(null);
      showToast('✅ Berried female record updated!');
    } else {
      const newItem = {
        id: Date.now().toString(),
        species: breedSpecies,
        description: breedDescription.trim(),
        berriedDate: breedDate,
        imageUri: breedImage || 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=600&q=80',
        status: 'active',
        failReason: ''
      };
      saveBreeding([newItem, ...breedingList]);
      showToast('✅ Berried female successfully logged!');
    }

    setBreedDescription('');
    setBreedDate(new Date().toISOString().split('T')[0]);
    setBreedImage('');
    setCurrentScreen('breedingList');
  };

  const handleEditBreedSetup = (item) => {
    setEditingBreedId(item.id);
    setBreedSpecies(item.species);
    setBreedDescription(item.description);
    setBreedDate(item.berriedDate);
    setBreedImage(item.imageUri);
    setCurrentScreen('addBreedingForm');
  };

  const handleDeleteBreed = (id) => {
    if (window.confirm('Delete this berried crayfish entry?')) {
      saveBreeding(breedingList.filter(i => i.id !== id));
      showToast('🗑️ Entry removed');
    }
  };

  const handleUpdateStatusSubmit = (e) => {
    if (e) e.preventDefault();
    if (!statusModalItem) return;

    const updated = breedingList.map(item => item.id === statusModalItem.id ? {
      ...item,
      status: modalNewStatus,
      failReason: modalNewStatus === 'failed' ? modalFailReason : ''
    } : item);

    saveBreeding(updated);
    setStatusModalItem(null);
    setModalFailReason('');
    showToast(`✅ Status updated to ${modalNewStatus.toUpperCase()}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-4 py-3 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentScreen('navHub')}>
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

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentScreen('breedingList')}
              className="flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 px-3.5 py-2 rounded-lg transition text-xs font-bold"
            >
              <Heart className="w-4 h-4 fill-rose-500/20" /> Berried & Hatching
            </button>
            <button
              onClick={() => setCurrentScreen('navHub')}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 px-3.5 py-2 rounded-lg border border-slate-700 transition text-xs font-bold"
            >
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">Nav Hub</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* 1. NAVIGATION HUB */}
        {currentScreen === 'navHub' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-850 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="max-w-2xl relative z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Farm Portal
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                  Welcome Back, Rom! 👋
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                  Track sales performance, inventory catalog, and monitor berried female crayfish incubation and hatching success rates in real-time.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setCurrentScreen('addBreedingForm')}
                    className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-bold px-5 py-2.5 rounded-xl transition shadow-lg shadow-rose-500/25 text-sm"
                  >
                    <Heart className="w-4 h-4 fill-white" /> Log Berried Female
                  </button>
                  <button
                    onClick={() => setCurrentScreen('salesForm')}
                    className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition text-sm"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" /> Record New Sale
                  </button>
                </div>
              </div>
            </div>

            {/* Stat Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Berried</p>
                  <p className="text-2xl font-black text-rose-400 mt-1">{breedingAnalytics.active}</p>
                </div>
                <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-xl flex items-center justify-center border border-rose-500/20">
                  <Heart className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Hatching Success</p>
                  <p className="text-2xl font-black text-emerald-400 mt-1">{breedingAnalytics.successRate}%</p>
                </div>
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-500/20">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Sales Records</p>
                  <p className="text-2xl font-black text-white mt-1">{sales.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center border border-blue-500/20">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Catalog Varieties</p>
                  <p className="text-2xl font-black text-white mt-1">{inventory.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center border border-purple-500/20">
                  <Package className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Navigation Cards Grid */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                Farm Management Modules
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  onClick={() => setCurrentScreen('breedingList')}
                  className="group bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-rose-500/50 p-6 rounded-2xl transition cursor-pointer shadow-lg"
                >
                  <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20 mb-4 group-hover:scale-110 transition">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-white group-hover:text-rose-400 transition">
                    Berried & Hatching Tracker
                  </h4>
                  <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                    Monitor berried females, incubation countdowns, hatching success rates, and log failure reasons.
                  </p>
                </div>

                <div
                  onClick={() => setCurrentScreen('salesDashboard')}
                  className="group bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 p-6 rounded-2xl transition cursor-pointer shadow-lg"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 mb-4 group-hover:scale-110 transition">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-white group-hover:text-amber-400 transition">
                    Sales Dashboard
                  </h4>
                  <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                    View daily, weekly, monthly, and all-time financial revenue analytics.
                  </p>
                </div>

                <div
                  onClick={() => setCurrentScreen('crayfishList')}
                  className="group bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/50 p-6 rounded-2xl transition cursor-pointer shadow-lg"
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 mb-4 group-hover:scale-110 transition">
                    <Package className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-white group-hover:text-purple-400 transition">
                    Crayfish Inventory Catalog
                  </h4>
                  <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                    Manage stock varieties, species definitions, photo uploads, and counts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. BREEDING & HATCHING TRACKER SCREEN */}
        {currentScreen === 'breedingList' && (
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
                  <Heart className="w-6 h-6 text-rose-400 fill-rose-500/20" /> Berried & Hatching Tracker
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Monitor incubation progress (Clarkii: 3 weeks | Australian Red Claw: 6-8 weeks)
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
                className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-bold px-4 py-2.5 rounded-xl transition text-xs shadow-md shadow-rose-500/20"
              >
                <Plus className="w-4 h-4 stroke-[3]" /> Add Berried Female
              </button>
            </div>

            {/* Breeding Success Metrics Header */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Tracked</span>
                <p className="text-2xl font-black text-white mt-1">{breedingAnalytics.total}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <span className="text-[10px] uppercase font-bold text-rose-400">Active Berried</span>
                <p className="text-2xl font-black text-rose-400 mt-1">{breedingAnalytics.active}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <span className="text-[10px] uppercase font-bold text-emerald-400">Successfully Hatched</span>
                <p className="text-2xl font-black text-emerald-400 mt-1">{breedingAnalytics.hatched}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <span className="text-[10px] uppercase font-bold text-amber-400">Hatching Success Rate</span>
                <p className="text-2xl font-black text-amber-400 mt-1">{breedingAnalytics.successRate}%</p>
              </div>
            </div>

            {/* Breeding List Cards */}
            {breedingList.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
                <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-300">No Berried Females Logged</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">Start tracking berried crayfish to monitor incubation timelines.</p>
                <button
                  onClick={() => setCurrentScreen('addBreedingForm')}
                  className="bg-rose-500 text-white font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Log First Berried Female
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {breedingList.map((item) => {
                  const incubation = getIncubationDetails(item.species, item.berriedDate);
                  return (
                    <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between">
                      <div>
                        <div className="h-48 w-full bg-slate-950 relative overflow-hidden">
                          <img src={item.imageUri} alt={item.species} className="w-full h-full object-cover" />
                          <div className="absolute top-3 left-3 flex gap-2">
                            <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                              item.status === 'active' ? 'bg-rose-500/90 text-white' :
                              item.status === 'hatched' ? 'bg-emerald-500/90 text-slate-950' : 'bg-red-500/90 text-white'
                            }`}>
                              {item.status.toUpperCase()}
                            </span>
                            {incubation.aboutToHatch && item.status === 'active' && (
                              <span className="bg-amber-500 text-slate-950 text-xs font-black px-2.5 py-1 rounded-full animate-pulse">
                                ⚠️ About to Hatch!
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteBreed(item.id)}
                            className="absolute top-3 right-3 bg-slate-950/80 hover:bg-red-500 text-slate-300 hover:text-white p-2 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="p-5 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">
                              {item.species}
                            </span>
                            <span className="text-xs font-mono text-slate-400">
                              Berried: {item.berriedDate}
                            </span>
                          </div>

                          <p className="text-slate-300 text-xs leading-relaxed">
                            {item.description}
                          </p>

                          {item.status === 'active' && (
                            <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs">
                              <div>
                                <span className="text-slate-400 block">Incubation Progress</span>
                                <strong className="text-white font-mono">{incubation.diffDays} days berried</strong>
                              </div>
                              <div className="text-right">
                                <span className="text-slate-400 block">Est. Timeframe</span>
                                <strong className={`font-mono ${incubation.daysRemaining <= 3 ? 'text-amber-400 font-black' : 'text-emerald-400'}`}>
                                  {incubation.daysRemaining > 0 ? `${incubation.daysRemaining} days left` : 'Hatching due now!'}
                                </strong>
                              </div>
                            </div>
                          )}

                          {item.status === 'failed' && item.failReason && (
                            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-xs text-red-300">
                              <strong>Failure Reason:</strong> {item.failReason}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-4 bg-slate-950/50 border-t border-slate-800 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleEditBreedSetup(item)}
                          className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit Details
                        </button>
                        <button
                          onClick={() => {
                            setStatusModalItem(item);
                            setModalNewStatus(item.status === 'failed' ? 'hatched' : item.status);
                            setModalFailReason(item.failReason || '');
                          }}
                          className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Update Status
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 3. ADD / EDIT BREEDING ENTRY FORM */}
        {currentScreen === 'addBreedingForm' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentScreen('breedingList')}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-semibold"
              >
                <ChevronLeft className="w-4 h-4" /> Back to Tracker
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                  <Heart className="w-5 h-5 fill-rose-500/20" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {editingBreedId ? 'Edit Berried Female Record' : 'Add Berried Female Crayfish'}
                  </h2>
                  <p className="text-xs text-slate-400">Log species and berried incubation details</p>
                </div>
              </div>

              <form onSubmit={handleSaveBreeding} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Species Selection
                  </label>
                  <select
                    value={breedSpecies}
                    onChange={(e) => setBreedSpecies(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-xl px-4 py-3 text-white focus:outline-none transition text-sm"
                  >
                    <option value="Clarkii">Clarkii (~3 weeks incubation)</option>
                    <option value="Australian Red Claw">Australian Red Claw (~6-8 weeks incubation)</option>
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
                    className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-xl px-4 py-3 text-white focus:outline-none transition text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Description & Tank Notes
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Enter egg color, tank number, female size, or water parameters..."
                    value={breedDescription}
                    onChange={(e) => setBreedDescription(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none transition text-sm resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Upload Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setBreedImage(reader.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-500/10 file:text-rose-400 hover:file:bg-rose-500/20 cursor-pointer"
                  />
                  {breedImage && (
                    <div className="mt-3 relative rounded-xl overflow-hidden h-36 border border-slate-800">
                      <img src={breedImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-rose-500/20 text-sm flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Save Berried Record
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentScreen('breedingList')}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-5 py-3.5 rounded-xl transition text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
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
                <p className="text-xs text-slate-400 mt-0.5">Analyze farm revenue performance over key periods</p>
              </div>
              <button
                onClick={() => setCurrentScreen('salesForm')}
                className="bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> New Sale
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
                    analyticsTimeframe === tab.id
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Revenue</span>
                <p className="text-2xl font-black text-emerald-400 mt-2">
                  ₱{sales.reduce((sum, item) => sum + parseFloat(item.totalPrice || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Transactions</span>
                <p className="text-2xl font-black text-white mt-2">{sales.length}</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">Recent Sales Ledger</h3>
              <div className="space-y-2">
                {sales.map((item) => (
                  <div key={item.id} className="bg-slate-950 p-3.5 rounded-xl flex items-center justify-between border border-slate-800">
                    <div>
                      <p className="text-sm font-bold text-white">{item.buyerName}</p>
                      <p className="text-xs text-slate-400">📅 {item.date}</p>
                    </div>
                    <span className="text-base font-black text-emerald-400">₱{parseFloat(item.totalPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. CRAYFISH CATALOG INVENTORY */}
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
                  <Package className="w-6 h-6 text-purple-400" /> Crayfish Catalog
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {inventory.map((item) => (
                <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="h-48 w-full bg-slate-950 relative">
                    <img src={item.imageUri} alt={item.name} className="w-full h-full object-cover" />
                    <span className="absolute bottom-3 left-3 bg-slate-950/90 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-md border border-slate-800">
                      Stock: {item.stockCount} units
                    </span>
                  </div>
                  <div className="p-5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">{item.species}</span>
                    <h3 className="text-lg font-extrabold text-white mt-0.5 mb-2">{item.name}</h3>
                    <p className="text-slate-300 text-xs leading-relaxed">{item.definition}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. ENTER SALE FORM */}
        {currentScreen === 'salesForm' && (
          <div className="max-w-xl mx-auto space-y-6">
            <button
              onClick={() => setCurrentScreen('navHub')}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-semibold"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Nav Hub
            </button>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4">Record New Crayfish Sale</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!buyerName.trim() || !totalPrice) return;
                const newSale = { id: Date.now().toString(), buyerName: buyerName.trim(), date: saleDate, totalPrice: parseFloat(totalPrice).toFixed(2) };
                saveSales([newSale, ...sales]);
                setBuyerName('');
                setTotalPrice('');
                showToast('✅ Sale recorded!');
                setCurrentScreen('salesDashboard');
              }} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Buyer Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Juan Dela Cruz"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Sale Date</label>
                  <input
                    type="date"
                    required
                    value={saleDate}
                    onChange={(e) => setSaleDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Total Price (₱ PHP)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={totalPrice}
                    onChange={(e) => setTotalPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none"
                  />
                </div>
                <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3.5 rounded-xl">
                  Save Sale Record
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Status Update Modal for Berried Female */}
      {statusModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Update Incubation Status</h3>
            <p className="text-xs text-slate-400">Mark whether this berried crayfish successfully hatched or failed.</p>

            <form onSubmit={handleUpdateStatusSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Status Outcome</label>
                <select
                  value={modalNewStatus}
                  onChange={(e) => setModalNewStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm"
                >
                  <option value="active">Active (Still Berried)</option>
                  <option value="hatched">Successfully Hatched 🎉</option>
                  <option value="failed">Failed / Dropped Eggs ❌</option>
                </select>
              </div>

              {modalNewStatus === 'failed' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Failure Reason</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Specify reason (e.g. poor water parameters, stress, fungal infection, dropped eggs)..."
                    value={modalFailReason}
                    onChange={(e) => setModalFailReason(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm resize-none"
                  />
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 rounded-xl text-sm"
                >
                  Save Status
                </button>
                <button
                  type="button"
                  onClick={() => setStatusModalItem(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-3 rounded-xl text-sm font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>© Rom's Crayfish Hub Management System • All records persisted locally</p>
      </footer>
    </div>
  );
}
