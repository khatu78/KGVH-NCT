import { forwardRef, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Text } from "@react-three/drei";
import * as THREE from "three";
import "./style.css";

const ROOM = {
  width: 24,
  depth: 18,
  height: 5.5,
};

const exhibits = [
  {
    id: "portrait",
    title: "Chân dung Chủ tịch Hồ Chí Minh",
    description:
      "Không gian giới thiệu hình ảnh và những dấu ấn tiêu biểu trong cuộc đời, sự nghiệp của Chủ tịch Hồ Chí Minh.",
    position: [-8, 2.7, -8.7],
  },
  {
    id: "video",
    title: "Video tư liệu",
    description:
      "Khu vực trình chiếu các video, hình ảnh và tư liệu phục vụ tham quan.",
    position: [0, 2.8, -8.7],
  },
  {
    id: "books",
    title: "Tủ sách",
    description:
      "Nơi trưng bày sách và tài liệu tìm hiểu về cuộc đời, tư tưởng, đạo đức và phong cách Hồ Chí Minh.",
    position: [8, 2.4, -8.2],
  },
  {
    id: "display",
    title: "Khu trưng bày",
    description:
      "Các hiện vật và tư liệu được sắp xếp theo chủ đề để người tham quan khám phá.",
    position: [9.5, 1.4, 1],
  },
];

/* =========================
   NHÂN VẬT
========================= */

const HumanCharacter = forwardRef(function HumanCharacter(
  { keys, joystick },
  externalRef
) {
  const localRef = useRef(null);
  const ref = externalRef || localRef;

  const speed = 4.6;

  useFrame((_, delta) => {
    if (!ref.current) return;

    let forward = 0;
    let right = 0;

    // TIẾN / LÙI
    if (keys.current.arrowup || keys.current.w) forward += 1;
    if (keys.current.arrowdown || keys.current.s) forward -= 1;

    // TRÁI / PHẢI
    if (keys.current.arrowleft || keys.current.a) right -= 1;
    if (keys.current.arrowright || keys.current.d) right += 1;

    // JOYSTICK
    if (
      Math.abs(joystick.current.x) > 0.01 ||
      Math.abs(joystick.current.y) > 0.01
    ) {
      right += joystick.current.x;
      forward += joystick.current.y;
    }

    const length = Math.hypot(forward, right);

    if (length <= 0.01) return;

    forward /= Math.max(1, length);
    right /= Math.max(1, length);

    const yaw = window.__cameraYaw || 0;

    // HƯỚNG TIẾN THEO CAMERA
    const forwardX = Math.sin(yaw);
    const forwardZ = Math.cos(yaw);

    // HƯỚNG PHẢI THEO CAMERA
    const rightX = Math.cos(yaw);
    const rightZ = -Math.sin(yaw);

    const moveX = forward * forwardX + right * rightX;
    const moveZ = forward * forwardZ + right * rightZ;

    ref.current.position.x += moveX * speed * delta;
    ref.current.position.z += moveZ * speed * delta;

    // Không cho đi xuyên tường
    const limitX = ROOM.width / 2 - 1;
    const limitZ = ROOM.depth / 2 - 1;

    ref.current.position.x = THREE.MathUtils.clamp(
      ref.current.position.x,
      -limitX,
      limitX
    );

    ref.current.position.z = THREE.MathUtils.clamp(
      ref.current.position.z,
      -limitZ,
      limitZ
    );

    // Nhân vật quay theo hướng di chuyển
    ref.current.rotation.y = Math.atan2(moveX, moveZ);
  });

  return (
    <group ref={ref} position={[0, 0, 5.8]} scale={0.78}>
      {/* CHÂN */}
      <mesh castShadow position={[-0.12, 0.38, 0]}>
        <capsuleGeometry args={[0.085, 0.42, 8, 12]} />
        <meshStandardMaterial color="#26384d" />
      </mesh>

      <mesh castShadow position={[0.12, 0.38, 0]}>
        <capsuleGeometry args={[0.085, 0.42, 8, 12]} />
        <meshStandardMaterial color="#26384d" />
      </mesh>

      {/* GIÀY */}
      <mesh castShadow position={[-0.12, 0.13, 0.08]}>
        <sphereGeometry args={[0.13, 16, 12]} />
        <meshStandardMaterial color="#20242a" />
      </mesh>

      <mesh castShadow position={[0.12, 0.13, 0.08]}>
        <sphereGeometry args={[0.13, 16, 12]} />
        <meshStandardMaterial color="#20242a" />
      </mesh>

      {/* THÂN */}
      <mesh castShadow position={[0, 0.88, 0]}>
        <capsuleGeometry args={[0.28, 0.48, 8, 16]} />
        <meshStandardMaterial color="#426b9a" />
      </mesh>

      {/* CỔ */}
      <mesh castShadow position={[0, 1.27, 0]}>
        <cylinderGeometry args={[0.105, 0.105, 0.18, 16]} />
        <meshStandardMaterial color="#d8a47c" />
      </mesh>

      {/* TAY */}
      <mesh castShadow position={[-0.36, 0.92, 0]}>
        <capsuleGeometry args={[0.07, 0.38, 8, 12]} />
        <meshStandardMaterial color="#426b9a" />
      </mesh>

      <mesh castShadow position={[0.36, 0.92, 0]}>
        <capsuleGeometry args={[0.07, 0.38, 8, 12]} />
        <meshStandardMaterial color="#426b9a" />
      </mesh>

      {/* BÀN TAY */}
      <mesh castShadow position={[-0.36, 0.65, 0]}>
        <sphereGeometry args={[0.075, 12, 10]} />
        <meshStandardMaterial color="#d8a47c" />
      </mesh>

      <mesh castShadow position={[0.36, 0.65, 0]}>
        <sphereGeometry args={[0.075, 12, 10]} />
        <meshStandardMaterial color="#d8a47c" />
      </mesh>

      {/* ĐẦU */}
      <group position={[0, 1.68, 0]}>
        {/* mặt */}
        <mesh castShadow scale={[0.29, 0.34, 0.27]}>
          <sphereGeometry args={[1, 24, 20]} />
          <meshStandardMaterial color="#d8a47c" />
        </mesh>

        {/* TAI */}
        <mesh
          castShadow
          position={[-0.285, 0, 0]}
          scale={[0.07, 0.1, 0.045]}
        >
          <sphereGeometry args={[1, 16, 12]} />
          <meshStandardMaterial color="#d8a47c" />
        </mesh>

        <mesh
          castShadow
          position={[0.285, 0, 0]}
          scale={[0.07, 0.1, 0.045]}
        >
          <sphereGeometry args={[1, 16, 12]} />
          <meshStandardMaterial color="#d8a47c" />
        </mesh>

        {/* TÓC */}
        <mesh
          castShadow
          position={[0, 0.22, -0.015]}
          scale={[0.30, 0.16, 0.28]}
        >
          <sphereGeometry args={[1, 24, 16]} />
          <meshStandardMaterial color="#352a25" />
        </mesh>

        <mesh
          castShadow
          position={[-0.255, 0.13, -0.02]}
          scale={[0.075, 0.18, 0.15]}
        >
          <sphereGeometry args={[1, 16, 12]} />
          <meshStandardMaterial color="#352a25" />
        </mesh>

        <mesh
          castShadow
          position={[0.255, 0.13, -0.02]}
          scale={[0.075, 0.18, 0.15]}
        >
          <sphereGeometry args={[1, 16, 12]} />
          <meshStandardMaterial color="#352a25" />
        </mesh>

        {/* MẮT */}
        <mesh
          position={[-0.105, 0.035, 0.255]}
          scale={[0.052, 0.06, 0.025]}
        >
          <sphereGeometry args={[1, 16, 12]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        <mesh
          position={[0.105, 0.035, 0.255]}
          scale={[0.052, 0.06, 0.025]}
        >
          <sphereGeometry args={[1, 16, 12]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        {/* CON NGƯƠI */}
        <mesh
          position={[-0.105, 0.035, 0.278]}
          scale={[0.023, 0.029, 0.012]}
        >
          <sphereGeometry args={[1, 12, 10]} />
          <meshStandardMaterial color="#202020" />
        </mesh>

        <mesh
          position={[0.105, 0.035, 0.278]}
          scale={[0.023, 0.029, 0.012]}
        >
          <sphereGeometry args={[1, 12, 10]} />
          <meshStandardMaterial color="#202020" />
        </mesh>

        {/* LÔNG MÀY */}
        <mesh
          position={[-0.105, 0.115, 0.255]}
          scale={[0.075, 0.012, 0.018]}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#352a25" />
        </mesh>

        <mesh
          position={[0.105, 0.115, 0.255]}
          scale={[0.075, 0.012, 0.018]}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#352a25" />
        </mesh>

        {/* MŨI */}
        <mesh
          position={[0, -0.005, 0.285]}
          scale={[0.035, 0.06, 0.055]}
        >
          <sphereGeometry args={[1, 12, 10]} />
          <meshStandardMaterial color="#c78f6d" />
        </mesh>

        {/* MIỆNG */}
        <mesh
          position={[0, -0.105, 0.268]}
          scale={[0.065, 0.018, 0.012]}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#8e4e50" />
        </mesh>
      </group>
    </group>
  );
});

/* =========================
   CAMERA
========================= */

function CameraController({ characterRef }) {
  const distance = useRef(5.2);
  const pitch = useRef(0.38);

  useEffect(() => {
    window.__cameraYaw = 0;

    const wheel = (e) => {
      distance.current = THREE.MathUtils.clamp(
        distance.current + e.deltaY * 0.006,
        2.5,
        7
      );
    };

    window.addEventListener("wheel", wheel, {
      passive: true,
    });

    return () => {
      window.removeEventListener("wheel", wheel);
    };
  }, []);

  useEffect(() => {
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const down = (e) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const move = (e) => {
      if (!dragging) return;

      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;

      lastX = e.clientX;
      lastY = e.clientY;

      window.__cameraYaw =
        (window.__cameraYaw || 0) - dx * 0.008;

      pitch.current = THREE.MathUtils.clamp(
        pitch.current - dy * 0.004,
        0.12,
        0.95
      );
    };

    const up = () => {
      dragging = false;
    };

    window.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);

    return () => {
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  useFrame(({ camera }, delta) => {
    if (!characterRef.current) return;

    const target = characterRef.current.position;
    const yaw = window.__cameraYaw || 0;

    const horizontal = Math.cos(pitch.current);

    const dirX = -Math.sin(yaw);
    const dirZ = -Math.cos(yaw);

    let safeDistance = distance.current;

    if (Math.abs(dirX) > 0.001) {
      const wallX =
        dirX > 0
          ? ROOM.width / 2 - 0.5
          : -ROOM.width / 2 + 0.5;

      const tx = (wallX - target.x) / dirX;

      if (tx > 0) {
        safeDistance = Math.min(safeDistance, tx);
      }
    }

    if (Math.abs(dirZ) > 0.001) {
      const wallZ =
        dirZ > 0
          ? ROOM.depth / 2 - 0.5
          : -ROOM.depth / 2 + 0.5;

      const tz = (wallZ - target.z) / dirZ;

      if (tz > 0) {
        safeDistance = Math.min(safeDistance, tz);
      }
    }

    safeDistance = Math.max(
      1.8,
      safeDistance - 0.25
    );

    const cameraX =
      target.x +
      dirX * safeDistance * horizontal;

    const cameraZ =
      target.z +
      dirZ * safeDistance * horizontal;

    const cameraY =
      target.y +
      1.2 +
      Math.sin(pitch.current) * safeDistance;

    const desired = new THREE.Vector3(
      cameraX,
      THREE.MathUtils.clamp(cameraY, 1.5, 5.1),
      cameraZ
    );

    camera.position.lerp(
      desired,
      1 - Math.pow(0.0005, delta)
    );

    camera.lookAt(
      target.x,
      target.y + 1.15,
      target.z
    );
  });

  return null;
}

/* =========================
   PHÒNG
========================= */

function Room() {
  return (
    <group>
      {/* SÀN */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry
          args={[ROOM.width, ROOM.depth]}
        />
        <meshStandardMaterial color="#d8c9ad" />
      </mesh>

      {/* TRẦN */}
      <mesh
        position={[0, ROOM.height, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <planeGeometry
          args={[ROOM.width, ROOM.depth]}
        />
        <meshStandardMaterial color="#f5f1e8" />
      </mesh>

      {/* TƯỜNG SAU */}
      <mesh
        position={[0, ROOM.height / 2, -ROOM.depth / 2]}
      >
        <boxGeometry
          args={[
            ROOM.width,
            ROOM.height,
            0.35,
          ]}
        />
        <meshStandardMaterial color="#eee6d7" />
      </mesh>

      {/* TƯỜNG TRƯỚC */}
      <mesh
        position={[0, ROOM.height / 2, ROOM.depth / 2]}
      >
        <boxGeometry
          args={[
            ROOM.width,
            ROOM.height,
            0.35,
          ]}
        />
        <meshStandardMaterial color="#eee6d7" />
      </mesh>

      {/* TƯỜNG TRÁI */}
      <mesh
        position={[
          -ROOM.width / 2,
          ROOM.height / 2,
          0,
        ]}
      >
        <boxGeometry
          args={[
            0.35,
            ROOM.height,
            ROOM.depth,
          ]}
        />
        <meshStandardMaterial color="#eee6d7" />
      </mesh>

      {/* TƯỜNG PHẢI */}
      <mesh
        position={[
          ROOM.width / 2,
          ROOM.height / 2,
          0,
        ]}
      >
        <boxGeometry
          args={[
            0.35,
            ROOM.height,
            ROOM.depth,
          ]}
        />
        <meshStandardMaterial color="#eee6d7" />
      </mesh>

      {/* TIÊU ĐỀ */}
      <Text
        position={[0, 4.35, -8.45]}
        fontSize={0.58}
        color="#59351d"
        anchorX="center"
        anchorY="middle"
      >
        KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH
      </Text>

      {/* TRANH */}
      <group position={[-8, 2.5, -8.25]}>
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

      {/* MÀN HÌNH */}
      <group position={[0, 2.7, -8.25]}>
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
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          VIDEO TƯ LIỆU
        </Text>
      </group>

      {/* TỦ SÁCH */}
      <group position={[8, 2.2, -8.1]}>
        <mesh>
          <boxGeometry args={[3.6, 4.3, 0.65]} />
          <meshStandardMaterial color="#71472d" />
        </mesh>

        {[0.8, 1.5, 2.2, 2.9].map((y) => (
          <mesh
            key={y}
            position={[
              0,
              -2.15 + y,
              0.36,
            ]}
          >
            <boxGeometry
              args={[3.2, 0.09, 0.05]}
            />
            <meshStandardMaterial color="#432b1c" />
          </mesh>
        ))}

        {[...Array(16)].map((_, i) => (
          <mesh
            key={i}
            position={[
              -1.35 + (i % 8) * 0.38,
              -1.65 +
                Math.floor(i / 8) * 1.4,
              0.42,
            ]}
          >
            <boxGeometry
              args={[0.25, 1, 0.08]}
            />
            <meshStandardMaterial
              color={
                i % 2
                  ? "#a87b51"
                  : "#486b72"
              }
            />
          </mesh>
        ))}
      </group>

      {/* TỦ TRƯNG BÀY */}
      <group position={[9.1, 1.2, 1]}>
        <mesh>
          <boxGeometry
            args={[3.4, 1.8, 1.6]}
          />
          <meshStandardMaterial
            color="#9d7b56"
            transparent
            opacity={0.85}
          />
        </mesh>

        <mesh position={[0, 0.1, 0]}>
          <boxGeometry
            args={[2.8, 0.15, 1.2]}
          />
          <meshStandardMaterial color="#e2c99d" />
        </mesh>
      </group>

      {/* BÀN */}
      <group position={[-5, 0, 2]}>
        <mesh
          position={[0, 1.15, 0]}
          castShadow
        >
          <boxGeometry
            args={[2.6, 0.18, 1.25]}
          />
          <meshStandardMaterial color="#70472d" />
        </mesh>

        {[
          [-1, 0.55, -0.4],
          [1, 0.55, -0.4],
          [-1, 0.55, 0.4],
          [1, 0.55, 0.4],
        ].map((p, i) => (
          <mesh key={i} position={p}>
            <boxGeometry
              args={[0.13, 1.1, 0.13]}
            />
            <meshStandardMaterial color="#553522" />
          </mesh>
        ))}
      </group>

      {/* GHẾ */}
      <group position={[-5, 0, 4]}>
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry
            args={[1.2, 0.15, 1.1]}
          />
          <meshStandardMaterial color="#795038" />
        </mesh>

        <mesh position={[0, 1.45, 0.45]}>
          <boxGeometry
            args={[1.2, 1.3, 0.12]}
          />
          <meshStandardMaterial color="#795038" />
        </mesh>
      </group>

      {/* CÂY */}
      <group position={[-9, 0, 5]}>
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry
            args={[0.28, 0.38, 2, 16]}
          />
          <meshStandardMaterial color="#9b633b" />
        </mesh>

        <mesh position={[0, 2.5, 0]}>
          <sphereGeometry
            args={[1.1, 16, 12]}
          />
          <meshStandardMaterial color="#4e7750" />
        </mesh>
      </group>

      {/* ĐÈN */}
      {[-7, 0, 7].map((x) => (
        <group
          key={x}
          position={[x, 5.15, -2]}
        >
          <mesh>
            <cylinderGeometry
              args={[0.35, 0.35, 0.15, 24]}
            />
            <meshStandardMaterial color="#d6b76d" />
          </mesh>

          <pointLight
            position={[0, -0.2, 0]}
            intensity={35}
            distance={9}
          />
        </group>
      ))}
    </group>
  );
}

/* =========================
   GAME SCENE
========================= */

function GameScene({
  keys,
  joystick,
  onExhibit,
}) {
  const characterRef = useRef(null);
  const lastExhibit = useRef(null);

  useFrame(() => {
    if (!characterRef.current) return;

    let nearest = null;
    let nearestDistance = Infinity;

    exhibits.forEach((item) => {
      const dx =
        characterRef.current.position.x -
        item.position[0];

      const dz =
        characterRef.current.position.z -
        item.position[2];

      const distance = Math.sqrt(
        dx * dx + dz * dz
      );

      if (
        distance < 3 &&
        distance < nearestDistance
      ) {
        nearest = item;
        nearestDistance = distance;
      }
    });

    const newId = nearest
      ? nearest.id
      : null;

    if (newId !== lastExhibit.current) {
      lastExhibit.current = newId;
      onExhibit(nearest);
    }
  });

  return (
    <>
      <ambientLight intensity={1.7} />

      <directionalLight
        position={[4, 8, 5]}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <Room />

      <HumanCharacter
        ref={characterRef}
        keys={keys}
        joystick={joystick}
      />

      <CameraController
        characterRef={characterRef}
      />

      <Environment preset="city" />
    </>
  );
}

/* =========================
   APP
========================= */

export default function App() {
  const [started, setStarted] = useState(false);

  const [visitor, setVisitor] = useState({
    name: "",
    age: "",
    gender: "",
  });

  const [error, setError] = useState("");
  const [selectedExhibit, setSelectedExhibit] =
    useState(null);

  const keys = useRef({});
  const joystick = useRef({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const down = (e) => {
      keys.current[e.key.toLowerCase()] = true;
    };

    const up = (e) => {
      keys.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener(
        "keydown",
        down
      );

      window.removeEventListener(
        "keyup",
        up
      );
    };
  }, []);

  const updateVisitor = (
    field,
    value
  ) => {
    setVisitor((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
  };

  /* =========================
     VALIDATION
  ========================= */

  const submit = (e) => {
    e.preventDefault();

    const name =
      visitor.name.trim();

    const age =
      String(visitor.age).trim();

    if (!name || !age) {
      setError(
        "Vui lòng nhập thông tin"
      );

      window.alert(
        "Vui lòng nhập thông tin"
      );

      return;
    }

    setError("");
    setStarted(true);
  };

  /* =========================
     JOYSTICK
  ========================= */

  const handleJoystickStart = (e) => {
    e.preventDefault();

    const joystickElement =
      e.currentTarget;

    const rect =
      joystickElement.getBoundingClientRect();

    const updateJoystick = (
      touch
    ) => {
      const centerX =
        rect.left +
        rect.width / 2;

      const centerY =
        rect.top +
        rect.height / 2;

      let x =
        (touch.clientX - centerX) /
        (rect.width / 2);

      let y =
        (centerY - touch.clientY) /
        (rect.height / 2);

      const length =
        Math.hypot(x, y);

      if (length > 1) {
        x /= length;
        y /= length;
      }

      joystick.current = {
        x,
        y,
      };

      const knob =
        joystickElement.querySelector(
          ".joystick-knob"
        );

      if (knob) {
        knob.style.transform =
          `translate(
            calc(-50% + ${x * 34}px),
            calc(-50% + ${-y * 34}px)
          )`;
      }
    };

    const move = (event) => {
      if (event.touches[0]) {
        event.preventDefault();
        updateJoystick(
          event.touches[0]
        );
      }
    };

    const end = () => {
      joystick.current = {
        x: 0,
        y: 0,
      };

      const knob =
        joystickElement.querySelector(
          ".joystick-knob"
        );

      if (knob) {
        knob.style.transform =
          "translate(-50%, -50%)";
      }

      window.removeEventListener(
        "touchmove",
        move
      );

      window.removeEventListener(
        "touchend",
        end
      );
    };

    updateJoystick(e.touches[0]);

    window.addEventListener(
      "touchmove",
      move,
      {
        passive: false,
      }
    );

    window.addEventListener(
      "touchend",
      end
    );
  };

  /* =========================
     MÀN HÌNH NHẬP THÔNG TIN
  ========================= */

  if (!started) {
    return (
      <div className="welcome-page">
        <div className="welcome-card">
          <div className="welcome-badge">
            KHÔNG GIAN VĂN HÓA
          </div>

          <h1>Hồ Chí Minh</h1>

          <p className="welcome-description">
            Chào mừng bạn đến với không
            gian tham quan 3D. Hãy nhập
            thông tin để bắt đầu chuyến
            tham quan.
          </p>

          <form
            onSubmit={submit}
            noValidate
            className="visitor-form"
          >
            <label>
              Họ và tên

              <input
                type="text"
                value={visitor.name}
                onChange={(e) =>
                  updateVisitor(
                    "name",
                    e.target.value
                  )
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
                  updateVisitor(
                    "age",
                    e.target.value
                  )
                }
                placeholder="Nhập tuổi"
              />
            </label>

            <label>
              Giới tính

              <select
                value={visitor.gender}
                onChange={(e) =>
                  updateVisitor(
                    "gender",
                    e.target.value
                  )
                }
              >
                <option value="">
                  Chọn giới tính
                </option>

                <option value="Nam">
                  Nam
                </option>

                <option value="Nữ">
                  Nữ
                </option>

                <option value="Khác">
                  Khác
                </option>
              </select>
            </label>

            {error && (
              <div
                className="form-error"
                role="alert"
              >
                ⚠ {error}
              </div>
            )}

            <button
              type="submit"
              className="start-button"
            >
              BẮT ĐẦU THAM QUAN
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* =========================
     PHÒNG 3D
  ========================= */

  return (
    <div className="app">
      <Canvas
        shadows
        camera={{
          position: [0, 3, 10],
          fov: 60,
        }}
        gl={{
          antialias: true,
        }}
      >
        <color
          attach="background"
          args={["#b9d2e3"]}
        />

        <GameScene
          keys={keys}
          joystick={joystick}
          onExhibit={setSelectedExhibit}
        />
      </Canvas>

      <div className="top-info">
        <strong>
          Không gian văn hóa Hồ Chí Minh
        </strong>

        <span>
          Xin chào, {visitor.name}
        </span>
      </div>

      <div className="controls">
        <div>
          ↑ ↓ ← → / WASD: Di chuyển
        </div>

        <div>
          🖱 Kéo chuột: Xoay camera
        </div>

        <div>
          🖱 Cuộn: Zoom
        </div>
      </div>

      {selectedExhibit && (
        <div className="exhibit-info">
          <div className="exhibit-title">
            {selectedExhibit.title}
          </div>

          <div className="exhibit-description">
            {selectedExhibit.description}
          </div>
        </div>
      )}

      <div
        className="joystick"
        onTouchStart={
          handleJoystickStart
        }
      >
        <div className="joystick-knob" />
      </div>

      <div className="mobile-hint">
        Kéo joystick để di chuyển
      </div>
    </div>
  );
}
