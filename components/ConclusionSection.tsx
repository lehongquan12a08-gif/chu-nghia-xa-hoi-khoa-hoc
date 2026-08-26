'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { playChime } from '@/lib/uiSound';

// "Text hiện trên màn hình" — đúng 5 dòng theo kịch bản docx (bản rút gọn)
const ACHIEVEMENTS = [
  'Đập tan ách thống trị của Pháp.',
  'Giải phóng miền Bắc.',
  'Tạo tiền đề thống nhất đất nước.',
  'Cổ vũ phong trào giải phóng dân tộc.',
  'Khẳng định đường lối kháng chiến đúng đắn.',
];

/**
 * 5 THÀNH TỰU LỊCH SỬ — màn GHIM full-screen: từng thành tựu hiện lần lượt và
 * tích lũy theo đà cuộn (kèm chime), chốt bằng lời khẳng định đường lối.
 * Mobile: không ghim — chảy tự nhiên, hiện dần khi lướt tới.
 */
export default function ConclusionSection() {
  const root = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const on = () => setIsMobile(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  // MOBILE: reveal bằng IO + fallback cuộn (như SlideSection)
  useEffect(() => {
    if (!isMobile || !root.current) return;
    const els = [...root.current.querySelectorAll<HTMLElement>('.cn-reveal')];
    for (const el of els) {
      el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
      el.style.transform = 'translateX(-18px)';
    }
    const pending = new Set<HTMLElement>(els);
    const reveal = (el: HTMLElement) => {
      if (!pending.has(el)) return;
      pending.delete(el);
      el.style.opacity = '1';
      el.style.transform = 'none';
      io.unobserve(el);
    };
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && reveal(e.target as HTMLElement)),
      { rootMargin: '0px 0px -8% 0px' }
    );
    els.forEach((el) => io.observe(el));
    let last = 0;
    const onScroll = () => {
      const now = Date.now();
      if (now - last < 120 || pending.size === 0) return;
      last = now;
      const vh = window.innerHeight;
      for (const el of [...pending]) {
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.94 && r.bottom > 0) reveal(el);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      for (const el of els) {
        el.style.transition = '';
        el.style.transform = '';
        el.style.opacity = '';
      }
    };
  }, [isMobile]);

  useGSAP(
    () => {
      if (isMobile) return;
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 1 },
      });
      tl.fromTo(q('.cn-head'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.06 }, 0.04);
      tl.fromTo(q('.cn-line'), { scaleX: 0 }, { scaleX: 1, ease: 'power2.out', duration: 0.06 }, 0.07);
      // từng thành tựu hiện và Ở LẠI
      ACHIEVEMENTS.forEach((_, i) => {
        const at = 0.14 + i * 0.13;
        tl.call(playChime, [i], at);
        tl.fromTo(q(`.cn-item-${i}`), { opacity: 0, x: -28 }, { opacity: 1, x: 0, duration: 0.07 }, at);
      });
      // lời khẳng định chốt
      tl.call(playChime, [5], 0.84);
      tl.fromTo(q('.cn-final'), { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 0.07 }, 0.84);
      tl.to(q('.cn-stage'), { opacity: 1, duration: 0.01 }, 0.99); // đệm tới ~1
    },
    { scope: root, dependencies: [isMobile], revertOnUpdate: true }
  );

  return (
    <section
      id="ket-luan"
      ref={root}
      className="relative"
      style={{
        height: isMobile ? 'auto' : '340vh',
        background: 'linear-gradient(180deg, #080808 0%, #1a0d0b 50%, #080808 100%)',
      }}
    >
      {/* điểm neo DỪNG NHỊP: rơi vào đúng lúc màn ghim vừa hiện ĐỦ 5 thành tựu
          (cuối dải cuộn của section) — tự lướt giữ lại 4s cho lớp đọc */}
      {!isMobile && (
        <div
          data-dwell="4"
          aria-hidden="true"
          className="pointer-events-none absolute left-0 w-px"
          style={{ bottom: '40vh', height: '20vh' }}
        />
      )}
      <div
        className={
          isMobile
            ? 'relative overflow-hidden px-6 py-24'
            : 'sticky top-0 flex h-screen items-center overflow-hidden px-6'
        }
      >
        <div className="cn-stage mx-auto w-full max-w-4xl">
          <div className="cn-head cn-reveal will-transform text-center opacity-0">
            <p className="eyebrow mb-4 text-vn-gold-antique">Trải qua 9 năm gian khổ · 1946 — 1954</p>
            <h2 className="text-balance font-display text-[26px] font-bold uppercase leading-snug tracking-[0.05em] text-vn-ivory md:text-[length:clamp(40px,2.8vw,54px)]">
              5 thành tựu <span className="text-vn-gold text-glow-gold">lịch sử</span>
            </h2>
          </div>
          <div className="cn-line gold-line mx-auto mb-6 mt-5 w-36 origin-center" style={{ transform: 'scaleX(0)' }} />

          <ol className="flex flex-col gap-3.5 md:gap-4">
            {ACHIEVEMENTS.map((a, i) => (
              <li
                key={i}
                className={`cn-item-${i} cn-reveal will-transform flex items-start gap-5 border-l-2 border-vn-gold-antique/40 pl-5 opacity-0`}
              >
                <span className="font-display text-3xl font-bold leading-none text-vn-gold/60 md:text-4xl">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-pretty pt-1 font-body text-base leading-relaxed text-vn-ivory/95 md:text-[length:clamp(21px,1.4vw,27px)]">
                  {a}
                </p>
              </li>
            ))}
          </ol>

          <div className="cn-final cn-reveal will-transform mt-7 border border-vn-gold-antique/30 bg-[rgba(218,37,29,0.06)] p-6 text-center opacity-0 md:p-8">
            <p className="text-balance font-display text-[15px] font-semibold uppercase tracking-[0.18em] text-vn-gold md:text-[length:clamp(18px,1.25vw,24px)]">
              Toàn dân – Toàn diện – Trường kỳ – Tự lực cánh sinh – Quốc tế
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
