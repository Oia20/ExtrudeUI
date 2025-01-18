import { ExtrudeButton } from './ExtrudeUIComponents/Button';

export default function Playground() {
    return (
        <div className="min-h-[100vh] flex flex-col items-center justify-center bg-gradient-to-b from-blue-500 to-blue-900 px-4 py-8">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
                    Add Depth to Your Web Experience

                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8">
                    ExtrudeUI brings the third dimension to your web applications. 
                    Create immersive interfaces with our 3D-enhanced component library.
                </p>
                <div className="flex flex-col md:flex-row gap-6 md:gap-4 justify-center">
                    <div className="w-full md:w-[400px] h-[150px]">
                        <ExtrudeButton 
                            text="Glass Button"
                            onClick={() => console.log('clicked')}
                            variant="glass"
                            color="#4a90e2"
                            textColor="#f2f858"
                            size="large"
                            depth={-.1}
                        />

                    </div>

                    <div className="w-full md:w-[400px] h-[150px]">
                        <ExtrudeButton 
                            text="Solid Button"
                            onClick={() => console.log('clicked')}
                            variant="solid"
                            color="#e91e63"
                            textColor="#ffffff"
                            size="large"
                            hover={true}
                            opacity={0.5}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}