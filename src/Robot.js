import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from "three/examples/js/loaders/GLTFLoader";

const Robot = () => {
    const mountRef = useRef(null);
    const modelPath = "/public/models/robot.gltf";

    useEffect(() => {
        const currentMount = mountRef.current;
        // Scene, Camera, Renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        currentMount.appendChild(renderer.domElement);

        // Lighting
        const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
        scene.add(light);

        // GLTF Loader
        const loader = new GLTFLoader();
        loader.load(modelPath, (gltf) => {
            scene.add(gltf.scene);
        }, undefined, (error) => {
            console.error(error);
        });

        // Camera Position
        camera.position.z = 5;

        // Animation
        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        // Clean up
        return () => {
            currentMount.removeChild(renderer.domElement);
        };
    }, [modelPath]);

    return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
};

export default Robot;
