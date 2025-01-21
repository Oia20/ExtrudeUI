import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import { animated, useSpring } from '@react-spring/three';
import * as THREE from 'three';

interface ExtrudeDropdownProps {
    options: string[];
    onSelect: (option: string) => void;
    width?: string;
    height?: string;
    color?: string;
    textColor?: string;
}

const ExtrudeDropdown: React.FC<ExtrudeDropdownProps> = ({ options, onSelect, width = '100%', height = '100%', color = 'gray', textColor = 'white' }) => {
    const [isOpen, setIsOpen] = useState(false);

   
    return (
      
    );
};

export default ExtrudeDropdown;