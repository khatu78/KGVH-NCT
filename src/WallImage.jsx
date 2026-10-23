import { Html } from "@react-three/drei";

export default function WallImage({
  src,
  alt = "Hình ảnh trưng bày",
  position,
  rotation = [0, 0, 0],
  width = "900px",
  height = "380px",
}) {
  const openImage = () => {
    window.dispatchEvent(
      new CustomEvent("open-wall-image", {
        detail: { src, alt },
      })
    );
  };

  return (
    <Html
      position={position}
      rotation={rotation}
      transform
      distanceFactor={1.5}
      style={{
        width,
        height,
        pointerEvents: "auto",
      }}
    >
      <img
        src={src}
        alt={alt}
        onClick={openImage}
        draggable={false}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "contain",
          cursor: "zoom-in",
          pointerEvents: "auto",
        }}
      />
    </Html>
  );
}