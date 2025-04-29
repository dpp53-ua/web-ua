import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

function ModelViewer({ modelUrl }) {
    const [model, setModel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loader = new GLTFLoader();

        setLoading(true);
        setError(null);

        loader.load(
            modelUrl,
            (gltf) => {
                const scene = gltf.scene;

                // Centrado
                const box = new THREE.Box3().setFromObject(scene);
                const size = new THREE.Vector3();
                const center = new THREE.Vector3();
                box.getSize(size);
                box.getCenter(center);
                scene.position.sub(center);

                // Escalado
                const maxAxis = Math.max(size.x, size.y, size.z);
                const scale = 10 / maxAxis;
                scene.scale.set(scale, scale, scale);

                setModel(scene);
                setLoading(false);
            },
            undefined,
            (err) => {
                console.error("Error al cargar el modelo:", err);
                setError("Error al cargar el modelo.");
                setLoading(false);
            }
        );
    }, [modelUrl]);

    if (loading) return <p>Cargando modelo...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div style={{ width: '100%', height: '600px', backgroundColor: '#000' }}>
            <Canvas
                camera={{ position: [0, 0, 15], fov: 50 }}
                style={{ background: '#111' }}
                shadows
            >
                {/* Iluminación */}
                <ambientLight intensity={1.2} />
                <directionalLight position={[10, 10, 10]} intensity={1.5} castShadow />
                <hemisphereLight skyColor={0xffffff} groundColor={0x444444} intensity={0.6} />

                {/* Modelo */}
                {model && <primitive object={model} />}

                {/* Controles de cámara */}
                <OrbitControls />
            </Canvas>
        </div>
    );
}

export default ModelViewer;
