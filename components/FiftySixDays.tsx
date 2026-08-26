'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { playChime } from '@/lib/uiSound';

// 5 ảnh tư liệu "công tác chuẩn bị chiến đấu" — thay nhau làm nền
const PHOTOS = [
  { src: '/images/kc/d56-1.webp', caption: 'Bộ đội kéo pháo vào trận địa' },
  { src: '/images/kc/d56-2.webp', caption: 'Công tác giao thông vận tải' },
  { src: '/images/kc/d56-3.webp', caption: 'Người dân vận chuyển lương thực ra mặt trận' },
  { src: '/images/kc/d56-4.webp', caption: 'Thanh niên xung phong mở đường' },
  { src: '/images/kc/d56-5.webp', caption: 'Đội quân xe thồ lên Điện Biên Phủ' },
];

// nội dung slide theo kịch bản — hiện dần trong lúc bộ đếm chạy
const BULLETS = [
  'Bộ đội, dân công, thanh niên xung phong vượt núi, băng rừng.',
  'Vận chuyển lương thực, vũ khí, đạn dược ra mặt trận.',
  'Ba đợt tiến công từng bước phá vỡ tập đoàn cứ điểm.',
];

// ba đợt tiến công (mốc đã kiểm chứng) — sáng lên khi bộ đếm đi qua
const PHASES = [
  { day: 1, label: 'Đợt 1 · 13/03/1954' },
  { day: 18, label: 'Đợt 2 · 30/03/1954' },
  { day: 50, label: 'Đợt 3 · 01/05/1954' },
];

/**
 * 56 NGÀY ĐÊM — bộ đếm NGÀY 01 → 56 chạy theo đà cuộn, ảnh tư liệu thay nhau
 * làm nền, các ý của slide hiện dần, mốc 3 đợt tiến công sáng theo ngày.
 */
export default function FiftySixDays({ id }: { id?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 1 },
      });

      // bộ đếm ngày 1 → 56
      const proxy = { d: 1 };
      tl.to(
        proxy,
        {
          d: 56,
          ease: 'none',
          duration: 0.88,
          onUpdate: () => {
            if (counterRef.current) counterRef.current.textContent = String(Math.round(proxy.d)).padStart(2, '0');
          },
        },
        0.06
      );

      // ảnh nền thay nhau (crossfade)
      const slot = 0.88 / PHOTOS.length;
      PHOTOS.forEach((_, i) => {
        const at = 0.06 + i * slot;
        tl.fromTo(q(`.p56-${i}`), { opacity: 0 }, { opacity: 1, duration: slot * 0.35 }, at);
        if (i < PHOTOS.length - 1) tl.to(q(`.p56-${i}`), { opacity: 0, duration: slot * 0.3 }, at + slot * 0.75);
      });

      // 3 ý của slide — hiện dần và Ở LẠI
      BULLETS.forEach((_, i) => {
        const at = 0.12 + i * 0.24;
        tl.fromTo(q(`.b56-${i}`), { opacity: 0, x: -22 }, { opacity: 1, x: 0, duration: 0.08 }, at);
      });

      // mốc 3 đợt tiến công sáng theo ngày
      PHASES.forEach((p, i) => {
        const at = 0.06 + ((p.day - 1) / 55) * 0.88;
        tl.call(playChime, [i], at);
        tl.to(q(`.ph56-${i}`), { opacity: 1, duration: 0.05 }, at);
      });

      // chốt: nhãn "56 NGÀY ĐÊM" rực lên ở cuối
      tl.fromTo(q('.d56-final'), { opacity: 0, scale: 1.15 }, { opacity: 1, scale: 1, duration: 0.04 }, 0.89);
      tl.to(q('.d56-stage'), { opacity: 1, duration: 0.01 }, 0.995);
    },
    { scope: root }
  );

  return (
    <section id={id} ref={root} className="relative h-[620vh] bg-vn-black">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="d56-stage relative h-full">
          {/* nền: ảnh tư liệu thay nhau */}
          {PHOTOS.map((p, i) => (
            <div key={i} className={`p56-${i} will-transform absolute inset-0 opacity-0`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt=""
                className="h-full w-full object-cover"
                style={{ objectPosition: 'center 30%', filter: 'contrast(1.05) brightness(0.5) sepia(0.15)' }}
              />
              <p className="absolute bottom-6 right-6 max-w-[60vw] text-balance text-right font-body text-sm text-vn-ivory/70 md:text-base">
                {p.caption}
              </p>
            </div>
          ))}

          {/* scrim trái để chữ + bộ đếm nổi */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, rgba(8,8,8,0.92) 0%, rgba(8,8,8,0.72) 34%, rgba(8,8,8,0.3) 62%, rgba(8,8,8,0.05) 100%)',
            }}
          />

          {/* nội dung */}
          {/* pb chừa ĐAI ĐÁY cho nút tự lướt/loa — nhãn "56 NGÀY ĐÊM" không bị đè */}
          <div className="relative z-10 flex h-full flex-col justify-center px-6 pb-16 md:px-16 md:pb-20">
            <p className="eyebrow mb-4 text-vn-gold-antique">
              Điện Biên Phủ · 13/03 → 07/05/1954
            </p>

            {/* bộ đếm ngày */}
            <div className="flex items-end gap-4">
              <div>
                <p className="font-body text-[12px] uppercase tracking-[0.3em] text-vn-ivory/65 md:text-[14px]">Ngày đêm thứ</p>
                <span
                  ref={counterRef}
                  className="block font-display font-bold leading-none text-vn-gold text-glow-gold"
                  style={{ fontSize: 'clamp(104px, 19vw, 248px)', letterSpacing: '-0.02em' }}
                >
                  01
                </span>
              </div>
              <span className="mb-3 font-display text-3xl font-bold text-vn-ivory/40 md:mb-5 md:text-5xl">/ 56</span>
            </div>

            {/* 3 đợt tiến công */}
            <div className="mt-5 flex flex-wrap gap-x-7 gap-y-2">
              {PHASES.map((p, i) => (
                <span
                  key={i}
                  className={`ph56-${i} font-body text-[12px] uppercase tracking-[0.2em] text-vn-gold opacity-20 md:text-[14px]`}
                >
                  ◆ {p.label}
                </span>
              ))}
            </div>

            {/* các ý của slide */}
            <ul className="mt-8 flex max-w-2xl flex-col gap-3">
              {BULLETS.map((b, i) => (
                <li key={i} className={`b56-${i} will-transform flex items-start gap-3 opacity-0`}>
                  <span className="mt-[8px] h-[7px] w-[7px] shrink-0 rotate-45 bg-vn-gold-antique/80" />
                  <span className="text-pretty font-body text-[15px] leading-relaxed text-vn-ivory/95 md:text-[length:clamp(19px,1.25vw,24px)]">{b}</span>
                </li>
              ))}
            </ul>

            {/* nhãn chốt */}
            <div className="d56-final will-transform mt-8 opacity-0">
              <p className="font-body text-[15px] font-medium text-vn-gold-antique md:text-[length:clamp(17px,1.1vw,21px)]">
                Hàng chục vạn người cùng hướng về Điện Biên Phủ
              </p>
              <p
                className="mt-2 font-display text-3xl font-bold uppercase tracking-[0.08em] text-vn-red md:text-5xl"
                style={{ textShadow: '0 0 40px rgba(218,37,29,0.45)' }}
              >
                56 ngày đêm
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
