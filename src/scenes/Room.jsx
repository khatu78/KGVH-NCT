import React, { useState } from "react";
import { Text, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { ROOM, exhibits } from "../data/contentList";

export default function Room({ onExhibit, onSpaceClick, onOpenMuseum, onOpenLibrary }) {
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
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "auto")}
      >
        <planeGeometry args={[2.5, 3.5]} />
        <meshBasicMaterial map={banDo} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>

      {/* Sàn */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
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

      {/* Tường phải */}
      <mesh position={[12, ROOM.height / 2, 0]}>
        <boxGeometry args={[0.3, ROOM.height, ROOM.depth]} />
        <meshStandardMaterial color="#eee6d7" />
      </mesh>

      {/* Vách trước Room 1 */}
      <mesh position={[0, ROOM.height / 2, ROOM.depth / 2]}>
        <boxGeometry args={[ROOM.width, ROOM.height, 0.3]} />
        <meshStandardMaterial color="#eee6d7" />
      </mesh>

      {/* Tường trái */}
      <mesh position={[-12, ROOM.height / 2, -2.25]}>
        <boxGeometry args={[0.3, ROOM.height, 13.5]} />
        <meshStandardMaterial color="#eee6d7" />
      </mesh>
      <mesh position={[-12, ROOM.height / 2, 8]}>
        <boxGeometry args={[0.3, ROOM.height, 2]} />
        <meshStandardMaterial color="#eee6d7" />
      </mesh>
      <mesh position={[-12, 4, 5.75]}>
        <boxGeometry args={[0.3, 3, 2.5]} />
        <meshStandardMaterial color="#eee6d7" />
      </mesh>

      {/* Cửa sang phòng 2 */}
      <group position={[-11.82, 0, 5.75]}>
        <group position={[0, 0, -1.1]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh position={[0, 1.2, 1.1]}>
            <boxGeometry args={[0.12, 2.4, 2.2]} />
            <meshStandardMaterial color="#a87b51" side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0.09, 1.2, 1.85]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial color="#d4af37" />
          </mesh>
        </group>

        <group position={[0, 1.5, 0]}>
          <mesh
            onClick={(e) => {
              e.stopPropagation();
              window.dispatchEvent(new Event("enter-second-room"));
            }}
            onPointerOver={() => (document.body.style.cursor = "pointer")}
            onPointerOut={() => (document.body.style.cursor = "auto")}
          >
            <boxGeometry args={[0.16, 0.6, 2.0]} />
            <meshStandardMaterial color="#681b1b" />
          </mesh>
          <Text position={[0.09, 0, 0]} rotation={[0, Math.PI / 2, 0]} fontSize={0.2} color="#ffe6a0" anchorX="center" anchorY="middle" maxWidth={1.8} textAlign="center">
            PHÒNG TRƯNG BÀY
          </Text>
        </group>
      </group>

      {/* Tiêu đề */}
      <group position={[0, 4.8, -8.08]}>
        <mesh>
          <boxGeometry args={[12.5, 1.05, 0.18]} />
          <meshStandardMaterial color="#681b1b" metalness={0.35} roughness={0.4} />
        </mesh>
        <Text position={[0, 0, 0.17]} fontSize={0.48} color="#ffe6a0" anchorX="center" anchorY="middle" maxWidth={11.8} textAlign="center">
          KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH
        </Text>
      </group>

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
          <meshBasicMaterial map={useTexture(`${import.meta.env.BASE_URL}hinh-bac/1.jpg`)} toneMapped={false} />
        </mesh>
        <Text position={[0, -2, 0.2]} fontSize={0.22} color="#3b281c" anchorX="center">
          CHỦ TỊCH HỒ CHÍ MINH
        </Text>
      </group>

      {/* Màn hình tư liệu */}
      <group position={[0, 2.7, -8.25]} onClick={() => onExhibit(exhibits[1])}>
        <mesh>
          <boxGeometry args={[5.2, 3.1, 0.25]} />
          <meshStandardMaterial color="#20242a" />
        </mesh>
        <mesh position={[0, 0, 0.14]}>
          <planeGeometry args={[4.7, 2.6]} />
          <meshStandardMaterial color="#273d4d" />
        </mesh>
        <Text position={[0, 0, 0.2]} fontSize={0.36} color="white" anchorX="center" anchorY="middle">
          VIDEO TƯ LIỆU
        </Text>
      </group>

      {/* Tủ sách */}
      <group position={[8, 2.2, -8.1]} onClick={(e) => { e.stopPropagation(); onOpenLibrary(); }}>
        <mesh>
          <boxGeometry args={[3.6, 4.3, 0.65]} />
          <meshStandardMaterial color="#71472d" />
        </mesh>
      </group>

      {/* Nút Bảo tàng 3D */}
      <group
        position={[11.78, 2.7, 1.5]}
        rotation={[0, -Math.PI / 2, 0]}
        onClick={(e) => { e.stopPropagation(); onOpenMuseum(); }}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "default")}
      >
        <mesh>
          <boxGeometry args={[3.2, 0.65, 0.08]} />
          <meshStandardMaterial color="#5c1717" />
        </mesh>
        <Text position={[0, 0, 0.055]} fontSize={0.27} color="#ffd700" anchorX="center" anchorY="middle">
          BẢO TÀNG 3D
        </Text>
      </group>
    </group>
  );
}