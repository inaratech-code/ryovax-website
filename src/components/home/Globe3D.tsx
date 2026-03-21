"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sphere, Line, Preload, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function RotatingGlobe() {
    const groupRef = useRef<THREE.Group>(null);
    const { mouse } = useThree();

    // Rotate slowly and add parallax
    useFrame((state, delta) => {
        if (!groupRef.current) return;

        // Slow rotation
        groupRef.current.rotation.y += delta * 0.1;
        groupRef.current.rotation.x += delta * 0.05;

        // Mouse parallax
        const targetX = mouse.x * 0.5;
        const targetY = mouse.y * 0.5;

        groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.02;
        groupRef.current.rotation.x += (targetY - groupRef.current.rotation.x) * 0.02;
    });

    // Generate some trade lines (curved)
    const tradeLines = useMemo(() => {
        const lines = [];
        for (let i = 0; i < 20; i++) {
            // Simple random points on sphere
            const phi1 = Math.acos(-1 + (2 * Math.random()));
            const theta1 = Math.sqrt(Math.PI * 100) * phi1;
            const p1 = new THREE.Vector3().setFromSphericalCoords(2, phi1, theta1);

            const phi2 = Math.acos(-1 + (2 * Math.random()));
            const theta2 = Math.sqrt(Math.PI * 100) * phi2;
            const p2 = new THREE.Vector3().setFromSphericalCoords(2, phi2, theta2);

            // Midpoint pushed out for a curve
            const midPoint = p1.clone().add(p2).multiplyScalar(0.5);
            midPoint.normalize().multiplyScalar(2.3);

            const curve = new THREE.QuadraticBezierCurve3(p1, midPoint, p2);
            lines.push(curve.getPoints(20));
        }
        return lines;
    }, []);

    return (
        <group ref={groupRef}>
            {/* The main earth sphere */}
            <Sphere args={[2, 64, 64]}>
                <meshStandardMaterial
                    color="#1e3a8a"
                    transparent
                    opacity={0.9}
                    wireframe={true}
                    emissive="#1e3a8a"
                    emissiveIntensity={0.2}
                />
            </Sphere>

            {/* Slightly larger sphere for glow / atmosphere */}
            <Sphere args={[2.05, 32, 32]}>
                <meshBasicMaterial color="#3b82f6" transparent opacity={0.1} />
            </Sphere>

            {/* Trade paths */}
            {tradeLines.map((points, index) => (
                <Line
                    key={index}
                    points={points}
                    color={index % 3 === 0 ? "#f97316" : "#60a5fa"}
                    lineWidth={1.5}
                    transparent
                    opacity={0.6}
                />
            ))}

            {/* Subtle nodes representing cities/hubs */}
            {tradeLines.map((points, index) => (
                <mesh key={`node-${index}`} position={points[0]}>
                    <sphereGeometry args={[0.04, 8, 8]} />
                    <meshBasicMaterial color="#f97316" />
                </mesh>
            ))}

            {/* Lights */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
            <pointLight position={[-10, -10, -5]} intensity={0.5} color="#f97316" />
        </group>
    );
}

export default function Globe3D() {
    return (
        <div className="w-full h-full cursor-grab active:cursor-grabbing">
            <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
                <RotatingGlobe />
                <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 3} />
                <Preload all />
            </Canvas>
        </div>
    );
}
