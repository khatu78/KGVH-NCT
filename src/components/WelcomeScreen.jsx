import React, { useState } from "react";

export default function WelcomeScreen({ onSubmit }) {
  const [visitor, setVisitor] = useState({
    name: "",
    ageGroup: "",
    gender: "Nam",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!visitor.name.trim() || !visitor.ageGroup || !visitor.gender) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    setError("");
    onSubmit(visitor);
  };

  return (
    <div className="welcome-page">
      <div className="welcome-card">
        <div className="welcome-badge">KHÔNG GIAN VĂN HÓA</div>
        <h1>Hồ Chí Minh</h1>
        <p className="welcome-description">
          Chào mừng bạn đến với không gian tham quan 3D. Hãy nhập thông tin để bắt đầu chuyến tham quan.
        </p>

        <form onSubmit={handleSubmit} className="visitor-form">
          <label>
            Họ và tên
            <input
              value={visitor.name}
              onChange={(e) => setVisitor({ ...visitor, name: e.target.value })}
              placeholder="Nhập họ và tên"
            />
          </label>

          <label>
            Nhóm độ tuổi
            <select
              value={visitor.ageGroup}
              onChange={(e) => setVisitor({ ...visitor, ageGroup: e.target.value })}
            >
              <option value="">-- Chọn nhóm độ tuổi --</option>
              <option value="under15">Dưới 15 tuổi</option>
              <option value="age15to34">Từ 15 đến dưới 35 tuổi</option>
              <option value="age35plus">Từ 35 tuổi trở lên</option>
            </select>
          </label>

          <label>
            Giới tính
            <select
              value={visitor.gender}
              onChange={(e) => setVisitor({ ...visitor, gender: e.target.value })}
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </label>

          {error && <div className="form-error">{error}</div>}

          <button type="submit" className="start-button">
            BẮT ĐẦU THAM QUAN
          </button>
        </form>
      </div>
    </div>
  );
}