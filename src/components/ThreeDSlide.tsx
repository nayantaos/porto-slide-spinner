
import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations, Environment } from "@react-three/drei";
import { SlideConfig } from "@/types/slide";
import * as THREE from "three";

interface ModelProps {
  filePath: string;
}

function Model({ filePath }: ModelProps) {
  const group = useRef<THREE.Group>(null!);
  const [modelError, setModelError] = useState<boolean>(false);
  
  // Add error handling for model loading
  let modelPath = filePath;
  
  try {
    const { scene, animations } = useGLTF(modelPath);
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
    console.error("Error loading model:", error);
    
    // Fallback to a simple box mesh if model fails to load
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
        <Text 
          position={[0, 0, 1.1]} 
          fontSize={0.1}
          color="white"
        >
          Model Not Found
        </Text>
      </mesh>
    );
  }
}

// Simple Text component for error messages
function Text({ children, ...props }: any) {
  return (
    <mesh {...props}>
      <textGeometry args={[children, { size: 0.1, height: 0.05 }]} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
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
