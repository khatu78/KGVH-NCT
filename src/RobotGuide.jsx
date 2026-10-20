
import { useEffect, useCallback } from "react";
import "./RobotGuide.css";

export default function RobotGuide({ active, visitor, audioRef }) {
  


 


const speak = useCallback(() => {
  const ageGroup = visitor?.ageGroup;
  const gender = visitor?.gender;

  let voiceFile = "";

  if (ageGroup === "under15") {
    voiceFile = "under15.mp3";
  } else if (ageGroup === "age15to34") {
    voiceFile = "15-35voice.mp3";
  } else if (ageGroup === "age35plus") {
    voiceFile = gender === "Nữ" ? "woman.mp3" : "men.mp3";
  }

  if (!voiceFile) return;

  const audio = audioRef?.current;
  const oldVolume = audio ? audio.volume : 0.45;

  // Dừng lời chào trước đó nếu có
  if (window.robotVoiceAudio) {
    window.robotVoiceAudio.pause();
    window.robotVoiceAudio.currentTime = 0;
  }

  const voice = new Audio(
    `${import.meta.env.BASE_URL}voice/${voiceFile}`
  );

  window.robotVoiceAudio = voice;
  voice.volume = 1;

  if (audio) audio.volume = 0.05;

  const restoreMusic = () => {
    if (audio) audio.volume = oldVolume;
  };

  voice.onended = restoreMusic;
  voice.onerror = restoreMusic;

  voice.play().catch((err) => {
    console.error("Không phát được file giọng đọc:", err);
    restoreMusic();
  });
}, [visitor, audioRef]);




  useEffect(() => {
    if (active) speak();

    return () => window.speechSynthesis?.cancel();
  }, [active, speak]);

  if (!active) return null;

  return (
    <div className="robot-guide">
      <div className="robot-character">
        <div className="robot-antenna" />
        <div className="robot-head">
          <div className="robot-eyes"><span /><span /></div>
          <div className="robot-mouth" />
        </div>
        <div className="robot-body">★</div>
        <div className="robot-arm left" />
        <div className="robot-arm right" />
      </div>

      <div className="robot-dialog">
        <strong>Robot hướng dẫn viên</strong>
        <p>{getGreeting()}</p>
        <button type="button" onClick={speak}>🔊 Nghe lại lời chào</button>
      </div>
    </div>
  );
}
