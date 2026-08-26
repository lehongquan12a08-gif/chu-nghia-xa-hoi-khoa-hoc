'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { playChime } from '@/lib/uiSound';

interface DateRevealProps {
  id?: string;
  /** Các cụm số, ví dụ ['19', '12', '1946'] — cụm cuối tô vàng. */
  parts: string[];
  /** Dòng chữ lớn hiện sau khi ngày ghép xong. */
  heading?: string;
  sub?: string;
  /** Các dòng "tuyên bố" đóng dấu lần lượt sau tiêu đề (vd kết quả chiến dịch). */
  lines?: { text: string; accent?: boolean }[];
  background?: string;
}

/**
 * Màn ghép ngày tháng: từng cụm số hiện lần lượt (kèm tiếng chime), giữ lại
 * trên màn hình; tiêu đề lớn hiện bên dưới; các dòng tuyên bố (nếu có) đóng dấu
 * lần lượt. Timeline đệm tới ~1 để mốc khớp phần trăm cuộn.
 */
export default function DateReveal({ id, parts, heading, sub, lines = [], background = '#080808' }: DateRevealProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 1 },
      });
      parts.forEach((_, i) => {
        tl.call(playChime, [i], 0.05 + i * 0.09);
        tl.fromTo(
          q(`.dp-${i}`),
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.04 },
          0.05 + i * 0.09
        );
      });
      const after = 0.05 + parts.length * 0.09 + 0.06;
      if (heading) {
        tl.call(playChime, [parts.length], after);
        tl.fromTo(q('.d-heading'), { opacity: 0, scale: 1.18 }, { opacity: 1, scale: 1, duration: 0.06 }, after);
      }
      if (sub) tl.fromTo(q('.d-sub'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.05 }, after + 0.1);
      // các dòng tuyên bố — đóng dấu (scale-in) lần lượt, ở lại
      lines.forEach((_, i) => {
        const at = after + 0.16 + i * 0.16;
        tl.call(playChime, [parts.length + 1 + i], at);
        tl.fromTo(q(`.d-line-${i}`), { opacity: 0, scale: 1.28 }, { opacity: 1, scale: 1, ease: 'power2.out', duration: 0.07 }, at);
      });
      // giữ trên màn hình tới cuối section (đệm timeline tới ~1)
      tl.to(q('.d-stage'), { opacity: 1, duration: 0.02 }, 0.98);
    },
    { scope: root }
  );

  return (
    <section id={id} ref={root} className="relative h-[300vh]" style={{ background }}>
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <div className="d-stage flex flex-col items-center px-6 text-center">
          <div className="flex items-baseline gap-3 md:gap-6">
            {parts.map((p, i) => (
              <span key={i} className="flex items-baseline gap-3 md:gap-6">
                {i > 0 && (
                  <span className="font-display font-bold text-vn-gold/70" style={{ fontSize: 'clamp(64px, 9vw, 168px)', lineHeight: 0.95 }}>
                    /
                  </span>
                )}
                <span
                  className={[
                    `dp-${i} will-transform font-display font-bold opacity-0`,
                    i === parts.length - 1 ? 'text-vn-gold text-glow-gold' : 'text-vn-ivory',
                  ].join(' ')}
                  style={{ fontSize: 'clamp(64px, 9vw, 168px)', lineHeight: 0.95, letterSpacing: '-0.01em' }}
                >
                  {p}
                </span>
              </span>
            ))}
          </div>
          {heading && (
            <h2 className="d-heading will-transform mt-8 font-display text-3xl font-bold uppercase leading-tight tracking-[0.12em] text-vn-ivory opacity-0 md:text-6xl">
              {heading}
            </h2>
          )}
          {sub && (
            <p className="d-sub will-transform mt-6 max-w-2xl text-balance font-body text-base leading-relaxed text-vn-ivory/70 opacity-0 md:text-xl">
              {sub}
            </p>
          )}
          {lines.length > 0 && (
            <div className="mt-10 flex flex-col items-center gap-5">
              {lines.map((l, i) => (
                <p
                  key={i}
                  className={[
                    `d-line-${i} will-transform text-balance font-display text-lg font-semibold uppercase leading-snug tracking-[0.06em] opacity-0 md:text-[length:clamp(30px,2vw,38px)]`,
                    l.accent ? 'text-vn-red' : 'text-vn-ivory',
                  ].join(' ')}
                  style={l.accent ? { textShadow: '0 0 34px rgba(218,37,29,0.4)' } : undefined}
                >
                  {l.text}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
