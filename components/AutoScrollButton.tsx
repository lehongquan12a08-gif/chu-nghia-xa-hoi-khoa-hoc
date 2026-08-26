'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getLenis } from '@/lib/lenisStore';
import { narrationState } from '@/lib/narrationState';

// Auto-scroll pace. Khi chương có lồng tiếng, cuộn KHÓA theo đồng hồ giọng đọc
// (see step). Các khoảng KHÔNG lời (chữ lướt, câu hỏi, màn ngày…) vẫn đi đúng
// nhịp điện ảnh SPEED — không phóng nhanh, vì đó là các màn cần thời gian đọc.
const SPEED = 235; // px/s — nhịp điện ảnh, đủ chậm để đọc slide
const RING = 2 * Math.PI * 15; // circumference for r=15 progress ring

export default function AutoScrollButton() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [atEnd, setAtEnd] = useState(false);
  const playingRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastTs = useRef(0);
  // "dừng nhịp": các section gắn data-dwell sẽ được giữ lại N giây khi tự lướt
  const dwellElsRef = useRef<Element[]>([]);
  const dwellDoneRef = useRef<Set<Element>>(new Set());
  const dwellUntilRef = useRef(0);

  const maxScroll = () =>
    document.documentElement.scrollHeight - window.innerHeight;

  // the auto-scroll's terminal stop: frame the footer nicely (centred) rather
  // than bottoming out, which would leave the footer's bottom padding as an
  // empty gap below the content.
  const endY = () => {
    const max = maxScroll();
    const footer = document.getElementById('footer');
    if (footer) {
      const c = footer.offsetTop + footer.offsetHeight / 2 - window.innerHeight / 2;
      if (c > 0 && c < max) return c;
    }
    return max;
  };

  const curScroll = () => {
    const lenis = getLenis();
    return lenis
      ? ((lenis as unknown as { scroll: number }).scroll ?? window.scrollY)
      : window.scrollY;
  };

  const stopRaf = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  // --- stop / pause (always reliable: just stop our own loop) -----------
  const pause = useCallback(() => {
    playingRef.current = false;
    setPlaying(false);
    stopRaf();
    // ẤN DỪNG (hoặc cuộn tay chen ngang) → giọng đọc dừng theo ngay,
    // giữ nguyên vị trí câu (AudioController đọc cờ này mỗi nhịp)
    narrationState.userPaused = true;
  }, []);

  const scrollToY = (y: number) => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo(0, y);
  };

  // --- the auto-scroll loop (drives Lenis one frame at a time) ----------
  const step = useCallback(
    (ts: number) => {
      if (!playingRef.current) return;
      const dt = lastTs.current ? Math.min(0.05, (ts - lastTs.current) / 1000) : 0;
      lastTs.current = ts;

      const max = endY();
      const cur = curScroll();

      // 1) VOICE-LOCKED SCRUB — while a chapter's narration plays, tie the scroll
      //    position to the audio clock. `activeId` names the chapter section and
      //    `progress` (0..1) is its audio playhead, so the scroll glides across
      //    the whole section in exactly the voiceover's length; the section is
      //    framed the same way every time and the hand-off to the next chapter is
      //    seamless (the sections are contiguous, so end of one == start of next).
      if (narrationState.enabled && narrationState.playing && narrationState.activeId) {
        const el = document.getElementById(narrationState.activeId);
        if (el) {
          const vh = window.innerHeight;
          const startY = el.offsetTop - vh / 2; // where this section takes centre
          // map the voice's progress across only its assigned fraction band
          const s0 = narrationState.scroll0;
          const s1 = narrationState.scroll1;
          const band = s0 + (s1 - s0) * narrationState.progress;
          const target = Math.min(max, Math.max(0, startY + el.offsetHeight * band));
          const nextY = target > cur ? target : cur; // never snap backwards
          scrollToY(nextY);
          // màn nào đã đi qua DƯỚI giọng đọc thì coi như "đã dừng đủ" — kẻo
          // giọng vừa dứt lại đứng thêm N giây dwell ngay trên cùng màn đó
          {
            const vhNow = window.innerHeight;
            for (const dEl of dwellElsRef.current) {
              if (dwellDoneRef.current.has(dEl)) continue;
              const r = dEl.getBoundingClientRect();
              if (r.top + r.height / 2 <= vhNow / 2 + 4) dwellDoneRef.current.add(dEl);
            }
          }
          if (nextY >= max - 2) {
            pause();
            return;
          }
          rafRef.current = requestAnimationFrame(step);
          return;
        }
      }

      // 1b) DỪNG NHỊP — các màn cần đọc (kết đoạn, câu hỏi) gắn data-dwell:
      //     khi màn đó vào giữa khung hình, GIỮ NGUYÊN vị trí N giây rồi mới đi
      //     tiếp (mỗi màn dừng một lần cho mỗi lượt phát).
      if (dwellUntilRef.current > ts) {
        rafRef.current = requestAnimationFrame(step);
        return;
      }
      if (!narrationState.playing) {
        const vh = window.innerHeight;
        for (const el of dwellElsRef.current) {
          if (dwellDoneRef.current.has(el)) continue;
          const r = el.getBoundingClientRect();
          // chỉ dừng khi TÂM của màn đã trôi tới đúng giữa khung hình (khung
          // hình đẹp) — không phanh sớm lúc màn mới ló vào
          const elCenter = r.top + r.height / 2;
          if (elCenter <= vh / 2 + 4 && r.bottom >= vh * 0.55) {
            dwellDoneRef.current.add(el);
            const secs = parseFloat(el.getAttribute('data-dwell') || '6') || 6;
            dwellUntilRef.current = ts + secs * 1000;
            rafRef.current = requestAnimationFrame(step);
            return;
          }
        }
      }

      // 2) STEADY GLIDE — mọi khoảng không lời đi đúng nhịp điện ảnh SPEED
      const next = cur + SPEED * dt;
      if (next >= max) {
        scrollToY(max);
        pause();
        return;
      }
      scrollToY(next);
      rafRef.current = requestAnimationFrame(step);
    },
    [pause]
  );

  // --- play -------------------------------------------------------------
  const play = useCallback(() => {
    const max = endY();
    const lenis = getLenis();
    // If we're already at the terminal stop, restart from the top.
    if (curScroll() >= max - 4) {
      if (lenis) lenis.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
    }
    playingRef.current = true;
    setPlaying(true);
    lastTs.current = 0;
    narrationState.userPaused = false; // phát lại → giọng đọc tiếp từ chỗ dừng
    // nạp danh sách màn cần dừng nhịp cho lượt phát này
    dwellElsRef.current = Array.from(document.querySelectorAll('[data-dwell]'));
    dwellDoneRef.current = new Set();
    dwellUntilRef.current = 0;
    stopRaf();
    rafRef.current = requestAnimationFrame(step);
  }, [step]);

  const toggle = useCallback(() => {
    if (playingRef.current) pause();
    else play();
  }, [pause, play]);

  // Browsers freeze requestAnimationFrame while the tab is hidden, so the loop
  // stalls when you switch away. Restart it cleanly when the tab comes back.
  useEffect(() => {
    const onVis = () => {
      if (!document.hidden && playingRef.current) {
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        lastTs.current = 0;
        rafRef.current = requestAnimationFrame(step);
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [step]);

  // --- track scroll progress + auto-stop on user interaction ------------
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const max = maxScroll();
        const p = max > 0 ? window.scrollY / max : 0;
        setProgress(p);
        setAtEnd(p >= 0.995);
        ticking = false;
      });
    };

    // Any genuine user input cancels autoplay (our programmatic scroll does
    // NOT emit wheel/touch/key events, so these are always user-initiated).
    const onUserIntent = () => {
      if (playingRef.current) pause();
    };
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(e.key)) {
        onUserIntent();
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('wheel', onUserIntent, { passive: true });
    window.addEventListener('touchstart', onUserIntent, { passive: true });
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('wheel', onUserIntent);
      window.removeEventListener('touchstart', onUserIntent);
      window.removeEventListener('keydown', onKey);
      stopRaf();
    };
  }, [pause]);

  const label = playing ? 'Tạm dừng' : atEnd ? 'Lướt lại' : 'Tự động lướt';

  return (
    <button
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? 'Tạm dừng tự động lướt' : 'Tự động lướt qua hành trình'}
      title={label}
      className="group fixed bottom-7 left-6 z-[95] flex items-center md:bottom-9 md:left-9"
    >
      <span className="relative flex h-[46px] w-[46px] items-center justify-center">
        {/* progress ring */}
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
          <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(244,235,216,0.15)" strokeWidth="1.5" />
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="#FFCD00"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={RING}
            strokeDashoffset={RING * (1 - progress)}
            style={{ transition: 'stroke-dashoffset 0.15s linear' }}
          />
        </svg>

        {/* play / pause glyph */}
        <span className="relative flex h-3.5 w-3.5 items-center justify-center text-vn-gold transition-transform duration-300 group-hover:scale-110">
          {playing ? (
            <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
              <rect x="1.5" y="1" width="3" height="10" fill="currentColor" />
              <rect x="7.5" y="1" width="3" height="10" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 12 12" className="h-3.5 w-3.5 translate-x-[1px]" aria-hidden="true">
              <polygon points="2,1 11,6 2,11" fill="currentColor" />
            </svg>
          )}
        </span>
      </span>
    </button>
  );
}
