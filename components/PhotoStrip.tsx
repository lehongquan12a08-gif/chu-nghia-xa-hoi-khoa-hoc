'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { playChime } from '@/lib/uiSound';

interface StripImage {
  src: string;
  caption: string;
}

interface PhotoStripProps {
  id?: string;
  eyebrow: string;
  images: StripImage[];
  /** Câu nhấn lớn hiện sau chuỗi ảnh (vd "HẬU PHƯƠNG LỚN – TIỀN TUYẾN LỚN"). */
  keyText?: string;
  background?: string;
}

/**
 * Chuỗi ảnh tư liệu nối tiếp nhau trong một màn hình dính: mỗi ảnh hiện dần →
 * giữ → nhường ảnh kế; kết bằng câu nhấn lớn. Timeline đệm tới ~1 để mốc khớp
 * phần trăm cuộn.
 */
export default function PhotoStrip({ id, eyebrow, images, keyText, background = '#0b0a09' }: PhotoStripProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 1 },
      });
      const n = images.length;
      const span = keyText ? 0.72 : 0.9; // phần dành cho chuỗi ảnh
      const slot = span / n;
      images.forEach((_, i) => {
        const at = 0.04 + i * slot;
        // hiện nhanh (25% slot) → GIỮ lâu (tới 80%) → nhường ảnh kế
        tl.fromTo(q(`.ps-${i}`), { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: slot * 0.25 }, at);
        tl.to(q(`.ps-${i}`), { opacity: 0, scale: 0.98, duration: slot * 0.2 }, at + slot * 0.8);
      });
      if (keyText) {
        tl.call(playChime, [0], 0.8);
        tl.fromTo(q('.ps-key'), { opacity: 0, scale: 1.2 }, { opacity: 1, scale: 1, duration: 0.07 }, 0.8);
      }
      tl.to(q('.ps-stage'), { opacity: 1, duration: 0.01 }, 0.99);
    },
    { scope: root }
  );

  return (
    <section
      id={id}
      ref={root}
      className="relative"
      style={{ height: `${images.length * 100 + 180}vh`, background }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="ps-stage relative h-full">
          <p className="eyebrow absolute left-1/2 top-[7%] z-20 w-[92%] max-w-3xl -translate-x-1/2 text-center text-vn-gold-antique">
            {eyebrow}
          </p>

          {images.map((im, i) => (
            <figure
              key={i}
              className={`ps-${i} will-transform absolute inset-0 flex flex-col items-center justify-center px-6 opacity-0`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={im.src}
                alt={im.caption}
                className="max-h-[62vh] w-auto max-w-[90vw] object-contain md:max-w-[70vw]"
                style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.7)' }}
              />
              <figcaption className="mt-5 max-w-xl text-center font-serif-hist text-base italic text-vn-ivory/80 md:text-lg">
                {im.caption}
              </figcaption>
            </figure>
          ))}

          {keyText && (
            <div className="ps-key will-transform absolute inset-0 z-10 flex items-center justify-center px-6 opacity-0">
              <h2 className="text-center font-serif-hist text-3xl font-black uppercase leading-tight tracking-[0.12em] text-vn-gold text-glow-gold md:text-6xl">
                {keyText}
              </h2>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
