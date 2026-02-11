import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { Smartphone, X, Apple } from 'lucide-react';

const supabase = createClient(
  'https://docdtizfqeolqwwfaiyi.supabase.co', 
  'sb_publishable_0TzP8UOehq9blzjKfAQULQ_3zxLCE80'
);

const App = () => {
  const [apps, setApps] = useState<any[]>([]);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    supabase.from('settings').select('value').eq('id', 'store_data').single().then(({data}) => {
      if (data?.value) setApps(data.value.apps || []);
    });
  }, []);

  const openGuide = () => {
    alert("📲 PATNOS STORE YÜKLEME REHBERİ\n\n🤖 ANDROID İÇİN:\n1. Sağ üstteki 3 noktaya basın.\n2. 'Uygulamayı Yükle' veya 'Ana Ekrana Ekle' deyin.\n\n🍎 IPHONE İÇİN:\n1. Alttaki 'Paylaş' (yukarı ok) simgesine basın.\n2. 'Ana Ekrana Ekle' seçeneğini bulun ve dokunun.");
  };

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* Navbar */}
      <nav style={{ padding: '15px', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0a0a0a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" style={{ width: '40px', height: '40px', borderRadius: '10px' }} />
          <span style={{ fontWeight: 'bold', letterSpacing: '1px' }}>PATNOS STORE</span>
        </div>
        <div style={{ background: 'orange', padding: '6px 15px', borderRadius: '20px', color: '#000', fontSize: '11px', fontWeight: 'bold' }}>MAĞAZA</div>
      </nav>

      {/* Turuncu Banner */}
      {showBanner && (
        <div style={{ background: '#111', padding: '12px 15px', borderBottom: '3px solid orange', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Smartphone size={18} color="orange" />
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Uygulama olarak ekleyin</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={openGuide} style={{ background: 'orange', color: '#000', border: 'none', padding: '8px 18px', borderRadius: '10px', fontWeight: '900', fontSize: '12px', boxShadow: '0 4px 10px rgba(255,165,0,0.2)' }}>YÜKLE</button>
            <X size={20} color="#444" onClick={() => setShowBanner(false)} />
          </div>
        </div>
      )}

      <main style={{ padding: '40px 20px' }}>
        {/* Geri Gelen Karşılama Mesajı */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
           <h1 style={{ fontSize: '36px', fontWeight: '900', marginBottom: '10px' }}>Patnos <span style={{ color: 'orange' }}>Dijital Arşivi</span></h1>
           <p style={{ color: '#888', fontSize: '15px', fontStyle: 'italic' }}>"Dijital hazinemiz parmaklarınızın ucunda."</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {apps.map((app, i) => (
            <div key={i} style={{ background: 'linear-gradient(145deg, #111, #050505)', padding: '25px', borderRadius: '30px', border: '1px solid #222', textAlign: 'center' }}>
              <img src={app.icon_url} style={{ width: '70px', height: '70px', borderRadius: '15px', marginBottom: '15px', boxShadow: '0 10px 20px rgba(0,0,0,0.5)' }} />
              <h3 style={{ fontSize: '22px', marginBottom: '8px' }}>{app.name}</h3>
              <p style={{ color: '#666', fontSize: '13px', marginBottom: '25px', minHeight: '40px' }}>{app.description}</p>
              <a href={app.url} target="_blank" style={{ display: 'block', background: 'orange', color: '#000', padding: '12px', borderRadius: '15px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>YÜKLE / AÇ</a>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) { ReactDOM.createRoot(rootElement).render(<App />); }
