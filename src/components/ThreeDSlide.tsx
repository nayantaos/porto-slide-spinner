
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
  onError?: () => void;
}

function Model({ filePath, onLoad, onError }: ModelProps) {
  const group = useRef<THREE.Group>(null!);
  const [loadError, setLoadError] = useState<boolean>(false);
  
  useEffect(() => {
    setLoadError(false);
  }, [filePath]);
  
  try {
    if (loadError) {
      if (onError) onError();
      throw new Error("Model failed to load");
    }
    
    const { scene, animations } = useGLTF(filePath);
    
    useEffect(() => {
      const onErrorEvent = (event: ErrorEvent) => {
        if (event.message.includes(filePath)) {
          console.error("Error loading GLB model:", event.message);
          setLoadError(true);
          if (onError) onError();
        }
      };
      
      window.addEventListener('error', onErrorEvent);
      
      // Call onLoad callback when model is ready
      if (onLoad) {
        // Small delay to ensure the model has time to render
        const timer = setTimeout(() => {
          onLoad();
          console.log("Model loaded successfully:", filePath);
        }, 100);
        return () => {
          clearTimeout(timer);
          window.removeEventListener('error', onErrorEvent);
        };
      }
      
      return () => window.removeEventListener('error', onErrorEvent);
    }, [filePath, onLoad, onError]);
    
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
          onUpdate={() => {
            // This ensures the scene is properly updated
            if (onLoad) {
              onLoad();
            }
          }}
        />
      </group>
    );
  } catch (error) {
    console.error("Error rendering model:", error);
    
    // Make sure to call onError if the model fails to render
    if (onError && !loadError) {
      onError();
    }
    
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
  const [loadingTimeout, setLoadingTimeout] = useState<boolean>(false);
  
  const cameraPosition = new THREE.Vector3(0, 0, isMobile ? 8 : 5);
  const cameraFov = isMobile ? 70 : 50;

  const handleModelLoad = () => {
    setIsLoading(false);
  };
  
  const handleModelError = () => {
    // If there's an error, we'll still display the fallback after a short timeout
    setTimeout(() => setIsLoading(false), 500);
  };
  
  // Safety timeout to ensure we don't get stuck in a loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        console.log("Loading timeout reached, showing model anyway");
        setLoadingTimeout(true);
        setIsLoading(false);
      }
    }, 3000); // 3 second timeout
    
    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <div className="w-full h-full bg-white">
      {isLoading && (
        <div className="absolute inset-0 z-10 bg-white flex items-center justify-center">
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-[200px] rounded-lg" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      )}
      
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

        <Model 
          filePath={slide.file} 
          onLoad={handleModelLoad} 
          onError={handleModelError}
        />
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
