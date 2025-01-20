import { ExtrudeButton } from './ExtrudeUIComponents/Button';

export default function Playground() {
    return (
        <div className="min-h-[120vh] flex flex-col items-center justify-center bg-black px-4 py-8">
            <div className="max-w-4xl mx-auto text-center">
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
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center">
                    <div className="w-[90vw] sm:w-[80vw] md:w-[50vw] lg:w-[40vw] xl:w-[35vw]">
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