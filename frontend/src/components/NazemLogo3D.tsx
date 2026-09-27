"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text3D, Center, Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function ParticleRing() {
  const count = 250;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = (i / count) * Math.PI * 2;
      const radius = 3.2 + (Math.random() - 0.5) * 0.8;
      arr[i * 3]     = Math.cos(theta) * radius;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      arr[i * 3 + 2] = Math.sin(theta) * radius;
    }
    return arr;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.12;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#10b981" transparent opacity={0.85} sizeAttenuation />
    </points>
  );
}

function NazemText() {
  const groupRef = useRef<THREE.Group>(null);
  const matRef   = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.12;
      groupRef.current.position.y = Math.sin(t * 0.7) * 0.07;
    }
    if (matRef.current) {
      matRef.current.emissiveIntensity = 0.35 + Math.sin(t * 1.5) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      <Center>
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={0.95}
          height={0.22}
          curveSegments={20}
          bevelEnabled
          bevelThickness={0.03}
          bevelSize={0.018}
          bevelSegments={6}
        >
          NAZEM
          <meshStandardMaterial
            ref={matRef}
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={0.4}
            metalness={0.6}
            roughness={0.2}
          />
        </Text3D>
      </Center>
    </group>
  );
}

function GlowOrb() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.3 + Math.sin(clock.getElapsedTime() * 2) * 0.15;
    }
  });
  return (
    <mesh ref={ref} position={[0, 0, -1.5]}>
      <sphereGeometry args={[1.2, 32, 32]} />
      <meshStandardMaterial
        color="#10b981"
        emissive="#10b981"
        emissiveIntensity={0.3}
        transparent
        opacity={0.08}
      />
    </mesh>
  );
}

export default function NazemLogo3D() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[8, 8, 8]}   intensity={1.5} color="#10b981" />
        <pointLight position={[-8, -6, -6]} intensity={0.6} color="#6366f1" />
        <spotLight position={[0, 6, 5]} angle={0.4} intensity={2.5} color="#34d399" penumbra={0.6} castShadow />

        <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.25}>
          <NazemText />
        </Float>

        <ParticleRing />
        <GlowOrb />
        <Sparkles count={80} scale={9} size={1.8} speed={0.3} color="#10b981" opacity={0.45} />
      </Canvas>
    </div>
  );
}
