'use client';

import { useCallback, useEffect, useState } from 'react';
import Reveal from '@/components/Reveal';

export interface GalleryPhoto {
  src: string;
  /** Tên hiện vật — nhãn bảo tàng dòng 1 */
  title: string;
  /** Năm / giai đoạn */
  year?: string;
  /** Nguồn ảnh + giấy phép — LUÔN ghi (nguyên tắc của dự án) */
  source?: string;
  /** true = ảnh dọc/cao, chiếm 2 hàng trong tường ảnh */
  tall?: boolean;
  /** true = ảnh tài liệu, hiển thị trọn không cắt */
  contain?: boolean;
}

interface GallerySectionProps {
  id?: string;
  eyebrow: string;
  title?: string;
  intro?: string;
  photos: GalleryPhoto[];
  background?: string;
}

/**
 * TƯỜNG ẢNH BẢO TÀNG — lưới ảnh đóng khung kiểu phòng trưng bày, nhãn hiện vật
 * (tên · năm · nguồn) dưới mỗi khung; bấm vào ảnh phóng to toàn màn (lightbox),
 * đóng bằng Esc / bấm nền. Ảnh là nhân vật chính — chữ chỉ làm nhãn.
 */
export default function GallerySection({
  id,
  eyebrow,
  title,
  intro,
  photos,
  background = 'radial-gradient(ellipse at 50% 35%, #1c150c 0%, #14100a 74%)',
}: GallerySectionProps) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') setOpen((v) => (v === null ? v : Math.min(photos.length - 1, v + 1)));
      if (e.key === 'ArrowLeft') setOpen((v) => (v === null ? v : Math.max(0, v - 1)));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close, photos.length]);

  return (
    <section id={id} data-dwell="5" className="relative px-6 py-[13vh]" style={{ background }}>
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="text-center">
          <p className="eyebrow mb-3 text-vn-gold-antique">{eyebrow}</p>
          {title && (
            <h2 className="text-balance font-display text-[24px] font-bold uppercase leading-snug tracking-[0.05em] text-vn-ivory md:text-[length:clamp(34px,2.5vw,48px)]">
              {title}
            </h2>
          )}
          {intro && (
            <p className="mx-auto mt-4 max-w-3xl text-balance font-body text-[14.5px] leading-relaxed text-vn-ivory/70 md:text-[length:clamp(16px,1.05vw,19px)]">
              {intro}
            </p>
          )}
          <div className="gold-line mx-auto mb-10 mt-6 w-28" />
        </Reveal>

        {/* tường ảnh */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6" style={{ gridAutoFlow: 'dense' }}>
          {photos.map((p, i) => (
            <Reveal key={i} className={p.tall ? 'row-span-2' : ''}>
              <figure className="group h-full">
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  aria-label={`Phóng to: ${p.title}`}
                  className="block w-full cursor-zoom-in border border-vn-gold-antique/25 bg-vn-black/60 p-2 shadow-[0_18px_50px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:-translate-y-1 hover:border-vn-gold-antique/60 md:p-2.5"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.src}
                    alt={p.title}
                    loading="lazy"
                    className={[
                      'w-full',
                      p.contain ? 'object-contain bg-[#0d0a06]' : 'object-cover',
                      p.tall ? 'aspect-[3/4] md:aspect-[3/4.4]' : 'aspect-[4/3]',
                    ].join(' ')}
                  />
                </button>
                <figcaption className="mt-2 px-1">
                  <p className="font-body text-[12.5px] font-semibold leading-snug text-vn-ivory/90 md:text-[length:clamp(13.5px,0.85vw,16px)]">
                    {p.title}
                    {p.year && <span className="ml-2 font-typewriter text-[11px] font-normal text-vn-gold-antique md:text-[12.5px]">{p.year}</span>}
                  </p>
                  {p.source && (
                    <p className="mt-0.5 font-typewriter text-[10px] leading-snug text-vn-ivory/40 md:text-[11px]">{p.source}</p>
                  )}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>

      {/* LIGHTBOX */}
      {open !== null && photos[open] && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-[rgba(10,8,4,0.94)] p-4 backdrop-blur-sm md:p-10"
          onClick={close}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photos[open].src}
            alt={photos[open].title}
            className="max-h-[78vh] max-w-full border border-vn-gold-antique/40 object-contain shadow-[0_40px_120px_rgba(0,0,0,0.8)]"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="mt-4 max-w-3xl text-center" onClick={(e) => e.stopPropagation()}>
            <p className="font-body text-[15px] font-semibold text-vn-ivory md:text-[18px]">
              {photos[open].title}
              {photos[open].year && <span className="ml-2 font-typewriter text-[13px] font-normal text-vn-gold-antique">{photos[open].year}</span>}
            </p>
            {photos[open].source && (
              <p className="mt-1 font-typewriter text-[11px] text-vn-ivory/50 md:text-[12.5px]">{photos[open].source}</p>
            )}
          </div>
          <div className="mt-4 flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setOpen(Math.max(0, open - 1))}
              disabled={open === 0}
              className="border border-vn-ivory/30 px-4 py-2 font-body text-[12px] uppercase tracking-[0.18em] text-vn-ivory/80 transition-colors hover:border-vn-gold disabled:opacity-30"
            >
              ← Trước
            </button>
            <button
              type="button"
              onClick={close}
              className="border border-vn-gold px-5 py-2 font-body text-[12px] uppercase tracking-[0.18em] text-vn-gold transition-colors hover:bg-vn-gold hover:text-vn-black"
            >
              Đóng ✕
            </button>
            <button
              type="button"
              onClick={() => setOpen(Math.min(photos.length - 1, open + 1))}
              disabled={open === photos.length - 1}
              className="border border-vn-ivory/30 px-4 py-2 font-body text-[12px] uppercase tracking-[0.18em] text-vn-ivory/80 transition-colors hover:border-vn-gold disabled:opacity-30"
            >
              Sau →
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
