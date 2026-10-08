import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Text } from '@react-three/drei'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

const exhibits = [
  {
    id: 'portrait',
    title: 'Khu trưng bày hình ảnh',
    description:
      'Nơi giới thiệu hình ảnh, tư liệu và những dấu mốc tiêu biểu về Chủ tịch Hồ Chí Minh.',
    position: [-5.2, 2.2, -5.72],
  },
  {
    id: 'books',
    title: 'Góc sách và tư liệu',
    description:
      'Không gian giới thiệu sách, tài liệu và các tác phẩm viết về tư tưởng, đạo đức, phong cách Hồ Chí Minh.',
    position: [5.2, 2.2, -5.72],
  },
  {
    id: 'video',
    title: 'Màn hình tư liệu',
    description:
      'Khu vực có thể tích hợp video tư liệu, phóng sự hoặc sản phẩm học tập của học sinh.',
    position: [0, 2.25, -5.72],
  },
  {
    id: 'desk',
    title: 'Góc làm việc',
    description:
      'Không gian mô phỏng góc làm việc với bàn, sách và các tư liệu phục vụ hoạt động học tập.',
    position: [-5.8, 1.5, 2.7],
  },
  {
    id: 'display',
    title: 'Tủ hiện vật',
    description:
      'Khu vực dành cho các hình ảnh, hiện vật và sản phẩm trưng bày trong Không gian văn hóa Hồ Chí Minh.',
    position: [0, 1.3, -2.8],
  },
]

/* =========================================================
   ROOM
========================================================= */

function Room() {
  return (
    <group>
      {/* Sàn */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <boxGeometry args={[18, 0.3, 14]} />
        <meshStandardMaterial color="#765438" />
      </mesh>

      {/* Tường sau */}
      <mesh position={[0, 2.25, -6]} receiveShadow>
        <boxGeometry args={[18, 4.8, 0.3]} />
        <meshStandardMaterial color="#eee4d3" />
      </mesh>

      {/* Tường trái */}
      <mesh position={[-9, 2.25, 0]} receiveShadow>
        <boxGeometry args={[0.3, 4.8, 12]} />
        <meshStandardMaterial color="#d7c3a5" />
      </mesh>

      {/* Tường phải */}
      <mesh position={[9, 2.25, 0]} receiveShadow>
        <boxGeometry args={[0.3, 4.8, 12]} />
        <meshStandardMaterial color="#d7c3a5" />
      </mesh>

      {/* Trần */}
      <mesh position={[0, 4.7, 0]}>
        <boxGeometry args={[18, 0.3, 12]} />
        <meshStandardMaterial color="#e8dfd1" />
      </mesh>

      {/* Tiêu đề */}
      <Text
        position={[0, 4.05, -5.78]}
        fontSize={0.42}
        color="#861f1b"
        anchorX="center"
      >
        KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH
      </Text>

      <Text
        position={[0, 3.62, -5.78]}
        fontSize={0.17}
        color="#655b52"
        anchorX="center"
      >
        HỌC TẬP • TRẢI NGHIỆM • LAN TỎA GIÁ TRỊ VĂN HÓA
      </Text>

      {/* Khu trưng bày */}
      <ExhibitFrame
        position={[-5.2, 2.2, -5.72]}
        label="ẢNH TƯ LIỆU"
      />

      <ExhibitFrame
        position={[5.2, 2.2, -5.72]}
        label="SÁCH & TƯ LIỆU"
      />

      <VideoScreen position={[0, 2.25, -5.72]} />

      {/* Nội thất */}
      <Bookshelf position={[6.4, 1.35, -3.7]} />
      <Bookshelf position={[-6.5, 1.35, -3.7]} />

      <Plant position={[-7, 0, -1.4]} />
      <Plant position={[7, 0, 2.2]} />
      <Plant position={[-7, 0, 4]} />

      <Desk position={[-5.8, 0, 2.8]} />
      <Chair position={[-5.8, 0, 4]} />

      <DisplayCase position={[0, 0.05, -2.8]} />
      <DisplayCase position={[3.7, 0.05, 1.7]} />

      <Rug position={[0, 0.02, 2.7]} />

      {/* Bảng giới thiệu */}
      <InfoBoard position={[5.9, 2.25, 3.8]} />

      {/* Đèn */}
      <CeilingLight position={[-4, 4.3, -1]} />
      <CeilingLight position={[0, 4.3, -1]} />
      <CeilingLight position={[4, 4.3, -1]} />
      <CeilingLight position={[0, 4.3, 3.5]} />

      {/* Cửa */}
      <Door position={[0, 2, 5.85]} />
    </group>
  )
}

/* =========================================================
   EXHIBITION OBJECTS
========================================================= */

function ExhibitFrame({ position, label }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[3.4, 2.2, 0.14]} />
        <meshStandardMaterial color="#58371e" />
      </mesh>

      <mesh position={[0, 0, 0.09]}>
        <planeGeometry args={[3.16, 1.96]} />
        <meshStandardMaterial color="#d8c9b5" />
      </mesh>

      <Text
        position={[0, 0, 0.16]}
        fontSize={0.26}
        color="#7e211d"
        anchorX="center"
      >
        {label}
      </Text>
    </group>
  )
}

function VideoScreen({ position }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[4.1, 2.35, 0.18]} />
        <meshStandardMaterial color="#191919" />
      </mesh>

      <mesh position={[0, 0, 0.11]}>
        <planeGeometry args={[3.82, 2.05]} />
        <meshStandardMaterial color="#243d5a" />
      </mesh>

      <Text
        position={[0, 0.18, 0.2]}
        fontSize={0.29}
        color="white"
        anchorX="center"
      >
        MÀN HÌNH TƯ LIỆU
      </Text>

      <Text
        position={[0, -0.25, 0.2]}
        fontSize={0.15}
        color="#d9e5f2"
        anchorX="center"
      >
        VIDEO • TƯ LIỆU • SẢN PHẨM HỌC TẬP
      </Text>
    </group>
  )
}

function Bookshelf({ position }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[3, 2.8, 0.45]} />
        <meshStandardMaterial color="#634021" />
      </mesh>

      {[0, 1, 2].map((row) => (
        <mesh key={row} position={[0, row * 0.82 - 0.8, 0.27]}>
          <boxGeometry args={[2.7, 0.08, 0.55]} />
          <meshStandardMaterial color="#402817" />
        </mesh>
      ))}

      {Array.from({ length: 21 }, (_, i) => (
        <mesh
          key={i}
          position={[
            (i % 7) * 0.38 - 1.15,
            Math.floor(i / 7) * 0.82 - 0.43,
            0.32,
          ]}
          castShadow
        >
          <boxGeometry
            args={[
              0.27,
              0.5 + (i % 3) * 0.08,
              0.16,
            ]}
          />
          <meshStandardMaterial
            color={[
              '#8f302b',
              '#c39a43',
              '#315d53',
              '#5d4b78',
              '#8a633c',
            ][i % 5]}
          />
        </mesh>
      ))}
    </group>
  )
}

function Plant({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.38, 0.5, 0.7, 20]} />
        <meshStandardMaterial color="#a9613e" />
      </mesh>

      <mesh position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.68, 16, 12]} />
        <meshStandardMaterial color="#467244" />
      </mesh>

      <mesh position={[0.42, 1.35, 0.12]}>
        <sphereGeometry args={[0.55, 16, 12]} />
        <meshStandardMaterial color="#5b8750" />
      </mesh>

      <mesh position={[-0.4, 1.3, 0]}>
        <sphereGeometry args={[0.52, 16, 12]} />
        <meshStandardMaterial color="#537d49" />
      </mesh>
    </group>
  )
}

function Desk({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[3.1, 0.22, 1.4]} />
        <meshStandardMaterial color="#6d4324" />
      </mesh>

      {[
        [-1.2, 0.48, -0.48],
        [1.2, 0.48, -0.48],
        [-1.2, 0.48, 0.48],
        [1.2, 0.48, 0.48],
      ].map((p, i) => (
        <mesh key={i} position={p}>
          <boxGeometry args={[0.16, 1, 0.16]} />
          <meshStandardMaterial color="#4c2b18" />
        </mesh>
      ))}

      {/* sách trên bàn */}
      <mesh position={[-0.5, 1.18, 0]}>
        <boxGeometry args={[0.9, 0.16, 0.65]} />
        <meshStandardMaterial color="#8f302b" />
      </mesh>

      <mesh position={[0.5, 1.2, 0.05]}>
        <boxGeometry args={[0.8, 0.2, 0.55]} />
        <meshStandardMaterial color="#c49a44" />
      </mesh>

      {/* đèn bàn */}
      <mesh position={[1, 1.55, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.7, 12]} />
        <meshStandardMaterial color="#444" />
      </mesh>

      <mesh position={[1, 1.95, 0]}>
        <coneGeometry args={[0.35, 0.35, 16]} />
        <meshStandardMaterial color="#d5b26b" />
      </mesh>
    </group>
  )
}

function Chair({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[1.2, 0.18, 1.1]} />
        <meshStandardMaterial color="#633c24" />
      </mesh>

      <mesh position={[0, 1.4, 0.45]} castShadow>
        <boxGeometry args={[1.2, 1.1, 0.16]} />
        <meshStandardMaterial color="#633c24" />
      </mesh>

      <mesh position={[-0.45, 0.35, -0.4]}>
        <boxGeometry args={[0.12, 0.7, 0.12]} />
        <meshStandardMaterial color="#3f2617" />
      </mesh>

      <mesh position={[0.45, 0.35, -0.4]}>
        <boxGeometry args={[0.12, 0.7, 0.12]} />
        <meshStandardMaterial color="#3f2617" />
      </mesh>
    </group>
  )
}

function DisplayCase({ position }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[3, 1, 1.5]} />
        <meshStandardMaterial color="#765339" />
      </mesh>

      <mesh position={[0, 0.85, 0]} transparent>
        <boxGeometry args={[2.8, 0.8, 1.3]} />
        <meshPhysicalMaterial
          transmission={0.7}
          roughness={0.08}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* hiện vật */}
      <mesh position={[-0.65, 1.15, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 0.5, 16]} />
        <meshStandardMaterial color="#b8863b" />
      </mesh>

      <mesh position={[0, 1.18, 0]}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color="#9a3028" />
      </mesh>

      <mesh position={[0.7, 1.15, 0]}>
        <boxGeometry args={[0.4, 0.5, 0.4]} />
        <meshStandardMaterial color="#42685d" />
      </mesh>
    </group>
  )
}

function Rug({ position }) {
  return (
    <mesh position={position} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[6, 3.4]} />
      <meshStandardMaterial color="#8c2c26" />
    </mesh>
  )
}

function InfoBoard({ position }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[2.7, 2.4, 0.12]} />
        <meshStandardMaterial color="#5b3a20" />
      </mesh>

      <mesh position={[0, 0, 0.08]}>
        <planeGeometry args={[2.4, 2.1]} />
        <meshStandardMaterial color="#f1e5cf" />
      </mesh>

      <Text
        position={[0, 0.55, 0.15]}
        fontSize={0.22}
        color="#861f1b"
        anchorX="center"
      >
        GIỚI THIỆU
      </Text>

      <Text
        position={[0, 0.05, 0.15]}
        fontSize={0.13}
        color="#544b43"
        anchorX="center"
      >
        HỌC TẬP
      </Text>

      <Text
        position={[0, -0.28, 0.15]}
        fontSize={0.13}
        color="#544b43"
        anchorX="center"
      >
        TRẢI NGHIỆM
      </Text>

      <Text
        position={[0, -0.61, 0.15]}
        fontSize={0.13}
        color="#544b43"
        anchorX="center"
      >
        LAN TỎA
      </Text>
    </group>
  )
}

function CeilingLight({ position }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.25, 0.25, 0.08, 24]} />
        <meshStandardMaterial color="#d6c7a8" />
      </mesh>

      <pointLight
        position={[0, -0.15, 0]}
        intensity={8}
        distance={6}
        color="#ffe7b0"
      />
    </group>
  )
}

function Door({ position }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[3, 4, 0.25]} />
        <meshStandardMaterial color="#54321e" />
      </mesh>

      <mesh position={[0, 0.1, 0.14]}>
        <boxGeometry args={[2.5, 3.5, 0.08]} />
        <meshStandardMaterial color="#8a5730" />
      </mesh>

      <Text
        position={[0, 2.1, 0.2]}
        fontSize={0.22}
        color="#f2dfbb"
        anchorX="center"
      >
        LỐI VÀO
      </Text>
    </group>
  )
}

/* =========================================================
   CHARACTER
========================================================= */

function Character({ gender, onPositionChange }) {
  const ref = useRef()
  const keys = useRef({})
  const joystick = useRef({ x: 0, y: 0 })

  const [moving, setMoving] = useState(false)

  const cameraYaw = useRef(0)
  const cameraPitch = useRef(0.35)
  const cameraDistance = useRef(5.2)

  const [cameraState, setCameraState] = useState({
    yaw: 0,
    pitch: 0.35,
    distance: 5.2,
  })

  const isFemale = gender === 'Nữ'

  useEffect(() => {
    const down = (e) => {
      const key = e.key.toLowerCase()

      if (
        [
          'arrowup',
          'arrowdown',
          'arrowleft',
          'arrowright',
          'w',
          'a',
          's',
          'd',
        ].includes(key)
      ) {
        e.preventDefault()
        keys.current[key] = true
      }
    }

    const up = (e) => {
      keys.current[e.key.toLowerCase()] = false
    }

    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)

    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  useEffect(() => {
    const move = (e) => {
      joystick.current = {
        x: e.detail?.x || 0,
        y: e.detail?.y || 0,
      }
    }

    window.addEventListener('virtualJoystickMove', move)

    return () => {
      window.removeEventListener('virtualJoystickMove', move)
    }
  }, [])

  useEffect(() => {
    const cameraMove = (e) => {
      cameraYaw.current -= e.detail.dx * 0.006
      cameraPitch.current -= e.detail.dy * 0.004

      cameraPitch.current = THREE.MathUtils.clamp(
        cameraPitch.current,
        -0.05,
        1.15
      )
    }

    window.addEventListener('cameraLook', cameraMove)

    return () => {
      window.removeEventListener('cameraLook', cameraMove)
    }
  }, [])

  useEffect(() => {
    const zoom = (e) => {
      cameraDistance.current = THREE.MathUtils.clamp(
        cameraDistance.current + e.detail.amount,
        3.2,
        8
      )
    }

    window.addEventListener('cameraZoom', zoom)

    return () => {
      window.removeEventListener('cameraZoom', zoom)
    }
  }, [])

  useFrame((state, delta) => {
    if (!ref.current) return

    const k = keys.current

    let forward = 0
    let sideways = 0

    if (k.w || k.arrowup) forward += 1
    if (k.s || k.arrowdown) forward -= 1
    if (k.a || k.arrowleft) sideways -= 1
    if (k.d || k.arrowright) sideways += 1

    if (
      Math.abs(joystick.current.x) > 0.05 ||
      Math.abs(joystick.current.y) > 0.05
    ) {
      sideways = joystick.current.x
      forward = joystick.current.y
    }

    const movingNow =
      Math.abs(forward) > 0.05 || Math.abs(sideways) > 0.05

    if (movingNow) {
      const length = Math.hypot(sideways, forward)

      sideways /= length
      forward /= length

      const speed = 3.3

      const sin = Math.sin(cameraYaw.current)
      const cos = Math.cos(cameraYaw.current)

      const moveX =
        sideways * cos + forward * sin

      const moveZ =
        -sideways * sin + forward * cos

      ref.current.position.x += moveX * speed * delta
      ref.current.position.z += moveZ * speed * delta

      ref.current.position.x = THREE.MathUtils.clamp(
        ref.current.position.x,
        -7.8,
        7.8
      )

      ref.current.position.z = THREE.MathUtils.clamp(
        ref.current.position.z,
        -4.8,
        5
      )

      ref.current.rotation.y = Math.atan2(moveX, moveZ)
    }

    if (movingNow !== moving) {
      setMoving(movingNow)
    }

    /* Camera */

    const target = new THREE.Vector3(
      ref.current.position.x,
      ref.current.position.y + 1.05,
      ref.current.position.z
    )

    const horizontal =
      Math.cos(cameraState.pitch) * cameraDistance.current

    const cameraPosition = new THREE.Vector3(
      target.x - Math.sin(cameraYaw.current) * horizontal,
      target.y + Math.sin(cameraState.pitch) * cameraDistance.current,
      target.z - Math.cos(cameraYaw.current) * horizontal
    )

    state.camera.position.lerp(
      cameraPosition,
      1 - Math.pow(0.001, delta)
    )

    state.camera.lookAt(target)

    setCameraState((prev) => {
      if (
        Math.abs(prev.yaw - cameraYaw.current) > 0.03 ||
        Math.abs(prev.pitch - cameraPitch.current) > 0.03 ||
        Math.abs(prev.distance - cameraDistance.current) > 0.03
      ) {
        return {
          yaw: cameraYaw.current,
          pitch: cameraPitch.current,
          distance: cameraDistance.current,
        }
      }

      return prev
    })

    const nearest = exhibits
      .map((e) => ({
        ...e,
        distance: Math.hypot(
          ref.current.position.x - e.position[0],
          ref.current.position.z - e.position[2]
        ),
      }))
      .sort((a, b) => a.distance - b.distance)[0]

    onPositionChange(
      nearest && nearest.distance < 2.7
        ? nearest
        : null
    )
  })

  return (
    <group ref={ref} position={[0, 0, 4]}>
      {/* Thân */}
      <mesh castShadow position={[0, 0.9, 0]}>
        <capsuleGeometry args={[0.22, 0.55, 8, 16]} />
        <meshStandardMaterial
          color={isFemale ? '#8f3150' : '#315b7d'}
        />
      </mesh>

      {/* Đầu */}
      <mesh castShadow position={[0, 1.55, 0]}>
        <sphereGeometry args={[0.24, 20, 20]} />
        <meshStandardMaterial color="#d5a47d" />
      </mesh>

      {/* Tóc */}
      {isFemale ? (
        <>
          <mesh castShadow position={[0, 1.66, -0.03]}>
            <sphereGeometry args={[0.28, 20, 16]} />
            <meshStandardMaterial color="#251d19" />
          </mesh>

          <mesh
            castShadow
            position={[0.25, 1.4, 0]}
            scale={[0.65, 1.2, 0.65]}
          >
            <sphereGeometry args={[0.25, 16, 12]} />
            <meshStandardMaterial color="#251d19" />
          </mesh>
        </>
      ) : (
        <mesh castShadow position={[0, 1.68, 0]}>
          <sphereGeometry args={[0.26, 20, 14]} />
          <meshStandardMaterial color="#1d1a17" />
        </mesh>
      )}

      {/* Chân */}
      <mesh castShadow position={[-0.12, 0.25, 0]}>
        <capsuleGeometry args={[0.09, 0.35, 6, 10]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      <mesh castShadow position={[0.12, 0.25, 0]}>
        <capsuleGeometry args={[0.09, 0.35, 6, 10]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {moving && (
        <Text
          position={[0, 2.15, 0]}
          fontSize={0.12}
          color="white"
          anchorX="center"
        >
          Đang tham quan
        </Text>
      )}
    </group>
  )
}

/* =========================================================
   VIRTUAL JOYSTICK
========================================================= */

function VirtualJoystick() {
  const [active, setActive] = useState(false)

  const start = (e) => {
    e.preventDefault()
    setActive(true)
    update(e)
  }

  const update = (e) => {
    const touch = e.touches?.[0] || e
    const rect = e.currentTarget.getBoundingClientRect()

    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    let x = (touch.clientX - centerX) / (rect.width / 2)
    let y = -(touch.clientY - centerY) / (rect.height / 2)

    x = THREE.MathUtils.clamp(x, -1, 1)
    y = THREE.MathUtils.clamp(y, -1, 1)

    window.dispatchEvent(
      new CustomEvent('virtualJoystickMove', {
        detail: { x, y },
      })
    )
  }

  const end = () => {
    setActive(false)

    window.dispatchEvent(
      new CustomEvent('virtualJoystickMove', {
        detail: { x: 0, y: 0 },
      })
    )
  }

  return (
    <div
      className={`joystick ${active ? 'active' : ''}`}
      onTouchStart={start}
      onTouchMove={update}
      onTouchEnd={end}
    >
      <div className="joystick-knob" />
    </div>
  )
}

/* =========================================================
   CAMERA TOUCH CONTROL
========================================================= */

function CameraTouchControl() {
  const last = useRef(null)

  const start = (e) => {
    const point = e.touches?.[0]

    if (!point) return

    last.current = {
      x: point.clientX,
      y: point.clientY,
    }
  }

  const move = (e) => {
    const point = e.touches?.[0]

    if (!point || !last.current) return

    const dx = point.clientX - last.current.x
    const dy = point.clientY - last.current.y

    last.current = {
      x: point.clientX,
      y: point.clientY,
    }

    window.dispatchEvent(
      new CustomEvent('cameraLook', {
        detail: { dx, dy },
      })
    )
  }

  const end = () => {
    last.current = null
  }

  return (
    <div
      className="camera-touch"
      onTouchStart={start}
      onTouchMove={move}
      onTouchEnd={end}
    />
  )
}

/* =========================================================
   DESKTOP MOUSE CAMERA
========================================================= */

function MouseCameraControl() {
  const dragging = useRef(false)
  const last = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const down = (e) => {
      if (e.button !== 0) return

      dragging.current = true
      last.current = {
        x: e.clientX,
        y: e.clientY,
      }
    }

    const move = (e) => {
      if (!dragging.current) return

      const dx = e.clientX - last.current.x
      const dy = e.clientY - last.current.y

      last.current = {
        x: e.clientX,
        y: e.clientY,
      }

      window.dispatchEvent(
        new CustomEvent('cameraLook', {
          detail: { dx, dy },
        })
      )
    }

    const up = () => {
      dragging.current = false
    }

    const wheel = (e) => {
      window.dispatchEvent(
        new CustomEvent('cameraZoom', {
          detail: {
            amount: e.deltaY * 0.004,
          },
        })
      )
    }

    window.addEventListener('mousedown', down)
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
    window.addEventListener('wheel', wheel, {
      passive: true,
    })

    return () => {
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
      window.removeEventListener('wheel', wheel)
    }
  }, [])

  return null
}

/* =========================================================
   APP
========================================================= */

export default function App() {
  const [started, setStarted] = useState(false)
  const [near, setNear] = useState(null)
  const [selected, setSelected] = useState(null)

  const [visitor, setVisitor] = useState({
    name: '',
    age: '',
    gender: '',
  })

  const submit = (e) => {
    e.preventDefault()

    if (!visitor.name.trim()) return

    setStarted(true)
  }

  const characterGender =
    visitor.gender === 'Nữ'
      ? 'Nữ'
      : 'Nam'

  return (
    <div className="app">
      {!started && (
        <div className="welcome">
          <div className="card">
            <div className="eyebrow">
              KHÔNG GIAN TRẢI NGHIỆM 3D
            </div>

            <h1>
              Không gian văn hóa
              <br />
              Hồ Chí Minh
            </h1>

            <p>
              Hãy nhập thông tin để bắt đầu tham quan
              không gian triển lãm 3D.
            </p>

            <form onSubmit={submit}>
              <label>
                Tên hiển thị
                <input
                  value={visitor.name}
                  onChange={(e) =>
                    setVisitor({
                      ...visitor,
                      name: e.target.value,
                    })
                  }
                  placeholder="Ví dụ: Nguyễn An"
                />
              </label>

              <div className="row">
                <label>
                  Tuổi
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={visitor.age}
                    onChange={(e) =>
                      setVisitor({
                        ...visitor,
                        age: e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Giới tính
                  <select
                    value={visitor.gender}
                    onChange={(e) =>
                      setVisitor({
                        ...visitor,
                        gender: e.target.value,
                      })
                    }
                  >
                    <option value="">
                      Chọn
                    </option>

                    <option value="Nam">
                      Nam
                    </option>

                    <option value="Nữ">
                      Nữ
                    </option>

                    <option value="Khác">
                      Khác
                    </option>

                    <option value="Không muốn trả lời">
                      Không muốn trả lời
                    </option>
                  </select>
                </label>
              </div>

              <div className="character-preview">
                <span>Nhân vật:</span>

                <strong>
                  {characterGender === 'Nữ'
                    ? '👩 Nữ'
                    : '👨 Nam'}
                </strong>
              </div>

              <div className="note">
                Thông tin này hiện chỉ dùng trong phiên
                tham quan và chưa được lưu lên máy chủ.
              </div>

              <button type="submit">
                Bắt đầu tham quan →
              </button>
            </form>
          </div>
        </div>
      )}

      {started && (
        <>
          <div className="hud">
            <div className="hud-title">
              <b>
                Không gian văn hóa Hồ Chí Minh
              </b>

              <span>
                Xin chào, {visitor.name}
              </span>
            </div>

            <div className="controls">
              <b>↑ ↓ ← →</b>
              <span>Di chuyển</span>
              <span>•</span>
              <b>Chuột kéo</b>
              <span>Xoay camera</span>
            </div>
          </div>

          <Canvas
            shadows
            camera={{
              position: [0, 2.5, 8],
              fov: 55,
            }}
            dpr={[1, 1.7]}
          >
            <color
              attach="background"
              args={['#b9c7d6']}
            />

            <ambientLight intensity={1.15} />

            <directionalLight
              castShadow
              position={[4, 8, 5]}
              intensity={2}
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />

            <Environment preset="city" />

            <Room />

            <Character
              gender={characterGender}
              onPositionChange={setNear}
            />
          </Canvas>

          <MouseCameraControl />

          <CameraTouchControl />

          <div className="mobile-controls">
            <VirtualJoystick />

            <div className="camera-hint">
              Kéo bên phải
              <br />
              để xoay nhìn
            </div>
          </div>

          <div className="bottom">
            👤 {visitor.name}
            <span>•</span>
            {characterGender === 'Nữ'
              ? 'Nhân vật nữ'
              : 'Nhân vật nam'}
          </div>

          {near && (
            <button
              className="interaction"
              onClick={() => setSelected(near)}
            >
              <small>ĐANG Ở GẦN</small>

              <strong>
                {near.title}
              </strong>

              <span>
                Nhấn để xem nội dung
              </span>
            </button>
          )}

          {selected && (
            <div
              className="backdrop"
              onClick={() => setSelected(null)}
            >
              <div
                className="modal"
                onClick={(e) =>
                  e.stopPropagation()
                }
              >
                <button
                  className="close"
                  onClick={() =>
                    setSelected(null)
                  }
                >
                  ×
                </button>

                <div className="eyebrow">
                  KHU TRƯNG BÀY
                </div>

                <h2>
                  {selected.title}
                </h2>

                <p>
                  {selected.description}
                </p>

                <div className="future-content">
                  📷 Hình ảnh / 🎬 video / 📚
                  tư liệu thật sẽ được tích hợp
                  vào khu vực này.
                </div>

                <button
                  onClick={() =>
                    setSelected(null)
                  }
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
