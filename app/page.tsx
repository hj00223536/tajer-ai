'use client';

import { useMemo, useState } from 'react';

type Kind = 'ad' | 'post' | 'product';
type Draft = { id: string; kind: Kind; product: string; output: string; date: string };

export default function Home() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [kind, setKind] = useState<Kind>('ad');
  const [product, setProduct] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('احترافي');
  const [output, setOutput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [tab, setTab] = useState<'create' | 'history'>('create');
  const isAr = language === 'ar';
  const t = useMemo(() => isAr ? {
    tagline:'مساعدك التجاري الذكي', dashboard:'مساحة العمل', create:'إنشاء محتوى', history:'المحفوظات', welcome:'حوّل أفكارك إلى محتوى يبيع', intro:'أنشئ محتوى تسويقياً واضحاً لمنتجاتك خلال ثوانٍ.', type:'نوع المحتوى', ad:'إعلان تسويقي', post:'منشور اجتماعي', product:'وصف منتج', name:'ما المنتج أو الخدمة؟', nameHint:'مثال: عطر شرقي فاخر بحجم 100 مل', audience:'الجمهور المستهدف', audienceHint:'مثال: محبو العطور والهدايا', tone:'نبرة الكتابة', generate:'أنشئ المحتوى', generating:'جارٍ الإنشاء...', result:'النتيجة', copy:'نسخ النص', save:'حفظ المسودة', empty:'اكتب وصفاً للمنتج ثم اضغط إنشاء المحتوى.', historyEmpty:'لا توجد مسودات محفوظة بعد.', saved:'تم حفظ المسودة في هذه الجلسة.', copied:'تم النسخ', footer:'TAJER AI • نسخة أولية تجريبية', warning:'المحتوى القالبّي متاح دون ربط مزود AI. أضف مفاتيح المزود في إعدادات Vercel لتفعيل التوليد الذكي.'
  } : {
    tagline:'Your smart business assistant', dashboard:'Workspace', create:'Create content', history:'Saved drafts', welcome:'Turn ideas into content that sells', intro:'Create clear marketing content for your products in seconds.', type:'Content type', ad:'Marketing ad', post:'Social post', product:'Product description', name:'What is your product or service?', nameHint:'Example: Premium oriental perfume, 100 ml', audience:'Target audience', audienceHint:'Example: Fragrance lovers and gift shoppers', tone:'Writing tone', generate:'Generate content', generating:'Generating...', result:'Result', copy:'Copy text', save:'Save draft', empty:'Describe your product, then generate content.', historyEmpty:'No saved drafts yet.', saved:'Draft saved in this session.', copied:'Copied', footer:'TAJER AI • Early preview', warning:'Template mode is active until an AI provider is configured in Vercel.'
  }, [isAr]);

  async function generate() {
    if (!product.trim()) { setError(t.empty); return; }
    setBusy(true); setError(''); setOutput('');
    try {
      const response = await fetch('/api/generate', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ kind, product, audience, tone, language }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Generation failed');
      setOutput(data.output);
    } catch (e) { setError(e instanceof Error ? e.message : 'حدث خطأ.'); }
    finally { setBusy(false); }
  }
  function save() {
    if (!output) return;
    setDrafts(old => [{ id: `${Date.now()}`, kind, product, output, date: new Date().toLocaleString() }, ...old]);
    setError(t.saved);
  }
  async function copy() { if (output && navigator.clipboard) { await navigator.clipboard.writeText(output); setError(t.copied); } }

  return <main className={isAr ? 'app' : 'app ltr'}>
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">T</div><div><strong>TAJER <span>AI</span></strong><small>{t.tagline}</small></div></div>
      <div className="side-label">{t.dashboard}</div>
      <button className={`nav-item ${tab === 'create' ? 'active' : ''}`} onClick={() => setTab('create')}>✦ <span>{t.create}</span></button>
      <button className={`nav-item ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>▤ <span>{t.history}</span></button>
      <div className="sidebar-bottom"><span className="status-dot"/> {isAr ? 'مساحة عمل تجريبية' : 'Preview workspace'}</div>
    </aside>
    <section className="main-area">
      <header className="topbar"><div className="crumb">TAJER AI <span>/</span> {tab === 'create' ? t.create : t.history}</div><button className="lang" onClick={() => setLanguage(isAr ? 'en' : 'ar')}>{isAr ? 'EN  English' : 'عربي  AR'}</button></header>
      {tab === 'create' ? <div className="content">
        <div className="hero"><div className="eyebrow"><span/> AI COMMERCE STUDIO</div><h1>{t.welcome}</h1><p>{t.intro}</p></div>
        <div className="workspace">
          <section className="panel form-panel">
            <div className="panel-heading"><div><span className="step">01</span><h2>{t.create}</h2></div><span className="spark">✧</span></div>
            <label>{t.type}</label>
            <div className="type-grid">
              {(['ad','post','product'] as Kind[]).map((k, i) => <button key={k} className={`type-card ${kind === k ? 'selected' : ''}`} onClick={() => setKind(k)}><span className="type-icon">{['✧','▧','◇'][i]}</span><b>{t[k]}</b></button>)}
            </div>
            <label htmlFor="product">{t.name}</label><textarea id="product" value={product} onChange={e => setProduct(e.target.value)} placeholder={t.nameHint} rows={4}/>
            <label htmlFor="audience">{t.audience}</label><input id="audience" value={audience} onChange={e => setAudience(e.target.value)} placeholder={t.audienceHint}/>
            <label htmlFor="tone">{t.tone}</label><select id="tone" value={tone} onChange={e => setTone(e.target.value)}><option>احترافي</option><option>ودود</option><option>فاخر</option><option>حماسي</option><option>مباشر</option></select>
            <button className="primary" onClick={generate} disabled={busy}>{busy ? t.generating : t.generate} <span>✦</span></button>
            {error && <p className="notice">{error}</p>}
          </section>
          <section className="panel result-panel"><div className="panel-heading"><div><span className="step">02</span><h2>{t.result}</h2></div><span className="result-tag">TAJER AI</span></div>
            {output ? <><div className="output">{output}</div><div className="result-actions"><button className="secondary" onClick={copy}>▢ {t.copy}</button><button className="primary small" onClick={save}>＋ {t.save}</button></div></> : <div className="empty-state"><div className="empty-icon">✧</div><strong>{isAr ? 'ستظهر النتيجة هنا' : 'Your result will appear here'}</strong><p>{isAr ? 'أدخل تفاصيل المنتج ودع TAJER AI يساعدك.' : 'Enter product details and let TAJER AI help.'}</p></div>}
            <div className="tip"><span>✦</span><p>{t.warning}</p></div>
          </section>
        </div>
      </div> : <div className="content"><div className="hero"><div className="eyebrow"><span/> YOUR WORKSPACE</div><h1>{t.history}</h1></div>{drafts.length ? <div className="draft-list">{drafts.map(d => <article className="panel draft" key={d.id}><div className="draft-head"><b>{d.product}</b><small>{d.date}</small></div><p>{d.output}</p></article>)}</div> : <div className="panel empty-history">{t.historyEmpty}</div>}</div>}
      <footer>{t.footer}</footer>
    </section>
  </main>;
}
