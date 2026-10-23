
import { useTexture } from "@react-three/drei";

export default function WallImage({
  src,
  alt = "Hình ảnh trưng bày",
  position,
  rotation = [0, 0, 0],
  width = 9,
  height = 3.8,
}) {
  const texture = useTexture(src);

  const openImage = (e) => {
    e.stopPropagation();
    window.dispatchEvent(
      new CustomEvent("open-wall-image", {
        detail: { src, alt },
      })
    );
  };

  return (
    <mesh
      position={position}
      rotation={rotation}
      onClick={openImage}
    >
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        map={texture}
        toneMapped={false}
        side={2}
      />
    </mesh>
  );
}
