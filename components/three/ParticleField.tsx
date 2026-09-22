"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 900;

function generateParticlePositions(): Float32Array {
  const array = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    array[i * 3] = (Math.random() - 0.5) * 18;
    array[i * 3 + 1] = (Math.random() - 0.5) * 10;
    array[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
  }
  return array;
}

const particlePositions = generateParticlePositions();

function Particles() {
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.02;
    pointsRef.current.position.y =
      Math.sin(state.clock.elapsedTime * 0.15) * 0.3;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particlePositions, 3]}
          count={PARTICLE_COUNT}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#25d0c0"
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export function ParticleField() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 55 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <fog attach="fog" args={["#05263b", 4, 12]} />
      <Particles />
    </Canvas>
  );
}
