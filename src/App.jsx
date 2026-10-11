
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import "./style.css";

const ROOM = { width: 24, depth: 18, height: 5.5 };

const spots = [
  { id: 0, name: "Lối vào", position: [0, 1.6, 6.5] },
  { id: 1, name: "Không gian trung tâm", position: [0, 1.6, 2.5] },
  { id: 2, name: "Khu vực tư liệu", position: [0, 1.6, -2] },
  { id: 3, name: "Chân dung Bác Hồ", position: [-6, 1.6, -5] },
  { id: 4, name: "Video tư liệu", position: [0, 1.6, -5] },
  { id: 5, name: "Tủ sách", position: [6, 1.6, -5] },
  { id: 6, name: "Khu trưng bày", position: [7, 1.6, 1] },
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
 
  
function CameraView({ spots, spotIndex, controls }) {
  const { camera } = useThree();
    const getTarget = (index) => {
    const targets = [
      [0, 1.6, 3.5],     // Lối vào
      [0, 1.6, -0.5],    // Trung tâm
      [0, 1.6, -5],      // Khu tư liệu
      [-8, 2.5, -8.2],   // Chân dung Bác Hồ
      [0, 2.7, -8.2],    // Video tư liệu
      [8, 2.3, -8.1],    // Tủ sách
      [9.1, 1.5, 1],     // Khu trưng bày
    ];

    return targets[index] || [0, 1.6, -2];
  };

  const destination = useRef(new THREE.Vector3(...spots[0].position));
  const lookTarget = useRef(new THREE.Vector3(...getTarget(0)));

  useEffect(() => {
    const spot = spots[spotIndex];
    if (!spot) return;

    destination.current.set(...spot.position);
    lookTarget.current.set(...getTarget(spotIndex));
  }, [spots, spotIndex]);

  useFrame((_, delta) => {
    const alpha = 1 - Math.exp(-2.5 * delta);

    camera.position.lerp(destination.current, alpha);

    if (controls.current) {
      controls.current.target.lerp(lookTarget.current, alpha);
      controls.current.update();
    }
  });

  return null;
}





function ArrowMarker({ position, onClick, label, arrow = "↑" }) {
  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Biển chỉ dẫn lơ lửng */}
      <mesh>
        <boxGeometry args={[3.2, 0.72, 0.12]} />
        <meshStandardMaterial
          color="#176b52"
          emissive="#0a3d2f"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Mũi tên */}
      <Text
        position={[0, 0.08, 0.075]}
        fontSize={0.38}
        color="#ffe2a6"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#164c42"
      >
        {arrow}
      </Text>

      {/* Tên khu vực */}
      <Text
        position={[0, -0.2, 0.075]}
        fontSize={0.19}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.9}
        textAlign="center"
      >
        {label}
      </Text>
    </group>
  );
}


function Room({ onExhibit }) {
  return (
    <group>
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
      <Text
        position={[0, 4.35, -8.3]}
        fontSize={0.52}
        color="#59351d"
        anchorX="center"
        anchorY="middle"
      >
        KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH
      </Text>

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
      <group
        position={[9.1, 1.2, 1]}
        onClick={() => onExhibit(exhibits[3])}
      >
        <mesh>
          <boxGeometry args={[3.4, 1.8, 1.6]} />
          <meshStandardMaterial
            color="#9d7b56"
            transparent
            opacity={0.85}
          />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[2.8, 0.15, 1.2]} />
          <meshStandardMaterial color="#e2c99d" />
        </mesh>
      </group>

      {/* Bàn */}
      <group position={[-5, 0, 2]}>
        <mesh position={[0, 1.15, 0]} castShadow>
          <boxGeometry args={[2.6, 0.18, 1.25]} />
          <meshStandardMaterial color="#70472d" />
        </mesh>
        {[
          [-1, 0.55, -0.4],
          [1, 0.55, -0.4],
          [-1, 0.55, 0.4],
          [1, 0.55, 0.4],
        ].map((p, i) => (
          <mesh key={i} position={p}>
            <boxGeometry args={[0.13, 1.1, 0.13]} />
            <meshStandardMaterial color="#553522" />
          </mesh>
        ))}
      </group>

      {/* Cây */}
      <group position={[-9, 0, 5]}>
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
    </group>
  );
}



function NavigationMarkers({ current, onMove }) {
  
const directions = {
  // 0: Lối vào
  0: [
    { id: 1, arrow: "↑", label: "Không gian trung tâm", position: [0, 1.25, 4.5] },
  ],

  // 1: Không gian trung tâm
  1: [
    { id: 0, arrow: "↓", label: "Lối vào", position: [0, 1.25, 4.5] },
    { id: 2, arrow: "↑", label: "Khu vực tư liệu", position: [0, 1.25, -0.5] },
  ],

  // 2: Khu vực tư liệu
  2: [
    { id: 1, arrow: "↓", label: "Không gian trung tâm", position: [0, 1.25, 0] },
    { id: 4, arrow: "↑", label: "Video tư liệu", position: [0, 1.25, -4] },
  ],

  // 3: Chân dung Bác Hồ
  3: [
    { id: 4, arrow: "→", label: "Video tư liệu", position: [-4, 1.25, -6] },
  ],

  // 4: Video tư liệu
  4: [
    { id: 3, arrow: "←", label: "Chân dung Bác Hồ", position: [-2.5, 1.25, -6.5] },
    { id: 5, arrow: "→", label: "Tủ sách", position: [2.5, 1.25, -6.5] },
    { id: 6, arrow: "↑", label: "Khu trưng bày", position: [0, 1.25, -3.5] },
    { id: 2, arrow: "↓", label: "Khu vực tư liệu", position: [0, 1.25, -1] },
  ],

  // 5: Tủ sách
  5: [
    { id: 4, arrow: "←", label: "Video tư liệu", position: [4, 1.25, -6] },
  ],

  // 6: Khu trưng bày
  6: [
    { id: 4, arrow: "↓", label: "Video tư liệu", position: [0, 1.25, -4] },
  ],
};


  return (
  <group>
    {(directions[current] || []).map((item) => (
      <ArrowMarker
        key={item.id}
        position={item.position}
        label={item.label}
        arrow={item.arrow}
        onClick={() => onMove(item.id)}
      />
    ))}
  </group>
);
}



function Scene({ spotIndex, onMove, onExhibit }) {
  const controls = useRef(null);

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
        controls={controls}
      />

      <OrbitControls
        ref={controls}
        makeDefault
        enablePan={false}
        enableZoom={false}
        rotateSpeed={0.6}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI - 0.2}
      />

      <Environment preset="city" />
    </>
  );
}



function KeyboardNavigation({ spots, spotIndex, setSpotIndex }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
      if (!keys.includes(event.key)) return;

      // Không điều hướng khi đang nhập biểu mẫu
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) return;

      event.preventDefault();

      let nextIndex = spotIndex;

      if (event.key === "ArrowRight" || event.key === "ArrowUp") {
        nextIndex = (spotIndex + 1) % spots.length;
      } else {
        nextIndex = (spotIndex - 1 + spots.length) % spots.length;
      }

      setSpotIndex(nextIndex);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [spots, spotIndex, setSpotIndex]);

  return null;
}


export default function App() {
  
  
  const [started, setStarted] = useState(false);
  const [visitor, setVisitor] = useState({
    name: "",
    age: "",
    gender: "Nam",
  });
  const [error, setError] = useState("");
  const [spotIndex, setSpotIndex] = useState(0);
  const [selectedExhibit, setSelectedExhibit] = useState(null);

  const [showLocationNotice, setShowLocationNotice] = useState(false);
  useEffect(() => {
  setShowLocationNotice(spotIndex !== 0);
}, [spotIndex]);

  const submit = (e) => {
    e.preventDefault();

    if (!visitor.name.trim() || !String(visitor.age).trim()) {
      setError("Vui lòng nhập đầy đủ họ tên và tuổi.");
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
    far: 100
  }}
      >
        <Scene
          spotIndex={spotIndex}
          onMove={setSpotIndex}
          onExhibit={setSelectedExhibit}
        />
        <KeyboardNavigation
  spots={spots}
  spotIndex={spotIndex}
  setSpotIndex={setSpotIndex}
/>
      </Canvas>

      
{showLocationNotice && (
  <div
    style={{
      position: "absolute",
      top: "76px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "min(340px, calc(100% - 32px))",
      padding: "18px 42px 18px 18px",
      background: "rgba(255, 250, 239, 0.96)",
      color: "#493321",
      border: "1px solid #d6bd91",
      borderRadius: "12px",
      boxShadow: "0 5px 22px rgba(0,0,0,0.18)",
      zIndex: 20,
      boxSizing: "border-box",
    }}
  >
    <button
      onClick={() => {
        setSpotIndex(0);
        setSelectedExhibit(null);
      }}
      aria-label="Quay về lối vào"
      title="Quay về lối vào"
      style={{
        position: "absolute",
        top: "7px",
        right: "8px",
        border: "none",
        background: "transparent",
        color: "#493321",
        fontSize: "22px",
        cursor: "pointer",
        padding: "3px 7px",
      }}
    >
      ✕
    </button>

    <div style={{ fontWeight: 700, marginBottom: "6px" }}>
      Bạn đang tham quan
    </div>

    <div style={{ fontSize: "14px", lineHeight: 1.5 }}>
      {spots[spotIndex].name}
    </div>
  </div>
)}


      <div className="top-info">
        <strong>Không gian văn hóa Hồ Chí Minh</strong>
        <span>Xin chào, {visitor.name}</span>
      </div>

      <div className="controls">
        <div>🖱 Kéo chuột: Quan sát 360°</div>
        <div>⬆ Nhấn mũi tên: Di chuyển đến điểm khác</div>
        <div>📍 Vị trí: {spots[spotIndex].name}</div>
      </div>

      {selectedExhibit && (
        <div className="exhibit-info">
          <button
            className="close-exhibit"
            onClick={() => setSelectedExhibit(null)}
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

      <div className="navigation-hint">
        Kéo chuột để nhìn quanh · Nhấn các mũi tên để di chuyển
      </div>
    </div>
  );
}
