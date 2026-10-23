import { Html } from "@react-three/drei";

export default function WallImage({ src, alt = "Hình ảnh trưng bày" }) {
  const openImage = () => {
    window.dispatchEvent(
      new CustomEvent("open-wall-image", { detail: { src, alt } })
    );
  };

  return (
    <Html transform distanceFactor={1.5}>
      <img
        src={src}
        alt={alt}
        onClick={openImage}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          cursor: "zoom-in",
        }}
      />
    </Html>
  );
}