
import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations, Environment } from "@react-three/drei";
import { SlideConfig } from "@/types/slide";
import * as THREE from "three";

interface ModelProps {
  filePath: string;
}

function Model({ filePath }: ModelProps) {
  const group = useRef<THREE.Group>(null!);
  const { scene, animations } = useGLTF(filePath);
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
