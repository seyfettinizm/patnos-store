import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { 
  Music, 
  ExternalLink, 
  Settings, 
  Plus, 
  X, 
  Search, 
  LayoutGrid,
  Info
} from 'lucide-react';

// Mağaza Uygulaması Bileşeni
const App = () => {
  const [apps, setApps] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [password, setPassword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Yeni uygulama formu için state
  const [newApp, setNewApp] = useState({
    name: '',
    description: '',
    url: '',
    icon_url: ''
  });

  // Şifre kontrolü
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (password === 'Mihriban04') {
      setIsAdmin(true);
      setShowAdminModal(false);
      setPassword('');
    } else {
      alert('Hatalı şifre!');
    }
  };

  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      {/* Üst Menü */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <LayoutGrid size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Patnos Store</h1>
          </div>
          
          <button 
            onClick={() => isAdmin ? setIsAdmin(false) : setShowAdminModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors text-sm"
          >
            <Settings size={18} />
            {isAdmin ? 'Yönetimden Çık' : 'Yönetim'}
          </button>
        </div>
      </nav>

      {/* Ana İçerik */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Patnos Dijital Arşivi
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Derneğimize ait tüm uygulama ve projelere buradan güvenle ulaşabilirsiniz.
          </p>
        </div>

        {/* Arama ve Ekleme */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
              type="text"
              placeholder="Uygulama ara..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {isAdmin && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all shadow-lg shadow-blue-900/20"
            >
              <Plus size={20} />
              Yeni Uygulama Ekle
            </button>
          )}
        </div>

        {/* Uygulama Listesi */}
        {filteredApps.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/30 rounded-3xl border-2 border-dashed border-slate-700">
            <Info className="mx-auto mb-4 text-slate-600" size={48} />
            <p className="text-slate-500">Henüz uygulama eklenmedi. Yönetici olarak giriş yapıp ilk uygulamayı ekleyin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApps.map((app, index) => (
              <a 
                key={index}
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-slate-800/50 border border-slate-700 p-6 rounded-2xl hover:bg-slate-800 hover:border-blue-500/50 transition-all hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 bg-slate-700 rounded-xl flex items-center justify-center overflow-hidden border border-slate-600 group-hover:border-blue-500/50">
                    {app.icon_url ? (
                      <img src={app.icon_url} alt={app.name} className="w-full h-full object-cover" />
                    ) : (
                      <Music className="text-blue-400" size={28} />
                    )}
                  </div>
                  <ExternalLink className="text-slate-600 group-hover:text-blue-400 transition-colors" size={20} />
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-blue-400 transition-colors">{app.name}</h3>
                <p className="text-slate-400 text-sm line-clamp-2">{app.description}</p>
              </a>
            ))}
          </div>
        )}
      </main>

      {/* Şifre Modalı */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl w-full max-w-md relative">
            <button onClick={() => setShowAdminModal(false)} className="absolute right-6 top-6 text-slate-500 hover:text-white">
              <X size={24} />
            </button>
            <h3 className="text-2xl font-bold mb-6">Yönetici Girişi</h3>
            <form onSubmit={handleAdminLogin}>
              <input 
                type="password"
                placeholder="Şifrenizi yazın..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-4 px-4 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              <button className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/40">
                Giriş Yap
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Yeni Uygulama Modalı */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl w-full max-w-lg relative">
            <button onClick={() => setShowAddModal(false)} className="absolute right-6 top-6 text-slate-500 hover:text-white">
              <X size={24} />
            </button>
            <h3 className="text-2xl font-bold mb-6">Yeni Uygulama Kaydı</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Uygulama Adı</label>
                <input 
                  type="text" 
                  placeholder="Örn: Patnos Müzik"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setNewApp({...newApp, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Açıklama</label>
                <textarea 
                  placeholder="Kısaca uygulamanın amacını yazın..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setNewApp({...newApp, description: e.target.value})}
                ></textarea>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Uygulama Linki (URL)</label>
                <input 
                  type="text" 
                  placeholder="https://..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setNewApp({...newApp, url: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">İkon URL (Opsiyonel)</label>
                <input 
                  type="text" 
                  placeholder="Logo linkini buraya yapıştırın"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setNewApp({...newApp, icon_url: e.target.value})}
                />
              </div>
              <button 
                onClick={() => {
                  setApps([...apps, newApp]);
                  setShowAddModal(false);
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/40 mt-4"
              >
                MAĞAZAYA EKLE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Kodun HTML'e bağlanmasını sağlayan kritik 2 satır
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<App />); 
