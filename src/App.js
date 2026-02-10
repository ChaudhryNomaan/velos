import React, { useState, useEffect, useMemo, useRef, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';

const ASSETS = [
  { v: "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-showing-off-a-black-outfit-34505-large.mp4", i: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600" },
  { v: "https://assets.mixkit.co/videos/preview/mixkit-woman-modeling-a-white-dress-34506-large.mp4", i: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600" },
  { v: "https://assets.mixkit.co/videos/preview/mixkit-stylish-man-in-a-leather-jacket-standing-outdoors-34493-large.mp4", i: "https://images.unsplash.com/photo-1539109132314-3475d24c21c0?q=80&w=1600" },
  { v: "https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-in-a-silk-dress-41551-large.mp4", i: "https://images.unsplash.com/photo-1550639525-c97d455acf70?q=80&w=1600" },
  { v: "https://assets.mixkit.co/videos/preview/mixkit-model-holding-a-glass-of-champagne-34515-large.mp4", i: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600" },
  { v: "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-lighting-in-a-studio-34503-large.mp4", i: "https://images.unsplash.com/photo-1529133522506-004bb721950a?q=80&w=1600" }
];

const CAT_MAP = {
  "WOMEN": ["Outerwear", "Tailoring", "Knitwear", "Accessories"],
  "MEN": ["Technical", "Suits", "Leather", "Basics"],
  "LAB": ["Prototyping", "Hardware", "Liminal Space"]
};

const MASTER_VAULT = [];
Object.keys(CAT_MAP).forEach((cat, ci) => {
  CAT_MAP[cat].forEach((sub, si) => {
    for (let i = 1; i <= 8; i++) {
      const idx = (ci + si + i) % ASSETS.length;
      MASTER_VAULT.push({
        id: `velos-${cat}-${sub}-${i}`.toLowerCase().replace(/\s+/g, '-'),
        category: cat,
        subCategory: sub,
        name: `${sub.toUpperCase()} UNIT ${100 + i}`,
        price: (950 + (i * 150)).toFixed(2),
        sku: `VL-26-${cat.slice(0, 1)}-${si}${i}`,
        image: ASSETS[idx].i,
        video: ASSETS[idx].v,
        description: "An exploration of structural permanence. This unit utilizes high-density polymers and hand-stitched reinforcements to create a silhouette that defies seasonal trends.",
        techSpecs: ["Water-Repellent Coating", "Integrated Modular Loops", "Reinforced Pivot Points", "RFID Protection Pocket"],
        materials: "70% Recycled Polyamide, 30% Elastane. Hardware: Brushed Aluminum.",
        care: "Cold wash only. Do not tumble dry. Store in pH-neutral environment."
      });
    }
  });
});

const VelosContext = createContext();

export const VelosProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const addToBag = (item) => { setCart([...cart, item]); setIsBagOpen(true); };
  const removeFromBag = (id) => {
    const idx = cart.findIndex(i => i.id === id);
    if (idx > -1) { const n = [...cart]; n.splice(idx, 1); setCart(n); }
  };
  return (
    <VelosContext.Provider value={{ cart, addToBag, removeFromBag, isBagOpen, setIsBagOpen, isMenuOpen, setIsMenuOpen, cursorText, setCursorText }}>
      {children}
    </VelosContext.Provider>
  );
};

const MagneticCursor = () => {
  const { cursorText } = useContext(VelosContext);
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };
    window.addEventListener('mousemove', onMove);
    const animate = () => {
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.15;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      requestAnimationFrame(animate);
    };
    animate();
    return () => window.removeEventListener('mousemove', onMove);
  }, []);
  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className={`cursor-ring ${cursorText ? 'active' : ''}`}>
        {cursorText && <span className="cursor-label">{cursorText}</span>}
      </div>
    </>
  );
};

const Media = ({ v, i, className="" }) => (
  <div className={`media-frame ${className}`}>
    <video src={v} autoPlay loop muted playsInline poster={i} />
  </div>
);

const Nav = () => {
  const { cart, setIsBagOpen, isMenuOpen, setIsMenuOpen, setCursorText } = useContext(VelosContext);
  return (
    <header className="site-nav">
      <div className="nav-left">
        <button className="menu-trigger" onClick={() => setIsMenuOpen(!isMenuOpen)} onMouseEnter={() => setCursorText("MENU")}>
          <div className={`bar ${isMenuOpen ? 'open' : ''}`} />
          <div className={`bar ${isMenuOpen ? 'open' : ''}`} />
        </button>
        <div className="desktop-links">
          {Object.keys(CAT_MAP).map(c => <Link key={c} to={`/category/${c}`} onMouseEnter={() => setCursorText("GO")}>{c}</Link>)}
        </div>
      </div>
      <Link to="/" className="nav-logo" onMouseEnter={() => setCursorText("VELOS")}>VELOS</Link>
      <div className="nav-right">
        <button onClick={() => setIsBagOpen(true)} onMouseEnter={() => setCursorText("BAG")}>
          BAG <span className="bag-count">[{cart.length}]</span>
        </button>
      </div>
    </header>
  );
};

const MobileOverlay = () => {
  const { isMenuOpen, setIsMenuOpen } = useContext(VelosContext);
  if (!isMenuOpen) return null;
  return (
    <div className="menu-overlay">
      <div className="menu-content">
        <Link to="/" onClick={() => setIsMenuOpen(false)}>HOME ARCHIVE</Link>
        {Object.keys(CAT_MAP).map(c => (
          <Link key={c} to={`/category/${c}`} onClick={() => setIsMenuOpen(false)}>{c}</Link>
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const { setCursorText } = useContext(VelosContext);
  return (
    <div className="home-container">
      <section className="h-hero">
        <Media v={ASSETS[1].v} i={ASSETS[1].i} />
        <div className="h-overlay">
          <h1>THE 2026 <br/> ARCHIVE</h1>
          <p>MODULAR UTILITY {"//"} STRUCTURAL PERMANENCE</p>
          <Link to="/category/LAB" className="h-btn" onMouseEnter={() => setCursorText("ENTER")}>EXPLORE THE LAB</Link>
        </div>
      </section>
      <section className="h-asymmetric">
        <div className="ha-text">
          <h2>REDEFINING THE <br/> INDUSTRIAL UNIFORM</h2>
          <p>VELOS is a study of materials in motion. We create garments that serve as architectural extensions of the human form.</p>
        </div>
        <div className="ha-visual">
          <div className="ha-box"><Media v={ASSETS[2].v} i={ASSETS[2].i} /></div>
          <div className="ha-box small"><Media v={ASSETS[3].v} i={ASSETS[3].i} /></div>
        </div>
      </section>
      <section className="h-marquee">
        <div className="m-track">
          {[1,2,3,4].map(i => <span key={i}>VELOS LAB SERIES — 2026 EDITION — MODULARITY — VELOS LAB SERIES — </span>)}
        </div>
      </section>
      <footer className="footer">
        <div className="f-top">
          <h2>VELOS</h2>
          <div className="f-nav"><span>STORES</span><span>NEWSLETTER</span><span>INSTAGRAM</span></div>
        </div>
        <p className="copy">© 2026 VELOS ARCHIVE MANAGEMENT</p>
      </footer>
    </div>
  );
};

const Category = () => {
  const { catId } = useParams();
  const { setCursorText } = useContext(VelosContext);
  const [activeSub, setActiveSub] = useState("");
  useEffect(() => {
    if (CAT_MAP[catId]) setActiveSub(CAT_MAP[catId][0]);
    window.scrollTo(0, 0);
  }, [catId]);
  const items = useMemo(() => MASTER_VAULT.filter(i => i.category === catId && i.subCategory === activeSub), [catId, activeSub]);
  return (
    <div className="cat-root">
      <aside className="cat-sidebar">
        <h3>ARCHIVE / {catId}</h3>
        <div className="cat-nav-list">
          {CAT_MAP[catId]?.map(s => (
            <button key={s} className={activeSub === s ? 'active' : ''} onClick={() => setActiveSub(s)}>
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </aside>
      <main className="cat-grid">
        {items.map(p => (
          <Link key={p.id} to={`/product/${p.id}`} className="cat-card" onMouseEnter={() => setCursorText("VIEW")}>
            <div className="cc-media"><Media v={p.video} i={p.image} /></div>
            <div className="cc-info">
              <span className="sku">{p.sku}</span>
              <h4>{p.name}</h4>
              <p>€ {p.price}</p>
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
};

const Product = () => {
  const { prodId } = useParams();
  const { addToBag, setCursorText } = useContext(VelosContext);
  const p = MASTER_VAULT.find(x => x.id === prodId);
  useEffect(() => window.scrollTo(0, 0), [prodId]);
  if (!p) return null;
  return (
    <div className="pd-root">
      <div className="pd-visual"><Media v={p.video} i={p.image} /></div>
      <div className="pd-details">
        <div className="pd-scroll-box">
          <span className="sku">{p.sku}</span>
          <h1>{p.name}</h1>
          <p className="price">€ {p.price}</p>
          <div className="pd-section">
            <label>DESCRIPTION</label>
            <p className="txt">{p.description}</p>
          </div>
          <div className="pd-section">
            <label>TECHNICAL SPECIFICATIONS</label>
            <div className="spec-grid">
              {p.techSpecs.map(s => (
                <div key={s} className="spec-item">
                  <span>{"//"}</span> {s}
                </div>
              ))}
            </div>
          </div>
          <div className="pd-section">
            <label>MATERIALS & CARE</label>
            <p className="txt">{p.materials}</p>
            <p className="care-txt">{p.care}</p>
          </div>
          <button className="add-btn" onClick={() => addToBag(p)} onMouseEnter={() => setCursorText("ADD")}>
            ADD TO SHOPPING BAG
          </button>
        </div>
      </div>
    </div>
  );
};

const ShoppingBag = () => {
  const { cart, isBagOpen, setIsBagOpen, removeFromBag } = useContext(VelosContext);
  const total = cart.reduce((acc, i) => acc + parseFloat(i.price), 0).toFixed(2);
  if (!isBagOpen) return null;
  return (
    <div className="bag-portal">
      <div className="bag-scrim" onClick={() => setIsBagOpen(false)} />
      <div className="bag-drawer">
        <div className="bag-header">
          <h3>ARCHIVE BAG [{cart.length}]</h3>
          <button onClick={() => setIsBagOpen(false)}>CLOSE</button>
        </div>
        <div className="bag-items">
          {cart.map((item, idx) => (
            <div key={idx} className="bag-item">
              <div className="bi-visual"><Media v={item.video} i={item.image} /></div>
              <div className="bi-info">
                <h4>{item.name}</h4>
                <p>€ {item.price}</p>
                <button onClick={() => removeFromBag(item.id)}>REMOVE</button>
              </div>
            </div>
          ))}
        </div>
        <div className="bag-footer">
          <div className="total-row"><span>TOTAL</span><span>€ {total}</span></div>
          <button className="checkout-btn">PROCEED TO CHECKOUT</button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <VelosProvider>
      <Router>
        <MagneticCursor />
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
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #fff; color: #000; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        button, a { cursor: none !important; }
        .cursor-dot { position: fixed; top: 0; left: 0; width: 6px; height: 6px; background: #000; border-radius: 50%; z-index: 1000000; pointer-events: none; mix-blend-mode: difference; }
        .cursor-ring { position: fixed; top: -20px; left: -20px; width: 40px; height: 40px; border: 1px solid #000; border-radius: 50%; z-index: 1000000; pointer-events: none; display: flex; align-items: center; justify-content: center; transition: width 0.3s, height 0.3s, background 0.3s; }
        .cursor-ring.active { width: 100px; height: 100px; background: #000; border: none; top: -50px; left: -50px; }
        .cursor-label { color: #fff; font-size: 10px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; }
        .media-frame { width: 100%; height: 100%; position: relative; background: #f4f4f4; overflow: hidden; }
        .media-frame video { width: 100%; height: 100%; object-fit: cover; }
        .site-nav { position: fixed; top: 0; width: 100%; height: 100px; display: flex; align-items: center; justify-content: space-between; padding: 0 4vw; background: #fff; z-index: 10000; border-bottom: 1px solid #eee; }
        .nav-logo { font-size: 32px; font-weight: 900; letter-spacing: -2px; color: #000; text-decoration: none; position: absolute; left: 50%; transform: translateX(-50%); }
        .nav-left { display: flex; align-items: center; gap: 40px; }
        .menu-trigger { display: flex; flex-direction: column; gap: 6px; background: none; border: none; cursor: none; z-index: 10001; }
        .bar { width: 25px; height: 2px; background: #000; transition: 0.3s; }
        .bar.open:nth-child(1) { transform: translateY(4px) rotate(45deg); }
        .bar.open:nth-child(2) { transform: translateY(-4px) rotate(-45deg); }
        .desktop-links { display: flex; gap: 30px; }
        .desktop-links a { text-decoration: none; color: #000; font-size: 11px; font-weight: 900; letter-spacing: 2px; }
        .nav-right button { background: none; border: none; font-weight: 900; font-size: 11px; letter-spacing: 2px; }
        .bag-count { color: #ccc; margin-left: 5px; }
        .menu-overlay { position: fixed; inset: 0; background: #fff; z-index: 9999; display: flex; align-items: center; padding: 4vw; }
        .menu-content { display: flex; flex-direction: column; gap: 20px; }
        .menu-content a { font-size: clamp(50px, 10vw, 100px); font-weight: 900; letter-spacing: -5px; color: #000; text-decoration: none; line-height: 0.9; }
        .h-hero { height: 100vh; position: relative; }
        .h-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #fff; text-align: center; }
        .h-overlay h1 { font-size: clamp(80px, 15vw, 200px); line-height: 0.8; letter-spacing: -10px; margin-bottom: 30px; }
        .h-overlay p { font-size: 12px; letter-spacing: 4px; font-weight: 900; color: #aaa; margin-bottom: 50px; }
        .h-btn { padding: 20px 60px; border: 1px solid #fff; color: #fff; font-weight: 900; letter-spacing: 2px; text-decoration: none; font-size: 11px; }
        .h-asymmetric { display: flex; padding: 150px 4vw; gap: 5vw; background: #fff; }
        .ha-text { flex: 1; display: flex; flex-direction: column; justify-content: center; }
        .ha-text h2 { font-size: 60px; letter-spacing: -4px; line-height: 0.9; margin-bottom: 30px; }
        .ha-text p { max-width: 400px; color: #666; line-height: 1.8; }
        .ha-visual { flex: 1.5; position: relative; display: flex; gap: 30px; }
        .ha-box { flex: 1; height: 80vh; }
        .ha-box.small { height: 50vh; margin-top: 100px; }
        .h-marquee { background: #000; color: #fff; padding: 30px 0; overflow: hidden; white-space: nowrap; }
        .m-track { display: inline-block; animation: scroll 30s linear infinite; font-size: 12px; font-weight: 900; letter-spacing: 10px; }
        @keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .footer { padding: 100px 4vw 40px; border-top: 1px solid #eee; }
        .f-top { display: flex; justify-content: space-between; margin-bottom: 80px; }
        .f-top h2 { font-size: 40px; letter-spacing: -3px; }
        .f-nav { display: flex; gap: 40px; font-size: 11px; font-weight: 900; }
        .cat-root { display: flex; padding-top: 100px; min-height: 100vh; }
        .cat-sidebar { width: 350px; padding: 100px 4vw; border-right: 1px solid #eee; position: fixed; height: 100vh; background: #fff; }
        .cat-sidebar h3 { font-size: 11px; color: #ccc; letter-spacing: 3px; margin-bottom: 50px; }
        .cat-nav-list button { display: block; width: 100%; text-align: left; background: none; border: none; padding: 15px 0; font-weight: 900; font-size: 11px; color: #bbb; transition: 0.3s; cursor: none; }
        .cat-nav-list button.active { color: #000; padding-left: 20px; border-left: 2px solid #000; }
        .cat-grid { flex: 1; margin-left: 350px; display: grid; grid-template-columns: repeat(auto-fill, minmax(450px, 1fr)); gap: 1px; background: #eee; }
        .cat-card { background: #fff; padding: 60px; text-decoration: none; color: #000; }
        .cc-media { aspect-ratio: 3/4; margin-bottom: 30px; }
        .cc-info .sku { font-size: 10px; color: #ccc; font-weight: 900; }
        .cc-info h4 { font-size: 16px; font-weight: 900; margin: 5px 0; }
        .pd-root { display: flex; padding-top: 100px; min-height: 100vh; }
        .pd-visual { flex: 1.4; height: calc(100vh - 100px); position: sticky; top: 100px; }
        .pd-details { flex: 1; background: #fff; padding: 80px 5vw; }
        .pd-scroll-box { max-width: 500px; }
        .sku { font-size: 11px; font-weight: 900; color: #ccc; }
        h1 { font-size: clamp(40px, 5vw, 80px); font-weight: 900; letter-spacing: -4px; line-height: 0.9; margin: 20px 0; }
        .price { font-size: 28px; margin-bottom: 60px; }
        .pd-section { padding: 40px 0; border-top: 1px solid #eee; }
        .pd-section label { font-size: 10px; font-weight: 900; letter-spacing: 3px; color: #999; display: block; margin-bottom: 20px; }
        .txt { line-height: 1.7; font-size: 15px; color: #333; }
        .spec-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .spec-item { font-size: 11px; font-weight: 900; background: #f9f9f9; padding: 15px; border: 1px solid #eee; }
        .spec-item span { color: #ccc; margin-right: 5px; }
        .add-btn { width: 100%; padding: 30px; background: #000; color: #fff; border: none; font-weight: 900; letter-spacing: 5px; margin-top: 50px; cursor: none; }
        .bag-portal { position: fixed; inset: 0; z-index: 20000; display: flex; justify-content: flex-end; }
        .bag-scrim { position: absolute; inset: 0; background: rgba(255,255,255,0.8); backdrop-filter: blur(15px); }
        .bag-drawer { position: relative; width: 100%; max-width: 500px; background: #fff; height: 100%; border-left: 1px solid #000; display: flex; flex-direction: column; padding: 100px 40px 40px; }
        .bag-header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
        .bag-items { flex: 1; overflow-y: auto; }
        .bag-item { display: flex; gap: 20px; margin-bottom: 30px; }
        .bi-visual { width: 100px; height: 130px; }
        .bi-info h4 { font-size: 14px; margin-bottom: 5px; }
        .bag-footer { border-top: 1px solid #000; padding-top: 30px; }
        .total-row { display: flex; justify-content: space-between; font-size: 24px; font-weight: 900; margin-bottom: 30px; }
        .checkout-btn { width: 100%; padding: 25px; background: #000; color: #fff; font-weight: 900; border: none; letter-spacing: 4px; }
        @media (max-width: 1000px) {
          .cat-root, .pd-root { flex-direction: column; }
          .cat-sidebar, .pd-visual { position: static; width: 100%; height: auto; }
          .cat-grid { margin-left: 0; }
          .cursor-dot, .cursor-ring { display: none; }
          * { cursor: auto !important; }
        }
      `}</style>
    </VelosProvider>
  );
}