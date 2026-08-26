'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { setLenis } from '@/lib/lenisStore';

/**
 * Bootstraps Lenis smooth scrolling and wires it into GSAP's ticker so that
 * ScrollTrigger stays perfectly in sync with the smoothed scroll position.
 *
 * Mount this ONCE, near the root of the app. It is a no-op on the server and
 * respects `prefers-reduced-motion`.
 */
export function useSmoothScroll(): void {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    // Touch devices (phones/tablets): skip Lenis. Its per-frame smoothing on top
    // of the scrubbed ScrollTriggers overloads phones (freezing + audio stutter);
    // native scrolling is stable there and ScrollTrigger works fine on it.
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    if (prefersReduced || isTouch) {
      // Native scroll — no Lenis. Drive ScrollTrigger from the native scroll
      // event so the scrubbed animations still advance.
      const onScroll = () => ScrollTrigger.update();
      window.addEventListener('scroll', onScroll, { passive: true });
      if (process.env.NODE_ENV !== 'production') {
        (window as unknown as Record<string, unknown>).__ST = ScrollTrigger;
      }
      ScrollTrigger.refresh();
      const refresh = () => ScrollTrigger.refresh();
      // Only refresh on a real WIDTH change (orientation) — NOT the height-only
      // resize the mobile URL bar fires on every scroll (that would "repeat" the
      // first section).
      let lastW = window.innerWidth;
      const onResize = () => {
        if (window.innerWidth !== lastW) {
          lastW = window.innerWidth;
          refresh();
        }
      };
      window.addEventListener('load', refresh);
      window.addEventListener('resize', onResize);
      const settle = window.setTimeout(refresh, 600);
      return () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('load', refresh);
        window.removeEventListener('resize', onResize);
        window.clearTimeout(settle);
      };
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    // Drive Lenis from GSAP's rAF loop and keep ScrollTrigger updated.
    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Share the instance so UI controls (auto-scroll) can drive it.
    setLenis(lenis);

    // Dev-only: expose instances so scroll wiring can be verified from the console.
    if (process.env.NODE_ENV !== 'production') {
      (window as unknown as Record<string, unknown>).__lenis = lenis;
      (window as unknown as Record<string, unknown>).__ST = ScrollTrigger;
    }

    // Recalculate after fonts / images settle.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    const settle = window.setTimeout(refresh, 600);

    // NEO VỊ TRÍ THEO SECTION: liên tục ghi nhớ "tâm màn hình đang ở section
    // nào, tiến độ bao nhiêu". Khi F11/resize đổi chiều cao, mọi section (tính
    // theo vh) co giãn khác px cũ — khôi phục theo tỷ lệ trang sẽ lệch, còn neo
    // theo section thì quay về ĐÚNG khoảnh khắc đang xem.
    const anchor: { el: HTMLElement | null; frac: number } = { el: null, frac: 0 };
    let pendingAnchor: { el: HTMLElement; frac: number } | null = null;
    let anchorT = 0;
    const updateAnchor = () => {
      if (pendingAnchor) return; // đang khôi phục sau F11 — không ghi đè neo
      const now = Date.now();
      if (now - anchorT < 150) return;
      anchorT = now;
      const vc = window.scrollY + window.innerHeight / 2;
      const sections = document.querySelectorAll<HTMLElement>('main > *');
      for (const s of sections) {
        const top = s.offsetTop;
        const h = s.offsetHeight;
        if (h > 0 && vc >= top && vc < top + h) {
          anchor.el = s;
          anchor.frac = (vc - top) / h;
          return;
        }
      }
    };
    lenis.on('scroll', updateAnchor);
    updateAnchor();

    // Recalculate when the viewport size changes — notably entering/leaving
    // browser fullscreen (F11). CHỤP neo ngay lúc sự kiện nổ (trước khi bất kỳ
    // cập nhật nào ghi đè), rồi sau khi layout ổn định thì nhảy về đúng
    // section + tiến độ đó.
    let rt = 0;
    const doRefresh = () => {
      if (!pendingAnchor && anchor.el) pendingAnchor = { el: anchor.el, frac: anchor.frac };
      window.clearTimeout(rt);
      rt = window.setTimeout(() => {
        lenis.resize();
        ScrollTrigger.refresh();
        const a = pendingAnchor;
        pendingAnchor = null;
        if (a && document.contains(a.el)) {
          const target = a.el.offsetTop + a.frac * a.el.offsetHeight - window.innerHeight / 2;
          const max = document.documentElement.scrollHeight - window.innerHeight;
          lenis.scrollTo(Math.max(0, Math.min(max, target)), { immediate: true, force: true });
          anchor.el = a.el;
          anchor.frac = a.frac;
          anchorT = Date.now();
        }
      }, 160);
    };
    // Only refresh on a real WIDTH change (orientation / window resize / F11) —
    // NOT the height-only resize the mobile URL bar fires on every scroll, which
    // would reset the pinned sections and make the first one "repeat".
    let lastW = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth === lastW) return;
      lastW = window.innerWidth;
      doRefresh();
    };
    window.addEventListener('resize', onResize);
    document.addEventListener('fullscreenchange', doRefresh);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
      window.removeEventListener('load', refresh);
      window.clearTimeout(settle);
      window.clearTimeout(rt);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('fullscreenchange', doRefresh);
    };
  }, []);
}
