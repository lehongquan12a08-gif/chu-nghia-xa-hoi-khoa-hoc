'use client';

import { useEffect, useRef } from 'react';

/**
 * Tàn lửa / bụi vàng bay chậm — lớp không khí điện ảnh cho hero.
 * CHỈ chạy trên desktop (con trỏ chuột) và khi không bật reduce-motion;
 * điện thoại bỏ qua hoàn toàn (không tốn pin/GPU). ~26 hạt, canvas nhẹ.
 */
export default function EmberField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || reduced) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w;
      canvas.height = h;
    };
    resize();
    window.addEventListener('resize', resize);

    type P = { x: number; y: number; r: number; vy: number; vx: number; a: number; gold: boolean; ph: number };
    const N = 26;
    const ps: P[] = Array.from({ length: N }, (_, i) => ({
      x: Math.random() * 1,
      y: Math.random() * 1,
      r: 0.8 + Math.random() * 1.6,
      vy: 8 + Math.random() * 14, // px/s, bay LÊN
      vx: (Math.random() - 0.5) * 10,
      a: 0.12 + Math.random() * 0.3,
      gold: i % 3 !== 0, // 2/3 vàng, 1/3 đỏ than
      ph: Math.random() * Math.PI * 2,
    }));

    let raf = 0;
    let last = performance.now();
    const draw = (t: number, dt: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.y -= (p.vy * dt) / h;
        p.x += (p.vx * dt) / w + Math.sin(t / 1400 + p.ph) * 0.00035;
        if (p.y < -0.02) {
          p.y = 1.02;
          p.x = Math.random();
        }
        if (p.x < -0.02) p.x = 1.02;
        if (p.x > 1.02) p.x = -0.02;
        const tw = 0.75 + 0.25 * Math.sin(t / 900 + p.ph); // lập lòe nhẹ
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.gold
          ? `rgba(255, 205, 0, ${(p.a * tw).toFixed(3)})`
          : `rgba(218, 90, 29, ${(p.a * tw).toFixed(3)})`;
        ctx.fill();
      }
    };
    const tick = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      draw(t, dt);
      raf = requestAnimationFrame(tick);
    };
    draw(last, 0); // vẽ ngay frame đầu — hạt hiện tức thì khi tải trang
    raf = requestAnimationFrame(tick);

    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />;
}
