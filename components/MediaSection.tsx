'use client';

import { MEDIA, type MediaItem } from '@/data/media';

function MediaCard({ item }: { item: MediaItem }) {
  return (
    <figure className="group relative overflow-hidden border border-white/10 bg-vn-black/40">
      <div className="relative aspect-video overflow-hidden bg-black">
        <video
          src={item.src}
          controls
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-contain"
        />
      </div>
      <figcaption className="p-4">
        <span className="font-body text-[10px] uppercase tracking-[0.22em] text-vn-gold-antique">
          {item.kind}
        </span>
        <p className="mt-1 font-body text-lg font-medium leading-tight text-vn-ivory md:text-xl">{item.title}</p>
        {item.by && <p className="mt-1 font-body text-[11px] text-vn-ivory/50">{item.by}</p>}
      </figcaption>
    </figure>
  );
}

export default function MediaSection() {
  if (!MEDIA.length) return null;
  return (
    <section
      id="media"
      className="relative px-6 py-[16vh]"
      style={{ background: 'linear-gradient(180deg, #080808 0%, #12100e 50%, #080808 100%)' }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <p className="eyebrow mb-6 text-vn-gold-antique">Âm nhạc · Bản thu lịch sử</p>
          <h2
            className="font-display font-bold uppercase text-vn-ivory text-glow-gold"
            style={{ fontSize: 'clamp(44px, 6.5vw, 120px)', lineHeight: 1, letterSpacing: '0.01em' }}
          >
            NGHE &amp; XEM
          </h2>
          <div className="gold-line mx-auto mt-8 w-40" />
          <p className="mx-auto mt-8 max-w-2xl font-body text-lg leading-relaxed text-vn-ivory/70 md:text-xl">
            Những bài ca đi cùng cuộc kháng chiến — bấm để nghe.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {MEDIA.map((m) => (
            <MediaCard key={m.src} item={m} />
          ))}
        </div>

        <p className="mt-10 text-center font-body text-[11px] uppercase tracking-[0.2em] text-vn-ivory/30">
          Bản thu tư liệu do nhóm cung cấp · vui lòng bảo đảm quyền sử dụng khi công bố chính thức
        </p>
      </div>
    </section>
  );
}
