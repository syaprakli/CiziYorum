import { useState, useEffect } from 'react';
import { Shuffle, Zap, Palette, Brush, BrainCircuit, FlaskConical, Flame, Lock, Calendar, Star, Crown } from 'lucide-react';
import IdeaCard from '../components/features/IdeaCard';
import GameModal from '../components/features/GameModal';
import { calculateLevel, LEVELS } from '../data/gamification';
import { GAME_TYPES, HARD_TASKS, SCAMPER_QUESTIONS } from '../data/prompts';

import { fireConfetti } from '../utils/confetti';
import { getGallery, getUserLevel, saveUserLevel } from '../utils/storage';

export default function Dashboard() {

    // Get XP from Gallery Sketches
    const [gallery, setGallery] = useState([]);

    // Level Up State
    const [showLevelUp, setShowLevelUp] = useState(null);

    useEffect(() => {
        const checkProgress = async () => {
            try {
                const parsedGallery = await getGallery();
                setGallery(parsedGallery);

                // LEVEL UP CHECK
                const currentCount = parsedGallery.length;
                const { level: currentLevelId, details: currentLevelDetails } = calculateLevel(currentCount);

                const savedLevelId = await getUserLevel();

                if (currentLevelId > savedLevelId) {
                    // LEVEL UP!
                    fireConfetti();
                    setShowLevelUp(currentLevelDetails);
                    await saveUserLevel(currentLevelId);
                }
            } catch (e) { console.error(e); }
        };

        checkProgress();
    }, []);

    // XP is just the count of drawings for now
    const userXP = gallery.length;
    const { level } = calculateLevel(userXP);

    const [dailyTask, setDailyTask] = useState('');

    useEffect(() => {
        const today = new Date().toLocaleDateString('tr-TR');
        const savedDate = localStorage.getItem('dailyTaskDate');
        const savedTask = localStorage.getItem('dailyTaskContent');

        if (savedDate === today && savedTask) {
            setDailyTask(savedTask);
        } else {
            // Pick a random task from hard tasks or scamper questions
            const allTasks = [...HARD_TASKS, ...SCAMPER_QUESTIONS];
            const randomTask = allTasks[Math.floor(Math.random() * allTasks.length)];

            setDailyTask(randomTask);
            localStorage.setItem('dailyTaskDate', today);
            localStorage.setItem('dailyTaskContent', randomTask);
        }
    }, []);

    const games = [
        {
            id: 'simple',
            title: GAME_TYPES.simple.title,
            desc: GAME_TYPES.simple.desc,
            icon: Palette,
            color: GAME_TYPES.simple.color,
            minLevel: GAME_TYPES.simple.minLevel
        },
        {
            id: 'jar',
            title: GAME_TYPES.jar.title,
            desc: GAME_TYPES.jar.desc,
            icon: FlaskConical,
            color: GAME_TYPES.jar.color,
            minLevel: GAME_TYPES.jar.minLevel
        },
        {
            id: 'shape',
            title: GAME_TYPES.shape.title,
            desc: GAME_TYPES.shape.desc,
            icon: Brush,
            color: GAME_TYPES.shape.color,
            minLevel: GAME_TYPES.shape.minLevel
        },
        {
            id: 'absurd',
            title: GAME_TYPES.absurd.title,
            desc: GAME_TYPES.absurd.desc,
            icon: Shuffle,
            color: GAME_TYPES.absurd.color,
            minLevel: GAME_TYPES.absurd.minLevel
        },
        {
            id: 'scamper',
            title: GAME_TYPES.scamper.title,
            desc: GAME_TYPES.scamper.desc,
            icon: BrainCircuit,
            color: GAME_TYPES.scamper.color,
            minLevel: GAME_TYPES.scamper.minLevel
        },
        {
            id: 'hard',
            title: GAME_TYPES.hard.title,
            desc: GAME_TYPES.hard.desc,
            icon: Flame,
            color: GAME_TYPES.hard.color,
            minLevel: GAME_TYPES.hard.minLevel
        },
    ];

    const [activeGame, setActiveGame] = useState(null);

    const handleGameClick = (game) => {
        if (level < game.minLevel) return; // Prevent click if locked
        setActiveGame(game);
    };

    return (
        <div className="max-w-6xl mx-auto pb-10">
            {/* Level Info Banner */}
            <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <span className="font-bold text-gray-500 block text-sm">Mevcut Seviyen</span>
                    <span className="text-secondary text-2xl font-heading font-bold">{LEVELS[level - 1]?.title || 'Çırak'}</span>
                </div>
                <div className="text-right">
                    <span className="block text-3xl font-bold text-primary">{userXP}</span>
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Toplam Resim</span>
                </div>
            </div>

            {/* DAILY TASK BANNER */}
            <div className="mb-8 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-3xl p-1 shadow-pop transform hover:scale-[1.01] transition-transform">
                <div className="bg-white/90 backdrop-blur-sm rounded-[20px] p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-300 rounded-full opacity-20 transform translate-x-10 -translate-y-10"></div>

                    <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                        <div className="bg-yellow-100 p-4 rounded-full text-orange-500 shadow-inner">
                            <Calendar size={32} />
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                <h3 className="text-xs font-black text-orange-500 uppercase tracking-widest">Günün Görevi</h3>
                                <Star size={14} className="text-orange-400 fill-current" />
                            </div>
                            <p className="text-xl md:text-2xl font-bold text-dark leading-tight">
                                {dailyTask || "Görev yükleniyor..."}
                            </p>
                        </div>

                        <div className="hidden md:block">
                            <button
                                onClick={() => setActiveGame({
                                    id: 'daily',
                                    title: 'Günün Görevi',
                                    color: '#F1C40F',
                                    taskContent: dailyTask
                                })}
                                className="bg-dark text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-black transition-colors shadow-lg"
                            >
                                Kabul Et!
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map((game) => {
                    const isLocked = level < game.minLevel;

                    // Calculate required drawings
                    let remaining = 0;
                    if (isLocked) {
                        const targetLevel = LEVELS.find(l => l.id === game.minLevel);
                        if (targetLevel) {
                            remaining = targetLevel.target - userXP;
                        }
                    }

                    return (
                        <IdeaCard
                            key={game.id}
                            title={game.title}
                            description={isLocked ? `${remaining} resim daha çizmelisin!` : game.desc}
                            icon={game.icon}
                            color={game.color}
                            isNew={game.isNew}
                            isLocked={isLocked}
                            requiredLevel={game.minLevel}
                            onClick={() => handleGameClick(game)}
                        />
                    );
                })}
            </div>

            {activeGame && (
                <GameModal
                    gameId={activeGame.id}
                    gameTitle={activeGame.title}
                    gameColor={activeGame.color}
                    taskContent={activeGame.taskContent}
                    onClose={() => setActiveGame(null)}
                />
            )}

            {/* LEVEL UP MODAL */}
            {showLevelUp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in zoom-in duration-300">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center relative overflow-hidden shadow-2xl border-4 border-yellow-400">
                        {/* Background Splat */}
                        <div className="absolute top-0 left-0 w-full h-full bg-yellow-400/10 z-0"></div>

                        <div className="relative z-10">
                            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-500 shadow-inner animate-bounce">
                                <Crown size={48} />
                            </div>

                            <h2 className="text-3xl font-heading font-black text-dark mb-2">TEBRİKLER!</h2>
                            <p className="text-gray-500 font-bold text-lg mb-6">Yeni Bir Seviyeye Ulaştın!</p>

                            <div className={`p-4 rounded-2xl mb-8 ${showLevelUp.color} text-white shadow-lg transform scale-105`}>
                                <h3 className="text-2xl font-bold">{showLevelUp.title}</h3>
                                <p className="text-white/90 text-sm mt-1">{showLevelUp.desc}</p>
                            </div>

                            <button
                                onClick={() => setShowLevelUp(null)}
                                className="w-full bg-dark text-white font-bold py-4 rounded-xl hover:bg-black transition-colors shadow-lg"
                            >
                                Harika! 🚀
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
