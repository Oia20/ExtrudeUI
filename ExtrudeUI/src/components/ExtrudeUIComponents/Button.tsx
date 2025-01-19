import { useState, useMemo } from 'react';
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
  size?: 'small' | 'medium' | 'large';
  shape?: 'rounded' | 'square' | 'pill';
  
  // 3D properties
  depth?: number;
  hover?: boolean;
  textColor?: string;
  opacity?: number;

  // Material properties
  metalness?: number;
  roughness?: number;
  clearcoat?: number;
  clearcoatRoughness?: number;

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
  clearcoat = 1,
  clearcoatRoughness = 0.1,
  animation = 'spin',
  shadowColor = 'red',
  onHover,
  gradient,
}: ExtrudeButtonProps & { onHover: (hovered: boolean) => void }) => {
  const [hovered, setHovered] = useState(false);
  const [rotationX, setRotationX] = useState(0);

  const [rotationY, setRotationY] = useState(0);
  
  // Map size to dimensions with dynamic width calculation
  const dimensions = useMemo(() => {
    const getBaseWidth = (size: 'small' | 'medium' | 'large') => {
      const baseDimensions = {
        small: { width: 1.5, height: 0.5, fontSize: 0.15 },
        medium: { width: 2, height: 0.7, fontSize: 0.2 },
        large: { width: 2.5, height: 0.9, fontSize: 0.25 },
      }[size];

      // Calculate width based on text length
      const textLength = text.length;
      const charWidth = baseDimensions.fontSize * 0.7; // Approximate character width
      const calculatedWidth = Math.max(
        baseDimensions.width, // Minimum width
        textLength * charWidth * 1.2 // Text width + padding
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
        return 0.15;  // Original rounded corners
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
          speed={1.5}
          rotationIntensity={0.3}
          floatIntensity={0.4}
          floatingRange={[-0.1, 0.1]}
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
              clearcoat={clearcoat}
              clearcoatRoughness={clearcoatRoughness}
              envMapIntensity={1.5}
            />
          </RoundedBox>

          <Text
            position={[0, 0, depth / 2 + 0.01]}
            fontSize={dimensions.fontSize}
            color={textColor}
            anchorX="center"
            anchorY="middle"
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

  return (
    <div 
      style={{ 
        position: 'relative',
        cursor: isHovered && !props.disabled ? 'pointer' : 'default'
      }}
    >
      <Suspense fallback={<div></div>}>
      <Canvas 
        camera={{ position: [0, 0, 2.5], fov: 40 }}
        style={{ 
          background: 'transparent',
          pointerEvents: 'auto',
        }}
        shadows
      >
        <Stage
          environment="city"
          intensity={0.5}
          shadows={{
            type: 'contact',
            opacity: props.shadowOpacity || 0.7,
            blur: 3,
            far: 3,
            color: props.shadowColor || '#000000',
            amount: 10
          }}
        >
          <ExtrudeButtonInner {...props} onHover={setIsHovered} />
        </Stage>

      </Canvas>
      </Suspense>
    </div>
  );
};
