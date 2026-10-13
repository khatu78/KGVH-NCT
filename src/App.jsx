        onClick={() => onExhibit(exhibits[1])}
      >
        <mesh>
          <boxGeometry args={[5.2, 3.1, 0.25]} />
          <meshStandardMaterial color="#20242a" />
        </mesh>
        <mesh position={[0, 0, 0.14]}>
          <planeGeometry args={[4.7, 2.6]} />
          <meshStandardMaterial color="#273d4d" />
        </mesh>
        <Text
          position={[0, 0, 0.2]}
          fontSize={0.36}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          VIDEO TƯ LIỆU
        </Text>


        
      </group>

      {/* Tủ sách */}
      <group
        position={[8, 2.2, -8.1]}
        onClick={() => onExhibit(exhibits[2])}
      >
        <mesh>
          <boxGeometry args={[3.6, 4.3, 0.65]} />
          <meshStandardMaterial color="#71472d" />
        </mesh>

        {[0.8, 1.5, 2.2, 2.9].map((y) => (
          <mesh key={y} position={[0, -2.15 + y, 0.36]}>
            <boxGeometry args={[3.2, 0.09, 0.05]} />
            <meshStandardMaterial color="#432b1c" />
          </mesh>
        ))}

        {[...Array(16)].map((_, i) => (
          <mesh
            key={i}
            position={[
              -1.35 + (i % 8) * 0.38,
              -1.65 + Math.floor(i / 8) * 1.4,
              0.42,
            ]}
          >
            <boxGeometry args={[0.25, 1, 0.08]} />
            <meshStandardMaterial
              color={i % 2 ? "#a87b51" : "#486b72"}
            />
          </mesh>
        ))}
      </group>

      {/* Tủ trưng bày */}
     

      {/* Bàn */}
      <group position={[-5, 0, 2]}>
        <mesh position={[0, 1.15, 0]} castShadow>
          <boxGeometry args={[2.6, 0.18, 1.25]} />
          <meshStandardMaterial color="#70472d" />
        </mesh>
        {[
          [-1, 0.55, -0.4],
          [1, 0.55, -0.4],
          [-1, 0.55, 0.4],
          [1, 0.55, 0.4],
        ].map((p, i) => (
          <mesh key={i} position={p}>
            <boxGeometry args={[0.13, 1.1, 0.13]} />
            <meshStandardMaterial color="#553522" />
          </mesh>
        ))}
      </group>

      {/* Cây */}
      <group position={[-9, 0, 5]}>
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[0.28, 0.38, 2, 16]} />
          <meshStandardMaterial color="#9b633b" />
        </mesh>
        <mesh position={[0, 2.5, 0]}>
          <sphereGeometry args={[1.1, 16, 12]} />
          <meshStandardMaterial color="#4e7750" />
        </mesh>
      </group>

      {/* Ánh sáng */}
      {[-7, 0, 7].map((x) => (
        <group key={x} position={[x, 5.15, -2]}>
          <mesh>
            <cylinderGeometry args={[0.35, 0.35, 0.15, 24]} />
            <meshStandardMaterial color="#d6b76d" />
          </mesh>
          <pointLight position={[0, -0.2, 0]} intensity={20} distance={9} />
        </group>
      ))}
       {/* Chữ KHU TRƯNG BÀY gắn trên vách tường bên phải */}
<group
  position={[11.78, 2.7, 1.5]}
  rotation={[0, -Math.PI / 2, 0]}
>
  <mesh>
    <boxGeometry args={[3.2, 0.65, 0.08]} />
    <meshStandardMaterial
      color="#5c1717"
      metalness={0.25}
      roughness={0.5}
    />
  </mesh>

  <Text
    position={[0, 0, 0.055]}
    fontSize={0.27}
    color="#ffd700"
    anchorX="center"
    anchorY="middle"
    textAlign="center"
  >
    KHU TRƯNG BÀY
  </Text>
</group>
    </group>

  
  );
}




function NavigationMarkers({ current, onMove }) {
  const signs = [
    { id: 0, position: [0, 0, 8.5] },   // Đặt lùi ra phía sau cửa vào
    { id: 1, position: [-4, 0, 4.5] },   // Biển bên trái
    { id: 2, position: [0, 0, 4.5] },    // Biển ở giữa nhưng đẩy lên xa (z = 4.5)
    { id: 3, position: [4, 0, 4.5] },    // Biển bên phải
    { id: 4, position: [8, 0, 3] },      // Biển khu trưng bày
  ];

  return (
    <group>
      {signs
        .filter((sign) => sign.id !== current) // Ẩn biển của vị trí đang đứng
        .map((sign) => (
          <ArrowMarker
            key={sign.id}
            position={sign.position}
            label={spots[sign.id].name}
            onClick={() => onMove(sign.id)}
          />
        ))}
    </group>
  );
}
