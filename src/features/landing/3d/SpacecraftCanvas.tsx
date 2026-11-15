import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const SpacecraftCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070b, 0.03);

    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // 1. Lighting
    const ambientLight = new THREE.AmbientLight(0x071124, 1.8);
    scene.add(ambientLight);

    const sunBeam = new THREE.DirectionalLight(0xa5d8ff, 3.2);
    sunBeam.position.set(-8, 6, 10);
    scene.add(sunBeam);

    const interiorLed = new THREE.PointLight(0x00d9ff, 1.5, 12);
    interiorLed.position.set(2, -1, 3);
    scene.add(interiorLed);

    // 2. Distant Earth & Stars Outside Window
    const starCount = 800;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 80;
      starPos[i + 1] = (Math.random() - 0.5) * 80;
      starPos[i + 2] = -25 - Math.random() * 40;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xe0f2fe,
      size: 0.22,
      transparent: true,
      opacity: 0.8,
    });
    scene.add(new THREE.Points(starGeo, starMat));

    // Curved Earth horizon visible through the window
    const earthRadius = 14;
    const earthGeo = new THREE.SphereGeometry(earthRadius, 48, 48);
    const earthMat = new THREE.MeshStandardMaterial({
      color: 0x0f3b6c,
      roughness: 0.7,
      metalness: 0.1,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthMesh.position.set(-6, -16.5, -8);
    scene.add(earthMesh);

    // Earth atmosphere glow rim
    const atmGeo = new THREE.SphereGeometry(earthRadius * 1.025, 48, 48);
    const atmMat = new THREE.MeshBasicMaterial({
      color: 0x00d9ff,
      transparent: true,
      opacity: 0.35,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const atmMesh = new THREE.Mesh(atmGeo, atmMat);
    atmMesh.position.copy(earthMesh.position);
    scene.add(atmMesh);

    // 3. Spacecraft Window Frame (Cupola Hexagonal Arch)
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x182030,
      metalness: 0.85,
      roughness: 0.35,
    });

    const windowGroup = new THREE.Group();
    windowGroup.position.set(0, 0, 0);

    // Outer bulkhead ring
    const bulkheadGeo = new THREE.TorusGeometry(3.6, 0.45, 16, 48);
    const bulkhead = new THREE.Mesh(bulkheadGeo, frameMat);
    windowGroup.add(bulkhead);

    // Window strut mullions
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const strutGeo = new THREE.CylinderGeometry(0.06, 0.06, 3.4, 12);
      const strut = new THREE.Mesh(strutGeo, frameMat);
      strut.rotation.z = angle;
      strut.position.set(Math.cos(angle) * 1.7, Math.sin(angle) * 1.7, 0.1);
      windowGroup.add(strut);
    }

    // Glass panel with subtle reflection
    const glassGeo = new THREE.CircleGeometry(3.5, 32);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x00d9ff,
      transparent: true,
      opacity: 0.08,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.9,
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.z = 0.05;
    windowGroup.add(glass);

    scene.add(windowGroup);

    // 4. Interior Holographic Telemetry HUD
    const hudGeo = new THREE.RingGeometry(1.6, 1.63, 48);
    const hudMat = new THREE.MeshBasicMaterial({
      color: 0x00d9ff,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
    });
    const hudRing = new THREE.Mesh(hudGeo, hudMat);
    hudRing.position.set(1.4, -0.6, 1.8);
    hudRing.rotation.y = -0.4;
    scene.add(hudRing);

    // Dust particles inside the cabin illuminated by sun
    const dustCount = 120;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPos[i] = (Math.random() - 0.5) * 5;
      dustPos[i + 1] = (Math.random() - 0.5) * 4;
      dustPos[i + 2] = Math.random() * 4 + 1;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.045,
      transparent: true,
      opacity: 0.4,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    window.addEventListener('mousemove', handleMouseMove);

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

      earthMesh.rotation.y = t * 0.015;
      hudRing.rotation.z = t * 0.15;

      // Camera floating motion
      camera.position.x += (mouseX * 0.4 - camera.position.x) * 0.03;
      camera.position.y += (mouseY * 0.3 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
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
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
      aria-hidden="true"
    />
  );
};
