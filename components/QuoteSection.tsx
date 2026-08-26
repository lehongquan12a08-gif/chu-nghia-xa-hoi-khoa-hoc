'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { verifiedQuote } from '@/data/timeline';
import { playChime } from '@/lib/uiSound';

// NGUYÊN VĂN Lời kêu gọi Toàn quốc kháng chiến — không thêm bớt chữ.
const CLAUSES: { text: string; accent?: boolean }[] = [
  { text: 'THÀ HY SINH TẤT CẢ,' },
  { text: 'CHỨ NHẤT ĐỊNH KHÔNG CHỊU MẤT NƯỚC,', accent: true },
  { text: 'NHẤT ĐỊNH KHÔNG CHỊU LÀM NÔ LỆ.', accent: true },
];

/**
 * "PHẦN GIỮA — LƯỚT XUỐNG": đúng kiểu chữ-lướt của trang — MỖI VẾ hiện MỘT MÌNH
 * trên màn hình rồi nhường vế sau; vế cuối ở lại cùng nguồn trích dẫn.
 */
export default function QuoteSection() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const items = q('.qline');
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 1 },
      });
      items.forEach((el, i) => {
        const at = i * 1;
        tl.call(playChime, [i], at + 0.06);
        tl.fromTo(
          el,
          { opacity: 0, scale: 0.86, filter: 'blur(6px)' },
          { opacity: 1, scale: 1, filter: 'blur(0px)', ease: 'power2.out', duration: 0.6 },
          at
        );
        // vế trước nhường chỗ vế sau — TRỪ vế cuối (ở lại cùng nguồn trích)
        if (i < items.length - 1) {
          tl.to(el, { opacity: 0, scale: 1.3, filter: 'blur(4px)', ease: 'power2.in', duration: 0.5 }, at + 0.55);
        }
      });
      tl.fromTo(q('.qattr'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.35 }, items.length - 0.65);
    },
    { scope: root }
  );

  return (
    <section
      id="quote"
      ref={root}
      className="relative"
      style={{ height: `${CLAUSES.length * 85 + 70}vh`, backgroundColor: '#F4EBD8' }}
    >
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6">
        <p
          className="eyebrow absolute left-1/2 top-[12%] -translate-x-1/2 whitespace-nowrap text-vn-brown/75"
          style={{ fontSize: 'clamp(14px, 1.15vw, 22px)' }}
        >
          Lời kêu gọi Toàn quốc kháng chiến
        </p>

        {CLAUSES.map((c, i) => {
          // vế dài → xuống 2 dòng cân đối, chữ vẫn to (không ép nhỏ/tràn mép)
          const long = c.text.length > 22;
          const style: React.CSSProperties = long
            ? { fontSize: 'clamp(26px, 4.6vw, 82px)', whiteSpace: 'normal', textWrap: 'balance', maxWidth: '88vw', lineHeight: 1.12 }
            : { fontSize: 'clamp(30px, 5.4vw, 98px)', whiteSpace: 'nowrap' };
          return (
            <h2
              key={i}
              className={[
                'qline will-transform absolute select-none text-center font-serif-hist font-black opacity-0',
                c.accent ? 'text-vn-red' : 'text-vn-charcoal',
              ].join(' ')}
              style={style}
            >
              {c.text}
            </h2>
          );
        })}

        <div className="qattr absolute bottom-[14%] left-1/2 w-full -translate-x-1/2 text-center opacity-0">
          <p className="font-body text-base font-medium uppercase tracking-[0.28em] text-vn-brown md:text-[length:clamp(19px,1.4vw,27px)]">
            — {verifiedQuote.attribution}
          </p>
          <p className="mt-2.5 font-body text-[13px] uppercase tracking-[0.2em] text-vn-brown/65 md:text-[length:clamp(15px,1.05vw,20px)]">
            {verifiedQuote.context}
          </p>
        </div>
      </div>
    </section>
  );
}
