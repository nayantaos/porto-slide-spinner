
import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations, Environment, Text } from "@react-three/drei";
import { SlideConfig } from "@/types/slide";
import * as THREE from "three";

interface ModelProps {
  filePath: string;
}

function Model({ filePath }: ModelProps) {
  const group = useRef<THREE.Group>(null!);
  const [loadError, setLoadError] = useState<boolean>(false);
  
  useEffect(() => {
    // Reset error state when filePath changes
    setLoadError(false);
  }, [filePath]);
  
  try {
    if (loadError) {
      throw new Error("Model failed to load");
    }
    
    const { scene, animations } = useGLTF(filePath, undefined, (error) => {
      console.error("Error loading GLB model:", error);
      setLoadError(true);
    });
    
    const { actions } = useAnimations(animations, group);

    // Play all animations if they exist
    useEffect(() => {
      if (animations.length > 0) {
        // Get the first animation name
        const animationName = Object.keys(actions)[0];
        if (animationName) {
          const action = actions[animationName];
          if (action) {
            action.play();
          }
        }
      }
    }, [actions, animations]);

    return (
      <group ref={group}>
        <primitive 
          object={scene} 
          scale={1}
          position={[0, 0, 0]} 
          rotation={[0, 0, 0]}
        />
      </group>
    );
  } catch (error) {
    console.error("Error rendering model:", error);
    
    // Fallback to a simple box mesh if model fails to load
    return (
      <group>
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="hotpink" />
        </mesh>
        <Text 
          position={[0, 0, 2.1]} 
          fontSize={0.25}
          color="white"
        >
          3D Model Placeholder
        </Text>
      </group>
    );
  }
}

interface ThreeDSlideProps {
  slide: SlideConfig;
}

const ThreeDSlide = ({ slide }: ThreeDSlideProps) => {
  return (
    <div className="w-full h-full bg-black">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
      >
        <ambientLight intensity={0.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={1}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Model filePath={slide.file} />
        <OrbitControls 
          autoRotate 
          autoRotateSpeed={1} 
          enableZoom={false} 
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default ThreeDSlide;
