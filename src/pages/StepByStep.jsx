import { useState } from 'react';
import { ArrowLeft, ArrowRight, X, BookOpen, Check, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { STEP_TUTORIALS } from '../data/education';

export default function StepByStep() {
    const navigate = useNavigate();
    const [activeTutorial, setActiveTutorial] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPrepared, setIsPrepared] = useState(false);

    const handleOpenTutorial = (tutorial) => {
        setActiveTutorial(tutorial);
        setCurrentStep(0);
        setIsPrepared(false); // Reset preparation state
    };

    const handleNext = () => {
        if (currentStep < activeTutorial.steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleFinish();
        }
    };

    const handleFinish = () => {
        navigate('/upload', {
            state: {
                mission: activeTutorial.title + " resmi çizme görevi"
            }
        });
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleClose = () => {
        setActiveTutorial(null);
        setIsPrepared(false);
    };

    // Helper to resolve asset paths correctly on GitHub Pages
    const getAssetPath = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path; // External link
        // Clean double slashes if base url ends with / and path starts with /
        const base = import.meta.env.BASE_URL;
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        return `${base}${cleanPath}`;
    };

    return (
        <div className="max-w-6xl mx-auto pb-10">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-400 to-cyan-400 rounded-3xl p-8 shadow-soft text-white mb-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full transform -translate-x-10 -translate-y-10" />
                <h1 className="text-4xl font-heading font-bold mb-2 relative z-10">Adım Adım Çizim 📏</h1>
                <p className="text-white/90 font-medium text-lg relative z-10">Ekrana bak, kağıdına çiz!</p>
            </div>

            {/* List Grid */}
            {!activeTutorial && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {STEP_TUTORIALS.map((tutorial) => (
                        <div
                            key={tutorial.id}
                            className="bg-white rounded-3xl p-5 shadow-soft hover:shadow-pop transition-all border-2 border-transparent hover:border-blue-200 flex flex-col h-full"
                        >
                            <div className="relative rounded-2xl overflow-hidden aspect-square mb-5 bg-gray-50 flex items-center justify-center p-4">
                                {tutorial.thumbnail ? (
                                    <img src={getAssetPath(tutorial.thumbnail)} alt={tutorial.title} className="w-full h-full object-contain" />
                                ) : (
                                    <BookOpen className="text-blue-300" size={64} />
                                )}
                            </div>

                            <h3 className="font-bold text-dark text-xl mb-2">{tutorial.title}</h3>
                            <p className="text-gray-400 text-sm font-medium mb-6 flex-1">{tutorial.desc}</p>

                            <button
                                onClick={() => handleOpenTutorial(tutorial)}
                                className="w-full bg-blue-500 text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200"
                            >
                                Derse Başla
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Preparation Sscreen */}
            {activeTutorial && !isPrepared && (
                <div className="fixed inset-0 bg-blue-500/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl">
                        <div className="w-24 h-24 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Pencil size={48} />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Hazır mısın?</h2>
                        <p className="text-gray-500 text-lg mb-8">
                            Çizime başlamadan önce yanına şunları almayı unutma:
                        </p>
                        <ul className="text-left bg-gray-50 p-6 rounded-2xl mb-8 space-y-4">
                            <li className="flex items-center gap-3 text-gray-700 font-medium">
                                <div className="w-6 h-6 rounded-full bg-green-100 text-green-500 flex items-center justify-center flex-shrink-0">
                                    <Check size={14} />
                                </div>
                                Boş bir kağıt 📄
                            </li>
                            <li className="flex items-center gap-3 text-gray-700 font-medium">
                                <div className="w-6 h-6 rounded-full bg-green-100 text-green-500 flex items-center justify-center flex-shrink-0">
                                    <Check size={14} />
                                </div>
                                Kurşun kalem ✏️
                            </li>
                            <li className="flex items-center gap-3 text-gray-700 font-medium">
                                <div className="w-6 h-6 rounded-full bg-green-100 text-green-500 flex items-center justify-center flex-shrink-0">
                                    <Check size={14} />
                                </div>
                                Silgi (Hata yapmaktan korkma!) 🧼
                            </li>
                        </ul>
                        <div className="flex gap-4">
                            <button
                                onClick={handleClose}
                                className="flex-1 py-4 rounded-xl font-bold border-2 border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                            >
                                Vazgeçtim
                            </button>
                            <button
                                onClick={() => setIsPrepared(true)}
                                className="flex-1 py-4 rounded-xl font-bold bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-200 transition-all scale-105"
                            >
                                Her Şey Hazır! 🚀
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Step Viewer (Focus Mode) */}
            {activeTutorial && isPrepared && (
                <div className="fixed inset-0 z-50 bg-white flex flex-col">
                    {/* Top Bar */}
                    <div className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleClose}
                                className="w-10 h-10 bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-500 rounded-full flex items-center justify-center transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <div>
                                <h2 className="font-bold text-xl text-gray-800">{activeTutorial.title}</h2>
                                <p className="text-sm text-gray-500 font-medium">Adım {currentStep + 1} / {activeTutorial.steps.length}</p>
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="hidden md:flex gap-1">
                            {activeTutorial.steps.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`w-3 h-3 rounded-full transition-all ${idx === currentStep ? 'bg-blue-500 scale-125' : idx < currentStep ? 'bg-blue-200' : 'bg-gray-100'}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                        {/* Image - Center Stage */}
                        <div className="flex-1 bg-gray-50 relative flex items-center justify-center p-8 overflow-auto">
                            {/* Grid Pattern Background */}
                            <div className="absolute inset-0 opacity-[0.05]"
                                style={{
                                    backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                                    backgroundSize: '40px 40px'
                                }}
                            ></div>

                            <img
                                src={getAssetPath(activeTutorial.steps[currentStep].img)}
                                alt={`Step ${currentStep + 1}`}
                                className="max-w-full max-h-full object-contain drop-shadow-2xl bg-white p-4 rounded-2xl"
                            />
                        </div>

                        {/* Instruction Panel */}
                        <div className="w-full md:w-96 bg-white border-l shadow-xl z-10 flex flex-col">
                            <div className="flex-1 p-8 flex flex-col justify-center">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-black text-2xl mb-6 shadow-sm">
                                    {currentStep + 1}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4 leading-snug">
                                    {activeTutorial.steps[currentStep].text}
                                </h3>
                                <p className="text-gray-400 font-medium">
                                    Bu adımı kağıdına dikkatlice çiz. Acele etme!
                                </p>
                            </div>

                            {/* Navigation Buttons */}
                            <div className="p-6 border-t bg-gray-50 flex gap-4">
                                <button
                                    onClick={handlePrev}
                                    disabled={currentStep === 0}
                                    className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                                    ${currentStep === 0
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-100'}`}
                                >
                                    <ArrowLeft size={20} />
                                    Geri
                                </button>
                                <button
                                    onClick={handleNext}
                                    className={`flex-[2] py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-white shadow-lg
                                    ${currentStep === activeTutorial.steps.length - 1
                                            ? 'bg-green-500 shadow-green-200 hover:bg-green-600'
                                            : 'bg-blue-500 shadow-blue-200 hover:bg-blue-600'}`}
                                >
                                    {currentStep === activeTutorial.steps.length - 1 ? 'Bitirdim! 🎉' : 'Sıradaki Adım'}
                                    {currentStep !== activeTutorial.steps.length - 1 && <ArrowRight size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
