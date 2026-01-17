import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const SOUNDS = {
    ocean: { path: '/sounds/Ocean.mp3', label: 'Deniz', icon: '🌊', color: 'bg-blue-100 text-blue-500' },
    forest: { path: '/sounds/Orman.mp3', label: 'Orman', icon: '🌲', color: 'bg-green-100 text-green-600' },
    birds: { path: '/sounds/birds.mp3', label: 'Kuşlar', icon: '🐦', color: 'bg-yellow-100 text-yellow-600' },
    jungle: { path: '/sounds/Ormanbird.mp3', label: 'Doğa', icon: '🦗', color: 'bg-emerald-100 text-emerald-600' },
};

export default function SoundBoard() {
    const [activeSound, setActiveSound] = useState(null); // 'ocean', 'forest', etc.
    const [volume, setVolume] = useState(0.5);
    const audioRef = useRef(new Audio());

    useEffect(() => {
        audioRef.current.loop = true;
        return () => {
            audioRef.current.pause();
        };
    }, []);

    const getAssetPath = (path) => {
        const base = import.meta.env.BASE_URL;
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        return `${base}${cleanPath}`;
    };

    useEffect(() => {
        if (activeSound) {
            audioRef.current.src = getAssetPath(SOUNDS[activeSound].path);
            audioRef.current.volume = volume;
            audioRef.current.play().catch(e => console.error("Audio play failed", e));
        } else {
            audioRef.current.pause();
        }
    }, [activeSound]);

    useEffect(() => {
        audioRef.current.volume = volume;
    }, [volume]);

    return (
        <div className="bg-light/50 p-3 rounded-2xl backdrop-blur-sm">
            <h4 className="flex items-center text-xs font-bold text-gray-500 mb-2">
                <Volume2 size={14} className="mr-2" />
                Odaklanma Sesi
            </h4>

            <div className="flex justify-between mb-2 gap-1.5">
                {Object.entries(SOUNDS).map(([key, data]) => {
                    const isActive = activeSound === key;
                    return (
                        <button
                            key={key}
                            onClick={() => setActiveSound(isActive ? null : key)}
                            title={data.label}
                            className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all text-lg
                        ${isActive
                                    ? 'bg-white shadow-pop scale-110 border-2 border-secondary'
                                    : 'bg-white/50 hover:bg-white hover:scale-105'
                                }`}
                        >
                            {data.icon}
                        </button>
                    )
                })}
            </div>

            <div className="flex items-center gap-2">
                <VolumeX size={14} className="text-gray-400" />
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <Volume2 size={14} className="text-gray-400" />
            </div>
        </div>
    );
}
