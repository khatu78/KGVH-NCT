import React from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { spaces } from "../data/contentList";

function InteractiveSpaces({ onSelect }) {
  return (
    <group>
      {spaces.map((space) => (
        <group
          key={space.id}
          position={space.position}
          rotation={[0, space.rotation, 0]}
          onClick={(e) => { e.stopPropagation(); onSelect(space); }}
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "auto")}
        >
          <mesh position={[0, 0.08, 0]}>
            <boxGeometry args={[2.25, 0.16, 1.9]} />
            <meshStandardMaterial color="#d8c9ad" />
          </mesh>
          <mesh position={[0, 2.05, 0.83]}>
            <boxGeometry args={[2.05, 0.42, 0.12]} />
            <meshStandardMaterial color={space.color} />
          </mesh>
          <Text position={[0, 2.05, 0.9]} fontSize={0.135} color="#ffe6a0" anchorX="center" anchorY="middle" maxWidth={1.9} textAlign="center">
            {space.title}
          </Text>
        </group>
      ))}
    </group>
  );
}

export default function SecondRoom({ onSpaceClick }) {
  return (
    <group>
      {/* Biển quay về sảnh chính */}
      <group position={[-12.3, 1.5, 5.75]}>
        <mesh
          onClick={(e) => {
            e.stopPropagation();
            window.dispatchEvent(new Event("leave-second-room"));
          }}
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "auto")}
        >
          <boxGeometry args={[0.16, 0.6, 2]} />
          <meshStandardMaterial color="#681b1b" side={THREE.DoubleSide} />
        </mesh>
        <Text position={[-0.09, 0, 0]} rotation={[0, -Math.PI / 2, 0]} fontSize={0.3} color="#ffe6a0" anchorX="center" anchorY="middle">
          SẢNH CHÍNH
        </Text>
      </group>

      {/* Sàn & Tường phòng 2 */}
      <mesh position={[-22, 0, 5.75]} receiveShadow>
        <boxGeometry args={[20, 0.2, 14]} />
        <meshStandardMaterial color="#d8c9ad" />
      </mesh>
      <mesh position={[-22, 5.5, 5.75]}>
        <boxGeometry args={[20, 0.2, 14]} />
        <meshStandardMaterial color="#f5f1e8" />
      </mesh>

      <group position={[-22, 0, 5.75]}>
        <InteractiveSpaces onSelect={onSpaceClick} />
      </group>
    </group>
  );
}