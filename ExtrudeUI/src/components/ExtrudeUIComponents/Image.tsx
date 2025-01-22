import { useState, useMemo, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Image as DreiImage, Float, Stage, Text, MeshWobbleMaterial } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import { useLoader } from '@react-three/fiber';

interface ExtrudeImageProps {
  // Core props
  src: string;
  alt?: string;
  onClick?: () => void;
  
  // Sizing and positioning
  width?: number;
  height?: number;
  scale?: number;
  
  // 3D effects
  depth?: number;
  floatIntensity?: number;
  floatSpeed?: number;
  
  // Material properties
  opacity?: number;
  transparent?: boolean;
  grayscale?: boolean;
  
  // Shadow properties
  shadowColor?: string;
  shadowOpacity?: number;
  
  // Animation and interaction
  hover?: boolean;
  animation?: 'float' | 'spin' | 'none';
  
  // Container styling
  className?: string;
  style?: React.CSSProperties;
  
  // Loading state
  fallback?: React.ReactNode;
  
  // Frame properties
  frame?: boolean;
  frameColor?: string;
  frameWidth?: number;
  radius?: number;
  
  // Wobble properties
  wobble?: boolean;
  wobbleSpeed?: number;
  wobbleStrength?: number;
}

const ImageScene = ({
  src,
  alt,
  width = 1,
  height = 1,
  scale = 1,
  depth = 0.1,
  floatIntensity = 1,
  floatSpeed = 1,
  opacity = 1,
  transparent = false,
  grayscale = false,
  animation = 'float',
  frame = false,
  frameColor = '#ffffff',
  frameWidth = 0.05,
  onClick,
  radius = 0.05,
  wobble = false,
  wobbleSpeed = 1,
  wobbleStrength = 0.1,
}: ExtrudeImageProps) => {
  // Remove hover state since we don't need it anymore
  
  const ImageWithFrame = () => (
    <group>
      {frame && (
        <>
          {/* Main frame */}
          <mesh position={[0, 0, -depth/2]} castShadow receiveShadow>
            <boxGeometry 
              args={[
                width + frameWidth * 2, 
                height + frameWidth * 2, 
                depth + 0.01
              ]} 
            />

              <meshPhysicalMaterial 
                color={frameColor}
                metalness={0.7}
                roughness={0.2}
              />
          </mesh>
        </>
      )}

      {/* Image group */}
      <group position={[0, 0, frame ? 0.01 : 0]}>
        {/* Shadow/depth layer */}
        <mesh scale={[width, height, 1]} position={[0, 0, -depth/2]}>
          <planeGeometry />
            <meshBasicMaterial
              map={useLoader(TextureLoader, src)}
              transparent
              opacity={0.1}
            />
        </mesh>

        {/* Main image */}
        <mesh scale={[width, height, 1]}>
          <planeGeometry />
          {!frame && wobble ? (
            <MeshWobbleMaterial
              map={useLoader(TextureLoader, src)}
              transparent={transparent}
              opacity={opacity}
              factor={wobbleStrength}
              speed={wobbleSpeed}
            />
          ) : (
            <meshBasicMaterial
              map={useLoader(TextureLoader, src)}
              transparent={transparent}
              opacity={opacity}
            />
          )}
        </mesh>
      </group>
    </group>
  );

  return (
    <group scale={[scale, scale, scale]} onClick={onClick}>
      {animation === 'float' ? (
        <Float
          speed={floatSpeed}
          rotationIntensity={0.2}
          floatIntensity={floatIntensity}
        >
          <mesh>
          <MeshWobbleMaterial 
            transparent={transparent}
            factor={wobbleStrength}
            speed={wobbleSpeed}
          />
          <ImageWithFrame />
          </mesh>
        </Float>
      ) : (
        <ImageWithFrame />
      )}
    </group>
  );
};

export const ExtrudeImage = (props: ExtrudeImageProps) => {
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate canvas dimensions based on container width
  const canvasDimensions = useMemo(() => {
    const aspectRatio = props.width! / props.height!;
    const containerWidth = containerDimensions.width;
    
    // Calculate height based on the aspect ratio
    const height = containerWidth / aspectRatio;

    return { 
      width: containerWidth, 
      height 
    };
  }, [containerDimensions.width, props.width, props.height]);

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
        height: `${canvasDimensions.height}px`, // Dynamic height based on width
        ...props.style,
      }}
    >
      <Suspense fallback={props.fallback || <div>Loading...</div>}>
        <Canvas
          camera={{ 
            position: [0, 0, Math.max(props.width || 1, props.height || 1) * 1.5], 
            fov: 50,
            near: 0.1,
            far: 1000
          }}
          style={{
            width: '100%',
            height: '100%',
          }}
          shadows // Enable shadows in the Canvas
        >
          <Stage
            environment="city"
            intensity={1}
            preset="rembrandt"
            shadows={{
              type: 'contact',
              color: props.shadowColor || '#000000',
              opacity: props.shadowOpacity || 0.5,
              blur: 1,
              intensity: 500,
            }}
          >
            <ImageScene {...props} />
          </Stage>
        </Canvas>
      </Suspense>
    </div>
  );
};
