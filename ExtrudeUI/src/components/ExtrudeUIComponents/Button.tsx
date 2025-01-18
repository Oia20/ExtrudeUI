import { useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import { animated, useSpring } from '@react-spring/three';
import { Float } from '@react-three/drei';



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
  opacity?: number;
}

const ExtrudeButtonInner = ({
  text = 'Button',
  onClick,
  disabled = false,
  variant = 'solid',
  color = '#1e88e5',
  size = 'medium',
  depth = 0.5,
  hover = true,
  textColor = '#ffffff',
  opacity = 1,
}: ExtrudeButtonProps) => {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  
  // Map size to dimensions
  const dimensions = {
    small: { width: 1.5, height: 0.5, fontSize: 0.15 },
    medium: { width: 2, height: 0.7, fontSize: 0.2 },
    large: { width: 2.5, height: 0.9, fontSize: 0.25 },
  }[size];
  
  const { scale, position, color: buttonColor } = useSpring({
    scale: hover && hovered ? 1.1 : 1,
    position: pressed ? [0, -0.15, 0] : [0, 0, 0],
    color: hovered ? color : color,
    config: { mass: 1, tension: 280, friction: 40 }
  });

  return (
    <animated.group position={position} scale={scale}>
      <mesh 
        receiveShadow 
        position={[0, -0.4, -0.2]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[dimensions.width + 0.5, depth + 1]} />
        <shadowMaterial transparent opacity={0.2} />
      </mesh>

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
        castShadow
        receiveShadow
      >
        <Float
          speed={2}
          rotationIntensity={0.2}
          floatIntensity={0.3}
          floatingRange={[-0.05, 0.05]}
        >
          <RoundedBox args={[dimensions.width, dimensions.height, depth]} radius={0.15}>
            <animated.meshPhysicalMaterial 
              color={buttonColor}
              transparent={true}
              transmission={variant === 'glass' ? 0.6 : 0}
              thickness={variant === 'glass' ? 0.8 : 0}
              roughness={variant === 'glass' ? 0.1 : 0.2}
              metalness={variant === 'glass' ? 0.7 : 0.6}
              clearcoat={1.5}
              clearcoatRoughness={0.05}
              opacity={opacity * (variant === 'glass' ? 0.8 : 1)}
              envMapIntensity={3}
              sheen={0.8}
              sheenRoughness={0.2}
              sheenColor={color}
              depthWrite={opacity === 1}
            />
          </RoundedBox>
          <Text
            position={[0, 0, depth / 2 + 0.01]}
            fontSize={dimensions.fontSize}
            color={textColor}
            anchorX="center"
            anchorY="middle"
            castShadow
            opacity={opacity}
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
      <Canvas 
        camera={{ position: [0, 0, 2.5], fov: 40 }}
        style={{ background: 'transparent' }}
        shadows
      >
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <pointLight position={[-5, -5, -5]} intensity={0.7} />
        <spotLight
          position={[0, 5, 2]}
          intensity={0.8}
          angle={0.6}
          penumbra={0.8}
          castShadow
          shadow-bias={-0.0001}
        />
        <ExtrudeButtonInner {...props} />
      </Canvas>
    </div>
  );
};
