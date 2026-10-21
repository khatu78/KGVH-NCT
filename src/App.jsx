import { useEffect, useRef, useState } from "react";
import WelcomeScreen from "./components/WelcomeScreen";
import NavigationPanel from "./components/NavigationPanel";
import MusicPlayer from "./components/MusicPlayer";
import MuseumCanvas from "./scenes/MuseumCanvas";
import RobotGuide from "./RobotGuide";
import { spots, spaces } from "./data/contentList";
import "./style.css";

export default function App() {
  const [room2Active, setRoom2Active] = useState(false);
  const [activeSpace, setActiveSpace] = useState(null);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [started, setStarted] = useState(false);
  const [visitor, setVisitor] = useState({ name: "", ageGroup: "", gender: "Nam" });
  
  const audioRef = useRef(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicTitle, setMusicTitle] = useState("");
  const [spotIndex, setSpotIndex] = useState(0);
  const [selectedExhibit, setSelectedExhibit] = useState(null);
  
  const [showMap, setShowMap] = useState(false);
  const [showPDF, setShowPDF] = useState(false);
  const [showPadlet, setShowPadlet] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showPortraitSlideshow, setShowPortraitSlideshow] = useState(false);
  const [activePortrait, setActivePortrait] = useState(1);
  const [activeChuS, setActiveChuS] = useState(0);

  // Event Listeners cho các tính năng mở popup/phòng
  useEffect(() => {
    const openPortrait = () => { setActivePortrait(1); setShowPortraitSlideshow(true); };
    const openLibrary = () => setShowLibrary(true);
    const openMap = () => setShowMap(true);

    window.addEventListener("open-portrait", openPortrait);
    window.addEventListener("open-library", openLibrary);
    window.addEventListener("open-map", openMap);

    const enterRoom2 = () => {
      setRoom2Active(true);
      setActiveSpace(null);
    };

    const leaveRoom2 = () => {
      setRoom2Active(false);
      setActiveSpace(null);
      setSpotIndex(0);
    };

    window.addEventListener("enter-second-room", enterRoom2);
    window.addEventListener("leave-second-room", leaveRoom2);

    return () => {
      window.removeEventListener("open-portrait", openPortrait);
      window.removeEventListener("open-library", openLibrary);
      window.removeEventListener("open-map", openMap);
      window.removeEventListener("enter-second-room", enterRoom2);
      window.removeEventListener("leave-second-room", leaveRoom2);
    };
  }, []);

  const moveToSpot = (nextIndex) => {
    if (nextIndex === spotIndex) return;
    setSpotIndex(nextIndex);
  };

  const handleSelectSpace = (space) => {
    setShowPDF(false);
    setShowPadlet(false);
    setSelectedSpace(space);
    setActiveSpace(space);
    setRoom2Active(true);
  };

  const handleNavigateSpot = (index) => {
    setSelectedSpace(null);
    setActiveSpace(null);
    setRoom2Active(false);

    if (index === 4) {
      window.open("https://hochiminh.vn/bao-tang-3d", "_blank", "noopener,noreferrer");
      return;
    }
    moveToSpot(index);
  };

  const returnToPreviousSpot = () => {
    setRoom2Active(false);
    setActiveSpace(null);
    setSelectedSpace(null);
    setSelectedExhibit(null);
    setSpotIndex(0);
  };

  const handleStart = (visitorData) => {
    setVisitor(visitorData);
    setStarted(true);

    const musicByAge = {
      under15: `${import.meta.env.BASE_URL}images/audio/under.mp3`,
      age15to34: `${import.meta.env.BASE_URL}images/audio/15-35.mp3`,
      age35plus: `${import.meta.env.BASE_URL}images/audio/35.mp3`,
    };

    const startTime = { under15: 17, age15to34: 17, age35plus: 30 };
    const titles = {
      under15: "Nhạc dành cho người dưới 15 tuổi",
      age15to34: "Nhạc dành cho người từ 15 đến dưới 35 tuổi",
      age35plus: "Nhạc dành cho người từ 35 tuổi trở lên",
    };

    const audio = new Audio(musicByAge[visitorData.ageGroup]);
    const start = startTime[visitorData.ageGroup] ?? 0;
    audio.volume = 0.45;
    audioRef.current = audio;

    setMusicTitle(titles[visitorData.ageGroup] ?? "Nhạc nền");

    audio.addEventListener("loadedmetadata", () => {
      audio.currentTime = Math.min(start, audio.duration);
    });

    audio.addEventListener("playing", () => setMusicPlaying(true));
    audio.addEventListener("pause", () => setMusicPlaying(false));
    audio.addEventListener("ended", () => {
      audio.currentTime = start;
      audio.play().catch(console.warn);
    });

    audio.play().catch(console.warn);
  };

  if (!started) {
    return <WelcomeScreen onSubmit={handleStart} />;
  }

  return (
    <div className="app">
      <RobotGuide active={started} visitor={visitor} audioRef={audioRef} />

      <MusicPlayer
        musicTitle={musicTitle}
        musicPlaying={musicPlaying}
        visitor={visitor}
        audioRef={audioRef}
      />

      <MuseumCanvas
        spotIndex={spotIndex}
        onMove={moveToSpot}
        onExhibit={setSelectedExhibit}
        onSpaceClick={handleSelectSpace}
        room2Active={room2Active}
        activeSpace={activeSpace}
        onSpaceArrive={setSelectedSpace}
      />

      <NavigationPanel
        room2Active={room2Active}
        spotIndex={spotIndex}
        activeSpace={activeSpace}
        onNavigateSpot={handleNavigateSpot}
        onSelectSpace={handleSelectSpace}
      />

      {/* Các Modal và Thư viện sách giữ nguyên hiển thị */}
      {showPDF && (
        <div style={{ position: "fixed", inset: 0, zIndex: 5000, background: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ width: "95vw", height: "90vh", background: "white", display: "flex", flexDirection: "column" }}>
            <button onClick={() => setShowPDF(false)} style={{ padding: 12, cursor: "pointer" }}>✕ Đóng tài liệu</button>
            <iframe src={`${import.meta.env.BASE_URL}doc/Phòng 1_Tóm tắt tiểu sử và sự nghiệp của Chủ tịch Hồ Chí Minh.pdf`} style={{ width: "100%", flex: 1, border: 0 }} title="PDF" />
          </div>
        </div>
      )}

      {showLibrary && (
        <div style={{ position: "fixed", inset: 0, zIndex: 4000, background: "#f5f0e6", overflowY: "auto", padding: 30, color: "#38271c" }}>
          <button onClick={() => setShowLibrary(false)} style={{ padding: "10px 18px", background: "#315c50", color: "#fff", cursor: "pointer" }}>← Quay lại không gian văn hoá</button>
          <h2>THƯ VIỆN SÁCH VỀ BÁC HỒ</h2>
        </div>
      )}

      <button className="return-button" onClick={returnToPreviousSpot} disabled={spotIndex === 0 && !room2Active}>
        ↩ Quay về lối vào
      </button>
    </div>
  );
}