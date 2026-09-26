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
  Upload,
  Eye,
  Maximize2
} from 'lucide-react';

const SALES_STORAGE_KEY = 'roms_crayfish_sales_v3';
const INVENTORY_STORAGE_KEY = 'roms_crayfish_inventory_v5';
const BERRIED_STORAGE_KEY = 'roms_crayfish_berried_v3';

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
    subInventories: [
      { id: 'sub1', category: 'Breeder', sizeRange: '4-5 inches', configSet: 'Pair', price: '1500.00' },
      { id: 'sub2', category: 'Juvenile', sizeRange: '1.5-2 inches', configSet: 'Individual', price: '350.00' }
    ]
  },
  {
    id: '102',
    name: 'Red Claw Crayfish',
    species: 'Cherax quadricarinatus',
    definition: 'Tropical Australian species known for blue-green body and distinctive red patch on male claws. Grows rapidly up to 8-10 inches.',
    imageUri: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    subInventories: []
  }
];

const INITIAL_BERRIED = [
  {
    id: 'b1',
    species: 'Clarkii (Procambarus clarkii)',
    description: 'Female carrying dark eggs under tail, active and eating well.',
    berriedDate: new Date(Date.now() - 86400000 * 12).toISOString().split('T')[0],
    imageUri: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    status: 'active',
    failReason: '',
  }
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('navHub');

  // Sales State
  const [sales, setSales] = useState([]);
  const [buyerName, setBuyerName] = useState('');
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalPrice, setTotalPrice] = useState('');
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState('monthly');

  // Inventory State
  const [inventory, setInventory] = useState([]);
  const [editingCrayfishId, setEditingCrayfishId] = useState(null);
  const [crayfishName, setCrayfishName] = useState('');
  const [crayfishSpecies, setCrayfishSpecies] = useState('');
  const [crayfishDefinition, setCrayfishDefinition] = useState('');
  const [crayfishImage, setCrayfishImage] = useState('');
  const [selectedInventoryItem, setSelectedInventoryItem] = useState(null);

  // Sub-inventory form state
  const [subCategory, setSubCategory] = useState('Breeder');
  const [subSizeRange, setSubSizeRange] = useState('');
  const [subConfigSet, setSubConfigSet] = useState('Pair');
  const [subPrice, setSubPrice] = useState('');

  // Berried Female State (Specific Hardcoded Dropdown)
  const [berriedList, setBerriedList] = useState([]);
  const [berriedSpecies, setBerriedSpecies] = useState('Clarkii (Procambarus clarkii)');
  const [berriedDesc, setBerriedDesc] = useState('');
  const [berriedDate, setBerriedDate] = useState(new Date().toISOString().split('T')[0]);
  const [berriedImage, setBerriedImage] = useState('');
  const [editingBerriedId, setEditingBerriedId] = useState(null);

  // Resolution Modal State
  const [resolvingItem, setResolvingItem] = useState(null);
  const [resolutionType, setResolutionType] = useState('hatched');
  const [failReasonInput, setFailReasonInput] = useState('');

  // Toast
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

  const handleExportBackup = () => {
    const backupData = { sales, inventory, berriedList, exportDate: new Date().toISOString() };
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

  const handleSaveCrayfish = (e) => {
    if (e) e.preventDefault();
    if (!crayfishName.trim() || !crayfishDefinition.trim()) {
      showToast('❌ Provide name and description');
      return;
    }

    if (editingCrayfishId) {
      const updated = inventory.map(item => item.id === editingCrayfishId ? {
        ...item,
        name: crayfishName.trim(),
        species: crayfishSpecies.trim() || 'Freshwater Species',
        definition: crayfishDefinition.trim(),
        imageUri: crayfishImage || item.imageUri
      } : item);
      saveInventory(updated);
      setEditingCrayfishId(null);
      showToast('✅ Crayfish variety updated!');
    } else {
      const newItem = {
        id: Date.now().toString(),
        name: crayfishName.trim(),
        species: crayfishSpecies.trim() || 'Freshwater Species',
        definition: crayfishDefinition.trim(),
        imageUri: crayfishImage || 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=600&q=80',
        subInventories: []
      };
      saveInventory([newItem, ...inventory]);
      showToast('✅ Crayfish added to catalog!');
    }

    setCrayfishName('');
    setCrayfishSpecies('');
    setCrayfishDefinition('');
    setCrayfishImage('');
    setCurrentScreen('crayfishList');
  };

  const handleEditCrayfish = (item) => {
    setEditingCrayfishId(item.id);
    setCrayfishName(item.name);
    setCrayfishSpecies(item.species);
    setCrayfishDefinition(item.definition);
    setCrayfishImage(item.imageUri);
    setCurrentScreen('addCrayfishForm');
  };

  const handleDeleteCrayfish = (id) => {
    if (window.confirm('Delete this crayfish variety?')) {
      saveInventory(inventory.filter(i => i.id !== id));
      showToast('🗑️ Variety removed');
      if (selectedInventoryItem?.id === id) setSelectedInventoryItem(null);
    }
  };

  const handleAddSubInventory = (e) => {
    e.preventDefault();
    if (!selectedInventoryItem) return;
    if (!subSizeRange.trim() || !subPrice) {
      showToast('❌ Please fill in size range and price');
      return;
    }

    const newSub = {
      id: Date.now().toString(),
      category: subCategory,
      sizeRange: subSizeRange.trim(),
      configSet: subConfigSet,
      price: parseFloat(subPrice).toFixed(2)
    };

    const updatedItem = {
      ...selectedInventoryItem,
      subInventories: [...(selectedInventoryItem.subInventories || []), newSub]
    };

    const updatedInventory = inventory.map(i => i.id === updatedItem.id ? updatedItem : i);
    saveInventory(updatedInventory);
    setSelectedInventoryItem(updatedItem);

    setSubSizeRange('');
    setSubPrice('');
    showToast('✅ Sub-inventory category added!');
  };

  const handleDeleteSubInventory = (subId) => {
    if (!selectedInventoryItem) return;
    const updatedSubs = selectedInventoryItem.subInventories.filter(s => s.id !== subId);
    const updatedItem = { ...selectedInventoryItem, subInventories: updatedSubs };
    const updatedInventory = inventory.map(i => i.id === updatedItem.id ? updatedItem : i);
    saveInventory(updatedInventory);
    setSelectedInventoryItem(updatedItem);
    showToast('🗑️ Sub-inventory removed');
  };

  const getIncubationDetails = (item) => {
    const start = new Date(item.berriedDate);
    const now = new Date();
    const daysBerried = Math.max(0, Math.floor((now - start) / (1000 * 60 * 60 * 24)));
    
    // Procambarus species (Clarkii, Alleni/Electric Blue) take ~3 weeks. Cherax takes ~7 weeks.
    const lowerSpecies = item.species.toLowerCase();
    const isProcambarus = lowerSpecies.includes('clarkii') || lowerSpecies.includes('electric blue') || lowerSpecies.includes('alleni');
    const targetDays = isProcambarus ? 21 : 49;
    
    const daysLeft = targetDays - daysBerried;
    const isReadyToHatch = daysLeft <= 3;
    return { daysBerried, targetDays, daysLeft, isReadyToHatch };
  };

  const handleSaveBerried = (e) => {
    if (e) e.preventDefault();
    if (!berriedDesc.trim()) {
      showToast('❌ Please provide a description');
      return;
    }
    const chosenSpecies = berriedSpecies || 'Clarkii (Procambarus clarkii)';

    if (editingBerriedId) {
      saveBerried(berriedList.map(item => item.id === editingBerriedId ? {
        ...item, species: chosenSpecies, description: berriedDesc.trim(), berriedDate, imageUri: berriedImage || item.imageUri
      } : item));
      setEditingBerriedId(null);
      showToast('✅ Berried female updated!');
    } else {
      saveBerried([{
        id: Date.now().toString(), species: chosenSpecies, description: berriedDesc.trim(), berriedDate,
        imageUri: berriedImage || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
        status: 'active', failReason: ''
      }, ...berriedList]);
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
    saveBerried(berriedList.map(item => item.id === resolvingItem.id ? {
      ...item, status: resolutionType, failReason: resolutionType === 'failed' ? failReasonInput.trim() || 'Unspecified reason' : ''
    } : item));
    setResolvingItem(null);
    setFailReasonInput('');
    showToast(resolutionType === 'hatched' ? '🎉 Marked as Successfully Hatched!' : '⚠️ Marked as Hatch Failed');
  };

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
    saveSales([{ id: Date.now().toString(), buyerName: buyerName.trim(), date: saleDate, totalPrice: priceNum.toFixed(2) }, ...sales]);
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
    const totalTransactions = filtered.length;
    const avgTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
    return { filteredSales: filtered, totalRevenue, totalTransactions, avgTransaction };
  }, [sales, analyticsTimeframe]);

  const berriedStats = useMemo(() => {
    const active = berriedList.filter(i => i.status === 'active').length;
    const hatched = berriedList.filter(i => i.status === 'hatched').length;
    const failed = berriedList.filter(i => i.status === 'failed').length;
    const finished = hatched + failed;
    const successRate = finished > 0 ? Math.round((hatched / finished) * 100) : (hatched > 0 ? 100 : 0);
    return { active, hatched, failed, successRate };
  }, [berriedList]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-2xl animate-bounce text-sm flex items-center gap-2">
          {toastMessage}
        </div>
      )}

      {/* Full Screen Modal for Inventory Item */}
      {selectedInventoryItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md overflow-y-auto p-4 sm:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider italic">{selectedInventoryItem.species}</span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">{selectedInventoryItem.name}</h2>
              </div>
              <button
                onClick={() => setSelectedInventoryItem(null)}
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 p-3 rounded-xl transition border border-slate-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="h-64 sm:h-80 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
                  <img src={selectedInventoryItem.imageUri} alt={selectedInventoryItem.name} className="w-full h-full object-cover" />
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                  <p className="text-slate-300 text-sm leading-relaxed">{selectedInventoryItem.definition}</p>
                </div>
              </div>

              {/* Sub-Inventory Manager */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Package className="w-5 h-5 text-purple-400" /> Sub-Inventory Categories & Pricing
                  </h3>

                  {(!selectedInventoryItem.subInventories || selectedInventoryItem.subInventories.length === 0) ? (
                    <p className="text-xs text-slate-500 italic py-4">No sub-inventory pricing sets added yet.</p>
                  ) : (
                    <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                      {selectedInventoryItem.subInventories.map((sub) => (
                        <div key={sub.id} className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 uppercase">{sub.category}</span>
                              <span className="text-xs font-bold text-white">{sub.sizeRange}</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">Set: {sub.configSet}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-black text-emerald-400">₱{sub.price}</span>
                            <button onClick={() => handleDeleteSubInventory(sub.id)} className="text-slate-500 hover:text-red-400 p-1">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add Sub-Inventory Form */}
                <form onSubmit={handleAddSubInventory} className="border-t border-slate-800 pt-4 space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Add Sub-Inventory Set</h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Category</label>
                      <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none">
                        <option value="Breeder">Breeder</option>
                        <option value="Grow out">Grow out</option>
                        <option value="Juvenile">Juvenile</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Config Set</label>
                      <select value={subConfigSet} onChange={(e) => setSubConfigSet(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none">
                        <option value="Individual">Individual</option>
                        <option value="Pair">Pair</option>
                        <option value="Trio">Trio</option>
                        <option value="Quadro">Quadro</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Size Range (inches)</label>
                      <input type="text" placeholder="e.g. 4-5 inches" value={subSizeRange} onChange={(e) => setSubSizeRange(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Price (₱ PHP)</label>
                      <input type="number" step="0.01" min="0" placeholder="0.00" value={subPrice} onChange={(e) => setSubPrice(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none font-bold text-emerald-400" />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-md">
                    + Add Sub-Inventory Set
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resolution Modal */}
      {resolvingItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" /> Update Incubation Result
            </h3>
            <p className="text-xs text-slate-400">Updating record for <strong className="text-white">{resolvingItem.species}</strong> berried female.</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setResolutionType('hatched')} className={`py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition ${resolutionType === 'hatched' ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                <CheckCircle2 className="w-4 h-4" /> Successfully Hatched
              </button>
              <button onClick={() => setResolutionType('failed')} className={`py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition ${resolutionType === 'failed' ? 'bg-red-500 text-white border-red-400' : 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                <XCircle className="w-4 h-4" /> Hatch Failed
              </button>
            </div>
            {resolutionType === 'failed' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Reason for Failure</label>
                <input type="text" placeholder="e.g. Fungal infection, dropped eggs..." value={failReasonInput} onChange={(e) => setFailReasonInput(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none" />
              </div>
            )}
            <div className="pt-3 flex items-center gap-3">
              <button onClick={handleConfirmResolution} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 rounded-xl text-sm transition">Save Resolution</button>
              <button onClick={() => setResolvingItem(null)} className="bg-slate-800 text-slate-300 font-semibold px-4 py-3 rounded-xl text-sm transition">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-4 py-3 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-xl shadow-lg">🦐</div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase block">Crayfish Farm Hub</span>
              <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">Rom's Crayfish Hub</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => setCurrentScreen('berriedDashboard')} className="flex items-center gap-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/30 px-3.5 py-2 rounded-lg transition text-xs font-bold">
              <Heart className="w-4 h-4 fill-rose-400" /> Berried & Hatching
            </button>
            <button onClick={() => setCurrentScreen('navHub')} className="flex items-center gap-1.5 bg-slate-800 text-emerald-400 px-3.5 py-2 rounded-lg border border-slate-700 transition text-xs font-bold">
              <Layers className="w-4 h-4" /> Nav Hub
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* 1. NAVIGATION HUB */}
        {currentScreen === 'navHub' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-900 to-slate-850 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Farm Portal
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">Welcome Back, Rom! 👋</h2>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">Track sales performance, inventory catalog with sub-categories, and monitor berried female incubation in real-time.</p>
                <div className="flex flex-wrap items-center gap-3">
                  <button onClick={() => setCurrentScreen('addBerriedForm')} className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-bold px-4 py-2.5 rounded-xl transition text-sm shadow-lg">
                    <Heart className="w-4 h-4 fill-white" /> Log Berried Female
                  </button>
                  <button onClick={() => setCurrentScreen('salesForm')} className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition text-sm shadow-lg">
                    <Plus className="w-4 h-4 stroke-[3]" /> Record New Sale
                  </button>
                </div>
              </div>
            </div>

            {/* Migration Panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-teal-400" /> Device Data Migration (Backup / Restore)
                </h3>
                <p className="text-xs text-slate-400 mt-1">Export your sales & berried logs from your old app, then import into the new layout!</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button onClick={handleExportBackup} className="flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-md">
                  <Download className="w-4 h-4" /> Export Backup (.json)
                </button>
                <input type="file" ref={fileInputRef} accept=".json" onChange={handleImportBackup} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs transition">
                  <Upload className="w-4 h-4 text-teal-400" /> Import Backup File
                </button>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div onClick={() => setCurrentScreen('berriedList')} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl cursor-pointer hover:border-rose-500/50 transition">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Berried</p>
                <div className="flex items-center justify-between mt-2"><span className="text-2xl font-black text-rose-400">{berriedStats.active}</span><Heart className="w-5 h-5 text-rose-400" /></div>
              </div>
              <div onClick={() => setCurrentScreen('berriedDashboard')} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl cursor-pointer hover:border-emerald-500/50 transition">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hatching Success</p>
                <div className="flex items-center justify-between mt-2"><span className="text-2xl font-black text-emerald-400">{berriedStats.successRate}%</span><CheckCircle className="w-5 h-5 text-emerald-400" /></div>
              </div>
              <div onClick={() => setCurrentScreen('salesRecords')} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl cursor-pointer hover:border-blue-500/50 transition">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sales Records</p>
                <div className="flex items-center justify-between mt-2"><span className="text-2xl font-black text-white">{sales.length}</span><ShoppingBag className="w-5 h-5 text-blue-400" /></div>
              </div>
              <div onClick={() => setCurrentScreen('crayfishList')} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl cursor-pointer hover:border-purple-500/50 transition">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Catalog Varieties</p>
                <div className="flex items-center justify-between mt-2"><span className="text-2xl font-black text-white">{inventory.length}</span><Package className="w-5 h-5 text-purple-400" /></div>
              </div>
            </div>

            {/* Modules Grid */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Farm Management Modules</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div onClick={() => setCurrentScreen('berriedList')} className="group bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-rose-500/50 p-6 rounded-2xl transition cursor-pointer flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20 group-hover:scale-110 transition shrink-0"><Heart className="w-6 h-6 fill-rose-400" /></div>
                  <div>
                    <h4 className="text-lg font-bold text-white group-hover:text-rose-400 transition">Berried Female & Hatching Tracker</h4>
                    <p className="text-slate-400 text-sm mt-1">Monitor gestation days, incubation alerts (Clarkii/Alleni ~3 wks, Cherax ~7 wks), and hatch success rates.</p>
                  </div>
                </div>

                <div onClick={() => setCurrentScreen('salesDashboard')} className="group bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 p-6 rounded-2xl transition cursor-pointer flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition shrink-0"><BarChart3 className="w-6 h-6" /></div>
                  <div>
                    <h4 className="text-lg font-bold text-white group-hover:text-amber-400 transition">Sales Dashboard & Analytics</h4>
                    <p className="text-slate-400 text-sm mt-1">Filter revenue performance by Daily, Weekly (7 days), Monthly (30 days), and All-Time.</p>
                  </div>
                </div>

                <div onClick={() => setCurrentScreen('salesRecords')} className="group bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/50 p-6 rounded-2xl transition cursor-pointer flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition shrink-0"><ShoppingBag className="w-6 h-6" /></div>
                  <div>
                    <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition">Sales Records Ledger</h4>
                    <p className="text-slate-400 text-sm mt-1">View full customer transactions history, dates, buyer names, and total PHP revenue.</p>
                  </div>
                </div>

                <div onClick={() => setCurrentScreen('crayfishList')} className="group bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/50 p-6 rounded-2xl transition cursor-pointer flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition shrink-0"><Package className="w-6 h-6" /></div>
                  <div>
                    <h4 className="text-lg font-bold text-white group-hover:text-purple-400 transition">Available Crayfish Catalog & Sub-Inventory</h4>
                    <p className="text-slate-400 text-sm mt-1">Manage sub-categories (Breeder, Grow out, Juvenile), sizes, configs, and pricing sets.</p>
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
                <button onClick={() => setCurrentScreen('navHub')} className="flex items-center gap-2 text-slate-400 hover:text-white transition text-xs font-semibold mb-1"><ChevronLeft className="w-3.5 h-3.5" /> Navigation Hub</button>
                <h2 className="text-2xl font-black text-white flex items-center gap-2"><Heart className="w-6 h-6 fill-rose-400 text-rose-400" /> Berried Female Crayfish Tracker</h2>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { setEditingBerriedId(null); setBerriedDesc(''); setBerriedImage(''); setCurrentScreen('addBerriedForm'); }} className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition">+ Log Berried Female</button>
                <button onClick={() => setCurrentScreen('berriedDashboard')} className="bg-slate-800 text-slate-200 border border-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs">Success Dashboard</button>
              </div>
            </div>

            {berriedList.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">No berried females logged yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {berriedList.map((item) => {
                  const { daysBerried, targetDays, daysLeft, isReadyToHatch } = getIncubationDetails(item);
                  return (
                    <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between">
                      <div>
                        <div className="h-48 w-full bg-slate-950 relative overflow-hidden">
                          <img src={item.imageUri} alt={item.species} className="w-full h-full object-cover" />
                          <div className="absolute top-3 left-3">
                            <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 truncate max-w-[200px] block">{item.species}</span>
                          </div>
                          <div className="absolute top-3 right-3 flex gap-1.5">
                            <button onClick={() => handleEditBerried(item)} className="bg-slate-900/80 p-2 rounded-lg text-slate-200"><Edit3 className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteBerried(item.id)} className="bg-slate-900/80 p-2 rounded-lg text-slate-200 hover:bg-red-500"><Trash2 className="w-4 h-4" /></button>
                          </div>
                          <div className="absolute bottom-3 right-3">
                            {item.status === 'active' && (
                              <span className={`text-xs font-bold px-3 py-1 rounded-lg border ${isReadyToHatch ? 'bg-rose-500 text-white border-rose-400 animate-pulse' : 'bg-slate-900/90 text-emerald-400 border-emerald-500/30'}`}>
                                {isReadyToHatch ? '🔥 Ready to Hatch Soon!' : `${daysLeft} days left`}
                              </span>
                            )}
                            {item.status === 'hatched' && <span className="text-xs font-bold px-3 py-1 rounded-lg bg-emerald-500 text-slate-950">Successfully Hatched</span>}
                            {item.status === 'failed' && <span className="text-xs font-bold px-3 py-1 rounded-lg bg-red-500 text-white">Failed</span>}
                          </div>
                        </div>
                        <div className="p-5 space-y-3">
                          <div className="flex justify-between text-xs text-slate-400 font-mono"><span>Berried Date: {item.berriedDate}</span><span className="text-rose-400 font-bold">{daysBerried} days berried</span></div>
                          <p className="text-slate-300 text-xs">{item.description}</p>
                          {item.failReason && <p className="text-xs text-red-400"><strong>Reason:</strong> {item.failReason}</p>}
                        </div>
                      </div>
                      {item.status === 'active' && (
                        <div className="p-4 pt-0 border-t border-slate-800/60 mt-2 flex gap-2">
                          <button onClick={() => { setResolvingItem(item); setResolutionType('hatched'); }} className="flex-1 bg-emerald-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs">Mark Hatched</button>
                          <button onClick={() => { setResolvingItem(item); setResolutionType('failed'); }} className="flex-1 bg-slate-800 text-slate-300 hover:text-red-400 border border-slate-700 font-bold py-2.5 rounded-xl text-xs">Mark Failed</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 3. ADD / EDIT BERRIED FORM (Fixed Explicit List) */}
        {currentScreen === 'addBerriedForm' && (
          <div className="max-w-xl mx-auto space-y-6">
            <button onClick={() => setCurrentScreen('berriedList')} className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-semibold"><ChevronLeft className="w-4 h-4" /> Back</button>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4">{editingBerriedId ? 'Edit Berried Record' : 'Log Berried Female'}</h2>
              <form onSubmit={handleSaveBerried} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Species</label>
                  <select value={berriedSpecies} onChange={(e) => setBerriedSpecies(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none">
                    <option value="Clarkii (Procambarus clarkii)">Clarkii (Procambarus clarkii)</option>
                    <option value="Australian Red Claw (Cherax quadricarinatus)">Australian Red Claw (Cherax quadricarinatus)</option>
                    <option value="Electric Blue (Procambarus alleni)">Electric Blue (Procambarus alleni)</option>
                    <option value="Destructor (Cherax destructor)">Destructor (Cherax destructor)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Berried Date</label>
                  <input type="date" required value={berriedDate} onChange={(e) => setBerriedDate(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Description</label>
                  <textarea rows={3} required placeholder="Notes & description..." value={berriedDesc} onChange={(e) => setBerriedDesc(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm resize-none focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Photo Upload</label>
                  <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onloadend = () => setBerriedImage(r.result); r.readAsDataURL(f); } }} className="w-full text-xs text-slate-400" />
                </div>
                <button type="submit" className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 rounded-xl text-sm transition">Save Record</button>
              </form>
            </div>
          </div>
        )}

        {/* 4. SUCCESS RATE DASHBOARD */}
        {currentScreen === 'berriedDashboard' && (
          <div className="space-y-6">
            <button onClick={() => setCurrentScreen('berriedList')} className="flex items-center gap-2 text-slate-400 hover:text-white transition text-xs font-semibold"><ChevronLeft className="w-3.5 h-3.5" /> Back to Berried List</button>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl"><p className="text-xs font-bold text-slate-400">Active</p><p className="text-3xl font-black text-rose-400 mt-2">{berriedStats.active}</p></div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl"><p className="text-xs font-bold text-slate-400">Hatched</p><p className="text-3xl font-black text-emerald-400 mt-2">{berriedStats.hatched}</p></div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl"><p className="text-xs font-bold text-slate-400">Failed</p><p className="text-3xl font-black text-red-400 mt-2">{berriedStats.failed}</p></div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl"><p className="text-xs font-bold text-slate-400">Success Rate</p><p className="text-3xl font-black text-emerald-400 mt-2">{berriedStats.successRate}%</p></div>
            </div>
          </div>
        )}

        {/* 5. SALES FORM */}
        {currentScreen === 'salesForm' && (
          <div className="max-w-xl mx-auto space-y-6">
            <button onClick={() => setCurrentScreen('navHub')} className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-semibold"><ChevronLeft className="w-4 h-4" /> Back</button>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4">Record New Sale</h2>
              <form onSubmit={handleSaveSale} className="space-y-4">
                <input type="text" required placeholder="Buyer Name" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none" />
                <input type="date" required value={saleDate} onChange={(e) => setSaleDate(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none" />
                <input type="number" step="0.01" min="0" required placeholder="Total Price (PHP)" value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none" />
                <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3.5 rounded-xl text-sm transition">Save Sale</button>
              </form>
            </div>
          </div>
        )}

        {/* 6. SALES RECORDS LEDGER */}
        {currentScreen === 'salesRecords' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <button onClick={() => setCurrentScreen('navHub')} className="text-xs text-slate-400">← Back</button>
              <div className="flex gap-2">
                <button onClick={() => setCurrentScreen('salesForm')} className="bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs">+ Add Sale</button>
                <button onClick={() => setCurrentScreen('salesDashboard')} className="bg-amber-500 text-slate-950 font-black px-4 py-2 rounded-xl text-xs">Analytics</button>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-xs font-bold uppercase text-slate-400 border-b border-slate-800">
                  <tr><th className="py-3 px-6">Buyer</th><th className="py-3 px-6">Date</th><th className="py-3 px-6 text-right">Price</th><th className="py-3 px-6 text-center">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {sales.map(item => (
                    <tr key={item.id}>
                      <td className="py-3 px-6 font-bold text-white">{item.buyerName}</td>
                      <td className="py-3 px-6 text-slate-400 text-xs">{item.date}</td>
                      <td className="py-3 px-6 text-right font-black text-emerald-400">₱{item.totalPrice}</td>
                      <td className="py-3 px-6 text-center"><button onClick={() => handleDeleteSale(item.id)} className="text-red-400"><Trash2 className="w-4 h-4" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 7. SALES ANALYTICS DASHBOARD */}
        {currentScreen === 'salesDashboard' && (
          <div className="space-y-6">
            <button onClick={() => setCurrentScreen('navHub')} className="text-xs text-slate-400">← Back</button>
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
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold transition text-center ${analyticsTimeframe === tab.id ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <p className="text-xs font-bold text-slate-400 uppercase">Revenue</p>
                <p className="text-3xl font-black text-emerald-400 mt-2">₱{analytics.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <p className="text-xs font-bold text-slate-400 uppercase">Transactions</p>
                <p className="text-3xl font-black text-white mt-2">{analytics.totalTransactions}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <p className="text-xs font-bold text-slate-400 uppercase">Average Sale</p>
                <p className="text-3xl font-black text-purple-300 mt-2">₱{analytics.avgTransaction.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}

        {/* 8. CRAYFISH CATALOG INVENTORY (With sub-inventory badge previews) */}
        {currentScreen === 'crayfishList' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <button onClick={() => setCurrentScreen('navHub')} className="text-xs text-slate-400">← Back</button>
              <button onClick={() => { setEditingCrayfishId(null); setCrayfishName(''); setCrayfishSpecies(''); setCrayfishDefinition(''); setCrayfishImage(''); setCurrentScreen('addCrayfishForm'); }} className="bg-purple-500 text-white font-bold px-4 py-2 rounded-xl text-xs">+ Add New Variety</button>
            </div>
            
            {inventory.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">Catalog is currently empty.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {inventory.map(item => (
                  <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between">
                    <div>
                      <div onClick={() => setSelectedInventoryItem(item)} className="h-48 bg-slate-950 relative cursor-pointer group">
                        <img src={item.imageUri} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                        <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <span className="bg-slate-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-slate-700">
                            <Maximize2 className="w-3.5 h-3.5" /> Tap to View Full Screen & Sub-Inventory
                          </span>
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 italic">{item.species}</span>
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleEditCrayfish(item)} className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition" title="Edit variety">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteCrayfish(item.id)} className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition" title="Delete variety">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <h3 onClick={() => setSelectedInventoryItem(item)} className="text-lg font-bold text-white mt-0.5 cursor-pointer hover:text-purple-400 transition">{item.name}</h3>
                        <p className="text-slate-300 text-xs mt-1 line-clamp-2">{item.definition}</p>

                        {/* Sub-inventory summary preview badges */}
                        <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap gap-1.5">
                          {(!item.subInventories || item.subInventories.length === 0) ? (
                            <span className="text-[10px] text-slate-500 italic">No sub-categories added. Tap to manage pricing sets.</span>
                          ) : (
                            item.subInventories.map(sub => (
                              <span key={sub.id} className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                                {sub.category} ({sub.configSet}) - ₱{sub.price}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 9. ADD / EDIT CRAYFISH FORM */}
        {currentScreen === 'addCrayfishForm' && (
          <div className="max-w-xl mx-auto space-y-6">
            <button onClick={() => setCurrentScreen('crayfishList')} className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-semibold"><ChevronLeft className="w-4 h-4" /> Back to Catalog</button>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4">{editingCrayfishId ? 'Edit Crayfish Variety' : 'Add Crayfish Variety'}</h2>
              <form onSubmit={handleSaveCrayfish} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Variety Name</label>
                  <input type="text" required placeholder="e.g. Electric Blue Crayfish" value={crayfishName} onChange={(e) => setCrayfishName(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Species Name</label>
                  <input type="text" placeholder="e.g. Procambarus alleni" value={crayfishSpecies} onChange={(e) => setCrayfishSpecies(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Definition & Care Notes</label>
                  <textarea rows={3} required placeholder="Description..." value={crayfishDefinition} onChange={(e) => setCrayfishDefinition(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white resize-none focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Photo Upload</label>
                  <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onloadend = () => setCrayfishImage(r.result); r.readAsDataURL(f); } }} className="w-full text-xs text-slate-400" />
                </div>
                <button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 font-bold py-3.5 rounded-xl text-sm text-white transition">Save Variety Entry</button>
              </form>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-800 bg-slate-900 py-6 text-center text-xs text-slate-500">
        <p>© Rom's Crayfish Hub Management System</p>
      </footer>
    </div>
  );
}
