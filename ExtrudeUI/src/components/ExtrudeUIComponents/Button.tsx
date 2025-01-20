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
  font = 'https://db.onlinewebfonts.com/t/1dc8ecd8056a5ea7aa7de1db42b5b639.ttf',
  shadowColor = 'red',
  onHover,
  gradient,



}: ExtrudeButtonProps & { onHover: (hovered: boolean) => void }) => {
  const [hovered, setHovered] = useState(false);
  const [rotationX, setRotationX] = useState(0);

  const [rotationY, setRotationY] = useState(0);
  
  // Map size to dimensions with dynamic width calculation
  const dimensions = useMemo(() => {
    const getBaseWidth = (size: 'small' | 'medium' | 'large' | 'xlarge') => {
      const baseDimensions = {
        small: { width: 2, height: 0.6, fontSize: 0.2 },
        medium: { width: 3, height: 0.8, fontSize: 0.25 },
        large: { width: 4, height: 1.1, fontSize: 0.35 },
        xlarge: { width: 5.5, height: 1.4, fontSize: 0.45 },
      }[size];

      // Calculate width based on text length with size-specific scaling
      const textLength = text.length;
      const charWidth = baseDimensions.fontSize * 0.6;
      const sizeMultiplier = {
        small: 0.8,
        medium: 1,
        large: 1.2,
        xlarge: 1.5
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
          rotationIntensity={0.5}
          floatIntensity={0.4}
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

  // Define container sizes based on button size
  const containerDimensions = useMemo(() => {
    const sizes = {
      small: { height: '100px' },
      medium: { height:  '150px' },
      large: { height: '200px' },
      xlarge: { height: '300px' }
    };
    return sizes[props.size || 'medium'];
  }, [props.size]);

  const cameraPosition = useMemo(() => {
    const positions = {
      small: 3,
      medium: 4,
      large: 5.5,
      xlarge: 7
    };
    return positions[props.size || 'medium'];
  }, [props.size]);

  return (
    <div 
      style={{ 
        position: 'relative',
        cursor: isHovered && !props.disabled ? 'pointer' : 'default',
        width: '100%',
        height: containerDimensions.height,
      }}
    >
      <Suspense fallback={<div></div>}>
        <Canvas 
          camera={{ 
            position: [0, 0, cameraPosition], 
            fov: 35,
          }}
          style={{ 
            background: 'transparent',
            pointerEvents: 'auto',
            width: '100%',
            height: '100%',
          }}
          shadows
        >
          <Stage
            environment="city"
            intensity={0.5}
            position={[0, 0, props.size === 'xlarge' ? -1 : 0]}
            shadows={{
              type: 'contact',
              opacity: props.shadowOpacity || 0.7,
              blur: 300,
              far: 100,
              color: props.shadowColor || '#000000',
              amount: 100

            }}
          >
            <ExtrudeButtonInner {...props} onHover={setIsHovered} />
          </Stage>
        </Canvas>
      </Suspense>
    </div>
  );
};
