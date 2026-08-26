import Navbar from '@/components/Navbar';
import TimelineIndicator from '@/components/TimelineIndicator';
import AutoScrollButton from '@/components/AutoScrollButton';
import AudioController from '@/components/AudioController';
import Hero from '@/components/Hero';
import WordCascade from '@/components/WordCascade';
import DateReveal from '@/components/DateReveal';
import ClosingText from '@/components/ClosingText';
import MilestoneChapter from '@/components/MilestoneChapter';
import GallerySection from '@/components/GallerySection';
import NgaBa from '@/components/NgaBa';
import TimeSlider from '@/components/TimeSlider';
import ProgressBars8 from '@/components/ProgressBars8';
import GiaiTrinhAI from '@/components/GiaiTrinhAI';
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
            { src: '/images/csk/baocap-sogao.svg', title: 'Sổ mua lương thực ("sổ gạo")', year: '1976–1986', source: 'Ô chờ ảnh tư liệu — Bảo tàng Hà Nội / TTXVN', contain: true },
            { src: '/images/csk/bao-tem2.svg', title: 'Tem phiếu — gạo, thịt, vải', year: '1978', source: 'Ô chờ ảnh tư liệu — scan hiện vật' },
            { src: '/images/csk/baocap-xephang.svg', title: 'Xếp hàng trước cửa hàng mậu dịch quốc doanh', year: '~1980', source: 'Ô chờ ảnh tư liệu — TTXVN', tall: true },
            { src: '/images/csk/pho-xedap.svg', title: 'Phố Hà Nội — thời xe đạp', year: 'thập niên 1980', source: 'Ô chờ ảnh tư liệu' },
            { src: '/images/csk/hero-tem.svg', title: 'Phiếu mua lương thực (đồ họa phục dựng)', year: '1985', source: 'Đồ họa vector do nhóm phục dựng' },
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
        <ClosingText
          eyebrow="Bảng thuyết minh · Gian 1"
          paragraphs={[
            'Chủ nghĩa xã hội là giai đoạn ĐẦU của hình thái kinh tế – xã hội cộng sản chủ nghĩa; thời kỳ quá độ mang đặc điểm "cái cũ và cái mới đan xen" — kinh tế nhiều thành phần, xã hội nhiều giai tầng. (Giáo trình CNXHKH 2021, Chương 3)',
            'Khủng hoảng không phủ nhận con đường — nó đòi hỏi đổi mới cách đi trên con đường ấy.',
          ]}
        />

        {/* HIỆN VẬT LÝ LUẬN: hai con đường năm 1975 + luận điểm Hồ Chí Minh */}
        <NgaBa id="ch-ngaba" />

        {/* ═══ GIAN 2 · KHÚC QUANH (1986) — màu bắt đầu tràn vào ═══ */}
        <MilestoneChapter milestone={MILESTONES.doiMoi} />
        <GallerySection
          id="ch-1986"
          eyebrow="Gian 2 · Hiện vật"
          title="Mười ngày tháng Chạp 1986"
          background="linear-gradient(180deg, #14100a 0%, #16281f 60%, #14100a 100%)"
          photos={[
            { src: '/images/csk/dh6.svg', title: 'Phiên khai mạc Đại hội VI', year: '15/12/1986', source: 'Ô chờ ảnh tư liệu — TTXVN', tall: true },
            { src: '/images/csk/gian2-bao.svg', title: 'Trang báo đưa tin đường lối Đổi mới', year: '12/1986', source: 'Ô chờ ảnh — thư viện báo Nhân Dân' },
            { src: '/images/csk/baocap-sogao.svg', title: 'Tấm sổ gạo — những năm cuối cùng', year: '1986–1989', source: 'Ô chờ ảnh tư liệu', contain: true },
          ]}
        />
        <ClosingText
          eyebrow="Bảng thuyết minh · Gian 2"
          paragraphs={[
            'Quá độ BỎ QUA chế độ tư bản chủ nghĩa là bỏ qua việc xác lập vị trí thống trị của quan hệ sản xuất và kiến trúc thượng tầng TBCN — nhưng tiếp thu, kế thừa thành tựu nhân loại, đặc biệt về khoa học và công nghệ. (Văn kiện Đại hội IX)',
            'Bỏ qua — không phải đốt cháy giai đoạn.',
          ]}
        />

        {/* HIỆN VẬT TƯƠNG TÁC: kéo màn thời gian */}
        <TimeSlider id="ch-keoman" />

        {/* ═══ GIAN 3 · CỬA MỞ (1986–2007) ═══ */}
        <MilestoneChapter milestone={MILESTONES.gian3} />
        <GallerySection
          id="ch-cuamo"
          eyebrow="Gian 3 · Hiện vật"
          title="Từ thiếu gạo đến xuất khẩu gạo"
          background="linear-gradient(180deg, #14100a 0%, #10201d 60%, #14100a 100%)"
          photos={[
            { src: '/images/csk/gian3.svg', title: 'Nông dân được mùa sau Khoán 10', year: '1988–1989', source: 'Ô chờ ảnh tư liệu — TTXVN', tall: true },
            { src: '/images/csk/gian3-asean.svg', title: 'Việt Nam gia nhập ASEAN', year: '28/07/1995', source: 'Ô chờ ảnh tư liệu — TTXVN' },
            { src: '/images/csk/gian3-wto.svg', title: 'Gia nhập Tổ chức Thương mại Thế giới (WTO)', year: '11/01/2007', source: 'Ô chờ ảnh tư liệu — TTXVN' },
            { src: '/images/csk/wm-rice.webp', title: 'Vựa lúa Đồng bằng sông Cửu Long (ảnh minh họa)', year: 'Cần Thơ', source: 'Wikimedia Commons · Dragfyre · CC BY-SA 3.0' },
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
            { src: '/images/csk/homnay-2.svg', title: 'Quét mã QR ở quán vỉa hè', year: 'hôm nay', source: 'Ô chờ ảnh — nhóm tự chụp' },
            { src: '/images/csk/wm-metro.webp', title: 'Metro Bến Thành – Suối Tiên qua Thảo Điền', year: '2024', source: 'Wikimedia Commons · HikariTenshi · CC BY 4.0' },
            { src: '/images/csk/homnay-factory.svg', title: 'Dây chuyền nhà máy công nghệ', year: '2020s', source: 'Ô chờ ảnh — CC' },
            { src: '/images/csk/pho-nay.svg', title: 'Cùng góc phố ấy — hôm nay (đồ họa)', year: 'hôm nay', source: 'Đồ họa vector do nhóm phục dựng' },
          ]}
        />
        <ClosingText
          eyebrow="Bảng thuyết minh · Gian 4"
          paragraphs={[
            'GDP từ khoảng 14 tỷ USD (1985) lên khoảng 430 tỷ USD (2023); tỷ lệ nghèo từ 58% (1993) xuống dưới 3%; kim ngạch xuất nhập khẩu vượt 730 tỷ USD (2022). Nguồn: Tổng cục Thống kê · World Bank.',
            'Kinh tế thị trường định hướng xã hội chủ nghĩa — sự vận dụng sáng tạo lý luận quá độ vào Việt Nam.',
          ]}
        />
        <ProgressBars8 id="ch-2011" />
        <WordCascade
          id="ch-chuongcuoi"
          eyebrow="Thời kỳ quá độ — nghĩa là chưa kết thúc"
          words={['CHƯƠNG CUỐI', 'DO CHÚNG TA VIẾT']}
          accentWords={['DO CHÚNG TA VIẾT']}
          perWordVh={80}
        />

        {/* Giải trình AI (bắt buộc của assignment) + Ending */}
        <GiaiTrinhAI id="giai-trinh-ai" />
        <Footer />
      </main>
    </>
  );
}
