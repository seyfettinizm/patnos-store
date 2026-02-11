import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { Smartphone, X } from 'lucide-react';

const supabase = createClient(
  'https://docdtizfqeolqwwfaiyi.supabase.co', 
  'sb_publishable_0TzP8UOehq9blzjKfAQULQ_3zxLCE80'
);

const App = () => {
  const [apps, setApps] = useState<any[]>([]);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    // Verileri çek
    supabase.from('settings').select('value').eq('id', 'store_data').single().then(({data}) => {
      if (data?.value) setApps(data.value.apps || []);
    });
  }, []);

  // YÜKLE BUTONUNA BASILINCA ÇIKACAK YENİ MESAJ
  const openGuide = () => {
    alert("🚀 PATNOS STORE YÜKLEME\n\n1. Sağ üstteki 3 noktaya dokunun.\n2. 'Uygulamayı Yükle' seçeneğini seçin.\n3. Artık yonca ikonlu mağazanız hazır!");
  };

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* Üst Logo Alanı */}
      <nav style={{ padding: '15px', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0a0a0a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
          <span style={{ fontWeight: 'bold', fontSize: '16px' }}>PATNOS STORE</span>
        </div>
        <div style={{ background: 'orange', padding: '6px 15px', borderRadius: '20px', color: '#000', fontSize: '11px', fontWeight: 'bold' }}>MAĞAZA</div>
      </nav>

      {/* DÜZELTİLEN TURUNCU BANNER */}
      {showBanner && (
        <div style={{ background: '#111', padding: '12px 15px', borderBottom: '3px solid orange', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Smartphone size={20} color="orange" />
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Uygulama olarak kullanın</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              onClick={openGuide}
              style={{ 
                background: 'orange', // BUTON RENGİ TURUNCU
                color: '#000',        // YAZI RENGİ SİYAH
                border: 'none', 
                padding: '8px 20px', 
                borderRadius: '10px', 
                fontWeight: '900', 
                fontSize: '12px' 
              }}
            >
              YÜKLE
            </button>
            <X size={20} color="#444" onClick={() => setShowBanner(false)} />
          </div>
        </div>
      )}

      <main style={{ padding: '30px 20px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '26px', fontWeight: '900', marginBottom: '40px' }}>
          Patnos <span style={{ color: 'orange' }}>Dijital Arşivi</span>
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          {apps.map((app, i) => (
            <div key={i} style={{ background: '#111', padding: '20px', borderRadius: '25px', border: '1px solid #222', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <img src={app.icon_url} style={{ width: '50px', height: '50px', borderRadius: '12px' }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '18px', margin: '0 0 5px 0' }}>{app.name}</h3>
                <p style={{ color: '#666', fontSize: '12px', margin: 0 }}>{app.description}</p>
              </div>
              <a href={app.url} target="_blank" style={{ background: '#222', color: '#fff', padding: '8px 15px', borderRadius: '12px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', border: '1px solid #333' }}>AÇ</a>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) { ReactDOM.createRoot(rootElement).render(<App />); }
