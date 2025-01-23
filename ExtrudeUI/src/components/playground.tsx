import { ExtrudeButton } from './ExtrudeUIComponents/Button';
import { ExtrudeText } from './ExtrudeUIComponents/Text';
import { useState } from 'react';
import { ExtrudeImage } from './ExtrudeUIComponents/Image';
import { ExtrudeModel } from './ExtrudeUIComponents/OwnModel';


export default function Playground() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState('Custom Model');

    const renderComponentDemo = () => {
        switch (selectedComponent) {
            case 'button':
                return (
                    <div className="flex flex-col items-center gap-4">
                        <ExtrudeButton 
                            text="Interactive Button"
                            depth={2}
                            shape="rounded"
                            textColor="whitesmoke"
                            shadowColor="white"
                            shadowOpacity={1}
                            gradient={{
                                from: '#3730a3',
                                to: '#1e40af',
                                angle: 45
                            }}
                            animation="flip"
                        />
                    </div>
                );
            case 'text':
                return (
                    <div className="flex flex-col items-center gap-4">
                        <ExtrudeText
                            children="3D Text"
                            color="black"
                            shadowColor="purple"
                            shadowOpacity={.4}>
                        </ExtrudeText >
                    </div>
                );
            case 'image':
                return (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-[400px] h-[400px]">
                            <ExtrudeImage 
                                src="https://pgtgy4em2f.ufs.sh/f/oMW3imFO9N6PdbCsIqLO4CcZVR3bHSPxKQw6tnGmNfksU0FX"
                                width={2}
                                height={1.5}
                                floatIntensity={0.2}
                                depth={0.2}
                                shadowColor="white"
                                wobble={true}
                                wobbleSpeed={1}
                                wobbleStrength={.6}
                            />
                        </div>
                    </div>
                );
            case 'Custom Model':
                return (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-[300px] h-[300px]">
                            <ExtrudeModel 
                                src="./my_computer.glb"
                                scale={1}
                                animation="spinHorizontal"
                                floatIntensity={0.2}
                                shadowColor="whitesmoke"
                                shadowOpacity={0.4}
                                cameraDistance={9}
                            />
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-[120vh] flex flex-col bg-gradient-to-b from-[#0a0635] to-[#1a0445]">
            {/* Navigation Bar */}
            <nav className="w-full border-b border-indigo-950/30">
                <div className="max-w-7xl pr-4 flex items-center justify-between">
                    {/* Logo Section - Set explicit height */}
                    <div className="w-[200px] h-[100px] relative">
                        <ExtrudeImage 
                            src="https://pgtgy4em2f.ufs.sh/f/oMW3imFO9N6PcOOHfvbMOvsrnRhEwqLJa7FIe6Gtj0Cg5WlT"
                            width={1}
                            height={1}
                            floatIntensity={.2}
                            frameColor="#FFD700"
                            depth={.2}
                            shadowColor='white'
                            wobble={true}
                            wobbleSpeed={1}
                            wobbleStrength={1}
                            shadowOpacity={1}
                            frameStyle='glass'
                            frame={false}
                            />
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        className="md:hidden text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#" className="text-zinc-300 hover:text-white transition-colors">
                            Components
                        </a>
                        <a href="#" className="text-zinc-300 hover:text-white transition-colors">
                            Documentation
                        </a>
                        <a href="#" className="text-zinc-300 hover:text-white transition-colors">
                            GitHub
                        </a>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden pt-4 pb-2">
                        <div className="flex flex-col gap-4">
                            <a href="#" className="text-zinc-300 hover:text-white transition-colors">Components</a>
                            <a href="#" className="text-zinc-300 hover:text-white transition-colors">Documentation</a>
                            <a href="#" className="text-zinc-300 hover:text-white transition-colors">Examples</a>
                            <a href="#" className="text-zinc-300 hover:text-white transition-colors">GitHub</a>
                        </div>
                    </div>
                )}
            </nav>


            {/* Rest of your content */}
            <div className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center">
            <div className='w-screen h-[200px]'>
                    <ExtrudeModel 
                        src="./my_computer.glb"
                        scale={1}
                        animation='spinHorizontal'
                        animationSpeed={.5}
                        floatSpeed={1}
                        floatIntensity={.2}
                        shadowColor="whitesmoke"
                        shadowOpacity={.4}
                        onClick={() => console.log('Model clicked!')}
                        cameraDistance={9}
                        fallback={<div className=''></div>}
                        />
                    </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 md:mb-6 tracking-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-violet-300">
                        Easily Add Depth
                    </span> to Your{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-blue-300">
                        Web Experiences
                    </span>
                </h1>
                <p className="text-lg md:text-xl text-indigo-100 mb-8 p-8 md:mb-10 max-w-[42rem] mx-auto">
                    ExtrudeUI is the React component library that brings the third dimension to your 2D web apps.
                </p>


                            {/* Component Showcase Section */}
            <div className="max-w-4xl mx-auto w-full px-4 py-24">
                <div className="bg-[#1a0d5f]/60 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-indigo-500/30">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-violet-200 text-center mb-12">
                        Component Showcase
                    </h2>
                    
                    {/* Component Selector Buttons */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {['Custom Model', 'button', 'text', 'image'].map((component) => (
                            <button
                                key={component}
                                onClick={() => setSelectedComponent(component)}
                                className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                                    selectedComponent === component
                                        ? 'bg-gradient-to-r from-blue-300 to-violet-300 text-indigo-900 shadow-lg shadow-blue-400/40'
                                        : 'bg-[#2a1b8a]/50 text-indigo-100 hover:bg-[#3525a9]/50 hover:text-white'
                                }`}
                            >
                                {component.charAt(0).toUpperCase() + component.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Component Demo Area */}
                    <div className="bg-[#130850] rounded-xl min-h-[400px] flex items-center justify-center border border-indigo-500/30 shadow-inner">
                        {renderComponentDemo()}
                    </div>
                </div>
            </div>

            </div>
        </div>
    );
}