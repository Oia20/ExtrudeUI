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
  loadingAnimation?: 'spinner' | 'pulse' | 'dots' | 'none';
  loadingColor?: string;
  
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
  loadingAnimation = 'spinner',
  loadingColor = '#000000',
  ...props 
}: ExtrudeModelProps) => {
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Add touch event handlers to prevent unwanted scrolling behavior
  useEffect(() => {
    const container = containerRef.current;
    if (container && enableOrbitControls) {
      const preventDefault = (e: TouchEvent) => {
        e.preventDefault();
      };
      
      container.addEventListener('touchmove', preventDefault, { passive: false });
      return () => container.removeEventListener('touchmove', preventDefault);
    }
  }, [enableOrbitControls]);

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

  const LoadingComponent = () => {
    switch (loadingAnimation) {
      case 'spinner':
        return (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: `3px solid ${loadingColor}20`,
              borderTop: `3px solid ${loadingColor}`,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
          </div>
        );
      case 'pulse':
        return (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: loadingColor,
              borderRadius: '50%',
              animation: 'pulse 1.5s ease-in-out infinite',
            }} />
          </div>
        );
      case 'dots':
        return (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px'
          }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                width: '12px',
                height: '12px',
                backgroundColor: loadingColor,
                borderRadius: '50%',
                animation: `dots 1.4s ease-in-out ${i * 0.16}s infinite`,
              }} />
            ))}
          </div>
        );
      case 'none':
      default:
        return <div style={{width: '100%', height: '100%'}} />;
    }
  };

  return (
    <div
      ref={containerRef}
      className={props.className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        touchAction: enableOrbitControls ? 'none' : 'auto',
        ...props.style,
      }}
    >
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0% { transform: scale(0.8); opacity: 0.5; }
            50% { transform: scale(1); opacity: 1; }
            100% { transform: scale(0.8); opacity: 0.5; }
          }
          @keyframes dots {
            0%, 100% { transform: scale(0.7); }
            50% { transform: scale(1); }
          }
        `}
      </style>
      <Suspense fallback={props.fallback || <LoadingComponent />}>
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
          // Add performance optimizations
          dpr={[1, 2]} // Limit pixel ratio
          performance={{ min: 0.5 }} // Allow frame rate to drop if needed
        >
            <ambientLight intensity={0} />
            {enableOrbitControls && (
              <OrbitControls
                {...orbitControlsOptions}
                makeDefault // Make controls persistent
                enableDamping // Add smooth damping
                dampingFactor={0.05}
              />
            )}
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
