
import { useEffect, useCallback } from "react";
import "./RobotGuide.css";

export default function RobotGuide({
  active = false,
  ageGroup = "under15",
  gender = "",
  triggerKey = 0,
}) {
  const getGreeting = useCallback(() => {
    if (ageGroup === "under15") {
      return "Xin chào em! Chào mừng em đến với Không gian văn hóa Hồ Chí Minh của Trường Trung học cơ sở Nguyễn Chí Thanh. Chúc em có chuyến tham quan thật vui và bổ ích nhé!";
    }

    if (ageGroup === "age15to34") {
      return "Xin chào bạn! Chào mừng bạn đến với Không gian văn hóa Hồ Chí Minh của Trường Trung học cơ sở Nguyễn Chí Thanh. Chúc bạn có những trải nghiệm thật thú vị!";
    }

    const greeting = gender === "female" ? "chị" : "anh";

    return `Xin chào ${greeting}! Chào mừng ${greeting} đến với Không gian văn hóa Hồ Chí Minh của Trường Trung học cơ sở Nguyễn Chí Thanh. Kính chúc ${greeting} có một chuyến tham quan thật ý nghĩa!`;
  }, [ageGroup, gender]);

  const speak = useCallback(() => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(getGreeting());
    utterance.lang = "vi-VN";
    utterance.rate = 0.9;
    utterance.pitch = 1.05;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const vietnameseVoice = voices.find(
      (voice) => voice.lang.toLowerCase() === "vi-vn"
    ) || voices.find(
      (voice) => voice.lang.toLowerCase().startsWith("vi")
    );

    if (vietnameseVoice) utterance.voice = vietnameseVoice;

    window.speechSynthesis.speak(utterance);
  }, [getGreeting]);

  useEffect(() => {
    if (active) speak();

    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [active, triggerKey, speak]);

  if (!active) return null;

  return (
    <div className="robot-guide">
      <div className="robot-character" aria-label="Robot hướng dẫn viên">
        <div className="robot-antenna" />
        <div className="robot-head">
          <div className="robot-eyes">
            <span />
            <span />
          </div>
          <div className="robot-mouth" />
        </div>
        <div className="robot-body">
          <span className="robot-emblem">★</span>
        </div>
        <div className="robot-arm robot-arm-left" />
        <div className="robot-arm robot-arm-right" />
      </div>

      <div className="robot-dialog">
        <div className="robot-dialog-title">
          Robot hướng dẫn viên
        </div>
        <p>{getGreeting()}</p>
        <button type="button" onClick={speak}>
          🔊 Nghe lại lời chào
        </button>
      </div>
    </div>
  );
}
