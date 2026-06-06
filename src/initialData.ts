/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Product,
  Blog,
  Banner,
  CompanyContact,
  PromotionPopup,
  QuoteRequest,
  WebSEOConfig,
  WordingConfig,
  PromotionCampaign
} from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Bình Gas Petrolimex 12kg (Van Ngang)',
    category: 'binh-gas',
    slug: 'binh-gas-petrolimex-12kg-van-ngang',
    image: 'https://images.unsplash.com/photo-1624641537211-1335cbaf4fb6?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1624641537211-1335cbaf4fb6?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'Bình gas Petrolimex chính hãng có màu xanh hòa bình, trọng lượng ruột đủ 12kg, lửa xanh tiết kiệm gas, vỏ bình được kiểm định áp lực an toàn nghiêm ngặt.',
    originalPrice: 480000,
    salePrice: 425000,
    isHot: true,
    isSale: true,
    isNew: false,
    specs: {
      'Trọng lượng ruột': '12kg ± 200g',
      'Trọng lượng vỏ': '13kg - 14.5kg (ghi trên tay xách)',
      'Màu sắc': 'Xanh hòa bình (Xanh dương)',
      'Tiêu chuẩn chế tạo': 'DOT-4BA-240 / TCVN 6292',
      'Áp suất thử vỏ': '34 kg/cm²',
      'Thương hiệu': 'Petrolimex Gas Vietnam'
    },
    inStock: true
  },
  {
    id: 'p2',
    name: 'Bình Gas Siam Gas Đỏ 12kg (Van Chụp / Ngang)',
    category: 'binh-gas',
    slug: 'binh-gas-siam-gas-do-12kg',
    image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'Sản phẩm của Siam Gas Thái Lan cao cấp, chất lượng khí gas tinh khiết không lẫn tạp chất, cho ngọn lửa xanh cực mạnh và an toàn tuyệt đối cho thiết bị đun nấu.',
    originalPrice: 460000,
    salePrice: 410000,
    isHot: false,
    isSale: true,
    isNew: true,
    specs: {
      'Trọng lượng ruột': '12kg',
      'Trọng lượng vỏ': 'In chìm trên thân bình',
      'Màu sắc': 'Màu đỏ đặc trưng',
      'Nhà sản xuất': 'Siam Gas Group',
      'Công nghệ': 'Thái Lan đạt chuẩn ISO 9001'
    },
    inStock: true
  },
  {
    id: 'p3',
    name: 'Bình Gas Công Nghiệp Siam Gas 45kg',
    category: 'binh-gas',
    slug: 'binh-gas-cong-nghiep-siam-gas-45kg',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'Chuyên dùng cho các nhà hàng, khách sạn, xưởng sản xuất hoặc các bếp ăn công nghiệp có nhu cầu tiêu thụ khí đốt lớn. Công suất hóa hơi lớn ổn định.',
    originalPrice: 1850000,
    salePrice: 1620000,
    isHot: true,
    isSale: false,
    isNew: false,
    specs: {
      'Trọng lượng chứa': '45kg khí hóa lỏng (LPG)',
      'Màu sắc': 'Màu xanh lục đậm',
      'Chiều cao toàn bộ': '1320 mm',
      'Đường kính ngoài': '374 mm',
      'Xuất xứ': 'Siam Gas Vietnam'
    },
    inStock: true
  },
  {
    id: 'p4',
    name: 'Bếp Gas Đôi Rinnai RV-715Slim(GL-A) Mặt Kính',
    category: 'bep-gas',
    slug: 'bep-gas-doi-rinnai-rv-715slim-mat-kinh',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'Bếp gas đôi chính hãng Rinnai Nhật Bản thiết kế Slim mỏng gọn, mặt kính cường lực chống trầy xước và chịu lực chịu nhiệt tốt, đầu đốt đồng thau cho lửa xanh tiết kiệm gas.',
    originalPrice: 1450000,
    salePrice: 1250000,
    isHot: true,
    isSale: true,
    isNew: true,
    specs: {
      'Thương hiệu': 'Rinnai Việt Nam (Linh kiện Nhật Bản)',
      'Kích thước': '702 x 447 x 135 mm',
      'Mặt bếp': 'Kính cường lực cao cấp',
      'Hệ thống đánh lửa': 'Magneto thế hệ mới',
      'Lượng gas tiêu thụ': '0.38 kg/h/lò',
      'Loại đầu đốt': 'Đầu đốt bằng đồng thau đúc siêu bền'
    },
    inStock: true
  },
  {
    id: 'p5',
    name: 'Bếp Gas Âm Paloma PD-200B Nhập Khẩu Nhật Bản',
    category: 'bep-gas',
    slug: 'bep-gas-am-paloma-pd-200b-nhap-khau',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'Dòng bếp gas âm nhập khẩu nguyên chiếc từ Nhật Bản, tích hợp cảm ứng ngắt gas tự động khi quá nhiệt hoặc tràn nước, thiết kế tối giản, sang trọng chuẩn Châu Âu.',
    originalPrice: 8500000,
    salePrice: 7900000,
    isHot: true,
    isSale: true,
    isNew: false,
    specs: {
      'Xuất xứ': 'Nhập khẩu nguyên chiếc từ Nhật Bản (Made in Japan)',
      'Số vùng nấu': '02 lò nấu lớn',
      'Kích thước mặt kính': '750 x 420 mm',
      'Tính năng an toàn': 'Cảm biến ngắt ga tự động FFD khi tắt lửa',
      'Công nghệ đầu đốt': 'Eco burn siêu tiết kiệm, giảm phát thải khí CO'
    },
    inStock: true
  },
  {
    id: 'p6',
    name: 'Chai / Bình Oxy Y Tế 8 Lít (Đầy Khí)',
    category: 'binh-oxy',
    slug: 'chai-binh-oxy-y-te-8-lit-day-khi',
    image: 'https://images.unsplash.com/photo-1584036561566-bdf241fa6167?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1584036561566-bdf241fa6167?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'Bình Oxy y tế 8 lít nhỏ gọn phù hợp dự phòng tại nhà cho bệnh nhân Hen suyễn, Covid, suy hô hấp hoặc sử dụng khi di chuyển cấp cứu. Khí Oxy tinh khiết 99.99%.',
    originalPrice: 1200000,
    salePrice: 950000,
    isHot: false,
    isSale: true,
    isNew: true,
    specs: {
      'Thể tích vỏ chai': '8 lít',
      'Chất lượng khí': 'Oxy y tế đạt chuẩn dược điển 99.99%',
      'Áp suất nạp khí': '150 bar (15 MPa)',
      'Chiều cao vỏ bình': '~850 mm',
      'Trọng lượng vỏ bình': '~11.5 kg',
      'Phụ kiện đi kèm': 'Hỗ trợ lắp đồng hồ điều áp & bình tạo ẩm (tùy chọn)'
    },
    inStock: true
  },
  {
    id: 'p7',
    name: 'Bình Oxy Công Nghiệp Cao Áp 40 Lít',
    category: 'binh-oxy',
    slug: 'binh-oxy-cong-nghiep-cao-ap-40-lit',
    image: 'https://images.unsplash.com/photo-1530124564312-cc02821df316?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1530124564312-cc02821df316?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'Bình Oxy công nghiệp 40 lít sử dụng cho xưởng hàn cắt gió đá, gia công kim loại hoặc nuôi thủy hải sản số lượng lớn. Đầy đủ chứng nhận kiểm định an toàn 5 năm.',
    originalPrice: 2400000,
    salePrice: 1980000,
    isHot: true,
    isSale: false,
    isNew: false,
    specs: {
      'Thể tích nén': '40 lít (chứa ~6m³ khí nén)',
      'Độ tinh khiết': 'Oxy kỹ thuật > 99.5%',
      'Độ dày vỏ chai': '5.7 mm thép đúc cao cấp',
      'Áp suất làm việc': '150 bar',
      'Áp suất thử thủy lực': '250 bar',
      'Sản xuất tại': 'Tiêu chuẩn ISO 9809-3'
    },
    inStock: true
  },
  {
    id: 'p8',
    name: 'Van Điều Áp Gas Katsura KL-10 Nhật Bản',
    category: 'van-gas',
    slug: 'van-dieu-ap-gas-katsura-kl-10-nhat-ban',
    image: 'https://images.unsplash.com/photo-1617155093730-a8bf47be792d?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1617155093730-a8bf47be792d?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'Thương hiệu van ngắt gas tự động số 1 Nhật Bản. Tự động ngắt gas khi có sự cố phát sinh rò rỉ trên đường ống. Đạt chuẩn chất lượng JIS S 2018.',
    originalPrice: 380000,
    salePrice: 320000,
    isHot: true,
    isSale: true,
    isNew: false,
    specs: {
      'Nhập khẩu': 'Katsura Co., Ltd Japan',
      'Đặc điểm': 'Khóa gas tự động khi rò rỉ khí đột ngột',
      'Hiệu năng áp suất': 'Kiểm soát áp ra cực kỳ đều đặn, xanh ngọn lửa',
      'Độ bền vật lý': 'Trên 10 năm hoạt động an toàn thường trực',
      'Bảo hiểm': 'Tích hợp bảo hiểm trách nhiệm sản phẩm 2 tỷ đồng'
    },
    inStock: true
  },
  {
    id: 'p9',
    name: 'Dây Dẫn Gas Bọc Inox 3 Lớp Hàn Quốc',
    category: 'day-gas',
    slug: 'day-dan-gas-boc-inox-3-lop-han-quoc',
    image: 'https://images.unsplash.com/photo-1521207418485-99c705420785?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1521207418485-99c705420785?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'Dây dẫn ga cao cấp xuất xứ Hàn Quốc gồm 3 lớp bảo vệ: lớp cao su chống rò rỉ bên trong, lõi thép gia cường, và lớp vỏ inox bao bọc bên ngoài chống hoàn toàn chuột bọ cắn phá.',
    originalPrice: 150000,
    salePrice: 120000,
    isHot: false,
    isSale: false,
    isNew: true,
    specs: {
      'Nước sản xuất': 'Hàn Quốc (Korea)',
      'Cấu tạo': 'Cao su dẻo NBR chuyên dụng + Lưới chỉ thép + Vỏ bọc inox 304 bên ngoài',
      'Độ dài tiêu chuẩn': '1.5 mét thương mại',
      'Khả năng chống cắt': 'Chống chuột bọ, sắc nhọn cứa phá cực tốt',
      'Áp suất tối đa áp dụng': '20 kg/cm²'
    },
    inStock: true
  }
];

export const INITIAL_BLOGS: Blog[] = [
  {
    id: 'b1',
    title: 'Mẹo Sử Dụng Gas An Toàn, Chống Cháy Nổ Tại Nhà Cho Gia Đình',
    slug: 'meo-su-dung-gas-an-toan-chong-chay-no',
    category: 'an-toan',
    categoryName: 'Mẹo sử dụng gas an toàn',
    tags: ['An toàn gas', 'Mẹo gia đình', 'Chống rò rỉ gas'],
    author: 'Đại diện Kỹ thuật GAS KIỆT GẠO',
    date: '2026-05-15',
    summary: 'Sử dụng gas hằng ngày nhưng bạn đã thực sự biết các quy tắc an toàn cốt lõi? Cùng đọc bài viết để tránh các thói quen tai hại dễ gây rò rỉ khí gas dẫn đến nguy hiểm.',
    content: `## 1. Tầm quan trọng của việc hiểu biết quy trình an toàn gas
Khí hóa lỏng (LPG) là chất đốt phổ biến của hầu hết gia đình Việt Nam. Tuy nhiên, việc rò rỉ gas tích tụ trong không gian hẹp có thể tạo thành một khối thuốc nổ nhạy bén nguy hại cực độ. Hiểu rõ quy tắc sử dụng và bảo dưỡng hệ thống van, dây dẫn sẽ giữ an toàn tuyệt đối cho người thân của bạn.

## 2. Các nguyên tắc vàng để sử dụng gas an toàn hàng ngày
- **Khóa van bình ngay sau khi nấu xong:** Thói quen tắt bếp mà không khóa van cổ bình gas là nguyên nhân hàng đầu khiến lượng gas tản mác lưu trong đường dây rò rỉ liên tục ra phòng bếp nếu dây điện hay chuột cắn phá.
- **Để bình gas thẳng đứng ở khu vực thông thoáng:** Không đặt bình ga nằm ngang hoặc dốc ngược. Tủ bếp chứa bình gas cần có khe thoáng khí bên dưới để đề phòng gas rò tích tụ dưới gầm (khí gas nặng hơn không khí).
- **Thử kín định kỳ bằng nước xà phòng:** Định kỳ 2 - 3 tuần một lần, bôi nước xà phòng lên đầu van bình, khớp kết nối với van điều áp và dọc thân dây dẫn gas để phát hiện bong bóng khí xì rỉ sớm nhất.

| Thiết bị | Thời hạn khuyến khích thay mới |
| :--- | :--- |
| **Dây dẫn gas** | Nên thay sau mỗi 2 - 3 năm sử dụng để tránh cao su bị lão hóa chai cứng |
| **Van điều áp gas** | Thay mới sau 5 năm hoạt động để đảm bảo độ nhạy màng da tự khóa gas |
| **Kẹp siết cổ dê** | Thay thế bất cứ khi nào thấy dấu hiệu hoen gỉ, hở khớp cổ dải dây |

## 3. Quy trình khẩn cấp xử lý khi ngửi thấy mùi gas nồng nặc trong nhà
Khi phát hiện rò rỉ khí gas mãnh liệt, tuyệt đối tuân theo 4 bước cứu sinh sau:

1. **Không bật/tắt bất kỳ thiết bị điện nào:** Không bật quạt điện, không sờ công tắc điện, không quẹt diêm, không bấm gọi điện thoại cận kề nguồn rò rỉ. Hành động này tạo ra tia lửa điện kích nổ tức thì.
2. **Khóa chặt van cổ bình gas ngay lập tức:** Nếu tiếp cận an toàn được bình gas, dùng khăn ướt quấn quanh van cổ bình rồi vặn chặt theo chiều kim đồng hồ.
3. **Mở toang tất cả các cửa ra vào và cửa sổ:** Tạo cho luồng khí gas rò rỉ thoát nhanh ra ngoài khí quyển tự sự, dùng bìa carton xua dọn xua hơi khí ga sát nền rải đi.
4. **Di chuyển ra xa và gọi hotline khẩn cấp:** Rời khỏi vùng nguy kịch, gọi ngay cho nhà phân phối Gas hoặc Đội Cứu nạn 114 để có hành động xử lý kỹ thuật chuyên sâu.

Xem thêm clip hướng dẫn mô phỏng xử lý đám cháy rò rỉ gas dưới đây để trang bị kiến thức trực quan hơn.`,
    image: 'https://images.unsplash.com/photo-1584281729155-d141b6131c9e?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1584281729155-d141b6131c9e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&q=80&w=800'
    ],
    youtubeId: '9eLMyGivLSw', // Sample YouTube ID
    metaTitle: 'Mẹo Sử Dụng Gas An Toàn & Quy Trình Xử Lý Rò Rỉ Gas Chuẩn 2026',
    metaDescription: 'Chia sẻ các kinh nghiệm dùng bếp gas, van gas an toàn tuyệt đối. Quy trình 4 bước xử lý khẩn cấp khi ngửi thấy mùi xì gas hạn chế rủi ro cháy nổ tối đa.',
    faqs: [
      {
        question: 'Tại sao ngọn lửa bếp gas có màu đỏ và làm hoen đen đáy nồi?',
        answer: 'Hiện tượng lửa đỏ do 2 nguyên nhân: Thứ nhất, bình gas sắp cạn rộc khiến áp lực khí kém dần; Thứ hai, bộ phận phối gió bị tắc rác hoặc bám dầu mỡ dẫn tới thiếu oxy đốt cháy hoàn toàn gas. Bạn cần tự vệ sinh khe gạt gió hoặc liên hệ kỹ thuật vệ sinh họng đốt gas.'
      },
      {
        question: 'Làm thế nào để phát hiện bình gas Petrolimex chính hãng?',
        answer: 'Bình Petrolimex chính hãng có dán tem chống giả phủ cào quét mã QR, màng bọc co dán cổ bình gas in dập chìm số lô sắc nét, logo hãng dập nổi cơ học trên vai bình và cân nặng luôn được niêm yết trùng khớp.'
      }
    ]
  },
  {
    id: 'b2',
    title: 'Cách Phân Biệt Bình Gas Petrolimex Thật & Giả Tránh Hiểm Họa Rò Rỉ',
    slug: 'cach-phan-biet-binh-gas-petrolimex-that-gia',
    category: 'khuyen-mai',
    categoryName: 'Tin khuyến mãi & Cảnh báo',
    tags: ['Cảnh báo giả', 'Petrolimex', 'Kinh nghiệm tìm gas'],
    author: 'Phòng Phát Triển Thương Hiệu',
    date: '2026-05-20',
    summary: 'Hiện nay rất nhiều cơ sở sang chiết lậu gas trái phép nhái thương hiệu Petrolimex làm nguy hại tính mạng người dùng. Lưu ngay các mẹo phân biệt chuẩn xác 100%.',
    content: `## Thực trạng nhức nhối nạn Sang chiết lậu Gas lừa dối người tiêu dùng
Nhiều đại lý lừa đảo dán decal mạo danh các thương hiệu uy tín, dùng vỏ bình hết hạn kiểm định sắt thép mỏng bợt rỉ sét sang chiết thu lợi bất chính, dễ làm rò rỉ gây hiểm họa khôn lường cho gia đình.

## 3 Dấu hiệu nhận biết nhanh bình Gas Petrolimex chính hiệu

### 1. Trọng lượng tổng bình gas
Khi nhân viên chuyển gas đến nhà, khách hàng nên yêu cầu đặt bình lên cân bàn. Trọng lượng tổng ghi trên tay xách bình vỏ (ví dụ 13.9kg) + 12kg ruột gas = 25.9kg là chính xác. Hàng giả thường thiếu từ 1 - 2.5kg gas để ăn bớt tiền.

### 2. Tem chống giả công nghệ cao
Mỗi bình gas đều có dán tem Hologram của Bộ Công An cấp. Cào lớp sơn bạc, bạn sẽ nhận được mã số để nhắn tin xác minh xuất xứ lên tổng đài, hoặc quét mã QR độc bản để truy xuất hành trình xuất xưởng bình gas.

### 3. Màng co niêm phong cổ bình
Được in dập chữ chìm sắc nét, bao ôm chặt nguyên vẹn đầu van bình, không rách rưới nứt rã khớp.`,
    image: 'https://images.unsplash.com/photo-1584281729155-d141b6131c9e?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1584281729155-d141b6131c9e?auto=format&fit=crop&q=80&w=800'],
    metaTitle: 'Hướng dẫn Phân Biệt Bình Gas Petrolimex Thật và Giả 100% đúng',
    metaDescription: 'Chia sẻ từ tổng kho Gas chính hãng giúp bảo vệ ngôi nhà bạn khỏi các bình gas sang chiết lậu độc hại nguy hiểm bằng mã số SMS và tem cào Hologram.',
    faqs: []
  },
  {
    id: 'b3',
    title: 'Cẩm Nang Từ A-Z Về Bình Oxy Y Tế: Cách Lựa Chọn & Sử Dụng Phù Hợp',
    slug: 'cam-nang-ve-binh-oxy-y-te',
    category: 'oxy',
    categoryName: 'Kiến thức bình oxy',
    tags: ['Bình Oxy y tế', 'Oxy cao áp', 'Y tế gia đình'],
    author: 'Bác sĩ Đoàn Minh Đức - Cố vấn Thiết bị',
    date: '2026-05-22',
    summary: 'Bình Oxy y tế cần lựa chọn dung tích như thế nào thích ứng với hoàn cảnh thực tế? Sử dụng thế nào để an toàn phòng cháy cao áp khí? Xem tại đây.',
    content: `## 1. Các dung tích bình Oxy phổ biến dùng tại nhà
- **Bình Oxy 8 Lít / 10 Lít:** Chứa khoảng 1.200 - 1.500 lít khí nén. Phù hợp cho bệnh nhân thở ngắt quãng hoặc cần mang theo xe cứu tế dã chiến tiện nghi. Thời gian thở dao động từ 3 - 5 tiếng tùy lưu lượng đặt.
- **Bình Oxy 40 Lít:** Chứa ~6.000 lít khí Oxy siêu nén. To lớn và thích hợp đặt cố định tại giường bệnh điều trị lâu dài, tiết kiệm chi phí đổi nạp khí thường xuyên.

## 2. Quy tắc an toàn bắt buộc khi đặt bình Oxy y tế trong nhà
Oxy tinh chất nạp áp suất cực cao tạo ra chất xúc tác đốt cháy cực mạnh. Để bảo vệ không gian sống, tuyệt đối tuân thủ:
1. **Tránh xa nguồn nhiệt lớn và tia lửa điện:** Đặt bình cách bếp gas, tivi, máy điều hòa tối thiểu 5 mét.
2. **Không bôi hoặc để dính mỡ dầu bôi trơn:** Mỡ bôi trơn tiếp xúc với Oxy áp suất cao gây cháy tức thì không thể dập tắt. Tuyệt đối dùng tay khô sạch tháo ráp van lắp áp kế.
3. **Giữ bình đứng vững:** Có khung sắt hoặc xiết xích tự chống đổ vỡ, tránh gãy bạt đầu van xả áp gây nổ vật lý nguy hiểm.`,
    image: 'https://images.unsplash.com/photo-1584036561566-bdf241fa6167?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1584036561566-bdf241fa6167?auto=format&fit=crop&q=80&w=800'],
    metaTitle: 'Cẩm nang sử dụng khí nén và bình Oxy y tế tại gia an toàn',
    metaDescription: 'Cách tính thời gian sử dụng bình oxy y tế cầm tay 8 lít và bình lớn 40 lít. Hướng dẫn lắp đặt đồng hồ đo áp an toàn tối đa cho bệnh nhân tại nhà.',
    faqs: [
      {
        question: 'Làm thế nào tính được thời lượng thở còn lại của bình Oxy?',
        answer: 'Cách tính: Lấy thể tích bình vỏ (lít) nhân với số áp suất hiển thị trên mặt đồng hồ (bar), sau đó chia cho lưu lượng thở thực tế của bệnh nhân (lít/phút). Ví dụ: Bình 8 Lít còn áp suất 100 bar, người bệnh thở 3 lít/phút. Thời gian thở = (8 * 100) / 3 = 266 phút (~4.4 tiếng).'
      }
    ]
  }
];

export const INITIAL_BANNERS: Banner[] = [
  {
    id: 'ba1',
    title: 'Hệ Thống Phân Phối Gas Sạch & Thiết Bị Oxy Premium',
    subtitle: 'Nhanh chóng - An toàn - Tận tâm. Khí gas tinh chất không lẫn tạp chất, van an toàn khóa tự động thế hệ mới đạt chuẩn Nhật Bản.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1920',
    link: '#featured-products',
    isActive: true,
    type: 'hero'
  },
  {
    id: 'ba2',
    title: 'Giải Pháp Bếp Nhà Hiện Đại & Sang Trọng',
    subtitle: 'Sở hữu bếp gas Rinnai, Paloma chính hiệu nhập khẩu. Mặt kính cường lực cao cấp, bảo hành hỏa tốc lên tới 3 năm.',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=1920',
    link: '#kitchen-stove',
    isActive: true,
    type: 'hero'
  },
  {
    id: 'ba3',
    title: 'Bình Oxy Y Tế & Công Nghiệp - Giao Nhanh 24/7',
    subtitle: 'Khí sạch chuẩn y tế dược điển Việt Nam, đầy đủ phụ kiện đồng hồ điều áp, bình tạo ẩm y tế. Miễn phí vận chuyển nội thành.',
    image: 'https://images.unsplash.com/photo-1584036561566-bdf241fa6167?auto=format&fit=crop&q=80&w=1920',
    link: '#oxy-cylinders',
    isActive: true,
    type: 'hero'
  }
];

export const INITIAL_PROMO_CAMPAIGNS: PromotionCampaign[] = [
  {
    id: 'pc1',
    title: 'Chiến Dịch Chào Hè - Tri Ân Ngày Vàng Sử Dụng Gas An Toàn',
    discountWording: 'Tặng ngay Dây dẫn gas 3 lớp bọc Inox trị giá 150K khi đổi bình gas bất kỳ!',
    endDate: '2026-06-30',
    isActive: true
  },
  {
    id: 'pc2',
    title: 'Hỗ Trợ Đại Dịch & Chăm Sóc Sức Khỏe Gia Đình',
    discountWording: 'Miễn phí cho mượn vỏ bình Oxy 8 Lít cho bệnh nhân suy hô hấp cần trị liệu đột xuất tại nhà.',
    endDate: '2026-07-15',
    isActive: true
  }
];

export const INITIAL_CONTACT: CompanyContact = {
  companyName: 'CỬA HÀNG GAS KIỆT GẠO - LAI VUNG',
  representative: 'Ông Phan Chánh Trọng - Đại diện hợp pháp',
  mst: '0108927455 - Sở KH&ĐT Thành phố cấp phép hoạt động',
  hotline: '0939 843 725',
  phoneSales: '0939 843 725',
  phoneTechnical: '0939 843 725',
  email: 'contact@gaskietgao.com',
  addressMain: 'Ấp 1, Xã Hòa Long, Tỉnh Đồng Tháp (Bờ kè Chợ Cũ)',
  addressBranch: [
    'Chi nhánh Hà Nội: Số 42 Ngách 12/8 Kim Giang, Quận Thanh Xuân, Hà Nội',
    'Tổng kho Miền Nam: KCN Cát Lái, Cảng Phú Mỹ, Quận 2, TP. Hồ Chí Minh',
    'Trạm chiết nạp Gas miền Tây: QL1A, TP Tân An, Tỉnh Long An'
  ],
  zaloLink: 'https://zalo.me/0939843725',
  fbMessengerLink: 'https://www.facebook.com/profile.php?id=61574257212601',
  mapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3067.8454307812412!2d105.6542506056432!3d10.288857427545484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310a79be052ccd29%3A0x6655c324d2b94c7b!2zQ-G7rWEgSMOgbmcgR2FzIEtp4buHdCBH4bqhbw!5e1!3m2!1svi!2s!4v1780705021505!5m2!1svi!2s'
};

export const INITIAL_POPUP: PromotionPopup = {
  id: 'pop1',
  title: 'QUÀ TẶNG TRỊ GIÁ 250,000đ',
  subtitle: 'Khám sức khỏe hệ thống gas tại nhà, tặng trọn bộ kẹp khóa siết van và tư vấn lắp đặt cảm ứng cảnh báo rò rỉ gas MIỄN PHÍ duy nhất hôm nay!',
  image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=400',
  linkText: 'Đăng ký kiểm tra ngay',
  linkUrl: '#quote-form-section',
  isActive: true
};

export const INITIAL_SEO: WebSEOConfig = {
  metaTitle: 'Tổng Kho Gas Sạch, Bếp Gas Nhập Khẩu & Bình Oxy Toàn Quốc - Gas Kiệt Gạo',
  metaDescription: 'Hệ thống năng lượng PGS Premium Việt Nam. Nhập khẩu và phân phối trực tiếp vỏ bình gas Siam, Petrolimex, bếp gas Paloma Nhật Bản, bình Oxy y tế chất lượng vượt trội. Bảo an 24/7.',
  metaKeywords: 'gas sach, can ga, thiet bi nha bep, bep gas rinnai, bep gas paloma, binh oxy y te, van gas katsura, doi binh gas gan day',
  ogImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1200'
};

export const INITIAL_WORDING: WordingConfig = {
  heroTitle: 'An Toàn Tuyệt Đối - Tiết Kiệm Tối Đa',
  heroSub: 'Gas Kiệt Gạo cam kết 100% vỏ bình gas mới kiểm định chất lượng, phục vụ siêu tốc và bảo dưỡng bếp nấu miễn phí trọn đời.',
  aboutTitle: 'Cửa Hàng Gas Gas Kiệt Gạo Chuyên Nghiệp',
  aboutLead: 'Thương hiệu tiên phong nâng tầm an toàn rò rỉ khí gas tại hàng triệu gia đình Việt Nam.',
  aboutText: 'Được thành lập với tầm nhìn trở thành đại sứ bảo hiểm an toàn chất đốt bếp gia đình, Gas Kiệt Gạo không ngừng kiến tạo các quy chuẩn lắp ráp khắt khe kết hợp cùng các thương hiệu đầu ngành như Petimex, Total hay Petrolimex. Mỗi giọt gas của chúng tôi mang cam kết khí sạch 100% không bám lọ đáy nấu, mang trọn sự an vui đầm ấm cho mâm cơm gia đình.',
  whyChooseUsTitle: 'Giá Trị Tuyệt Đối Chỉ Có Tại Gas Kiệt Gạo',
  certificateTitle: 'Chứng Nhận Chất Lượng Quốc Tế & An Toàn Phòng Cháy Chữa Cháy'
};

export const INITIAL_QUOTES: QuoteRequest[] = [
  {
    id: 'q1',
    name: 'Phạm Hồng Quân',
    phone: '0977.123.456',
    email: 'hongquan@gmail.com',
    productName: 'Bình Gas Petrolimex 12kg (Van Ngang)',
    message: 'Tư vấn đổi bình gas giao hỏa tốc đến chung cư Golden Land Kim Giang.',
    date: '2026-05-28 10:15',
    status: 'pending'
  },
  {
    id: 'q2',
    name: 'Chị Mai Lan Anh',
    phone: '0903.654.789',
    email: 'lananh88@yahoo.com',
    productName: 'Bếp Gas Đôi Rinnai RV-715Slim(GL-A) Mặt Kính',
    message: 'Cần khảo sát lắp đặt kèm van ga ngắt Nhật Bản Katsura. Gọi điện tư vấn.',
    date: '2026-05-27 15:30',
    status: 'processed'
  }
];
