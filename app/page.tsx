import Navbar from '@/components/Navbar';
import TimelineIndicator from '@/components/TimelineIndicator';
import AutoScrollButton from '@/components/AutoScrollButton';
import AudioController from '@/components/AudioController';
import Hero from '@/components/Hero';
import WordCascade from '@/components/WordCascade';
import DateReveal from '@/components/DateReveal';
import MilestoneChapter from '@/components/MilestoneChapter';
import GallerySection from '@/components/GallerySection';
import TimeSlider from '@/components/TimeSlider';
import ProgressBars8 from '@/components/ProgressBars8';
import Footer from '@/components/Footer';
import { MILESTONES } from '@/data/milestones';

/**
 * TỪ TEM PHIẾU ĐẾN MÃ QR — BẢO TÀNG ẢNH thời kỳ quá độ (MLN131 · Chương 3).
 * 4 GIAN trưng bày theo giai đoạn, ẢNH là nhân vật chính: mỗi gian mở bằng ảnh
 * chủ full màn (MilestoneChapter) → tường ảnh bấm phóng to (GallerySection) →
 * bảng thuyết minh ngắn (ClosingText). Lý luận đậm nhất nằm ở Ngã ba lịch sử.
 */
export default function Home() {
  return (
    <>
      <Navbar />
      <TimelineIndicator />
      <AutoScrollButton />
      <AudioController />

      <main>
        {/* ═══ ĐẠI SẢNH ═══ */}
        <Hero />
        <WordCascade
          eyebrow="1975 – 1985"
          words={['THẮNG HAI ĐẾ QUỐC', 'NHƯNG THIẾU GẠO ĂN', 'VÌ SAO?']}
          accentWords={['VÌ SAO?']}
          perWordVh={70}
        />

        {/* ═══ GIAN 1 · ĐÊM TRƯỚC ĐỔI MỚI (1975–1985) ═══ */}
        <div className="era-cu">
        <MilestoneChapter milestone={MILESTONES.gian1} />
        </div>
        <GallerySection
          id="ch-baocap"
          eyebrow="Gian 1 · Hiện vật"
          title="Đời sống thời bao cấp"
          intro="Những hiện vật kể chuyện thay lời: một tấm tem nhỏ từng quyết định bữa cơm của cả một gia đình."
          photos={[
            { src: '/images/csk/baocap-sogao.webp', title: 'Sổ mua lương thực ("sổ gạo") — TP. Hồ Chí Minh', year: 'thời bao cấp', source: 'Ảnh tư liệu sưu tầm', contain: true, tall: true },
            { src: '/images/csk/bao-tem2.webp', title: 'Phiếu đường trẻ em — Hà Nội', year: '1973', source: 'Ảnh tư liệu · báo Dân Trí' },
            { src: '/images/csk/baocap-xephang.webp', title: 'Xếp hàng trước cửa hàng chất đốt số 12', year: 'thời bao cấp', source: 'Ảnh tư liệu sưu tầm', tall: true },
            { src: '/images/csk/pho-xedap.webp', title: 'Phố Hà Nội — thời xe đạp', year: 'thập niên 1980', source: 'Ảnh tư liệu sưu tầm' },
            { src: '/images/csk/phieu-hcm.webp', title: 'Phiếu mua lương thực — TP. Hồ Chí Minh', year: '1987', source: 'Ảnh tư liệu sưu tầm', contain: true, tall: true },
          ]}
        />
        <DateReveal
          id="ch-774"
          parts={['774,7%']}
          heading="LẠM PHÁT NĂM 1986"
          lines={[
            { text: 'Giá cả tăng từng ngày. Đồng lương không theo kịp.' },
            { text: 'Đổi mới trở thành đòi hỏi sống còn.', accent: true },
          ]}
          background="radial-gradient(ellipse at 50% 42%, #2a1c0c 0%, #14100a 70%)"
        />
        {/* ═══ GIAN 2 · KHÚC QUANH (1986) — màu bắt đầu tràn vào ═══ */}
        <MilestoneChapter milestone={MILESTONES.doiMoi} />
        <GallerySection
          id="ch-1986"
          eyebrow="Gian 2 · Hiện vật"
          title="Mười ngày tháng Chạp 1986"
          background="linear-gradient(180deg, #14100a 0%, #16281f 60%, #14100a 100%)"
          photos={[
            { src: '/images/csk/dh6.webp', title: 'Đại hội đại biểu toàn quốc lần thứ VI của Đảng', year: '15–18/12/1986', source: 'Ảnh tư liệu sưu tầm', tall: true },
            { src: '/images/csk/gian2-bao.webp', title: 'Báo Nhân Dân — số Xuân Bính Dần', year: '1986', source: 'Tư liệu báo Nhân Dân', contain: true, tall: true },
            { src: '/images/csk/baocap-sogao.webp', title: 'Tấm sổ gạo — những năm cuối cùng của bao cấp', year: '1986–1989', source: 'Ảnh tư liệu sưu tầm', contain: true, tall: true },
          ]}
        />
        {/* ═══ GIAN 3 · CỬA MỞ (1986–2007) ═══ */}
        <MilestoneChapter milestone={MILESTONES.gian3} />
        <GallerySection
          id="ch-cuamo"
          eyebrow="Gian 3 · Hiện vật"
          title="Từ thiếu gạo đến xuất khẩu gạo"
          background="linear-gradient(180deg, #14100a 0%, #10201d 60%, #14100a 100%)"
          photos={[
            { src: '/images/csk/gian3.webp', title: 'Bí thư Kim Ngọc thăm đồng — "khoán hộ" Vĩnh Phúc, tiền đề của Khoán 10 (1988)', year: 'thập niên 1960', source: 'Ảnh tư liệu sưu tầm', tall: true },
            { src: '/images/csk/gian3-asean.webp', title: 'Việt Nam gia nhập ASEAN', year: '28/07/1995', source: 'Ảnh: TTXVN' },
            { src: '/images/csk/gian3-wto.webp', title: 'Lễ ký hợp tác sau khi gia nhập WTO — Hà Nội', year: '24/01/2007', source: 'Ảnh tư liệu sưu tầm' },
            { src: '/images/csk/wm-rice.webp', title: 'Vựa lúa Đồng bằng sông Cửu Long', year: 'Cần Thơ', source: 'Wikimedia Commons · Dragfyre · CC BY-SA 3.0' },
            { src: '/images/csk/wm-vendor.webp', title: 'Gánh hàng trên phố — kinh tế nhiều thành phần đời thường', year: 'Hà Nội', source: 'Wikimedia Commons · yeowatzup · CC BY 2.0' },
          ]}
        />

        {/* ═══ GIAN 4 · CHƯƠNG ĐANG VIẾT (HÔM NAY) ═══ */}
        <MilestoneChapter milestone={MILESTONES.gian4} />
        <GallerySection
          id="ch-homnay"
          eyebrow="Gian 4 · Hiện vật"
          title="Đất nước của mã QR"
          background="linear-gradient(180deg, #14100a 0%, #10201d 60%, #14100a 100%)"
          photos={[
            { src: '/images/csk/wm-skyline.webp', title: 'Đường chân trời TP. Hồ Chí Minh bên sông Sài Gòn', year: '2020s', source: 'Wikimedia Commons · Pimnl · CC0', tall: true },
            { src: '/images/csk/homnay-2.webp', title: 'Thanh toán bằng mã VietQR', year: 'hôm nay', source: 'Ảnh tư liệu sưu tầm' },
            { src: '/images/csk/wm-metro.webp', title: 'Metro Bến Thành – Suối Tiên qua Thảo Điền', year: '2024', source: 'Wikimedia Commons · HikariTenshi · CC BY 4.0' },
            { src: '/images/csk/wm-jam.webp', title: 'Dòng xe máy — nhịp sống đô thị', year: 'TP.HCM', source: 'Wikimedia Commons · Mike · CC BY 2.0' },
            { src: '/images/csk/wm-thaprua.webp', title: 'Tháp Rùa trước những tòa nhà kính — truyền thống giữa hiện đại', year: '2023', source: 'Wikimedia Commons · Takeshi Aida · CC BY-SA 2.0' },
            { src: '/images/csk/wm-longbien.webp', title: 'Cầu Long Biên (1899–1902) — chứng nhân đi qua mọi thời kỳ', year: 'hôm nay', source: 'Wikimedia Commons · Quangpraha · CC0' },
            { src: '/images/csk/homnay-factory.webp', title: 'Dây chuyền sản xuất trong nhà máy', year: '2020s', source: 'Ảnh tư liệu sưu tầm' },
          ]}
        />
        {/* HIỆN VẬT TƯƠNG TÁC khép gian 4: kéo màn thời gian — Hàng Đào 1954 ↔ hôm nay */}
        <TimeSlider
          id="ch-keoman"
          before="/images/csk/hangdao-xua.webp"
          after="/images/csk/hangdao-nay.webp"
          beforeLabel="10/10/1954"
          afterLabel="HÔM NAY"
        />
        <ProgressBars8 id="ch-2011" />
        <WordCascade
          id="ch-chuongcuoi"
          eyebrow="Thời kỳ quá độ — nghĩa là chưa kết thúc"
          words={['CHƯƠNG CUỐI', 'DO CHÚNG TA VIẾT']}
          accentWords={['DO CHÚNG TA VIẾT']}
          perWordVh={80}
        />

        <Footer />
      </main>
    </>
  );
}
