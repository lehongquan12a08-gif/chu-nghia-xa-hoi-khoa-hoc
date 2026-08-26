'use client';

import { useState } from 'react';
import Reveal from '@/components/Reveal';
import { getLenis } from '@/lib/lenisStore';

export interface QuestionOption {
  key: string; // 'A' | 'B' | ...
  text: string;
  correct?: boolean;
}

interface InteractiveQuestionProps {
  id?: string;
  question: string;
  /** Không có options = CÂU HỎI MỞ: hiện chữ TO giữa màn hình, không nút,
   *  không đáp án — dành cho người thuyết trình dẫn dắt. */
  options?: QuestionOption[];
  /** Lời giải hiện sau khi chọn (chỉ dùng cho trắc nghiệm). */
  answer?: string;
  /** Sau khi trả lời, hiện nút cuộn tới section này (vd '#kc-54-toanthang'). */
  continueTo?: string;
  continueLabel?: string;
}

/**
 * Câu hỏi giữa hành trình. Trắc nghiệm: chọn đáp án — ĐÚNG xanh lá, SAI đỏ,
 * kèm lời giải. Câu hỏi mở: phóng to câu hỏi thành một màn suy ngẫm.
 */
export default function InteractiveQuestion({
  id,
  question,
  options,
  answer,
  continueTo,
  continueLabel = 'Tiếp tục hành trình',
}: InteractiveQuestionProps) {
  const [chosen, setChosen] = useState<string | null>(null);
  const answered = chosen !== null;

  const goOn = () => {
    if (!continueTo) return;
    const el = document.querySelector(continueTo) as HTMLElement | null;
    if (!el) return;
    // "click chuyển màn hình" (đúng kịch bản): nhảy thẳng tới GIỮA section đích
    const y = el.offsetTop + Math.max(0, (el.offsetHeight - window.innerHeight) * 0.55);
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo(0, y);
  };

  // ── CÂU HỎI MỞ: chữ to giữa màn hình, không nút/đáp án ──────────────────
  if (!options) {
    return (
      <section
        id={id}
        data-dwell="4"
        className="relative flex min-h-screen items-center justify-center px-6 py-[14vh]"
        style={{ background: 'radial-gradient(ellipse at 50% 40%, #16100c 0%, #080808 70%)' }}
      >
        <Reveal className="mx-auto max-w-5xl text-center">
          <span className="mb-8 block font-display text-6xl font-bold leading-none text-vn-gold/70 md:text-7xl">
            ?
          </span>
          <h3
            className="text-balance font-display font-bold leading-snug text-vn-ivory"
            style={{ fontSize: 'clamp(27px, 3.6vw, 64px)' }}
          >
            {question}
          </h3>
        </Reveal>
      </section>
    );
  }

  // ── TRẮC NGHIỆM ─────────────────────────────────────────────────────────
  return (
    <section
      id={id}
      data-dwell="4"
      className="relative flex min-h-screen items-center justify-center px-6 py-[14vh]"
      style={{ background: 'radial-gradient(ellipse at 50% 40%, #16100c 0%, #080808 70%)' }}
    >
      <Reveal className="w-full max-w-3xl border border-vn-gold-antique/25 bg-[rgba(8,8,8,0.55)] p-8 backdrop-blur-[2px] md:max-w-[62rem] md:p-14">
        <h3 className="text-balance font-display text-2xl font-bold leading-snug text-vn-ivory md:text-[length:clamp(28px,2vw,38px)]">
          {question}
        </h3>

        <div className="mt-8 flex flex-col gap-3.5 md:mt-10">
          {options.map((o) => {
            const isChosen = chosen === o.key;
            const showCorrect = answered && o.correct;
            const showWrong = answered && isChosen && !o.correct;
            return (
              <button
                key={o.key}
                type="button"
                disabled={answered}
                onClick={() => setChosen(o.key)}
                className={[
                  'flex items-start gap-4 border px-5 py-4 text-left transition-all duration-300 md:px-6 md:py-5',
                  showCorrect
                    ? 'border-[#3fae66] bg-[#3fae66]/10'
                    : showWrong
                      ? 'border-vn-red/70 bg-vn-red/10'
                      : answered
                        ? 'border-white/10 opacity-40'
                        : 'border-white/20 hover:border-vn-gold-antique/70 hover:bg-white/[0.03]',
                ].join(' ')}
              >
                <span
                  className={[
                    'flex h-7 w-7 shrink-0 items-center justify-center border font-body text-[13px] font-semibold md:h-9 md:w-9 md:text-[15px]',
                    showCorrect ? 'border-[#3fae66] text-[#6fd693]' : showWrong ? 'border-vn-red text-vn-red' : 'border-white/30 text-vn-ivory/70',
                  ].join(' ')}
                >
                  {o.key}
                </span>
                <span
                  className={[
                    'font-body text-sm leading-relaxed md:pt-0.5 md:text-[length:clamp(17px,1.15vw,22px)]',
                    showCorrect ? 'text-[#8fe3ae]' : showWrong ? 'text-vn-red/90' : 'text-vn-ivory/85',
                  ].join(' ')}
                >
                  {o.text}
                </span>
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="mt-8 border-l-2 border-vn-gold pl-5 md:mt-10 md:pl-6">
            {answer && (
              <p className="text-pretty font-body text-base leading-relaxed text-vn-ivory/85 md:text-[length:clamp(18px,1.15vw,22px)]">
                {answer}
              </p>
            )}
            {continueTo && (
              <button
                type="button"
                onClick={goOn}
                className="mt-6 border border-vn-gold px-7 py-3.5 font-body text-[12px] uppercase tracking-[0.22em] text-vn-gold transition-colors duration-300 hover:bg-vn-gold hover:text-vn-black md:px-8 md:py-4 md:text-[13.5px]"
              >
                {continueLabel} →
              </button>
            )}
          </div>
        )}
      </Reveal>
    </section>
  );
}
