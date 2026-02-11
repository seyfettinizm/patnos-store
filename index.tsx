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

  useEffect(() => { 
    loadData();
    
    // TARAYICIYI LOGOYU GÖRMEYE ZORLAYAN KISIM
    const updateHead = () => {
      // Rastgele bir sayı ekleyerek tarayıcıyı kandırıyoruz (cache busting)
      const version = Math.random(); 
      
      const manifest = document.querySelector('link[rel="manifest"]') || document.createElement('link');
      manifest.rel = 'manifest';
      manifest.href = `/manifest.json?v=${version}`;
      document.head.appendChild(manifest);

      const icon = document.querySelector('link[rel="apple-touch-icon"]') || document.createElement('link');
      icon.rel = 'apple-touch-icon';
      icon.href = `/logo.png?v=${version}`;
      document.head.appendChild(icon);
      
      const shortcutIcon = document.querySelector('link[rel="shortcut icon"]') || document.createElement('link');
      shortcutIcon.rel = 'shortcut icon';
      shortcutIcon.href = `/logo.png?v=${version}`;
      document.head.appendChild(shortcutIcon);
    };

    updateHead();
  }, []);

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
          <button onClick={() => isAdmin ? setIsAdmin(false) : setShowAdminModal(true)} style={{ background: 'orange', color: '#000', padding: '8px 15px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', border: 'none' }}>{isAdmin ? 'Çıkış' : 'Yönetim'}</button>
        </div>
      </nav>

      <div style={{ background: 'linear-gradient(to right, #111, #222)', padding: '15px', borderBottom: '1px solid orange' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
             <Smartphone color="orange" size={24} />
             <span style={{ fontSize: '13px' }}>Gerçek bir uygulama gibi ana ekrana ekleyin!</span>
          </div>
          <button onClick={() => alert("1. Önce ana ekrandaki eski ikonu silin.\n2. Tarayıcıyı kapatıp tekrar açın.\n3. 'Ana Ekrana Ekle' deyin.")} style={{ background: 'white', border: 'none', padding: '6px 12px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' }}>NASIL?</button>
        </div>
      </div>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
           <h2 style={{ fontSize: '36px', fontWeight: '900', marginBottom: '10px' }}>Patnos <span style={{ color: 'orange' }}>Dijital Arşivi</span></h2>
           <p style={{ color: '#888' }}>"Dijital hazinemiz parmaklarınızın ucunda."</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
          {apps.map((app, i) => {
            const theme = cardThemes[i % cardThemes.length];
            return (
              <div key={i} style={{ background: theme.bg, padding: '25px', borderRadius: '30px', color: theme.text, display: 'flex', flexDirection: 'column' }}>
                 <div style={{ marginBottom: '20px' }}>
                    <img src={app.icon_url} style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
                 </div>
                 <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>{app.name}</h3>
                 <p style={{ opacity: 0.8, fontSize: '13px', marginBottom: '20px' }}>{app.description}</p>
                 <a href={app.url} target="_blank" rel="noreferrer" style={{ textAlign: 'center', background: 'rgba(255,255,255,0.2)', color: theme.text, padding: '12px', borderRadius: '15px', fontWeight: 'bold', textDecoration: 'none' }}>YÜKLE / AÇ</a>
              </div>
            );
          })}
        </div>
      </main>

      {showAdminModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form onSubmit={handleAdminLogin} style={{ background: '#111', padding: '40px', borderRadius: '30px', border: '1px solid #222' }}>
            <input type="password" placeholder="Şifre" style={{ width: '100%', background: '#000', border: '1px solid #222', padding: '15px', borderRadius: '12px', color: '#fff' }} onChange={(e) => setPassword(e.target.value)} autoFocus />
            <button style={{ width: '100%', background: 'orange', padding: '15px', borderRadius: '15px', border: 'none', fontWeight: 'bold', marginTop: '15px' }}>GİRİŞ</button>
          </form>
        </div>
      )}
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) { ReactDOM.createRoot(rootElement).render(<App />); }
