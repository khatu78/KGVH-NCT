import React from "react";

export default function MusicPlayer({ musicTitle, musicPlaying, visitor, audioRef }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 150,
        left: 16,
        zIndex: 1000,
        background: "rgba(20, 30, 45, 0.92)",
        color: "white",
        padding: "8px 10px",
        borderRadius: 10,
        minWidth: 305,
        boxSizing: "border-box",
        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: 8 }}>🎵 Nhạc nền tham quan</div>
      <div style={{ fontSize: 13, marginBottom: 10 }}>{musicTitle || "Chưa chọn nhạc"}</div>

      <button
        onClick={() => {
          const audio = audioRef.current;
          if (!audio) return;

          if (audio.paused) {
            if (audio.ended) {
              const startTime = { under15: 17, age15to34: 17, age35plus: 30 };
              audio.currentTime = startTime[visitor.ageGroup] ?? 0;
            }
            audio.play().catch(console.warn);
          } else {
            audio.pause();
          }
        }}
        style={{
          padding: "5px 10px",
          fontSize: 12,
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        {musicPlaying ? "⏸ Tạm dừng" : "▶ Phát nhạc"}
      </button>
    </div>
  );
}