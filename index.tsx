import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { Smartphone, X, Search, Plus, Trash2, Settings, LogOut, Globe, Info, Monitor } from 'lucide-react';

const supabase = createClient(
  'https://docdtizfqeolqwwfaiyi.supabase.co', 
  'sb_publishable_0TzP8UOehq9blzjKfAQULQ_3zxLCE80'
);

const translations = {
  tr: {
    title: "Patnos",
    subtitle: "Dijital Arşivi",
    desc: "İzmir Patnoslular Derneği projeleri ve kültürel hazinelerimizle buluştuğunuz tek dijital noktanız.",
    search: "Uygulama ara...",
    install: "YÜKLE",
    open: "HEMEN AÇ / YÜKLE",
    admin: "Yönetim",
    logout: "Panelden Çık",
    newApp: "Yeni Uygulama Ekle",
    save: "KAYDET",
    cancel: "İPTAL",
    modalTitle: "Uygulamayı Yükle",
    modalDesc: "Lütfen cihaz tipinizi seçerek yükleme adımlarını takip edin.",
    androidStep: "Sağ üstteki 3 noktaya basın, ardından 'Paylaş / Yayınla' seçeneğine dokunun ve listeden 'Uygulamayı Yükle'yi seçin.",
    iosStep: "Alt kısımdaki 'Paylaş' (Yukarı Ok) simgesine dokunun ve 'Ana Ekrana Ekle' seçeneğini seçin."
  },
  ku: {
    title: "Patnos",
    subtitle: "Arşîva Dijîtal",
    desc: "Xala we ya dîjîtal a yekta ku hûn bi projeyên Komeleya Patnosiyên Îzmîrê û xezîneyên me yên çandî re dicivin.",
    search: "Li sepanê bigere...",
    install: "DAXÎNE",
    open: "NIHA VEKE / DAXÎNE",
    admin: "Rêveberî",
    logout: "Ji Panelê Derkeve",
    newApp: "Sepana Nû Zêde Bike",
    save: "BIQEIDÎNE",
    cancel: "BETAL BIKE",
    modalTitle: "Sepanê Daxîne",
    modalDesc: "Ji kerema xwe cureyê cîhaza xwe hilbijêrin.",
    androidStep: "Li ser 3 nuqteyan bitikînin, 'Parve bike' hilbijêrin û paşê 'Sepanê daxîne' bitikînin.",
    iosStep: "Li ser nîşana 'Parve bike' (Tîra jor) bitikînin û 'Li ser ekrana malê zêde bike' hilbijêrin."
  }
};

const cardThemes = [
  { bg: 'linear-gradient(135deg, #FF3CAC 0%, #784BA0 50%, #2B86C5 100%)', text: '#fff' },
  { bg: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)', text: '#fff' },
  { bg: 'linear-gradient(135deg, #85FFBD 0%, #FFFB7D 100%)', text: '#000' },
  { bg: 'linear-gradient(135deg, #FBAB7E 0%, #F7CE68 100%)', text: '#000' }
];

const App = () => {
  const [lang, setLang] = useState<'tr' | 'ku'>('tr');
  const [apps, setApps] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState<any>(null);
  const [password, setPassword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [newApp, setNewApp] = useState({ name: '', description: '', url: '', icon_url: '' });

  const t = translations[lang];

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const { data } = await supabase.from('settings').select('value').eq('id', 'store_data').single();
    if (data?.value) setApps(data.value.apps || []);
  };

  const syncApps = async (updatedApps: any[]) => {
    await supabase.from('settings').upsert({ id: 'store_data', value: { apps: updatedApps } });
    setApps(updatedApps);
    setShowAddModal(false);
  };

  const filteredApps = apps.filter(app => app.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div style={{ background: '#0a0a0a', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: '100px' }}>
      
      {/* Navbar */}
      <nav style={{ padding: '15px 20px', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo.png" style={{ width: '35px', height: '35px', borderRadius: '8px' }} />
          <span style={{ fontWeight: '900', letterSpacing: '1px', fontSize: '16px' }}>PATNOS STORE</span>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ display: 'flex', background: '#111', borderRadius: '15px', padding: '4px', border: '1px solid #222' }}>
            <button onClick={() => setLang('tr')} style={{ background: lang === 'tr' ? 'orange' : 'transparent', color: lang === 'tr' ? '#000' : '#fff', border: 'none', padding: '5px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>TR</button>
            <button onClick={() => setLang('ku')} style={{ background: lang === 'ku' ? 'orange' : 'transparent', color: lang === 'ku' ? '#000' : '#fff', border: 'none', padding: '5px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>KU</button>
          </div>
          
          <button onClick={() => isAdmin ? setIsAdmin(false) : setShowAdminModal(true)} style={{ background: isAdmin ? '#ff4444' : 'orange', border: 'none', padding: '7px 15px', borderRadius: '15px', fontWeight: 'bold', fontSize: '11px', color: '#000', display: 'flex', alignItems: 'center', gap: '5px' }}>
            {isAdmin ? <LogOut size={14}/> : <Settings size={14}/>}
            {isAdmin ? t.logout : t.admin}
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
           <h1 style={{ fontSize: '42px', fontWeight: '900', marginBottom: '15px' }}>{t.title} <span style={{ color: 'orange' }}>{t.subtitle}</span></h1>
           <p style={{ color: '#888', maxWidth: '600px', margin: '0 auto', fontSize: '15px', lineHeight: '1.6' }}>{t.desc}</p>
        </div>

        <div style={{ display: 'flex', gap: '15px', marginBottom: '40px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, position: 'relative', minWidth: '280px' }}>
            <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} size={20} />
            <input 
              type="text" 
              placeholder={t.search} 
              style={{ width: '100%', background: '#111', border: '1px solid #222', padding: '15px 15px 15px 45px', borderRadius: '15px', color: '#fff' }}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {isAdmin && (
            <button onClick={() => setShowAddModal(true)} style={{ background: 'orange', color: '#000', border: 'none', padding: '15px 25px', borderRadius: '15px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={20}/> {t.newApp}
            </button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
          {filteredApps.map((app, i) => {
            const theme = cardThemes[i % cardThemes.length];
            return (
              <div key={i} style={{ background: theme.bg, padding: '30px', borderRadius: '35px', color: theme.text, display: 'flex', flexDirection: 'column', minHeight: '300px', position: 'relative' }}>
                {isAdmin && (
                  <button onClick={() => syncApps(apps.filter((_, index) => index !== i))} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.3)', border: 'none', color: '#fff', padding: '8px', borderRadius: '50%' }}>
                    <Trash2 size={18}/>
                  </button>
                )}
                <img src={app.icon_url} style={{ width: '70px', height: '70px', borderRadius: '20px', marginBottom: '20px' }} />
                <h3 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '10px' }}>{app.name}</h3>
                <p style={{ opacity: 0.8, fontSize: '14px', flex: 1, marginBottom: '25px' }}>{app.description}</p>
                <button 
                  onClick={() => setShowGuideModal(app)}
                  style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.2)', color: theme.text, padding: '14px', borderRadius: '18px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(5px)' }}
                >
                  {t.open}
                </button>
              </div>
            );
          })}
        </div>
      </main>

      {/* AKILLI SEÇİM MODALI */}
      {showGuideModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '25px', width: '90%', maxWidth: '380px', color: '#000', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '15px' }}>
              <img src={showGuideModal.icon_url} style={{ width: '40px', height: '40px', borderRadius: '10px' }} />
              <h3 style={{ fontWeight: '900' }}>{showGuideModal.name}</h3>
            </div>
            
            <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>{t.modalTitle}</p>

            {/* Android */}
            <div style={{ background: '#fef3c7', padding: '15px', borderRadius: '15px', marginBottom: '15px', border: '2px solid orange', textAlign: 'left' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '900', fontSize: '18px' }}>Android:</span>
                  <button onClick={() => window.open(showGuideModal.url, '_blank')} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '8px', fontWeight: 'bold' }}>AÇ / YÜKLE</button>
               </div>
               <p style={{ fontSize: '12px', color: '#444', lineHeight: '1.4' }}>{t.androidStep}</p>
            </div>

            {/* iPhone */}
            <div style={{ background: '#fffbeb', padding: '15px', borderRadius: '15px', border: '1px solid #ddd', textAlign: 'left', marginBottom: '20px' }}>
               <span style={{ fontWeight: '900', fontSize: '18px', display: 'block', marginBottom: '8px' }}>iPhone (iOS):</span>
               <p style={{ fontSize: '12px', color: '#444', lineHeight: '1.4' }}>{t.iosStep}</p>
            </div>

            <button onClick={() => setShowGuideModal(null)} style={{ width: '100%', background: '#333', color: '#fff', padding: '12px', borderRadius: '12px', border: 'none', fontWeight: 'bold' }}>KAPAT</button>
          </div>
        </div>
      )}

      {/* Admin Giriş */}
      {showAdminModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#111', padding: '40px', borderRadius: '30px', border: '1px solid #222', width: '90%', maxWidth: '350px' }}>
            <h3 style={{ color: 'orange
