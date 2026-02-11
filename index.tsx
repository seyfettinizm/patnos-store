import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { Smartphone, X, Search, Plus, Trash2, LayoutGrid, Settings, LogOut, Globe } from 'lucide-react';

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [password, setPassword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showBanner, setShowBanner] = useState(true);
  const [newApp, setNewApp] = useState({ name: '', description: '', url: '', icon_url: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const { data } = await supabase.from('settings').select('value').eq('id', 'store_data').single();
    if (data?.value) setApps(data.value.apps || []);
  };

  const syncApps = async (updatedApps: any[]) => {
    await supabase.from('settings').upsert({ id: 'store_data', value: { apps: updatedApps } });
    setApps(updatedApps);
    setShowAddModal(false);
    setNewApp({ name: '', description: '', url: '', icon_url: '' });
  };

  const openGuide = () => {
    alert("📲 YÜKLEME REHBERİ\n\n🤖 ANDROID:\n3 Nokta > Uygulamayı Yükle\n\n🍎 IPHONE:\nPaylaş (Yukarı Ok) > Ana Ekrana Ekle");
  };

  const filteredApps = apps.filter(app => app.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div style={{ background: '#0a0a0a', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: '100px' }}>
      
      {/* Navbar */}
      <nav style={{ padding: '15px 20px', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo.png" style={{ width: '40px', height: '40px', borderRadius: '10px' }} />
          <span style={{ fontWeight: '900', letterSpacing: '1px', fontSize: '18px' }}>PATNOS STORE</span>
        </div>
        <button onClick={() => isAdmin ? setIsAdmin(false) : setShowAdminModal(true)} style={{ background: isAdmin ? '#ff4444' : 'orange', border: 'none', padding: '8px 18px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#000' }}>
          {isAdmin ? <LogOut size={16}/> : <Settings size={16}/>}
          {isAdmin ? 'Panelden Çık' : 'Yönetim'}
        </button>
      </nav>

      {/* Banner */}
      {showBanner && (
        <div style={{ background: '#111', padding: '12px 20px', borderBottom: '2px solid orange', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Smartphone size={18} color="orange" />
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Cihaza Uygulama Olarak Ekle</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={openGuide} style={{ background: 'orange', color: '#000', border: 'none', padding: '7px 15px', borderRadius: '10px', fontWeight: '900', fontSize: '11px' }}>YÜKLE</button>
            <X size={18} color="#444" onClick={() => setShowBanner(false)} />
          </div>
        </div>
      )}

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* Karşılama Mesajı */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
           <h1 style={{ fontSize: '42px', fontWeight: '900', marginBottom: '15px' }}>Patnos <span style={{ color: 'orange' }}>Dijital Arşivi</span></h1>
           <p style={{ color: '#888', maxWidth: '600px', margin: '0 auto' }}>"İzmir Patnoslular Derneği projeleri ve kültürel hazinelerimizle buluştuğunuz tek dijital noktanız."</p>
           <div style={{ width: '60px', height: '4px', background: 'orange', margin: '25px auto', borderRadius: '2px' }}></div>
        </div>

        {/* Arama ve Ekleme Barı */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '40px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, position: 'relative', minWidth: '280px' }}>
            <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} size={20} />
            <input 
              type="text" 
              placeholder="Uygulama ara..." 
              style={{ width: '100%', background: '#111', border: '1px solid #222', padding: '15px 15px 15px 45px', borderRadius: '15px', color: '#fff', outline: 'none' }}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {isAdmin && (
            <button onClick={() => setShowAddModal(true)} style={{ background: 'orange', color: '#000', border: 'none', padding: '15px 25px', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={20}/> Yeni Uygulama Ekle
            </button>
          )}
        </div>

        {/* Uygulama Kartları */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
          {filteredApps.map((app, i) => {
            const theme = cardThemes[i % cardThemes.length];
            return (
              <div key={i} style={{ background: theme.bg, padding: '30px', borderRadius: '35px', color: theme.text, display: 'flex', flexDirection: 'column', minHeight: '300px', position: 'relative', boxShadow: '0 15px 30px rgba(0,0,0,0.3)' }}>
                {isAdmin && (
                  <button onClick={() => syncApps(apps.filter((_, index) => index !== i))} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.3)', border: 'none', color: '#fff', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}>
                    <Trash2 size={18}/>
                  </button>
                )}
                <img src={app.icon_url} style={{ width: '70px', height: '70px', borderRadius: '20px', marginBottom: '20px', boxShadow: '0 8px 15px rgba(0,0,0,0.2)' }} />
                <h3 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '10px' }}>{app.name}</h3>
                <p style={{ opacity: 0.8, fontSize: '14px', flex: 1, marginBottom: '25px' }}>{app.description}</p>
                <a href={app.url} target="_blank" style={{ textDecoration: 'none', textAlign: 'center', background: 'rgba(255,255,255,0.2)', color: theme.text, padding: '14px', borderRadius: '18px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(5px)' }}>
                  HEMEN AÇ / YÜKLE
                </a>
              </div>
            );
          })}
        </div>
      </main>

      {/* Admin Şifre Modal */}
      {showAdminModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#111', padding: '40px', borderRadius: '30px', border: '1px solid #222', width: '90%', maxWidth: '350px' }}>
            <h3 style={{ color: 'orange', marginBottom: '20px', textAlign: 'center' }}>Yönetici Girişi</h3>
            <input type="password" placeholder="Şifre" style={{ width: '100%', background: '#000', border: '1px solid #222', padding: '15px', borderRadius: '15px', color: '#fff', marginBottom: '15px' }} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={() => { if(password === 'Mihriban04') { setIsAdmin(true); setShowAdminModal(false); } else { alert('Hata!'); } }} style={{ width: '100%', background: 'orange', padding: '15px', borderRadius: '15px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>GİRİŞ YAP</button>
            <button onClick={() => setShowAdminModal(false)} style={{ width: '100%', background: 'none', border: 'none', color: '#555', marginTop: '10px' }}>Kapat</button>
          </div>
        </div>
      )}

      {/* Uygulama Ekleme Modalı */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#111', padding: '30px', borderRadius: '30px', border: '1px solid #222', width: '100%', maxWidth: '450px' }}>
            <h3 style={{ marginBottom: '20px' }}>Yeni Uygulama Kaydı</h3>
            <input type="text" placeholder="Uygulama Adı" style={{ width: '100%', background: '#000', border: '1px solid #222', padding: '12px', borderRadius: '10px', color: '#fff', marginBottom: '10px' }} onChange={(e) => setNewApp({...newApp, name: e.target.value})} />
            <textarea placeholder="Açıklama" style={{ width: '100%', background: '#000', border: '1px solid #222', padding: '12px', borderRadius: '10px', color: '#fff', marginBottom: '10px', height: '80px' }} onChange={(e) => setNewApp({...newApp, description: e.target.value})} />
            <input type="text" placeholder="Uygulama Linki (URL)" style={{ width: '100%', background: '#000', border: '1px solid #222', padding: '12px', borderRadius: '10px', color: '#fff', marginBottom: '10px' }} onChange={(e) => setNewApp({...newApp, url: e.target.value})} />
            <input type="text" placeholder="İkon Resmi Linki" style={{ width: '100%', background: '#000', border: '1px solid #222', padding: '12px', borderRadius: '10px', color: '#fff', marginBottom: '20px' }} onChange={(e) => setNewApp({...newApp, icon_url: e.target.value})} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => syncApps([...apps, newApp])} style={{ flex: 1, background: 'orange', padding: '12px', borderRadius: '10px', border: 'none', fontWeight: 'bold' }}>KAYDET</button>
              <button onClick={() => setShowAddModal(false)} style={{ flex: 1, background: '#222', padding: '12px', borderRadius: '10px', border: 'none', color: '#fff' }}>İPTAL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) { ReactDOM.createRoot(rootElement).render(<App />); }
