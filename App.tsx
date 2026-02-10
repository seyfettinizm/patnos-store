import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Müzik kutusuyla aynı veritabanını kullanabiliriz, karışıklık olmaz.
const supabase = createClient(
  'https://docdtizfqeolqwwfaiyi.supabase.co', 
  'sb_publishable_0TzP8UOehq9blzjKfAQULQ_3zxLCE80'
);

export default function PatnosStore() {
  const [view, setView] = useState<'store' | 'admin'>('store');
  const [isAuth, setIsAuth] = useState(false);
  const [apps, setApps] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', desc: '', link: '', icon: '' });

  useEffect(() => { loadApps(); }, []);

  const loadApps = async () => {
    const { data } = await supabase.from('settings').select('value').eq('id', 'store_data').single();
    if (data?.value) setApps(data.value.apps || []);
  };

  const saveApps = async (newApps: any[]) => {
    await supabase.from('settings').upsert({ id: 'store_data', value: { apps: newApps } });
    setApps(newApps);
  };

  const handleAddApp = () => {
    const newApps = [{ ...form, id: Date.now() }, ...apps];
    saveApps(newApps);
    setForm({ name: '', desc: '', link: '', icon: '' });
  };

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', padding: '20px' }}>
      
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: 'orange', fontSize: '28px', margin: '0' }}>PATNOS STORE</h1>
        <p style={{ color: '#666', fontSize: '14px' }}>Dijital Dünyadaki Merkeziniz</p>
        <button onClick={() => setView(view === 'store' ? 'admin' : 'store')} style={{ background: 'none', border: 'none', color: '#333', marginTop: '10px', fontSize: '12px' }}>
          {view === 'store' ? '⚙️ Yönetim' : '🏠 Mağazaya Dön'}
        </button>
      </header>

      {view === 'admin' ? (
        <div style={{ maxWidth: '500px', margin: 'auto', background: '#111', padding: '20px', borderRadius: '15px' }}>
          {!isAuth ? (
            <input type="password" placeholder="Şifre..." style={inputS} onKeyDown={e => e.key === 'Enter' && (e.currentTarget.value === "Mihriban04" ? setIsAuth(true) : alert("Hatalı!"))} />
          ) : (
            <div>
              <h3 style={{color:'orange'}}>Yeni Uygulama Ekle</h3>
              <input placeholder="Uygulama Adı" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} style={inputS}/>
              <input placeholder="Açıklama" value={form.desc} onChange={e=>setForm({...form, desc:e.target.value})} style={inputS}/>
              <input placeholder="Link (Vercel Adresi)" value={form.link} onChange={e=>setForm({...form, link:e.target.value})} style={inputS}/>
              <input placeholder="İkon URL" value={form.icon} onChange={e=>setForm({...form, icon:e.target.value})} style={inputS}/>
              <button onClick={handleAddApp} style={btnS}>MAĞAZAYA EKLE</button>
              
              <div style={{marginTop:'30px'}}>
                {apps.map(app => (
                  <div key={app.id} style={{display:'flex', justifyContent:'space-between', padding:'10px', borderBottom:'1px solid #222'}}>
                    <span>{app.name}</span>
                    <button onClick={() => saveApps(apps.filter(a => a.id !== app.id))} style={{color:'red', background:'none', border:'none'}}>SİL</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ maxWidth: '600px', margin: 'auto' }}>
          {apps.length === 0 && <p style={{textAlign:'center', color:'#444'}}>Henüz uygulama eklenmedi.</p>}
          {apps.map(app => (
            <div key={app.id} style={cardS}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <img src={app.icon || 'https://via.placeholder.com/60'} style={{ width: '60px', height: '60px', borderRadius: '12px' }} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px' }}>{app.name}</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>{app.desc}</p>
                </div>
              </div>
              <a href={app.link} target="_blank" rel="noreferrer" style={openBtnS}>AÇ</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const inputS = { width: '100%', padding: '12px', marginBottom: '10px', background: '#000', border: '1px solid #222', color: '#fff', borderRadius: '8px' };
const btnS = { width: '100%', padding: '12px', background: 'orange', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };
const cardS = { background: '#111', padding: '15px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', border: '1px solid #222' };
const openBtnS = { background: '#222', color: 'orange', padding: '8px 20px', borderRadius: '20px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', border: '1px solid orange' };
