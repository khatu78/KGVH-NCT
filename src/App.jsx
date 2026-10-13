
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, OrbitControls, Text, useTexture } from "@react-three/drei";
import * as THREE from "three";
import "./style.css";

const ROOM = { width: 24, depth: 18, height: 5.5 };


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
 


function CameraView({ spots, spotIndex }) {
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
    const spot = spots[spotIndex];
    const target = targets[spotIndex];

    if (!spot || !target) return;

    destination.current.set(...spot.position);
    lookTarget.current.set(...target);
    
    // id1 và id3 nhìn chính diện giống id2
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

    isMovingRef.current = true;
  }, [spotIndex, spots, camera]);

  useFrame((_, delta) => {
    if (!isMovingRef.current) return;

    const alpha = 1 - Math.exp(-5 * delta);

    camera.position.lerp(destination.current, alpha);
    camera.lookAt(lookTarget.current);

    if (camera.position.distanceTo(destination.current) < 0.03) {
      camera.position.copy(destination.current);
      camera.lookAt(lookTarget.current);
      isMovingRef.current = false;
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


function Room({ onExhibit }) {
   const banDo = useTexture(`${import.meta.env.BASE_URL}images/bandoVN.jpg`);
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

      {/* Tường trái và phải */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[side * ROOM.width / 2, ROOM.height / 2, 0]}
        >
          <boxGeometry args={[0.3, ROOM.height, ROOM.depth]} />
          <meshStandardMaterial color="#eee6d7" />
        </mesh>
      ))}

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

  position={[11.78, 1, -1]}
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


function Scene({ spotIndex, onMove, onExhibit }) {
 

  return (
    <>
      <color attach="background" args={["#b9d2e3"]} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[4, 8, 5]} intensity={2} castShadow />

      <Room onExhibit={onExhibit} />
      <NavigationMarkers current={spotIndex} onMove={onMove} />

     <CameraView
  spots={spots}
  spotIndex={spotIndex}
/>
<FixedLookControls />
    
      <Environment preset="city" />
    </>
  );
}








export default function App() {
  
  const [userName, setUserName] = useState("");
const [userAge, setUserAge] = useState("");
const [userGender, setUserGender] = useState("");
const [showWelcome, setShowWelcome] = useState(false);
  const [started, setStarted] = useState(false);
  const [visitor, setVisitor] = useState({
    name: "",
    age: "",
    gender: "Nam",
  });
  const [error, setError] = useState("");
  const [spotIndex, setSpotIndex] = useState(0);
  const [selectedExhibit, setSelectedExhibit] = useState(null);
const [showMap, setShowMap] = useState(false);
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

const returnToPreviousSpot = () => {
  setSpotIndex(0);
  setPreviousSpotIndex(0);
};

  const [showLocationNotice, setShowLocationNotice] = useState(false);
  useEffect(() => {
  setShowLocationNotice(spotIndex !== 0);
}, [spotIndex]);

  const submit = (e) => {
  e.preventDefault();

  if (!visitor.name.trim() || !visitor.age || !visitor.gender) {
    setError("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  setError("");
  setStarted(true);
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
              Tuổi
              <input
                type="number"
                min="1"
                max="100"
                value={visitor.age}
                onChange={(e) =>
                  setVisitor({ ...visitor, age: e.target.value })
                }
                placeholder="Nhập tuổi"
              />
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
        />
       
      </Canvas>
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
  disabled={spotIndex === 0}
>
    ↩ Quay về lối vào
</button>




      <div className="top-info">
        <strong>Không gian văn hóa Hồ Chí Minh</strong>
{visitor.name && (
  <p>
    Xin chào {visitor.gender === "Nam" ? "anh" : "chị"} {visitor.name}!
    <br />
    Tuổi: {visitor.age}
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
