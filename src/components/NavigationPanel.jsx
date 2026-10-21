import React, { useState } from "react";
import { spots, spaces } from "../data/contentList";

export default function NavigationPanel({ room2Active, spotIndex, activeSpace, onNavigateSpot, onSelectSpace }) {
  const [navCollapsed, setNavCollapsed] = useState(false);

  return (
    <div className={`navigation-panel ${navCollapsed ? "collapsed" : ""}`}>
      <button
        className="navigation-toggle"
        onClick={() => setNavCollapsed(!navCollapsed)}
        title={navCollapsed ? "Mở danh mục" : "Thu gọn danh mục"}
      >
        <span>☰</span>
        {!navCollapsed && <span>Danh mục tham quan</span>}
        <span>{navCollapsed ? "›" : "‹"}</span>
      </button>

      {!navCollapsed && (
        <div className="navigation-content">
          <div className="navigation-heading">PHÒNG 1 · SẢNH CHÍNH</div>

          {spots.map((spot) => (
            <button
              key={`spot-${spot.id}`}
              className={`navigation-item ${!room2Active && spotIndex === spot.id ? "active" : ""}`}
              onClick={() => onNavigateSpot(spot.id)}
            >
              <span className="navigation-number">{spot.id + 1}</span>
              <span>{spot.name}</span>
            </button>
          ))}

          <div className="navigation-heading">PHÒNG 2 · TRƯNG BÀY CHUYÊN ĐỀ</div>

          {spaces.map((space) => (
            <button
              key={`space-${space.id}`}
              className={`navigation-item ${activeSpace?.id === space.id ? "active" : ""}`}
              onClick={() => onSelectSpace(space)}
            >
              <span className="navigation-number">{space.id + 5}</span>
              <span>{space.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}