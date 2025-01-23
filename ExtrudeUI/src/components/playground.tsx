import { ExtrudeButton } from './ExtrudeUIComponents/Button';
import { ExtrudeText } from './ExtrudeUIComponents/Text';
import { useState } from 'react';
import { ExtrudeImage } from './ExtrudeUIComponents/Image';
import { ExtrudeModel } from './ExtrudeUIComponents/OwnModel';


export default function Playground() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-[120vh] flex flex-col bg-zinc-950">
            {/* Navigation Bar */}
            <nav className="w-full border-b border-zinc-800">
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
                            Examples
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
            <div className='w-screen h-[300px]'>
                    <ExtrudeModel 
                        src="https://pgtgy4em2f.ufs.sh/f/oMW3imFO9N6PMoVElVQO8pGXljN6t5qRAgQyaudImEPvfhF7"
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
                    Add Depth to Your{' '}

                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                        Web Experience
                    </span>
                </h1>
                <p className="text-lg md:text-xl text-zinc-400 mb-8 md:mb-10 max-w-[42rem] mx-auto">
                    ExtrudeUI brings the third dimension to your web applications. 
                    Create immersive interfaces with our 3D-enhanced component library.
                </p>

                <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center items-center">
                    <div className="flex justify-center items-center w-[90vw] sm:w-[80vw] md:w-[50vw] lg:w-[40vw] xl:w-[35vw]">
                        <ExtrudeButton 

                            onClick={() => console.log('clicked')}
                            depth={2}
                            shape="rounded"

                            text="View Components" 

                            textColor='whitesmoke'
                            shadowColor='white'
                            shadowOpacity={1}

                            gradient={{
                                from: '#2a1e70',
                                to: '#004a99',
                                angle: 45
                            }}
                            animation='flip'
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}