"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function HeroScene() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const ribbonMaterial = new THREE.LineBasicMaterial({ color: 0x7c83ff, transparent: true, opacity: 0.28 });
    const ribbonMaterialSoft = new THREE.LineBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.16 });
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xc7d2fe,
      size: 0.045,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const createRibbon = (offsetY: number, amplitude: number, depth: number, material: THREE.LineBasicMaterial) => {
      const points = [] as THREE.Vector3[];
      for (let i = 0; i <= 80; i += 1) {
        const t = i / 80;
        const x = -6 + t * 12;
        const y = offsetY + Math.sin(t * Math.PI * 2.2) * amplitude;
        const z = depth + Math.cos(t * Math.PI * 2) * 0.4;
        points.push(new THREE.Vector3(x, y, z));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, material);
      group.add(line);
      return line;
    };

    const ribbons = [
      createRibbon(1.2, 0.5, -0.8, ribbonMaterial),
      createRibbon(-0.2, 0.35, -0.3, ribbonMaterialSoft),
      createRibbon(-1.4, 0.4, -1.1, ribbonMaterial),
    ];

    const particleCount = 120;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleMeta = Array.from({ length: particleCount }, (_, index) => ({
      x: THREE.MathUtils.randFloatSpread(12),
      y: THREE.MathUtils.randFloatSpread(5),
      z: THREE.MathUtils.randFloatSpread(3) - 1,
      speed: 0.15 + (index % 7) * 0.015,
    }));

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    group.add(particles);

    const resize = () => {
      const { clientWidth, clientHeight } = mount;
      if (!clientWidth || !clientHeight) return;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight, false);
    };

    resize();
    window.addEventListener("resize", resize);

    const clock = new THREE.Clock();
    let frameId = 0;

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      ribbons.forEach((ribbon, index) => {
        ribbon.rotation.z = Math.sin(elapsed * 0.18 + index) * 0.04;
        ribbon.position.x = Math.sin(elapsed * 0.12 + index * 0.7) * 0.18;
        ribbon.position.y = Math.cos(elapsed * 0.16 + index) * 0.08;
      });

      particleMeta.forEach((meta, index) => {
        const i = index * 3;
        particlePositions[i] = meta.x + Math.sin(elapsed * meta.speed + index) * 0.4;
        particlePositions[i + 1] = meta.y + Math.cos(elapsed * (meta.speed + 0.08) + index * 0.3) * 0.18;
        particlePositions[i + 2] = meta.z + Math.sin(elapsed * 0.22 + index * 0.1) * 0.12;
      });
      particleGeometry.attributes.position.needsUpdate = true;

      group.rotation.y = Math.sin(elapsed * 0.1) * 0.08;
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      particleGeometry.dispose();
      particleMaterial.dispose();
      ribbonMaterial.dispose();
      ribbonMaterialSoft.dispose();
      ribbons.forEach((ribbon) => ribbon.geometry.dispose());
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-90 [mask-image:radial-gradient(circle_at_center,black,transparent_88%)]"
    />
  );
}
