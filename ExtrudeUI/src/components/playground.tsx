import { ExtrudeButton } from './ExtrudeUIComponents/Button';
import { ExtrudeText } from './ExtrudeUIComponents/Text';
import { useState } from 'react';
import { ExtrudeImage } from './ExtrudeUIComponents/Image';
import { ExtrudeModel } from './ExtrudeUIComponents/OwnModel';


export default function Playground() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState('Custom Models');
    const [copySuccess, setCopySuccess] = useState(false);

    const installCommand = 'npm install extrude-ui';

    const handleCopyClick = async () => {
        try {
            await navigator.clipboard.writeText(installCommand);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const renderComponentDemo = () => {
        switch (selectedComponent) {
            case 'button':
                return (
                    <div className="flex flex-col items-center justify-between h-full py-8">
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
                        <p className="text-indigo-200 text-center max-w-md px-4">
                            Create eye-catching buttons with customizable gradients, animations, and depth effects.
                        </p>
                    </div>
                );
            case 'text':
                return (
                    <div className="flex flex-col items-center justify-between h-full py-8">
                        <ExtrudeText
                            children="3D Text"
                            color="black"
                            shadowColor="purple"
                            shadowOpacity={.4}
                            wobble={true}
                            wobbleSpeed={1}
                            wobbleStrength={.6}
                        >
                        </ExtrudeText>
                        <p className="text-indigo-200 text-center max-w-md px-4">
                            Transform your text with depth and shadows for striking headings and titles.
                        </p>
                    </div>
                );
            case 'image':
                return (
                    <div className="flex flex-col items-center justify-between h-full py-8">
                        <div className="w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px]">
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
                        <p className="text-indigo-200 text-center max-w-md px-4">
                            Add depth and interactivity to your images with floating animations and dynamic effects.
                        </p>
                    </div>
                );
            case 'Custom Models':
                return (
                    <div className="flex flex-col items-center justify-between h-full py-8">
                        <div className="w-[300px] h-[300px]">
                            <ExtrudeModel 
                                src="https://pgtgy4em2f.ufs.sh/f/oMW3imFO9N6PqdTcttYUZc9vfERBaeNPoywVsrtJ4LzlQTXW"
                                scale={1}
                                animation="spinHorizontal"
                                floatIntensity={0.2}
                                shadowColor="whitesmoke"
                                shadowOpacity={0.4}
                                cameraDistance={4}
                            />
                        </div>
                        <p className="text-indigo-200 text-center max-w-md px-4">
                            Provide your own 3D models and easily customize their display with animations and effects.
                        </p>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-[120vh] flex flex-col bg-gradient-to-b from-[#0a0635] to-[#1a0445]">
            {/* Navigation Bar */}
            <nav className="w-full border-b border-indigo-950/30 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    {/* Logo Section */}
                    <div className="w-[180px] h-[90px] relative">
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
                        className="md:hidden p-2 rounded-lg text-indigo-200 hover:bg-indigo-950/30 transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
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
                        <a href="#showcase" className="text-indigo-200 hover:text-white hover:bg-indigo-950/30 px-4 py-2 rounded-lg transition-all duration-200">
                        Showcase
                        </a>
                        <a href="#" className="text-indigo-200 hover:text-white hover:bg-indigo-950/30 px-4 py-2 rounded-lg transition-all duration-200">
                            Documentation
                        </a>
                        <a 
                            href="https://github.com/Oia20/ExtrudeUI" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-indigo-200 hover:text-white hover:bg-indigo-950/30 px-4 py-2 rounded-lg transition-all duration-200"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                            GitHub
                        </a>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute w-full bg-[#0a0635]/95 backdrop-blur-sm border-b border-indigo-950/30">
                        <div className="flex flex-col p-4 space-y-3">
                            <a href="#showcase" className="text-indigo-200 hover:text-white hover:bg-indigo-950/30 px-4 py-3 rounded-lg transition-all duration-200">
                                Showcase
                            </a>
                            <a href="#" className="text-indigo-200 hover:text-white hover:bg-indigo-950/30 px-4 py-3 rounded-lg transition-all duration-200">
                                Documentation
                            </a>
                            <a 
                                href="https://github.com/Oia20/ExtrudeUI" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-indigo-200 hover:text-white hover:bg-indigo-950/30 px-4 py-3 rounded-lg transition-all duration-200"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                                GitHub
                            </a>
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
                        loadingAnimation='spinner'
                        loadingColor='white'
                        />
                    </div>

                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 md:mb-6 tracking-tight p-4">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-violet-300">
                        Easily Add Depth
                    </span> to Your{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-blue-300">
                        Web Experiences.
                    </span>
                </h1>
                <p className="text-lg md:text-xl text-indigo-100 mb-8 p-8 md:mb-10 max-w-[42rem] mx-auto">
                    ExtrudeUI is the Open-Source React component library that seamlessly brings the third dimension to your 2D web apps. 
                </p>


                            {/* Component Showcase Section */}
            <div className="max-w-3xl mx-auto w-full py-24 px-4" id='showcase'>
                <div className="bg-[#1a0d5f]/60 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-indigo-500/30">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-violet-200 text-center mb-12">
                        Component Showcase
                    </h2>
                    
                    {/* Component Selector Buttons */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {['Custom Models', 'button', 'text', 'image'].map((component) => (
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

            {/* Quick Installation Section */}
            <div className="max-w-4xl mx-auto w-full py-16 px-4">
                <div className="bg-[#1a0d5f]/60 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-indigo-500/30">
                    <h2 className="text-2xl font-semibold text-white mb-4">Quick Installation</h2>
                    <div className="flex items-center gap-4">
                        <code className="flex-1 bg-[#130850] text-indigo-200 p-4 rounded-lg font-mono">
                            {installCommand}
                        </code>
                        <button
                            onClick={handleCopyClick}
                            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                        >
                            {copySuccess ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>
            </div>

            </div>

            {/* Open Source Section - replacing Why Choose ExtrudeUI */}
            <div className="max-w-6xl mx-auto w-full py-24 px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-violet-200 mb-6">
                        Free and Open Source Forever
                    </h2>
                </div>
                

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-[#1a0d5f]/60 backdrop-blur-xl rounded-2xl p-8 border border-indigo-500/30">
                        <div className="text-4xl mb-4">🌟</div>
                        <h3 className="text-xl font-semibold text-white mb-4">MIT Licensed</h3>
                        <p className="text-indigo-200">
                            Use ExtrudeUI in personal or commercial projects without restrictions. 
                            Our MIT license gives you the freedom to build without limits.
                        </p>
                    </div>
                    
                    <div className="bg-[#1a0d5f]/60 backdrop-blur-xl rounded-2xl p-8 border border-indigo-500/30">
                        <div className="text-4xl mb-4">🤝</div>
                        <h3 className="text-xl font-semibold text-white mb-4">Community Driven</h3>
                        <p className="text-indigo-200">
                            Have an idea for a component or found a bug? 
                            Contribute to ExtrudeUI and make it better for everyone.
                        </p>
                    </div>

                </div>

                
                <div className="mt-12 text-center">
                    <a 
                        href="https://github.com/Oia20/ExtrudeUI"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl text-white transition-colors"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                        View on GitHub
                    </a>
                </div>
            </div>

            {/* Replacing Community Section with Message from Creator */}
            <div className="max-w-4xl mx-auto w-full py-12 px-4 text-center">
            <ExtrudeModel 
                    src="https://pgtgy4em2f.ufs.sh/f/oMW3imFO9N6P0cyQDzc6iv43xUKDozXTAhcbr2IsZ0nWGq1J"
                    scale={.5}
                    animation='float'
                    animationSpeed={.5}
                    floatSpeed={3}
                    floatIntensity={20}
                    shadowColor="whitesmoke"
                    shadowOpacity={.4}
                    cameraDistance={200}
                    enableOrbitControls={true}
                    orbitControlsOptions={{
                        enableZoom: false,
                        enableRotate: true,
                        enablePan: false,
                      }}
                />
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-violet-200 mb-8">


                    Hey! I'm Jacob Dement


                </h2>
                <p className="text-indigo-200 mb-12 max-w-2xl mx-auto">



                    I built ExtrudeUI to make it easier for React developers to add 3D aspects to their web apps. I often found myself writing the same
                    boilerplate React Three Fiber code to add a touch of 3D to my React apps. ExtrudeUI aims to allow others to easily add 3D elements
                    to their web apps, even if they've never touched React Three Fiber before.
                </p>
                <div className="flex justify-center">
                    <a
                        href="https://github.com/Oia20"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-[#1a0d5f]/60 hover:bg-[#2a1b8a]/60 px-6 py-3 rounded-xl text-white transition-colors"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                        Say hi to me on GitHub!
                    </a>
                </div>
            </div>


            {/* Footer */}
            <footer className="border-t border-indigo-950/30 mt-24">
                <div className="max-w-6xl mx-auto px-4 py-12">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-white font-semibold mb-4">ExtrudeUI</h3>
                            <p className="text-indigo-200 text-sm">
                                Open source 3D React component library for modern web applications.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-4">Resources</h3>
                            <ul className="space-y-2 text-indigo-200">
                                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Examples</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-4">Community</h3>
                            <ul className="space-y-2 text-indigo-200">
                                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-4">Legal</h3>
                            <ul className="space-y-2 text-indigo-200">
                                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">License</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-indigo-950/30 text-center text-indigo-200">
                        <p>© {new Date().getFullYear()} ExtrudeUI. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}