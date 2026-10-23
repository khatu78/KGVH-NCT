import { useEffect, useState } from "react";

export default function ImageFullscreen() {
  const [image, setImage] = useState(null);

  useEffect(() => {
    const open = (e) => setImage(e.detail);
    window.addEventListener("open-wall-image", open);
    return () => window.removeEventListener("open-wall-image", open);
  }, []);

  if (!image) return null;

  return (
    <div
      onClick={() => setImage(null)}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        background: "rgba(0,0,0,0.95)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <button
        onClick={() => setImage(null)}
        style={{
          position: "absolute",
          top: 20,
          right: 25,
          zIndex: 2,
          padding: "10px 16px",
          border: 0,
          borderRadius: 8,
          background: "#70472e",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        ✕ Đóng
      </button>

      <img
        src={image.src}
        alt={image.alt}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "95vw",
          maxHeight: "90vh",
          objectFit: "contain",
        }}
      />
    </div>
  );
}