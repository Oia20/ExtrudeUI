import { useState, useMemo, useEffect, useRef } from 'react';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { Float, Stage, useGLTF, OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';

interface ExtrudeModelProps {
  // Core props
  src: string;  // URL to the GLTF/GLB model
  alt?: string;
  onClick?: () => void;
  
  // Sizing and positioning
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  
  // 3D effects
  floatIntensity?: number;
  floatSpeed?: number;
  
  // Material properties
  metalness?: number;
  roughness?: number;
  
  // Shadow properties
  shadowColor?: string;
  shadowOpacity?: number;
  
  // Animation and interaction
  animation?: 'float' | 'spinHorizontal' | 'spinVertical' | 'bounce' | 'none';
  autoRotate?: boolean;
  rotateSpeed?: number;
  animationSpeed?: number;
  
  // Container styling
  className?: string;
  style?: React.CSSProperties;
  
  // Loading state
  fallback?: React.ReactNode;
  
  // New prop
  cameraDistance?: number;
  
  // New orbital control props
  enableOrbitControls?: boolean;
  orbitControlsOptions?: {
    enableZoom?: boolean;
    enableRotate?: boolean;
    enablePan?: boolean;
    minDistance?: number;
    maxDistance?: number;
    minPolarAngle?: number;
    maxPolarAngle?: number;
  };
}

const ModelScene = ({
  src,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  floatIntensity = 1,
  floatSpeed = 1,
  metalness = 0.5,
  roughness = 0.2,
  animation = 'float',
  autoRotate = false,
  rotateSpeed = 0.5,
  animationSpeed = 1,
  onClick,
}: ExtrudeModelProps) => {
  const { scene } = useGLTF(src);
  const modelRef = useRef<THREE.Group>();

  // Enhanced animation frame handler
  useFrame((state, delta) => {
    if (modelRef.current) {
      switch (animation) {
        case 'spinHorizontal':
          modelRef.current.rotation.y += delta * animationSpeed;
          break;
        case 'spinVertical':
          modelRef.current.rotation.x += delta * animationSpeed;
          break;
        case 'bounce':
          modelRef.current.position.y = Math.sin(state.clock.elapsedTime * animationSpeed) * 0.1;
          break;
      }
    }
  });

  // Clone the scene to avoid mutations
  const model = useMemo(() => {
    const clone = scene.clone();
    
    // Apply material properties while preserving original colors
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        // Preserve the original material but update its properties
        child.material.metalness = metalness;
        child.material.roughness = roughness;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    
    return clone;
  }, [scene, metalness, roughness]);

  const ModelWithAnimation = () => (
    <primitive
      ref={modelRef}
      object={model}
      scale={scale}
      position={position}
      rotation={rotation}
      onClick={onClick}
    />
  );

  return (
    <group>
      {animation === 'float' ? (
        <Float
          speed={floatSpeed}
          rotationIntensity={1}
          floatIntensity={floatIntensity}
        >
          <ModelWithAnimation />
        </Float>
      ) : (
        <ModelWithAnimation />
      )}
    </group>
  );
};

export const ExtrudeModel = ({ 
  cameraDistance = 7, 
  enableOrbitControls = false,
  orbitControlsOptions = {
    enableZoom: false,
    enableRotate: true,
    enablePan: false,
    minDistance: 2,
    maxDistance: 20,
    minPolarAngle: 0,
    maxPolarAngle: Math.PI
  },
  ...props 
}: ExtrudeModelProps) => {
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const updateDimensions = () => {
        setContainerDimensions({
          width: containerRef.current!.clientWidth,
          height: containerRef.current!.clientHeight,
        });
      };

      updateDimensions();
      const resizeObserver = new ResizeObserver(updateDimensions);
      resizeObserver.observe(containerRef.current);
      
      return () => resizeObserver.disconnect();
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={props.className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        ...props.style,
      }}
    >
      <Suspense fallback={props.fallback || <div style={{width: '100%', height: '100%'}}></div>}>
        <Canvas
          camera={{ 
            position: [0, 0, cameraDistance], 
            fov: 50,
            near: 0.1,
            far: 1000
          }}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
          }}
          shadows
        >
            <ambientLight intensity={0} />
            {enableOrbitControls && <OrbitControls {...orbitControlsOptions} />}
          <Stage
            environment="city"
            intensity={1}
            preset="rembrandt"
            adjustCamera={false}
            shadows={{
              type: 'contact',
              color: props.shadowColor || '#000000',
              opacity: props.shadowOpacity || 0.5,
              blur: 1,
              intensity: 500,
            }}
          >
            <ModelScene {...props} />
          </Stage>
        </Canvas>
      </Suspense>
    </div>
  );
};
