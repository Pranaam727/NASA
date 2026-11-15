import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const HeroCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070b, 0.025);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 16);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0x101a30, 1.2);
    scene.add(ambientLight);

    // Main Sun light
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.8);
    sunLight.position.set(20, 15, 25);
    scene.add(sunLight);

    // Deep space rim light (Electric Cyan)
    const rimLight = new THREE.DirectionalLight(0x00d9ff, 2.5);
    rimLight.position.set(-20, -10, -10);
    scene.add(rimLight);

    // Violet bounce light
    const bounceLight = new THREE.PointLight(0x8b6cff, 1.8, 30);
    bounceLight.position.set(4, -5, 8);
    scene.add(bounceLight);

    // 3. Cosmic Multi-layer Starfield
    const starCount = 2000;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const spectralColors = [
      new THREE.Color(0xffffff),
      new THREE.Color(0x65cfff),
      new THREE.Color(0x8b6cff),
      new THREE.Color(0xffe2aa),
    ];

    for (let i = 0; i < starCount; i++) {
      const idx = i * 3;
      starPositions[idx] = (Math.random() - 0.5) * 160;
      starPositions[idx + 1] = (Math.random() - 0.5) * 160;
      starPositions[idx + 2] = -20 - Math.random() * 80;

      const col = spectralColors[Math.floor(Math.random() * spectralColors.length)];
      starColors[idx] = col.r;
      starColors[idx + 1] = col.g;
      starColors[idx + 2] = col.b;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.28,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // 4. Procedural Photorealistic Earth
    const createEarthTexture = (): THREE.CanvasTexture => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;

      // Deep ocean gradient
      const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      oceanGrad.addColorStop(0, '#040d21');
      oceanGrad.addColorStop(0.5, '#07183d');
      oceanGrad.addColorStop(1, '#020917');
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Continents procedural blobs
      ctx.fillStyle = '#1e3a2f';
      for (let i = 0; i < 45; i++) {
        const x = (Math.sin(i * 1.7) * 0.5 + 0.5) * canvas.width;
        const y = (Math.cos(i * 1.3) * 0.4 + 0.5) * canvas.height;
        const r = 25 + (i % 7) * 18;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();

        // Terrain highlights
        ctx.fillStyle = '#2d533d';
        ctx.beginPath();
        ctx.arc(x + 5, y - 5, r * 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1e3a2f';
      }

      // Polar ice caps
      ctx.fillStyle = '#dbeeff';
      ctx.fillRect(0, 0, canvas.width, 35);
      ctx.fillRect(0, canvas.height - 35, canvas.width, 35);

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      return texture;
    };

    const earthRadius = 5.2;
    const earthGroup = new THREE.Group();
    earthGroup.position.set(-4.5, -2.8, -6);

    const earthGeo = new THREE.SphereGeometry(earthRadius, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      map: createEarthTexture(),
      roughness: 0.65,
      metalness: 0.15,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthMesh.rotation.z = 0.41; // Axial tilt ~23.5 degrees
    earthGroup.add(earthMesh);

    // Earth Atmosphere Cloud Layer
    const createCloudTexture = (): THREE.CanvasTexture => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      for (let i = 0; i < 80; i++) {
        const cx = Math.random() * canvas.width;
        const cy = 60 + Math.random() * (canvas.height - 120);
        const w = 40 + Math.random() * 90;
        const h = 15 + Math.random() * 35;
        ctx.beginPath();
        ctx.ellipse(cx, cy, w, h, Math.random() * 0.4 - 0.2, 0, Math.PI * 2);
        ctx.fill();
      }
      return new THREE.CanvasTexture(canvas);
    };

    const cloudGeo = new THREE.SphereGeometry(earthRadius * 1.025, 48, 48);
    const cloudMat = new THREE.MeshStandardMaterial({
      map: createCloudTexture(),
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
    earthGroup.add(cloudMesh);

    // Atmospheric Glow Rim
    const atmosphereGlowGeo = new THREE.SphereGeometry(earthRadius * 1.06, 48, 48);
    const atmosphereGlowMat = new THREE.MeshBasicMaterial({
      color: 0x00d9ff,
      transparent: true,
      opacity: 0.18,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const atmosphereGlow = new THREE.Mesh(atmosphereGlowGeo, atmosphereGlowMat);
    earthGroup.add(atmosphereGlow);

    scene.add(earthGroup);

    // 5. Holographic Orbital Navigation Rings
    const ringGroup = new THREE.Group();
    ringGroup.position.set(3.2, 0.5, 0);

    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x00d9ff,
      transparent: true,
      opacity: 0.25,
      wireframe: true,
    });
    const ringGeo1 = new THREE.RingGeometry(3.6, 3.65, 64);
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 2.3;
    ringGroup.add(ring1);

    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x8b6cff,
      transparent: true,
      opacity: 0.18,
      wireframe: true,
    });
    const ringGeo2 = new THREE.RingGeometry(4.2, 4.23, 64);
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = Math.PI / 1.9;
    ring2.rotation.y = 0.3;
    ringGroup.add(ring2);

    scene.add(ringGroup);

    // 6. Detailed 3D Spacesuit Astronaut Model (Procedural High-Detail Hierarchy)
    const astronaut = new THREE.Group();
    astronaut.position.set(3.4, -0.4, 3.5);
    astronaut.scale.set(1.15, 1.15, 1.15);

    // Suit Materials
    const suitFabricMat = new THREE.MeshStandardMaterial({
      color: 0xedf0f5,
      roughness: 0.75,
      metalness: 0.1,
    });

    const suitJointMat = new THREE.MeshStandardMaterial({
      color: 0x242833,
      roughness: 0.5,
      metalness: 0.3,
    });

    const goldVisorMat = new THREE.MeshStandardMaterial({
      color: 0xffb703,
      metalness: 0.95,
      roughness: 0.08,
      emissive: 0x3d2700,
      emissiveIntensity: 0.4,
    });

    const cyanLedMat = new THREE.MeshBasicMaterial({
      color: 0x00d9ff,
    });

    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.8,
      roughness: 0.2,
    });

    // A. Torso
    const torsoGeo = new THREE.CylinderGeometry(0.55, 0.48, 1.25, 24);
    const torsoMesh = new THREE.Mesh(torsoGeo, suitFabricMat);
    torsoMesh.position.y = 0.8;
    astronaut.add(torsoMesh);

    // Chest Control Module (DCM)
    const dcmGeo = new THREE.BoxGeometry(0.52, 0.45, 0.22);
    const dcmMesh = new THREE.Mesh(dcmGeo, suitJointMat);
    dcmMesh.position.set(0, 0.88, 0.48);
    astronaut.add(dcmMesh);

    // DCM Status LEDs & Display
    const dcmScreenGeo = new THREE.PlaneGeometry(0.32, 0.16);
    const dcmScreenMat = new THREE.MeshBasicMaterial({ color: 0x081326 });
    const dcmScreen = new THREE.Mesh(dcmScreenGeo, dcmScreenMat);
    dcmScreen.position.set(0, 0.92, 0.6);
    astronaut.add(dcmScreen);

    const ledGeo = new THREE.SphereGeometry(0.025, 12, 12);
    const ledCyan1 = new THREE.Mesh(ledGeo, cyanLedMat);
    ledCyan1.position.set(-0.16, 0.78, 0.6);
    astronaut.add(ledCyan1);

    const ledCyan2 = new THREE.Mesh(ledGeo, new THREE.MeshBasicMaterial({ color: 0x00ff88 }));
    ledCyan2.position.set(-0.1, 0.78, 0.6);
    astronaut.add(ledCyan2);

    // B. Helmet
    const helmetGroup = new THREE.Group();
    helmetGroup.position.set(0, 1.72, 0.05);

    const helmetBaseGeo = new THREE.SphereGeometry(0.48, 32, 32);
    const helmetBase = new THREE.Mesh(helmetBaseGeo, suitFabricMat);
    helmetGroup.add(helmetBase);

    // Helmet Collar Ring
    const collarGeo = new THREE.TorusGeometry(0.42, 0.05, 16, 32);
    const collar = new THREE.Mesh(collarGeo, goldTrimMat);
    collar.rotation.x = Math.PI / 2;
    collar.position.y = -0.32;
    helmetGroup.add(collar);

    // Gold Reflective Visor
    const visorGeo = new THREE.SphereGeometry(
      0.44,
      32,
      24,
      Math.PI * 0.15,
      Math.PI * 0.7,
      Math.PI * 0.2,
      Math.PI * 0.55
    );
    const visor = new THREE.Mesh(visorGeo, goldVisorMat);
    visor.position.set(0, 0.02, 0.08);
    helmetGroup.add(visor);

    // Helmet mounted floodlights
    const lightGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.08, 12);
    const leftLight = new THREE.Mesh(lightGeo, cyanLedMat);
    leftLight.rotation.z = Math.PI / 2;
    leftLight.position.set(-0.48, 0.1, 0.15);
    helmetGroup.add(leftLight);

    const rightLight = new THREE.Mesh(lightGeo, cyanLedMat);
    rightLight.rotation.z = -Math.PI / 2;
    rightLight.position.set(0.48, 0.1, 0.15);
    helmetGroup.add(rightLight);

    astronaut.add(helmetGroup);

    // C. PLSS (Primary Life Support System Backpack)
    const plssGeo = new THREE.BoxGeometry(0.85, 1.28, 0.44);
    const plssMesh = new THREE.Mesh(plssGeo, suitFabricMat);
    plssMesh.position.set(0, 0.9, -0.42);
    astronaut.add(plssMesh);

    // Cryo O2 Cylinders
    const o2CylinderGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.95, 16);
    const o2Left = new THREE.Mesh(o2CylinderGeo, goldTrimMat);
    o2Left.position.set(-0.25, 0.9, -0.66);
    astronaut.add(o2Left);

    const o2Right = new THREE.Mesh(o2CylinderGeo, goldTrimMat);
    o2Right.position.set(0.25, 0.9, -0.66);
    astronaut.add(o2Right);

    // D. Left Arm (Floating outward in microgravity)
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.62, 1.25, 0);

    const shoulderJointGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const leftShoulder = new THREE.Mesh(shoulderJointGeo, suitJointMat);
    leftArmGroup.add(leftShoulder);

    const bicepGeo = new THREE.CylinderGeometry(0.16, 0.14, 0.55, 16);
    const leftBicep = new THREE.Mesh(bicepGeo, suitFabricMat);
    leftBicep.position.set(-0.24, -0.22, 0.12);
    leftBicep.rotation.z = 0.5;
    leftBicep.rotation.x = -0.3;
    leftArmGroup.add(leftBicep);

    const leftForearm = new THREE.Mesh(bicepGeo, suitFabricMat);
    leftForearm.position.set(-0.48, -0.52, 0.35);
    leftForearm.rotation.z = 0.9;
    leftForearm.rotation.y = 0.4;
    leftArmGroup.add(leftForearm);

    // Glove
    const gloveGeo = new THREE.BoxGeometry(0.15, 0.22, 0.12);
    const leftGlove = new THREE.Mesh(gloveGeo, suitJointMat);
    leftGlove.position.set(-0.72, -0.72, 0.5);
    leftArmGroup.add(leftGlove);

    astronaut.add(leftArmGroup);

    // E. Right Arm (Gracefully raised toward display HUD)
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.62, 1.25, 0);

    const rightShoulder = new THREE.Mesh(shoulderJointGeo, suitJointMat);
    rightArmGroup.add(rightShoulder);

    const rightBicep = new THREE.Mesh(bicepGeo, suitFabricMat);
    rightBicep.position.set(0.24, -0.18, 0.18);
    rightBicep.rotation.z = -0.6;
    rightBicep.rotation.x = 0.2;
    rightArmGroup.add(rightBicep);

    const rightForearm = new THREE.Mesh(bicepGeo, suitFabricMat);
    rightForearm.position.set(0.48, -0.42, 0.45);
    rightForearm.rotation.z = -0.8;
    rightForearm.rotation.y = -0.5;
    rightArmGroup.add(rightForearm);

    const rightGlove = new THREE.Mesh(gloveGeo, suitJointMat);
    rightGlove.position.set(0.68, -0.55, 0.65);
    rightArmGroup.add(rightGlove);

    astronaut.add(rightArmGroup);

    // F. Legs (Floating relaxed microgravity posture)
    const leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(-0.28, 0.18, 0);

    const thighGeo = new THREE.CylinderGeometry(0.2, 0.16, 0.75, 16);
    const leftThigh = new THREE.Mesh(thighGeo, suitFabricMat);
    leftThigh.position.set(-0.08, -0.38, 0.12);
    leftThigh.rotation.x = 0.25;
    leftThigh.rotation.z = 0.12;
    leftLegGroup.add(leftThigh);

    const shinGeo = new THREE.CylinderGeometry(0.16, 0.14, 0.72, 16);
    const leftShin = new THREE.Mesh(shinGeo, suitFabricMat);
    leftShin.position.set(-0.14, -0.98, 0.35);
    leftShin.rotation.x = 0.55;
    leftLegGroup.add(leftShin);

    const bootGeo = new THREE.BoxGeometry(0.22, 0.24, 0.42);
    const leftBoot = new THREE.Mesh(bootGeo, suitJointMat);
    leftBoot.position.set(-0.18, -1.35, 0.58);
    leftLegGroup.add(leftBoot);

    astronaut.add(leftLegGroup);

    const rightLegGroup = new THREE.Group();
    rightLegGroup.position.set(0.28, 0.18, 0);

    const rightThigh = new THREE.Mesh(thighGeo, suitFabricMat);
    rightThigh.position.set(0.08, -0.38, -0.05);
    rightThigh.rotation.x = -0.15;
    rightThigh.rotation.z = -0.08;
    rightLegGroup.add(rightThigh);

    const rightShin = new THREE.Mesh(shinGeo, suitFabricMat);
    rightShin.position.set(0.12, -0.95, 0.08);
    rightShin.rotation.x = 0.32;
    rightLegGroup.add(rightShin);

    const rightBoot = new THREE.Mesh(bootGeo, suitJointMat);
    rightBoot.position.set(0.14, -1.32, 0.26);
    rightLegGroup.add(rightBoot);

    astronaut.add(rightLegGroup);

    // Initial astronaut posture tilt
    astronaut.rotation.y = -0.35;
    astronaut.rotation.x = 0.1;
    astronaut.rotation.z = -0.08;

    scene.add(astronaut);

    // 7. Floating Biometric Telemetry Particles
    const telemetryParticleCount = 180;
    const telemetryGeo = new THREE.BufferGeometry();
    const telemetryPositions = new Float32Array(telemetryParticleCount * 3);
    for (let i = 0; i < telemetryParticleCount * 3; i += 3) {
      telemetryPositions[i] = (Math.random() - 0.5) * 12 + 2;
      telemetryPositions[i + 1] = (Math.random() - 0.5) * 8;
      telemetryPositions[i + 2] = (Math.random() - 0.5) * 6 + 2;
    }
    telemetryGeo.setAttribute('position', new THREE.BufferAttribute(telemetryPositions, 3));
    const telemetryMat = new THREE.PointsMaterial({
      color: 0x00d9ff,
      size: 0.09,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const telemetryParticles = new THREE.Points(telemetryGeo, telemetryMat);
    scene.add(telemetryParticles);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 8. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Earth rotation
      earthMesh.rotation.y = elapsedTime * 0.035;
      cloudMesh.rotation.y = elapsedTime * 0.045;

      // Orbital rings rotation
      ring1.rotation.z = elapsedTime * 0.06;
      ring2.rotation.z = -elapsedTime * 0.04;

      // Astronaut Zero-G Floating Motion
      astronaut.position.y = -0.4 + Math.sin(elapsedTime * 0.9) * 0.16;
      astronaut.position.x = 3.4 + Math.cos(elapsedTime * 0.6) * 0.08;
      astronaut.rotation.z = -0.08 + Math.sin(elapsedTime * 0.7) * 0.04;
      astronaut.rotation.x = 0.1 + Math.cos(elapsedTime * 0.8) * 0.03;

      // Astronaut helmet subtle looking
      helmetGroup.rotation.y = Math.sin(elapsedTime * 0.5) * 0.12;
      helmetGroup.rotation.x = Math.cos(elapsedTime * 0.6) * 0.08;

      // Limbs micro-drift
      leftArmGroup.rotation.z = Math.sin(elapsedTime * 1.1) * 0.06;
      rightArmGroup.rotation.z = Math.cos(elapsedTime * 0.95) * 0.05;

      // Floating data particles drift
      const positions = telemetryGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < telemetryParticleCount * 3; i += 3) {
        positions[i] += 0.008;
        if (positions[i] > 5) positions[i] = -4;
      }
      telemetryGeo.attributes.position.needsUpdate = true;

      // Smooth mouse parallax camera
      targetCameraX = mouseX * 0.9;
      targetCameraY = mouseY * 0.6;
      camera.position.x += (targetCameraX - camera.position.x) * 0.04;
      camera.position.y += (targetCameraY - camera.position.y) * 0.04;
      camera.lookAt(0.5, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
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
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
};
