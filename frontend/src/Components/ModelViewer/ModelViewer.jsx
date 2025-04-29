import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function ModelViewer({ modelUrl }) {
    const [model, setModel] = useState(null);
    
    // Cargar el archivo .glb
    useEffect(() => {
        const loader = new GLTFLoader();
        loader.load(modelUrl, (gltf) => {
            setModel(gltf.scene);
        });
    }, [modelUrl]);

    return (
        <Canvas>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <directionalLight position={[-10, -10, -10]} />
            {model && <primitive object={model} />}
            <OrbitControls />
        </Canvas>
    );
}

export default ModelViewer;
