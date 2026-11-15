import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Activity, ShieldCheck, Radio, Clock } from 'lucide-react';

interface TelemetryPoint {
  lat: number;
  lon: number;
  name: string;
  status: string;
  val: string;
}

export const CyberEarth3D: React.FC<{ className?: string; interactive?: boolean }> = ({
  className = '',
  interactive = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 700;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 240);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // 2. Earth Group (for synchronized mouse rotation)
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    // 3. Procedural Realistic Earth Texture Canvas
    const createEarthTexture = (): THREE.CanvasTexture => {
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Deep Emerald-Navy Ocean Base
        const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        oceanGrad.addColorStop(0, '#031412');
        oceanGrad.addColorStop(0.5, '#020C0B');
        oceanGrad.addColorStop(1, '#031412');
        ctx.fillStyle = oceanGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Technical Grid on Ocean
        ctx.strokeStyle = 'rgba(36, 230, 208, 0.08)';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 64) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 64) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }

        // Continents landmass shapes with cyber-emerald contours
        ctx.fillStyle = '#092521';
        ctx.strokeStyle = '#24E6D0';
        ctx.lineWidth = 2;

        const drawContinent = (pts: number[][]) => {
          ctx.beginPath();
          ctx.moveTo(pts[0][0], pts[0][1]);
          for (let i = 1; i < pts.length; i++) {
            ctx.lineTo(pts[i][0], pts[i][1]);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Dotted interior texture
          ctx.fillStyle = 'rgba(36, 230, 208, 0.25)';
          for (let i = 0; i < pts.length; i += 2) {
            ctx.beginPath();
            ctx.arc(pts[i][0], pts[i][1], 2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = '#092521';
        };

        // North America
        drawContinent([
          [300, 220], [420, 200], [520, 230], [560, 310], [500, 390],
          [440, 460], [380, 480], [330, 420], [280, 320], [260, 260]
        ]);
        // South America
        drawContinent([
          [480, 520], [570, 560], [610, 680], [560, 820], [500, 880],
          [460, 780], [440, 640]
        ]);
        // Europe
        drawContinent([
          [920, 220], [1050, 200], [1120, 260], [1090, 350], [980, 360],
          [910, 310]
        ]);
        // Africa
        drawContinent([
          [950, 400], [1100, 420], [1170, 530], [1140, 720], [1040, 800],
          [960, 720], [920, 550]
        ]);
        // Asia
        drawContinent([
          [1150, 180], [1400, 190], [1620, 260], [1680, 400], [1520, 500],
          [1360, 480], [1200, 380]
        ]);
        // Australia
        drawContinent([
          [1550, 680], [1700, 690], [1740, 800], [1640, 850], [1520, 780]
        ]);

        // City Lights / Telemetry Points
        ctx.fillStyle = '#8BFFE9';
        const cities = [
          [380, 320], [480, 300], [980, 280], [1040, 330],
          [1350, 350], [1560, 380], [1620, 760], [530, 680],
          [1080, 640], [1450, 420]
        ];
        cities.forEach(([cx, cy]) => {
          ctx.beginPath();
          ctx.arc(cx, cy, 4, 0, Math.PI * 2);
          ctx.fill();
        });
      }
      return new THREE.CanvasTexture(canvas);
    };

    const earthTexture = createEarthTexture();
    earthTexture.wrapS = THREE.RepeatWrapping;
    earthTexture.wrapT = THREE.ClampToEdgeWrapping;

    // 4. Earth Sphere Mesh
    const earthRadius = 75;
    const earthGeo = new THREE.SphereGeometry(earthRadius, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.6,
      metalness: 0.3,
      emissive: new THREE.Color(0x021a16),
      emissiveIntensity: 0.5,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earthMesh);

    // 5. Cloud Layer Sphere (Procedural animated transparency)
    const createCloudTexture = (): THREE.CanvasTexture => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        for (let i = 0; i < 70; i++) {
          const cx = Math.random() * canvas.width;
          const cy = Math.random() * canvas.height;
          const r = 20 + Math.random() * 60;
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      return new THREE.CanvasTexture(canvas);
    };

    const cloudTexture = createCloudTexture();
    cloudTexture.wrapS = THREE.RepeatWrapping;
    const cloudGeo = new THREE.SphereGeometry(earthRadius + 1.6, 48, 48);
    const cloudMat = new THREE.MeshStandardMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
    earthGroup.add(cloudMesh);

    // 6. Atmospheric Glow Aura
    const atmosphereGeo = new THREE.SphereGeometry(earthRadius + 8, 48, 48);
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
          gl_FragColor = vec4(0.14, 0.90, 0.81, 1.0) * intensity * 1.6;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    scene.add(atmosphereMesh);

    // 7. Orbital Rings with Satellites
    const createOrbitRing = (radius: number, tiltX: number, tiltY: number, color: number) => {
      const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, 2 * Math.PI, false, 0);
      const points = curve.getPoints(120);
      const ringGeo = new THREE.BufferGeometry().setFromPoints(
        points.map((p) => new THREE.Vector3(p.x, 0, p.y))
      );
      const ringMat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.45,
      });
      const ring = new THREE.Line(ringGeo, ringMat);
      ring.rotation.x = tiltX;
      ring.rotation.y = tiltY;
      scene.add(ring);
      return ring;
    };

    createOrbitRing(105, 0.5, 0.3, 0x24e6d0);
    createOrbitRing(122, -0.7, 0.4, 0x00afa0);

    // Satellites orbiting
    const satGeo = new THREE.SphereGeometry(1.4, 16, 16);
    const satMat = new THREE.MeshBasicMaterial({ color: 0x8bffe9 });
    const sat1 = new THREE.Mesh(satGeo, satMat);
    const sat2 = new THREE.Mesh(satGeo, satMat);
    scene.add(sat1);
    scene.add(sat2);

    // 8. Ground & Orbital Health Telemetry Nodes
    const telemetryNodes: TelemetryPoint[] = [
      { lat: 29.7, lon: -95.3, name: 'MISSION CONTROL HOUSTON', status: 'SYNCHRONIZED', val: 'MET Sol 142' },
      { lat: 51.5, lon: -0.1, name: 'ESA FLIGHT SURGEON DECK', status: 'ACTIVE TRIAGE', val: '100% NOMINAL' },
      { lat: 35.6, lon: 139.6, name: 'JAXA SPACE MEDICINE', status: 'TELEMETRY LINK', val: '98.4% READINESS' },
      { lat: -25.2, lon: 133.7, name: 'DEEP SPACE NETWORK RELAY', status: 'UPLINK STABLE', val: '4.8s MARS DELAY' },
    ];

    const latLonToVector3 = (lat: number, lon: number, radius: number): THREE.Vector3 => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    telemetryNodes.forEach((node) => {
      const pos = latLonToVector3(node.lat, node.lon, earthRadius + 0.8);
      // Pulsing node
      const nodeGeo = new THREE.SphereGeometry(1.6, 16, 16);
      const nodeMat = new THREE.MeshBasicMaterial({ color: 0x24e6d0 });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.copy(pos);
      earthGroup.add(nodeMesh);

      // Elevated beacon line
      const elevatedPos = latLonToVector3(node.lat, node.lon, earthRadius + 14);
      const lineGeo = new THREE.BufferGeometry().setFromPoints([pos, elevatedPos]);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x8bffe9, transparent: true, opacity: 0.7 });
      const beaconLine = new THREE.Line(lineGeo, lineMat);
      earthGroup.add(beaconLine);

      // Beacon beacon tip
      const tipGeo = new THREE.SphereGeometry(1.2, 16, 16);
      const tipMat = new THREE.MeshBasicMaterial({ color: 0x8bffe9 });
      const tipMesh = new THREE.Mesh(tipGeo, tipMat);
      tipMesh.position.copy(elevatedPos);
      earthGroup.add(tipMesh);
    });

    // 9. Fine Technical Connecting Arcs (Great Circle Splines)
    const p1 = latLonToVector3(29.7, -95.3, earthRadius + 1);
    const p2 = latLonToVector3(51.5, -0.1, earthRadius + 1);
    const mid = p1.clone().add(p2).multiplyScalar(0.5).normalize().multiplyScalar(earthRadius + 24);
    const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
    const arcPoints = curve.getPoints(50);
    const arcGeo = new THREE.BufferGeometry().setFromPoints(arcPoints);
    const arcMat = new THREE.LineBasicMaterial({ color: 0x24e6d0, transparent: true, opacity: 0.6 });
    const arcLine = new THREE.Line(arcGeo, arcMat);
    earthGroup.add(arcLine);

    // 10. Lighting (Emerald-Cyan Sun & Ambient)
    const dirLight = new THREE.DirectionalLight(0xffffff, 2.4);
    dirLight.position.set(120, 40, 100);
    scene.add(dirLight);

    const cyanRimLight = new THREE.DirectionalLight(0x24e6d0, 1.8);
    cyanRimLight.position.set(-100, 30, -50);
    scene.add(cyanRimLight);

    const ambientLight = new THREE.AmbientLight(0x041916, 1.2);
    scene.add(ambientLight);

    // 11. Mouse Parallax & Drag Interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationX = 0.2;
    let targetRotationY = -0.5;
    let mouseParallaxX = 0;
    let mouseParallaxY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      if (!interactive) return;
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / height) * 2 - 1);
      mouseParallaxX = normX * 0.08;
      mouseParallaxY = normY * 0.08;

      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      targetRotationY += deltaX * 0.005;
      targetRotationX += deltaY * 0.005;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    if (interactive) {
      container.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    // 12. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Slow idle rotation + user rotation
      if (!isDragging) {
        targetRotationY += 0.0018;
      }
      earthGroup.rotation.y += (targetRotationY - earthGroup.rotation.y) * 0.05;
      earthGroup.rotation.x += (targetRotationX + mouseParallaxY - earthGroup.rotation.x) * 0.05;

      // Cloud offset rotation
      cloudMesh.rotation.y += 0.0008;

      // Satellites orbital position
      const sat1Angle = elapsed * 0.6;
      sat1.position.set(
        Math.cos(sat1Angle) * 105,
        Math.sin(sat1Angle) * 25,
        Math.sin(sat1Angle) * 105
      );

      const sat2Angle = elapsed * -0.45;
      sat2.position.set(
        Math.cos(sat2Angle) * 122,
        Math.sin(sat2Angle) * -38,
        Math.sin(sat2Angle) * 122
      );

      // Camera parallax
      camera.position.x = mouseParallaxX * 30;
      camera.position.y = mouseParallaxY * 20;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // 13. Responsive Window Resize
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (interactive) {
        container.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      }
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      earthGeo.dispose();
      cloudGeo.dispose();
      atmosphereGeo.dispose();
    };
  }, [interactive]);

  return (
    <div className={`relative w-full h-full min-h-[540px] md:min-h-[640px] flex items-center justify-center overflow-hidden ${className}`}>
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing z-0" />

      {/* Atmospheric Radial Ambient Light */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_rgba(36,230,208,0.12)_0%,_rgba(0,175,160,0.04)_40%,_transparent_70%)]" />

      {/* Floating Glassmorphism Telemetry HUD Panels (Aegis AI Style) */}
      <div className="absolute inset-0 pointer-events-none p-4 md:p-8 flex flex-col justify-between z-10">
        {/* Top Left: Crew Status HUD */}
        <div className="self-start pointer-events-auto cyber-glass-glow rounded-xl p-3.5 max-w-[240px] border border-[#24E6D0]/30 transition-all hover:scale-105">
          <div className="flex items-center space-x-2 text-[10px] font-mono text-[#91A9A4] uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#24E6D0]" />
            <span>ARES-VI CREW READINESS</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-display font-extrabold text-2xl text-[#F4FAF8]">98.4%</span>
            <span className="font-mono text-[10px] text-[#24E6D0] uppercase font-bold">NOMINAL / FIT</span>
          </div>
          <div className="text-[10px] font-mono text-[#5B7B75] mt-1 flex items-center justify-between">
            <span>4 of 4 Active</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#24E6D0] animate-pulse" />
          </div>
        </div>

        {/* Top Right: Radiation & Mission Elapsed Time */}
        <div className="self-end pointer-events-auto cyber-glass-glow rounded-xl p-3.5 max-w-[240px] border border-[#24E6D0]/30 transition-all hover:scale-105 text-right">
          <div className="flex items-center justify-end space-x-2 text-[10px] font-mono text-[#91A9A4] uppercase tracking-wider mb-1">
            <span>SOL 142 TRANSIT</span>
            <Clock className="w-3.5 h-3.5 text-[#8BFFE9]" />
          </div>
          <div className="font-display font-extrabold text-xl text-[#F4FAF8] tabular-nums">
            0.28 <span className="text-xs font-mono text-[#91A9A4]">mSv/wk</span>
          </div>
          <div className="text-[10px] font-mono text-[#24E6D0] mt-0.5">
            PEL MARGIN: +91.6% SAFE
          </div>
        </div>

        {/* Bottom Left: Live Biometrics Cockpit */}
        <div className="self-start pointer-events-auto cyber-glass-glow rounded-xl p-3.5 max-w-[260px] border border-[#24E6D0]/30 transition-all hover:scale-105">
          <div className="flex items-center space-x-2 text-[10px] font-mono text-[#91A9A4] uppercase tracking-wider mb-1">
            <Activity className="w-3.5 h-3.5 text-[#24E6D0] animate-pulse" />
            <span>BIOMETRIC COCKPIT (ASTRO-01)</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-[#24E6D0]/15">
            <div>
              <span className="block font-mono text-[9px] text-[#5B7B75] uppercase">RESTING HR</span>
              <span className="font-mono font-bold text-base text-[#F4FAF8]">64 <span className="text-[10px] font-normal text-[#91A9A4]">BPM</span></span>
            </div>
            <div>
              <span className="block font-mono text-[9px] text-[#5B7B75] uppercase">SLEEP DURATION</span>
              <span className="font-mono font-bold text-base text-[#8BFFE9]">7.8 <span className="text-[10px] font-normal text-[#91A9A4]">HRS</span></span>
            </div>
          </div>
        </div>

        {/* Bottom Right: Emergency & Offline Resilience Status */}
        <div className="self-end pointer-events-auto cyber-glass-glow rounded-xl p-3.5 max-w-[240px] border border-[#24E6D0]/30 transition-all hover:scale-105">
          <div className="flex items-center justify-between text-[10px] font-mono text-[#91A9A4] uppercase tracking-wider mb-1">
            <span className="flex items-center space-x-1.5">
              <Radio className="w-3.5 h-3.5 text-[#24E6D0]" />
              <span>MARS UPLINK</span>
            </span>
            <span className="text-[#24E6D0] font-bold">ONLINE</span>
          </div>
          <div className="font-mono text-xs font-bold text-[#F4FAF8]">
            0 ACTIVE CRITICAL ALERTS
          </div>
          <div className="text-[10px] font-mono text-[#5B7B75] mt-1 flex items-center justify-between">
            <span>NASA STD-3001</span>
            <span className="text-[#8BFFE9]">OFFLINE CACHED</span>
          </div>
        </div>
      </div>

      {/* Orbit Interaction Hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none z-10 text-[9px] font-mono uppercase tracking-widest text-[#5B7B75] bg-[#020807]/80 px-3 py-1 rounded-full border border-[#24E6D0]/20 flex items-center space-x-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#24E6D0] animate-ping" />
        <span>INTERACTIVE 3D GLOBE · DRAG TO ROTATE & INSPECT TELEMETRY</span>
      </div>
    </div>
  );
};
