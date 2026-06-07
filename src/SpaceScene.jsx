import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import {
  Sphere,
  MeshDistortMaterial,
  Environment,
  Float,
  Torus,
  TorusKnot,
} from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  Noise,
  Vignette,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

/* ─── Main morphing sphere ─── */
function MorphSphere({ scrollProgress }) {
  const ref = useRef();
  const matRef = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const sp = scrollProgress;

    // Aggressive rotation that accelerates with scroll
    ref.current.rotation.x = t * (0.08 + sp * 0.4);
    ref.current.rotation.y = t * (0.12 + sp * 0.3);
    ref.current.rotation.z = Math.sin(t * 0.4) * 0.2 * (1 + sp);

    // Scale pulsing
    const pulse = 1 + Math.sin(t * 1.5) * 0.03 + Math.cos(t * 0.8) * 0.02;
    const shrink = 1 - sp * 0.15;
    ref.current.scale.setScalar(pulse * shrink);

    if (matRef.current) {
      // Distortion ramps hard with scroll
      matRef.current.distort = THREE.MathUtils.lerp(0.3, 0.8, sp);
      matRef.current.speed = THREE.MathUtils.lerp(1.5, 5, sp);
    }
  });

  return (
    <Sphere ref={ref} args={[2, 128, 128]}>
      <MeshDistortMaterial
        ref={matRef}
        color="#1a1040"
        emissive="#4a2080"
        emissiveIntensity={0.15}
        roughness={0.2}
        metalness={0.8}
        clearcoat={1}
        clearcoatRoughness={0.1}
        distort={0.3}
        speed={1.5}
      />
    </Sphere>
  );
}

/* ─── Orbiting gold ring ─── */
function GoldRing({ scrollProgress, axis = 'x', radius = 3, speed = 1 }) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    if (axis === 'x') {
      ref.current.rotation.x = Math.PI * 0.5 + Math.sin(t * 0.2 * speed) * 0.3;
      ref.current.rotation.y = t * 0.1 * speed;
    } else {
      ref.current.rotation.y = Math.PI * 0.3 + Math.cos(t * 0.15 * speed) * 0.2;
      ref.current.rotation.x = t * 0.08 * speed;
    }
    ref.current.scale.setScalar(1 - scrollProgress * 0.05);
  });

  return (
    <Torus ref={ref} args={[radius, 0.012, 16, 150]}>
      <meshStandardMaterial
        color="#c9a84c"
        emissive="#c9a84c"
        emissiveIntensity={0.5}
        metalness={1}
        roughness={0.2}
      />
    </Torus>
  );
}

/* ─── Spinning torusKnot accent ─── */
function KnotAccent({ scrollProgress }) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = t * 0.15;
    ref.current.rotation.y = t * 0.2;
    const s = 0.3 + scrollProgress * 0.15;
    ref.current.scale.setScalar(s);
    ref.current.position.x = Math.sin(t * 0.3) * 0.5;
    ref.current.position.y = Math.cos(t * 0.25) * 0.5;
  });

  return (
    <TorusKnot ref={ref} args={[1, 0.3, 128, 16]}>
      <meshStandardMaterial
        color="#c9a84c"
        emissive="#c9a84c"
        emissiveIntensity={0.3}
        wireframe
        transparent
        opacity={0.25}
        metalness={1}
        roughness={0.1}
      />
    </TorusKnot>
  );
}

/* ─── Floating particles ─── */
function Particles() {
  const count = 120;
  const ref = useRef();
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 25;
      p[i * 3 + 1] = (Math.random() - 0.5) * 25;
      p[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return p;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.05;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#c9a84c" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

/* ─── Main Scene ─── */
export default function SpaceScene({ scrollProgress = 0 }) {
  const groupRef = useRef();
  const smoothed = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!groupRef.current) return;
    const sp = scrollProgress;
    const mouseX = state.mouse.x * 0.4;
    const mouseY = state.mouse.y * 0.4;

    // Dynamic scroll path — figure-8 pattern
    const scrollX = Math.sin(sp * Math.PI * 3) * 2.5;
    const scrollY = sp * -5;
    const scrollZ = Math.cos(sp * Math.PI * 2) * 1.5;

    const s = smoothed.current;
    s.x = THREE.MathUtils.lerp(s.x, mouseX + scrollX, 0.03);
    s.y = THREE.MathUtils.lerp(s.y, mouseY + scrollY, 0.03);

    groupRef.current.position.set(s.x, s.y, scrollZ);
  });

  return (
    <>
      <color attach="background" args={['#0a0a14']} />
      <fog attach="fog" args={['#0a0a14', 10, 35]} />

      <ambientLight intensity={0.15} color="#e8dff5" />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#f5f0ff" />
      <directionalLight position={[-4, -3, 3]} intensity={0.3} color="#c9a84c" />
      <pointLight position={[0, -6, 2]} intensity={15} color="#4a2080" distance={15} />
      <pointLight position={[6, 3, -3]} intensity={8} color="#c9a84c" distance={12} />

      <Float speed={0.6} rotationIntensity={0.1} floatIntensity={0.2}>
        <group ref={groupRef}>
          <MorphSphere scrollProgress={scrollProgress} />
          <GoldRing scrollProgress={scrollProgress} axis="x" radius={3} speed={1} />
          <GoldRing scrollProgress={scrollProgress} axis="y" radius={3.4} speed={0.7} />
          <KnotAccent scrollProgress={scrollProgress} />
        </group>
      </Float>

      <Particles />
      <Environment preset="night" />

      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.3} mipmapBlur intensity={1.2} radius={0.7} />
        <Noise opacity={0.04} blendFunction={BlendFunction.MULTIPLY} />
        <Vignette eskil={false} offset={0.15} darkness={0.7} />
      </EffectComposer>
    </>
  );
}
