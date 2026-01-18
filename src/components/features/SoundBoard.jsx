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

    // Web Audio Refs
    const audioRef = useRef(null);
    const audioContextRef = useRef(null);
    const gainNodeRef = useRef(null);
    const sourceRef = useRef(null);

    const getAssetPath = (path) => {
        const base = import.meta.env.BASE_URL || '/';
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        return `${base}${cleanPath}`;
    };

    // Initialize Web Audio API
    const initWebAudio = () => {
        if (!audioContextRef.current) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContextRef.current = new AudioContext();
            gainNodeRef.current = audioContextRef.current.createGain();

            // Connect GainNode to Destination (speakers)
            gainNodeRef.current.connect(audioContextRef.current.destination);

            // Connect Audio Element to GainNode
            if (audioRef.current && !sourceRef.current) {
                sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
                sourceRef.current.connect(gainNodeRef.current);
            }
        }

        // Always try to resume context (handles browser auto-play policies)
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }
    };

    // Sync volume with GainNode
    useEffect(() => {
        if (gainNodeRef.current) {
            // Using gain.value instead of audio.volume for iOS support
            gainNodeRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
        }
    }, [volume]);

    // Handle sound toggle
    const toggleSound = (key) => {
        // Essential: Initialize/Resume on user gesture
        initWebAudio();

        if (activeSound === key) {
            setActiveSound(null);
            if (audioRef.current) {
                audioRef.current.pause();
            }
        } else {
            setActiveSound(key);
        }
    };

    // Handle play/pause when activeSound changes
    useEffect(() => {
        if (audioRef.current && activeSound) {
            audioRef.current.src = getAssetPath(SOUNDS[activeSound].path);
            audioRef.current.load();
            audioRef.current.play().catch(e => console.warn("Audio play failed:", e));
        } else if (audioRef.current) {
            audioRef.current.pause();
        }
    }, [activeSound]);

    return (
        <div className="bg-light/50 p-3 rounded-2xl backdrop-blur-sm">
            {/* Standard Audio Element - now controlled by GainNode */}
            <audio
                ref={audioRef}
                loop
                crossOrigin="anonymous"
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
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <Volume2 size={14} className="text-gray-400" />
            </div>
        </div>
    );
}
