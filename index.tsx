import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { 
  ExternalLink, 
  Settings, 
  Plus, 
  X, 
  Search, 
  LayoutGrid,
  Info,
  Download
} from 'lucide-react';

// Supabase Bağlantısı (Müzik kutusuyla aynı DB, güvenli bağlantı)
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

  // Yeni uygulama formu
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
      
      {/* 📱 Üst Menü (Turuncu Detaylı) */}
      <nav style={{ borderBottom: '1px solid #1a1a1a', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'orange', padding: '8px', borderRadius: '12px', color: '#000' }}>
              <LayoutGrid size={24} />
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '1px' }}>PATNOS STORE</h1>
          </div>
          
          <button 
            onClick={() => isAdmin ? setIsAdmin(false) : setShowAdminModal(true)}
            style={{ background: '#111', color: isAdmin ? 'orange' : '#555', border: '1px solid #222', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Settings size={16} />
            {isAdmin ? 'Yönetimden Çık' : 'Yönetim'}
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* Karşılama Bölümü */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '900', marginBottom: '15px', background: 'linear-gradient(to right, #fff, orange)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Patnos Dijital Arşivi
          </h2>
          <p style={{ color: '#666', fontSize: '16px', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            İzmir Patnoslular Derneği'ne ait tüm dijital projelere ve mobil uygulamalara buradan güvenle ulaşabilirsiniz.
          </p>
        </div>

        {/* Arama ve Yeni Ekleme */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
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
              style={{ background: 'orange', color: '#000', padding: '0 25px', borderRadius: '15px', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', height: '54px' }}
            >
              <Plus size={20} /> Yeni Uygulama
            </button>
          )}
        </div>

        {/* Uygulama Kartları */}
        {filteredApps.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', border: '2px dashed #111', borderRadius: '30px' }}>
            <Info size={48} style={{ color: '#222', marginBottom: '15px' }} />
            <p style={{ color: '#444' }}>Henüz bir uygulama eklenmedi.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {filteredApps.map((app, index) => (
              <div 
                key={index}
                style={{ background: '#080808', border: '1px solid #111', padding: '25px', borderRadius: '24px', position: 'relative', transition: 'transform 0.2s' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div style={{ width: '60px', height: '60px', background: '#111', borderRadius: '16px', overflow: 'hidden', border: '1px solid #222' }}>
                    {app.icon_url ? (
                      <img src={app.icon_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'orange' }}><LayoutGrid /></div>
                    )}
                  </div>
                  {isAdmin && (
                    <button onClick={() => deleteApp(app.name)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer' }}><X size={20}/></button>
                  )}
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: 'orange' }}>{app.name}</h3>
                <p style={{ color: '#555', fontSize: '14px', marginBottom: '25px', height: '40px', overflow: 'hidden' }}>{app.description}</p>
                
                <a 
                  href={app.url} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#fff', color: '#000', padding: '12px', borderRadius: '12px', fontWeight: 'bold', fontSize: '14px' }}
                >
                  <Download size={18} /> HEMEN YÜKLE / AÇ
                </a>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Şifre Modalı */}
      {showAdminModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#111', padding: '40px', borderRadius: '30px', width: '100%', maxWidth: '400px', border: '1px solid #222' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '25px', textAlign: 'center' }}>Yönetici Girişi</h3>
            <form onSubmit={handleAdminLogin}>
              <input 
                type="password"
                placeholder="Şifre..."
                style={{ width: '100%', background: '#000', border: '1px solid #222', padding: '15px', borderRadius: '12px', color: '#fff', marginBottom: '15px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              <button style={{ width: '100%', background: 'orange', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>GİRİŞ YAP</button>
              <button type="button" onClick={() => setShowAdminModal(false)} style={{ width: '100%', background: 'none', border: 'none', color: '#444', marginTop: '15px', cursor: 'pointer' }}>İptal</button>
            </form>
          </div>
        </div>
      )}

      {/* Uygulama Ekleme Modalı */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#111', padding: '30px', borderRadius: '30px', width: '100%', maxWidth: '500px', border: '1px solid #222' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Yeni Uygulama Kaydı</h3>
            <input placeholder="Uygulama Adı" style={inputStyle} onChange={e => setNewApp({...newApp, name: e.target.value})} />
            <textarea placeholder="Kısa Açıklama" style={{...inputStyle, height: '80px'}} onChange={e => setNewApp({...newApp, description: e.target.value})} />
            <input placeholder="Uygulama Linki (URL)" style={inputStyle} onChange={e => setNewApp({...newApp, url: e.target.value})} />
            <input placeholder="İkon URL" style={inputStyle} onChange={e => setNewApp({...newApp, icon_url: e.target.value})} />
            <button onClick={handleAddApp} style={{ width: '100%', background: 'orange', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>MAĞAZAYA EKLE</button>
            <button onClick={() => setShowAddModal(false)} style={{ width: '100%', background: 'none', border: 'none', color: '#444', marginTop: '10px', cursor: 'pointer' }}>Kapat</button>
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
