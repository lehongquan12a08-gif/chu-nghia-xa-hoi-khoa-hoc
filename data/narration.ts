// LỒNG TIẾNG THEO CHƯƠNG — mỗi hồi MỘT file. Hệ thống giống web Kháng chiến:
// cuộn tới section mang `id` thì phát `src`; tự lướt KHÓA cuộn theo giọng đọc.
//
// ⚠️ CHƯA CÓ FILE — chờ Nguyên thu theo 4 hồi:
//   Hồi 1 "Cơn đói sau ngày thắng"  → public/audio/voice/hoi1.m4a → id 'ch-baocap'
//   Hồi 2 "Tấm bản đồ của Mác"      → public/audio/voice/hoi2.m4a → id 'ch-bando'
//   Hồi 3 "Ngã ba và khúc quanh"    → public/audio/voice/hoi3.m4a → id 'ch-ngaba'
//   Hồi 4 "Chương đang viết"        → public/audio/voice/hoi4.m4a → id 'ch-homnay'
// Thu xong: bỏ comment các dòng dưới, chỉnh dải scroll sau khi nghe thử.
export interface NarrationCue {
  id: string; // id của <section>/<div bọc> mà giọng đọc thuộc về
  src: string; // file audio của hồi
  start?: number; // giây bắt đầu trong file (mặc định 0)
  end?: number; // giây kết thúc (mặc định: hết file)
  scroll?: [number, number]; // dải cuộn con (0..1) của element. Mặc định [0, 1].
  /** Cân bằng âm lượng riêng đoạn (đo RMS rồi đặt — xem quy trình web KC). */
  vol?: number;
}

export const NARRATION: NarrationCue[] = [
  // { id: 'ch-baocap', src: '/audio/voice/hoi1.m4a?v=1', scroll: [0.02, 0.9] },
  // { id: 'ch-bando', src: '/audio/voice/hoi2.m4a?v=1', scroll: [0.02, 0.9] },
  // { id: 'ch-ngaba', src: '/audio/voice/hoi3.m4a?v=1', scroll: [0.05, 0.9] },
  // { id: 'ch-homnay', src: '/audio/voice/hoi4.m4a?v=1', scroll: [0.02, 0.9] },
];
