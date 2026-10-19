
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, OrbitControls, Text, useTexture } from "@react-three/drei";
import * as THREE from "three";
import "./style.css";

const ROOM = { width: 24, depth: 18, height: 5.5 };

export const CONTENT_LIST = [
    // 5 vị trí tham quan
  { id: 1, name: "Lối vào", type: "spot" },
  { id: 2, name: "Chân dung Bác Hồ", type: "spot" },
  { id: 3, name: "Video tư liệu", type: "spot" },
  { id: 4, name: "Tủ sách", type: "spot" },
  { id: 5, name: "Khu trưng bày", type: "spot" },

    // 8 thẻ nội dung trưng bày
  { id: 6, name: "Cuộc đời và sự nghiệp", type: "space" },
  { id: 7, name: "Tư tưởng Hồ Chí Minh", type: "space" },
  { id: 8, name: "Đạo đức và phong cách", type: "space" },
  { id: 9, name: "Bác Hồ với thiếu nhi", type: "space" },
  { id: 10, name: "Bác Hồ với miền Nam", type: "space" },
  { id: 11, name: "Di sản và tác phẩm", type: "space" },
  { id: 12, name: "Học tập và làm theo Bác", type: "space" },
  { id: 13, name: "Tư liệu lịch sử", type: "space" },
];


const spots = [
  { id: 0, name: "Lối vào", position: [0, 1.6, 6.5] },
  { id: 1, name: "Chân dung Bác Hồ", position: [-8.5, 1.6, -3] },
  { id: 2, name: "Video tư liệu", position: [0, 1.6, 0] },
  { id: 3, name: "Tủ sách", position: [8.5, 1.6, -3] },
  { id: 4, name: "Khu trưng bày", position: [5, 1.6, 1.5] },
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
    title: "Khu trưng bày",
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

  // Camera đứng trong lối đi chính giữa,
  // đối diện gian được chọn
  destination.current.set(
    -22 + (x < 0 ? -2.5 : 2.5),
    1.6,
    5.75 + z
  );

  lookTarget.current.set(
    -22 + x,
    1.5,
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
    title: "CUỘC ĐỜI VÀ SỰ NGHIỆP",
    description: "Tư liệu về cuộc đời và sự nghiệp của Chủ tịch Hồ Chí Minh.",
    position: [-5.2, 0, -4.8],
    rotation: Math.PI / 2,
    color: "#7c2929",
  },
  {
    id: 2,
    title: "TƯ TƯỞNG HỒ CHÍ MINH",
    description: "Không gian tìm hiểu tư tưởng Hồ Chí Minh.",
    position: [-5.2, 0, -1.6],
    rotation: Math.PI / 2,
    color: "#805b32",
  },
  {
    id: 3,
    title: "ĐẠO ĐỨC VÀ PHONG CÁCH",
    description: "Tư liệu về đạo đức và phong cách Hồ Chí Minh.",
    position: [-5.2, 0, 1.6],
    rotation: Math.PI / 2,
    color: "#315c50",
  },
  {
    id: 4,
    title: "BÁC HỒ VỚI THIẾU NHI",
    description: "Hình ảnh và câu chuyện về tình cảm của Bác với thiếu nhi.",
    position: [-5.2, 0, 4.8],
    rotation: Math.PI / 2,
    color: "#365d83",
  },
  {
    id: 5,
    title: "BÁC HỒ VỚI MIỀN NAM",
    description: "Tư liệu về tình cảm của Bác dành cho đồng bào miền Nam.",
    position: [5.2, 0, -4.8],
    rotation: -Math.PI / 2,
    color: "#365d83",
  },
  {
    id: 6,
    title: "DI SẢN VÀ TÁC PHẨM",
    description: "Không gian giới thiệu tác phẩm và di sản của Bác.",
    position: [5.2, 0, -1.6],
    rotation: -Math.PI / 2,
    color: "#315c50",
  },
  {
    id: 7,
    title: "HỌC TẬP VÀ LÀM THEO BÁC",
    description: "Các câu chuyện và tư liệu học tập theo gương Bác.",
    position: [5.2, 0, 1.6],
    rotation: -Math.PI / 2,
    color: "#805b32",
  },
  {
    id: 8,
    title: "TƯ LIỆU LỊCH SỬ",
    description: "Không gian lưu trữ hình ảnh, video và tư liệu lịch sử.",
    position: [5.2, 0, 4.8],
    rotation: -Math.PI / 2,
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
            fontSize={0.135}
            color="#ffe6a0"
            anchorX="center"
            anchorY="middle"
            maxWidth={1.9}
            textAlign="center"
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



      
</group>

{/* Cửa nối phòng 2 với phòng 1 */}
<group position={[-22, 0, -1.1]}>
  {/* Khung cửa trái */}
  <mesh position={[-1.2, 1.25, 0]}>
    <boxGeometry args={[0.15, 2.5, 0.2]} />
    <meshStandardMaterial color="#70472d" />
  </mesh>

  {/* Khung cửa phải */}
  <mesh position={[1.2, 1.25, 0]}>
    <boxGeometry args={[0.15, 2.5, 0.2]} />
    <meshStandardMaterial color="#70472d" />
  </mesh>

  {/* Thanh ngang trên cửa */}
  <mesh position={[0, 2.5, 0]}>
    <boxGeometry args={[2.5, 0.15, 0.2]} />
    <meshStandardMaterial color="#70472d" />
  </mesh>

  {/* Cánh cửa mở sang bên */}
  <mesh position={[-1.05, 1.2, 0.08]}>
    <boxGeometry args={[0.12, 2.4, 2.1]} />
    <meshStandardMaterial
      color="#a87b51"
      side={THREE.DoubleSide}
    />
  </mesh>
</group>

{/* Tám gian trưng bày */}
<group position={[-22, 0, 5.75]}>
  <InteractiveSpaces onSelect={onSpaceClick} />
</group>
    </group>
  );
}




function Room({ onExhibit, onSpaceClick }) {
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

{/*
mới xoá
*/}


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



</group>



      {/* Tiêu đề */}
     {/* Biển tiêu đề trang trọng */}
<group position={[0, 4.8, -8.08]}>
  {/* Nền biển tiêu đề */}
  <mesh>
    <boxGeometry args={[12.5, 1.05, 0.18]} />
    <meshStandardMaterial
      color="#681b1b"
      metalness={0.35}
      roughness={0.4}
    />
  </mesh>

  {/* Viền vàng phía trước */}
  <mesh position={[0, 0, 0.1]}>
    <boxGeometry args={[12.25, 0.82, 0.025]} />
    <meshStandardMaterial
      color="#d4af37"
      metalness={0.75}
      roughness={0.25}
    />
  </mesh>

  {/* Mặt nền bên trong */}
  <mesh position={[0, 0, 0.12]}>
    <boxGeometry args={[12.12, 0.69, 0.025]} />
    <meshStandardMaterial
      color="#681b1b"
      roughness={0.5}
    />
  </mesh>

  {/* Chữ tiêu đề */}
  <Text
    position={[0, 0, 0.17]}
    fontSize={0.48}
    color="#ffe6a0"
    anchorX="center"
    anchorY="middle"
    maxWidth={11.8}
    textAlign="center"
    outlineWidth={0.006}
    outlineColor="#8b6425"
    letterSpacing={0.035}
    material-metalness={0.35}
    material-roughness={0.3}
  >
    KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH
  </Text>
</group>

      {/* Chân dung */}
      <group
        position={[-8, 2.65, -8.25]}
        onClick={() => onExhibit(exhibits[0])}
      >
        <mesh>
          <boxGeometry args={[4.5, 3.1, 0.18]} />
          <meshStandardMaterial color="#6e492d" />
        </mesh>
        <mesh position={[0, 0, 0.11]}>
          <planeGeometry args={[4.05, 2.65]} />
          <meshStandardMaterial color="#c9b69b" />
        </mesh>
        <Text
          position={[0, -1.25, 0.2]}
          fontSize={0.22}
          color="#3b281c"
          anchorX="center"
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
        onClick={() => onExhibit(exhibits[2])}
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

{/* 10 khung ảnh treo tường theo hình chữ S */}
{Array.from({ length: 10 }, (_, i) => {
  const t = i / 9;
const y = 4.3 - t * 3.5;
const z = -4.5 - Math.sin(t * Math.PI * 2) * 1.2;

  return (
    <group
      key={i}
      position={[11.78, y, z]}
      rotation={[0, -Math.PI / 2, 0]}
    >
   
      {/* Viền khung */}
      <mesh>
        <boxGeometry args={[1.05, 1.05, 0.06]} />
        <meshStandardMaterial color="#70472d" />
      </mesh>

      {/* Mặt ảnh */}
      <mesh position={[0, 0, 0.035]}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial color="#d8c9ad" />
      </mesh>

      {/* Số thứ tự tạm thời */}
      <Text
        position={[0, 0, 0.04]}
        fontSize={0.07}
        color="#5c1717"
        anchorX="center"
        anchorY="middle"
      >
        {i + 1}
      </Text>
    </group>
  );
})}

{/* Khung Hoàng Sa - 50x50 cm */}
<group

  position={[11.78, 3.2, -2.5]}
  rotation={[0, -Math.PI / 2, 0]}
>
  <mesh>
    <boxGeometry args={[0.55, 0.55, 0.06]} />
    <meshStandardMaterial color="#70472d" />
  </mesh>
  <mesh position={[0, 0, 0.035]}>
    <planeGeometry args={[0.5, 0.5]} />
    <meshStandardMaterial color="#dcebf0" />
  </mesh>
  <Text
    position={[0, 0, 0.045]}
    fontSize={0.055}
    color="#173f63"
    anchorX="center"
    anchorY="middle"
    maxWidth={0.45}
    textAlign="center"
  >
    HOÀNG SA
  </Text>
</group>

{/* Khung Trường Sa - 50x50 cm */}
<group

  position={[11.78, 1, -2]}
  rotation={[0, -Math.PI / 2, 0]}
>
  <mesh>
    <boxGeometry args={[0.55, 0.55, 0.06]} />
    <meshStandardMaterial color="#70472d" />
  </mesh>
  <mesh position={[0, 0, 0.035]}>
    <planeGeometry args={[0.5, 0.5]} />
    <meshStandardMaterial color="#dcebf0" />
  </mesh>
  <Text
    position={[0, 0, 0.045]}
    fontSize={0.055}
    color="#173f63"
    anchorX="center"
    anchorY="middle"
    maxWidth={0.45}
    textAlign="center"
  >
    TRƯỜNG SA
  </Text>
</group>


<group
  position={[11.78, 2.7, 1.5]}
  rotation={[0, -Math.PI / 2, 0]}
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
    KHU TRƯNG BÀY
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


function Scene({ spotIndex, onMove, onExhibit, onSpaceClick, room2Active, activeSpace, onSpaceArrive, }) {
 

  return (
    <>
      <color attach="background" args={["#b9d2e3"]} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[4, 8, 5]} intensity={2} castShadow />

    <Room
  onExhibit={onExhibit}
  onSpaceClick={onSpaceClick}
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


useEffect(() => {
  const enter = () => {
    setRoom2Active(true);
    setActiveSpace(null);
    setSelectedSpace(null);
    setSelectedExhibit(null);
    setShowMap(false);
  };

  const leave = () => {
    setRoom2Active(false);
    setActiveSpace(null);
    setSelectedSpace(null);
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
const handleSelectSpace = (space) => {
  if (room2Active && activeSpace?.id === space.id) {
   setSelectedSpace(space);
    return;
  }

  setSelectedSpace(null);
  setActiveSpace(space);
  setRoom2Active(true);
};

// Chọn một vị trí trong phòng đầu
const handleNavigateSpot = (index) => {
  setSelectedSpace(null);
  setActiveSpace(null);
  setRoom2Active(false);
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



{selectedSpace && (
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
        <div style={{ fontSize: 42 }}>▶</div>
        <h3>KHU VỰC TƯ LIỆU</h3>
        <p>
          Video, hình ảnh và tài liệu sẽ được bổ sung tại đây.
        </p>
      </div>
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
