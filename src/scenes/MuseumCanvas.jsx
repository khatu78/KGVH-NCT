import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Text } from "@react-three/drei";
import * as THREE from "three";
import Room from "./Room";
import SecondRoom from "./SecondRoom";
import { spots, targets } from "../data/contentList";

function CameraView({ spots, spotIndex, room2Active, activeSpace, onSpaceArrive }) {
  const { camera } = useThree();
  const isFirstRender = useRef(true);
  const isMovingRef = useRef(false);

  const destination = useRef(new THREE.Vector3(...spots[0].position));
  const lookTarget = useRef(new THREE.Vector3(...targets[0]));

  useEffect(() => {
    if (room2Active && activeSpace) {
      const [x, , z] = activeSpace.position;
      const isTopRow = z < 0;
      destination.current.set(-22 + x, 1.6, 5.75 + z + (isTopRow ? 2.8 : -2.8));
      lookTarget.current.set(-22 + x, 1.3, 5.75 + z);
    } else if (room2Active) {
      destination.current.set(-22, 1.6, 5.75);
      lookTarget.current.set(-31.5, 2.2, 5.75);
    } else {
      const spot = spots[spotIndex];
      const target = targets[spotIndex];
      if (!spot || !target) return;
      destination.current.set(...spot.position);
      lookTarget.current.set(...target);

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
      if (room2Active && activeSpace) onSpaceArrive?.(activeSpace);
    }
  });

  return null;
}

function FixedLookControls() {
  const { camera, gl } = useThree();
  useEffect(() => {
    const element = gl.domElement;
    let dragging = false, startX = 0, startY = 0, startYaw = 0, startPitch = 0;

    const onPointerDown = (e) => {
      if (e.button !== 0) return;
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      camera.rotation.order = "YXZ";
      startYaw = camera.rotation.y;
      startPitch = camera.rotation.x;
    };

    const onPointerMove = (e) => {
      if (!dragging) return;
      const sensitivity = 0.004;
      camera.rotation.y = startYaw + (e.clientX - startX) * sensitivity;
      camera.rotation.x = THREE.MathUtils.clamp(startPitch + (e.clientY - startY) * sensitivity, -1.2, 1.2);
    };

    const onPointerUp = () => (dragging = false);

    element.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      element.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [camera, gl]);

  return null;
}

function ArrowMarker({ position, onClick, label }) {
  const [hovered, setHovered] = useState(false);
  return (
    <group
      position={[position[0], 0, position[2]]}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={() => { setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = "auto"; }}
    >
      <mesh position={[0, 0.65, 0]}>
        <boxGeometry args={[1.5, 0.42, 0.1]} />
        <meshStandardMaterial color={hovered ? "#c62828" : "#8b0000"} />
      </mesh>
      <Text position={[0, 0.65, 0.056]} fontSize={0.12} color="#ffd700" anchorX="center" anchorY="middle">
        {label}
      </Text>
    </group>
  );
}

function NavigationMarkers({ onMove }) {
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
        <ArrowMarker key={sign.id} position={sign.position} label={spots[sign.id].name} onClick={() => onMove(sign.id)} />
      ))}
    </group>
  );
}

export default function MuseumCanvas({ spotIndex, onMove, onExhibit, onSpaceClick, room2Active, activeSpace, onSpaceArrive }) {
  return (
    <Canvas camera={{ position: [0, 1.6, 6.5], fov: 65, near: 0.1, far: 100 }}>
      <color attach="background" args={["#b9d2e3"]} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[4, 8, 5]} intensity={2} castShadow />

      <Room
        onExhibit={onExhibit}
        onSpaceClick={onSpaceClick}
        onOpenLibrary={() => window.dispatchEvent(new Event("open-library"))}
        onOpenMuseum={() => window.open("https://hochiminh.vn/bao-tang-3d", "_blank", "noopener,noreferrer")}
      />

      {room2Active && <SecondRoom onSpaceClick={onSpaceClick} />}

      <NavigationMarkers onMove={onMove} />

      <CameraView
        spots={spots}
        spotIndex={spotIndex}
        room2Active={room2Active}
        activeSpace={activeSpace}
        onSpaceArrive={onSpaceArrive}
      />
      <FixedLookControls />
      <Environment preset="city" />
    </Canvas>
  );
}