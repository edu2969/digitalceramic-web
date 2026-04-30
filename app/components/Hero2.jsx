"use client"
import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { TextureLoader } from "three";


function MolarModel() {
	const group = useRef();
	// Ángulos iniciales para vista lateral y ligeramente superior
	const initialY = Math.PI / 1.1; // lateral
	const initialX = Math.PI / 2;   // solo un poco desde arriba
	const initialZ = Math.PI / 32;   // rotar vertical
	useFrame((state) => {
		if (group.current) {
			// Rotación automática en Z
			const elapsed = state.clock.getElapsedTime();
			group.current.rotation.set(initialX, initialY, initialZ + elapsed * 0.5);
		}
	});
	const obj = useLoader(OBJLoader, "/molar.obj");
	const texture = useLoader(TextureLoader, "/zirconio_antique_white.jpg");
	return (
		<group ref={group} scale={[1.5, 1.5, 1.5]}>
			<primitive object={obj} />
			{/* Aplicar textura de zirconio */}
			<meshStandardMaterial attach="material" map={texture} metalness={0.2} roughness={0.3} />
		</group>
	);
}

export default function Hero2() {
	return (
		<div style={{ width: "100%", height: "400px" }}>
			<Canvas camera={{ position: [5, 0, 0], fov: 50 }}>
				<ambientLight intensity={0.7} />
				<directionalLight position={[5, 5, 5]} intensity={0.7} />
				<MolarModel />
				<OrbitControls enableZoom={false} enablePan={false} />
			</Canvas>
			<div style={{textAlign: 'center', marginTop: 8}}>Molar impreso en zirconio (3D interactivo)</div>
		</div>
	);
}
