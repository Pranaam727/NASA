import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export type HazardType = 'radiation' | 'isolation' | 'distance' | 'gravity' | 'environment';

interface HazardCanvasProps {
  hazard: HazardType;
}

export const HazardCanvas: React.FC<HazardCanvasProps> = ({ hazard }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const hazardRef = useRef<HazardType>(hazard);

  useEffect(() => {
    hazardRef.current = hazard;
  }, [hazard]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Dynamic objects based on hazard
    const group = new THREE.Group();
    scene.add(group);

    // 1. Cosmic Radiation Particle Flux
    const radParticleCount = 450;
    const radGeo = new THREE.BufferGeometry();
    const radPositions = new Float32Array(radParticleCount * 3);
    const radVelocities = new Float32Array(radParticleCount);

    for (let i = 0; i < radParticleCount; i++) {
      radPositions[i * 3] = (Math.random() - 0.5) * 12;
      radPositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      radPositions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      radVelocities[i] = 0.05 + Math.random() * 0.12;
    }
    radGeo.setAttribute('position', new THREE.BufferAttribute(radPositions, 3));
    const radMat = new THREE.PointsMaterial({
      color: 0xff3366,
      size: 0.12,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const radPoints = new THREE.Points(radGeo, radMat);
    group.add(radPoints);

    // Magnetic shield bubble
    const shieldGeo = new THREE.SphereGeometry(2.2, 32, 32);
    const shieldMat = new THREE.MeshBasicMaterial({
      color: 0x00d9ff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const shield = new THREE.Mesh(shieldGeo, shieldMat);
    group.add(shield);

    // Gravity field rings
    const gravityGroup = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const ringGeo = new THREE.RingGeometry(1.2 + i * 0.45, 1.25 + i * 0.45, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x8b6cff,
        transparent: true,
        opacity: 0.4 - i * 0.06,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2.2;
      gravityGroup.add(ring);
    }
    group.add(gravityGroup);

    // Central astronaut silhouette target
    const targetGeo = new THREE.CylinderGeometry(0.3, 0.25, 1.4, 16);
    const targetMat = new THREE.MeshStandardMaterial({
      color: 0x24324a,
      roughness: 0.4,
      metalness: 0.8,
    });
    const targetMesh = new THREE.Mesh(targetGeo, targetMat);
    group.add(targetMesh);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const current = hazardRef.current;

      group.rotation.y = t * 0.25;

      if (current === 'radiation') {
        shield.visible = true;
        gravityGroup.visible = false;
        radPoints.visible = true;
        radMat.color.setHex(0xff2a55);

        // Stream high energy ions from left to right through magnetic shield
        const pos = radGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < radParticleCount; i++) {
          pos[i * 3] += radVelocities[i];
          if (pos[i * 3] > 6) {
            pos[i * 3] = -6;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
          }
        }
        radGeo.attributes.position.needsUpdate = true;
        shield.scale.setScalar(1 + Math.sin(t * 4) * 0.05);
      } else if (current === 'gravity') {
        shield.visible = false;
        gravityGroup.visible = true;
        radPoints.visible = false;
        gravityGroup.children.forEach((c, idx) => {
          c.rotation.z = t * (0.4 + idx * 0.1);
        });
      } else if (current === 'distance') {
        shield.visible = true;
        gravityGroup.visible = false;
        radPoints.visible = true;
        radMat.color.setHex(0x00d9ff);
        shieldMat.color.setHex(0x65cfff);
        shield.scale.setScalar(1 + (t % 2) * 0.8);
      } else if (current === 'isolation') {
        shield.visible = true;
        gravityGroup.visible = false;
        radPoints.visible = true;
        radMat.color.setHex(0xb49aff);
        shieldMat.color.setHex(0x8b6cff);
        shield.rotation.y = t * 0.1;
      } else {
        // hostile closed environment
        shield.visible = true;
        gravityGroup.visible = true;
        radPoints.visible = true;
        radMat.color.setHex(0x00ffaa);
        shieldMat.color.setHex(0x00ffaa);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-48 md:h-56 rounded-xl overflow-hidden pointer-events-none"
      aria-hidden="true"
    />
  );
};
