import React from "react";
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
  frameStyle?: 'metal' | 'glass' | 'matte' | 'glossy';
  radius?: number;
  
  // Wobble properties
  wobble?: boolean;
  wobbleSpeed?: number;
  wobbleStrength?: number;
  
  // Loading animation
  loadingAnimation?: 'spinner' | 'pulse' | 'dots';
  loadingColor?: string;
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
  frameStyle = 'metal',
  onClick,
  radius = 0.05,
  wobble = false,
  wobbleSpeed = 1,
  wobbleStrength = 0.1,
}: ExtrudeImageProps) => {
  // Remove hover state since we don't need it anymore
  
  const getFrameMaterial = () => {
    switch (frameStyle) {
      case 'metal':
        return {
          metalness: 0.9,
          roughness: 0.2,
          clearcoat: 0.5
        };
      case 'glass':
        return {
          metalness: 0.1,
          roughness: 0.1,
          transmission: 0.9,
          thickness: 0.5,
          clearcoat: 1
        };
      case 'matte':
        return {
          metalness: 0.1,
          roughness: 0.8,
          clearcoat: 0
        };
      case 'glossy':
        return {
          metalness: 0.3,
          roughness: 0.2,
          clearcoat: 1,
          clearcoatRoughness: 0.1
        };
      default:
        return {
          metalness: 0.7,
          roughness: 0.2
        };
    }
  };

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
                {...getFrameMaterial()}
              />
          </mesh>
        </>
      )}

      {/* Image group */}
      <group position={[0, 0, frame ? 0.01 : depth]}>

        {/* Main image */}
        <mesh scale={[width, height, 1]}>
          <planeGeometry />
          {!frame && wobble ? (
            <MeshWobbleMaterial
              map={useLoader(TextureLoader, src)}
              transparent={true}
              alphaTest={0.1}
              opacity={opacity}
              factor={wobbleStrength}
              speed={wobbleSpeed}
            />
          ) : (
            <meshBasicMaterial
              map={useLoader(TextureLoader, src)}
              transparent={true}
              alphaTest={0.1}
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

export const ExtrudeImage = ({
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
  frameStyle = 'metal',
  onClick,
  radius = 0.05,
  wobble = false,
  wobbleSpeed = 1,
  wobbleStrength = 0.1,
  fallback,
  loadingAnimation = 'spinner',
  loadingColor = '#000000',
  className,
  style,
  shadowColor,
  shadowOpacity,
}: ExtrudeImageProps) => {
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate canvas dimensions based on container width
  const canvasDimensions = useMemo(() => {
    const aspectRatio = width! / height!;
    const containerWidth = containerDimensions.width;
    
    // Calculate canvas height based on the aspect ratio
    const canvasHeight = containerWidth / aspectRatio;

    return { 
      width: containerWidth, 
      height: canvasHeight 
    };
  }, [containerDimensions.width, width, height]);

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
      // ... rest of loading cases ...
    }
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        ...style,
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
      <Suspense fallback={fallback || <LoadingComponent />}>
        <Canvas
          camera={{ 
            position: [0, 0, 2], 
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
          {/* Replace Stage with custom lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight
            position={[-5, 5, -5]}
            intensity={0.5}
          />

          <ImageScene {...{
            src,
            alt,
            width,
            height,
            scale,
            depth,
            floatIntensity,
            floatSpeed,
            opacity,
            transparent,
            grayscale,
            animation,
            frame,
            frameColor,
            frameWidth,
            frameStyle,
            onClick,
            radius,
            wobble,
            wobbleSpeed,
            wobbleStrength,
          }} />
        </Canvas>
      </Suspense>
    </div>
  );
};
