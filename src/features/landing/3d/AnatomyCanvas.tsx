import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export type BiologicalSystemKey =
  | 'cardiovascular'
  | 'skeletal'
  | 'immune'
  | 'nervous'
  | 'metabolic'
  | 'sleep';

interface AnatomyCanvasProps {
  activeSystem: BiologicalSystemKey;
  onSelectSystem: (system: BiologicalSystemKey) => void;
}

export const AnatomyCanvas: React.FC<AnatomyCanvasProps> = ({
  activeSystem,
  onSelectSystem,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const activeSystemRef = useRef<BiologicalSystemKey>(activeSystem);

  useEffect(() => {
    activeSystemRef.current = activeSystem;
  }, [activeSystem]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070b, 0.04);

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 7.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0x0a1730, 1.5);
    scene.add(ambientLight);

    const cyanPointLight = new THREE.PointLight(0x00d9ff, 3.5, 20);
    cyanPointLight.position.set(2, 2, 5);
    scene.add(cyanPointLight);

    const purplePointLight = new THREE.PointLight(0x8b6cff, 2.5, 20);
    purplePointLight.position.set(-2, -1, 4);
    scene.add(purplePointLight);

    // 3. Holographic Human Model Root
    const humanGroup = new THREE.Group();
    humanGroup.position.set(0, -0.4, 0);
    scene.add(humanGroup);

    // Materials
    const holographicWireMat = new THREE.MeshBasicMaterial({
      color: 0x00d9ff,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });

    const holographicSkinMat = new THREE.MeshStandardMaterial({
      color: 0x0a2245,
      transparent: true,
      opacity: 0.35,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x002f5e,
      emissiveIntensity: 0.4,
    });

    // Outer Silhouette Body Mesh
    const headGeo = new THREE.SphereGeometry(0.35, 24, 24);
    const headMesh = new THREE.Mesh(headGeo, holographicSkinMat);
    headMesh.position.y = 2.45;
    humanGroup.add(headMesh);
    const headWire = new THREE.Mesh(headGeo, holographicWireMat);
    headWire.position.y = 2.45;
    humanGroup.add(headWire);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.14, 0.16, 0.25, 16);
    const neckMesh = new THREE.Mesh(neckGeo, holographicSkinMat);
    neckMesh.position.y = 2.05;
    humanGroup.add(neckMesh);

    // Chest & Torso
    const torsoGeo = new THREE.CylinderGeometry(0.48, 0.38, 1.25, 24);
    const torsoMesh = new THREE.Mesh(torsoGeo, holographicSkinMat);
    torsoMesh.position.y = 1.35;
    humanGroup.add(torsoMesh);
    const torsoWire = new THREE.Mesh(torsoGeo, holographicWireMat);
    torsoWire.position.y = 1.35;
    humanGroup.add(torsoWire);

    // Pelvis
    const pelvisGeo = new THREE.CylinderGeometry(0.38, 0.42, 0.5, 24);
    const pelvisMesh = new THREE.Mesh(pelvisGeo, holographicSkinMat);
    pelvisMesh.position.y = 0.55;
    humanGroup.add(pelvisMesh);

    // Arms
    const limbMat = holographicSkinMat;
    const limbWireMat = holographicWireMat;

    const armGeo = new THREE.CylinderGeometry(0.1, 0.08, 1.3, 16);
    const leftArm = new THREE.Mesh(armGeo, limbMat);
    leftArm.position.set(-0.65, 1.3, 0);
    leftArm.rotation.z = 0.12;
    humanGroup.add(leftArm);
    const leftArmWire = new THREE.Mesh(armGeo, limbWireMat);
    leftArmWire.position.set(-0.65, 1.3, 0);
    leftArmWire.rotation.z = 0.12;
    humanGroup.add(leftArmWire);

    const rightArm = new THREE.Mesh(armGeo, limbMat);
    rightArm.position.set(0.65, 1.3, 0);
    rightArm.rotation.z = -0.12;
    humanGroup.add(rightArm);
    const rightArmWire = new THREE.Mesh(armGeo, limbWireMat);
    rightArmWire.position.set(0.65, 1.3, 0);
    rightArmWire.rotation.z = -0.12;
    humanGroup.add(rightArmWire);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.14, 0.1, 1.8, 16);
    const leftLeg = new THREE.Mesh(legGeo, limbMat);
    leftLeg.position.set(-0.25, -0.55, 0);
    humanGroup.add(leftLeg);
    const leftLegWire = new THREE.Mesh(legGeo, limbWireMat);
    leftLegWire.position.set(-0.25, -0.55, 0);
    humanGroup.add(leftLegWire);

    const rightLeg = new THREE.Mesh(legGeo, limbMat);
    rightLeg.position.set(0.25, -0.55, 0);
    humanGroup.add(rightLeg);
    const rightLegWire = new THREE.Mesh(legGeo, limbWireMat);
    rightLegWire.position.set(0.25, -0.55, 0);
    humanGroup.add(rightLegWire);

    // 4. Biological Systems Groups
    // A. Cardiovascular Group
    const cardioGroup = new THREE.Group();
    const heartGeo = new THREE.SphereGeometry(0.15, 20, 20);
    const heartMat = new THREE.MeshBasicMaterial({ color: 0xff3366 });
    const heartMesh = new THREE.Mesh(heartGeo, heartMat);
    heartMesh.position.set(0.08, 1.48, 0.15);
    cardioGroup.add(heartMesh);

    // Aorta & Main Vessels
    const aortaCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.08, 1.48, 0.15),
      new THREE.Vector3(0.06, 1.72, 0.12),
      new THREE.Vector3(-0.02, 1.76, 0.08),
      new THREE.Vector3(-0.04, 1.15, 0.05),
      new THREE.Vector3(0, 0.55, 0.05),
      new THREE.Vector3(-0.2, -0.3, 0.05),
    ]);
    const aortaGeo = new THREE.TubeGeometry(aortaCurve, 32, 0.028, 8, false);
    const vesselMat = new THREE.MeshBasicMaterial({ color: 0xff2a55 });
    const aortaMesh = new THREE.Mesh(aortaGeo, vesselMat);
    cardioGroup.add(aortaMesh);

    // Carotid branches to head
    const carotidLeft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.45),
      vesselMat
    );
    carotidLeft.position.set(-0.06, 2.05, 0.08);
    cardioGroup.add(carotidLeft);

    const carotidRight = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.45),
      vesselMat
    );
    carotidRight.position.set(0.06, 2.05, 0.08);
    cardioGroup.add(carotidRight);

    humanGroup.add(cardioGroup);

    // B. Skeletal Group
    const skeletalGroup = new THREE.Group();
    const boneMat = new THREE.MeshBasicMaterial({ color: 0xe0e6ed });

    // Spine Column
    const spineGeo = new THREE.CylinderGeometry(0.035, 0.04, 1.4, 16);
    const spineMesh = new THREE.Mesh(spineGeo, boneMat);
    spineMesh.position.set(0, 1.25, -0.06);
    skeletalGroup.add(spineMesh);

    // Rib cage hoops
    for (let i = 0; i < 6; i++) {
      const ribGeo = new THREE.TorusGeometry(0.24 + i * 0.02, 0.015, 8, 24, Math.PI * 1.5);
      const ribMesh = new THREE.Mesh(ribGeo, boneMat);
      ribMesh.rotation.x = Math.PI / 2;
      ribMesh.rotation.z = Math.PI / 1.35;
      ribMesh.position.set(0, 1.7 - i * 0.1, 0.02);
      skeletalGroup.add(ribMesh);
    }
    humanGroup.add(skeletalGroup);

    // C. Nervous System Group
    const nervousGroup = new THREE.Group();
    const neuralMat = new THREE.MeshBasicMaterial({ color: 0x00d9ff });

    // Brain cortex
    const brainGeo = new THREE.SphereGeometry(0.24, 20, 20);
    const brainMesh = new THREE.Mesh(brainGeo, neuralMat);
    brainMesh.position.set(0, 2.52, 0.04);
    nervousGroup.add(brainMesh);

    // Spinal Cord nerve
    const nerveCordGeo = new THREE.CylinderGeometry(0.018, 0.012, 1.9, 12);
    const nerveCord = new THREE.Mesh(nerveCordGeo, neuralMat);
    nerveCord.position.set(0, 1.4, -0.04);
    nervousGroup.add(nerveCord);
    humanGroup.add(nervousGroup);

    // D. Immune System Group
    const immuneGroup = new THREE.Group();
    const immuneMat = new THREE.MeshBasicMaterial({ color: 0x65cfff });

    // Lymph nodes clusters
    const nodeCoords = [
      [-0.12, 2.05, 0.08], [0.12, 2.05, 0.08], // cervical
      [-0.45, 1.62, 0.05], [0.45, 1.62, 0.05], // axillary
      [-0.18, 0.45, 0.08], [0.18, 0.45, 0.08], // inguinal
      [0.18, 1.32, 0.05],  // spleen
    ];
    nodeCoords.forEach(([x, y, z]) => {
      const nodeMesh = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 12), immuneMat);
      nodeMesh.position.set(x, y, z);
      immuneGroup.add(nodeMesh);
    });
    humanGroup.add(immuneGroup);

    // E. Metabolic Group
    const metabolicGroup = new THREE.Group();
    const metabolicMat = new THREE.MeshBasicMaterial({ color: 0xffa028 });

    // Hepatic / Liver
    const liverGeo = new THREE.BoxGeometry(0.24, 0.16, 0.18);
    const liverMesh = new THREE.Mesh(liverGeo, metabolicMat);
    liverMesh.position.set(-0.12, 1.25, 0.12);
    metabolicGroup.add(liverMesh);

    // Pancreas
    const pancGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.18);
    const pancMesh = new THREE.Mesh(pancGeo, metabolicMat);
    pancMesh.rotation.z = Math.PI / 2.5;
    pancMesh.position.set(0.06, 1.15, 0.1);
    metabolicGroup.add(pancMesh);
    humanGroup.add(metabolicGroup);

    // F. Sleep & Circadian Group
    const sleepGroup = new THREE.Group();
    const sleepMat = new THREE.MeshBasicMaterial({ color: 0xb49aff });

    // Suprachiasmatic Nucleus (SCN) / Pineal gland
    const scnGeo = new THREE.SphereGeometry(0.07, 16, 16);
    const scnMesh = new THREE.Mesh(scnGeo, sleepMat);
    scnMesh.position.set(0, 2.45, 0.02);
    sleepGroup.add(scnMesh);

    // Circadian oscillation ring around head
    const circadianRingGeo = new THREE.RingGeometry(0.42, 0.44, 48);
    const circadianRing = new THREE.Mesh(circadianRingGeo, sleepMat);
    circadianRing.rotation.x = Math.PI / 2.2;
    circadianRing.position.set(0, 2.45, 0);
    sleepGroup.add(circadianRing);
    humanGroup.add(sleepGroup);

    // 5. Holographic Scanning Laser Plane
    const scanPlaneGeo = new THREE.RingGeometry(0.7, 0.73, 48);
    const scanPlaneMat = new THREE.MeshBasicMaterial({
      color: 0x00d9ff,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide,
    });
    const scanPlane = new THREE.Mesh(scanPlaneGeo, scanPlaneMat);
    scanPlane.rotation.x = Math.PI / 2;
    scanPlane.position.y = 1.4;
    scene.add(scanPlane);

    // 6. Interactive 3D Hotspot Hit Targets
    const hotspotMarkers: { key: BiologicalSystemKey; mesh: THREE.Mesh; pos: [number, number, number] }[] = [
      { key: 'cardiovascular', mesh: new THREE.Mesh(), pos: [0.08, 1.48, 0.28] },
      { key: 'skeletal', mesh: new THREE.Mesh(), pos: [0, 1.1, 0.28] },
      { key: 'nervous', mesh: new THREE.Mesh(), pos: [0, 2.5, 0.28] },
      { key: 'immune', mesh: new THREE.Mesh(), pos: [-0.42, 1.6, 0.28] },
      { key: 'metabolic', mesh: new THREE.Mesh(), pos: [-0.12, 1.22, 0.28] },
      { key: 'sleep', mesh: new THREE.Mesh(), pos: [0, 2.65, 0.28] },
    ];

    const hotspotGroup = new THREE.Group();
    hotspotMarkers.forEach((item) => {
      const discGeo = new THREE.RingGeometry(0.07, 0.09, 24);
      const discMat = new THREE.MeshBasicMaterial({
        color: 0x00d9ff,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
      });
      const disc = new THREE.Mesh(discGeo, discMat);
      disc.position.set(...item.pos);
      item.mesh = disc;
      hotspotGroup.add(disc);
    });
    humanGroup.add(hotspotGroup);

    // Raycaster for clicking hotspots
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mouse, camera);
      const meshes = hotspotMarkers.map((h) => h.mesh);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const hit = hotspotMarkers.find((h) => h.mesh === intersects[0].object);
        if (hit) {
          onSelectSystem(hit.key);
        }
      }
    };

    container.addEventListener('pointerdown', handlePointerDown);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Subtle body rotation and levitation
      humanGroup.rotation.y = Math.sin(t * 0.4) * 0.35;
      humanGroup.position.y = -0.4 + Math.sin(t * 0.8) * 0.06;

      // Scanning plane movement
      scanPlane.position.y = 1.0 + Math.sin(t * 1.5) * 1.4;
      scanPlane.rotation.z = t * 0.5;

      // Heartbeat pulse simulation
      const beat = 1 + Math.sin(t * 7.5) * 0.12 * (Math.sin(t * 7.5) > 0.4 ? 1.5 : 0.2);
      heartMesh.scale.set(beat, beat, beat);

      // Circadian ring oscillation
      circadianRing.rotation.z = t * 0.8;

      // Highlight active system visually
      const curr = activeSystemRef.current;
      cardioGroup.visible = curr === 'cardiovascular';
      skeletalGroup.visible = curr === 'skeletal';
      nervousGroup.visible = curr === 'nervous';
      immuneGroup.visible = curr === 'immune';
      metabolicGroup.visible = curr === 'metabolic';
      sleepGroup.visible = curr === 'sleep';

      // If a specific system is picked, boost its brightness
      const activeObj = {
        cardiovascular: cardioGroup,
        skeletal: skeletalGroup,
        nervous: nervousGroup,
        immune: immuneGroup,
        metabolic: metabolicGroup,
        sleep: sleepGroup,
      }[curr];

      if (activeObj) {
        activeObj.visible = true;
        activeObj.scale.setScalar(1 + Math.sin(t * 3.5) * 0.05);
      }

      // Hotspot ring pulsation
      hotspotMarkers.forEach((item, idx) => {
        const isSelected = item.key === curr;
        const scale = isSelected ? 1.4 + Math.sin(t * 5) * 0.2 : 1 + Math.sin(t * 2 + idx) * 0.1;
        item.mesh.scale.setScalar(scale);
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onSelectSystem]);

  return (
    <div className="relative w-full h-[540px] md:h-[620px] rounded-2xl overflow-hidden glass-panel border border-cyan-500/20">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute top-4 left-4 pointer-events-none flex items-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span className="text-xs font-mono text-cyan-300 tracking-wider">
          HOLOGRAPHIC BIOMEDICAL SCAN // 3D INTERACTIVE
        </span>
      </div>
      <div className="absolute bottom-4 left-4 pointer-events-none text-[11px] font-mono text-slate-400">
        Click hotspots or select tabs to focus physiological subsystem
      </div>
    </div>
  );
};
