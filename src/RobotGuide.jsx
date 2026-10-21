import { useEffect, useCallback, useState } from "react";
import "./RobotGuide.css";

export default function RobotGuide({ active, visitor, audioRef }) {
  const [room2Text, setRoom2Text] = useState(false);
  const [voiceProgress, setVoiceProgress] = useState(0);

  useEffect(() => {
    if (!room2Text) return;

    setVoiceProgress(0);
    let count = 0;
    const text = "Đây là phòng trưng bày các chuyên đề.";

    const timer = setInterval(() => {
      count++;
      setVoiceProgress(count / text.length);

      if (count >= text.length) {
        clearInterval(timer);
      }
    }, 80);

    return () => clearInterval(timer);
  }, [room2Text]);

  useEffect(() => {
    const enter = () => setRoom2Text(true);
    const leave = () => setRoom2Text(false);

    window.addEventListener("enter-second-room", enter);
    window.addEventListener("leave-second-room", leave);

    return () => {
      window.removeEventListener("enter-second-room", enter);
      window.removeEventListener("leave-second-room", leave);
    };
  }, []);

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

    setVoiceProgress(0);

    voice.ontimeupdate = () => {
      if (voice.duration && Number.isFinite(voice.duration)) {
        setVoiceProgress(
          Math.min(voice.currentTime / voice.duration, 1)
        );
      }
    };

    if (audio) audio.volume = 0.05;

    const restoreMusic = () => {
      if (audio) audio.volume = oldVolume;
    };

    voice.onended = () => {
      setVoiceProgress(1);
      restoreMusic();
    };

    voice.onerror = () => {
      setVoiceProgress(1);
      restoreMusic();
    };

    voice.play().catch((err) => {
      console.error("Không phát được file giọng đọc:", err);
      restoreMusic();
    });
  }, [visitor, audioRef]);

  useEffect(() => {
    if (active && !room2Text) speak();
  }, [active, room2Text, speak]);

  if (!active) return null;

  // Xử lý text hiển thị tương ứng
  const room2Message = "Đây là phòng trưng bày các chuyên đề.";
  const welcomeMessage = 
    visitor?.ageGroup === "under15"
      ? `Xin chào em ${visitor?.name || ""}! Chào mừng em đến với Không gian văn hóa Hồ Chí Minh của Trường Trung học cơ sở Nguyễn Chí Thanh. Chúc em có một chuyến tham quan thật vui và bổ ích nhé!`
      : visitor?.ageGroup === "age15to34"
      ? `Xin chào bạn ${visitor?.name || ""}! Chào mừng bạn đến với Không gian văn hóa Hồ Chí Minh của Trường Trung học cơ sở Nguyễn Chí Thanh. Chúc bạn có những trải nghiệm thật thú vị!`
      : visitor?.ageGroup === "age35plus" && visitor?.gender === "Nam"
      ? `Xin chào anh ${visitor?.name || ""}! Chào mừng anh đến với Không gian văn hóa Hồ Chí Minh của Trường Trung học cơ sở Nguyễn Chí Thanh. Kính chúc anh có một chuyến tham quan thật ý nghĩa!`
      : visitor?.ageGroup === "age35plus" && visitor?.gender === "Nữ"
      ? `Xin chào chị ${visitor?.name || ""}! Chào mừng chị đến với Không gian văn hóa Hồ Chí Minh của Trường Trung học cơ sở Nguyễn Chí Thanh. Kính chúc chị có một chuyến tham quan thật ý nghĩa!`
      : "";

  const currentText = room2Text ? room2Message : welcomeMessage;

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
        <p>
          {currentText.slice(0, Math.ceil(currentText.length * voiceProgress))}
        </p>
        <button type="button" onClick={speak}>🔊 Nghe lại lời chào</button>
      </div>
    </div>
  );
}