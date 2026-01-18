import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const SOUNDS = {
    ocean: { path: '/sounds/Ocean.mp3', label: 'Deniz', icon: '🌊', color: 'bg-blue-100 text-blue-500' },
    forest: { path: '/sounds/Orman.mp3', label: 'Orman', icon: '🌲', color: 'bg-green-100 text-green-600' },
    birds: { path: '/sounds/birds.mp3', label: 'Kuşlar', icon: '🐦', color: 'bg-yellow-100 text-yellow-600' },
    jungle: { path: '/sounds/Ormanbird.mp3', label: 'Doğa', icon: '🦗', color: 'bg-emerald-100 text-emerald-600' },
};

export default function SoundBoard() {
    const [activeSound, setActiveSound] = useState(null);
    const [volume, setVolume] = useState(0.5);
    const audioRef = useRef(null);

    const getAssetPath = (path) => {
        const base = import.meta.env.BASE_URL || '/';
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        return `${base}${cleanPath}`;
    };

    // Update volume whenever it changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Handle sound toggle
    const toggleSound = (key) => {
        if (activeSound === key) {
            setActiveSound(null);
            if (audioRef.current) {
                audioRef.current.pause();
            }
        } else {
            setActiveSound(key);
            // Volume will be sync'd by the effect or the property
        }
    };

    // Handle play/pause when activeSound changes
    useEffect(() => {
        if (audioRef.current) {
            if (activeSound) {
                audioRef.current.src = getAssetPath(SOUNDS[activeSound].path);
                audioRef.current.load(); // Reload with new source
                audioRef.current.play().catch(e => console.warn("Audio play failed, waiting for user gesture:", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [activeSound]);

    return (
        <div className="bg-light/50 p-3 rounded-2xl backdrop-blur-sm">
            {/* Hidden Audio Element */}
            <audio
                ref={audioRef}
                loop
                preload="auto"
            />

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
                            onClick={() => toggleSound(key)}
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
                    step="0.01"
                    value={volume}
                    onInput={(e) => {
                        const newVol = parseFloat(e.target.value);
                        setVolume(newVol);
                        // Direct dom manipulation for instant feedback if React is slow
                        if (audioRef.current) audioRef.current.volume = newVol;
                    }}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-600 active:accent-blue-700"
                />
                <Volume2 size={14} className="text-gray-400" />
            </div>
        </div>
    );
}
