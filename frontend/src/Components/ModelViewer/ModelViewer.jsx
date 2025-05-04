import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

function ModelViewer({ modelUrl }) {
    const [model, setModel] = useState();
    const [wireframe, setWireframe] = useState(false);
    const [lightIntensity] = useState(1);
    const [autoRotate, setAutoRotate] = useState(false);

    const groupRef = useRef();
    const lightRef = useRef();
    const cameraRef = useRef(); // 👉 Referencia externa para la cámara

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
        model.position.sub(center);
        const scaleFactor = 10 / size;
        model.scale.setScalar(scaleFactor);
    };

    useEffect(() => {
        let animId;
        if (autoRotate && groupRef.current) {
            const rotate = () => {
                groupRef.current.rotation.y += 0.01;
                animId = requestAnimationFrame(rotate);
            };
            rotate();
        }
        return () => cancelAnimationFrame(animId);
    }, [autoRotate]);

    // 🔄 Función para resetear la cámara
    const resetCamera = () => {
        if (cameraRef.current) {
            cameraRef.current.position.set(0, 4, 10);
            cameraRef.current.lookAt(0, 0, 0);
        }
    };

    return (
        <div>
            <Canvas
                shadows
                camera={{ position: [0, 4, 10], fov: 60 }}
                style={{ width: "100%", height: "1000px", background: "#111" }}
                onCreated={({ camera }) => (cameraRef.current = camera)} // 👈 Capturamos la cámara
            >
                <ambientLight intensity={0.5} />
                <directionalLight ref={lightRef} position={[5, 10, 5]} intensity={lightIntensity} castShadow />
                <OrbitControls />
                <Environment preset="studio" background={false} />
                <gridHelper args={[10, 10]} />
                {model && <primitive object={model} ref={groupRef} />}
            </Canvas>

            {/* Botones de control */}
            <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "10px" }}>
                <button onClick={() => setWireframe(!wireframe)} style={buttonStyle}>
                    {wireframe ? "Modo Material" : "Modo Wireframe"}
                </button>
                <button onClick={() => setAutoRotate(!autoRotate)} style={buttonStyle}>
                    {autoRotate ? "Parar Giro" : "Girar Modelo"}
                </button>
                <button onClick={resetCamera} style={buttonStyle}>
                    Reset Cámara
                </button>
            </div>
        </div>
    );
}

const buttonStyle = {
    padding: "6px 12px",
    fontSize: "14px",
    borderRadius: "8px",
    background: "#333",
    color: "#fff",
    border: "none",
    cursor: "pointer"
};

export default ModelViewer;
