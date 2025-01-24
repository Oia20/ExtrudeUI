import React from 'react';
import { Canvas } from '@react-three/fiber'
import { Text3D, OrbitControls, Center, Float, useHelper } from '@react-three/drei'
import * as THREE from 'three'
import { MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei'
import { useState, useRef, useEffect } from 'react'
import { forwardRef } from 'react'
import { Suspense } from 'react'

interface GradientProps {
  from: string;
  to: string;
  angle?: number;
}

interface ExtrudeTextProps {
    children: string;
    color?: string;
    gradient?: GradientProps;
    fontSize?: number;
    height?: number;
    letterSpacing?: number;

    bevelEnabled?: boolean;
    bevelSize?: number;
    bevelThickness?: number;
    metalness?: number;
    roughness?: number;
    distort?: number;
    distortSpeed?: number;
    floatIntensity?: number;
    shadowColor?: string;
    shadowOpacity?: number;
    animation?: 'float' | 'spin' | 'none';
    canvasHeight?: string | number;
    className?: string;
    style?: React.CSSProperties;
    lineHeight?: number;
    wobble?: boolean;
    wobbleSpeed?: number;
    wobbleStrength?: number;
    orbitControls?: boolean;
    
    // Loading state
    fallback?: React.ReactNode;
    loadingAnimation?: 'spinner' | 'pulse' | 'dots' | 'none';
    loadingColor?: string;
}

export const ExtrudeText = ({ 
    children = "Hello World",
    color = "#ffffff",
    gradient,
    fontSize = 1,
    height = 0.2,
    letterSpacing = 0.05,
    bevelEnabled = true,
    bevelSize = 0.02,
    bevelThickness = 0.02,
    metalness = 0.5,
    roughness = 0.2,
    distort = 0.2,
    distortSpeed = 2,
    floatIntensity = 0.5,
    shadowColor = "#000000",
    shadowOpacity = 0.2,
    animation = 'float',
    canvasHeight = 'auto',
    className = "",
    style = {},
    lineHeight = 1.2,
    wobble = false,
    wobbleSpeed = 1,
    wobbleStrength = 0.1,
    orbitControls = false,
    fallback,
    loadingAnimation = 'spinner',
    loadingColor = '#000000',
}: ExtrudeTextProps) => {
    const [scale, setScale] = useState(1);
    const [dimensions, setDimensions] = useState({ width: 300, height: 100 });
    const [wrappedText, setWrappedText] = useState(children);
    const textRef = useRef();
    const containerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (containerRef.current) {
            const containerWidth = containerRef.current.clientWidth;
            // Increased divisor to create more aggressive wrapping
            const charsPerLine = Math.floor(containerWidth / (fontSize * 35));
            
            const words = children.split(' ');
            let lines = [];
            let currentLine = '';
            
            words.forEach(word => {
                // Added length check to ensure lines don't get too long
                if ((currentLine + ' ' + word).length <= Math.min(charsPerLine, 30)) {
                    currentLine += (currentLine ? ' ' : '') + word;
                } else {
                    if (currentLine) lines.push(currentLine);
                    currentLine = word;
                }
            });
            if (currentLine) lines.push(currentLine);
            
            setWrappedText(lines.join('\n'));
            
            // Adjusted scale calculation for better text fitting
            const calculatedScale = Math.min(0.8, containerWidth / (wrappedText.length * fontSize * 25));
            
            setScale(calculatedScale);
            setDimensions({
                width: containerWidth,
                height: Math.max(100, lines.length * fontSize * 50)
            });
        }
    }, [children, fontSize, containerRef.current?.clientWidth]);

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
        <h1 
            className={className}
            style={{ 
                ...style,
                display: 'inline-block',
                position: 'relative',
                width: '100%',
                height: typeof canvasHeight === 'number' ? `${canvasHeight}px` : canvasHeight,
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
            <div 
                ref={containerRef} 
                style={{ 
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                }}
            >
                <Suspense fallback={fallback || <LoadingComponent />}>
                    <Canvas
                        camera={{ 
                            position: [0, 0, 5],
                            fov: 50,
                        }}
                        style={{ 
                            background: 'transparent',
                            height: '100%',
                            width: '100%',
                        }}
                        shadows
                    >
                        <ambientLight intensity={1} />
                        <pointLight 
                            position={[10, 10, 10]} 
                            castShadow 
                            intensity={100}
                            shadow-mapSize={[1024, 1024]}
                        />
                        
                        {/* Add shadow-catching plane */}
                        <mesh 
                            rotation={[-Math.PI / 2, 0, 0]} 
                            position={[0, -2, 0]} 
                            receiveShadow
                        >
                            <planeGeometry args={[100, 100]} />
                            <shadowMaterial 
                                transparent 
                                opacity={shadowOpacity} 
                                color={shadowColor} 
                            />
                        </mesh>

                        <Center scale={[scale * 1.5, scale * 1.5, scale * 1.5]}>
                            {animation === 'float' ? (
                                <Float 
                                    speed={1} // Animation speed
                                    rotationIntensity={0} // No rotation
                                    floatIntensity={floatIntensity} // Use the prop we already have
                                >
                                    <TextMesh
                                        ref={textRef}
                                        color={color}
                                        gradient={gradient}
                                        fontSize={fontSize}
                                        height={height}
                                        letterSpacing={letterSpacing}
                                        bevelEnabled={bevelEnabled}
                                        bevelSize={bevelSize}
                                        bevelThickness={bevelThickness}
                                        metalness={metalness}
                                        roughness={roughness}
                                        distort={distort}
                                        distortSpeed={distortSpeed}
                                        shadowColor={shadowColor}
                                        shadowOpacity={shadowOpacity}
                                        wobble={wobble}
                                        wobbleSpeed={wobbleSpeed}
                                        wobbleStrength={wobbleStrength}
                                    >
                                        {wrappedText}
                                    </TextMesh>
                                </Float>
                            ) : (
                                <TextMesh
                                    ref={textRef}
                                    color={color}
                                    gradient={gradient}
                                    fontSize={fontSize}
                                    height={height}
                                    letterSpacing={letterSpacing}
                                    bevelEnabled={bevelEnabled}
                                    bevelSize={bevelSize}
                                    bevelThickness={bevelThickness}
                                    metalness={metalness}
                                    roughness={roughness}
                                    distort={distort}
                                    distortSpeed={distortSpeed}
                                    shadowColor={shadowColor}
                                    shadowOpacity={shadowOpacity}
                                    wobble={wobble}
                                    wobbleSpeed={wobbleSpeed}
                                    wobbleStrength={wobbleStrength}
                                >
                                    {wrappedText}
                                </TextMesh>
                            )}
                        </Center>

                        {orbitControls && (
                            <OrbitControls 
                                enableZoom={false}
                                enablePan={false}
                            />
                        )}
                    </Canvas>
                </Suspense>
            </div>
        </h1>
    )
}

const TextMesh = forwardRef(({
    children,
    color,
    gradient,
    fontSize,
    height,
    letterSpacing,
    bevelEnabled,
    bevelSize,
    bevelThickness,
    metalness,
    roughness,
    distort,
    distortSpeed,
    shadowColor,
    shadowOpacity,
    wobble,
    wobbleSpeed,
    wobbleStrength,
}, ref) => {
    return (
        <Text3D
            ref={ref}
            font="https://pgtgy4em2f.ufs.sh/f/oMW3imFO9N6PdqYTx0pLO4CcZVR3bHSPxKQw6tnGmNfksU0F"
            size={fontSize}
            height={height}
            letterSpacing={letterSpacing}
            bevelEnabled={bevelEnabled}
            bevelSize={bevelSize}
            bevelThickness={bevelThickness}
            castShadow
        >
            {children}
            {gradient ? (
                <meshPhysicalMaterial
                    metalness={metalness}
                    roughness={roughness}
                    onBeforeCompile={(shader) => {
                        shader.uniforms.time = { value: 0 }
                        shader.vertexShader = `
                            varying vec2 vUv;
                            ${shader.vertexShader}
                        `.replace(
                            `#include <begin_vertex>`,
                            `#include <begin_vertex>
                            vUv = uv;`
                        )
                        shader.fragmentShader = `
                            uniform float time;
                            varying vec2 vUv;
                            
                            vec3 gradient(vec2 uv, vec3 color1, vec3 color2, float angle) {
                                float c = cos(angle);
                                float s = sin(angle);
                                vec2 p = vec2(uv.x * c - uv.y * s, uv.x * s + uv.y * c);
                                return mix(color1, color2, p.x);
                            }
                            ${shader.fragmentShader}`
                        shader.fragmentShader = shader.fragmentShader.replace(
                            `vec4 diffuseColor = vec4( diffuse, opacity );`,
                            `vec3 color1 = vec3(${new THREE.Color(gradient.from).r}, ${new THREE.Color(gradient.from).g}, ${new THREE.Color(gradient.from).b});
                            vec3 color2 = vec3(${new THREE.Color(gradient.to).r}, ${new THREE.Color(gradient.to).g}, ${new THREE.Color(gradient.to).b});
                            vec3 gradientColor = gradient(vUv, color1, color2, ${(gradient.angle || 0) * Math.PI / 180.0});
                            vec4 diffuseColor = vec4(gradientColor, opacity);`
                        )
                    }}
                />
            ) : wobble ? (
                <MeshWobbleMaterial 
                    color={color}
                    factor={wobbleStrength} // Strength of the wobble
                    speed={wobbleSpeed} // Speed of the wobble
                    metalness={metalness}
                    roughness={roughness}
                />
            ) : (
                <MeshDistortMaterial 
                    radius={1} 
                    color={color} 
                    distort={distort} 
                    speed={distortSpeed}
                    metalness={metalness}
                    roughness={roughness}
                />
            )}
        </Text3D>
    )
});