import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { 
  Settings, 
  Plus, 
  X, 
  Search, 
  LayoutGrid,
  Info,
  Download,
  Trash2
} from 'lucide-react';

// Supabase Bağlantısı
const supabase = createClient(
  'https://docdtizfqeolqwwfaiyi.supabase.co', 
  'sb_publishable_0TzP8UOehq9blzjKfAQULQ_3zxLCE80'
);

const App = () => {
  const [apps, setApps] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [password, setPassword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [newApp, setNewApp] = useState({
    name: '',
    description: '',
    url: '',
    icon_url: ''
  });

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    const { data } = await supabase.from('settings').select('value').eq('id', 'store_data').single();
    if (data?.value) {
      setApps(data.value.apps || []);
    }
  };

  const syncStore = async (updatedApps: any[]) => {
    await supabase.from('settings').update({ value: { apps: updatedApps } }).eq('id', 'store_data');
    setApps(updatedApps);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Mihriban04') {
      setIsAdmin(true);
      setShowAdminModal(false);
      setPassword('');
    } else {
      alert('Hatalı şifre!');
    }
  };

  const handleAddApp = () => {
    if (!newApp.name || !newApp.url) {
      alert("Lütfen isim ve URL alanlarını doldurun!");
      return;
    }
    const updated = [newApp, ...apps];
    syncStore(updated);
    setShowAddModal(false);
    setNewApp({ name: '', description: '', url: '', icon_url: '' });
  };

  const deleteApp = (name: string) => {
    if (confirm(`${name} silinsin mi?`)) {
      const updated = apps.filter(a => a.name !== name);
      syncStore(updated);
    }
  };

  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* Üst Menü */}
      <nav style={{ borderBottom: '1px solid #1a1a1a', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            <div style={{ background: 'orange', padding: '8px', borderRadius: '12px', color: '#000' }}>
              <LayoutGrid size={24} />
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '1px' }}>PATNOS STORE</h1>
          </div>
          
          <button 
            onClick={() => isAdmin ? setIsAdmin(false) : setShowAdminModal(true)}
            style={{ background: '#111', color: isAdmin ? 'orange' : '#555', border: '1px solid #222', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Settings size={16} />
            {isAdmin ? 'Yönetimden Çık' : 'Yönetim'}
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* Başlık Bölümü */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '15px', color: 'orange' }}>
            Patnos Dijital Arşivi
          </h2>
          <p style={{ color: '#666', fontSize: '15px', maxWidth: '500px', margin: '0 auto', lineHeight: '1.6' }}>
            Derneğimize ait resmi uygulamalara buradan ulaşabilirsiniz.
          </p>
        </div>

        {/* Arama Barı */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#444' }} size={20} />
            <input 
              type="text"
              placeholder="Uygulama ara..."
              style={{ width: '100%', background: '#080808', border: '1px solid #1a1a1a', padding: '15px 15px 15px 45px', borderRadius: '15px', color: '#fff', fontSize: '16px', outline: 'none' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {isAdmin && (
            <button 
              onClick={() => setShowAddModal(true)}
              style={{ background: 'orange', color: '#000', padding: '0 20px', borderRadius: '15px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
            >
              <Plus size={20} />
            </button>
          )}
        </div>

        {/* Uygulama Listesi */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {filteredApps.map((app, index) => (
            <div 
              key={index}
              style={{ background: '#080808', border: '1px solid #111', padding: '20px', borderRadius: '24px', position: 'relative' }}
            >
              <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'start', marginBottom: '15px' }}>
                <div style={{ width: '50px', height: '50px', background: '#111', borderRadius: '12px', overflow: 'hidden', border: '1px solid #222' }}>
                  {app.icon_url ? (
                    <img src={app.icon_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'orange' }}><LayoutGrid size={24}/></div>
                  )}
                </div>
                {isAdmin && (
                  <button onClick={() => deleteApp(app.name)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer' }}><Trash2 size={18}/></button>
                )}
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#fff' }}>{app.name}</h3>
              <p style={{ color: '#555', fontSize: '13px', marginBottom: '20px', height: '35px', overflow: 'hidden' }}>{app.description}</p>
              
              <a 
                href={app.url} 
                target="_blank" 
                rel="noreferrer"
                style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'orange', color: '#000', padding: '12px', borderRadius: '12px', fontWeight: 'bold', fontSize: '14px' }}
              >
                <Download size={18} /> YÜKLE / AÇ
              </a>
            </div>
          ))}
        </div>
      </main>

      {/* Şifre Modalı */}
      {showAdminModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#111', padding: '30px', borderRadius: '30px', width: '100%', maxWidth: '350px', border: '1px solid #222' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>Yönetici Girişi</h3>
            <form onSubmit={handleAdminLogin}>
              <input 
                type="password"
                placeholder="Şifre..."
                style={{ width: '100%', background: '#000', border: '1px solid #222', padding: '15px', borderRadius: '12px', color: '#fff', marginBottom: '15px', outline: 'none' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              <button style={{ width: '100%', background: 'orange', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>GİRİŞ YAP</button>
              <button type="button" onClick={() => setShowAdminModal(false)} style={{ width: '100%', background: 'none', border: 'none', color: '#444', marginTop: '15px', cursor: 'pointer' }}>Kapat</button>
            </form>
          </div>
        </div>
      )}

      {/* Ekleme Modalı */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#111', padding: '25px', borderRadius: '25px', width: '100%', maxWidth: '400px', border: '1px solid #222' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>Uygulama Ekle</h3>
            <input placeholder="Adı" style={inputStyle} onChange={e => setNewApp({...newApp, name: e.target.value})} />
            <input placeholder="Açıklama" style={inputStyle} onChange={e => setNewApp({...newApp, description: e.target.value})} />
            <input placeholder="URL (https://...)" style={inputStyle} onChange={e => setNewApp({...newApp, url: e.target.value})} />
            <input placeholder="İkon Linki" style={inputStyle} onChange={e => setNewApp({...newApp, icon_url: e.target.value})} />
            <button onClick={handleAddApp} style={{ width: '100%', background: 'orange', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>KAYDET</button>
            <button onClick={() => setShowAddModal(false)} style={{ width: '100%', background: 'none', border: 'none', color: '#444', marginTop: '10px', cursor: 'pointer' }}>İptal</button>
          </div>
        </div>
      )}
    </div>
  );
};

const inputStyle = { width: '100%', background: '#000', border: '1px solid #222', padding: '12px', borderRadius: '10px', color: '#fff', marginBottom: '10px', outline: 'none' };

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
