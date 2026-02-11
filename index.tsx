import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { Settings, Plus, Search, LayoutGrid, Download, Trash2, Image as ImageIcon, Sparkles, Smartphone } from 'lucide-react';

const supabase = createClient(
  'https://docdtizfqeolqwwfaiyi.supabase.co', 
  'sb_publishable_0TzP8UOehq9blzjKfAQULQ_3zxLCE80'
);

const cardThemes = [
  { bg: 'linear-gradient(135deg, #FF3CAC 0%, #784BA0 50%, #2B86C5 100%)', text: '#fff' },
  { bg: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)', text: '#fff' },
  { bg: 'linear-gradient(135deg, #85FFBD 0%, #FFFB7D 100%)', text: '#000' },
  { bg: 'linear-gradient(135deg, #FBAB7E 0%, #F7CE68 100%)', text: '#000' }
];

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
    await supabase.from('settings').upsert({ id: 'store_data', value: { apps: updatedApps, logo: updatedLogo } });
    setApps(updatedApps);
    setStoreLogo(updatedLogo);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Mihriban04') { setIsAdmin(true); setShowAdminModal(false); setPassword(''); } 
    else { alert('Hatalı şifre!'); }
  };

  return (
    <div style={{ background: '#0a0a0a', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* Üst Menü */}
      <nav style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(15px)', borderBottom: '1px solid #1a1a1a', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {storeLogo ? (
              <img src={storeLogo} style={{ width: '40px', height: '40px', objectFit: 'contain' }} alt="Logo" />
            ) : (
              <div style={{ background: 'orange', padding: '8px', borderRadius: '10px', color: '#000' }}><LayoutGrid size={20} /></div>
            )}
            <h1 style={{ fontSize: '18px', fontWeight: 'bold' }}>PATNOS STORE</h1>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
             {isAdmin && <button onClick={() => setShowSettingsModal(true)} style={{ background: '#111', color: 'orange', border: '1px solid #222', padding: '10px', borderRadius: '50%' }}><ImageIcon size={18} /></button>}
             <button onClick={() => isAdmin ? setIsAdmin(false) : setShowAdminModal(true)} style={{ background: 'orange', color: '#000', padding: '8px 15px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', border: 'none' }}>{isAdmin ? 'Çıkış' : 'Yönetim'}</button>
          </div>
        </div>
      </nav>

      {/* Play Store Tarzı Yükleme Banner'ı */}
      <div style={{ background: 'linear-gradient(to right, #111, #222)', padding: '15px', borderBottom: '1px solid orange' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
             <Smartphone color="orange" size={24} />
             <span style={{ fontSize: '13px', fontWeight: '500' }}>Patnos Store'u ana ekrana ekleyin.</span>
          </div>
          <button onClick={() => alert("Yüklemek için: \n\niPhone: Paylaş > Ana Ekrana Ekle\nAndroid: Üç Nokta > Uygulamayı Yükle")} style={{ background: 'white', color: 'black', border: 'none', padding: '6px 12px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' }}>NASIL YÜKLENİR?</button>
        </div>
      </div>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '900', marginBottom: '15px' }}>Patnos <span style={{ color: 'orange' }}>Dijital Arşivi</span></h2>
          <p style={{ color: '#888', fontStyle: 'italic', fontSize: '16px' }}>"Tüm kültürel projelerimiz artık tek bir mağazada."</p>
        </div>

        {/* Arama */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '40px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#444' }} />
            <input placeholder="Mağazada uygulama ara..." style={{ width: '100%', background: '#111', border: '1px solid #1a1a1a', padding: '15px 15px 15px 45px', borderRadius: '15px', color: '#fff' }} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          {isAdmin && <button onClick={() => setShowAddModal(true)} style={{ background: 'orange', padding: '0 20px', borderRadius: '15px', border: 'none' }}><Plus /></button>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
          {apps.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase())).map((app, i) => {
            const theme = cardThemes[i % cardThemes.length];
            return (
              <div key={i} style={{ background: theme.bg, padding: '25px', borderRadius: '30px', color: theme.text, display: 'flex', flexDirection: 'column', minHeight: '280px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
                    <img src={app.icon_url} style={{ width: '70px', height: '70px', objectFit: 'contain' }} />
                    {isAdmin && <button onClick={() => syncAll(apps.filter(x => x.name !== app.name), storeLogo)} style={{ color: theme.text, opacity: 0.5, background: 'none', border: 'none' }}><Trash2 size={20}/></button>}
                 </div>
                 <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>{app.name}</h3>
                 <p style={{ opacity: 0.8, fontSize: '13px', marginBottom: '25px', flex: 1 }}>{app.description}</p>
                 <a href={app.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', textAlign: 'center', background: 'rgba(255,255,255,0.2)', color: theme.text, padding: '12px', borderRadius: '15px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.1)' }}>
                    YÜKLE / AÇ
                 </a>
              </div>
            );
          })}
        </div>
      </main>

      {/* Modallar öncekiyle aynı... */}
      {showAdminModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form onSubmit={handleAdminLogin} style={{ background: '#111', padding: '40px', borderRadius: '30px', border: '1px solid #222' }}>
            <input type="password" placeholder="Şifre" style={inputStyle} onChange={(e) => setPassword(e.target.value)} autoFocus />
            <button style={{ width: '100%', background: 'orange', padding: '15px', borderRadius: '15px', border: 'none', fontWeight: 'bold', marginTop: '15px' }}>GİRİŞ</button>
          </form>
        </div>
      )}

      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#111', padding: '30px', borderRadius: '30px', width: '100%', maxWidth: '450px' }}>
            <h3 style={{ marginBottom: '20px', color: 'orange' }}>Uygulama Ekle</h3>
            <input placeholder="Ad" style={inputStyle} onChange={e => setNewApp({...newApp, name: e.target.value})} />
            <input placeholder="Açıklama" style={inputStyle} onChange={e => setNewApp({...newApp, description: e.target.value})} />
            <input placeholder="URL" style={inputStyle} onChange={e => setNewApp({...newApp, url: e.target.value})} />
            <input placeholder="İkon URL" style={inputStyle} onChange={e => setNewApp({...newApp, icon_url: e.target.value})} />
            <button onClick={() => { syncAll([...apps, newApp], storeLogo); setShowAddModal(false); }} style={{ width: '100%', background: 'orange', padding: '15px', borderRadius: '15px', border: 'none', fontWeight: 'bold', marginTop: '10px' }}>EKLE</button>
          </div>
        </div>
      )}
    </div>
  );
};

const inputStyle = { width: '100%', background: '#000', border: '1px solid #222', padding: '15px', borderRadius: '12px', color: '#fff', marginBottom: '10px' };

const rootElement = document.getElementById('root');
if (rootElement) { ReactDOM.createRoot(rootElement).render(<App />); }
