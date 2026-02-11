import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { Settings, Plus, X, Search, LayoutGrid, Info, Download, Trash2, Image as ImageIcon } from 'lucide-react';

const supabase = createClient(
  'https://docdtizfqeolqwwfaiyi.supabase.co', 
  'sb_publishable_0TzP8UOehq9blzjKfAQULQ_3zxLCE80'
);

const App = () => {
  const [apps, setApps] = useState<any[]>([]);
  const [storeLogo, setStoreLogo] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [password, setPassword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [newApp, setNewApp] = useState({ name: '', description: '', url: '', icon_url: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const { data } = await supabase.from('settings').select('value').eq('id', 'store_data').single();
    if (data?.value) {
      setApps(data.value.apps || []);
      setStoreLogo(data.value.logo || '');
    }
  };

  const syncAll = async (updatedApps: any[], updatedLogo: string) => {
    await supabase.from('settings').update({ value: { apps: updatedApps, logo: updatedLogo } }).eq('id', 'store_data');
    setApps(updatedApps);
    setStoreLogo(updatedLogo);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Mihriban04') { setIsAdmin(true); setShowAdminModal(false); setPassword(''); } 
    else { alert('Hatalı şifre!'); }
  };

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* Üst Menü */}
      <nav style={{ borderBottom: '1px solid #1a1a1a', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {storeLogo ? (
              <img src={storeLogo} style={{ width: '45px', height: '45px', objectFit: 'contain', background: 'transparent' }} alt="Logo" />
            ) : (
              <div style={{ background: 'orange', padding: '8px', borderRadius: '12px', color: '#000' }}><LayoutGrid size={24} /></div>
            )}
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '1px' }}>PATNOS STORE</h1>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            {isAdmin && (
              <button onClick={() => setShowSettingsModal(true)} style={{ background: '#111', color: 'orange', border: '1px solid #222', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}>
                <ImageIcon size={18} />
              </button>
            )}
            <button 
              onClick={() => isAdmin ? setIsAdmin(false) : setShowAdminModal(true)}
              style={{ background: '#111', color: isAdmin ? 'orange' : '#555', border: '1px solid #222', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {isAdmin ? 'Çıkış' : 'Yönetim'}
            </button>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '15px', color: 'orange' }}>Patnos Dijital Arşivi</h2>
          <p style={{ color: '#666', fontSize: '15px' }}>Derneğimize ait resmi uygulamalar.</p>
        </div>

        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
          <input 
            placeholder="Uygulama ara..."
            style={{ flex: 1, background: '#080808', border: '1px solid #1a1a1a', padding: '15px', borderRadius: '15px', color: '#fff' }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {isAdmin && <button onClick={() => setShowAddModal(true)} style={{ background: 'orange', padding: '0 20px', borderRadius: '15px', border: 'none', cursor: 'pointer' }}><Plus /></button>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {apps.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase())).map((app, i) => (
            <div key={i} style={{ background: '#080808', border: '1px solid #111', padding: '20px', borderRadius: '24px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <img src={app.icon_url} style={{ width: '50px', height: '50px', borderRadius: '12px', objectFit: 'cover' }} />
                  {isAdmin && <button onClick={() => syncAll(apps.filter(x => x.name !== app.name), storeLogo)} style={{ color: 'red', background: 'none', border: 'none' }}><Trash2 size={18}/></button>}
               </div>
               <h3 style={{ fontWeight: 'bold', color: '#fff' }}>{app.name}</h3>
               <a href={app.url} target="_blank" style={{ textDecoration: 'none', display: 'block', textAlign: 'center', background: 'orange', color: '#000', padding: '10px', borderRadius: '10px', marginTop: '15px', fontWeight: 'bold' }}>AÇ / YÜKLE</a>
            </div>
          ))}
        </div>
      </main>

      {/* MAĞAZA AYARLARI MODALI (Logo Değiştirme Alanı) */}
      {showSettingsModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#111', padding: '30px', borderRadius: '30px', width: '100%', maxWidth: '400px', border: '1px solid #222' }}>
            <h3 style={{ marginBottom: '20px', fontWeight: 'bold' }}>Mağaza Ayarları</h3>
            <label style={{ fontSize: '12px', color: '#555' }}>LOGO URL (Şeffaf PNG önerilir)</label>
            <input 
              value={storeLogo} 
              onChange={(e) => setStoreLogo(e.target.value)}
              style={{ width: '100%', background: '#000', border: '1px solid #222', padding: '12px', borderRadius: '10px', color: '#fff', marginTop: '5px' }} 
            />
            <button onClick={() => { syncAll(apps, storeLogo); setShowSettingsModal(false); }} style={{ width: '100%', background: 'orange', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', marginTop: '20px', cursor: 'pointer' }}>AYARLARI KAYDET</button>
            <button onClick={() => setShowSettingsModal(false)} style={{ width: '100%', background: 'none', border: 'none', color: '#444', marginTop: '10px' }}>Kapat</button>
          </div>
        </div>
      )}

      {/* Şifre ve Ekleme Modalları Buraya Gelecek (Kodun devamı öncekiyle aynı mantıkta) */}
      {showAdminModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form onSubmit={handleAdminLogin} style={{ background: '#111', padding: '30px', borderRadius: '30px', border: '1px solid #222' }}>
            <input type="password" placeholder="Şifre" style={{ background: '#000', color: '#fff', padding: '10px', borderRadius: '10px', border: '1px solid #222' }} onChange={(e) => setPassword(e.target.value)} autoFocus />
            <button style={{ background: 'orange', padding: '10px 20px', borderRadius: '10px', border: 'none', marginLeft: '10px', fontWeight: 'bold' }}>Giriş</button>
          </form>
        </div>
      )}
      
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#111', padding: '25px', borderRadius: '25px', width: '100%', maxWidth: '400px', border: '1px solid #222' }}>
            <h3 style={{ marginBottom: '15px' }}>Uygulama Ekle</h3>
            <input placeholder="Adı" style={inputStyle} onChange={e => setNewApp({...newApp, name: e.target.value})} />
            <input placeholder="URL" style={inputStyle} onChange={e => setNewApp({...newApp, url: e.target.value})} />
            <input placeholder="İkon URL" style={inputStyle} onChange={e => setNewApp({...newApp, icon_url: e.target.value})} />
            <button onClick={() => { syncAll([...apps, newApp], storeLogo); setShowAddModal(false); }} style={{ width: '100%', background: 'orange', padding: '15px', borderRadius: '12px', border: 'none', fontWeight: 'bold', marginTop: '10px' }}>KAYDET</button>
            <button onClick={() => setShowAddModal(false)} style={{ width: '100%', background: 'none', border: 'none', color: '#444', marginTop: '10px' }}>İptal</button>
          </div>
        </div>
      )}
    </div>
  );
};

const inputStyle = { width: '100%', background: '#000', border: '1px solid #222', padding: '12px', borderRadius: '10px', color: '#fff', marginBottom: '10px', outline: 'none' };

const rootElement = document.getElementById('root');
if (rootElement) { ReactDOM.createRoot(rootElement).render(<App />); }
