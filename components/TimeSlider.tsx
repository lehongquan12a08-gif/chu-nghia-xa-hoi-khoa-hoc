'use client';

import { useEffect, useRef, useState } from 'react';
import Reveal from '@/components/Reveal';

/**
 * KÉO MÀN THỜI GIAN — so sánh cùng-khung-hình hai thời kỳ bằng thanh gạt:
 * trái = 1985 (sepia), phải = hôm nay (có màu). Tự quét một nhịp khi màn vào
 * khung hình, sau đó người xem/người thuyết trình kéo tay thoải mái.
 */
export default function TimeSlider({
  id,
  before = '/images/csk/pho-xua.svg',
  after = '/images/csk/pho-nay.svg',
  beforeLabel = '1985',
  afterLabel = 'HÔM NAY',
}: {
  id?: string;
  before?: string;
  after?: string;
  beforeLabel?: string;
  afterLabel?: string;
}) {
  const [pos, setPos] = useState(18); // % vị trí mép phủ của ảnh "hôm nay"
  const boxRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const sweptRef = useRef(false);

  // tự quét 18% → 62% một lần khi màn vào giữa khung hình
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting || sweptRef.current) continue;
          sweptRef.current = true;
          const t0 = performance.now();
          const DUR = 2600;
          const tick = (t: number) => {
            const p = Math.min(1, (t - t0) / DUR);
            const ease = 1 - Math.pow(1 - p, 3);
            if (!draggingRef.current) setPos(18 + (62 - 18) * ease);
            if (p < 1 && !draggingRef.current) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.55 }
    );
    io.observe(box);
    return () => io.disconnect();
  }, []);

  const posFromEvent = (clientX: number) => {
    const box = boxRef.current;
    if (!box) return;
    const r = box.getBoundingClientRect();
    setPos(Math.max(2, Math.min(98, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <section
      id={id}
      data-dwell="4"
      className="relative flex min-h-screen items-center justify-center px-6 py-[12vh]"
      style={{ background: 'linear-gradient(180deg, #14100a 0%, #10201d 55%, #14100a 100%)' }}
    >
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="text-center">
          <p className="eyebrow mb-3 text-vn-gold-antique">Kéo màn thời gian</p>
          <h2 className="text-balance font-display text-[26px] font-bold uppercase leading-snug tracking-[0.05em] text-vn-ivory md:text-[length:clamp(38px,2.8vw,54px)]">
            Cùng một góc phố — hai thời kỳ
          </h2>
          <div className="gold-line mx-auto mb-9 mt-6 w-32" />
        </Reveal>

        <Reveal>
          <div
            ref={boxRef}
            className="relative w-full cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-[4px] border border-vn-gold-antique/30 shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
            style={{ aspectRatio: '12/7' }}
            onPointerDown={(e) => {
              draggingRef.current = true;
              (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
              posFromEvent(e.clientX);
            }}
            onPointerMove={(e) => {
              if (draggingRef.current) posFromEvent(e.clientX);
            }}
            onPointerUp={() => (draggingRef.current = false)}
            onPointerCancel={() => (draggingRef.current = false)}
          >
            {/* nền: 1985 sepia */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={before} alt={beforeLabel} className="absolute inset-0 h-full w-full object-cover" />
            {/* phủ: hôm nay, cắt theo vị trí gạt */}
            <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={after} alt={afterLabel} className="absolute inset-0 h-full w-full object-cover" />
            </div>
            {/* vạch gạt + tay nắm */}
            <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }}>
              <div className="absolute inset-y-0 -ml-[1.5px] w-[3px] bg-vn-gold shadow-[0_0_18px_rgba(233,184,76,0.7)]" />
              <div className="absolute top-1/2 -ml-[23px] flex h-[46px] w-[46px] -translate-y-1/2 items-center justify-center rounded-full border-2 border-vn-gold bg-vn-black/80 backdrop-blur-sm">
                <span className="font-body text-[15px] font-semibold tracking-widest text-vn-gold">⇄</span>
              </div>
            </div>
            {/* nhãn hai thời kỳ */}
            <span className="con-dau absolute left-4 top-4 !text-[11px] md:!text-[13px]">{beforeLabel}</span>
            <span
              className="absolute right-4 top-4 rounded-[3px] border-2 px-3 py-[5px] font-typewriter text-[11px] font-semibold uppercase tracking-[0.16em] md:text-[13px]"
              style={{ color: '#3fb8a9', borderColor: '#3fb8a9', background: 'rgba(63,184,169,0.1)', transform: 'rotate(1.4deg)' }}
            >
              {afterLabel}
            </span>
          </div>
          <p className="mt-4 text-center font-body text-[13px] text-vn-ivory/55 md:text-[15px]">
            Kéo vạch vàng để du hành — vẫn con phố ấy, vẫn con người ấy, chỉ cách nhau một chữ <b className="text-vn-gold">Đổi mới</b>.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
