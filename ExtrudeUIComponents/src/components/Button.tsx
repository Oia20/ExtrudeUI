import React from 'react';
import { useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import { animated, useSpring } from '@react-spring/three';
import { Float, Stage } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense } from 'react';

interface ExtrudeButtonProps {
  // Core props
  text?: string;
  onClick?: () => void;
  disabled?: boolean;
  
  // Basic styling
  color?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  shape?: 'rounded' | 'square' | 'pill';
  font?: string;
  

  // 3D properties
  depth?: number;
  hover?: boolean;
  textColor?: string;
  opacity?: number;


  // Material properties
  metalness?: number;
  roughness?: number;

  // Animation properties
  animation?: 'spin' | 'flip' | 'rock' | 'none';

  // New prop
  shadowColor?: string;
  shadowOpacity?: number;

  // New gradient properties
  gradient?: {
    from: string;
    to: string;
    angle?: number; // in degrees, default 0 (horizontal)
  };

  // Loading state
  fallback?: React.ReactNode;
  loadingAnimation?: 'spinner' | 'pulse' | 'dots' | 'none';
  loadingColor?: string;
}

const ExtrudeButtonInner = ({
  text = 'Button',
  onClick,
  disabled = false,
  color = '#1e88e5',
  size = 'medium',
  shape = 'rounded',
  depth = 0.8,
  hover = true,
  textColor = '#ffffff',
  opacity = 1,
  metalness = 0.3,
  roughness = 0.2,
  animation = 'spin',
  font = 'https://db.onlinewebfonts.com/t/1dc8ecd8056a5ea7aa7de1db42b5b639.ttf',
  shadowColor = 'red',
  onHover,
  gradient,



}: ExtrudeButtonProps & { onHover: (hovered: boolean) => void }) => {
  const [hovered, setHovered] = useState(false);
  const [rotationX, setRotationX] = useState(0);

  const [rotationY, setRotationY] = useState(0);
  
  // Update dimensions calculation with larger base sizes
  const dimensions = useMemo(() => {
    const getBaseWidth = (size: 'small' | 'medium' | 'large' | 'xlarge') => {
      const baseDimensions = {
        small: { width: 8.0, height: 2.4, fontSize: 0.8 },     // Massive increase from 4.5/1.4/0.45
        medium: { width: 10.0, height: 3.0, fontSize: 1.0 },   // Massive increase from 6.0/1.8/0.6
        large: { width: 12.0, height: 3.6, fontSize: 1.2 },    // Massive increase from 7.5/2.2/0.75
        xlarge: { width: 14.0, height: 4.2, fontSize: 1.4 },   // Massive increase from 9.0/2.6/0.9
      }[size];

      const textLength = text.length;
      const charWidth = baseDimensions.fontSize * 0.6;
      const sizeMultiplier = {
        small: 0.8,
        medium: 1.0,
        large: 1.2,
        xlarge: 1.4
      }[size];
      
      const calculatedWidth = Math.max(
        baseDimensions.width,
        textLength * charWidth * sizeMultiplier
      );

      return {
        width: calculatedWidth,
        height: baseDimensions.height,
        fontSize: baseDimensions.fontSize
      };
    };

    return getBaseWidth(size);
  }, [text, size]);
  
  const { scale, rotation, color: buttonColor } = useSpring({
    scale: hover && hovered ? 1.1 : 1,
    rotation: [rotationX, rotationY, 0],
    color: hovered ? color : color,
    config: { 
      mass: 1, 
      tension: 280, 
      friction: 40,
      rotation: {
        mass: 1,
        tension: 200,
        friction: 30,
      }
    }
  });

  // Add shape radius mapping
  const getRadius = () => {
    switch (shape) {
      case 'square':
        return 0.01;  // Nearly square
      case 'pill':
        return dimensions.height / 2;  // Half height for pill shape
      case 'rounded':
      default:
        return 0.5;  // Original rounded corners
    }
  };

  const handleAnimation = () => {
    switch (animation) {
      case 'spin':
        setRotationY(prev => prev + Math.PI * 2);
        break;
      case 'flip':
        setRotationX(prev => prev + Math.PI * 2);
        break;
      case 'rock':
        setRotationX(Math.PI * 0.1);
        setTimeout(() => setRotationX(0), 200);
        break;
      case 'none':
        break;
    }
  };

  // Add gradient texture creation
  const gradientTexture = useMemo(() => {
    if (!gradient) return null;

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const angle = (gradient.angle || 0) * Math.PI / 180;
    const startX = Math.cos(angle) * canvas.width / 2 + canvas.width / 2;
    const startY = Math.sin(angle) * canvas.height / 2 + canvas.height / 2;
    const endX = Math.cos(angle + Math.PI) * canvas.width / 2 + canvas.width / 2;
    const endY = Math.sin(angle + Math.PI) * canvas.height / 2 + canvas.height / 2;

    const gradientObj = ctx.createLinearGradient(startX, startY, endX, endY);
    gradientObj.addColorStop(0, gradient.from);
    gradientObj.addColorStop(1, gradient.to);

    ctx.fillStyle = gradientObj;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [gradient]);

  return (
    <animated.group 
      position={[0, 0, 0]} 
      scale={scale}
      rotation={rotation}
    >
      <animated.mesh
        onClick={(e) => {
          if (!disabled) {
            e.stopPropagation();
            handleAnimation();
            onClick?.();
          }
        }}
        onPointerOver={(e) => {
          if (!disabled) {
            setHovered(true);
            onHover(true);
          }
        }}
        onPointerOut={(e) => {
          if (!disabled) {
            setHovered(false);
            onHover(false);
          }
        }}
        castShadow
        receiveShadow
      >
        <Float
          speed={2}
          rotationIntensity={1}
          floatIntensity={1}
          floatingRange={[-0.3, 0.3]}
        >
          <RoundedBox 
            args={[dimensions.width, dimensions.height, depth]} 
            radius={getRadius()}
            castShadow
            receiveShadow

          >
            <animated.meshPhysicalMaterial 
              color={gradient ? '#ffffff' : buttonColor}
              map={gradientTexture}
              opacity={opacity}
              transparent={opacity !== 1}
              metalness={metalness}
              roughness={roughness}
              envMapIntensity={1.5}
            />
          </RoundedBox>

          <Text
            position={[0, 0, depth / 2 + 0.01]}
            fontSize={dimensions.fontSize}
            color={textColor}
            anchorX="center"
            anchorY="middle"
            font={font}
          >
            {text}
          </Text>
        </Float>

      </animated.mesh>
    </animated.group>
  );
};

export const ExtrudeButton = (props: ExtrudeButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);

  // Add resize listener with SSR check
  useEffect(() => {
    // Set initial width after component mounts
    setViewportWidth(window.innerWidth);
    
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const containerDimensions = useMemo(() => {
    const sizes = {
      small: { height: 'clamp(200px, 30vh, 300px)' },     // Massive increase from 120px/20vh/200px
      medium: { height: 'clamp(250px, 40vh, 400px)' },    // Massive increase from 150px/25vh/250px
      large: { height: 'clamp(300px, 50vh, 500px)' },     // Massive increase from 180px/30vh/300px
      xlarge: { height: 'clamp(350px, 60vh, 600px)' }     // Massive increase from 210px/35vh/350px
    };
    return sizes[props.size || 'medium'];
  }, [props.size]);

  // Adjust camera position based on viewport width
  const cameraPosition = useMemo(() => {
    if (viewportWidth === 0) return 5; // Increased default

    const basePositions = {
      small: 3.5,
      medium: 4.5,
      large: 5.5,
      xlarge: 7.0
    };

    const scaleFactor = Math.min(1, viewportWidth / 1200);
    const textLengthMultiplier = Math.max(1, (props.text?.length || 0) / 12);
    const screenSizeMultiplier = viewportWidth < 768 ? 1.5 : 1;
    
    return basePositions[props.size || 'medium'] 
      * Math.min(1.3, textLengthMultiplier) 
      * screenSizeMultiplier 
      / scaleFactor;
  }, [props.size, props.text, viewportWidth]);

  // Dynamic FOV based on viewport width
  const fov = useMemo(() => {
    if (viewportWidth === 0) return 40; // Default FOV during SSR
    
    const baseFOV = 40;
    if (viewportWidth < 480) return baseFOV * 1.5;
    if (viewportWidth < 768) return baseFOV * 1.3;
    return baseFOV;
  }, [viewportWidth]);

  const LoadingComponent = () => {
    switch (props.loadingAnimation) {
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
              border: `3px solid ${props.loadingColor}20`,
              borderTop: `3px solid ${props.loadingColor}`,
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
      style={{ 
        position: 'relative',
        cursor: isHovered && !props.disabled ? 'pointer' : 'default',
        width: '100%',
        height: containerDimensions.height,
        overflow: 'hidden',
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
          aria-label={props.text}
          aria-disabled={props.disabled}
          camera={{ 
            position: [0, 0, cameraPosition], 
            fov: fov,
          }}
          style={{ 
            background: 'transparent',
            pointerEvents: 'auto',
            width: '100%',
            height: '100%',
          }}
          shadows
          gl={{
            shadowMap: {
              enabled: true,
              type: THREE.PCFSoftShadowMap
            }
          }}
        >
          <Stage
            position={[0, 0, viewportWidth < 768 ? -1 : -0.3]}
            environment="city"
            intensity={0.5}
            preset="rembrandt"
            shadows={{ 
              type: 'contact',
              color: props.shadowColor || '#000000',
              colorBlend: 2,
              opacity: props.shadowOpacity || 0.7,
              blur: 5,
              amount: 1,
              frames:1
            }}
          >
            <ExtrudeButtonInner {...props} onHover={setIsHovered} />
          </Stage>
        </Canvas>
      </Suspense>
    </div>
  );
};