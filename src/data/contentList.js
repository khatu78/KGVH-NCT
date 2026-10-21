export const ROOM = { width: 24, depth: 18, height: 5.5 };

export const CONTENT_LIST = [
  // 5 vị trí tham quan
  { id: 1, name: "Lối vào", type: "spot" },
  { id: 2, name: "Hình ảnh về Bác Hồ", type: "spot" },
  { id: 3, name: "Video tư liệu", type: "spot" },
  { id: 4, name: "Tủ sách", type: "spot" },
  { id: 5, name: "Bảo tàng 3D", type: "spot" },

  // 8 thẻ nội dung trưng bày
  { id: 6, name: "Tiểu sử và cuộc đời Chủ tịch Hồ Chí Minh", type: "space" },
  { id: 7, name: "Hành trình theo dấu chân Bác", type: "space" },
  { id: 8, name: "Hiện vật và dấu ấn về Chủ tịch Hồ Chí Minh", type: "space" },
  { id: 9, name: "Những câu chuyện về Bác Hồ", type: "space" },
  { id: 10, name: "Tư tưởng, đạo đức, phong cách Hồ Chí Minh", type: "space" },
  { id: 11, name: "Bác Hồ với thiếu niên, nhi đồng và giáo dục", type: "space" },
  { id: 12, name: "Di sản Hồ Chí Minh", type: "space" },
  { id: 13, name: "Bác Hồ trong trái tim thầy và trò nhà trường", type: "space" },
];

export const spots = [
  { id: 0, name: "Lối vào", position: [0, 1.6, 6.5] },
  { id: 1, name: "Hình ảnh về Bác Hồ", position: [-8.5, 1.6, -3] },
  { id: 2, name: "Video tư liệu", position: [0, 1.6, 0] },
  { id: 3, name: "Tủ sách", position: [8.5, 1.6, -3] },
  { id: 4, name: "Bảo tàng 3D", position: [5, 1.6, 1.5] },
];

export const targets = [
  [0, 1.6, -8],       // id 0: nhìn về vách sau
  [-8, 2.65, -8.25],  // id 1: chân dung Bác Hồ
  [0, 2.7, -8.25],    // id 2: màn hình video
  [8, 2.2, -8.1],     // id 3: tủ sách
  [11.5, 2.7, 1.5],   // id 4: khu trưng bày bên phải
];

export const exhibits = [
  {
    title: "Chân dung Chủ tịch Hồ Chí Minh",
    description: "Không gian giới thiệu hình ảnh và những dấu ấn tiêu biểu trong cuộc đời, sự nghiệp của Chủ tịch Hồ Chí Minh.",
    position: [-8, 2.7, -8.7],
  },
  {
    title: "Video tư liệu",
    description: "Khu vực trình chiếu video, hình ảnh và tư liệu phục vụ tham quan.",
    position: [0, 2.8, -8.7],
  },
  {
    title: "Tủ sách",
    description: "Nơi trưng bày sách và tài liệu tìm hiểu về cuộc đời, tư tưởng, đạo đức và phong cách Hồ Chí Minh.",
    position: [8, 2.4, -8.2],
  },
  {
    title: "Bảo tàng 3D",
    description: "Các hiện vật và tư liệu được sắp xếp theo chủ đề để người tham quan khám phá.",
    position: [9.5, 1.4, 1],
  },
];

export const spaces = [
  {
    id: 1,
    title: "TIỂU SỬ VÀ CUỘC ĐỜI CHỦ TỊCH HỒ CHÍ MINH",
    description: "Trình bày quê hương, gia đình, thời niên thiếu...",
    position: [-4.8, 0, -5.2],
    rotation: 0,
    color: "#7c2929",
  },
  {
    id: 2,
    title: "HÀNH TRÌNH THEO DẤU CHÂN BÁC",
    description: "Tái hiện hành trình ra đi tìm đường cứu nước...",
    position: [-1.6, 0, -5.2],
    rotation: 0,
    color: "#805b32",
  },
  {
    id: 3,
    title: "HIỆN VẬT VÀ DẤU ẤN VỀ CHỦ TỊCH HỒ CHÍ MINH",
    description: "Trưng bày hình ảnh hoặc mô hình 3D những hiện vật...",
    position: [1.6, 0, -5.2],
    rotation: 0,
    color: "#315c50",
  },
  {
    id: 4,
    title: "NHỮNG CÂU CHUYỆN VỀ BÁC HỒ",
    description: "Giới thiệu những câu chuyện tiêu biểu về cuộc đời...",
    position: [4.8, 0, -5.2],
    rotation: 0,
    color: "#365d83",
  },
  {
    id: 5,
    title: "TƯ TƯỞNG, ĐẠO ĐỨC, PHONG CÁCH HỒ CHÍ MINH",
    description: "Đây là phòng trọng tâm giúp người tham quan tìm hiểu...",
    position: [-4.8, 0, 5.2],
    rotation: Math.PI,
    color: "#365d83",
  },
  {
    id: 6,
    title: "BÁC HỒ VỚI THIẾU NIÊN, NHI ĐỒNG VÀ GIÁO DỤC",
    description: "Giới thiệu tình cảm, sự quan tâm và những lời căn dặn...",
    position: [-1.6, 0, 5.2],
    rotation: Math.PI,
    color: "#315c50",
  },
  {
    id: 7,
    title: "DI SẢN HỒ CHÍ MINH",
    description: "Giới thiệu những giá trị mà Chủ tịch Hồ Chí Minh để lại...",
    position: [1.6, 0, 5.2],
    rotation: Math.PI,
    color: "#805b32",
  },
  {
    id: 8,
    title: "BÁC HỒ TRONG TRÁI TIM THẦY VÀ TRÒ NHÀ TRƯỜNG",
    description: "Không gian mang dấu ấn riêng của trường...",
    position: [4.8, 0, 5.2],
    rotation: Math.PI,
    color: "#7c2929",
  },
];