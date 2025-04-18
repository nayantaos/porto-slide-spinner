
import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations, Environment, Text } from "@react-three/drei";
import { SlideConfig } from "@/types/slide";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "./ui/skeleton";

interface ModelProps {
  filePath: string;
  onLoad?: () => void;
}

function Model({ filePath, onLoad }: ModelProps) {
  const group = useRef<THREE.Group>(null!);
  const [loadError, setLoadError] = useState<boolean>(false);
  
  useEffect(() => {
    setLoadError(false);
  }, [filePath]);
  
  try {
    if (loadError) {
      throw new Error("Model failed to load");
    }
    
    const { scene, animations } = useGLTF(filePath);
    
    useEffect(() => {
      const onError = (event: ErrorEvent) => {
        if (event.message.includes(filePath)) {
          console.error("Error loading GLB model:", event.message);
          setLoadError(true);
        }
      };
      
      window.addEventListener('error', onError);
      
      // Call onLoad callback when model is ready
      if (onLoad) {
        onLoad();
      }
      
      return () => window.removeEventListener('error', onError);
    }, [filePath, onLoad]);
    
    const { actions } = useAnimations(animations, group);

    useEffect(() => {
      if (animations.length > 0) {
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
    
    return (
      <group>
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="hotpink" />
        </mesh>
        <Text 
          position={[0, 0, 2.1]} 
          fontSize={0.25}
          color="black"
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
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  
  const cameraPosition = new THREE.Vector3(0, 0, isMobile ? 8 : 5);
  const cameraFov = isMobile ? 70 : 50;

  const handleModelLoad = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="w-full h-full bg-white flex items-center justify-center">
        <div className="space-y-4">
          <Skeleton className="h-[200px] w-[200px] rounded-lg" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white">
      <Canvas
        camera={{ position: cameraPosition, fov: cameraFov }}
        gl={{ 
          antialias: true, 
          preserveDrawingBuffer: true
        }}
      >
        {/* Ambient light for base illumination */}
        <ambientLight intensity={0.3} />
        
        {/* Key light from top */}
        <directionalLight
          position={[0, 5, 0]}
          intensity={0.5}
          castShadow
        />
        
        {/* Fill light from right */}
        <directionalLight
          position={[5, 0, 0]}
          intensity={0.4}
        />
        
        {/* Fill light from left */}
        <directionalLight
          position={[-5, 0, 0]}
          intensity={0.4}
        />

        <Model filePath={slide.file} onLoad={handleModelLoad} />
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

