import { useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import { animated, useSpring } from '@react-spring/three';
import { Float } from '@react-three/drei';
import { MeshRefractionMaterial } from '@react-three/drei';



interface ExtrudeButtonProps {
  // Core props
  text?: string;
  onClick?: () => void;
  disabled?: boolean;
  
  // Basic styling
  variant?: 'solid' | 'glass';
  color?: string;
  size?: 'small' | 'medium' | 'large';
  
  // 3D properties
  depth?: number;
  hover?: boolean;
  textColor?: string;
}

const ExtrudeButtonInner = ({
  text = 'Button',
  onClick,
  disabled = false,
  variant = 'solid',
  color = '#1e88e5',
  size = 'medium',
  depth = 0.3,
  hover = true,
  textColor = '#ffffff',
}: ExtrudeButtonProps) => {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  
  // Map size to dimensions
  const dimensions = {
    small: { width: 1.5, height: 0.4, fontSize: 0.15 },
    medium: { width: 2, height: 0.6, fontSize: 0.2 },
    large: { width: 2.5, height: 0.8, fontSize: 0.25 },
  }[size];
  
  const { scale, position, color: buttonColor } = useSpring({
    scale: hover && hovered ? 1.05 : 1,
    position: pressed ? [0, -0.1, 0] : [0, 0, 0],
    color: hovered ? color : color,
    config: { mass: 1, tension: 280, friction: 40 }
  });

  return (
    <animated.group position={position} scale={scale}>
      <animated.mesh
        onClick={(e) => {
          if (!disabled) {
            e.stopPropagation();
            onClick?.();
          }
        }}
        onPointerDown={() => !disabled && setPressed(true)}
        onPointerUp={() => !disabled && setPressed(false)}
        onPointerOver={() => !disabled && setHovered(true)}
        onPointerOut={() => {
          if (!disabled) {
            setHovered(false);
            setPressed(false);
          }
        }}
      >
        <Float>
        <RoundedBox args={[dimensions.width, dimensions.height, depth]} radius={0.1}>
          <animated.meshPhysicalMaterial 
            color={buttonColor}
            transparent
            transmission={variant === 'glass' ? 0.4 : 0}
            thickness={variant === 'glass' ? 0.5 : 0}
            roughness={variant === 'glass' ? 0.1 : 0.4}
            metalness={variant === 'glass' ? 0.3 : 0.1}
            clearcoat={0.5}
            clearcoatRoughness={0.2}
            opacity={variant === 'glass' ? 0.8 : 1}
            envMapIntensity={1}
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
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 2], fov: 45 }} style={{ background: 'transparent' }}>
        {/* <ambientLight intensity={0.5} /> */}
        {/* <pointLight position={[10, 10, 10]} intensity={1.5} /> */}
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <ExtrudeButtonInner {...props} />
        
      </Canvas>
    </div>
  );
};
