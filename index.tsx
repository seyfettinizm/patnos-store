import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { Settings, Plus, X, Search, LayoutGrid, Download, Trash2, Image as ImageIcon } from 'lucide-react';

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
    const { error } = await supabase.from('settings').upsert({ 
      id: 'store_data', 
      value: { apps: updatedApps, logo: updatedLogo } 
    });
    if (!error) {
      setApps(updatedApps);
      setStoreLogo(updatedLogo);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Mihriban04') { setIsAdmin(true); setShowAdminModal(false); setPassword(''); } 
    else { alert('Hatalı şifre!'); }
  };

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <nav style={{ borderBottom: '1px solid #1a1a1a', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {storeLogo ? (
              <img src={storeLogo} style={{ width: '45px', height: '45px', objectFit: 'contain' }} alt="Logo" />
            ) : (
              <div style={{ background: 'orange', padding: '8px', borderRadius: '12px', color: '#000' }}><LayoutGrid size={24} /></div>
            )}
            <h1 style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '1px' }}>PATNOS STORE</h1>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {isAdmin && (
              <button onClick={() => setShowSettingsModal(true)} style={{ background: '#111', color: 'orange', border: '1px solid #222', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}><ImageIcon size={18} /></button>
            )}
            <button onClick={() => isAdmin ? setIsAdmin(false) : setShowAdminModal(true)} style={{ background: '#111', color: isAdmin ? 'orange' : '#555', border: '1px solid #222', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
              {isAdmin ? 'Yönetimden Çık' : 'Yönetim'}
            </button>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '42px', fontWeight: '900', marginBottom: '20px', background: 'linear-gradient(to right, #fff, orange)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Patnos Dijital Arşivi
          </h2>
          <p style={{ color: '#aaa', fontSize: '18px', maxWidth: '700px', margin: '0 auto', lineHeight: '1.8', fontStyle: 'italic' }}>
            "Geçmişin köklü mirasını, geleceğin dijital dünyasıyla buluşturuyoruz. İzmir Patnoslular Derneği'ne ait tüm projeler ve kültürel hazineler artık tek bir dokunuşla cebinizde."
          </p>
        </div>

        <div style={{ display: 'flex', gap: '15px', marginBottom: '40px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#444' }} size={20} />
            <input placeholder="Uygulama ara..." style={{ width: '100%', background: '#080808', border: '1px solid #1a1a1a', padding: '15px 15px 15px 45px', borderRadius: '15px', color: '#fff', fontSize: '16px', outline: 'none' }} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          {isAdmin && <button onClick={() => setShowAddModal(true)} style={{ background: 'orange', padding: '0 25px', borderRadius: '15px', border: 'none', cursor: 'pointer' }}><Plus color="#000" /></button>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
          {apps.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase())).map((app, i) => (
            <div key={i} style={{ background: '#080808', border: '1px solid #111', padding: '25px', borderRadius: '30px', transition: '0.3s' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <img src={app.icon_url} style={{ width: '60px', height: '60px', borderRadius: '15px', objectFit: 'cover', border: '1px solid #222' }} />
                  {isAdmin && <button onClick={() => syncAll(apps.filter(x => x.name !== app.name), storeLogo)} style={{ color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={20}/></button>}
               </div>
               <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'orange', marginBottom: '10px' }}>{app.name}</h3>
               <p style={{ color: '#555', fontSize: '14px', marginBottom: '20px', height: '40px', overflow: 'hidden' }}>{app.description}</p>
               <a href={app.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#fff', color: '#000', padding: '14px', borderRadius: '15px', fontWeight: 'bold' }}>
                 <Download size={18} /> HEMEN AÇ / YÜKLE
               </a>
            </div>
          ))}
        </div>
      </main>

      {/* MODALLAR (Logo Ayarları, Giriş ve Ekleme) */}
      {showSettingsModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#111', padding: '30px', borderRadius: '30px', width: '100%', maxWidth: '400px', border: '1px solid #222' }}>
            <h3 style={{ marginBottom: '20px', fontWeight: 'bold', color: 'orange' }}>Mağaza Ayarları</h3>
            <label style={{ fontSize: '12px', color: '#555' }}>LOGO URL (Şeffaf PNG önerilir)</label>
            <input value={storeLogo} onChange={(e) => setStoreLogo(e.target.value)} style={inputStyle} />
            <button onClick={() => { syncAll(apps, storeLogo); setShowSettingsModal(false); }} style={{ width: '100%', background: 'orange', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', marginTop: '20px', cursor: 'pointer', color: '#000' }}>KAYDET</button>
            <button onClick={() => setShowSettingsModal(false)} style={{ width: '100%', background: 'none', border: 'none', color: '#444', marginTop: '10px', cursor: 'pointer' }}>Kapat</button>
          </div>
        </div>
      )}

      {showAdminModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form onSubmit={handleAdminLogin} style={{ background: '#111', padding: '40px', borderRadius: '30px', border: '1px solid #222', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '20px' }}>Yönetici Girişi</h3>
            <input type="password" placeholder="Şifre" style={inputStyle} onChange={(e) => setPassword(e.target.value)} autoFocus />
            <button style={{ width: '100%', background: 'orange', color: '#000', padding: '15px', borderRadius: '12px', border: 'none', fontWeight: 'bold', marginTop: '10px', cursor: 'pointer' }}>GİRİŞ</button>
            <button type="button" onClick={() => setShowAdminModal(false)} style={{ color: '#444', background: 'none', border: 'none', marginTop: '15px', cursor: 'pointer' }}>Vazgeç</button>
          </form>
        </div>
      )}

      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#111', padding: '30px', borderRadius: '30px', width: '100%', maxWidth: '450px', border: '1px solid #222' }}>
            <h3 style={{ marginBottom: '20px', color: 'orange' }}>Yeni Uygulama Ekle</h3>
            <input placeholder="Uygulama Adı" style={inputStyle} onChange={e => setNewApp({...newApp, name: e.target.value})} />
            <input placeholder="Kısa Açıklama" style={inputStyle} onChange={e => setNewApp({...newApp, description: e.target.value})} />
            <input placeholder="URL (Link)" style={inputStyle} onChange={e => setNewApp({...newApp, url: e.target.value})} />
            <input placeholder="İkon Linki (URL)" style={inputStyle} onChange={e => setNewApp({...newApp, icon_url: e.target.value})} />
            <button onClick={() => { syncAll([...apps, newApp], storeLogo); setShowAddModal(false); }} style={{ width: '100%', background: 'orange', padding: '15px', borderRadius: '12px', border: 'none', fontWeight: 'bold', marginTop: '10px', cursor: 'pointer', color: '#000' }}>MAĞAZAYA EKLE</button>
            <button onClick={() => setShowAddModal(false)} style={{ width: '100%', background: 'none', border: 'none', color: '#444', marginTop: '10px', cursor: 'pointer' }}>İptal</button>
          </div>
        </div>
      )}
    </div>
  );
};

const inputStyle = { width: '100%', background: '#000', border: '1px solid #222', padding: '15px', borderRadius: '12px', color: '#fff', marginBottom: '10px', outline: 'none' };

const rootElement = document.getElementById('root');
if (rootElement) { ReactDOM.createRoot(rootElement).render(<App />); }
