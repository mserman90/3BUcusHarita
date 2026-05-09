import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

interface Aircraft {
  hex: string;
  flight: string;
  lat: number;
  lon: number;
  alt_baro: number | "ground";
  track: number;
}

const PLANE_SCALE = 0.6;

const RealisticAirplane = React.memo(({ color = "#ffffff", darkColor = "#0f172a" }: { color?: string, darkColor?: string }) => {
  const wingShapeRight = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -1); 
    shape.lineTo(0, 2);  
    shape.lineTo(6, 4);  
    shape.lineTo(6, 2.5);  
    shape.lineTo(0, -1);
    return shape;
  }, []);

  const wingShapeLeft = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -1); 
    shape.lineTo(0, 2);  
    shape.lineTo(-6, 4);  
    shape.lineTo(-6, 2.5);  
    shape.lineTo(0, -1);
    return shape;
  }, []);

  const tailShapeRight = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0); 
    shape.lineTo(0, 1.5); 
    shape.lineTo(2.5, 2.5); 
    shape.lineTo(2.5, 1.5); 
    shape.lineTo(0, 0);
    return shape;
  }, []);

  const tailShapeLeft = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0); 
    shape.lineTo(0, 1.5); 
    shape.lineTo(-2.5, 2.5); 
    shape.lineTo(-2.5, 1.5); 
    shape.lineTo(0, 0);
    return shape;
  }, []);

  const verticalTailShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0); // root front
    shape.lineTo(2, 0); // root back
    shape.lineTo(2.8, 2.8); // tip back (swept back)
    shape.lineTo(1.2, 2.8); // tip front
    shape.lineTo(0, 0);
    return shape;
  }, []);

  const extrudeSettings = { depth: 0.1, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 2 };
  const vTailExtrudeSettings = { depth: 0.1, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 };

  return (
    <group>
      {/* Fuselage Nose */}
      <mesh position={[0, 0, -3.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.01, 1, 3, 32]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Fuselage Body */}
      <mesh position={[0, 0, 1]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1, 1, 6, 32]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Fuselage Tail Cone */}
      <mesh position={[0, 0, 5.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1, 0.1, 3, 32]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Cockpit Window */}
      <mesh position={[0, 0.55, -4.2]} rotation={[-Math.PI / 2 + 0.15, 0, 0]}>
        <cylinderGeometry args={[0.45, 0.6, 1, 16, 1, false, Math.PI * 0.75, Math.PI * 0.5]} />
        <meshStandardMaterial color={darkColor} roughness={0.1} metalness={0.8} />
      </mesh>

      {/* Right Wing */}
      <mesh position={[0.8, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <extrudeGeometry args={[wingShapeRight, extrudeSettings]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>

      {/* Left Wing */}
      <mesh position={[-0.8, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <extrudeGeometry args={[wingShapeLeft, extrudeSettings]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>

      {/* Right Engine */}
      <group position={[3, -0.6, 1]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.5, 0.4, 2, 16]} />
          <meshStandardMaterial color="#cccccc" roughness={0.4} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0, -1]} rotation={[-Math.PI / 2, 0, 0]}>
           <cylinderGeometry args={[0.4, 0.5, 0.2, 16]} />
           <meshStandardMaterial color="#111111" />
        </mesh>
      </group>

      {/* Left Engine */}
      <group position={[-3, -0.6, 1]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.5, 0.4, 2, 16]} />
          <meshStandardMaterial color="#cccccc" roughness={0.4} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0, -1]} rotation={[-Math.PI / 2, 0, 0]}>
           <cylinderGeometry args={[0.4, 0.5, 0.2, 16]} />
           <meshStandardMaterial color="#111111" />
        </mesh>
      </group>

      {/* Right Horizontal Stabilizer */}
      <mesh position={[0.4, 0.2, 5]} rotation={[-Math.PI / 2, 0, 0]}>
        <extrudeGeometry args={[tailShapeRight, extrudeSettings]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>

      {/* Left Horizontal Stabilizer */}
      <mesh position={[-0.4, 0.2, 5]} rotation={[-Math.PI / 2, 0, 0]}>
        <extrudeGeometry args={[tailShapeLeft, extrudeSettings]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>

      {/* Vertical Stabilizer */}
      <mesh position={[-0.05, 0.8, 5]} rotation={[0, Math.PI / 2, 0]}>
        <extrudeGeometry args={[verticalTailShape, vTailExtrudeSettings]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
    </group>
  );
});

function AirplaneItem({ ac, project }: { ac: Aircraft, project: (lat: number, lng: number, altFt: number) => THREE.Vector3 }) {
  const groupRef = useRef<THREE.Group>(null);
  const heading = ac.track ? -THREE.MathUtils.degToRad(ac.track) : 0;
  
  const alt = ac.alt_baro === "ground" ? 0 : ac.alt_baro || 0;
  const targetPos = useMemo(() => project(ac.lat, ac.lon, alt), [ac.lat, ac.lon, alt, project]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.position.lerp(targetPos, 2 * delta);
      // Smoothly interpolate rotation (specifically heading on Y-axis)
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, heading, 2 * delta);
    }
  });

  // initial instant placement
  useEffect(() => {
    if (groupRef.current) {
      // First spawn starts right at the target
      if (groupRef.current.position.length() === 0) {
        groupRef.current.position.copy(targetPos);
        groupRef.current.rotation.set(0, heading, 0);
      }
    }
  }, [targetPos, heading]);

  return (
    <group ref={groupRef}>
      <group scale={[PLANE_SCALE, PLANE_SCALE, PLANE_SCALE]}>
        <RealisticAirplane color="#f8fafc" darkColor="#020617" />
      </group>

      <Html
        position={[0, -5, 0]}
        center
        style={{
          pointerEvents: "none",
          color: "white",
          background: "rgba(0,0,0,0.6)",
          padding: "4px 8px",
          borderRadius: "6px",
          fontSize: "12px",
          whiteSpace: "nowrap",
          userSelect: "none",
          fontWeight: 600,
        }}
      >
        {ac.flight?.trim() || ac.hex}
        <br />
        <span style={{ fontSize: "10px", color: "#ddd" }}>
          {Math.round(alt)} ft
        </span>
      </Html>
    </group>
  );
}

export function LiveTraffic({ area }: { area: any }) {
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([]);
  
  if (!area || area.length < 2) return null;

  const refLat = (area[1].lat + area[0].lat) / 2;
  const refLng = (area[1].lng + area[0].lng) / 2;
  const scale = 51000;

  useEffect(() => {
    // Calculate radius in nautical miles
    const R = 3440.065; // Earth radius in NM
    const lat1 = area[0].lat * Math.PI / 180;
    const lat2 = area[1].lat * Math.PI / 180;
    const dLat = (area[1].lat - area[0].lat) * Math.PI / 180;
    const dLon = (area[1].lng - area[0].lng) * Math.PI / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distNM = R * c / 2;
    const radius = Math.max(5, Math.ceil(distNM + 5)); // Add padding

    const url = `/api/adsb?lat=${refLat}&lon=${refLng}&dist=${radius}`;

    let mounted = true;
    const fetchData = async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) {
           const errTxt = await res.text().catch(() => "");
           throw new Error(`ADSB fetch failed: ${res.status} ${errTxt.substring(0,100)}`);
        }
        
        const rawText = await res.text();
        let data;
        try {
          data = JSON.parse(rawText);
        } catch (e) {
          throw new Error(`Invalid JSON from ADSB: ${rawText.substring(0, 100)}`);
        }

        if (mounted && data.ac) {
          setAircrafts(data.ac);
        }
      } catch (err) {
        console.error("ADSB fetch error:", err);
      }
    };

    fetchData();
    const inv = setInterval(fetchData, 5000);
    return () => {
      mounted = false;
      clearInterval(inv);
    };
  }, [area, refLat, refLng]);

  const project = React.useCallback((lat: number, lng: number, altFt: number) => {
    const x = (lng - refLng) * scale * Math.cos((refLat * Math.PI) / 180);
    const z = (lat - refLat) * scale;
    
    const unitMeters = 2.179;
    const altMeters = altFt * 0.3048;
    const y = altMeters / unitMeters;

    return new THREE.Vector3(x, Math.max(y, 100), -z);
  }, [refLat, refLng]);

  return (
    <group>
      {aircrafts.map((ac) => {
        if (ac.lat == null || ac.lon == null) return null;
        return <AirplaneItem key={ac.hex} ac={ac} project={project} />;
      })}
    </group>
  );
}
