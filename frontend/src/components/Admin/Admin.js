import React, { useState, useEffect, useCallback } from 'react';
import './Admin.css';

const API        = '/api';
const ADMIN_PASS = 'fishparadise2024';

const CATS   = ['Fish Tanks','Filters','Lights','Plants','Fish Food','Decorations','Livestock','Others'];
const BADGES = ['','New','Popular','Best Seller','Sale','Rare','Premium'];
const UNITS  = ['unit','fish','pack','set','kg','litre','piece','pair'];

const EMPTY_PRODUCT = {
  name:'', category:'Fish Tanks', price:'', mrp:'', unit:'unit',
  description:'', imageUrl:'', images:[], badge:'', stock:'',
  gstPercent:'18', inStock:true, featured:false,
  careLevel:'', size:'', temperature:'', sku:'',
  brand:'', weight:'', dimensions:'', warranty:'',
  phRange:'', diet:'', lifespan:'', tankSize:'', origin:'', compatibility:'',
};

const EMPTY_SETTINGS = {
  deliveryCharge: 100, freeDeliveryAbove: 999,
  gstEnabled: true, defaultGst: 18,
  razorpayKeyId: '', razorpayKeySecret: '',
  codEnabled: true, onlinePayEnabled: false,
  storeName: 'Fish Paradise', storePhone: '+91-9886198869',
  storeEmail: 'support@fishparadise.in',
};

/* ── Tabs ── */
const TABS = [
  { id:'dashboard', label:'Dashboard',  icon:'fa-chart-pie'    },
  { id:'products',  label:'Products',   icon:'fa-box'          },
  { id:'orders',    label:'Orders',     icon:'fa-receipt'      },
  { id:'settings',  label:'Settings',   icon:'fa-cog'          },
];

export default function Admin() {
  const [authed,   setAuthed]   = useState(false);
  const [pass,     setPass]     = useState('');
  const [passErr,  setPassErr]  = useState('');
  const [tab,      setTab]      = useState('dashboard');

  /* Products */
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(null);
  const [form,     setForm]     = useState(EMPTY_PRODUCT);
  const [editId,   setEditId]   = useState(null);
  const [saving,   setSaving]   = useState(false);
  const [search,   setSearch]   = useState('');
  const [catFilter,setCatFilter] = useState('All');
  const [imgUploading, setImgUploading] = useState(false);

  /* Orders */
  const [orders,   setOrders]   = useState([]);
  const [oLoading, setOLoading] = useState(false);

  /* Settings */
  const [settings, setSettings] = useState(EMPTY_SETTINGS);
  const [sSaving,  setSSaving]  = useState(false);

  /* Toast */
  const [msg, setMsg] = useState(null);
  const toast = (text, type='success') => { setMsg({text,type}); setTimeout(()=>setMsg(null),3500); };

  /* ── Fetch data ── */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try { const r=await fetch(API+'/products?limit=200'); const d=await r.json(); setProducts(d.data||[]); }
    catch { toast('Failed to load products','error'); }
    finally { setLoading(false); }
  },[]);

  const fetchOrders = useCallback(async () => {
    setOLoading(true);
    try { const r=await fetch(API+'/orders'); const d=await r.json(); setOrders(d.data||[]); }
    catch { }
    finally { setOLoading(false); }
  },[]);

  useEffect(()=>{ if(authed){ fetchProducts(); fetchOrders(); } },[authed,fetchProducts,fetchOrders]);

  /* ── Auth ── */
  const login = (e)=>{ e.preventDefault(); pass===ADMIN_PASS?setAuthed(true):setPassErr('Incorrect password'); };

  /* ── Product CRUD ── */
  const openAdd  = ()=>{ setForm(EMPTY_PRODUCT); setEditId(null); setModal('product'); };
  const openEdit = (p)=>{ setForm({...EMPTY_PRODUCT,...p,price:p.price,mrp:p.mrp||'',stock:p.stock||'',gstPercent:p.gstPercent||'18',images:p.images||[]}); setEditId(p._id); setModal('product'); };
  const closeModal = ()=>{ setModal(null); setForm(EMPTY_PRODUCT); setEditId(null); };
  const setF = (k,v)=>setForm(f=>({...f,[k]:v}));

  const saveProduct = async (e) => {
    e.preventDefault();
    if(!form.name||!form.price||!form.category){ toast('Name, price & category required','error'); return; }
    setSaving(true);
    const body={...form,price:Number(form.price),mrp:Number(form.mrp)||Number(form.price),stock:Number(form.stock)||0,gstPercent:Number(form.gstPercent)||18,images:form.images||[]};
    try {
      const url  = modal==='product' && editId ? API+'/products/'+editId : API+'/products';
      const meth = editId ? 'PUT' : 'POST';
      const r=await fetch(url,{method:meth,headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
      if(!r.ok) throw new Error();
      toast(editId?'Product updated!':'Product added!');
      closeModal(); fetchProducts();
    } catch { toast('Save failed','error'); }
    finally { setSaving(false); }
  };

  const deleteProduct = async (id,name) => {
    if(!window.confirm('Delete "'+name+'"?')) return;
    try { const r=await fetch(API+'/products/'+id,{method:'DELETE'}); if(!r.ok) throw new Error(); toast('Deleted: '+name); fetchProducts(); }
    catch { toast('Delete failed','error'); }
  };

  const toggleStock = async (p) => {
    try { await fetch(API+'/products/'+p._id,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({...p,inStock:!p.inStock})}); fetchProducts(); }
    catch { toast('Update failed','error'); }
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files; if(!files||!files.length) return;
    setImgUploading(true);
    const fd = new FormData();
    Array.from(files).forEach(f => fd.append('images', f));
    try {
      const r = await fetch(API+'/products/upload', { method:'POST', body:fd });
      const d = await r.json();
      if(d.success && d.data) {
        const urls = d.data;
        if(!form.imageUrl && urls.length > 0) setF('imageUrl', urls[0]);
        setF('images', [...(form.images||[]), ...urls]);
        toast('Image(s) uploaded!');
      } else { toast('Upload failed','error'); }
    } catch { toast('Upload failed','error'); }
    finally { setImgUploading(false); e.target.value=''; }
  };

  const removeImage = (url) => {
    const newImages = (form.images||[]).filter(u => u !== url);
    setF('images', newImages);
    if(form.imageUrl === url) setF('imageUrl', newImages[0] || '');
    // Delete from server if it's an uploaded file
    if(url.startsWith('/uploads/')) {
      const filename = url.split('/').pop();
      fetch(API+'/products/upload/'+filename, {method:'DELETE'}).catch(()=>{});
    }
  };

  const setMainImage = (url) => { setF('imageUrl', url); };

  const updateOrderStatus = async (id, status) => {
    try { await fetch(API+'/orders/'+id,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status})}); fetchOrders(); toast('Order updated'); }
    catch { toast('Update failed','error'); }
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    setSSaving(true);
    // Store in localStorage (backend settings API can be added later)
    localStorage.setItem('fp_settings', JSON.stringify(settings));
    setTimeout(()=>{ setSSaving(false); toast('Settings saved!'); },600);
  };

  // Load settings from localStorage
  useEffect(()=>{ const s=localStorage.getItem('fp_settings'); if(s) try{setSettings(JSON.parse(s));}catch{} },[]);

  /* ── Filtered products ── */
  const filtered = products.filter(p=>{
    const mc = catFilter==='All'||p.category===catFilter;
    const ms = !search||p.name.toLowerCase().includes(search.toLowerCase())||p.sku?.toLowerCase().includes(search.toLowerCase());
    return mc&&ms;
  });

  /* ── Stats ── */
  const stats = {
    total:      products.length,
    inStock:    products.filter(p=>p.inStock).length,
    outOfStock: products.filter(p=>!p.inStock).length,
    featured:   products.filter(p=>p.featured).length,
    categories: [...new Set(products.map(p=>p.category))].length,
    livestock:  products.filter(p=>p.category==='Livestock').length,
    orders:     orders.length,
    pending:    orders.filter(o=>o.status==='pending').length,
    revenue:    orders.filter(o=>o.status!=='cancelled').reduce((s,o)=>s+o.totalAmount,0),
  };

  /* ══════════════════ LOGIN ══════════════════ */
  if (!authed) return (
    <div className="adl-wrap">
      <div className="adl-box">
        <div className="adl-logo"><i className="fas fa-fish"></i></div>
        <h1>Fish Paradise</h1>
        <p className="adl-sub">Admin Dashboard</p>
        <form onSubmit={login}>
          <div className="adl-field">
            <label>Password</label>
            <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Enter admin password" autoFocus />
          </div>
          {passErr && <div className="adl-err"><i className="fas fa-exclamation-circle"></i>{passErr}</div>}
          <button type="submit" className="adl-btn"><i className="fas fa-sign-in-alt"></i> Sign In</button>
        </form>
      </div>
    </div>
  );

  /* ══════════════════ MAIN ADMIN ══════════════════ */
  return (
    <div className="adm-wrap">
      {msg && <div className={"adm-toast "+msg.type}><i className={"fas "+(msg.type==='success'?'fa-check-circle':'fa-exclamation-circle')}></i>{msg.text}</div>}

      {/* SIDEBAR */}
      <aside className="adm-sidebar">
        <div className="adm-brand"><i className="fas fa-fish"></i><div><span>Fish Paradise</span><small>Admin Panel</small></div></div>
        <nav className="adm-nav">
          {TABS.map(t=>(
            <button key={t.id} className={tab===t.id?'active':''} onClick={()=>setTab(t.id)}>
              <i className={"fas "+t.icon}></i><span>{t.label}</span>
              {t.id==='orders'&&stats.pending>0&&<span className="adm-badge">{stats.pending}</span>}
            </button>
          ))}
        </nav>
        <div className="adm-sidebar-footer">
          <button className="adm-logout" onClick={()=>setAuthed(false)}><i className="fas fa-sign-out-alt"></i>Logout</button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="adm-main">

        {/* ── DASHBOARD ── */}
        {tab==='dashboard' && (
          <div>
            <div className="adm-page-header"><h1>Dashboard</h1><p>Welcome back! Here is your store overview.</p></div>
            <div className="adm-stats">
              {[
                {label:'Total Products',   val:stats.total,      icon:'fa-box',        color:'#00b4b4'},
                {label:'In Stock',         val:stats.inStock,    icon:'fa-check',      color:'#3fb950'},
                {label:'Out of Stock',     val:stats.outOfStock, icon:'fa-times',      color:'#f85149'},
                {label:'Total Orders',     val:stats.orders,     icon:'fa-receipt',    color:'#6c5ce7'},
                {label:'Pending Orders',   val:stats.pending,    icon:'fa-clock',      color:'#e3b341'},
                {label:'Revenue (Rs.)',     val:'Rs.'+stats.revenue.toLocaleString('en-IN'), icon:'fa-rupee-sign', color:'#17a369'},
              ].map((s,i)=>(
                <div key={i} className="adm-stat-card" style={{'--sc':s.color}}>
                  <div className="adm-stat-icon"><i className={"fas "+s.icon}></i></div>
                  <div className="adm-stat-val">{s.val}</div>
                  <div className="adm-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
            {/* Recent orders */}
            <div className="adm-section-card">
              <h3>Recent Orders</h3>
              {orders.slice(0,5).map(o=>(
                <div key={o._id} className="adm-order-row">
                  <div><strong>{o.customerName}</strong><span>{o.customerEmail}</span></div>
                  <div>Rs.{o.totalAmount.toLocaleString('en-IN')}</div>
                  <span className={"adm-status "+o.status}>{o.status}</span>
                </div>
              ))}
              {orders.length===0 && <p className="adm-empty-msg">No orders yet</p>}
            </div>
          </div>
        )}

        {/* ── PRODUCTS ── */}
        {tab==='products' && (
          <div>
            <div className="adm-page-header">
              <div><h1>Products</h1><p>{products.length} total products</p></div>
              <button className="adm-add-btn" onClick={openAdd}><i className="fas fa-plus"></i>Add Product</button>
            </div>

            {/* Filters */}
            <div className="adm-filters">
              <div className="adm-search"><i className="fas fa-search"></i><input type="text" placeholder="Search by name or SKU..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
              <select value={catFilter} onChange={e=>setCatFilter(e.target.value)}>
                <option value="All">All Categories</option>
                {CATS.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
              <span className="adm-result-count">{filtered.length} results</span>
            </div>

            {loading ? <div className="adm-loading"><i className="fas fa-spinner fa-spin"></i>Loading...</div> : (
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr><th>Product</th><th>SKU</th><th>Category</th><th>Price / GST</th><th>MRP</th><th>Stock</th><th>Status</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {filtered.length===0
                      ? <tr><td colSpan={8} className="adm-empty-cell">No products found</td></tr>
                      : filtered.map(p=>(
                        <tr key={p._id}>
                          <td>
                            <div className="adm-prod-cell">
                              <div className="adm-prod-img"><img src={p.imageUrl||'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=80&q=60'} alt={p.name}/></div>
                              <div><div className="adm-prod-name">{p.name}</div>{p.badge&&<span className="adm-prod-badge">{p.badge}</span>}</div>
                            </div>
                          </td>
                          <td><span className="adm-sku">{p.sku||'—'}</span></td>
                          <td><span className="adm-cat-chip">{p.category}</span></td>
                          <td>
                            <div className="adm-price-cell">
                              <strong>Rs.{Number(p.price).toLocaleString('en-IN')}</strong>
                              <span className="adm-gst-tag">+{p.gstPercent||18}% GST</span>
                            </div>
                          </td>
                          <td>Rs.{Number(p.mrp||p.price).toLocaleString('en-IN')}</td>
                          <td><span className="adm-stock-num">{p.stock||0}</span></td>
                          <td><button className={"adm-toggle "+(p.inStock?'in':'out')} onClick={()=>toggleStock(p)}>{p.inStock?'In Stock':'Out of Stock'}</button></td>
                          <td>
                            <div className="adm-actions">
                              <button className="adm-btn-edit" onClick={()=>openEdit(p)} title="Edit"><i className="fas fa-edit"></i></button>
                              <button className="adm-btn-del"  onClick={()=>deleteProduct(p._id,p.name)} title="Delete"><i className="fas fa-trash"></i></button>
                            </div>
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── ORDERS ── */}
        {tab==='orders' && (
          <div>
            <div className="adm-page-header"><h1>Orders</h1><p>{orders.length} total orders • {stats.pending} pending</p></div>
            {oLoading ? <div className="adm-loading"><i className="fas fa-spinner fa-spin"></i>Loading...</div> : (
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead><tr><th>Customer</th><th>Items</th><th>Amount</th><th>Payment</th><th>Status</th><th>Date</th><th>Update</th></tr></thead>
                  <tbody>
                    {orders.length===0
                      ? <tr><td colSpan={7} className="adm-empty-cell">No orders yet</td></tr>
                      : orders.map(o=>(
                        <tr key={o._id}>
                          <td><div><strong>{o.customerName}</strong><br/><small>{o.customerEmail}</small><br/><small>{o.customerPhone}</small></div></td>
                          <td><span className="adm-items-count">{o.items?.length||0} items</span></td>
                          <td><strong>Rs.{o.totalAmount?.toLocaleString('en-IN')}</strong></td>
                          <td><span className={"adm-pay "+(o.paymentMethod==='Online'?'online':'cod')}>{o.paymentMethod||'COD'}</span></td>
                          <td><span className={"adm-status "+o.status}>{o.status}</span></td>
                          <td><small>{o.createdAt?new Date(o.createdAt).toLocaleDateString('en-IN'):'-'}</small></td>
                          <td>
                            <select className="adm-status-select" value={o.status} onChange={e=>updateOrderStatus(o._id,e.target.value)}>
                              {['pending','confirmed','shipped','delivered','cancelled'].map(s=><option key={s} value={s}>{s}</option>)}
                            </select>
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── SETTINGS ── */}
        {tab==='settings' && (
          <div>
            <div className="adm-page-header"><h1>Store Settings</h1><p>Configure GST, delivery, payment and store details</p></div>
            <form onSubmit={saveSettings} className="adm-settings-form">

              {/* Store Info */}
              <div className="adm-settings-card">
                <h3><i className="fas fa-store"></i> Store Information</h3>
                <div className="adm-settings-grid">
                  <div className="adm-sg"><label>Store Name</label><input value={settings.storeName} onChange={e=>setSettings(s=>({...s,storeName:e.target.value}))}/></div>
                  <div className="adm-sg"><label>Phone</label><input value={settings.storePhone} onChange={e=>setSettings(s=>({...s,storePhone:e.target.value}))}/></div>
                  <div className="adm-sg"><label>Email</label><input value={settings.storeEmail} onChange={e=>setSettings(s=>({...s,storeEmail:e.target.value}))}/></div>
                </div>
              </div>

              {/* GST */}
              <div className="adm-settings-card">
                <h3><i className="fas fa-percent"></i> GST Settings</h3>
                <div className="adm-settings-grid">
                  <div className="adm-sg">
                    <label>GST Enabled</label>
                    <label className="adm-toggle-switch">
                      <input type="checkbox" checked={settings.gstEnabled} onChange={e=>setSettings(s=>({...s,gstEnabled:e.target.checked}))}/>
                      <span className="adm-slider"></span>
                    </label>
                  </div>
                  <div className="adm-sg">
                    <label>Default GST Rate (%)</label>
                    <input type="number" min="0" max="28" value={settings.defaultGst} onChange={e=>setSettings(s=>({...s,defaultGst:Number(e.target.value)}))}/>
                    <small>Applied when product has no specific GST rate</small>
                  </div>
                </div>
              </div>

              {/* Delivery */}
              <div className="adm-settings-card">
                <h3><i className="fas fa-truck"></i> Delivery Charges</h3>
                <div className="adm-settings-grid">
                  <div className="adm-sg">
                    <label>Delivery Charge (Rs.)</label>
                    <input type="number" min="0" value={settings.deliveryCharge} onChange={e=>setSettings(s=>({...s,deliveryCharge:Number(e.target.value)}))}/>
                  </div>
                  <div className="adm-sg">
                    <label>Free Delivery Above (Rs.)</label>
                    <input type="number" min="0" value={settings.freeDeliveryAbove} onChange={e=>setSettings(s=>({...s,freeDeliveryAbove:Number(e.target.value)}))}/>
                    <small>Set 0 to always charge delivery</small>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="adm-settings-card">
                <h3><i className="fas fa-credit-card"></i> Payment Settings</h3>
                <div className="adm-settings-grid">
                  <div className="adm-sg">
                    <label>Cash on Delivery (COD)</label>
                    <label className="adm-toggle-switch">
                      <input type="checkbox" checked={settings.codEnabled} onChange={e=>setSettings(s=>({...s,codEnabled:e.target.checked}))}/>
                      <span className="adm-slider"></span>
                    </label>
                  </div>
                  <div className="adm-sg">
                    <label>Online Payment (Razorpay)</label>
                    <label className="adm-toggle-switch">
                      <input type="checkbox" checked={settings.onlinePayEnabled} onChange={e=>setSettings(s=>({...s,onlinePayEnabled:e.target.checked}))}/>
                      <span className="adm-slider"></span>
                    </label>
                  </div>
                  <div className="adm-sg">
                    <label>Razorpay Key ID</label>
                    <input type="text" placeholder="rzp_live_XXXXXXXXXX" value={settings.razorpayKeyId} onChange={e=>setSettings(s=>({...s,razorpayKeyId:e.target.value}))}/>
                  </div>
                  <div className="adm-sg">
                    <label>Razorpay Key Secret</label>
                    <input type="password" placeholder="••••••••••••••••" value={settings.razorpayKeySecret} onChange={e=>setSettings(s=>({...s,razorpayKeySecret:e.target.value}))}/>
                    <small>Get keys from dashboard.razorpay.com</small>
                  </div>
                </div>
              </div>

              <button type="submit" className="adm-save-settings" disabled={sSaving}>
                {sSaving?<><i className="fas fa-spinner fa-spin"></i>Saving...</>:<><i className="fas fa-save"></i>Save All Settings</>}
              </button>
            </form>
          </div>
        )}
      </main>

      {/* ── PRODUCT MODAL ── */}
      {modal==='product' && (
        <div className="adm-modal-bg" onClick={closeModal}>
          <div className="adm-modal" onClick={e=>e.stopPropagation()}>
            <div className="adm-modal-head">
              <h2><i className="fas fa-box"></i> {editId?'Edit Product':'Add New Product'}</h2>
              <button onClick={closeModal}><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={saveProduct} className="adm-modal-form">

              {/* Basic Info */}
              <div className="adm-form-section"><h4>Basic Information</h4>
                <div className="adm-form-row">
                  <div className="adm-fg"><label>Product Name *</label><input type="text" value={form.name} onChange={e=>setF('name',e.target.value)} placeholder="e.g. Custom Glass Tank 4ft" required/></div>
                  <div className="adm-fg"><label>SKU / Code</label><input type="text" value={form.sku} onChange={e=>setF('sku',e.target.value)} placeholder="e.g. FP-TANK-001"/></div>
                </div>
                <div className="adm-form-row">
                  <div className="adm-fg"><label>Category *</label><select value={form.category} onChange={e=>setF('category',e.target.value)}>{CATS.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
                  <div className="adm-fg"><label>Badge</label><select value={form.badge} onChange={e=>setF('badge',e.target.value)}>{BADGES.map(b=><option key={b} value={b}>{b||'None'}</option>)}</select></div>
                </div>
              </div>

              {/* Pricing */}
              <div className="adm-form-section"><h4><i className="fas fa-rupee-sign"></i> Pricing & GST</h4>
                <div className="adm-form-row">
                  <div className="adm-fg"><label>Selling Price (Rs.) *</label><input type="number" value={form.price} onChange={e=>setF('price',e.target.value)} placeholder="8500" min="0" required/></div>
                  <div className="adm-fg"><label>MRP / Original Price (Rs.)</label><input type="number" value={form.mrp} onChange={e=>setF('mrp',e.target.value)} placeholder="9999" min="0"/></div>
                  <div className="adm-fg"><label>GST Rate (%)</label><select value={form.gstPercent} onChange={e=>setF('gstPercent',e.target.value)}>
                    {['0','5','12','18','28'].map(g=><option key={g} value={g}>{g}%</option>)}
                  </select></div>
                  <div className="adm-fg"><label>Unit</label><select value={form.unit} onChange={e=>setF('unit',e.target.value)}>{UNITS.map(u=><option key={u} value={u}>{u}</option>)}</select></div>
                </div>
                {form.price && <div className="adm-price-preview">
                  <span>Base: Rs.{Number(form.price).toLocaleString('en-IN')}</span>
                  <span>GST ({form.gstPercent}%): Rs.{Math.round(form.price*form.gstPercent/100).toLocaleString('en-IN')}</span>
                  <span>Total: Rs.{Math.round(Number(form.price)*(1+Number(form.gstPercent)/100)).toLocaleString('en-IN')}</span>
                </div>}
              </div>

              {/* Inventory */}
              <div className="adm-form-section"><h4><i className="fas fa-warehouse"></i> Inventory</h4>
                <div className="adm-form-row">
                  <div className="adm-fg"><label>Stock Quantity</label><input type="number" value={form.stock} onChange={e=>setF('stock',e.target.value)} placeholder="10" min="0"/></div>
                </div>
                <div className="adm-checks">
                  <label className="adm-check"><input type="checkbox" checked={form.inStock} onChange={e=>setF('inStock',e.target.checked)}/><span>In Stock</span></label>
                  <label className="adm-check"><input type="checkbox" checked={form.featured} onChange={e=>setF('featured',e.target.checked)}/><span>Featured</span></label>
                </div>
              </div>

              {/* Media — Upload + URL + Gallery */}
              <div className="adm-form-section"><h4><i className="fas fa-image"></i> Product Images</h4>
                <div className="adm-img-upload-area">
                  <label className={"adm-upload-btn"+(imgUploading?' uploading':'')}>
                    <i className={"fas "+(imgUploading?'fa-spinner fa-spin':'fa-cloud-upload-alt')}></i>
                    {imgUploading?'Uploading...':'Upload Images'}
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{display:'none'}} disabled={imgUploading}/>
                  </label>
                  <span className="adm-upload-hint">or paste URL below</span>
                </div>
                <div className="adm-fg" style={{marginTop:8}}><label>Image URL (Main)</label><input type="text" value={form.imageUrl} onChange={e=>setF('imageUrl',e.target.value)} placeholder="https://..."/></div>
                {(form.images?.length > 0 || form.imageUrl) && (
                  <div className="adm-img-gallery">
                    {[...(form.imageUrl && !form.images?.includes(form.imageUrl) ? [form.imageUrl] : []), ...(form.images||[])].filter(Boolean).map((url,i)=>(
                      <div key={i} className={"adm-img-thumb"+(form.imageUrl===url?' main':'')}>
                        <img src={url} alt={'Product '+(i+1)} onError={e=>e.target.style.display='none'}/>
                        <div className="adm-img-actions">
                          {form.imageUrl!==url && <button type="button" onClick={()=>setMainImage(url)} title="Set as main"><i className="fas fa-star"></i></button>}
                          <button type="button" onClick={()=>removeImage(url)} title="Remove"><i className="fas fa-trash"></i></button>
                        </div>
                        {form.imageUrl===url && <span className="adm-main-tag">Main</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="adm-form-section"><h4><i className="fas fa-align-left"></i> Description</h4>
                <textarea rows={4} value={form.description} onChange={e=>setF('description',e.target.value)} placeholder="Detailed product description..."/>
              </div>

              {/* Product Details */}
              <div className="adm-form-section"><h4><i className="fas fa-info-circle"></i> Product Details</h4>
                <div className="adm-form-row">
                  <div className="adm-fg"><label>Brand</label><input type="text" value={form.brand} onChange={e=>setF('brand',e.target.value)} placeholder="e.g. Sobo, ADA"/></div>
                  <div className="adm-fg"><label>Weight</label><input type="text" value={form.weight} onChange={e=>setF('weight',e.target.value)} placeholder="e.g. 2.5 kg"/></div>
                  <div className="adm-fg"><label>Dimensions</label><input type="text" value={form.dimensions} onChange={e=>setF('dimensions',e.target.value)} placeholder="e.g. 90×45×45 cm"/></div>
                  <div className="adm-fg"><label>Warranty</label><input type="text" value={form.warranty} onChange={e=>setF('warranty',e.target.value)} placeholder="e.g. 1 Year"/></div>
                </div>
              </div>

              {/* Live Fish extras */}
              {form.category==='Livestock' && (
                <div className="adm-form-section adm-livestock-section"><h4><i className="fas fa-fish"></i> Live Fish Details</h4>
                  <div className="adm-form-row">
                    <div className="adm-fg"><label>Care Level</label><select value={form.careLevel} onChange={e=>setF('careLevel',e.target.value)}><option value="">Select</option><option>Easy</option><option>Moderate</option><option>Expert</option></select></div>
                    <div className="adm-fg"><label>Max Size</label><input type="text" value={form.size} onChange={e=>setF('size',e.target.value)} placeholder="e.g. 10-30 cm"/></div>
                    <div className="adm-fg"><label>Temperature</label><input type="text" value={form.temperature} onChange={e=>setF('temperature',e.target.value)} placeholder="e.g. 22-28°C"/></div>
                  </div>
                  <div className="adm-form-row">
                    <div className="adm-fg"><label>pH Range</label><input type="text" value={form.phRange} onChange={e=>setF('phRange',e.target.value)} placeholder="e.g. 6.5-7.5"/></div>
                    <div className="adm-fg"><label>Diet</label><input type="text" value={form.diet} onChange={e=>setF('diet',e.target.value)} placeholder="e.g. Omnivore"/></div>
                    <div className="adm-fg"><label>Lifespan</label><input type="text" value={form.lifespan} onChange={e=>setF('lifespan',e.target.value)} placeholder="e.g. 5-10 years"/></div>
                  </div>
                  <div className="adm-form-row">
                    <div className="adm-fg"><label>Min Tank Size</label><input type="text" value={form.tankSize} onChange={e=>setF('tankSize',e.target.value)} placeholder="e.g. 100 litres"/></div>
                    <div className="adm-fg"><label>Origin</label><input type="text" value={form.origin} onChange={e=>setF('origin',e.target.value)} placeholder="e.g. South America"/></div>
                    <div className="adm-fg"><label>Compatibility</label><input type="text" value={form.compatibility} onChange={e=>setF('compatibility',e.target.value)} placeholder="e.g. Peaceful community"/></div>
                  </div>
                </div>
              )}

              <div className="adm-modal-footer">
                <button type="button" className="adm-btn-cancel" onClick={closeModal}>Cancel</button>
                <button type="submit" className="adm-btn-save" disabled={saving}>
                  {saving?<><i className="fas fa-spinner fa-spin"></i>Saving...</>:<><i className="fas fa-save"></i>{editId?'Save Changes':'Add Product'}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}