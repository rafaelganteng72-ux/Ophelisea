import { useState, useEffect, useRef } from "react";

/* =====================================================================
   ✏️  EDIT DI SINI — semua teks, link, dan gambar ada di bagian ini
   ===================================================================== */
const IG_USER = "sealonelytarius_"; // ← username Instagram tanpa @
const igLink = `https://instagram.com/${IG_USER}`;

// 🖼️ PORTOFOLIO (6 kartu). Taruh file di folder  public/portfolio/
//   still = gambar diam (PNG/WebP)  |  gif = versi bergerak, muncul saat kursor menyentuh
const PORTFOLIO = [
  { name: "Suki Anone Anone", still: "/portfolio/suki-1-still.png?v=2", gif: "/portfolio/suki-1.gif" },
  { name: "Suki Makan Popkron", still: "/portfolio/suki-2-still.png", gif: "/portfolio/suki-2.gif" },
  { name: "Suki dengerin Bhass", still: "/portfolio/suki-3-still.png", gif: "/portfolio/suki-3.gif" },
  { name: "Suki ngajak mabar", still: "/portfolio/suki-4-still.png", gif: "/portfolio/suki-4.gif" },
  { name: "Suki Daisuki", still: "/portfolio/suki-5-still.png?v=2", gif: "/portfolio/suki-5.gif" },
  { name: "Kicaw Mania !!!", still: "/portfolio/suki-6-still.png?v=2", gif: "/portfolio/suki-6.gif" },
];

// 🖼️ SLIDER HASIL (carousel). Taruh file di  public/slides/
const SLIDES = ["/slides/porto-1.png", "/slides/porto-2.png", "/slides/porto-3.png", "/slides/porto-4.png"];

// 🖼️ MASKOT KECIL (dekorasi). Taruh file di  public/decor/
const DECOR = {
  step: ["/decor/step-1.png", "/decor/step-2.png", "/decor/step-3.png"],
  priceTitle: "/decor/price-title.png",
  pricePeek: "/decor/price-peek.png",
  diamondsHero: "/decor/diamonds-hero.png", // ketupat bagian hero
  diamondsPrice: "/decor/diamonds-price.png", // ketupat bagian price
};

// Gambar karakter hero: public/hero-character.png  |  Logo navbar: public/logo-text.png

const STEPS = [
  ["Chat & Request", "Beritahu tentang model stiker yang kamu inginkan"],
  ["DP & Work in Progress", "Setelah anda DP, admin mulai Work in Progress"],
  ["Finish !!!", "Setelah selesai, admin akan mengirimkan hasil dengan watermark. jika sudah lunas maka akan dikirimkan versi fullnya :)"],
];
const PRICE = { old: "100rb", now: "35rb", badge: "15 Stickers GIF", perks: ["15 Sticker Chubby", "Beranimasi loop"] };
/* ===================================================================== */

const Ig = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" />
  </svg>
);

/* Slide masuk dari kiri ke kanan saat komponen masuk layar.
   Setiap kali komponen keluar dari layar, posisinya di-reset ke kiri,
   sehingga animasi tetap diputar ulang ketika kita scroll kembali ke section tsb. */
function Reveal({ children, className = "", delay = 0, from = "-translate-x-16" }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShow(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ transitionDelay: show ? `${delay}ms` : "0ms" }}
      className={`transition-all duration-700 ease-out ${show ? "translate-x-0 opacity-100" : `${from} opacity-0`} ${className}`}>
      {children}
    </div>
  );
}

/* Penampil gambar ukuran penuh — muncul saat gambar portofolio diklik,
   ditutup dengan klik di luar/X/tombol Escape. */
function Lightbox({ src, alt, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);
  return (
    <div onClick={onClose} className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
      <img src={src} alt={alt} onClick={(e) => e.stopPropagation()}
        className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl" />
      <button type="button" onClick={onClose} aria-label="Tutup"
        className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-2xl transition hover:bg-white/30">✕</button>
    </div>
  );
}

function Nav() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(t);
  }, []);
  return (
    <header className={`sticky top-0 z-50 bg-[#2d0043]/90 backdrop-blur-md transition-all duration-700 ease-out ${show ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}>
      <nav className="mx-auto grid max-w-6xl grid-cols-[auto_1fr_auto] h-14 items-center px-5 font-nav text-sm">
        <a href="#top"><img src="/logo-text.png" alt="OpheliSea" className="h-9 w-auto transition hover:scale-105" /></a>
        <div className="flex justify-center gap-10">
          {[["Portofolio", "#portofolio"], ["Step to Order", "#step"], ["Price", "#price"]].map(([t, h]) => (
            <a key={h} href={h} className="text-white/90 transition hover:text-[#d9b8ff]">{t}</a>
          ))}
        </div>
        <span className="w-9" />
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative z-10 flex min-h-[calc(100svh-3.5rem)] scroll-mt-14 items-center">
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-6 px-6 py-10 md:grid-cols-[1.1fr_.9fr]">
        <div>
          <Reveal>
            <h1 className="font-slogan text-5xl leading-[1.05] sm:text-6xl md:text-7xl">“a Little Piece of You”</h1>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/85">Jasa desain stiker animasi karakter chubby custom untuk Discord, WhatsApp, dan Streaming Assets</p>
          </Reveal>
          <Reveal delay={300} className="mt-7 flex flex-wrap gap-3">
            <a href={igLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/50 px-5 py-2 text-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"><Ig className="h-4 w-4" />@{IG_USER}</a>
          </Reveal>
        </div>
        <Reveal from="translate-x-12 scale-95" delay={200} className="relative">
          <img src="/hero-character.png" alt="OpheliSea" className="mx-auto w-full max-w-md animate-floaty drop-shadow-[0_20px_40px_rgba(20,0,50,.5)]" />
        </Reveal>
      </div>
    </section>
  );
}

function StickerCard({ item, delay }) {
  const [hover, setHover] = useState(false);
  const [gifBroken, setGifBroken] = useState(false);
  const [open, setOpen] = useState(false);
  const showGif = hover && !gifBroken;
  const src = showGif ? item.gif : item.still;
  const enter = () => setHover(true);
  const leave = () => { setHover(false); setGifBroken(false); };
  return (
    <Reveal delay={delay}>
      <div tabIndex={0} role="button" onClick={() => setOpen(true)}
        onPointerEnter={enter} onPointerLeave={leave} onFocus={enter} onBlur={leave}
        className="group flex h-[clamp(8rem,19vh,13rem)] cursor-pointer flex-col items-center rounded-[2rem] border border-white/30 bg-white/[.06] px-3 pb-3 pt-2 shadow-[inset_0_0_30px_rgba(255,255,255,.05)] backdrop-blur-sm transition duration-500 hover:-translate-y-1.5 hover:border-white/60 hover:bg-white/[.12] hover:shadow-[0_0_40px_rgba(190,140,255,.45)]">
        <div className="flex min-h-0 flex-1 items-center justify-center">
          {/* sebelum disentuh tampil gambar diam; file .gif hanya dimuat saat kursor mengarah ke kartu.
             kalau file .gif tidak ada, gambar diam tetap tampil dan bergoyang. */}
          <img key={src} src={src} alt={item.name} draggable="false"
            onError={() => { if (showGif) setGifBroken(true); }}
            className={`max-h-full object-contain transition-transform duration-500 ${hover ? (showGif ? "scale-110" : "animate-wiggle") : ""}`} />
        </div>
        <p className="font-caption text-xs font-bold sm:text-sm">{item.name}</p>
      </div>
      {open && <Lightbox src={gifBroken ? item.still : item.gif} alt={item.name} onClose={() => setOpen(false)} />}
    </Reveal>
  );
}

function Carousel() {
  const n = SLIDES.length;
  const [i, setI] = useState(2);
  const [full, setFull] = useState(null);
  const [paused, setPaused] = useState(false);
  const x0 = useRef(null);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((v) => (v + 1) % n), 4000);
    return () => clearInterval(t);
  }, [paused, n]);
  const go = (d) => setI((v) => (v + d + n) % n);
  return (
    <div className="mt-[4vh] text-center" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
      <Reveal><p className="font-caption">THE RESULT</p></Reveal>
      <Reveal delay={150}>
        <div className="relative mx-auto mt-4 h-[clamp(150px,27vh,380px)] max-w-6xl touch-pan-y select-none overflow-hidden"
          onPointerDown={(e) => (x0.current = e.clientX)}
          onPointerUp={(e) => { const d = e.clientX - x0.current; if (Math.abs(d) > 40) go(d < 0 ? 1 : -1); }}>
          {SLIDES.map((s, idx) => {
            let off = (idx - i + n) % n; if (off > n / 2) off -= n;
            return (
              <img key={s} src={s} alt={`Hasil ${idx + 1}`} draggable="false" onClick={() => (off === 0 ? setFull(idx) : setI(idx))}
                className="absolute top-0 h-full rounded-[1.75rem] object-cover shadow-[0_20px_50px_-10px_rgba(20,0,60,.6)] transition-all duration-700 ease-[cubic-bezier(.4,.1,.2,1)]"
                style={{ width: "46%", left: "27%", transform: `translateX(${off * 108}%) scale(${off === 0 ? 1 : 0.82})`, opacity: Math.abs(off) > 1 ? 0 : off === 0 ? 1 : 0.75, zIndex: 10 - Math.abs(off), cursor: off === 0 ? "zoom-in" : "pointer" }} />
            );
          })}
        </div>
        {full !== null && <Lightbox src={SLIDES[full]} alt={`Hasil ${full + 1}`} onClose={() => setFull(null)} />}
      </Reveal>
      <div className="mt-4 flex justify-center gap-2.5">
        {SLIDES.map((_, d) => (
          <button key={d} onClick={() => setI(d)} aria-label={`Slide ${d + 1}`} className={`h-2.5 rounded-full transition-all duration-500 ${d === i ? "w-6 bg-white" : "w-2.5 bg-white/40 hover:bg-white/70"}`} />
        ))}
      </div>
    </div>
  );
}

function Portfolio() {
  return (
    <section id="portofolio" className="relative z-10 flex min-h-[calc(100svh-3.5rem)] scroll-mt-14 items-center px-5 py-10">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">Our Portfolio</h2>
          <p className="mt-3 max-w-[16rem] text-xs leading-relaxed text-white/85">Semua stiker bergerak. Sentuh kartu untuk melihat versi gambar bergeraknya</p>
        </Reveal>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
          {PORTFOLIO.map((p, k) => <StickerCard key={p.name} item={p} delay={(k % 3) * 120} />)}
        </div>
        <Carousel />
      </div>
    </section>
  );
}

function Steps() {
  const pos = ["-left-11 top-0", "-top-10 left-4", "left-16 -top-1"];
  return (
    <section id="step" className="flex min-h-[calc(100svh-3.5rem)] scroll-mt-14 items-center bg-gradient-to-b from-[#6a27bd] via-[#4d1396] to-[#340071] px-5 py-16">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal><h2 className="font-display text-3xl font-semibold sm:text-4xl">Step to Order</h2></Reveal>
        <ol className="relative mt-16 grid gap-12 md:grid-cols-3">
          <span className="absolute left-[8%] right-[8%] top-7 hidden h-px bg-white/50 md:block" />
          {STEPS.map(([t, d], k) => (
            <Reveal key={t} delay={k * 180}>
              <li className="list-none pl-12 md:pl-8">
                <div className="relative w-fit">
                  <span className="relative z-10 grid h-14 w-14 place-items-center rounded-full bg-white font-display text-2xl font-bold text-[#6a29c2] shadow-[0_0_30px_rgba(255,255,255,.35)]">{k + 1}</span>
                  <img src={DECOR.step[k]} alt="" className={`absolute z-20 h-12 w-12 animate-floaty object-contain ${pos[k]}`} style={{ animationDelay: `${k * 0.8}s` }} />
                </div>
                <h3 className="mt-4 font-caption text-base font-bold">{t}</h3>
                <p className="mt-2 max-w-[13rem] font-caption text-xs leading-relaxed text-white/85">{d}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Price() {
  return (
    <section id="price" className="relative flex min-h-[calc(100svh-3.5rem)] scroll-mt-14 items-center overflow-hidden bg-gradient-to-b from-[#340071] via-[#5a2aa0] via-60% to-[#f2e8fe] px-5 py-16">
      <div aria-hidden="true" className="pointer-events-none absolute right-0 top-1/2 w-[60%] max-w-4xl -translate-y-1/2">
        <img src={DECOR.diamondsPrice} alt="" className="diamond-float w-full object-contain" />
      </div>
      <div className="relative mx-auto w-full max-w-5xl">
        <Reveal className="flex items-center gap-3">
          <h2 className="font-display text-5xl font-bold">Price</h2>
          <img src={DECOR.priceTitle} alt="" className="h-14 w-14 animate-floaty object-contain" />
        </Reveal>
        <Reveal delay={150}>
          <div className="relative mt-6 flex flex-col items-center gap-6 overflow-hidden rounded-[2.2rem] bg-violet p-8 shadow-[0_30px_70px_-20px_rgba(30,0,80,.7)] md:flex-row md:justify-center md:gap-14 md:p-10">
            <div className="flex flex-col items-center text-center">
              <p className="font-display text-4xl font-semibold line-through decoration-heart decoration-4">{PRICE.old}</p>
              <p className="mt-1 flex items-end gap-2 font-display">
                <span className="mb-3 text-4xl font-semibold">Rp.</span>
                <span className="text-8xl font-bold leading-none sm:text-9xl">{PRICE.now}</span>
              </p>
              <span className="mt-4 inline-block rounded-full bg-[#ff2e7e] px-8 py-3 font-display text-xl shadow-[0_0_28px_#ff2e7e99]">{PRICE.badge}</span>
            </div>
            <ul className="space-y-3 rounded-2xl border border-white/40 bg-white/5 px-8 py-6 font-display text-xl backdrop-blur">
              {PRICE.perks.map((x) => <li key={x} className="flex items-center justify-center gap-3"><span className="h-2 w-2 rounded-full bg-white" />{x}</li>)}
            </ul>
            <img src={DECOR.pricePeek} alt="" className="absolute -bottom-3 right-3 h-36 w-36 animate-floaty object-contain" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section className="flex min-h-[calc(100svh-3.5rem)] scroll-mt-14 flex-col bg-gradient-to-b from-[#f2e8fe] to-[#d5b0ff] px-5 pb-6 pt-10 text-white">
      <Reveal className="my-auto w-full">
        <div className="mx-auto max-w-3xl rounded-[2.2rem] bg-violet px-6 py-14 text-center shadow-[0_30px_70px_-20px_rgba(80,20,160,.7)]">
          <h2 className="font-slogan text-3xl font-bold uppercase leading-snug tracking-wide sm:text-4xl">Ready to show<br />“A little piece of you”?</h2>
          <p className="mt-6 text-sm">chat sekarang, tunjukan idemu. kami menunggumu 😊</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href={igLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-white/70 px-8 py-3 transition hover:-translate-y-0.5 hover:bg-white/15"><Ig className="h-5 w-5" />@{IG_USER}</a>
          </div>
        </div>
      </Reveal>
      <Reveal delay={150}>
        <p className="pt-10 text-center font-nav text-sm text-[#3a1a66]/80">© {new Date().getFullYear()} OpheliSea — A Little Piece of You</p>
      </Reveal>
    </section>
  );
}

export default function App() {
  return (
    <div className="overflow-x-clip">
      <Nav />
      <main>
        <div className="relative bg-gradient-to-b from-[#40015f] via-[#5b1c9b] to-[#6a27bd]">
          <img src={DECOR.diamondsHero} alt="" aria-hidden="true" className="diamond-float pointer-events-none absolute right-0 top-0 z-0 h-[calc((100svh-3.5rem)*1.45)] w-auto max-w-none object-contain object-right-top opacity-90" />
          <Hero /><Portfolio />
        </div>
        <Steps /><Price />
      </main>
      <Cta />
    </div>
  );
}
