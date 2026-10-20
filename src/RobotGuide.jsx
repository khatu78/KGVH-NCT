
import { useEffect, useCallback } from "react";
import "./RobotGuide.css";

export default function RobotGuide({ active, visitor }) {
  const getGreeting = useCallback(() => {
    const age = visitor?.ageGroup;
    const gender = visitor?.gender;

    if (age === "under15") {
      return "Xin chào em! Chào mừng em đến với Không gian văn hóa Hồ Chí Minh của Trường Trung học cơ sở Nguyễn Chí Thanh. Chúc em có chuyến tham quan thật vui và bổ ích nhé!";
    }

    if (age === "age15to34") {
      return "Xin chào bạn! Chào mừng bạn đến với Không gian văn hóa Hồ Chí Minh của Trường Trung học cơ sở Nguyễn Chí Thanh. Chúc bạn có những trải nghiệm thật thú vị!";
    }

    const word = gender === "Nữ" ? "chị" : "anh";

    return `Xin chào ${word}! Chào mừng ${word} đến với Không gian văn hóa Hồ Chí Minh của Trường Trung học cơ sở Nguyễn Chí Thanh. Kính chúc ${word} có một chuyến tham quan thật ý nghĩa!`;
  }, [visitor?.ageGroup, visitor?.gender]);

  const speak = useCallback(() => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(getGreeting());
    utterance.lang = "vi-VN";
    utterance.rate = 0.9;

    const voice = window.speechSynthesis
      .getVoices()
      .find((v) => v.lang.toLowerCase().startsWith("vi"));

    if (voice) utterance.voice = voice;

    window.speechSynthesis.speak(utterance);
  }, [getGreeting]);

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
