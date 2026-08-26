'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { playChime } from '@/lib/uiSound';
import { bindPairs } from '@/lib/typo';

export interface SlideGroup {
  title?: string; // vd '1947 — Việt Bắc Thu – Đông'
  bullets: string[];
  /** true = dòng nhấn (đỏ, đậm) — như câu highlight trong kịch bản. */
  accent?: boolean;
}

export interface SlideImage {
  src: string;
  caption?: string;
  tag?: string; // 'H1' | 'Ảnh 1' ...
  /** 'contain' cho TÀI LIỆU (lược đồ, sơ đồ, bút tích) — hiện trọn, không cắt.
   *  Mặc định 'cover' (ảnh chụp) theo thiết kế chung. */
  fit?: 'cover' | 'contain';
}

interface SlideSectionProps {
  id?: string;
  eyebrow: string;
  title?: string;
  groups: SlideGroup[];
  /** Ảnh của slide — hiện NGAY TRONG slide (cột phải desktop / dưới mobile). */
  images?: SlideImage[];
  background?: string;
  backgroundImage?: string;
  /** true = ẢNH TO nằm TRÊN (cạnh nhau), ghi chú + gạch đầu dòng ở DƯỚI. */
  imagesTop?: boolean;
}

/** Tiêu đề dạng "1951 — Củng cố lực lượng": chỉ cho phép XUỐNG DÒNG tại dấu "—"
 *  (phần năm giữ nguyên khối, cụm chữ giữ nguyên khối) — không gãy giữa cụm từ. */
function SmartTitle({ text }: { text: string }) {
  const ix = text.indexOf(' — ');
  if (ix === -1) return <>{bindPairs(text)}</>;
  return (
    <>
      <span className="inline-block whitespace-nowrap">{text.slice(0, ix)} —</span>{' '}
      {/* inline-block: cụm không vừa → RƠI NGUYÊN CỤM xuống dòng, không gãy giữa;
          cụm dài quá một dòng → tự cân 2 dòng (balance) tại điểm ngắt đẹp */}
      <span className="inline-block max-w-full [text-wrap:balance]">{bindPairs(text.slice(ix + 3))}</span>
    </>
  );
}

/**
 * "NỘI DUNG HIỆN TRÊN SLIDE" — tiêu đề + gạch đầu dòng hiện lần lượt khi lướt,
 * ẢNH của slide nằm cùng màn hình (gộp một nơi), gắn thẻ H1/H2… và chú thích.
 */
export default function SlideSection({ id, eyebrow, title, groups, images = [], background = '#0b0a09', backgroundImage, imagesTop = false }: SlideSectionProps) {
  const root = useRef<HTMLDivElement>(null);
  const rows = groups.reduce((n, g) => n + (g.title ? 1 : 0) + g.bullets.length, 0) + (title ? 1 : 0);
  const heightVh = 130 + rows * 26 + images.length * 16;
  // BỐ CỤC MÀN ẢNH: 1 ảnh làm NỀN full màn hình, ảnh còn lại đóng KHUNG bên phải.
  // - backgroundImage (ảnh nền đã đặt sẵn) → làm nền, mọi ảnh slide thành khung phải
  // - không có → ảnh CHỤP đầu tiên làm nền (tài liệu/lược đồ 'contain' luôn vào khung)
  const { bgSrc, bgCap, insets } = (() => {
    if (imagesTop) return { bgSrc: null as string | null, bgCap: null as string | null, insets: images };
    if (backgroundImage) return { bgSrc: backgroundImage, bgCap: null, insets: images };
    if (images.length === 0) return { bgSrc: null, bgCap: null, insets: images };
    const bi = Math.max(0, images.findIndex((im) => im.fit !== 'contain'));
    return { bgSrc: images[bi].src, bgCap: images[bi].caption ?? null, insets: images.filter((_, i) => i !== bi) };
  })();

  // ĐIỆN THOẠI: slide KHÔNG ghim (nội dung dài hơn màn hình sẽ bị cắt nếu ghim)
  // — chảy tự nhiên, từng dòng/ảnh hiện khi lướt tới. Desktop giữ kiểu ghim.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const on = () => setIsMobile(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  // MOBILE: reveal bằng IntersectionObserver thuần (không GSAP) — dòng/ảnh
  // hiện dần khi lướt tới, hoạt động với mọi kiểu cuộn.
  useEffect(() => {
    if (!isMobile || !root.current) return;
    const els = [
      ...root.current.querySelectorAll<HTMLElement>('.sl-row, .sl-img, .sl-line'),
    ];
    for (const el of els) {
      el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
      if (el.classList.contains('sl-line')) el.style.transform = 'scaleX(0)';
      else if (el.classList.contains('sl-img')) el.style.transform = 'translateY(26px)';
      else el.style.transform = 'translateX(-20px)';
    }
    const pending = new Set<HTMLElement>(els);
    const reveal = (el: HTMLElement) => {
      if (!pending.has(el)) return;
      pending.delete(el);
      el.style.opacity = '1';
      el.style.transform = el.classList.contains('sl-line') ? 'scaleX(1)' : 'none';
      io.unobserve(el);
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) reveal(e.target as HTMLElement);
      },
      { rootMargin: '0px 0px -8% 0px' }
    );
    els.forEach((el) => io.observe(el));
    // Fallback theo sự kiện cuộn — phòng webview không bắn IO đều
    let lastCheck = 0;
    const onScroll = () => {
      const now = Date.now();
      if (now - lastCheck < 120 || pending.size === 0) return;
      lastCheck = now;
      const vh = window.innerHeight;
      for (const el of [...pending]) {
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.94 && r.bottom > 0) reveal(el);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    // ảnh nền slide 1-ảnh: hiện luôn trên mobile (không chờ hiệu ứng)
    const bg = root.current.querySelector<HTMLElement>('.sl-bgimg');
    if (bg) bg.style.opacity = '1';
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (bg) bg.style.opacity = '';
      for (const el of els) {
        el.style.transition = '';
        el.style.transform = '';
        el.style.opacity = '';
      }
    };
  }, [isMobile]);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      if (isMobile) return; // mobile dùng IntersectionObserver ở trên

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 1 },
      });
      const items = q('.sl-row');
      const span = 0.8;
      const step = span / Math.max(1, items.length);
      items.forEach((el, i) => {
        const at = 0.05 + i * step;
        if ((el as HTMLElement).classList.contains('sl-group')) tl.call(playChime, [i], at);
        tl.fromTo(el, { opacity: 0, x: -26 }, { opacity: 1, x: 0, duration: step * 0.6 }, at);
      });
      // đường kẻ vàng tự vẽ dưới eyebrow — "đóng dấu" mở màn slide
      tl.fromTo(q('.sl-line'), { scaleX: 0 }, { scaleX: 1, ease: 'power2.out', duration: 0.08 }, 0.03);
      // ảnh hiện xen kẽ trong lúc bullets chạy
      const imgs = q('.sl-img');
      imgs.forEach((el, i) => {
        const at = 0.18 + i * (0.5 / Math.max(1, imgs.length));
        tl.fromTo(el, { opacity: 0, y: 30, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.12 }, at);
      });
      // ảnh nền của slide 1-ảnh: hiện dần + Ken Burns rất nhẹ
      tl.fromTo(q('.sl-bgimg'), { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, ease: 'none', duration: 0.3 }, 0.04);
      tl.to(q('.sl-stage'), { opacity: 1, duration: 0.01 }, 0.99); // đệm tới ~1
    },
    { scope: root, dependencies: [isMobile], revertOnUpdate: true }
  );

  return (
    <section
      id={id}
      ref={root}
      className="relative"
      style={{ height: isMobile ? 'auto' : `${heightVh}vh`, background }}
    >
      <div
        className={
          isMobile
            ? 'relative overflow-hidden py-24'
            : 'sticky top-0 flex h-screen items-center overflow-hidden'
        }
      >
        {imagesTop ? (
          /* BỐ CỤC ẢNH-TO-TRÊN: 2 ảnh lớn cạnh nhau, ghi chú + nội dung ở dưới */
          <div className="sl-stage relative z-10 mx-auto w-full max-w-6xl px-6 md:px-10">
            <div className="mb-7 text-center">
              <p className="eyebrow mb-3 text-vn-gold-antique" style={{ fontSize: 'clamp(12px, 0.95vw, 15px)' }}>
                {eyebrow}
              </p>
              <div className="sl-line gold-line mx-auto w-28 origin-center" style={{ transform: 'scaleX(0)' }} />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {images.map((im, i) => (
                <figure key={i} className="sl-img will-transform relative w-full opacity-0">
                  <div className="relative overflow-hidden rounded-[3px] border border-vn-gold-antique/25 bg-vn-black/60 shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={im.src}
                      alt={im.caption ?? ''}
                      className={im.fit === 'contain' ? 'w-full object-contain' : 'w-full object-cover'}
                      style={{ height: '40vh' }}
                    />
                  </div>
                  {im.caption && (
                    <figcaption className="mt-2.5 text-balance text-center font-body text-[13px] leading-snug text-vn-ivory/65 md:text-[length:clamp(13px,0.8vw,15.5px)]">
                      {im.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
            <div className="mx-auto mt-9 w-fit">
              {groups.map((g, gi) => (
                <ul key={gi} className="flex flex-col gap-2.5">
                  {g.bullets.map((b, bi) => (
                    <li key={bi} className="sl-row will-transform flex items-start gap-3 opacity-0">
                      <span className="mt-[9px] h-[7px] w-[7px] shrink-0 rotate-45 bg-vn-gold-antique/80" />
                      <span className="text-pretty font-body text-[17px] leading-relaxed text-vn-ivory/95 md:text-[length:clamp(21px,1.45vw,28px)]">
                        {b}
                      </span>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        ) : (
        <>
        {bgSrc && (
          /* NỀN MÀN ẢNH: 1 ảnh phủ kín màn hình + lớp tối cho chữ nổi */
          <div className="sl-bgimg will-transform absolute inset-0 opacity-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={bgSrc}
              alt=""
              className="h-full w-full object-cover"
              style={{ objectPosition: 'center 25%', filter: 'contrast(1.05) brightness(0.55) sepia(0.12)' }}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'linear-gradient(90deg, rgba(8,8,8,0.93) 0%, rgba(8,8,8,0.74) 36%, rgba(8,8,8,0.34) 64%, rgba(8,8,8,0.12) 100%)',
              }}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[24vh] bg-gradient-to-t from-vn-black/85 to-transparent" />
            {bgCap && (
              <p
                className={[
                  'absolute bottom-5 max-w-[50vw] text-balance font-body text-[12.5px] leading-snug text-vn-ivory/60 md:text-[length:clamp(12.5px,0.75vw,14.5px)]',
                  insets.length > 0 ? 'left-6 text-left md:left-14' : 'right-6 text-right',
                ].join(' ')}
              >
                {bgCap}
              </p>
            )}
          </div>
        )}
        <div
          className={[
            'sl-stage relative z-10 mx-auto grid w-full items-center gap-10 px-6 md:px-12',
            insets.length > 0 ? 'max-w-7xl md:max-w-[86rem] md:grid-cols-[1.18fr_0.82fr]' : 'max-w-4xl',
            bgSrc && insets.length === 0 ? 'md:mx-0 md:px-16' : '',
          ].join(' ')}
        >
          {/* cột chữ — cỡ chữ NỞ theo chiều rộng màn hình (màn to chữ to) */}
          <div>
            <p className="eyebrow mb-4 text-vn-gold-antique" style={{ fontSize: 'clamp(12px, 0.95vw, 15px)' }}>
              {eyebrow}
            </p>
            <div className="sl-line gold-line mb-6 w-28 origin-left" style={{ transform: 'scaleX(0)' }} />
            {title && (
              /* tiêu đề có NGÀY THÁNG → sans đậm: số và chữ đồng cỡ, không vênh */
              <h2 className="sl-row will-transform mb-8 text-pretty font-display text-[26px] font-bold uppercase leading-snug tracking-[0.04em] text-vn-ivory opacity-0 md:text-[length:clamp(40px,3vw,58px)]">
                <SmartTitle text={title} />
              </h2>
            )}
            <div className="flex flex-col gap-6">
              {groups.map((g, gi) => (
                <div key={gi}>
                  {g.title && (
                    <h3 className="sl-row sl-group will-transform mb-3 text-pretty font-display text-[22px] font-semibold uppercase leading-snug tracking-[0.05em] text-vn-gold opacity-0 md:text-[length:clamp(32px,2.6vw,50px)]">
                      <SmartTitle text={g.title} />
                    </h3>
                  )}
                  <ul className="flex flex-col gap-3">
                    {g.bullets.map((b, bi) => (
                      <li key={bi} className="sl-row will-transform flex items-start gap-3.5 opacity-0">
                        <span className={`mt-[14px] h-[8px] w-[8px] shrink-0 rotate-45 ${g.accent ? 'bg-vn-red' : 'bg-vn-gold-antique/80'}`} />
                        <span
                          className={
                            g.accent
                              ? 'text-pretty font-body text-[17px] font-semibold leading-relaxed text-vn-red md:text-[length:clamp(22px,1.5vw,29px)]'
                              : 'text-pretty font-body text-[17px] leading-relaxed text-vn-ivory/95 md:text-[length:clamp(21px,1.45vw,28px)]'
                          }
                        >
                          {b}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* KHUNG GÓC PHẢI — các ảnh còn lại của slide đóng khung nổi trên nền */}
          {insets.length > 0 && (
            <div className="sl-imgcol will-transform flex flex-col items-center justify-center gap-6 md:items-end">
              {insets.map((im, i) => (
                <figure key={i} className="sl-img will-transform relative w-full max-w-md opacity-0 md:max-w-[420px]">
                  <div className="relative overflow-hidden rounded-[3px] border border-vn-gold-antique/30 bg-vn-black/65 shadow-[0_28px_70px_rgba(0,0,0,0.65)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={im.src}
                      alt={im.caption ?? ''}
                      className={im.fit === 'contain' ? 'w-full object-contain' : 'w-full object-cover'}
                      style={{ height: insets.length > 1 ? '27vh' : '44vh' }}
                    />
                  </div>
                  {im.caption && (
                    <figcaption className="mt-2.5 text-balance text-center font-body text-[13px] leading-snug text-vn-ivory/65 md:text-right md:text-[length:clamp(13px,0.8vw,15.5px)]">
                      {im.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
        </div>
        </>
        )}
      </div>
    </section>
  );
}
