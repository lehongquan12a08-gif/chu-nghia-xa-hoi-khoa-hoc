'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { playChime } from '@/lib/uiSound';
import EmberField from '@/components/EmberField';

/**
 * HERO — landing page. LƯỚT XUỐNG: từng chữ của tiêu đề hiện ra lần lượt và
 * GIỮ lại trên màn hình (ĐƯỜNG LỐI → KHÁNG CHIẾN → CHỐNG PHÁP → 1946–1954),
 * trên nền ảnh tư liệu mở đầu.
 */
export default function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      });

      tl.to(q('.hero-bgimg'), { scale: 1.08, ease: 'none', duration: 0.9 }, 0)
        .to(q('.hero-scrollhint'), { opacity: 0, duration: 0.04 }, 0.05)
        // từng chữ hiện và Ở LẠI (class hw-* — KHÔNG trùng utility w-* của Tailwind)
        .call(playChime, [0], 0.06)
        .fromTo(q('.hw-0'), { opacity: 0, y: 44 }, { opacity: 1, y: 0, duration: 0.05 }, 0.06)
        .call(playChime, [1], 0.15)
        .fromTo(q('.hw-1'), { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 0.05 }, 0.15)
        .call(playChime, [2], 0.24)
        .fromTo(q('.hw-2'), { opacity: 0, y: 44 }, { opacity: 1, y: 0, duration: 0.05 }, 0.24)
        .call(playChime, [3], 0.33)
        .fromTo(q('.hw-3'), { opacity: 0, y: 44 }, { opacity: 1, y: 0, duration: 0.05 }, 0.33)
        .call(playChime, [4], 0.45)
        .fromTo(q('.hw-years'), { opacity: 0, scale: 1.2 }, { opacity: 1, scale: 1, duration: 0.05 }, 0.45)
        .fromTo(q('.hw-tagline'), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.05 }, 0.55)
        // tấm phiếu hiện vật trượt vào (desktop)
        .fromTo(q('.hero-card'), { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.08 }, 0.12)
        // giữ trọn khung, rồi mờ dần nhường chương mở đầu
        .to(q('.hero-stage'), { opacity: 0, duration: 0.08 }, 0.9)
        .to(q('.hero-bgimg'), { scale: 1.1, ease: 'none', duration: 0.02 }, 0.98);
    },
    { scope: root }
  );

  return (
    <section id="hero" ref={root} className="relative h-[340vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-vn-black">
        <div className="hero-stage absolute inset-0">
          {/* ảnh tư liệu mở đầu — full-bleed */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {/* nền mờ: dải tem đường 1973 chìm phía sau tạo không khí */}
          <img
            src="/images/csk/bao-tem2.webp"
            alt=""
            className="hero-bgimg will-transform pointer-events-none absolute inset-0 h-full w-full object-cover"
            style={{ filter: 'blur(3px) brightness(0.22) sepia(0.3)', objectPosition: 'center 40%' }}
          />
          {/* vignette: dìm nền vào bóng tối phòng trưng bày — sáng nhẹ nơi khối chữ */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 32% 45%, rgba(20,16,10,0) 0%, rgba(20,16,10,0.45) 55%, rgba(20,16,10,0.88) 100%)',
            }}
          />
          {/* HIỆN VẬT TREO TƯỜNG: Phiếu mua lương thực TP.HCM (1987) — khung gỗ,
              lót ngà, đèn rọi tranh, biển nhãn dưới khung; mobile ẩn */}
          <div
            className="hero-card will-transform absolute right-[6vw] top-[46%] hidden md:block"
            style={{ height: 'min(56vh, 28vw)', transform: 'translateY(-50%) rotate(-2.5deg)', opacity: 0 }}
          >
            {/* quầng đèn rọi tranh */}
            <div
              className="pointer-events-none absolute -inset-[22%]"
              style={{
                background:
                  'radial-gradient(closest-side, rgba(233,184,76,0.17) 0%, rgba(233,184,76,0.05) 55%, transparent 78%)',
              }}
            />
            {/* khung gỗ sẫm + lớp lót ngà */}
            <div className="relative h-full border-[9px] border-[#241b10] bg-[#efe4c9] p-[12px] shadow-[0_40px_110px_rgba(0,0,0,0.85)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/csk/phieu-hcm.webp"
                alt="Phiếu mua lương thực — TP. Hồ Chí Minh, 1987"
                className="h-full w-auto"
                style={{ filter: 'contrast(1.04)' }}
              />
            </div>
            {/* biển nhãn bảo tàng dưới khung */}
            <div className="absolute -bottom-[50px] left-1/2 -translate-x-1/2 whitespace-nowrap border border-vn-gold-antique/40 bg-[#1d1710]/90 px-3 py-2 text-center font-typewriter text-[10px] tracking-[0.1em] text-vn-gold-antique">
              PHIẾU MUA LƯƠNG THỰC · TP.HCM · 1987
            </div>
          </div>
          {/* scrim: đậm bên TRÁI cho khối chữ — tấm tem phiếu bên phải luôn thoáng */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, rgba(20,16,10,0.95) 0%, rgba(20,16,10,0.82) 32%, rgba(20,16,10,0.42) 58%, rgba(20,16,10,0.08) 82%, rgba(20,16,10,0) 100%)',
            }}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[24vh] bg-gradient-to-t from-vn-black/80 to-transparent" />

          {/* tàn lửa / bụi vàng bay chậm — chất điện ảnh (chỉ desktop) */}
          <EmberField />

          {/* khối chữ — GÓC TRÁI màn hình (mobile: giữa), nhường tấm tem bên phải */}
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center md:items-start md:pl-[6vw] md:text-left">
            <p className="hw-0 will-transform eyebrow mb-6 whitespace-nowrap text-vn-gold-antique opacity-0">
              MLN131 · Chủ nghĩa xã hội khoa học · Chương 3
            </p>
            <h1 className="flex w-full flex-col items-center leading-none md:items-start">
              <span
                className="hw-1 will-transform font-display font-semibold uppercase tracking-[0.3em] text-vn-ivory/90 opacity-0"
                style={{ fontSize: 'clamp(18px, 2.4vw, 38px)' }}
              >
                Thời kỳ quá độ
              </span>
              <span
                className="hw-2 will-transform font-display font-bold uppercase text-vn-ivory opacity-0"
                style={{ fontSize: 'clamp(40px, 6.4vw, 118px)', lineHeight: 1.04, letterSpacing: '0.01em' }}
              >
                TỪ TEM PHIẾU
              </span>
              <span
                className="hw-3 will-transform font-display font-bold uppercase text-vn-red opacity-0"
                style={{ fontSize: 'clamp(40px, 6.4vw, 118px)', lineHeight: 1.04, letterSpacing: '0.01em', textShadow: '0 0 44px rgba(179,39,30,0.45)' }}
              >
                ĐẾN MÃ QR
              </span>
            </h1>
            <p className="hw-years will-transform mt-7 font-display font-semibold text-xl tracking-[0.4em] text-vn-gold text-glow-gold opacity-0 md:text-[length:clamp(30px,2vw,38px)]">
              1975&nbsp;—&nbsp;HÔM&nbsp;NAY
            </p>
            <p className="hw-tagline will-transform mt-6 max-w-3xl text-balance font-body text-[12px] font-light uppercase leading-relaxed tracking-[0.22em] text-vn-ivory/75 opacity-0 md:text-[length:clamp(14px,1vw,17px)]">
              Thắng hai đế quốc mà vẫn thiếu gạo — vì sao? · Câu trả lời nằm trong hai chữ: quá độ
            </p>
          </div>

          {/* gợi ý cuộn */}
          <div className="hero-scrollhint pointer-events-none absolute bottom-5 left-1/2 z-20 -translate-x-1/2">
            <span className="scroll-hint-line" />
          </div>
        </div>
      </div>
    </section>
  );
}
