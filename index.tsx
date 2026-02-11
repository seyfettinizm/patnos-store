import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { Smartphone, X, Search, Plus, Trash2, LayoutGrid, Settings } from 'lucide-react';

const supabase = createClient(
  'https://docdtizfqeolqwwfaiyi.supabase.co', 
  'sb_publishable_0TzP8UOehq9blzjKfAQULQ_3zxLCE80'
);

// Modern kart renkleri
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
  const [password, setPassword] = useState('');
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data } = await supabase.from('settings').select('value').eq('id', 'store_data').single();
    if (data?.value) setApps(data.value.apps || []);
  };

  const openGuide = () => {
    alert("📲 PATNOS STORE YÜKLEME REHBERİ\n\n🤖 ANDROID:\n3 Nokta > Uygulamayı Yükle\n\n🍎 IPHONE:\nPaylaş (Yukarı Ok) > Ana Ekrana Ekle");
  };

  return (
    <div style={{ background: '#0a0a0a', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: '50px' }}>
      
      {/* Navbar */}
      <nav style={{ padding: '15px 20px', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo.png" style={{ width: '40px', height: '40px', borderRadius: '10px' }} />
          <span style={{ fontWeight: '900', letterSpacing: '1px', fontSize: '18px' }}>PATNOS STORE</span>
        </div>
        <button 
          onClick={() => isAdmin ? setIsAdmin(false) : setShowAdminModal(true)} 
          style={{ background: 'orange', border: 'none', padding: '8px 18px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}
        >
          {isAdmin ? 'Panelden Çık' : 'Yönetim'}
        </button>
      </nav>

      {/* Turuncu Banner */}
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
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
           <h1 style={{ fontSize: '42px', fontWeight: '900', marginBottom: '15px', lineHeight: '1.1' }}>
             Patnos <span style={{ color: 'orange' }}>Dijital Arşivi</span>
           </h1>
           <p style={{ color: '#888', fontSize: '16px', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
             "İzmir Patnoslular Derneği projeleri ve kültürel hazinelerimizle buluştuğunuz tek dijital noktanız."
           </p>
           <div style={{ width: '80px', height: '4px', background: 'orange', margin: '30px auto', borderRadius: '2px' }}></div>
        </div>

        {/* Uygulama Kartları (İstediğin Modern Görünüm) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
          {apps.map((app, i) => {
            const theme = cardThemes[i % cardThemes.length];
            return (
              <div key={i} style={{ 
                background: theme.bg, 
                padding: '30px', 
                borderRadius: '35px', 
                color: theme.text, 
                display: 'flex', 
                flexDirection: 'column', 
                minHeight: '280px', 
                boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
                position: 'relative',
                transition: 'transform 0.3s'
              }}>
                <img src={app.icon_url} style={{ width: '70px', height: '70px', borderRadius: '20px', marginBottom: '20px', boxShadow: '0 8px 15px rgba(0,0,0,0.2)' }} />
                <h3 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '10px' }}>{app.name}</h3>
                <p style={{ opacity: 0.8, fontSize: '14px', flex: 1, marginBottom: '25px', fontWeight: '500' }}>{app.description}</p>
                <a href={app.url} target="_blank" style={{ 
                  textDecoration: 'none', 
                  textAlign: 'center', 
                  background: 'rgba(255,255,255,0.2)', 
                  color: theme.text, 
                  padding: '14px', 
                  borderRadius: '18px', 
                  fontWeight: 'bold', 
                  backdropFilter: 'blur(5px)',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}>
                  HEMEN AÇ / YÜKLE
                </a>
              </div>
            );
          })}
        </div>
      </main>

      {/* Yönetici Giriş Modalı */}
      {showAdminModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#111', padding: '40px', borderRadius: '30px', border: '1px solid #222', width: '100%', maxWidth: '350px', textAlign: 'center' }}>
            <h3 style={{ color: 'orange', marginBottom: '25px', fontSize: '20px' }}>Yönetici Girişi</h3>
            <input 
              type="password" 
              placeholder="Şifre" 
              style={{ width: '100%', background: '#000', border: '1px solid #333', padding: '15px', borderRadius: '15px', color: '#fff', outline: 'none', marginBottom: '15px' }} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <button 
              onClick={() => { if(password === 'Mihriban04') { setIsAdmin(true); setShowAdminModal(false); } else { alert('Hatalı Şifre!'); } }}
              style={{ width: '100%', background: 'orange', padding: '15px', borderRadius: '15px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
            >
              GİRİŞ YAP
            </button>
            <button onClick={() => setShowAdminModal(false)} style={{ background: 'none', border: 'none', color: '#555', marginTop: '15px', cursor: 'pointer' }}>Kapat</button>
          </div>
        </div>
      )}
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) { ReactDOM.createRoot(rootElement).render(<App />); }
