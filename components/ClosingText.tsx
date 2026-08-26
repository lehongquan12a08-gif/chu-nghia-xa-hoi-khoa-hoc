'use client';

import Reveal from '@/components/Reveal';

interface ClosingTextProps {
  id?: string;
  eyebrow?: string;
  paragraphs: string[]; // câu cuối được tô vàng nhấn mạnh
  background?: string;
  /** Ảnh nền mờ phía sau (vd đoạn mở đầu phần Ý nghĩa). */
  bgImage?: string;
}

/** "PHẦN CUỐI" — các câu kết của một giai đoạn, hiện dần, câu chốt tô vàng.
 *  data-dwell: tự động lướt DỪNG lại ~7s ở màn này cho người xem kịp đọc. */
export default function ClosingText({ id, eyebrow, paragraphs, background, bgImage }: ClosingTextProps) {
  return (
    <section
      id={id}
      data-dwell="4"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-[16vh]"
      style={{ background: background ?? 'radial-gradient(ellipse at 50% 45%, #150d0a 0%, #080808 72%)' }}
    >
      {bgImage && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bgImage}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-55"
            style={{ objectPosition: 'center 30%', filter: 'contrast(1.06) brightness(0.72) sepia(0.1)' }}
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,8,8,0.42),rgba(8,8,8,0.85)_82%)]" />
        </>
      )}
      <div className="relative z-10 mx-auto max-w-6xl text-center">
        {eyebrow && (
          <Reveal as="p" className="eyebrow mb-10 text-vn-gold-antique">
            {eyebrow}
          </Reveal>
        )}
        <div className="flex flex-col gap-8">
          {paragraphs.map((p, i) => {
            const last = i === paragraphs.length - 1;
            return (
              <Reveal
                key={i}
                as="p"
                className={
                  last
                    ? 'text-balance font-display text-[28px] font-bold leading-snug text-vn-gold text-glow-gold md:text-[length:clamp(46px,3.3vw,63px)]'
                    : 'text-balance font-body text-[19px] leading-relaxed text-vn-ivory/90 md:text-[length:clamp(27px,1.95vw,37px)]'
                }
              >
                {p}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
