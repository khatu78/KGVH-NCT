import { useTexture } from "@react-three/drei";


export default function CeilingDrum({
  y,
  position = [0, 0, 0],
  size = 6,
}) {
 const texture = useTexture(`${import.meta.env.BASE_URL}./images/trongDong.jpg`);

  return (
    <mesh
      position={[position[0], y, position[2]]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial
        map={texture}
        side={2}
        toneMapped={false}
        transparent
      />
    </mesh>
  );
}