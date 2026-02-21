import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { Smartphone, X, Search, Plus, Trash2, Settings, LogOut, Globe, Info } from 'lucide-react';

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
    banner: "Cihaza Uygulama Olarak Ekle",
    newApp: "Yeni Uygulama Ekle",
    guide: "📲 YÜKLEME REHBERİ\n\n🤖 ANDROID:\n3 Nokta > Uygulamayı Yükle\n\n🍎 IPHONE:\nPaylaş (Yukarı Ok) > Ana Ekrana Ekle",
    save: "KAYDET",
    cancel: "İPTAL",
    iosTitle: "iPhone Kullanıcıları İçin",
    iosDesc: "Bu uygulamayı ana ekranınıza ekleyerek tam ekran kullanabilirsiniz.",
    iosStep: "Paylaş butonuna (yukarı ok) basın ve 'Ana Ekrana Ekle' seçeneğini seçin."
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
    banner: "Wekî sepanê li cîhazê zêde bike",
    newApp: "Sepana Nû Zêde Bike",
    guide: "📲 RÊBERA DAXISTINÊ\n\n🤖 ANDROID:\n3 Nuqte > Sepanê Daxîne\n\n🍎 IPHONE:\nParve bike (Tîra jor) > Li ser ekrana malê zêde bike",
    save: "BIQEIDÎNE",
    cancel: "BETAL BIKE",
    iosTitle: "Ji bo Bikarhênerên iPhone",
    iosDesc: "Hûn dikarin vê sepanê li ekrana xweya malê zêde bikin.",
    iosStep: "Bişkoka 'Parve bike' bikişînin û 'Li ser ekrana malê zêde bike' hilbijêrin."
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
  const [showIosModal, setShowIosModal] = useState(false);
  const [password, setPassword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showBanner, setShowBanner] = useState(true);
  const [newApp, setNewApp] = useState({ name: '', description: '', url: '', icon_url: '', apk_url: '' });

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

  const handleInstallClick = (app: any) => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);

    if (isAndroid && app.apk_url) {
      window.location.href = app.apk_url;
    } else if (isIOS) {
      setShowIosModal(true);
    } else {
      window.open(app.url, '_blank');
    }
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

      {/* Banner */}
      {showBanner && (
        <div style={{ background: '#111', padding: '10px 20px', borderBottom: '2px solid orange', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Smartphone size={16} color="orange" />
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{t.banner}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={() => alert(t.guide)} style={{ background: 'orange', color: '#000', border: 'none', padding: '6px 15px', borderRadius: '10px', fontWeight: '900', fontSize: '11px' }}>{t.install}</button>
            <X size={18} color="#444" onClick={() => setShowBanner(false)} />
          </div>
        </div>
      )}

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
           <h1 style={{ fontSize: '42px', fontWeight: '900', marginBottom: '15px' }}>{t.title} <span style={{ color: 'orange' }}>{t.subtitle}</span></h1>
           <p style={{ color: '#888', maxWidth: '600px', margin: '0 auto', fontSize: '15px', lineHeight: '1.6' }}>{t.desc}</p>
           <div style={{ width: '60px', height: '4px', background: 'orange', margin: '25px auto', borderRadius: '2px' }}></div>
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
                  onClick={() => handleInstallClick(app)}
                  style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.2)', color: theme.text, padding: '14px', borderRadius: '18px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(5px)' }}
                >
                  {t.open}
                </button>
              </div>
            );
          })}
        </div>
      </main>

      {/* iOS Bilgi Modalı */}
      {showIosModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ background: '#1c1c1e', padding: '30px', borderRadius: '25px', width: '85%', maxWidth: '320px', textAlign: 'center' }}>
            <div style={{ background: 'orange', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Info color="#000" />
            </div>
            <h3 style={{ marginBottom: '10px' }}>{t.iosTitle}</h3>
            <p style={{ fontSize: '14px', color: '#888', marginBottom: '20px' }}>{t.iosDesc}</p>
            <div style={{ background: '#2c2c2e', padding: '15px', borderRadius: '15px', fontSize: '13px', marginBottom: '25px' }}>
              {t.iosStep}
            </div>
            <button onClick={() => setShowIosModal(false)} style={{ width: '100%', background: 'orange', padding: '12px', borderRadius: '12px', border: 'none', fontWeight: 'bold' }}>ANLADIM</button>
          </div>
        </div>
      )}

      {/* Admin Modalı */}
      {showAdminModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#111', padding: '40px', borderRadius: '30px', border: '1px solid #222', width: '90%', maxWidth: '350px' }}>
            <h3 style={{ color: 'orange', marginBottom: '20px', textAlign: 'center' }}>{t.admin}</h3>
            <input type="password" placeholder="****" style={{ width: '100%', background: '#000', border: '1px solid #222', padding: '15px', borderRadius: '15px', color: '#fff', marginBottom: '15px' }} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={() => { if(password === 'Mihriban04') { setIsAdmin(true); setShowAdminModal(false); } else { alert('Hatalı Şifre!'); } }} style={{ width: '100%', background: 'orange', padding: '15px', borderRadius: '15px', border: 'none', fontWeight: 'bold' }}>GİRİŞ</button>
            <button onClick={() => setShowAdminModal(false)} style={{ width: '100%', background: 'transparent', color: '#555', marginTop: '10px', border: 'none' }}>Kapat</button>
          </div>
        </div>
      )}

      {/* Uygulama Ekleme Modalı */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#111', padding: '30px', borderRadius: '30px', border: '1px solid #222', width: '100%', maxWidth: '450px' }}>
            <h3 style={{ marginBottom: '20px' }}>{t.newApp}</h3>
            <input type="text" placeholder="Uygulama Adı" style={{ width: '100%', background: '#000', border: '1px solid #222', padding: '12px', borderRadius: '10px', color: '#fff', marginBottom: '10px' }} onChange={(e) => setNewApp({...newApp, name: e.target.value})} />
            <textarea placeholder="Açıklama" style={{ width: '100%', background: '#000', border: '1px solid #222', padding: '12px', borderRadius: '10px', color: '#fff', marginBottom: '10px' }} onChange={(e) => setNewApp({...newApp, description: e.target.value})} />
            <input type="text" placeholder="Web Adresi (Vercel Linki)" style={{ width: '100%', background: '#000', border: '1px solid #222', padding: '12px', borderRadius: '10px', color: '#fff', marginBottom: '10px' }} onChange={(e) => setNewApp({...newApp, url: e.target.value})} />
            <input type="text" placeholder="İkon Linki (URL)" style={{ width: '100%', background: '#000', border: '1px solid #222', padding: '12px', borderRadius: '10px', color: '#fff', marginBottom: '10px' }} onChange={(e) => setNewApp({...newApp, icon_url: e.target.value})} />
            <input type="text" placeholder="APK İndirme Linki (Google Drive vb.)" style={{ width: '100%', background: '#000', border: '1px solid #cc7a00', padding: '12px', borderRadius: '10px', color: '#fff', marginBottom: '20px' }} onChange={(e) => setNewApp({...newApp, apk_url: e.target.value})} />
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => syncApps([...apps, newApp])} style={{ flex: 1, background: 'orange', padding: '12px', borderRadius: '10px', border: 'none', fontWeight: 'bold' }}>{t.save}</button>
              <button onClick={() => setShowAddModal(false)} style={{ flex: 1, background: '#222', padding: '12px', borderRadius: '10px', border: 'none', color: '#fff' }}>{t.cancel}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) { ReactDOM.createRoot(rootElement).render(<App />); }
