import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { Settings, Plus, Search, LayoutGrid, Download, Trash2, Image as ImageIcon, Sparkles } from 'lucide-react';

const supabase = createClient(
  'https://docdtizfqeolqwwfaiyi.supabase.co', 
  'sb_publishable_0TzP8UOehq9blzjKfAQULQ_3zxLCE80'
);

const cardThemes = [
  { bg: 'linear-gradient(135deg, #FF3CAC 0%, #784BA0 50%, #2B86C5 100%)', text: '#fff' },
  { bg: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)', text: '#fff' },
  { bg: 'linear-gradient(135deg, #85FFBD 0%, #FFFB7D 100%)', text: '#000' },
  { bg: 'linear-gradient(135deg, #FBAB7E 0%, #F7CE68 100%)', text: '#000' },
  { bg: 'linear-gradient(135deg, #8BC6EC 0%, #9599E2 100%)', text: '#fff' },
  { bg: 'linear-gradient(135deg, #FF9A8B 0%, #FF6A88 55%, #FF99AC 100%)', text: '#fff' }
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
      <nav style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(15px)', borderBottom: '1px solid #1a1a1a', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {storeLogo ? (
              <img src={storeLogo} style={{ width: '40px', height: '40px', objectFit: 'contain' }} alt="Logo" />
            ) : (
              <div style={{ background: 'orange', padding: '8px', borderRadius: '10px', color: '#000' }}><LayoutGrid size={20} /></div>
            )}
            <h1 style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '2px' }}>PATNOS STORE</h1>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {isAdmin && (
              <button onClick={() => setShowSettingsModal(true)} style={{ background: '#111', color: 'orange', border: '1px solid #222', padding: '10px', borderRadius: '50%', cursor: 'pointer' }}><ImageIcon size={18} /></button>
            )}
            <button onClick={() => isAdmin ? setIsAdmin(false) : setShowAdminModal(true)} style={{ background: 'orange', color: '#000', border: 'none', padding: '8px 20px', borderRadius: '25px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
              {isAdmin ? 'Panelden Çık' : 'Yönetim'}
            </button>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '50px 20px' }}>
        {/* Karşılama Notu Geri Geldi */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#111', padding: '5px 15px', borderRadius: '20px', color: 'orange', fontSize: '12px', marginBottom: '20px', border: '1px solid #222' }}>
            <Sparkles size={14} /> Dijital Gelecek Burada
          </div>
          <h2 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '20px' }}>
            Patnos <span style={{ color: 'orange' }}>Dijital Arşivi</span>
          </h2>
          <p style={{ color: '#aaa', fontSize: '18px', maxWidth: '700px', margin: '0 auto', lineHeight: '1.8', fontStyle: 'italic' }}>
            "Geçmişin köklü mirasını, geleceğin dijital dünyasıyla buluşturuyoruz. İzmir Patnoslular Derneği'ne ait tüm projeler ve kültürel hazineler artık tek bir dokunuşla cebinizde."
          </p>
        </div>

        <div style={{ display: 'flex', gap: '15px', marginBottom: '40px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#444' }} size={22} />
            <input placeholder="Arşivde uygulama ara..." style={{ width: '100%', background: '#111', border: '1px solid #1a1a1a', padding: '18px 20px 18px 55px', borderRadius: '20px', color: '#fff', fontSize: '16px', outline: 'none' }} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          {isAdmin && <button onClick={() => setShowAddModal(true)} style={{ background: 'orange', padding: '0 25px', borderRadius: '20px', border: 'none', cursor: 'pointer' }}><Plus color="#000" /></button>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
          {apps.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase())).map((app, i) => {
            const theme = cardThemes[i % cardThemes.length];
            return (
              <div key={i} style={{ background: theme.bg, padding: '30px', borderRadius: '35px', color: theme.text, display: 'flex', flexDirection: 'column', minHeight: '300px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
                    {/* Tamamen Şeffaf ve Çerçevesiz İkonlar */}
                    <img src={app.icon_url} style={{ width: '75px', height: '75px', objectFit: 'contain', background: 'transparent' }} alt={app.name} />
                    {isAdmin && <button onClick={() => syncAll(apps.filter(x => x.name !== app.name), storeLogo)} style={{ color: theme.text, opacity: 0.6, background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={22}/></button>}
                 </div>
                 <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '10px' }}>{app.name}</h3>
                 <p style={{ opacity: 0.8, fontSize: '14px', marginBottom: '30px', flex: 1 }}>{app.description}</p>
                 <a href={app.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', color: theme.text, padding: '15px', borderRadius: '18px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.1)' }}>
                   HEMEN AÇ / YÜKLE
                 </a>
              </div>
            );
          })}
        </div>
      </main>

      {/* MODALLAR (Admin, Ayarlar ve Ekleme) */}
      {showSettingsModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#111', padding: '30px', borderRadius: '30px', width: '100%', maxWidth: '400px', border: '1px solid #222' }}>
            <h3 style={{ marginBottom: '20px', color: 'orange' }}>Mağaza Ayarları</h3>
            <input value={storeLogo} placeholder="Logo URL" onChange={(e) => setStoreLogo(e.target.value)} style={inputStyle} />
            <button onClick={() => { syncAll(apps, storeLogo); setShowSettingsModal(false); }} style={{ width: '100%', background: 'orange', padding: '15px', borderRadius: '15px', fontWeight: 'bold', marginTop: '20px', cursor: 'pointer', border: 'none' }}>KAYDET</button>
            <button onClick={() => setShowSettingsModal(false)} style={{ width: '100%', background: 'none', border: 'none', color: '#444', marginTop: '10px', cursor: 'pointer' }}>Kapat</button>
          </div>
        </div>
      )}

      {showAdminModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form onSubmit={handleAdminLogin} style={{ background: '#111', padding: '40px', borderRadius: '30px', border: '1px solid #222' }}>
            <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>Admin Girişi</h3>
            <input type="password" placeholder="Şifre" style={inputStyle} onChange={(e) => setPassword(e.target.value)} autoFocus />
            <button style={{ width: '100%', background: 'orange', color: '#000', padding: '15px', borderRadius: '15px', border: 'none', fontWeight: 'bold', marginTop: '15px', cursor: 'pointer' }}>GİRİŞ</button>
          </form>
        </div>
      )}

      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#111', padding: '30px', borderRadius: '30px', width: '100%', maxWidth: '450px', border: '1px solid #222' }}>
            <h3 style={{ marginBottom: '20px', color: 'orange' }}>Uygulama Ekle</h3>
            <input placeholder="Uygulama Adı" style={inputStyle} onChange={e => setNewApp({...newApp, name: e.target.value})} />
            <input placeholder="Açıklama" style={inputStyle} onChange={e => setNewApp({...newApp, description: e.target.value})} />
            <input placeholder="Uygulama URL" style={inputStyle} onChange={e => setNewApp({...newApp, url: e.target.value})} />
            <input placeholder="İkon URL" style={inputStyle} onChange={e => setNewApp({...newApp, icon_url: e.target.value})} />
            <button onClick={() => { syncAll([...apps, newApp], storeLogo); setShowAddModal(false); }} style={{ width: '100%', background: 'orange', padding: '15px', borderRadius: '15px', border: 'none', fontWeight: 'bold', marginTop: '10px', cursor: 'pointer' }}>EKLE</button>
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
