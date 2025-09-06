import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";

type Props = {
  className?: string;
  title?: string;
  size?: number;   // pixel size of the square canvas
  color?: string;  // wireframe color
};

export default function TesseractLogo({
  className = "h-8 w-8",
  title = "LETHIMDO Logo",
  size = 96,
  color = "#00e5ff",
}: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Clean container
    container.innerHTML = "";

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    // Cyan glow using CSS filter (cheaper than post-processing)
    renderer.domElement.style.filter = "drop-shadow(0 0 12px rgba(0, 229, 255, 0.9))";
    container.appendChild(renderer.domElement);

    // Wireframe materials/geometries
    const wire = new THREE.LineBasicMaterial({ color: new THREE.Color(color) });
    const box = new THREE.BoxGeometry(1, 1, 1);
    const edges = new THREE.EdgesGeometry(box);

    const cubeInner = new THREE.LineSegments(edges, wire);
    const cubeOuter = new THREE.LineSegments(edges, wire);
    cubeOuter.scale.set(1.6, 1.6, 1.6);

    scene.add(cubeInner);
    scene.add(cubeOuter);

    // Connectors: link each inner vertex to the corresponding outer vertex
    const connectors: THREE.Line[] = [];
    const verts: Array<[number, number, number]> = [
      [-0.5, -0.5, -0.5], [-0.5, -0.5, 0.5], [-0.5, 0.5, -0.5], [-0.5, 0.5, 0.5],
      [0.5, -0.5, -0.5], [0.5, -0.5, 0.5], [0.5, 0.5, -0.5], [0.5, 0.5, 0.5],
    ];
    for (const [x, y, z] of verts) {
      const inner = new THREE.Vector3(x, y, z);
      const outer = inner.clone().multiplyScalar(1.6);
      const geom = new THREE.BufferGeometry().setFromPoints([inner, outer]);
      const line = new THREE.Line(geom, wire);
      scene.add(line);
      connectors.push(line);
    }

    camera.position.z = 3.2;

    let t = 0;
    const animate = () => {
      t += 0.01;

      // Inner/outer counter-rotation
      cubeInner.rotation.x += 0.012;
      cubeInner.rotation.y += 0.014;
      cubeOuter.rotation.x -= 0.006;
      cubeOuter.rotation.y -= 0.008;

      // Global slight wobble to show 3D angles
      scene.rotation.x = Math.sin(t) * 0.18;
      scene.rotation.y = Math.cos(t * 0.85) * 0.22;

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    // Hover nudge interaction
    const onEnter = () => {
      cubeInner.rotation.x += 0.2;
      cubeInner.rotation.y += 0.2;
    };
    container.addEventListener("mouseenter", onEnter);

    // Cleanup
    return () => {
      container.removeEventListener("mouseenter", onEnter);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      renderer.dispose();
      wire.dispose();
      edges.dispose();
      box.dispose();
      container.innerHTML = "";
    };
  }, [size, color]);

  return (
    <motion.div
      className={className}
      aria-label={title}
      role="img"
      style={{ width: size, height: size }}
      whileHover={{ scale: 1.08, rotate: 6, rotateX: -10, rotateY: 10 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
    >
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
    </motion.div>
  );
}