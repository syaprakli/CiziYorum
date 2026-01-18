import { useState, useEffect } from 'react';
import { X, RefreshCcw, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ADJECTIVES, NOUNS, SCAMPER_QUESTIONS, HARD_TASKS, SHAPE_PROMPTS, DRAW_FROM_IMAGE_TASKS } from '../../data/prompts';
import { generateCreativePrompt } from '../../services/gemini';

export default function GameModal({ gameId, onClose, gameTitle, gameColor, taskContent }) {
    const [prompt, setPrompt] = useState(taskContent || 'Düşünülüyor...');
    const [imageTask, setImageTask] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const generatePrompt = async () => {
        if (taskContent) {
            setPrompt(taskContent);
            return;
        }

        setLoading(true);
        let newPrompt = '';
        const r = (arr) => arr[Math.floor(Math.random() * arr.length)];

        // 50% Chance to use AI for supported modes (Daily, Hard, Scamper, Shape)
        // Or if it's 'jar' / 'absurd' stick to local logic for speed/consistency of the game mechanics
        const useAI = ['daily', 'hard', 'scamper', 'shape'].includes(gameId) && Math.random() > 0.3;

        if (useAI) {
            setPrompt("Yapay Zeka Harika Bir Fikir Buluyor... 🤖💭");
            const aiPrompt = await generateCreativePrompt(gameId);
            if (aiPrompt) {
                setPrompt(aiPrompt);
                setLoading(false);
                return;
            }
        }

        // Fallback or Non-AI Logic
        switch (gameId) {
            case 'daily':
                const type = Math.random();
                if (type < 0.3) newPrompt = `${r(ADJECTIVES)} ${r(NOUNS)} çiz!`;
                else if (type < 0.6) newPrompt = `Soru: ${r(SCAMPER_QUESTIONS)}`;
                else newPrompt = `Görev: ${r(HARD_TASKS)}`;
                break;
            case 'simple':
                newPrompt = `${r(NOUNS)} çiz.`;
                break;
            case 'absurd':
                newPrompt = `Bir "${r(ADJECTIVES)} ${r(NOUNS)}" çiz!`;
                break;
            case 'jar':
                // Get 3 unique nouns
                const shuffled = [...NOUNS].sort(() => 0.5 - Math.random());
                const selected = shuffled.slice(0, 3);
                newPrompt = `Kavanozdan şunlar çıktı: \n1. Bir ${selected[0]}\n2. Bir ${selected[1]}\n3. Ve bir ${selected[2]}! \n\nHepsini tek resimde kullanabilir misin?`;
                break;
            case 'scamper':
                newPrompt = r(SCAMPER_QUESTIONS);
                break;
            case 'shape':
                newPrompt = r(SHAPE_PROMPTS);
                break;
            case 'hard':
                newPrompt = r(HARD_TASKS);
                break;
            case 'imageTask':
                const task = r(DRAW_FROM_IMAGE_TASKS);
                setImageTask(task);
                newPrompt = `Bakalım bunu çizebilir misin: ${task.label}`;
                break;
            default:
                newPrompt = "Sürpriz bir şeyler çiz!";
        }
        setPrompt(newPrompt);
        setLoading(false);
    };

    useEffect(() => {
        if (!taskContent) {
            generatePrompt();
        }
    }, [gameId, taskContent]);

    const handleStartDrawing = () => {
        onClose();
        navigate('/upload', { state: { mission: prompt } });
    };

    // Helper to resolve asset paths correctly on GitHub Pages
    const getAssetPath = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        const base = import.meta.env.BASE_URL || '/';
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        return `${base}${cleanPath}`;
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-dark/80 backdrop-blur-sm p-4"
                onClick={onClose} // Click outside to close
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative"
                    onClick={(e) => e.stopPropagation()} // Prevent close on modal click
                >
                    {/* Header */}
                    <div className="p-6 text-white relative overflow-hidden" style={{ backgroundColor: gameColor || '#6C5CE7' }}>
                        <h2 className="text-3xl font-heading font-bold relative z-10">{gameTitle}</h2>
                        <div className="absolute -bottom-10 -right-10 opacity-20 text-9xl">🎨</div>

                        <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-white/80 bg-black/20 hover:bg-black/30 p-2 rounded-full transition-colors z-20">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-8 text-center min-h-[300px] flex flex-col items-center justify-center bg-white">
                        {loading ? (
                            <div className="animate-pulse flex flex-col items-center">
                                <Sparkles className="text-primary mb-4 animate-spin-slow" size={48} />
                                <p className="text-xl text-gray-400 font-bold">{prompt}</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-6">
                                {gameId === 'imageTask' && imageTask && (
                                    <div className="w-48 h-48 bg-gray-50 rounded-3xl p-4 flex items-center justify-center shadow-inner mb-2">
                                        <img
                                            src={getAssetPath(imageTask.img)}
                                            alt={imageTask.label}
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    </div>
                                )}
                                <p className="text-2xl font-bold text-dark leading-relaxed whitespace-pre-line">
                                    {prompt}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer Controls */}
                    <div className="p-6 bg-gray-50 flex justify-center gap-4">
                        {!taskContent && (
                            <button
                                onClick={generatePrompt}
                                className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:border-primary hover:text-primary transition-colors shadow-sm"
                            >
                                <RefreshCcw size={20} />
                                Başka Ver
                            </button>
                        )}

                        <button
                            onClick={handleStartDrawing}
                            className="flex items-center gap-2 px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-pop active:scale-95 text-lg"
                        >
                            <ArrowRight size={24} />
                            Çizmeye Başla!
                        </button>
                    </div>

                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
