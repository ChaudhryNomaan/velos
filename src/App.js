import React, { useState, useEffect, useMemo, useRef, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';

const ASSETS = [
  { v: "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-showing-off-a-black-outfit-34505-large.mp4", i: "https://images.unsplash.com/photo-1552664199-fd31f7431a55?q=80&w=1600" },
  { v: "https://assets.mixkit.co/videos/preview/mixkit-woman-modeling-a-white-dress-34506-large.mp4", i: "https://images.unsplash.com/photo-1539109132314-3475d24c21c0?q=80&w=1600" },
  { v: "https://assets.mixkit.co/videos/preview/mixkit-stylish-man-in-a-leather-jacket-standing-outdoors-34493-large.mp4", i: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600" },
  { v: "https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-in-a-silk-dress-41551-large.mp4", i: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=1600" },
  { v: "https://assets.mixkit.co/videos/preview/mixkit-model-holding-a-glass-of-champagne-34515-large.mp4", i: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600" },
  { v: "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-lighting-in-a-studio-34503-large.mp4", i: "https://images.unsplash.com/photo-1445205170230-053b830c6050?q=80&w=1600" }
];

const CAT_MAP = {
  "WOMEN": ["Outerwear", "Tailoring", "Knitwear", "Accessories", "Footwear", "Base Layer", "Draped Forms"],
  "MEN": ["Technical", "Suits", "Leather", "Basics", "Industrial Footwear", "Utility Vests", "Cargo Systems"],
  "LAB": ["Prototyping", "Hardware", "Liminal Space", "Bio-Textiles", "Wearable Tech", "Acoustic Shells"],
  "RE-SALE": ["2022 Archive", "2023 Archive", "Sample Sale", "Refurbished Units", "Collector Pieces"],
  "COMMUNE": ["Editorial", "Film", "Soundtrack", "Store Locations", "Manifesto"]
};

const MASTER_VAULT = [];
Object.keys(CAT_MAP).forEach((cat, ci) => {
  CAT_MAP[cat].forEach((sub, si) => {
    for (let i = 1; i <= 34; i++) {
      const idx = (ci + si + i) % ASSETS.length;
      const idxAlt1 = (idx + 1) % ASSETS.length;
      const idxAlt2 = (idx + 2) % ASSETS.length;
      const isCommune = cat === "COMMUNE";
      MASTER_VAULT.push({
        id: `velos-${cat}-${sub}-${i}`.toLowerCase().replace(/\s+/g, '-'),
        category: cat,
        subCategory: sub,
        name: isCommune ? `${sub.toUpperCase()} // VOL.${i < 10 ? '0'+i : i}` : `${sub.toUpperCase()} UNIT ${100 + i}`,
        price: (450 + (si * 50) + (i * 15)).toFixed(2),
        sku: `VL-26-${cat.slice(0, 2)}-${si}${i}`,
        image: ASSETS[idx].i,
        images: [ASSETS[idx].i, ASSETS[idxAlt1].i, ASSETS[idxAlt2].i],
        video: ASSETS[idx].v,
        description: isCommune 
          ? "A visual exploration of the VELOS philosophy through the lens of industrial photography."
          : "A modular garment engineered for the 2026 climate shift. Features articulated joints and moisture-wicking membranes.",
        techSpecs: isCommune ? ["Digital Format", "4K Render", "Archive Access"] : ["Articulated Fit", "3L Gore-Tex", "Magnetic Closures"],
        materials: isCommune ? "Digital Media" : "3-Layer Laminated Nylon / YKK Aquaguard Zippers",
        care: isCommune ? "N/A" : "Clean with damp cloth. Do not dry clean."
      });
    }
  });
});

const VelosContext = createContext();

export const VelosProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const addToBag = (item) => {
    setCart(prev => [...prev, { ...item, cartId: Date.now() + Math.random() }]);
    setIsBagOpen(true);
  };
  const removeFromBag = (cartId) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };
  return (
    <VelosContext.Provider value={{ isMenuOpen, setIsMenuOpen, cart, addToBag, removeFromBag, isBagOpen, setIsBagOpen }}>
      {children}
    </VelosContext.Provider>
  );
};

const MinimalCursor = () => {
  const dotRef = useRef(null);
  useEffect(() => {
    const onMove = (e) => {
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);
  return <div ref={dotRef} className="cursor-dot" />;
};

const Media = ({ v, i, className="" }) => (
  <div className={`media-frame ${className}`}>
    <video src={v} autoPlay loop muted playsInline poster={i} />
  </div>
);

const Nav = () => {
  const { isMenuOpen, setIsMenuOpen, cart, setIsBagOpen } = useContext(VelosContext);
  return (
    <header className="site-nav">
      <div className="nav-container">
        <div className="nav-left">
          <button className="menu-trigger" aria-label="Toggle Menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <div className={`bar ${isMenuOpen ? 'open' : ''}`} />
            <div className={`bar ${isMenuOpen ? 'open' : ''}`} />
          </button>
          <div className="desktop-links">
            {Object.keys(CAT_MAP).map(c => <Link key={c} to={`/category/${c}`}>{c}</Link>)}
          </div>
        </div>
        <Link to="/" className="nav-logo" onClick={() => setIsMenuOpen(false)}>VELOS</Link>
        <div className="nav-right">
          <button className="bag-trigger" onClick={() => setIsBagOpen(true)}>
            BAG ({cart.length})
          </button>
        </div>
      </div>
    </header>
  );
};

const ShoppingBag = () => {
  const { cart, isBagOpen, setIsBagOpen, removeFromBag } = useContext(VelosContext);
  const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2);
  if (!isBagOpen) return null;
  return (
    <div className="bag-overlay">
      <div className="bag-scrim" onClick={() => setIsBagOpen(false)} />
      <div className="bag-drawer">
        <div className="bag-header">
          <div className="bh-inner">
            <span className="bh-title">YOUR SELECTION [{cart.length}]</span>
            <button className="bag-close-btn" onClick={() => setIsBagOpen(false)}>CLOSE</button>
          </div>
        </div>
        <div className="bag-list">
          {cart.length === 0 ? (
            <div className="empty-msg-wrap">
              <p className="empty-msg">THE ARCHIVE IS EMPTY</p>
              <button className="shop-btn" onClick={() => setIsBagOpen(false)}>RETURN TO SHOP</button>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={item.cartId} className="bag-item stagger-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="bag-item-img">
                  <img src={item.image} alt="" />
                </div>
                <div className="bi-details">
                  <div className="bi-top">
                    <h4>{item.name}</h4>
                    <p>€{item.price}</p>
                  </div>
                  <span className="bi-sku">{item.sku}</span>
                  <button className="bi-remove" onClick={() => removeFromBag(item.cartId)}>REMOVE</button>
                </div>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="bag-footer">
            <div className="total-row">
              <span>TOTAL (INC. VAT)</span>
              <span>€{total}</span>
            </div>
            <button className="checkout-btn">PROCEED TO CHECKOUT</button>
          </div>
        )}
      </div>
    </div>
  );
};

const MobileOverlay = () => {
  const { isMenuOpen, setIsMenuOpen } = useContext(VelosContext);
  if (!isMenuOpen) return null;
  return (
    <div className="menu-overlay">
      <button className="menu-close-x" onClick={() => setIsMenuOpen(false)}>CLOSE</button>
      <div className="menu-inner">
        <div className="menu-visual">
          <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600" alt="Menu Visual" />
        </div>
        <div className="menu-content">
          <div className="menu-header">MENU</div>
          <nav className="menu-links">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="stagger-in" style={{ animationDelay: '0.1s' }}>HOME ARCHIVE</Link>
            {Object.keys(CAT_MAP).map((c, i) => (
              <Link key={c} to={`/category/${c}`} onClick={() => setIsMenuOpen(false)} className="stagger-in" style={{ animationDelay: `${0.2 + (i * 0.1)}s` }}>{c}</Link>
            ))}
          </nav>
          <div className="menu-footer">
            <p>© 2026 VELOS ARCHIVE</p>
            <p>INSTAGRAM — TWITTER</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Home = () => (
  <div className="home-container">
    <section className="h-hero">
      <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070" alt="Velos Archive" className="h-hero-img" />
      <div className="h-overlay">
        <h1 className="reveal-text">THE 2026 <br/> ARCHIVE</h1>
        <p className="stagger-in" style={{ animationDelay: '0.4s' }}>MODULAR UTILITY {"//"} STRUCTURAL PERMANENCE</p>
        <Link to="/category/LAB" className="h-btn stagger-in" style={{ animationDelay: '0.6s' }}>EXPLORE THE LAB</Link>
      </div>
    </section>
    <section className="h-marquee">
      <div className="m-track">
        {[1,2,3,4].map(i => <span key={i}>VELOS LAB SERIES — 2026 EDITION — MODULARITY — VELOS LAB SERIES — </span>)}
      </div>
    </section>
    <footer className="footer">
      <div className="f-container">
        <div className="f-main">
          <h2>VELOS</h2>
          <div className="f-nav">
              <div className="f-col"><span>STORES</span><span>NEWSLETTER</span></div>
              <div className="f-col"><span>INSTAGRAM</span><span>MANIFESTO</span></div>
          </div>
        </div>
        <p className="copy">© 2026 VELOS ARCHIVE MANAGEMENT</p>
      </div>
    </footer>
  </div>
);

const Category = () => {
  const { catId } = useParams();
  const [activeSub, setActiveSub] = useState("");
  useEffect(() => {
    if (CAT_MAP[catId]) setActiveSub(CAT_MAP[catId][0]);
    window.scrollTo(0, 0);
  }, [catId]);
  const items = useMemo(() => MASTER_VAULT.filter(i => i.category === catId && i.subCategory === activeSub), [catId, activeSub]);
  return (
    <div className="cat-root">
      <aside className="cat-sidebar">
        <div className="cat-header-wrap">
            <span className="cat-breadcrumb">ARCHIVE // {catId}</span>
            <nav className="cat-nav-list">
            {CAT_MAP[catId]?.map(sub => (
                <button key={sub} className={activeSub === sub ? 'active' : ''} onClick={() => setActiveSub(sub)}>
                  {activeSub === sub && <div className="active-indicator" />}
                  {sub}
                </button>
            ))}
            </nav>
        </div>
      </aside>
      <div className="cat-grid">
        {items.map((item, idx) => (
          <Link key={item.id} to={`/product/${item.id}`} className="cat-card stagger-in" style={{ animationDelay: `${idx * 0.05}s` }}>
            <div className="cc-media reveal-frame" style={{ animationDelay: `${idx * 0.05}s` }}>
              <Media v={item.video} i={item.image} />
            </div>
            <div className="cc-info">
              <span className="sku">{item.sku}</span>
              <h4>{item.name}</h4>
              <p className="cat-price">€{item.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const Product = () => {
  const { prodId } = useParams();
  const navigate = useNavigate();
  const { addToBag } = useContext(VelosContext);
  const p = useMemo(() => MASTER_VAULT.find(i => i.id === prodId), [prodId]);
  useEffect(() => { window.scrollTo(0, 0); }, [prodId]);
  if (!p) return null;
  return (
    <div className="pd-root">
      <div className="pd-visual">
        <div className="pd-gallery">
          <Media v={p.video} i={p.image} className="pd-gallery-item main reveal-frame" />
          {p.images.map((img, idx) => (
            <div key={idx} className="pd-gallery-item reveal-frame" style={{ animationDelay: `${(idx + 1) * 0.2}s` }}>
              <img src={img} alt="" />
            </div>
          ))}
        </div>
      </div>
      <div className="pd-sidebar">
        <div className="pd-sticky-wrap stagger-in">
          <button className="pd-back-link" onClick={() => navigate(-1)}>← BACK TO ARCHIVE</button>
          <div className="pd-top">
            <span className="pd-sku">{p.sku}</span>
            <h1>{p.name}</h1>
            <p className="pd-price">€{p.price}</p>
          </div>
          
          <div className="pd-cta-block">
            <button className="pd-add-btn" onClick={() => addToBag(p)}>ADD TO BAG</button>
            <button className="pd-buy-btn">BUY IT NOW</button>
            <div className="pd-info-grid">
              <div className="info-cell"><span>AVAILABILITY</span><span>IN STOCK</span></div>
              <div className="info-cell"><span>SHIPPING</span><span>2-4 DAYS</span></div>
            </div>
          </div>

          <div className="pd-details-sections">
            <details open>
              <summary>DESCRIPTION</summary>
              <div className="p-content">{p.description}</div>
            </details>
            <details>
              <summary>SPECIFICATIONS</summary>
              <div className="p-content">
                <ul className="spec-list">
                  {p.techSpecs.map(s => <li key={s}>// {s}</li>)}
                </ul>
              </div>
            </details>
            <details>
              <summary>COMPOSITION & CARE</summary>
              <div className="p-content">
                <p>{p.materials}</p>
                <p className="care-small">{p.care}</p>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <VelosProvider>
      <Router>
        <MinimalCursor />
        <Nav />
        <MobileOverlay />
        <ShoppingBag />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:catId" element={<Category />} />
          <Route path="/product/:prodId" element={<Product />} />
        </Routes>
      </Router>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; cursor: none !important; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #fff; color: #000; overflow-x: hidden; line-height: 1.5; }
        
        @keyframes revealUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes revealFrame { from { clip-path: inset(100% 0 0 0); } to { clip-path: inset(0 0 0 0); } }
        @keyframes drawerSlide { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes scaleLoop { from { transform: scale(1); } to { transform: scale(1.08); } }
        @keyframes fadeMenu { from { opacity: 0; } to { opacity: 1; } }

        .stagger-in { animation: revealUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .reveal-frame { animation: revealFrame 1.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .reveal-text { animation: revealUp 1.5s cubic-bezier(0.16, 1, 0.3, 1) both; }

        .cursor-dot { position: fixed; width: 12px; height: 12px; background: #000; border: 1px solid #fff; border-radius: 50%; z-index: 2000000; pointer-events: none; transform: translate(-50%, -50%); transition: transform 0.1s ease-out; }
        .media-frame { width: 100%; height: 100%; position: relative; background: #f4f4f4; overflow: hidden; }
        .media-frame video { width: 100%; height: 100%; object-fit: cover; }
        
        .site-nav { position: fixed; top: 0; width: 100%; background: rgba(255,255,255,0.9); backdrop-filter: blur(20px); z-index: 21000; border-bottom: 1px solid rgba(0,0,0,0.05); }
        .nav-container { height: 100px; padding: 0 4vw; display: flex; align-items: center; justify-content: space-between; position: relative; }
        .nav-logo { font-size: 32px; font-weight: 900; letter-spacing: -2px; color: #000; text-decoration: none; position: absolute; left: 50%; transform: translateX(-50%); z-index: 2; }
        .nav-left { display: flex; align-items: center; gap: 40px; flex: 1; }
        .desktop-links { display: flex; gap: 30px; margin-left: 20px; }
        .desktop-links a { text-decoration: none; color: #000; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; opacity: 0.6; }
        .nav-right { flex: 1; display: flex; justify-content: flex-end; }
        .menu-trigger { background: none; border: none; padding: 10px; display: flex; flex-direction: column; gap: 6px; z-index: 30000; }
        .bar { width: 24px; height: 1.5px; background: #000; transition: 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .bar.open:nth-child(1) { transform: translateY(4px) rotate(45deg); }
        .bar.open:nth-child(2) { transform: translateY(-4px) rotate(-45deg); }
        .bag-trigger { background: none; border: none; font-weight: 900; font-size: 11px; letter-spacing: 1px; }

        .cat-root { display: flex; padding-top: 100px; min-height: 100vh; }
        .cat-sidebar { width: 350px; padding: 80px 4vw; position: sticky; top: 100px; height: calc(100vh - 100px); border-right: 1px solid #eee; overflow-y: auto; }
        .cat-breadcrumb { font-size: 10px; color: #bbb; letter-spacing: 2.5px; font-weight: 800; display: block; margin-bottom: 60px; text-transform: uppercase; }
        .cat-nav-list { display: flex; flex-direction: column; gap: 15px; }
        .cat-nav-list button { position: relative; display: flex; align-items: center; width: 100%; text-align: left; background: none; border: none; padding: 12px 0; font-weight: 800; font-size: 13px; color: #bbb; transition: 0.3s; letter-spacing: 0.5px; }
        .cat-nav-list button.active { color: #000; padding-left: 25px; }
        .active-indicator { position: absolute; left: 0; width: 2px; height: 18px; background: #000; }

        .cat-grid { flex: 1; display: grid; grid-template-columns: repeat(auto-fill, minmax(450px, 1fr)); gap: 1px; background: #eee; }
        .cat-card { background: #fff; padding: 60px; text-decoration: none; color: #000; display: flex; flex-direction: column; }
        .cc-media { aspect-ratio: 3/4; margin-bottom: 40px; overflow: hidden; }
        .cc-info h4 { font-size: 18px; font-weight: 900; margin: 12px 0; letter-spacing: -0.5px; }
        .sku { font-size: 10px; color: #aaa; font-weight: 800; letter-spacing: 1.5px; }

        .h-hero { height: 100vh; position: relative; overflow: hidden; }
        .h-hero-img { width: 100%; height: 100%; object-fit: cover; animation: scaleLoop 20s infinite alternate cubic-bezier(0.445, 0.05, 0.55, 0.95); }
        .h-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #fff; text-align: center; background: rgba(0,0,0,0.25); padding: 0 4vw; }
        .h-overlay h1 { font-size: clamp(60px, 12vw, 180px); line-height: 0.85; letter-spacing: -6px; margin-bottom: 50px; }
        .h-btn { padding: 24px 70px; border: 1px solid #fff; color: #fff; font-weight: 900; letter-spacing: 3px; text-decoration: none; font-size: 11px; transition: 0.4s; }
        .h-btn:hover { background: #fff; color: #000; }
        .h-marquee { background: #000; color: #fff; padding: 40px 0; overflow: hidden; white-space: nowrap; }
        .m-track { display: inline-block; animation: scroll 50s linear infinite; font-size: 12px; font-weight: 900; letter-spacing: 8px; }
        @keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        .footer { background: #fff; border-top: 1px solid #eee; }
        .f-container { padding: 120px 4vw 80px; }
        .f-main { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 100px; }
        .f-main h2 { font-size: 48px; font-weight: 900; letter-spacing: -3px; }
        .f-nav { display: flex; gap: 100px; }
        .f-col { display: flex; flex-direction: column; gap: 20px; font-size: 11px; font-weight: 900; color: #888; letter-spacing: 1.5px; }
        .copy { font-size: 11px; font-weight: 800; color: #bbb; margin-top: 40px; }

        .pd-root { display: flex; min-height: 100vh; padding-top: 100px; }
        .pd-visual { flex: 1; border-right: 1px solid #eee; }
        .pd-gallery { display: flex; flex-direction: column; gap: 1px; background: #eee; }
        .pd-gallery-item { background: #fff; }
        .pd-gallery-item.main { height: 100vh; }
        .pd-sidebar { width: 550px; }
        .pd-sticky-wrap { position: sticky; top: 100px; padding: 80px 5vw; height: calc(100vh - 100px); display: flex; flex-direction: column; overflow-y: auto; gap: 40px; }
        .pd-top h1 { font-size: 42px; font-weight: 900; letter-spacing: -2px; margin: 20px 0; line-height: 1; }
        .pd-back-link { background: none; border: none; font-weight: 900; font-size: 10px; letter-spacing: 2px; text-align: left; opacity: 0.4; transition: 0.3s; margin-bottom: -20px; }
        .pd-back-link:hover { opacity: 1; transform: translateX(-5px); }
        
        .pd-cta-block { display: flex; flex-direction: column; gap: 10px; }
        .pd-add-btn { width: 100%; background: #000; color: #fff; border: 1px solid #000; padding: 24px; font-weight: 900; font-size: 11px; letter-spacing: 3px; cursor: pointer; transition: 0.3s; }
        .pd-add-btn:hover { background: #fff; color: #000; }
        .pd-buy-btn { width: 100%; background: #fff; color: #000; border: 1px solid #000; padding: 24px; font-weight: 900; font-size: 11px; letter-spacing: 3px; cursor: pointer; transition: 0.3s; }
        .pd-buy-btn:hover { background: #000; color: #fff; }

        .pd-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: #eee; border: 1px solid #eee; margin-top: 20px; }
        .info-cell { background: #fff; padding: 25px; }
        .pd-details-sections details { border-bottom: 1px solid #eee; padding: 15px 0; }
        .pd-details-sections summary { list-style: none; font-weight: 900; font-size: 11px; letter-spacing: 2px; cursor: pointer; padding: 10px 0; }
        .p-content { padding: 20px 0; font-size: 15px; color: #444; line-height: 1.6; }

        .bag-overlay { position: fixed; inset: 0; z-index: 50000; display: flex; justify-content: flex-end; }
        .bag-scrim { position: absolute; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(10px); animation: fadeMenu 0.4s ease; }
        .bag-drawer { position: relative; width: 550px; height: 100%; background: #fff; display: flex; flex-direction: column; animation: drawerSlide 0.6s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: -20px 0 50px rgba(0,0,0,0.1); }
        .bag-header { padding: 40px; border-bottom: 1px solid #eee; }
        .bh-inner { display: flex; justify-content: space-between; align-items: center; }
        .bh-title { font-weight: 900; font-size: 11px; letter-spacing: 2px; }
        .bag-close-btn { background: none; border: none; font-weight: 900; font-size: 10px; opacity: 0.4; transition: 0.3s; }
        .bag-close-btn:hover { opacity: 1; }
        .bag-list { flex: 1; overflow-y: auto; padding: 40px; display: flex; flex-direction: column; gap: 40px; }
        .bag-item { display: flex; gap: 30px; }
        .bag-item-img { width: 120px; aspect-ratio: 3/4; background: #f4f4f4; }
        .bag-item-img img { width: 100%; height: 100%; object-fit: cover; }
        .bi-details { flex: 1; display: flex; flex-direction: column; }
        .bi-top { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .bi-top h4 { font-size: 13px; font-weight: 900; }
        .bi-top p { font-size: 13px; }
        .bi-sku { font-size: 10px; color: #bbb; margin-bottom: 20px; display: block; font-weight: 800; }
        .bi-remove { background: none; border: none; text-align: left; font-size: 10px; font-weight: 900; text-decoration: underline; opacity: 0.4; }
        .bag-footer { padding: 40px; border-top: 1px solid #eee; }
        .total-row { display: flex; justify-content: space-between; font-weight: 900; font-size: 14px; margin-bottom: 30px; }
        .checkout-btn { width: 100%; background: #000; color: #fff; border: none; padding: 22px; font-weight: 900; font-size: 11px; letter-spacing: 2px; }
        .empty-msg-wrap { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; }
        .empty-msg { font-weight: 900; color: #ccc; font-size: 12px; letter-spacing: 2px; }
        .shop-btn { background: #000; color: #fff; border: none; padding: 15px 30px; font-weight: 900; font-size: 10px; letter-spacing: 2px; }

        .menu-overlay { position: fixed; inset: 0; background: #fff; z-index: 25000; animation: fadeMenu 0.4s ease both; }
        .menu-close-x { position: absolute; top: 40px; right: 4vw; z-index: 30000; background: none; border: none; font-weight: 900; font-size: 11px; letter-spacing: 2px; cursor: pointer; }
        .menu-inner { display: flex; height: 100%; }
        .menu-visual { flex: 1; height: 100%; overflow: hidden; background: #f0f0f0; }
        .menu-visual img { width: 100%; height: 100%; object-fit: cover; opacity: 0.9; }
        .menu-content { width: 50%; padding: 120px 6vw; display: flex; flex-direction: column; justify-content: space-between; }
        .menu-header { font-size: 10px; font-weight: 900; letter-spacing: 4px; color: #aaa; }
        .menu-links { display: flex; flex-direction: column; gap: 20px; }
        .menu-links a { font-size: clamp(32px, 5vw, 64px); font-weight: 900; letter-spacing: -3px; color: #000; text-decoration: none; line-height: 1; transition: 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .menu-links a:hover { transform: translateX(20px); opacity: 0.5; }
        .menu-footer { display: flex; justify-content: space-between; font-size: 11px; font-weight: 900; letter-spacing: 1px; border-top: 1px solid #eee; pt: 40px; padding-top: 40px; }

        @media (max-width: 1024px) {
          .nav-container { height: 90px; }
          .nav-logo { font-size: 26px; }
          .desktop-links { display: none; }
          .menu-visual { display: none; }
          .menu-content { width: 100%; padding: 120px 8vw; }
          .cat-root { flex-direction: column; padding-top: 90px; }
          .cat-sidebar { width: 100%; height: auto; position: sticky; top: 90px; background: #fff; border-right: none; border-bottom: 1px solid #eee; padding: 25px 4vw; z-index: 10; }
          .cat-nav-list { flex-direction: row; overflow-x: auto; padding-bottom: 10px; gap: 25px; }
          .cat-nav-list button { width: auto; white-space: nowrap; padding: 10px 0; font-size: 12px; }
          .cat-grid { grid-template-columns: 1fr; }
          .cat-card { padding: 40px; }
          .pd-root { flex-direction: column; padding-top: 90px; }
          .pd-sidebar { width: 100%; }
          .pd-sticky-wrap { height: auto; position: static; padding: 50px 4vw; gap: 30px; }
          .f-main { flex-direction: column; gap: 50px; }
          .f-nav { flex-direction: column; gap: 30px; }
          .cursor-dot { display: none; }
          .bag-drawer { width: 100%; }
          * { cursor: auto !important; }
        }
      `}</style>
    </VelosProvider>
  );
}