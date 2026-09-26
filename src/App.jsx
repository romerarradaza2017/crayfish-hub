import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  ChevronLeft,
  ShoppingBag,
  Package,
  Trash2,
  Heart,
  CheckCircle,
  Edit3,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  Layers
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

  // Breeding & Berried State
  const [breedingList, setBreedingList] = useState([]);
  const [breedSpecies, setBreedSpecies] = useState('Clarkii');
  const [breedDescription, setBreedDescription] = useState('');
  const [breedDate, setBreedDate] = useState(new Date().toISOString().split('T')[0]);
  const [breedImage, setBreedImage] = useState('');
  
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
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
      {toastMessage && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 50, backgroundColor: '#0f172a', border: '1px solid #334155', color: '#ffffff', padding: '12px 16px', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)', fontWeight: 'bold' }}>
          {toastMessage}
        </div>
      )}

      {/* Top Navbar */}
      <header style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #1e293b', position: 'sticky', top: 0, zIndex: 40, padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setCurrentScreen('navHub')}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(to top right, #10b981, #2dd4bf)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
            🦐
          </div>
          <div>
            <span style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.05em', color: '#34d399', textTransform: 'uppercase', display: 'block' }}>
              Crayfish Farm Hub
            </span>
            <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              Rom's Crayfish Hub
            </h1>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setCurrentScreen('breedingList')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(244, 63, 94, 0.1)', color: '#fb7185', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
          >
            <Heart size={14} /> Berried & Hatching
          </button>
          <button
            onClick={() => setCurrentScreen('navHub')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#1e293b', color: '#34d399', padding: '8px 14px', borderRadius: '8px', border: '1px solid #334155', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
          >
            <Layers size={14} /> Nav Hub
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ flex: 1, maxWidth: '1150px', width: '100%', margin: '0 auto', padding: '24px', boxSizing: 'border-box' }}>
        
        {/* 1. NAVIGATION HUB */}
        {currentScreen === 'navHub' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: 'linear-gradient(to bottom right, #0f172a, #1e293b)', border: '1px solid #334155', borderRadius: '16px', padding: '32px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ maxWidth: '650px' }}>
                <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600, backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.2)', marginBottom: '16px' }}>
                  ● Live Farm Portal
                </span>
                <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#ffffff', margin: '0 0 8px 0' }}>
                  Welcome Back, Rom! 👋
                </h2>
                <p style={{ color: '#cbd5e1', fontSize: '15px', lineHeight: 1.6, margin: '0 0 24px 0' }}>
                  Track sales performance, inventory catalog, and monitor berried female crayfish incubation and hatching success rates in real-time.
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setCurrentScreen('addBreedingForm')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#f43f5e', color: '#ffffff', fontWeight: 'bold', padding: '12px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '14px', boxShadow: '0 10px 15px -3px rgba(244, 63, 94, 0.3)' }}
                  >
                    <Heart size={16} /> Log Berried Female
                  </button>
                  <button
                    onClick={() => setCurrentScreen('salesForm')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#10b981', color: '#020617', fontWeight: 'bold', padding: '12px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                  >
                    <Plus size={16} /> Record New Sale
                  </button>
                </div>
              </div>
            </div>

            {/* Stat Summary Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', margin: 0 }}>Active Berried</p>
                  <p style={{ fontSize: '26px', fontWeight: 900, color: '#fb7185', margin: '4px 0 0 0' }}>{breedingAnalytics.active}</p>
                </div>
                <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(244, 63, 94, 0.1)', color: '#fb7185', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                  <Heart size={22} />
                </div>
              </div>

              <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', margin: 0 }}>Hatching Success</p>
                  <p style={{ fontSize: '26px', fontWeight: 900, color: '#34d399', margin: '4px 0 0 0' }}>{breedingAnalytics.successRate}%</p>
                </div>
                <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#34d399', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <CheckCircle size={22} />
                </div>
              </div>

              <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', margin: 0 }}>Sales Records</p>
                  <p style={{ fontSize: '26px', fontWeight: 900, color: '#ffffff', margin: '4px 0 0 0' }}>{sales.length}</p>
                </div>
                <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                  <ShoppingBag size={22} />
                </div>
              </div>

              <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', margin: 0 }}>Catalog Varieties</p>
                  <p style={{ fontSize: '26px', fontWeight: 900, color: '#ffffff', margin: '4px 0 0 0' }}>{inventory.length}</p>
                </div>
                <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(168, 85, 247, 0.1)', color: '#c084fc', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                  <Package size={22} />
                </div>
              </div>
            </div>

            {/* Navigation Cards Grid */}
            <div>
              <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                Farm Management Modules
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                <div
                  onClick={() => setCurrentScreen('breedingList')}
                  style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '24px', borderRadius: '16px', cursor: 'pointer', transition: 'border-color 0.2s' }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(244, 63, 94, 0.1)', color: '#fb7185', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(244, 63, 94, 0.2)', marginBottom: '16px' }}>
                    <Heart size={24} />
                  </div>
                  <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 8px 0' }}>
                    Berried & Hatching Tracker
                  </h4>
                  <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.5, margin: 0 }}>
                    Monitor berried females, incubation countdowns, hatching success rates, and log failure reasons.
                  </p>
                </div>

                <div
                  onClick={() => setCurrentScreen('salesDashboard')}
                  style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '24px', borderRadius: '16px', cursor: 'pointer' }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(245, 158, 11, 0.2)', marginBottom: '16px' }}>
                    <BarChart3 size={24} />
                  </div>
                  <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 8px 0' }}>
                    Sales Dashboard
                  </h4>
                  <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.5, margin: 0 }}>
                    View daily, weekly, monthly, and all-time financial revenue analytics.
                  </p>
                </div>

                <div
                  onClick={() => setCurrentScreen('crayfishList')}
                  style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '24px', borderRadius: '16px', cursor: 'pointer' }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(168, 85, 247, 0.1)', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(168, 85, 247, 0.2)', marginBottom: '16px' }}>
                    <Package size={24} />
                  </div>
                  <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 8px 0' }}>
                    Crayfish Inventory Catalog
                  </h4>
                  <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.5, margin: 0 }}>
                    Manage stock varieties, species definitions, photo uploads, and counts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. BREEDING & HATCHING TRACKER SCREEN */}
        {currentScreen === 'breedingList' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <button
                  onClick={() => setCurrentScreen('navHub')}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, padding: 0, marginBottom: '4px' }}
                >
                  <ChevronLeft size={14} /> Navigation Hub
                </button>
                <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Heart size={24} color="#fb7185" /> Berried & Hatching Tracker
                </h2>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0' }}>
                  Incubation Timelines: Clarkii (3 weeks) | Australian Red Claw (6-8 weeks)
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
                style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f43f5e', color: '#ffffff', fontWeight: 'bold', padding: '10px 18px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '12px' }}
              >
                <Plus size={16} /> Add Berried Female
              </button>
            </div>

            {/* Metrics Header */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '16px', borderRadius: '16px' }}>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', color: '#94a3b8' }}>Total Tracked</span>
                <p style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', margin: '4px 0 0 0' }}>{breedingAnalytics.total}</p>
              </div>
              <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '16px', borderRadius: '16px' }}>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', color: '#fb7185' }}>Active Berried</span>
                <p style={{ fontSize: '24px', fontWeight: 900, color: '#fb7185', margin: '4px 0 0 0' }}>{breedingAnalytics.active}</p>
              </div>
              <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '16px', borderRadius: '16px' }}>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', color: '#34d399' }}>Successfully Hatched</span>
                <p style={{ fontSize: '24px', fontWeight: 900, color: '#34d399', margin: '4px 0 0 0' }}>{breedingAnalytics.hatched}</p>
              </div>
              <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '16px', borderRadius: '16px' }}>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', color: '#fbbf24' }}>Success Rate</span>
                <p style={{ fontSize: '24px', fontWeight: 900, color: '#fbbf24', margin: '4px 0 0 0' }}>{breedingAnalytics.successRate}%</p>
              </div>
            </div>

            {/* Cards Grid */}
            {breedingList.length === 0 ? (
              <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '48px', textAlign: 'center' }}>
                <AlertCircle size={48} color="#64748b" style={{ margin: '0 auto 12px auto' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#cbd5e1', margin: 0 }}>No Berried Females Logged</h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '8px 0 16px 0' }}>Start tracking berried crayfish to monitor incubation timelines.</p>
                <button
                  onClick={() => setCurrentScreen('addBreedingForm')}
                  style={{ backgroundColor: '#f43f5e', color: '#ffffff', fontWeight: 'bold', padding: '10px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '12px' }}
                >
                  Log First Berried Female
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                {breedingList.map((item) => {
                  const incubation = getIncubationDetails(item.species, item.berriedDate);
                  return (
                    <div key={item.id} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ height: '200px', width: '100%', backgroundColor: '#020617', position: 'relative' }}>
                          <img src={item.imageUri} alt={item.species} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '9999px', textTransform: 'uppercase', backgroundColor: item.status === 'active' ? '#f43f5e' : item.status === 'hatched' ? '#10b981' : '#ef4444', color: item.status === 'hatched' ? '#020617' : '#ffffff' }}>
                              {item.status}
                            </span>
                            {incubation.aboutToHatch && item.status === 'active' && (
                              <span style={{ backgroundColor: '#f59e0b', color: '#020617', fontSize: '11px', fontWeight: 900, padding: '4px 10px', borderRadius: '9999px' }}>
                                ⚠️ About to Hatch!
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteBreed(item.id)}
                            style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(2, 6, 23, 0.8)', border: 'none', color: '#cbd5e1', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#fb7185', textTransform: 'uppercase' }}>
                              {item.species}
                            </span>
                            <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#94a3b8' }}>
                              Berried: {item.berriedDate}
                            </span>
                          </div>

                          <p style={{ color: '#cbd5e1', fontSize: '13px', lineHeight: 1.5, margin: 0 }}>
                            {item.description}
                          </p>

                          {item.status === 'active' && (
                            <div style={{ backgroundColor: '#020617', border: '1px solid #1e293b', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                              <div>
                                <span style={{ color: '#94a3b8', display: 'block' }}>Incubation Progress</span>
                                <strong style={{ color: '#ffffff', fontFamily: 'monospace' }}>{incubation.diffDays} days berried</strong>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <span style={{ color: '#94a3b8', display: 'block' }}>Timeframe</span>
                                <strong style={{ fontFamily: 'monospace', color: incubation.daysRemaining <= 3 ? '#fbbf24' : '#34d399' }}>
                                  {incubation.daysRemaining > 0 ? `${incubation.daysRemaining} days left` : 'Due now!'}
                                </strong>
                              </div>
                            </div>
                          )}

                          {item.status === 'failed' && item.failReason && (
                            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '10px', borderRadius: '10px', fontSize: '12px', color: '#fca5a5' }}>
                              <strong>Failure Reason:</strong> {item.failReason}
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ padding: '16px', backgroundColor: 'rgba(2, 6, 23, 0.5)', borderTop: '1px solid #1e293b', display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleEditBreedSetup(item)}
                          style={{ flex: 1, backgroundColor: '#1e293b', border: 'none', color: '#e2e8f0', fontWeight: 'bold', padding: '8px', borderRadius: '10px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                        >
                          <Edit3 size={14} /> Edit
                        </button>
                        <button
                          onClick={() => {
                            setStatusModalItem(item);
                            setModalNewStatus(item.status === 'failed' ? 'hatched' : item.status);
                            setModalFailReason(item.failReason || '');
                          }}
                          style={{ flex: 1, backgroundColor: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', fontWeight: 'bold', padding: '8px', borderRadius: '10px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                        >
                          <CheckCircle size={14} /> Status
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 3. ADD / EDIT BREEDING FORM */}
        {currentScreen === 'addBreedingForm' && (
          <div style={{ maxWidth: '550px', margin: '0 auto' }}>
            <button
              onClick={() => setCurrentScreen('breedingList')}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600, padding: 0, marginBottom: '16px' }}
            >
              <ChevronLeft size={16} /> Back to Tracker
            </button>

            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #1e293b' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(244, 63, 94, 0.1)', color: '#fb7185', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                  <Heart size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>
                    {editingBreedId ? 'Edit Berried Record' : 'Log Berried Female'}
                  </h2>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0 0' }}>Specify incubation parameters</p>
                </div>
              </div>

              <form onSubmit={handleSaveBreeding} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#cbd5e1', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Species Selection
                  </label>
                  <select
                    value={breedSpecies}
                    onChange={(e) => setBreedSpecies(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '12px', padding: '12px', color: '#ffffff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  >
                    <option value="Clarkii">Clarkii (~3 weeks incubation)</option>
                    <option value="Australian Red Claw">Australian Red Claw (~6-8 weeks incubation)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#cbd5e1', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Berried Date
                  </label>
                  <input
                    type="date"
                    required
                    value={breedDate}
                    onChange={(e) => setBreedDate(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '12px', padding: '12px', color: '#ffffff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#cbd5e1', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Description & Tank Notes
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Enter egg color, tank number, or water parameters..."
                    value={breedDescription}
                    onChange={(e) => setBreedDescription(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '12px', padding: '12px', color: '#ffffff', fontSize: '14px', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#cbd5e1', textTransform: 'uppercase', marginBottom: '8px' }}>
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
                    style={{ width: '100%', fontSize: '12px', color: '#94a3b8' }}
                  />
                  {breedImage && (
                    <div style={{ marginTop: '12px', borderRadius: '12px', overflow: 'hidden', height: '140px', border: '1px solid #334155' }}>
                      <img src={breedImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '12px', paddingTop: '12px' }}>
                  <button
                    type="submit"
                    style={{ flex: 1, backgroundColor: '#f43f5e', color: '#ffffff', fontWeight: 'bold', padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                  >
                    Save Berried Record
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentScreen('breedingList')}
                    style={{ backgroundColor: '#1e293b', color: '#cbd5e1', fontWeight: 'bold', padding: '14px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '14px' }}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <button
                  onClick={() => setCurrentScreen('navHub')}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, padding: 0, marginBottom: '4px' }}
                >
                  <ChevronLeft size={14} /> Navigation Hub
                </button>
                <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BarChart3 size={24} color="#fbbf24" /> Sales Analytics Dashboard
                </h2>
              </div>
              <button
                onClick={() => setCurrentScreen('salesForm')}
                style={{ backgroundColor: '#10b981', color: '#020617', fontWeight: 'bold', padding: '10px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '12px' }}
              >
                + New Sale
              </button>
            </div>

            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '6px', borderRadius: '16px', display: 'flex', gap: '4px' }}>
              {[
                { id: 'daily', label: 'Daily (Today)' },
                { id: 'weekly', label: '7 Days' },
                { id: 'monthly', label: '30 Days' },
                { id: 'all', label: 'All Time' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setAnalyticsTimeframe(tab.id)}
                  style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', backgroundColor: analyticsTimeframe === tab.id ? '#fbbf24' : 'transparent', color: analyticsTimeframe === tab.id ? '#020617' : '#94a3b8' }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '20px', borderRadius: '16px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase' }}>Revenue</span>
                <p style={{ fontSize: '26px', fontWeight: 900, color: '#34d399', margin: '6px 0 0 0' }}>
                  ₱{sales.reduce((sum, item) => sum + parseFloat(item.totalPrice || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '20px', borderRadius: '16px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase' }}>Transactions</span>
                <p style={{ fontSize: '26px', fontWeight: 900, color: '#ffffff', margin: '6px 0 0 0' }}>{sales.length}</p>
              </div>
            </div>

            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 16px 0' }}>Recent Sales Ledger</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {sales.map((item) => (
                  <div key={item.id} style={{ backgroundColor: '#020617', padding: '14px 18px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #1e293b' }}>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>{item.buyerName}</p>
                      <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0 0' }}>📅 {item.date}</p>
                    </div>
                    <span style={{ fontSize: '16px', fontWeight: 900, color: '#34d399' }}>₱{parseFloat(item.totalPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. CRAYFISH CATALOG INVENTORY */}
        {currentScreen === 'crayfishList' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <button
                  onClick={() => setCurrentScreen('navHub')}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, padding: 0, marginBottom: '4px' }}
                >
                  <ChevronLeft size={14} /> Navigation Hub
                </button>
                <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', margin: 0 }}>Crayfish Catalog</h2>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {inventory.map((item) => (
                <div key={item.id} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', overflow: 'hidden' }}>
                  <div style={{ height: '180px', width: '100%', backgroundColor: '#020617', position: 'relative' }}>
                    <img src={item.imageUri} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', bottom: '12px', left: '12px', backgroundColor: 'rgba(2, 6, 23, 0.9)', color: '#34d399', fontSize: '11px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                      Stock: {item.stockCount} units
                    </span>
                  </div>
                  <div style={{ padding: '20px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', color: '#c084fc' }}>{item.species}</span>
                    <h3 style={{ fontSize: '16px', fontWeight: 'extrabold', color: '#ffffff', margin: '4px 0 8px 0' }}>{item.name}</h3>
                    <p style={{ color: '#cbd5e1', fontSize: '12px', lineHeight: 1.5, margin: 0 }}>{item.definition}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. ENTER SALE FORM */}
        {currentScreen === 'salesForm' && (
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <button
              onClick={() => setCurrentScreen('navHub')}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600, padding: 0, marginBottom: '16px' }}
            >
              <ChevronLeft size={16} /> Back to Nav Hub
            </button>
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '32px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 20px 0' }}>Record New Crayfish Sale</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!buyerName.trim() || !totalPrice) return;
                const newSale = { id: Date.now().toString(), buyerName: buyerName.trim(), date: saleDate, totalPrice: parseFloat(totalPrice).toFixed(2) };
                saveSales([newSale, ...sales]);
                setBuyerName('');
                setTotalPrice('');
                showToast('✅ Sale recorded!');
                setCurrentScreen('salesDashboard');
              }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#cbd5e1', textTransform: 'uppercase', marginBottom: '6px' }}>Buyer Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Juan Dela Cruz"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '12px', padding: '12px', color: '#ffffff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#cbd5e1', textTransform: 'uppercase', marginBottom: '6px' }}>Sale Date</label>
                  <input
                    type="date"
                    required
                    value={saleDate}
                    onChange={(e) => setSaleDate(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '12px', padding: '12px', color: '#ffffff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#cbd5e1', textTransform: 'uppercase', marginBottom: '6px' }}>Total Price (₱ PHP)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={totalPrice}
                    onChange={(e) => setTotalPrice(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '12px', padding: '12px', color: '#ffffff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <button type="submit" style={{ width: '100%', backgroundColor: '#10b981', color: '#020617', fontWeight: 'bold', padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '14px', marginTop: '8px' }}>
                  Save Sale Record
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Status Update Modal */}
      {statusModalItem && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, backgroundColor: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', maxWidth: '400px', width: '100%', padding: '24px', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.7)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 4px 0' }}>Update Incubation Status</h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px 0' }}>Mark whether this berried crayfish hatched or failed.</p>

            <form onSubmit={handleUpdateStatusSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#cbd5e1', textTransform: 'uppercase', marginBottom: '6px' }}>Status Outcome</label>
                <select
                  value={modalNewStatus}
                  onChange={(e) => setModalNewStatus(e.target.value)}
                  style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '10px', padding: '10px', color: '#ffffff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                >
                  <option value="active">Active (Still Berried)</option>
                  <option value="hatched">Successfully Hatched 🎉</option>
                  <option value="failed">Failed / Dropped Eggs ❌</option>
                </select>
              </div>

              {modalNewStatus === 'failed' && (
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#cbd5e1', textTransform: 'uppercase', marginBottom: '6px' }}>Failure Reason</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Specify reason (e.g. water parameters, stress)..."
                    value={modalFailReason}
                    onChange={(e) => setModalFailReason(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '10px', padding: '10px', color: '#ffffff', fontSize: '13px', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px', paddingTop: '8px' }}>
                <button
                  type="submit"
                  style={{ flex: 1, backgroundColor: '#10b981', color: '#020617', fontWeight: 'bold', padding: '12px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px' }}
                >
                  Save Status
                </button>
                <button
                  type="button"
                  onClick={() => setStatusModalItem(null)}
                  style={{ backgroundColor: '#1e293b', color: '#cbd5e1', fontWeight: 'bold', padding: '12px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer style={{ borderTop: '1px solid #0f172a', backgroundColor: '#020617', padding: '24px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
        <p style={{ margin: 0 }}>© Rom's Crayfish Hub Management System • All records persisted locally</p>
      </footer>
    </div>
  );
}
