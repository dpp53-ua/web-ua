import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

function ModelViewer({ modelUrl }) {
    const [model, setModel] = useState();
    const [wireframe, setWireframe] = useState(false);
    const groupRef = useRef();

    useEffect(() => {
        if (!modelUrl) return;

        const loader = new GLTFLoader();
        loader.load(
            modelUrl,
            (gltf) => {
                const scene = gltf.scene;
                scene.traverse((child) => {
                    if (child.isMesh) {
                        child.material.side = THREE.DoubleSide;
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                centerAndScaleModel(scene);
                setModel(scene);
            },
            undefined,
            (error) => {
                console.error("Error al cargar el modelo:", error);
            }
        );
    }, [modelUrl]);

    useEffect(() => {
        if (model) {
            model.traverse((child) => {
                if (child.isMesh) {
                    child.material.wireframe = wireframe;
                }
            });
        }
    }, [wireframe, model]);

    const centerAndScaleModel = (model) => {
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3()).length();

        model.position.sub(center); // Centra
        const scaleFactor = 10 / size; // Escala base
        model.scale.setScalar(scaleFactor);
    };

    return (
        <div>
            <button onClick={() => setWireframe(!wireframe)} style={{ marginBottom: '10px' }}>
                {wireframe ? "Modo Material" : "Modo Wireframe"}
            </button>
            <Canvas
                shadows
                camera={{ position: [0, 2, 5], fov: 60 }}
                style={{ width: "100%", height: "500px", background: "#111" }}
            >
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
                <OrbitControls />
                <Environment preset="studio" background={false} />
                <axesHelper args={[5]} />
                <gridHelper args={[10, 10]} />
                {model && <primitive object={model} ref={groupRef} />}
            </Canvas>
        </div>
    );
}

export default ModelViewer;