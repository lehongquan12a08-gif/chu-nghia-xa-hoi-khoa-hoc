'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { NARRATION, type NarrationCue } from '@/data/narration';
import { narrationState } from '@/lib/narrationState';
import { initUiSound, resumeUiSound } from '@/lib/uiSound';
import { getDeclVideo } from '@/lib/declVideo';
import { onLenis } from '@/lib/lenisStore';
import type Lenis from 'lenis';

// Voice level qua Web Audio gain (Master slider vẫn scale thêm bên trên).
// Đã GIẢM tiếp theo yêu cầu: giọng đọc êm, không lấn át.
const NARR_BOOST = 1.15;
// makeup gain after the compressor — lifts the overall voice level
const VOICE_MAKEUP = 1.0;
// Tuyên ngôn Độc lập — now a VIDEO (Bác reads) living in the 1945 chapter.
// It fires when the Ba Đình scene enters DECL_RANGE (after the 1945 narration
// has finished), plays with its own audio, and the auto-scroll holds on it.
const DECL_RANGE: [number, number] = [0.42, 0.98]; // scene scroll fraction that triggers it
const DECL_VIDEO_VOL = 0.09; // video audio level (× master)
// the section fraction band the video scrubs — the Ba Đình act, held on screen
// while Bác reads (kept just inside DECL_RANGE)
const DECL_SCROLL: [number, number] = [0.44, 0.92];
// how much the supporting sounds (music + waves/wind/crowd) drop while a voice
// (narration or the Tuyên ngôn recording) is speaking
const AMBIENT_DUCK = 0.12; // có LỒNG TIẾNG → nhạc né sâu (rất bé dưới giọng đọc)
const SFX_DUCK = 0.1; // supporting sounds drop hard under a voice (so it's clear)
// how long a narration segment takes to fade out at its end (soft tail instead
// of a hard cut). NGẮN — vì các điểm cắt giữa file nằm trong khoảng lặng giữa
// hai câu: fade dài sẽ TRÀN sang câu sau (nghe sót chữ của câu bị bỏ).
const NARR_FADE_MS = 350;

// Background music (loops) + per-chapter ambience. Some clips are `loop:false`
// one-shots (e.g. the real Tuyên ngôn recording) that fire inside a scroll
// `range` (fraction of the section) so they hit exactly at the right moment.
// Drop files per public/audio/README.md; missing files stay silent (no errors).
// Bump when a generated audio file changes so browsers fetch the new version
// instead of a cached copy of the same filename.
const V = 'v=5';
// NHẠC NỀN dịu (pad ngũ cung tự soạn, loop 96s không khục) — file đã bake NHỎ
// (peak ≈ -18 dBFS) nên an toàn cả trên iOS (nơi element.volume bị bỏ qua).
const AMBIENT_SRC = `/audio/nhac-nen.wav?v=1`;
const AMBIENT_VOL = 0.65; // mức nền hành trình (đã tăng thêm theo yêu cầu)
// CUNG MỞ ĐẦU: nhạc nổi lên rõ lúc bắt đầu, rồi tự hạ về nền — đúng lúc phần
// lồng tiếng sẽ vào (khi có giọng đọc, cơ chế duck còn hạ sâu hơn nữa).
const INTRO_PEAK = 2.3; // × mức nền trong lúc mở màn
const INTRO_HOLD_MS = 5200; // giữ mức nổi bật
const INTRO_FALL_MS = 3200; // rồi hạ dần về nền

// `voice: true` = a spoken clip (kept loud, ducks everything else).
type Sfx = { id: string; src: string; vol: number; loop?: boolean; range?: [number, number]; voice?: boolean };
// (chưa dùng tiếng phụ họa theo chương cho dự án Kháng chiến — thêm sau nếu cần)
const SFX: Sfx[] = [];
void V; // giữ cache-bust helper cho các file wav khi thêm SFX

const LS_KEY = 'httcb-audio';
const LS_VOL = 'httcb-vol';
const clamp = (x: number) => Math.max(0, Math.min(1, x));

const fades = new Map<HTMLAudioElement, number>();
function fadeTo(el: HTMLAudioElement, target: number, ms = 900) {
  const prev = fades.get(el);
  if (prev) cancelAnimationFrame(prev);
  if (target > 0 && el.paused) {
    el.muted = false; // in case the mobile-unlock left it muted
    el.play().catch(() => {});
  }
  const from = el.volume;
  const start = performance.now();
  const tick = (t: number) => {
    const p = Math.min(1, (t - start) / ms);
    el.volume = clamp(from + (target - from) * p);
    if (p < 1) fades.set(el, requestAnimationFrame(tick));
    else {
      fades.delete(el);
      if (target <= 0) el.pause();
    }
  };
  fades.set(el, requestAnimationFrame(tick));
}

export default function AudioController() {
  const [enabled, setEnabled] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [vol, setVol] = useState(0.8);
  const [tune, setTune] = useState<string | null>(null); // #tune debug readout

  const ambientRef = useRef<HTMLAudioElement | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null); // iOS-safe ambient volume
  const ambientVolRef = useRef(AMBIENT_VOL); // lower on mobile
  const declVideoVolRef = useRef(DECL_VIDEO_VOL); // device-specific video level
  const sfxRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const enabledRef = useRef(false);
  const masterRef = useRef(0.8);
  const duckRef = useRef(false);
  const ambTargetRef = useRef(-1);

  // narration — MỘT element duy nhất, đổi `src` theo chương (1 file/chương).
  // Một element = một MediaElementSource → không đụng giới hạn nguồn của iOS.
  const narrAudioRef = useRef<HTMLAudioElement | null>(null);
  const narrActiveRef = useRef<string | null>(null);
  const narrStartRef = useRef(0);
  const narrEndRef = useRef(0);
  const narrElRef = useRef<HTMLAudioElement | null>(null);
  const narrCtxRef = useRef<AudioContext | null>(null);
  const narrMakeupRef = useRef<GainNode | null>(null); // output gain of the voice bus
  const narrVoiceGainRef = useRef<GainNode | null>(null); // gain đầu vào (boost × vol từng đoạn)
  const narrBaseBoostRef = useRef(NARR_BOOST); // boost gốc theo thiết bị
  const isTouchRef = useRef(false); // điện thoại → giọng chạy chế độ audio-guide
  const playedRef = useRef<Set<string>>(new Set()); // mobile: chương đã đọc (không lặp)
  const voiceMakeupRef = useRef(VOICE_MAKEUP); // makeup target (lower on mobile)
  const narrWatchRef = useRef<number | null>(null);
  const declFiredRef = useRef(false); // Tuyên ngôn one-shot: fire once per visit
  const narrFadingRef = useRef(false); // narration is fading out its tail
  // enabling the speaker only ARMS audio; nothing plays until the first scroll
  // / auto-scroll, so tapping the speaker doesn't blast sound on the spot.
  const startedRef = useRef(false);
  const startedAtRef = useRef(0); // mốc bắt đầu — chạy cung nhạc mở đầu to→bé

  // create audio elements once
  useEffect(() => {
    const amb = new Audio(AMBIENT_SRC);
    amb.loop = true;
    amb.volume = 0;
    amb.preload = 'auto';
    ambientRef.current = amb;

    // Supporting SFX (ship/waves, mountain wind, crowd) are atmosphere only. On
    // phones they keep unbalancing against the (quieter, less reliable) mobile
    // narration — "tiếng sông" too loud. Skip them entirely on touch: keep just
    // the narration + ambient music + the Tuyên ngôn video.
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    ambientVolRef.current = isTouch ? 0.36 : AMBIENT_VOL; // quieter music on phones (Android)
    // the video FILE is now baked to 15% (iOS-safe, no Web Audio). element.volume
    // still trims it further where it works (desktop/Android); iOS plays the
    // baked 15% directly.
    declVideoVolRef.current = isTouch ? 0.6 : 1.5;
    const m = new Map<string, HTMLAudioElement>();
    if (!isTouch) {
      for (const s of SFX) {
        const a = new Audio(s.src);
        a.loop = s.loop !== false;
        a.volume = 0;
        a.preload = 'none';
        m.set(s.src, a);
      }
    }
    sfxRef.current = m;

    // narration element — tạo MỘT lần; src đổi theo chương khi cuộn tới.
    // ĐIỆN THOẠI (touch): giọng chạy chế độ AUDIO-GUIDE — phát khi cuộn tới
    // chương, KHÔNG khóa cuộn (slide mobile không ghim nên khóa sẽ bò rất chậm),
    // mỗi chương chỉ đọc MỘT lần (không lặp khi lướt qua lại ranh giới), và
    // đọc nốt câu kể cả khi người xem cuộn tiếp. Desktop giữ nguyên khóa cuộn.
    isTouchRef.current = isTouch;
    let voiceEl: HTMLAudioElement | null = null;
    if (NARRATION.length > 0) {
      voiceEl = new Audio(NARRATION[0].src); // nạp sẵn chương đầu
      voiceEl.preload = 'auto';
      voiceEl.volume = 0;
      narrAudioRef.current = voiceEl;
    }

    // route narration through a Web Audio gain so the quiet voice can be lifted
    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AC) {
        // Phone speakers/DACs clip the heavily-boosted+compressed voice, which
        // sounds like "rè" (distortion). Use a much gentler lift on touch.
        const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
        const narrBoost = isTouch ? 0.9 : NARR_BOOST;
        const makeupGain = isTouch ? 1.0 : VOICE_MAKEUP;
        voiceMakeupRef.current = makeupGain;
        const ctx = new AC();
        narrCtxRef.current = ctx;
        // compressor tames peaks so the boost doesn't distort, then a makeup
        // gain lifts the overall level
        const comp = ctx.createDynamicsCompressor();
        const makeup = ctx.createGain();
        makeup.gain.value = makeupGain;
        comp.connect(makeup);
        makeup.connect(ctx.destination);
        narrMakeupRef.current = makeup;
        if (voiceEl) {
          const src = ctx.createMediaElementSource(voiceEl);
          const g = ctx.createGain();
          g.gain.value = narrBoost;
          src.connect(g);
          g.connect(comp);
          narrVoiceGainRef.current = g;
          narrBaseBoostRef.current = narrBoost;
        }
        // NOTE: do NOT route the ambient here — adding another Web Audio source
        // pushed iOS over its media-source limit (narration silenced + tab crash).
        // Instead the ambient WAV is baked quieter (see AMBIENT_SRC) so it's low
        // even on iOS (where element.volume is ignored).
      }
    } catch {
      /* Web Audio unavailable → narration plays at element volume */
    }

    let v = 0.8;
    try {
      const sv = localStorage.getItem(LS_VOL);
      if (sv != null) v = clamp(parseFloat(sv));
    } catch {
      /* ignore */
    }
    masterRef.current = v;
    narrationState.volume = v;
    setVol(v);

    return () => {
      amb.pause();
      m.forEach((a) => a.pause());
      voiceEl?.pause();
    };
  }, []);

  // stop the active narration exactly at its segment end (frame-accurate)
  const stopNarrWatch = useCallback(() => {
    if (narrWatchRef.current != null) {
      cancelAnimationFrame(narrWatchRef.current);
      narrWatchRef.current = null;
    }
  }, []);
  const narrWatch = useCallback(() => {
    const a = narrElRef.current;
    if (!a) {
      stopNarrWatch();
      return;
    }
    // hết file (mặc định) hoặc chạm mốc end tuỳ chọn → chốt progress = 1
    if (a.ended || a.currentTime >= narrEndRef.current) {
      stopNarrWatch();
      narrationState.progress = 1;
      narrationState.playing = false; // scroll moves on; the tail fades out
      if (!a.ended) {
        narrFadingRef.current = true;
        fadeTo(a, 0, NARR_FADE_MS); // soft tail instead of a hard cut
      }
      return;
    }
    if (a.paused) {
      stopNarrWatch();
      return;
    }
    // publish the audio clock so the auto-scroll can lock the scroll to the voice
    // (end mặc định = độ dài file, chỉ biết sau khi metadata nạp xong)
    const end = isFinite(narrEndRef.current)
      ? narrEndRef.current
      : isFinite(a.duration)
        ? a.duration
        : 0;
    const dur = end - narrStartRef.current;
    narrationState.progress = dur > 0 ? clamp((a.currentTime - narrStartRef.current) / dur) : 0;
    // MOBILE: không công bố playing → auto-lướt không khóa cuộn theo giọng
    narrationState.playing = !isTouchRef.current;
    narrationState.speaking = true;
    narrWatchRef.current = requestAnimationFrame(narrWatch);
  }, [stopNarrWatch]);

  // set the ambient-music level. Prefer the Web Audio gain (works on iOS, where
  // element.volume is ignored); fall back to element.volume otherwise.
  const setAmbient = useCallback((target: number, ms: number) => {
    const amb = ambientRef.current;
    if (!amb) return;
    const g = ambientGainRef.current;
    const ctx = narrCtxRef.current;
    if (g && ctx) {
      if (target > 0 && amb.paused) {
        amb.muted = false;
        amb.volume = 1;
        amb.play().catch(() => {});
      }
      const now = ctx.currentTime;
      g.gain.cancelScheduledValues(now);
      g.gain.setValueAtTime(Math.max(0.0001, g.gain.value), now);
      g.gain.linearRampToValueAtTime(Math.max(0.0001, target), now + ms / 1000);
      if (target <= 0.0001) {
        window.setTimeout(() => {
          if (ambientGainRef.current && ambientGainRef.current.gain.value <= 0.002) amb.pause();
        }, ms + 60);
      }
    } else {
      fadeTo(amb, target, ms);
    }
  }, []);

  // update which ambience plays, honouring scroll `range` + master volume + duck
  const apply = useCallback(() => {
    if (!enabledRef.current || !startedRef.current) return;
    const master = masterRef.current;
    const mid = window.innerHeight / 2;

    // 1) narration — play the current chapter's voiceover segment ----------
    let narrCue: NarrationCue | null = null;
    for (const c of NARRATION) {
      const el = document.getElementById(c.id);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (r.top <= mid && r.bottom >= mid) {
        narrCue = c;
        break;
      }
    }
    const touchVoice = isTouchRef.current;
    // MOBILE: về lại ĐẦU TRANG → reset danh sách "đã đọc" (xem lại từ đầu)
    if (touchVoice && playedRef.current.size > 0 && window.scrollY < window.innerHeight * 0.5) {
      playedRef.current.clear();
    }
    if (narrCue) {
      if (narrCue.id !== narrActiveRef.current) {
        const a = narrAudioRef.current;
        // MOBILE: chương đã đọc rồi → KHÔNG đọc lại khi lướt qua lại ranh giới
        if (touchVoice && playedRef.current.has(narrCue.id)) {
          narrActiveRef.current = narrCue.id;
        } else if (a) {
          // sang CHƯƠNG KHÁC → lệnh dừng cũ (nếu có) hết hiệu lực
          narrationState.userPaused = false;
          narrActiveRef.current = narrCue.id;
          playedRef.current.add(narrCue.id);
          narrStartRef.current = narrCue.start ?? 0;
          narrEndRef.current = narrCue.end ?? Number.POSITIVE_INFINITY;
          // đổi sang file của chương này (nếu khác chương trước)
          if (!a.src.endsWith(narrCue.src)) {
            a.src = narrCue.src;
            try {
              a.load();
            } catch {
              /* ignore */
            }
          }
          try {
            a.currentTime = narrStartRef.current;
          } catch {
            /* ignore — sẽ phát từ đầu file */
          }
          // cancel any in-flight fade-out and restore full level for the new cue
          narrFadingRef.current = false;
          const pf = fades.get(a);
          if (pf) {
            cancelAnimationFrame(pf);
            fades.delete(a);
          }
          a.muted = false; // in case the mobile-unlock left it muted
          // CÂN BẰNG từng đoạn: nhân hệ số vol của cue vào gain (chạy cả trên
          // iOS); không có Web Audio thì nhân vào element.volume
          const cueVol = narrCue.vol ?? 1;
          if (narrVoiceGainRef.current) {
            narrVoiceGainRef.current.gain.value = narrBaseBoostRef.current * cueVol;
            a.volume = clamp(master);
          } else {
            a.volume = clamp(master * cueVol);
          }
          narrCtxRef.current?.resume().catch(() => {});
          a.play().catch(() => {});
          narrElRef.current = a;
          // MOBILE: KHÔNG công bố activeId/playing — auto-lướt không khóa cuộn
          // theo giọng (slide mobile không ghim); giọng chạy như audio-guide
          if (!touchVoice) {
            narrationState.activeId = narrCue.id;
            narrationState.playing = true;
            narrationState.scroll0 = narrCue.scroll ? narrCue.scroll[0] : 0;
            narrationState.scroll1 = narrCue.scroll ? narrCue.scroll[1] : 1;
          }
          narrationState.progress = 0;
          stopNarrWatch();
          narrWatchRef.current = requestAnimationFrame(narrWatch);
        }
      } else {
        // CÙNG chương — xử lý DỪNG / ĐỌC TIẾP:
        // - userPaused (ấn dừng tự lướt / cuộn tay chen ngang) → tạm dừng giọng
        //   NGAY, giữ nguyên vị trí câu (CHỈ desktop — mobile chạm là chuyện thường)
        // - hết lệnh dừng (ấn phát lại) hoặc quay lại tab → đọc TIẾP từ chỗ dừng
        const a = narrElRef.current;
        if (a) {
          if (!touchVoice && narrationState.userPaused) {
            if (!a.paused) {
              a.pause();
              stopNarrWatch();
              narrationState.playing = false;
              narrationState.speaking = false;
            }
          } else if (a.paused && !a.ended && narrationState.progress < 1 && !narrFadingRef.current) {
            narrCtxRef.current?.resume().catch(() => {});
            a.play().catch(() => {});
            stopNarrWatch();
            narrWatchRef.current = requestAnimationFrame(narrWatch);
          }
        }
      }
    } else if (narrActiveRef.current) {
      if (touchVoice) {
        // MOBILE: rời chương → giọng ĐỌC NỐT câu chuyện (không cắt ngang);
        // chỉ bỏ đánh dấu để chương kế tiếp bắt được lượt của nó
        narrActiveRef.current = null;
      } else {
        narrAudioRef.current?.pause();
        narrActiveRef.current = null;
        narrElRef.current = null;
        narrationState.activeId = null;
        narrationState.playing = false;
        stopNarrWatch();
      }
    }

    // 2) which supporting SFX are active? ----------------------------------
    const activeMap = new Map<string, boolean>();
    for (const s of SFX) {
      const el = document.getElementById(s.id);
      let active = false;
      if (el) {
        const r = el.getBoundingClientRect();
        active = r.top <= mid && r.bottom >= mid;
      }
      activeMap.set(s.src, active);
    }

    // 2b) Tuyên ngôn VIDEO — Bác reads on the Ba Đình scene ----------------
    const declVideo = getDeclVideo();
    let declActive = false;
    {
      const el = document.getElementById('chapter-1945');
      let inRange = false;
      if (el) {
        const scrollable = el.offsetHeight - window.innerHeight;
        const scrolled = -el.getBoundingClientRect().top;
        const p = scrollable > 0 ? scrolled / scrollable : 0;
        inRange = p >= DECL_RANGE[0] && p <= DECL_RANGE[1];
      }
      if (declVideo) {
        if (inRange && !declFiredRef.current) {
          // fire once on entering the scene (don't restart while still in range)
          declFiredRef.current = true;
          try {
            declVideo.currentTime = 0;
          } catch {
            /* ignore */
          }
          declVideo.muted = false;
          // NOTE: no Web Audio for the video — routing a <video> through Web
          // Audio crashes iOS. Use element.volume (works on Android/desktop; iOS
          // ignores it, so the video plays at its recorded level on iPhone).
          declVideo.volume = clamp(master * declVideoVolRef.current);
          declVideo.play().catch(() => {});
        } else if (!inRange && declFiredRef.current) {
          declFiredRef.current = false;
          declVideo.pause();
        }
        // only treat it as "the voice" while it is ACTUALLY playing — if the
        // browser blocks autoplay-with-sound the video stays paused, and we must
        // NOT duck / pause the narration (that would leave the scene silent)
        declActive = inRange && declFiredRef.current && !declVideo.paused && !declVideo.ended;
      }
    }

    // don't stack two voices: the video takes over from the narration
    if (declActive && narrElRef.current && !narrElRef.current.paused) {
      narrElRef.current.pause();
      stopNarrWatch();
    }
    const narrAudible = narrElRef.current ? !narrElRef.current.paused : false;
    if (narrFadingRef.current && !narrAudible) narrFadingRef.current = false;
    // a fading tail is still audible (ducks other sounds) but no longer drives
    // the scroll — the auto-scroll glides on while the last word trails off
    const narrDriving = narrAudible && !narrFadingRef.current;
    const voice = declActive || narrAudible;
    narrationState.speaking = voice; // any audible voice
    if (declActive && declVideo) {
      // the video drives the scrub: hold on the Ba Đình scene (DECL_SCROLL) and
      // glide across it as Bác reads
      const d = isFinite(declVideo.duration) ? declVideo.duration : 0;
      narrationState.activeId = 'chapter-1945';
      narrationState.scroll0 = DECL_SCROLL[0];
      narrationState.scroll1 = DECL_SCROLL[1];
      narrationState.progress = d > 0 ? clamp(declVideo.currentTime / d) : 0;
      narrationState.playing = !declVideo.paused && !declVideo.ended;
    } else {
      narrationState.playing = narrDriving; // only a live (non-fading) narration
    }

    // 3) set SFX volumes — supporting ambience ducks under a voice ---------
    for (const s of SFX) {
      const a = sfxRef.current.get(s.src);
      if (!a) continue;
      if (activeMap.get(s.src)) {
        fadeTo(a, s.vol * master * (voice ? SFX_DUCK : 1), 700);
      } else {
        fadeTo(a, 0, 900);
      }
    }

    // 4) background music --------------------------------------------------
    duckRef.current = voice;
    // cung MỞ ĐẦU: nổi lên (INTRO_PEAK) rồi hạ dần về nền; có giọng đọc → duck
    let intro = 1;
    if (!voice && startedAtRef.current) {
      const dt = performance.now() - startedAtRef.current;
      if (dt < INTRO_HOLD_MS) intro = INTRO_PEAK;
      else if (dt < INTRO_HOLD_MS + INTRO_FALL_MS)
        intro = 1 + (INTRO_PEAK - 1) * (1 - (dt - INTRO_HOLD_MS) / INTRO_FALL_MS);
    }
    const ambTarget = clamp(ambientVolRef.current * master * (voice ? AMBIENT_DUCK : intro));
    if (ambientRef.current && Math.abs(ambTarget - ambTargetRef.current) > 0.001) {
      ambTargetRef.current = ambTarget;
      setAmbient(ambTarget, 700);
    }
  }, [narrWatch, stopNarrWatch, setAmbient]);

  const enable = useCallback(() => {
    enabledRef.current = true;
    setEnabled(true);
    setShowPrompt(false);
    try {
      localStorage.setItem(LS_KEY, 'on');
    } catch {
      /* ignore */
    }
    narrCtxRef.current?.resume().catch(() => {});
    narrationState.enabled = true;
    narrationState.volume = masterRef.current;
    initUiSound();
    // MOBILE UNLOCK: this runs inside the tap gesture. Play+pause every media
    // element (muted) so the browser marks each as user-initiated and lets us
    // play it programmatically later. Without this, mobile silently blocks the
    // 2nd narration file (part-2) since it was never played within a gesture —
    // which drops all narration from "30 NĂM"/1930 onward.
    // narration runs through Web Audio, where element.muted does NOT silence it,
    // so zero the whole voice bus for the duration of the unlock (restore after).
    const makeup = narrMakeupRef.current;
    if (makeup) makeup.gain.value = 0;
    const unlock = (el: HTMLMediaElement) => {
      try {
        el.muted = true;
        const p = el.play();
        if (p && typeof p.then === 'function') {
          p.then(() => {
            el.pause();
            el.muted = false;
          }).catch(() => {
            el.muted = false;
          });
        } else {
          el.pause();
          el.muted = false;
        }
      } catch {
        /* ignore */
      }
    };
    if (ambientRef.current) unlock(ambientRef.current);
    if (narrAudioRef.current) unlock(narrAudioRef.current);
    sfxRef.current.forEach(unlock);
    const dv = getDeclVideo();
    if (dv) unlock(dv);
    window.setTimeout(() => {
      if (narrMakeupRef.current) narrMakeupRef.current.gain.value = voiceMakeupRef.current;
    }, 400);
    ambTargetRef.current = -1; // force ambient re-fade
    apply();
  }, [apply]);

  const disable = useCallback(() => {
    enabledRef.current = false;
    setEnabled(false);
    try {
      localStorage.setItem(LS_KEY, 'off');
    } catch {
      /* ignore */
    }
    setAmbient(0, 600);
    sfxRef.current.forEach((a) => fadeTo(a, 0, 600));
    narrAudioRef.current?.pause();
    narrActiveRef.current = null;
    narrElRef.current = null;
    declFiredRef.current = false;
    startedRef.current = false; // re-arm: next enable won't auto-play either
    startedAtRef.current = 0; // bật lại sẽ chạy lại cung nhạc mở đầu
    getDeclVideo()?.pause();
    stopNarrWatch();
    narrationState.speaking = false;
    narrationState.playing = false;
    narrationState.activeId = null;
    narrationState.progress = 0;
    narrationState.enabled = false;
  }, [stopNarrWatch, setAmbient]);

  // volume slider — apply instantly to whatever is playing
  const onVolume = useCallback((v: number) => {
    masterRef.current = v;
    narrationState.volume = v;
    setVol(v);
    try {
      localStorage.setItem(LS_VOL, String(v));
    } catch {
      /* ignore */
    }
    if (!enabledRef.current) return;
    const d = duckRef.current;
    const amb = ambientRef.current;
    if (amb && !amb.paused) {
      const t = clamp(ambientVolRef.current * v * (d ? AMBIENT_DUCK : 1));
      if (ambientGainRef.current) ambientGainRef.current.gain.value = t;
      else amb.volume = t;
      ambTargetRef.current = t;
    }
    for (const s of SFX) {
      const a = sfxRef.current.get(s.src);
      if (a && !a.paused) {
        a.volume = clamp(s.voice ? s.vol * v : s.vol * v * (d ? SFX_DUCK : 1));
      }
    }
    if (narrElRef.current && !narrElRef.current.paused) {
      narrElRef.current.volume = clamp(v); // Web Audio gain applies the boost
    }
    const dv = getDeclVideo();
    if (dv && !dv.paused) dv.volume = clamp(v * declVideoVolRef.current);
  }, []);

  // restore on/off preference (needs a user gesture to actually start audio)
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(LS_KEY);
    } catch {
      /* ignore */
    }
    // MẶC ĐỊNH BẬT: lần đầu vào (chưa lưu lựa chọn) coi như 'on' — cú cuộn /
    // chạm đầu tiên sẽ khởi động âm thanh (trình duyệt yêu cầu 1 thao tác thật
    // mới cho phát tiếng). Chỉ khi người dùng đã TẮT loa thì mới giữ im lặng.
    if (saved !== 'off') {
      // THỬ PHÁT NGAY khi vào trang: Chrome cho phép autoplay-có-tiếng với site
      // người dùng hay tương tác (Media Engagement) — thành công thì nhạc nổi
      // luôn không cần cuộn; bị chặn thì rơi về cơ chế chờ thao tác đầu tiên.
      {
        const amb = ambientRef.current;
        if (amb) {
          amb.muted = false;
          amb.volume = 0.001;
          const p = amb.play();
          if (p && typeof p.then === 'function') {
            p.then(() => {
              amb.pause();
              enable();
              startedRef.current = true;
              startedAtRef.current = performance.now();
            }).catch(() => {
              /* autoplay bị chặn — chờ cú cuộn/chạm đầu tiên bên dưới */
            });
          }
        }
      }
      const resume = () => {
        enable();
        window.removeEventListener('pointerdown', resume);
        window.removeEventListener('wheel', resume);
        window.removeEventListener('keydown', onKey);
      };
      // Only genuine content interaction should start audio — NOT browser/system
      // keys like F11 (fullscreen), Escape, Tab or bare modifiers.
      const onKey = (e: KeyboardEvent) => {
        if (
          /^F\d+$/.test(e.key) ||
          e.key === 'Escape' ||
          e.key === 'Tab' ||
          ['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)
        ) {
          return;
        }
        resume();
      };
      window.addEventListener('pointerdown', resume, { once: true });
      window.addEventListener('wheel', resume, { once: true, passive: true });
      window.addEventListener('keydown', onKey);
      return () => {
        window.removeEventListener('pointerdown', resume);
        window.removeEventListener('wheel', resume);
        window.removeEventListener('keydown', onKey);
      };
    }
  }, [enable]);

  // scroll → re-evaluate
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      // the first scroll (manual or auto-scroll) is what actually starts sound
      if (enabledRef.current && !startedRef.current) {
        startedRef.current = true;
        startedAtRef.current = performance.now(); // mở cung nhạc mở đầu
      }
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        apply();
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    // Lenis (desktop) doesn't fire native scroll during smooth / auto-scroll, so
    // its scroll event only ARMS playback here — apply() still runs on the 200ms
    // tick, NOT every frame (running the heavy apply() at 60fps made auto-scroll
    // janky).
    const onLenisScroll = () => {
      if (enabledRef.current && !startedRef.current) {
        startedRef.current = true;
        startedAtRef.current = performance.now(); // mở cung nhạc mở đầu
      }
    };
    let bound: Lenis | null = null;
    const off = onLenis((l) => {
      if (bound) bound.off('scroll', onLenisScroll);
      bound = l;
      if (l) l.on('scroll', onLenisScroll);
    });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (bound) bound.off('scroll', onLenisScroll);
      off();
    };
  }, [apply]);

  // also re-evaluate on a low-frequency tick: while the auto-scroll HOLDS for a
  // voice (no scrolling), scroll events stop firing — this keeps the audio state
  // (e.g. detecting when a voice clip has finished) fresh so it never deadlocks.
  useEffect(() => {
    const id = window.setInterval(() => {
      if (enabledRef.current) apply();
    }, 200);
    return () => window.clearInterval(id);
  }, [apply]);

  // #tune — a small readout of the active chapter + narration second, so cue
  // timings can be read off precisely. Only shows when the URL hash has 'tune'.
  useEffect(() => {
    if (typeof window === 'undefined' || !/tune/.test(window.location.hash)) return;
    const id = window.setInterval(() => {
      const el = narrElRef.current;
      const t = el ? el.currentTime : 0;
      const decl = getDeclVideo();
      const dline = decl && !decl.paused ? ` · video ${decl.currentTime.toFixed(1)}s` : '';
      setTune(
        `${narrActiveRef.current ?? '—'} · ${t.toFixed(1)}s · p${narrationState.progress.toFixed(2)}${dline}`
      );
    }, 100);
    return () => window.clearInterval(id);
  }, []);

  // Keep the Web Audio contexts awake. Mobile OSes suspend them aggressively
  // (a stray touch, app-switch, audio interruption), which silences the boosted
  // narration even though the elements still "play". Re-wake on every interaction
  // and on a slow tick so sound never stays dead.
  useEffect(() => {
    const wake = () => {
      if (!enabledRef.current) return;
      const ctx = narrCtxRef.current;
      if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
      resumeUiSound();
    };
    window.addEventListener('pointerdown', wake);
    window.addEventListener('touchstart', wake, { passive: true });
    window.addEventListener('touchend', wake, { passive: true });
    document.addEventListener('visibilitychange', wake);
    const id = window.setInterval(wake, 1000);
    return () => {
      window.removeEventListener('pointerdown', wake);
      window.removeEventListener('touchstart', wake);
      window.removeEventListener('touchend', wake);
      document.removeEventListener('visibilitychange', wake);
      window.clearInterval(id);
    };
  }, []);

  // pause when the tab is hidden
  useEffect(() => {
    const onVis = () => {
      if (!enabledRef.current) return;
      if (document.hidden) {
        ambientRef.current?.pause();
        sfxRef.current.forEach((a) => a.pause());
        // giọng đọc: DỪNG tại chỗ, GIỮ vị trí câu — quay lại tab sẽ đọc TIẾP
        // (không đọc lại từ đầu đoạn); apply() tự phát tiếp qua nhánh cùng-chương
        narrAudioRef.current?.pause();
        getDeclVideo()?.pause();
        narrationState.speaking = false;
        narrationState.playing = false;
        stopNarrWatch();
      } else {
        ambientRef.current?.play().catch(() => {});
        apply();
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [apply, stopNarrWatch]);

  return (
    <>
      {tune && (
        <div className="pointer-events-none fixed bottom-2 left-1/2 z-[120] -translate-x-1/2 rounded bg-black/85 px-3 py-1 font-mono text-[11px] tracking-wide text-vn-gold">
          {tune}
        </div>
      )}

      <div className="group fixed bottom-7 right-6 z-[95] flex items-center gap-2 md:bottom-9 md:right-9">
        {/* volume panel — slides in when the pointer is on the speaker area
            (or on keyboard focus); − / slider / + */}
        {enabled && (
          <div className="pointer-events-none flex translate-x-2 items-center gap-1.5 rounded-full border border-vn-gold-antique/30 bg-[rgba(8,8,8,0.6)] px-2 py-1 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-x-0 group-hover:opacity-100 focus-within:pointer-events-auto focus-within:translate-x-0 focus-within:opacity-100">
            <button
              type="button"
              onClick={() => onVolume(Math.max(0, Math.round((vol - 0.1) * 100) / 100))}
              aria-label="Giảm âm lượng"
              className="flex h-6 w-6 items-center justify-center rounded-full text-lg leading-none text-vn-gold transition-colors hover:bg-vn-gold/15"
            >
              −
            </button>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(vol * 100)}
              onChange={(e) => onVolume(Number(e.target.value) / 100)}
              aria-label="Âm lượng"
              className="vol-slider w-20"
            />
            <button
              type="button"
              onClick={() => onVolume(Math.min(1, Math.round((vol + 0.1) * 100) / 100))}
              aria-label="Tăng âm lượng"
              className="flex h-6 w-6 items-center justify-center rounded-full text-lg leading-none text-vn-gold transition-colors hover:bg-vn-gold/15"
            >
              +
            </button>
          </div>
        )}

        {/* speaker toggle */}
        <button
          type="button"
          onClick={() => (enabled ? disable() : enable())}
          aria-label={enabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          aria-pressed={enabled}
          className="group relative flex h-[46px] w-[46px] items-center justify-center rounded-full border border-vn-gold-antique/40 bg-[rgba(8,8,8,0.5)] backdrop-blur-sm transition-colors duration-300 hover:border-vn-gold"
        >
          <span className="relative flex h-4 w-4 items-center justify-center text-vn-gold">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" stroke="none" />
              {enabled ? (
                <>
                  <path d="M16 8.5a5 5 0 0 1 0 7" />
                  <path d="M18.5 6a8 8 0 0 1 0 12" className="opacity-70" />
                </>
              ) : (
                <path d="M17 9l4 6M21 9l-4 6" />
              )}
            </svg>
          </span>
          {enabled && (
            <span className="pointer-events-none absolute inset-0 animate-ping rounded-full border border-vn-gold/30" style={{ animationDuration: '3s' }} />
          )}
        </button>
      </div>

      {/* first-visit prompt */}
      {showPrompt && !enabled && (
        <div className="fixed bottom-[84px] right-6 z-[96] flex max-w-[260px] flex-col gap-3 border border-white/10 bg-[rgba(8,8,8,0.9)] p-4 backdrop-blur-md md:bottom-[96px] md:right-9">
          <p className="font-body text-[12px] leading-relaxed text-vn-ivory/85">
            Bật âm thanh để trải nghiệm trọn vẹn hành trình.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={enable}
              className="border border-vn-gold-antique/60 px-4 py-2 font-body text-[11px] uppercase tracking-[0.18em] text-vn-ivory transition-colors duration-300 hover:bg-vn-gold-antique hover:text-vn-black"
            >
              Bật
            </button>
            <button
              type="button"
              onClick={() => {
                setShowPrompt(false);
                try {
                  localStorage.setItem(LS_KEY, 'off');
                } catch {
                  /* ignore */
                }
              }}
              className="px-3 py-2 font-body text-[11px] uppercase tracking-[0.18em] text-vn-ivory/50 transition-colors duration-300 hover:text-vn-ivory"
            >
              Bỏ qua
            </button>
          </div>
        </div>
      )}
    </>
  );
}
