
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, OrbitControls, Text, useTexture } from "@react-three/drei";
import * as THREE from "three";
import "./style.css";
import RobotGuide from "./RobotGuide";

const ROOM = { width: 24, depth: 18, height: 5.5 };

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


const spots = [
  { id: 0, name: "Lối vào", position: [0, 1.6, 6.5] },
  { id: 1, name: "Hình ảnh về Bác Hồ", position: [-8.5, 1.6, -3] },
  { id: 2, name: "Video tư liệu", position: [0, 1.6, 0] },
  { id: 3, name: "Tủ sách", position: [8.5, 1.6, -3] },
  { id: 4, name: "Bảo tàng 3D", position: [5, 1.6, 1.5] },
];
const targets = [
  [0, 1.6, -8],       // id 0: nhìn về vách sau
  [-8, 2.65, -8.25],  // id 1: chân dung Bác Hồ
  [0, 2.7, -8.25],    // id 2: màn hình video
  [8, 2.2, -8.1],     // id 3: tủ sách
  [11.5, 2.7, 1.5],   // id 4: khu trưng bày bên phải
];
const exhibits = [
  {
    title: "Chân dung Chủ tịch Hồ Chí Minh",
    description:
      "Không gian giới thiệu hình ảnh và những dấu ấn tiêu biểu trong cuộc đời, sự nghiệp của Chủ tịch Hồ Chí Minh.",
    position: [-8, 2.7, -8.7],
  },
  {
    title: "Video tư liệu",
    description:
      "Khu vực trình chiếu video, hình ảnh và tư liệu phục vụ tham quan.",
    position: [0, 2.8, -8.7],
  },
  {
    title: "Tủ sách",
    description:
      "Nơi trưng bày sách và tài liệu tìm hiểu về cuộc đời, tư tưởng, đạo đức và phong cách Hồ Chí Minh.",
    position: [8, 2.4, -8.2],
  },
  {
    title: "Bảo tàng 3D",
    description:
      "Các hiện vật và tư liệu được sắp xếp theo chủ đề để người tham quan khám phá.",
    position: [9.5, 1.4, 1],
  },
];
 


function CameraView({ spots, spotIndex,room2Active, activeSpace, onSpaceArrive,}) {
  const { camera } = useThree();
  const isFirstRender = useRef(true);
  const isMovingRef = useRef(false);

  const destination = useRef(
    new THREE.Vector3(...spots[0].position)
  );

  const lookTarget = useRef(
    new THREE.Vector3(...targets[0])
  );

  useEffect(() => {
    
    
if (room2Active && activeSpace) {
  const [x, , z] = activeSpace.position;
  const isTopRow = z < 0;

  // Camera đứng ngoài mặt mở của gian
  destination.current.set(
    -22 + x,
    1.6,
    5.75 + z + (isTopRow ? 2.8 : -2.8)
  );

  // Nhìn vào giữa gian
  lookTarget.current.set(
    -22 + x,
    1.3,
    5.75 + z
  );


} else if (room2Active) {
  // Đứng chính giữa phòng 2
  destination.current.set(-22, 1.6, 5.75);

  // Nhìn về bức tường đối diện cửa
  lookTarget.current.set(-31.5, 2.2, 5.75);
}
 else {
  // Giữ nguyên phần điều hướng phòng 1
  const spot = spots[spotIndex];
  const target = targets[spotIndex];

  if (!spot || !target) return;

  destination.current.set(...spot.position);
  lookTarget.current.set(...target);

  if (spotIndex === 1 || spotIndex === 3) {
    lookTarget.current.set(
      destination.current.x,
      destination.current.y,
      -10
    );
  }

  if (isFirstRender.current) {
    camera.position.set(...spots[0].position);
    camera.lookAt(...targets[0]);
    camera.rotation.order = "YXZ";
    isFirstRender.current = false;
    isMovingRef.current = false;
    return;
  }
}

    isMovingRef.current = true;
  }, [spotIndex, spots, camera, room2Active, activeSpace]);

  useFrame((_, delta) => {
    if (!isMovingRef.current) return;

    const alpha = 1 - Math.exp(-5 * delta);

    camera.position.lerp(destination.current, alpha);
    camera.lookAt(lookTarget.current);

    if (camera.position.distanceTo(destination.current) < 0.03) {
  camera.position.copy(destination.current);
  camera.lookAt(lookTarget.current);
  isMovingRef.current = false;

  if (room2Active && activeSpace) {
    onSpaceArrive?.(activeSpace);
  }
}
  });

  return null;
}
  




function FixedLookControls() {
  const { camera, gl } = useThree();

  useEffect(() => {
    const element = gl.domElement;
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startYaw = 0;
    let startPitch = 0;

   const onPointerDown = (e) => {
  if (e.button !== 0) return;

  dragging = true;
  startX = e.clientX;
  startY = e.clientY;

  camera.rotation.order = "YXZ";
  startYaw = camera.rotation.y;
  startPitch = camera.rotation.x;

  element.setPointerCapture?.(e.pointerId);
};

  const onPointerMove = (e) => {
  if (!dragging) return;

  const sensitivity = 0.004;

  camera.rotation.order = "YXZ";

  // Kéo chuột sang phải: góc nhìn sang phải
  camera.rotation.y =
    startYaw + (e.clientX - startX) * sensitivity;

  // Kéo chuột xuống: góc nhìn xuống
  camera.rotation.x = THREE.MathUtils.clamp(
    startPitch + (e.clientY - startY) * sensitivity,
    -1.2,
    1.2
  );
};


    const onPointerUp = () => {
      dragging = false;
      element.style.cursor = "grab";
    };

    element.style.cursor = "grab";
    element.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      element.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      element.style.cursor = "";
    };
  }, [camera, gl]);

  return null;
}



function ArrowMarker({ position, onClick, label }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group
      position={[position[0], 0, position[2]]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
      scale={hovered ? 1.06 : 1}
    >
      {/* Tấm biển đỏ nằm ngang, sát mặt đất */}
      <mesh position={[0, 0.65, 0]}>
        <boxGeometry args={[1.5, 0.42, 0.1]} />
        <meshStandardMaterial
          color={hovered ? "#c62828" : "#8b0000"}
          emissive="#5c0000"
          emissiveIntensity={hovered ? 0.3 : 0.1}
        />
      </mesh>

      {/* Chữ vàng nhỏ */}
      <Text
        position={[0, 0.65, 0.056]}
        fontSize={0.12}
        color="#ffd700"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.4}
        textAlign="center"
      >
        {label}
      </Text>
    </group>
  );
}

///new


const spaces = [
  {
    id: 1,
    title: "TIỂU SỬ VÀ CUỘC ĐỜI CHỦ TỊCH HỒ CHÍ MINH",
    description: "Trình bày quê hương, gia đình, thời niên thiếu, quá trình trưởng thành và những dấu mốc quan trọng trong cuộc đời, sự nghiệp cách mạng của Chủ tịch Hồ Chí Minh. Nội dung có thể thiết kế dưới dạng dòng thời gian, kết hợp hình ảnh, tư liệu và thuyết minh ngắn để người tham quan dễ theo dõi.",
   position: [-4.8, 0, -5.2],
    rotation: 0,
    color: "#7c2929",
  },
  {
    id: 2,
    title: "HÀNH TRÌNH THEO DẤU CHÂN BÁC",
    description: "Tái hiện hành trình ra đi tìm đường cứu nước và những địa danh tiêu biểu gắn với quá trình hoạt động cách mạng của Người như Bến Nhà Rồng, các quốc gia Người từng đi qua, Pác Bó, Tân Trào, Phủ Chủ tịch, Nhà sàn Bác Hồ... Có thể thiết kế bản đồ tương tác, khi bấm vào từng địa điểm sẽ xuất hiện hình ảnh, thông tin, video hoặc tư liệu liên quan.",
   position: [-1.6, 0, -5.2],
   rotation: 0,
    color: "#805b32",
  },
  {
    id: 3,
    title: "HIỆN VẬT VÀ DẤU ẤN VỀ CHỦ TỊCH HỒ CHÍ MINH",
    description: "Trưng bày hình ảnh hoặc mô hình 3D những hiện vật, vật dụng tiêu biểu gắn với cuộc sống và hoạt động của Bác như đôi dép cao su, bộ quần áo kaki, máy chữ, bàn làm việc, các vật dụng sinh hoạt... Mỗi hiện vật có phần giới thiệu và câu chuyện ngắn đi kèm, giúp người xem hiểu thêm về cuộc sống giản dị và phong cách của Người.",
    position: [1.6, 0, -5.2],
    rotation: 0,
    color: "#315c50",
  },
  {
    id: 4,
    title: "NHỮNG CÂU CHUYỆN VỀ BÁC HỒ",
    description: "Giới thiệu những câu chuyện tiêu biểu về cuộc đời, đạo đức và phong cách Hồ Chí Minh, tập trung vào các nội dung như sự giản dị, tiết kiệm; tình yêu thương nhân dân; tình cảm dành cho thiếu niên, nhi đồng; tình cảm với cán bộ, chiến sĩ; tinh thần tự học, trách nhiệm và nói đi đôi với làm. Phòng có thể thiết kế dạng tủ sách hoặc những quyển sách ảo, người xem bấm vào từng câu chuyện để đọc, nghe kể chuyện hoặc xem video.",
   position: [4.8, 0, -5.2],
   rotation: 0,
    color: "#365d83",
  },
  {
    id: 5,
    title: "TƯ TƯỞNG, ĐẠO ĐỨC, PHONG CÁCH HỒ CHÍ MINH",
    description: "Đây là phòng trọng tâm giúp người tham quan tìm hiểu những giá trị nổi bật trong tư tưởng, đạo đức và phong cách của Người. Nội dung có thể chia thành các khu: yêu nước, thương dân; cần, kiệm, liêm, chính; trách nhiệm, kỷ luật; giản dị, khiêm tốn; tự học và học tập suốt đời; nói đi đôi với làm. Mỗi nội dung nên gắn với những việc làm cụ thể để giáo viên và học sinh có thể vận dụng trong học tập, công tác và đời sống.",
   position: [-4.8, 0, 5.2],
   rotation: Math.PI,
    color: "#365d83",
  },
  {
    id: 6,
    title: "BÁC HỒ VỚI THIẾU NIÊN, NHI ĐỒNG VÀ GIÁO DỤC",
    description: "Giới thiệu tình cảm, sự quan tâm và những lời căn dặn của Chủ tịch Hồ Chí Minh đối với thiếu niên, nhi đồng và học sinh. Nội dung gồm 5 điều Bác Hồ dạy, thư Bác gửi học sinh, hình ảnh Bác với thiếu nhi, những câu chuyện về tình cảm của Người đối với thế hệ trẻ. Có thể bố trí thêm góc “Học sinh chúng em làm theo lời Bác”, gắn lời dạy của Bác với những việc làm thiết thực trong nhà trường.",
   position: [-1.6, 0, 5.2],
   rotation: Math.PI,
    color: "#315c50",
  },
  {
    id: 7,
    title: "DI SẢN HỒ CHÍ MINH",
    description: "Giới thiệu những giá trị mà Chủ tịch Hồ Chí Minh để lại thông qua các tác phẩm, bài viết, bài nói, lời kêu gọi, thơ, hình ảnh, tư liệu và các di tích lịch sử gắn với Người. Điểm nhấn có thể là “Tủ sách Hồ Chí Minh ảo”, nơi người tham quan lựa chọn các đầu sách, tác phẩm hoặc tài liệu để đọc và tìm hiểu. Các di tích tiêu biểu cũng có thể được giới thiệu bằng hình ảnh, video hoặc mô hình tham quan ảo.",
  position: [1.6, 0, 5.2],
rotation: Math.PI,
    color: "#805b32",
  },
  {
    id: 8,
    title: "BÁC HỒ TRONG TRÁI TIM THẦY VÀ TRÒ NHÀ TRƯỜNG",
    description: "Đây là không gian mang dấu ấn riêng của trường, giới thiệu những hoạt động thực tế trong học tập và làm theo tư tưởng, đạo đức, phong cách Hồ Chí Minh. Nội dung gồm hình ảnh các hội thi kể chuyện về Bác Hồ, học sinh kể chuyện dưới cờ, sinh hoạt chủ điểm, các hoạt động học tập và làm theo Bác, hình ảnh giáo viên – học sinh tham gia, video các tiết mục, bài dự thi, sản phẩm của học sinh, thành tích và giấy khen nếu có.",
   position: [4.8, 0, 5.2],
    rotation: Math.PI,
    color: "#7c2929",
  },
];


function InteractiveSpaces({ onSelect }) {
  return (
    <group>
      {spaces.map((space) => (
        <group
          key={space.id}
          position={space.position}
          rotation={[0, space.rotation, 0]}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(space);
          }}
          onPointerOver={() => {
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "auto";
          }}
        >
          {/* Sàn gian trưng bày */}
          <mesh position={[0, 0.08, 0]}>
            <boxGeometry args={[2.25, 0.16, 1.9]} />
            <meshStandardMaterial color="#d8c9ad" />
          </mesh>

          {/* Vách sau */}
          <mesh position={[0, 1.1, -0.9]}>
            <boxGeometry args={[2.25, 2.2, 0.12]} />
            <meshStandardMaterial color="#eee6d7" />
          </mesh>

          {/* Vách trái */}
          <mesh position={[-1.06, 1.1, 0]}>
            <boxGeometry args={[0.12, 2.2, 1.9]} />
            <meshStandardMaterial color="#eee6d7" />
          </mesh>

          {/* Vách phải */}
          <mesh position={[1.06, 1.1, 0]}>
            <boxGeometry args={[0.12, 2.2, 1.9]} />
            <meshStandardMaterial color="#eee6d7" />
          </mesh>

          {/* Bảng tên */}
          <mesh position={[0, 2.05, 0.83]}>
            <boxGeometry args={[2.05, 0.42, 0.12]} />
            <meshStandardMaterial
              color={space.color}
              metalness={0.2}
              roughness={0.5}
            />
          </mesh>

         <Text
  position={[0, 2.05, 0.9]}
  fontSize={0.15}
  color="#FFF0C2"
  anchorX="center"
  anchorY="middle"
  maxWidth={2.1}
  textAlign="center"
  outlineWidth={0.003}
  outlineColor="#79552C"
  letterSpacing={0.005}
  lineHeight={1.3}
  material-toneMapped={false}
>
            {space.title}
          </Text>

          {/* Biểu tượng tương tác tạm thời */}
          <mesh position={[0, 1.05, 0.84]}>
            <planeGeometry args={[1.35, 1.15]} />
            <meshBasicMaterial color="#d8c9ad" />
          </mesh>

          <Text
            position={[0, 1.15, 0.87]}
            fontSize={0.19}
            color="#7c2929"
            anchorX="center"
            anchorY="middle"
          >
            {`KHU ${space.id}`}
          </Text>

          <Text
            position={[0, 0.85, 0.87]}
            fontSize={0.12}
            color="#5c1717"
            anchorX="center"
            anchorY="middle"
          >
            NHẤN ĐỂ KHÁM PHÁ
          </Text>
        </group>
      ))}
    </group>
  );
}

///căn phòng thứ 2

function SecondRoom({ onSpaceClick }) {
  return (
    <group>
     {/* Biển nhấn quay về sảnh chính */}
<group position={[-12.3, 1.5, 5.75]}>
  <mesh
    onClick={(e) => {
      e.stopPropagation();
      console.log("Đã nhấn biển SẢNH CHÍNH");
      window.dispatchEvent(new Event("leave-second-room"));
    }}
    onPointerOver={() => {
      document.body.style.cursor = "pointer";
    }}
    onPointerOut={() => {
      document.body.style.cursor = "auto";
    }}
  >
    <boxGeometry args={[0.16, 0.6, 2]} />
    <meshStandardMaterial
      color="#681b1b"
      side={THREE.DoubleSide}
    />
  </mesh>

  <Text
  position={[-0.09, 0, 0]}
  rotation={[0, -Math.PI / 2, 0]}
  fontSize={0.3}
  color="#ffe6a0"
  anchorX="center"
  anchorY="middle"
  renderOrder={10}
  material-side={THREE.DoubleSide}
>
  SẢNH CHÍNH
</Text>
</group>

      {/* Sàn phòng 2: rộng 20, sâu 14 */}
      <mesh position={[-22, 0, 5.75]} receiveShadow>
        <boxGeometry args={[20, 0.2, 14]} />
        <meshStandardMaterial color="#d8c9ad" />
      </mesh>

      {/* Trần */}
      <mesh position={[-22, 5.5, 5.75]}>
        <boxGeometry args={[20, 0.2, 14]} />
        <meshStandardMaterial color="#f5f1e8" />
      </mesh>

      {/* Tường cuối phòng */}
      <mesh position={[-32, 2.75, 5.75]}>
        <boxGeometry args={[0.25, 5.5, 14]} />
        <meshStandardMaterial color="#eee6d7" />
      </mesh>

      {/* Hai tường bên */}
      {[-1.25, 12.75].map((z) => (
        <mesh key={z} position={[-22, 2.75, z]}>
          <boxGeometry args={[20, 5.5, 0.25]} />
          <meshStandardMaterial color="#eee6d7" />
        </mesh>
      ))}

      {/* Vách nối bên phải cửa vào Room 2 */}
<mesh position={[-12, 2.75, 10.8]}>
  <boxGeometry args={[0.25, 5.5, 3.6]} />
  <meshStandardMaterial color="#eee6d7" />
</mesh>

      
      

{/* Tiêu đề trên tường đối diện cửa */}
<Text
  position={[-31.75, 4.6, 5.75]}
  rotation={[0, Math.PI / 2, 0]}
  fontSize={0.4}
  color="#7c2929"
  anchorX="center"
  anchorY="middle"
  maxWidth={16}
  textAlign="center"
>
  KHÔNG GIAN TRƯNG BÀY CHUYÊN ĐỀ
</Text>



      {/* Cửa ở đầu lối đi giữa 8 gian 
<group position={[-22, 0, -1.1]}>
 
  <mesh position={[-0.1, 1.25, -1.2]}>
    <boxGeometry args={[2.5, 2.5, 0.15]} />
    <meshStandardMaterial color="#70472d" />
  </mesh>

  <mesh position={[-0.1, 1.25, 1.2]}>
    <boxGeometry args={[2.5, 2.5, 0.15]} />
    <meshStandardMaterial color="#70472d" />
  </mesh>

  <mesh position={[-0.1, 2.5, 0]}>
    <boxGeometry args={[2.5, 0.15, 2.5]} />
    <meshStandardMaterial color="#70472d" />
  </mesh>
</group> */}

{/* Tám gian trưng bày */}
<group position={[-22, 0, 5.75]}>
  <InteractiveSpaces onSelect={onSpaceClick} />
</group>
    </group>
  );
}




function Room({ onExhibit, onSpaceClick, onOpenMuseum, onOpenLibrary, onOpenChuS }) {

const [activeChuS, setActiveChuS] = useState(0);

const chuSTextures = useTexture(
  Array.from({ length: 10 }, (_, i) =>
    `${import.meta.env.BASE_URL}hinh-bac/${i + 1}.${i === 0 ? "jpg" : "jpeg"}`
  )
);

  const portraitTexture = useTexture(
  `${import.meta.env.BASE_URL}hinh-bac/1.jpg`
);
   const banDo = useTexture(`${import.meta.env.BASE_URL}images/bandoVN.jpg`);
   const [doorOpen, setDoorOpen] = useState(true);
   return (
    <group>
        {/* Bản đồ Việt Nam trên tường */}
     <mesh
  position={[-11.78, 2.75, -1.5]}
  rotation={[0, Math.PI / 2, 0]}
  onClick={(e) => {
    e.stopPropagation();
    window.dispatchEvent(new Event("open-map"));
  }}
  onPointerOver={() => {
    document.body.style.cursor = "pointer";
  }}
  onPointerOut={() => {
    document.body.style.cursor = "auto";
  }}
>
  <planeGeometry args={[2.5, 3.5]} />
  <meshBasicMaterial
    map={banDo}
    side={THREE.DoubleSide}
    toneMapped={false}
  />
</mesh>
     {/* Sàn */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[ROOM.width, ROOM.depth]} />
        <meshStandardMaterial color="#d8c9ad" />
      </mesh>

      {/* Trần */}
      <mesh position={[0, ROOM.height, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[ROOM.width, ROOM.depth]} />
        <meshStandardMaterial color="#f5f1e8" side={THREE.DoubleSide} />
      </mesh>

      {/* Tường sau */}
      <mesh position={[0, ROOM.height / 2, -ROOM.depth / 2]}>
        <boxGeometry args={[ROOM.width, ROOM.height, 0.3]} />
        <meshStandardMaterial color="#eee6d7" />
      </mesh>


      
      {/* Tường phải của sảnh chính */}
<mesh position={[12, ROOM.height / 2, 0]}>
  <boxGeometry args={[0.3, ROOM.height, ROOM.depth]} />
  <meshStandardMaterial color="#eee6d7" />
</mesh>

{/* Vách trước Room 1 */}
<mesh position={[0, ROOM.height / 2, ROOM.depth / 2]}>
  <boxGeometry args={[ROOM.width, ROOM.height, 0.3]} />
  <meshStandardMaterial color="#eee6d7" />
</mesh>

{/* Tường trái: chừa lối cửa tại z = 5.75 */}
<mesh position={[-12, ROOM.height / 2, -2.25]}>
  <boxGeometry args={[0.3, ROOM.height, 13.5]} />
  <meshStandardMaterial color="#eee6d7" />
</mesh>

<mesh position={[-12, ROOM.height / 2, 8]}>
  <boxGeometry args={[0.3, ROOM.height, 2]} />
  <meshStandardMaterial color="#eee6d7" />
</mesh>

{/* Phần tường phía trên cửa */}
<mesh position={[-12, 4, 5.75]}>
  <boxGeometry args={[0.3, 3, 2.5]} />
  <meshStandardMaterial color="#eee6d7" />
</mesh>

{/* Khung cửa */}
<group position={[-11.82, 0, 5.75]}>
  <mesh position={[0, 1.25, -1.2]}>
    <boxGeometry args={[0.2, 2.5, 0.15]} />
    <meshStandardMaterial color="#70472d" />
  </mesh>

  <mesh position={[0, 1.25, 1.2]}>
    <boxGeometry args={[0.2, 2.5, 0.15]} />
    <meshStandardMaterial color="#70472d" />
  </mesh>

  <mesh position={[0, 2.5, 0]}>
    <boxGeometry args={[0.2, 0.15, 2.5]} />
    <meshStandardMaterial color="#70472d" />
  </mesh>

  {/* Cánh cửa */}
  
{/* Cánh cửa luôn mở */}
<group
  position={[0, 0, -1.1]}
  rotation={[0, -Math.PI / 2, 0]}
>
  {/* Cánh cửa */}
  <mesh position={[0, 1.2, 1.1]}>
    <boxGeometry args={[0.12, 2.4, 2.2]} />
    <meshStandardMaterial
      color="#a87b51"
      side={THREE.DoubleSide}
    />
  </mesh>
  

  {/* Tay nắm */}
  <mesh position={[0.09, 1.2, 1.85]}>
    <sphereGeometry args={[0.07, 12, 12]} />
    <meshStandardMaterial color="#d4af37" />
  </mesh>

  
</group>


{/* Biển nhấn để vào phòng trưng bày */}
<group position={[0, 1.5, 0]}>
  <mesh
    onClick={(e) => {
      e.stopPropagation();
      window.dispatchEvent(
        new Event("enter-second-room")
      );
    }}
    onPointerOver={() => {
      document.body.style.cursor = "pointer";
    }}
    onPointerOut={() => {
      document.body.style.cursor = "auto";
    }}
  >
    <boxGeometry args={[0.16, 0.6, 2.0]} />
    <meshStandardMaterial color="#681b1b" />
  </mesh>

  <Text
    position={[0.09, 0, 0]}
    rotation={[0, Math.PI / 2, 0]}
    fontSize={0.2}
    color="#ffe6a0"
    anchorX="center"
    anchorY="middle"
    maxWidth={1.8}
    textAlign="center"
  >
    PHÒNG TRƯNG BÀY
  </Text>
  <Text
  position={[-0.09, 0, 0]}
  rotation={[0, -Math.PI / 2, 0]}
  fontSize={0.2}
  color="#ffe6a0"
  anchorX="center"
  anchorY="middle"
  maxWidth={1.8}
  textAlign="center"
>
  SẢNH CHÍNH
</Text>
</group>


</group>



      {/* Tiêu đề */}
     {/* Biển tiêu đề trang trọng */}

<group position={[0, 4.8, -8.08]}>
  {/* Nền biển đỏ rượu vang */}
  <mesh castShadow receiveShadow>
    <boxGeometry args={[12.5, 1.05, 0.18]} />
    <meshStandardMaterial
      color="#571f29"
      metalness={0.12}
      roughness={0.55}
    />
  </mesh>

  {/* Viền vàng champagne */}
  <mesh position={[0, 0, 0.1]}>
    <boxGeometry args={[12.25, 0.84, 0.025]} />
    <meshStandardMaterial
      color="#c9a86a"
      metalness={0.3}
      roughness={0.42}
    />
  </mesh>

  {/* Mặt nền phía trong */}
  <mesh position={[0, 0, 0.12]}>
    <boxGeometry args={[12.15, 0.74, 0.025]} />
    <meshStandardMaterial
      color="#682630"
      metalness={0.08}
      roughness={0.62}
    />
  </mesh>

  {/* Chữ tiêu đề */}
  <Text
    position={[0, 0, 0.17]}
    fontSize={0.46}
    color="#ffe9b5"
    anchorX="center"
    anchorY="middle"
    maxWidth={11.8}
    textAlign="center"
    outlineWidth={0.003}
    outlineColor="#4b2021"
    letterSpacing={0.025}
    material-toneMapped={false}
  >
    KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH
  </Text>
</group>


      {/* Chân dung */}
     {/* Chân dung Bác Hồ */}
<group
  position={[-8, 2.65, -8.25]}
  onClick={(e) => {
    e.stopPropagation();
    window.dispatchEvent(new Event("open-portrait"));
  }}
>
        <mesh>
          <boxGeometry args={[4.5, 3.1, 0.18]} />
          <meshStandardMaterial color="#6e492d" />
        </mesh>
        <mesh position={[0, 0, 0.11]}>
  <planeGeometry args={[4.05, 2.65]} />
  <meshBasicMaterial
    map={useTexture(`${import.meta.env.BASE_URL}hinh-bac/1.jpg`)}
    toneMapped={false}
  />
</mesh>
        <Text
          position={[0, -2, 0.2]}
          fontSize={0.22}
          color="#3b281c"
          anchorX="center"
 outlineWidth={0.003}
  outlineColor="#3b281c"

        >
          CHỦ TỊCH HỒ CHÍ MINH
        </Text>
      </group>

      {/* Màn hình tư liệu */}
      <group
        position={[0, 2.7, -8.25]}
        onClick={() => onExhibit(exhibits[1])}
      >
        <mesh>
          <boxGeometry args={[5.2, 3.1, 0.25]} />
          <meshStandardMaterial color="#20242a" />
        </mesh>
        <mesh position={[0, 0, 0.14]}>
          <planeGeometry args={[4.7, 2.6]} />
          <meshStandardMaterial color="#273d4d" />
        </mesh>
        <Text
          position={[0, 0, 0.2]}
          fontSize={0.36}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          VIDEO TƯ LIỆU
        </Text>


        
      </group>

      {/* Tủ sách */}
      <group
        position={[8, 2.2, -8.1]}
        onClick={(e) => {
  e.stopPropagation();
  onOpenLibrary();
}}
      >
        <mesh>
          <boxGeometry args={[3.6, 4.3, 0.65]} />
          <meshStandardMaterial color="#71472d" />
        </mesh>

        {[0.8, 1.5, 2.2, 2.9].map((y) => (
          <mesh key={y} position={[0, -2.15 + y, 0.36]}>
            <boxGeometry args={[3.2, 0.09, 0.05]} />
            <meshStandardMaterial color="#432b1c" />
          </mesh>
        ))}

        {[...Array(16)].map((_, i) => (
          <mesh
            key={i}
            position={[
              -1.35 + (i % 8) * 0.38,
              -1.65 + Math.floor(i / 8) * 1.4,
              0.42,
            ]}
          >
            <boxGeometry args={[0.25, 1, 0.08]} />
            <meshStandardMaterial
              color={i % 2 ? "#a87b51" : "#486b72"}
            />
          </mesh>
        ))}
      </group>

      {/* Tủ trưng bày */}
     

      {/* Bàn */}
     
{/* Bàn */}
<group position={[10, 0, 1.5]}>
  {/* Mặt bàn */}
  <mesh position={[0, 1.15, 0]} castShadow>
    <boxGeometry args={[1.25, 0.18, 2.6]} />
    <meshStandardMaterial color="#70472d" />
  </mesh>

  {/* 4 chân bàn */}
  {[
    [-0.45, 0.55, -1],
    [0.45, 0.55, -1],
    [-0.45, 0.55, 1],
    [0.45, 0.55, 1],
  ].map((p, i) => (
    <mesh key={i} position={p}>
      <boxGeometry args={[0.13, 1.1, 0.13]} />
      <meshStandardMaterial color="#553522" />
    </mesh>
  ))}
</group>


      {/* Cây */}
      <group position={[9, 0, 5]}>
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[0.28, 0.38, 2, 16]} />
          <meshStandardMaterial color="#9b633b" />
        </mesh>
        <mesh position={[0, 2.5, 0]}>
          <sphereGeometry args={[1.1, 16, 12]} />
          <meshStandardMaterial color="#4e7750" />
        </mesh>
      </group>

      {/* Ánh sáng */}
      {[-7, 0, 7].map((x) => (
        <group key={x} position={[x, 5.15, -2]}>
          <mesh>
            <cylinderGeometry args={[0.35, 0.35, 0.15, 24]} />
            <meshStandardMaterial color="#d6b76d" />
          </mesh>
          <pointLight position={[0, -0.2, 0]} intensity={20} distance={9} />
        </group>
      ))}
       {/* Chữ KHU TRƯNG BÀY gắn trên vách tường bên phải */}




<group
  position={[11.78, 2.7, 1.5]}
  rotation={[0, -Math.PI / 2, 0]}
  onClick={(e) => {
    e.stopPropagation();
    onOpenMuseum();
  }}
  onPointerOver={(e) => {
    e.stopPropagation();
    document.body.style.cursor = "pointer";
  }}
  onPointerOut={() => {
    document.body.style.cursor = "default";
  }}
>
  <mesh>
    <boxGeometry args={[3.2, 0.65, 0.08]} />
    <meshStandardMaterial
      color="#5c1717"
      metalness={0.25}
      roughness={0.5}
    />
  </mesh>

  <Text
    position={[0, 0, 0.055]}
    fontSize={0.27}
    color="#ffd700"
    anchorX="center"
    anchorY="middle"
    textAlign="center"
  >
    BẢO TÀNG 3D
  </Text>
</group>



    </group>

  
  );
}




function NavigationMarkers({ current, onMove }) {
  const signs = [
   { id: 0, position: [0, 0, 4.2] },
    { id: 1, position: [-3.5, 0, 1.2] },
    { id: 2, position: [0, 0, 1.2] },
    { id: 3, position: [3.5, 0, 1.2] },
    { id: 4, position: [5, 0, 2.7] },
  ];

  return (
    <group>
    {signs.map((sign) => (
        <ArrowMarker
          key={sign.id}
          position={sign.position}
          label={spots[sign.id].name}
          onClick={() => onMove(sign.id)}
        />
      ))}
    </group>
  );
}


function Scene({ spotIndex, onMove, onExhibit, onSpaceClick, room2Active, activeSpace, onSpaceArrive, onOpenChuS, }) {
 

  return (
    <>
      <color attach="background" args={["#b9d2e3"]} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[4, 8, 5]} intensity={2} castShadow />

   <Room
  onExhibit={onExhibit}
  onSpaceClick={onSpaceClick}
  onOpenChuS={onOpenChuS}
  onOpenLibrary={() => window.dispatchEvent(new Event("open-library"))}
  onOpenMuseum={() =>
    window.open(
      "https://hochiminh.vn/bao-tang-3d",
      "_blank",
      "noopener,noreferrer"
    )
  }
/>
      {room2Active && (
  <SecondRoom onSpaceClick={onSpaceClick} />
)}
      <NavigationMarkers current={spotIndex} onMove={onMove} />

     <CameraView
  spots={spots}
  spotIndex={spotIndex}
  room2Active={room2Active}
  activeSpace={activeSpace}
  onSpaceArrive={onSpaceArrive}
/>
<FixedLookControls />
    
      <Environment preset="city" />
    </>
  );
}








export default function App() {
  const [room2Active, setRoom2Active] = useState(false);
  const [activeSpace, setActiveSpace] = useState(null);
const [navCollapsed, setNavCollapsed] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [userName, setUserName] = useState("");
const [userAge, setUserAge] = useState("");
const [userGender, setUserGender] = useState("");
const [showWelcome, setShowWelcome] = useState(false);
  const [started, setStarted] = useState(false);
  const [visitor, setVisitor] = useState({
    name: "",
    ageGroup: "",
    gender: "Nam",
  });
  const audioRef = useRef(null);
    const [musicPlaying, setMusicPlaying] = useState(false);
const [musicTitle, setMusicTitle] = useState("");
  const [error, setError] = useState("");
  const [spotIndex, setSpotIndex] = useState(0);
  const [selectedExhibit, setSelectedExhibit] = useState(null);
const [showMap, setShowMap] = useState(false);
const [showPDF, setShowPDF] = useState(false);
const [showPadlet, setShowPadlet] = useState(false);
const [showBook1, setShowBook1] = useState(false);
const [showMuseum3D, setShowMuseum3D] = useState(false);
const [showLibrary, setShowLibrary] = useState(false);
const [showPortraitSlideshow, setShowPortraitSlideshow] = useState(false);
const [activePortrait, setActivePortrait] = useState(1);
const [activeChuS, setActiveChuS] = useState(0);

useEffect(() => {
  const openPortrait = () => {
    setActivePortrait(1);
    setShowPortraitSlideshow(true);
  };

  window.addEventListener("open-portrait", openPortrait);

  return () => {
    window.removeEventListener("open-portrait", openPortrait);
  };
}, []);

useEffect(() => {
  const openLibrary = () => setShowLibrary(true);
  window.addEventListener("open-library", openLibrary);

  return () => {
    window.removeEventListener("open-library", openLibrary);
  };
}, []);

useEffect(() => {
 
  
const enter = () => {
  if (window.robotVoiceAudio) {
    window.robotVoiceAudio.pause();
    window.robotVoiceAudio.currentTime = 0;
  }

  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }
  setMusicPlaying(false);

  setRoom2Active(true);
  setActiveSpace(null);
  setSelectedSpace(null);
  setSelectedExhibit(null);
  setShowMap(false);

  const voice = new Audio(
    `${import.meta.env.BASE_URL}voice/room2voice.mp3`
  );
  window.robotVoiceAudio = voice;
  voice.play().catch(console.error);
};


const leave = () => {
  setRoom2Active(false);
  setActiveSpace(null);
  setSelectedSpace(null);
  setSelectedExhibit(null);
  setShowMap(false);
  setSpotIndex(0);
  setPreviousSpotIndex(0);
};

  window.addEventListener("enter-second-room", enter);
  window.addEventListener("leave-second-room", leave);

  return () => {
    window.removeEventListener("enter-second-room", enter);
    window.removeEventListener("leave-second-room", leave);
  };
}, []);


useEffect(() => {
  const openMap = () => setShowMap(true);

  window.addEventListener("open-map", openMap);

  return () => {
    window.removeEventListener("open-map", openMap);
  };
}, []);
  const [previousSpotIndex, setPreviousSpotIndex] = useState(0);

const moveToSpot = (nextIndex) => {
  if (nextIndex === spotIndex) return;

  setPreviousSpotIndex(spotIndex);
  setSpotIndex(nextIndex);
};

// Chọn một gian trưng bày
//const handleSelectSpace = (space) => {
 //if (room2Active && activeSpace?.id === space.id) {
 //  setSelectedSpace(space);
 //   return;
  //}

  //setSelectedSpace(null);
 /// setActiveSpace(space);
 // setRoom2Active(true);
//};

//const handleSelectSpace = (space) => {
  //setSelectedSpace(null);
  //setActiveSpace(space);
  //setRoom2Active(true);

 // if (space.id === 1) {
   // setShowPDF(true);
 // } else {
 //   setShowPDF(false);
 // }
//};



const handleSelectSpace = (space) => {
  setShowPDF(false);
  setShowPadlet(false);
  setSelectedSpace(space);
  setActiveSpace(space);
  setRoom2Active(true);
};



// Chọn một vị trí trong phòng đầu
const handleNavigateSpot = (index) => {
  setSelectedSpace(null);
  setActiveSpace(null);
  setRoom2Active(false);

 if (index === 4) {
  window.open(
    "https://hochiminh.vn/bao-tang-3d",
    "_blank",
    "noopener,noreferrer"
  );
  return;
}

  setShowMuseum3D(false);
  moveToSpot(index);
};
const returnToPreviousSpot = () => {
  setRoom2Active(false);
  setActiveSpace(null);
  setSelectedSpace(null);
  setSelectedExhibit(null);
  setSpotIndex(0);
  setPreviousSpotIndex(0);
};

  const [showLocationNotice, setShowLocationNotice] = useState(false);
  useEffect(() => {
  setShowLocationNotice(spotIndex !== 0);
}, [spotIndex]);

  const submit = (e) => {
  e.preventDefault();

  if (!visitor.name.trim() || !visitor.ageGroup || !visitor.gender) {
    setError("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  setError("");
  setStarted(true);

  // Phát nhạc theo nhóm tuổi ngay sau khi người tham quan bấm bắt đầu.
  const musicByAge = {
    under15: `${import.meta.env.BASE_URL}images/audio/under.mp3`,
    age15to34: `${import.meta.env.BASE_URL}images/audio/15-35.mp3`,
    age35plus: `${import.meta.env.BASE_URL}images/audio/35.mp3`,
  };
  console.log("Đường dẫn nhạc:", musicByAge);
  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current = null;
  }

const startTime = {
  under15: 17,
  age15to34: 17,
  age35plus: 30,
};

const titles = {
  under15: "Nhạc dành cho người dưới 15 tuổi",
  age15to34: "Nhạc dành cho người từ 15 đến dưới 35 tuổi",
  age35plus: "Nhạc dành cho người từ 35 tuổi trở lên",
};

if (audioRef.current) {
  audioRef.current.pause();
}

const audio = new Audio(musicByAge[visitor.ageGroup]);
const start = startTime[visitor.ageGroup] ?? 0;

audio.volume = 0.45;
audio.preload = "auto";
audioRef.current = audio;

setMusicTitle(titles[visitor.ageGroup] ?? "Nhạc nền");

audio.addEventListener("loadedmetadata", () => {
  audio.currentTime = Math.min(start, audio.duration);
});

audio.addEventListener("ended", () => {
  audio.currentTime = start;
  audio.play().catch(console.warn);
});

audio.addEventListener("playing", () => setMusicPlaying(true));
audio.addEventListener("pause", () => setMusicPlaying(false));

audio.play().catch((err) => {
  console.warn("Không thể tự phát nhạc:", err);
});

// Hết nhạc thì phát lại từ đúng mốc thời gian
audio.addEventListener("ended", () => {
  audio.currentTime = start;
  audio.play().catch((err) => {
    console.warn("Không thể phát lại nhạc:", err);
  });
});
};
  if (!started) {
    return (
      <div className="welcome-page">
        <div className="welcome-card">
          <div className="welcome-badge">KHÔNG GIAN VĂN HÓA</div>
          <h1>Hồ Chí Minh</h1>
          <p className="welcome-description">
            Chào mừng bạn đến với không gian tham quan 3D.
            Hãy nhập thông tin để bắt đầu chuyến tham quan.
          </p>

          <form onSubmit={submit} className="visitor-form">
            <label>
              Họ và tên
              <input
                value={visitor.name}
                onChange={(e) =>
                  setVisitor({ ...visitor, name: e.target.value })
                }
                placeholder="Nhập họ và tên"
              />
            </label>

            <label>
              Nhóm độ tuổi
              <select
                value={visitor.ageGroup}
                onChange={(e) =>
                  setVisitor({ ...visitor, ageGroup: e.target.value })
                }
              >
                <option value="">-- Chọn nhóm độ tuổi --</option>
                <option value="under15">Dưới 15 tuổi</option>
                <option value="age15to34">Từ 15 đến dưới 35 tuổi</option>
                <option value="age35plus">Từ 35 tuổi trở lên</option>
              </select>
            </label>


            <label>
              Giới tính
              <select
                value={visitor.gender}
                onChange={(e) =>
                  setVisitor({ ...visitor, gender: e.target.value })
                }
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </label>

            {error && <div className="form-error">{error}</div>}

            <button type="submit" className="start-button">
              BẮT ĐẦU THAM QUAN
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app">

  <RobotGuide
  active={started}
  visitor={visitor}
  audioRef={audioRef}
/>
  <div
  style={{
  position: "fixed",
  top: 150,
  left: 16,
  zIndex: 1000,
  background: "rgba(20, 30, 45, 0.92)",
  color: "white",
  padding: "8px 10px",
  borderRadius: 10,
  minWidth: 305,
  boxSizing: "border-box",
  boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
}}
>
  <div style={{ fontWeight: "bold", marginBottom: 8 }}>
    🎵 Nhạc nền tham quan
  </div>

  <div style={{ fontSize: 13, marginBottom: 10 }}>
    {musicTitle || "Chưa chọn nhạc"}
  </div>

  <button
    onClick={() => {
      const audio = audioRef.current;
      if (!audio) return;

      if (audio.paused) {
        if (audio.ended) {
          const startTime = {
            under15: 17,
            age15to34: 17,
            age35plus: 30,
          };

          audio.currentTime =
            startTime[visitor.ageGroup] ?? 0;
        }

        audio.play().catch(console.warn);
      } else {
        audio.pause();
      }
    }}
    style={{
  padding: "5px 10px",
  fontSize: 12,
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: "bold",
}}
  >
    {musicPlaying ? "⏸ Tạm dừng" : "▶ Phát nhạc"}
  </button>
</div>
      <Canvas
        camera={{
          position: [0, 1.6, 6.5],
          fov: 65,
          near: 0.1,
          far: 100,
        }}
      >
        <Scene
  spotIndex={spotIndex}
  onMove={moveToSpot}
  onExhibit={setSelectedExhibit}
  onSpaceClick={handleSelectSpace}
  room2Active={room2Active}
  activeSpace={activeSpace}
  onSpaceArrive={setSelectedSpace}
    onOpenChuS={setActiveChuS}
/>
       
      </Canvas>

{/* DANH SÁCH ĐIỀU HƯỚNG 13 MỤC */}
<div className={`navigation-panel ${navCollapsed ? "collapsed" : ""}`}>
  <button
    className="navigation-toggle"
    onClick={() => setNavCollapsed(!navCollapsed)}
    title={navCollapsed ? "Mở danh mục" : "Thu gọn danh mục"}
  >
    <span>☰</span>
    {!navCollapsed && <span>Danh mục tham quan</span>}
    <span>{navCollapsed ? "›" : "‹"}</span>
  </button>

  {!navCollapsed && (
    <div className="navigation-content">
      <div className="navigation-heading">
        PHÒNG 1 · SẢNH CHÍNH
      </div>

      {spots.map((spot) => (
        <button
          key={`spot-${spot.id}`}
          className={`navigation-item ${
            !room2Active && spotIndex === spot.id ? "active" : ""
          }`}
          onClick={() => handleNavigateSpot(spot.id)}
        >
          <span className="navigation-number">{spot.id + 1}</span>
          <span>{spot.name}</span>
        </button>
      ))}

      <div className="navigation-heading">
        PHÒNG 2 · TRƯNG BÀY CHUYÊN ĐỀ
      </div>

      {spaces.map((space) => (
        <button
          key={`space-${space.id}`}
          className={`navigation-item ${
            activeSpace?.id === space.id ? "active" : ""
          }`}
          onClick={() => handleSelectSpace(space)}
        >
          <span className="navigation-number">{space.id + 5}</span>
          <span>{space.title}</span>
        </button>
      ))}
    </div>
  )}
</div>


{showPDF && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 5000,
      background: "rgba(0,0,0,0.8)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    }}
  >
    <div
      style={{
        width: "95vw",
        height: "90vh",
        background: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <button
        onClick={() => setShowPDF(false)}
        style={{ padding: 12, cursor: "pointer" }}
      >
        ✕ Đóng tài liệu
      </button>

      <iframe
        src={`${import.meta.env.BASE_URL}doc/Phòng 1_Tóm tắt tiểu sử và sự nghiệp của Chủ tịch Hồ Chí Minh.pdf`}
        title="Tiểu sử và cuộc đời Chủ tịch Hồ Chí Minh"
        style={{ width: "100%", flex: 1, border: 0 }}
      />
    </div>
  </div>
)}


{showPadlet && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 6000,
      background: "rgba(0,0,0,0.8)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
    }}
  >
    <div
      style={{
        width: "95vw",
        height: "92vh",
        background: "#fff",
        borderRadius: 12,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <button
        onClick={() => setShowPadlet(false)}
        style={{
          padding: "12px 18px",
          border: "none",
          cursor: "pointer",
          textAlign: "right",
          fontSize: 16,
        }}
      >
        ✕ Đóng Padlet
      </button>

      <iframe
        src="https://padlet.com/embed/ij4p9ovbesqr7jzp"
        title="Hành trình theo dấu chân Bác"
        allow="camera; microphone; geolocation; display-capture; clipboard-write"
        style={{
          width: "100%",
          flex: 1,
          border: 0,
        }}
      />
    </div>
  </div>
)}


{selectedSpace && selectedSpace.id !== 3 && (
  <div
    onClick={() => setSelectedSpace(null)}
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 3000,
      background: "rgba(0,0,0,0.75)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        width: "min(850px, 95vw)",
        minHeight: 400,
        background: "#f5f0e5",
        border: "5px solid #80552f",
        borderRadius: 12,
        padding: 28,
        color: "#38271c",
        position: "relative",
      }}
    >
      <button
        onClick={() => setSelectedSpace(null)}
        style={{
          position: "absolute",
          right: 12,
          top: 12,
          fontSize: 22,
          cursor: "pointer",
        }}
      >
        ✕
      </button>

      <h2 style={{ color: "#7c2929", paddingRight: 35 }}>
        {selectedSpace.title}
      </h2>

      <p>{selectedSpace.description}</p>

      <div
        style={{
          minHeight: 230,
          border: "2px dashed #b49a78",
          borderRadius: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: 20,
          background: "#e9e0d0",
        }}
      >
       
<button
  onClick={() => {
    if (selectedSpace.id === 1) {
      setShowPDF(true);
      setSelectedSpace(null);
    } else if (selectedSpace.id === 2) {
      setShowPadlet(true);
      setSelectedSpace(null);
    }
  }}
  style={{
    fontSize: 42,
    color: "#7c2929",
    background: "transparent",
    border: "none",
    cursor: "pointer",
  }}
>
  ➜
</button>
<h3>KHU VỰC TƯ LIỆU</h3>

        
      </div>
    </div>
  </div>
)}

{selectedSpace?.id === 3 && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 4000,
      background: "#f5f0e6",
      overflowY: "auto",
      padding: 30,
      color: "#38271c",
    }}
  >
    <button
  onClick={() => setSelectedSpace(null)}
  style={{
    padding: "10px 18px",
    border: "1px solid #c8b99f",
    borderRadius: 10,
    background: "#315c50",
    color: "#fff",
    fontSize: 15,
    cursor: "pointer",
    boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
  }}
>
  ← Quay lại không gian văn hoá
</button>
    <h2>THƯ VIỆN SÁCH VỀ BÁC HỒ</h2>

    

<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(4, 250px)",
    justifyContent: "center",
    gap: 24,
  }}
>
  {Array.from({ length: 16 }, (_, i) => {
    const so = i + 1;

    return (
      <div
        key={so}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform =
            "translateY(-6px) scale(1.02)";
          e.currentTarget.style.boxShadow = "0 12px 28px #0004";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0) scale(1)";
          e.currentTarget.style.boxShadow = "0 5px 18px #0002";
        }}
        style={{
          width: 250,
          cursor: "pointer",
          textAlign: "center",
          padding: 12,
          borderRadius: 14,
          background: "#fffaf0",
          boxShadow: "0 5px 18px #0002",
          transition: "all 0.25s ease",
          transform: "translateY(0) scale(1)",
        }}
      >
        <img
          src={`${import.meta.env.BASE_URL}pic room3/${so}.png`}
          alt={`Bìa sách số ${so}`}
          style={{
            width: "100%",
            height: 320,
            objectFit: "contain",
            borderRadius: 8,
          }}
        />

        <p style={{ fontWeight: 600, color: "#6b351f" }}>
          Cuốn sách {so}
        </p>

        <button
          onClick={() =>
            window.open(
              so === 1
                ? "https://stbook.vn/read_book/926a2cd110ef4786b319a5aa341f4459/1131"
                : "https://",
              "_blank",
              "noopener,noreferrer"
            )
          }
          style={{
            width: "100%",
            padding: "11px 14px",
            border: "none",
            borderRadius: 24,
            background: "linear-gradient(135deg, #8b1e1e, #c0392b)",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 4px 10px #0003",
            transition: "all 0.25s ease",
          }}
        >
          📖 Đọc sách online →
        </button>
      </div>
    );
  })}
</div>


  </div>
)}





{showMuseum3D && (
  <div style={{
    position: "fixed",
    inset: 0,
    zIndex: 99999,
    background: "#fff",
  }}>
    <button
      onClick={() => setShowMuseum3D(false)}
      style={{ padding: 12, cursor: "pointer" }}
    >
      ✕ Đóng bảo tàng
    </button>

    <iframe
      src="https://hochiminh.vn/bao-tang-3d"
      title="Bảo tàng 3D"
      style={{
        width: "100%",
        height: "calc(100vh - 50px)",
        border: 0,
      }}
    />
  </div>
)}


{showPortraitSlideshow && (
  <div
    onClick={() => setShowPortraitSlideshow(false)}
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 10000,
      background: "rgba(20, 16, 12, 0.96)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "24px 20px",
      boxSizing: "border-box",
      overflowY: "auto",
      color: "#ffe6a0",
    }}
  >
    <style>{`
      @keyframes portraitMainEnter {
        from {
          opacity: 0;
          transform: scale(0.94) translateY(12px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }

      @keyframes portraitThumbEnter {
        from {
          opacity: 0.4;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .portrait-main-image {
        animation: portraitMainEnter 0.45s ease both;
      }

      .portrait-thumb {
        animation: portraitThumbEnter 0.35s ease both;
        transition: transform 0.25s ease, border-color 0.25s ease;
      }

      .portrait-thumb:hover {
        transform: translateY(-5px) scale(1.04);
      }

      .portrait-thumbnails {
        display: flex;
        gap: 10px;
        justify-content: center;
        width: 100%;
        overflow-x: auto;
        padding: 12px 4px 18px;
        box-sizing: border-box;
      }

      .portrait-thumbnails::-webkit-scrollbar {
        height: 7px;
      }

      .portrait-thumbnails::-webkit-scrollbar-thumb {
        background: #9c7848;
        border-radius: 10px;
      }

      @media (max-width: 600px) {
        .portrait-main-image {
          max-height: 48vh !important;
        }
      }
    `}</style>

    <button
      onClick={(e) => {
        e.stopPropagation();
        setShowPortraitSlideshow(false);
      }}
      style={{
        alignSelf: "flex-end",
        border: "1px solid #c5a66c",
        borderRadius: 8,
        padding: "9px 16px",
        background: "#681b1b",
        color: "#fff",
        cursor: "pointer",
        fontSize: 16,
      }}
    >
      ✕ Đóng
    </button>

    <h2 style={{ textAlign: "center", margin: "8px 0 18px" }}>
      HÌNH ẢNH VỀ BÁC HỒ KÍNH YÊU
    </h2>

    <div
      key={activePortrait}
      className="portrait-main-image"
      onClick={(e) => e.stopPropagation()}
      style={{
        flex: "0 1 auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        minHeight: 0,
      }}
    >
      <img
        src={`${import.meta.env.BASE_URL}hinh-bac/${activePortrait}.${activePortrait === 1 ? "jpg" : "jpeg"}`}
        alt={`Hình ảnh về Bác Hồ ${activePortrait}`}
        style={{
          display: "block",
          maxWidth: "90vw",
          maxHeight: "58vh",
          width: "auto",
          height: "auto",
          objectFit: "contain",
          border: "5px solid #b18a4e",
          borderRadius: 8,
          boxShadow: "0 12px 40px #0009",
        }}
      />
    </div>

    <p style={{ margin: "14px 0 4px", fontSize: 15 }}>
      Hình {activePortrait} / 12
    </p>

    <div
      className="portrait-thumbnails"
      onClick={(e) => e.stopPropagation()}
    >
      {Array.from({ length: 12 }, (_, i) => i + 1)
        .filter((n) => n !== activePortrait)
        .map((n) => (
          <button
            key={n}
            className="portrait-thumb"
            onClick={() => setActivePortrait(n)}
            title={`Xem hình ${n}`}
            style={{
              flex: "0 0 105px",
              height: 115,
              padding: 4,
              cursor: "pointer",
              background: "#35291e",
              border: "2px solid #9c7848",
              borderRadius: 8,
              boxShadow: "0 3px 10px #0005",
            }}
          >
            <img
              src={`${import.meta.env.BASE_URL}hinh-bac/${n}.${n === 1 ? "jpg" : "jpeg"}`}
              alt={`Hình ${n}`}
              loading="lazy"
              style={{
                width: "100%",
                height: 82,
                objectFit: "contain",
              }}
            />
            <span style={{ color: "#ffe6a0", fontSize: 13 }}>
              Hình {n}
            </span>
          </button>
        ))}
    </div>
  </div>
)}



{activeChuS > 0 && (
  <div
    onClick={() => setActiveChuS(0)}
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 10001,
      background: "rgba(20,16,12,0.96)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "24px 20px",
      boxSizing: "border-box",
      overflowY: "auto",
      color: "#ffe6a0",
    }}
  >
    <button
      onClick={(e) => {
        e.stopPropagation();
        setActiveChuS(0);
      }}
      style={{
        alignSelf: "flex-end",
        padding: "9px 16px",
        background: "#681b1b",
        color: "#fff",
        cursor: "pointer",
      }}
    >
      ✕ Đóng
    </button>

    <h2>HÌNH ẢNH TRƯNG BÀY CHỮ S</h2>

    <img
      src={`${import.meta.env.BASE_URL}hinh-bac/${activeChuS}.${activeChuS === 1 ? "jpg" : "jpeg"}`}
      alt={`Hình ${activeChuS}`}
      onClick={(e) => e.stopPropagation()}
      style={{
        maxWidth: "90vw",
        maxHeight: "55vh",
        objectFit: "contain",
        border: "5px solid #b18a4e",
        borderRadius: 8,
        boxShadow: "0 12px 40px #0009",
      }}
    />

    <p>Hình {activeChuS} / 10</p>

    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 10,
      }}
    >
      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          onClick={() => setActiveChuS(n)}
          style={{
            width: 100,
            padding: 5,
            cursor: "pointer",
            background: "#35291e",
            color: "#ffe6a0",
            border: n === activeChuS
              ? "3px solid gold"
              : "2px solid #9c7848",
            borderRadius: 8,
          }}
        >
          <img
            src={`${import.meta.env.BASE_URL}hinh-bac/${n}.${n === 1 ? "jpg" : "jpeg"}`}
            alt={`Hình ${n}`}
            style={{
              width: "100%",
              height: 70,
              objectFit: "contain",
            }}
          />
          Hình {n}
        </button>
      ))}
    </div>
  </div>
)}



{showMap && (
  <div
    onClick={() => setShowMap(false)}
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 2000,
      background: "rgba(0, 0, 0, 0.9)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      cursor: "zoom-out",
    }}
  >
    <button
      onClick={(e) => {
        e.stopPropagation();
        setShowMap(false);
      }}
      style={{
        position: "absolute",
        top: "20px",
        right: "24px",
        fontSize: "28px",
        color: "white",
        background: "#333",
        border: "none",
        borderRadius: "8px",
        padding: "6px 14px",
        cursor: "pointer",
      }}
    >
      ✕
    </button>

    <img
      src={`${import.meta.env.BASE_URL}images/bandoVN.jpg`}
      alt="Bản đồ Việt Nam"
      onClick={(e) => e.stopPropagation()}
      style={{
        maxWidth: "95vw",
        maxHeight: "90vh",
        objectFit: "contain",
        borderRadius: "8px",
      }}
    />
  </div>
)}
     <button
  className="return-button"
  onClick={returnToPreviousSpot}
  disabled={spotIndex === 0 && !room2Active}
>
    ↩ Quay về lối vào
</button>




      <div className="top-info">
        <strong>Không gian văn hóa Hồ Chí Minh</strong>
{visitor.name && (
  <p>
    Xin chào {visitor.ageGroup === "under15"
      ? "em"
      : visitor.ageGroup === "age15to34"
        ? "bạn"
        : "anh/chị"} {visitor.name}!
    <br />
    Nhóm độ tuổi: {visitor.ageGroup === "under15"
      ? "Dưới 15 tuổi"
      : visitor.ageGroup === "age15to34"
        ? "Từ 15 đến dưới 35 tuổi"
        : "Từ 35 tuổi trở lên"}
  </p>
)}
      </div>

      <div className="controls">
        <div>🖱 Kéo chuột: Xoay góc nhìn 360°</div>
        <div>📍 Nhấp biển chỉ dẫn: Di chuyển đến khu vực</div>
        <div>Vị trí: {spots[spotIndex].name}</div>
      </div>


{/**ROOM 1 */}
{(selectedSpace?.id === 3 || showLibrary) && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 4000,
      background: "#f5f0e6",
      overflowY: "auto",
      padding: 30,
      color: "#38271c",
    }}
  >
    <button
onClick={() => {
  setSelectedSpace(null);
  setShowLibrary(false);
}}
  style={{
    padding: "10px 18px",
    border: "1px solid #c8b99f",
    borderRadius: 10,
    background: "#315c50",
    color: "#fff",
    fontSize: 15,
    cursor: "pointer",
    boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
  }}
>
  ← Quay lại không gian văn hoá
</button>
    <h2>THƯ VIỆN SÁCH VỀ BÁC HỒ</h2>

    

<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(4, 250px)",
    justifyContent: "center",
    gap: 24,
  }}
>
  {Array.from({ length: 16 }, (_, i) => {
    const so = i + 1;

    return (
      <div
        key={so}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform =
            "translateY(-6px) scale(1.02)";
          e.currentTarget.style.boxShadow = "0 12px 28px #0004";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0) scale(1)";
          e.currentTarget.style.boxShadow = "0 5px 18px #0002";
        }}
        style={{
          width: 250,
          cursor: "pointer",
          textAlign: "center",
          padding: 12,
          borderRadius: 14,
          background: "#fffaf0",
          boxShadow: "0 5px 18px #0002",
          transition: "all 0.25s ease",
          transform: "translateY(0) scale(1)",
        }}
      >
        <img
          src={`${import.meta.env.BASE_URL}pic room3/${so}.png`}
          alt={`Bìa sách số ${so}`}
          style={{
            width: "100%",
            height: 320,
            objectFit: "contain",
            borderRadius: 8,
          }}
        />

        <p style={{ fontWeight: 600, color: "#6b351f" }}>
          Cuốn sách {so}
        </p>

        <button
          onClick={() =>
            window.open(
              so === 1
                ? "https://stbook.vn/read_book/926a2cd110ef4786b319a5aa341f4459/1131"
                : "https://",
              "_blank",
              "noopener,noreferrer"
            )
          }
          style={{
            width: "100%",
            padding: "11px 14px",
            border: "none",
            borderRadius: 24,
            background: "linear-gradient(135deg, #8b1e1e, #c0392b)",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 4px 10px #0003",
            transition: "all 0.25s ease",
          }}
        >
          📖 Đọc sách online →
        </button>
      </div>
    );
  })}
</div>


  </div>
)}




      {selectedExhibit && (
        <div className="exhibit-info" style={{ pointerEvents: "auto", zIndex: 1000 }}>
          <button
            className="close-exhibit"
            onClick={() => {
  setSelectedExhibit(null);
  setSpotIndex(0);
}}
          >
            ✕
          </button>

          <div className="exhibit-title">
            {selectedExhibit.title}
          </div>

          <div className="exhibit-description">
            {selectedExhibit.description}
          </div>
        </div>
      )}
    </div>
  );
    
} 
