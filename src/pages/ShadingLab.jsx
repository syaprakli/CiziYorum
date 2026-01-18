import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, MousePointer2, Info } from 'lucide-react';

export default function ShadingLab() {
    const containerRef = useRef(null);
    const [lightPos, setLightPos] = useState({ x: 150, y: 150 });
    const [isDragging, setIsDragging] = useState(false);

    // Character center (approximate relative to container)
    const [center, setCenter] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const updateCenter = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setCenter({
                    x: rect.width / 2,
                    y: rect.height / 2
                });
            }
        };
        updateCenter();
        window.addEventListener('resize', updateCenter);
        return () => window.removeEventListener('resize', updateCenter);
    }, []);

    const handleMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();

        let clientX, clientY;
        if (e.touches) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        setLightPos({ x, y });
    };

    // Calculate Shading Direction for Label
    const getShadingLabel = () => {
        const dx = lightPos.x - center.x;
        const dy = lightPos.y - center.y;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const dist = Math.sqrt(dx * dx + dy * dy);

        // If very close to center, it's "Önden" (from front)
        if (dist < 40) return "Önden";

        if (angle > -112.5 && angle <= -67.5) return "Yukarıdan";
        if (angle > -67.5 && angle <= -22.5) return "Üst Sağ";
        if (angle > -22.5 && angle <= 22.5) return "Sağ Taraf";
        if (angle > 22.5 && angle <= 67.5) return "Sağ Alt";
        if (angle > 67.5 && angle <= 112.5) return "Aşağıdan";
        if (angle > 112.5 && angle <= 157.5) return "Sol Alt";
        if (angle > 157.5 || angle <= -157.5) return "Sol Taraf";
        if (angle > -157.5 && angle <= -112.5) return "Üst Sol";

        return "Arkadan"; // Default fallback
    };

    // Calculate Shadow Style
    const dx = center.x ? center.x - lightPos.x : 0;
    const dy = center.y ? center.y - lightPos.y : 0;
    const distance = Math.sqrt(dx * dx + dy * dy) || 1;

    // Shadow offset should be proportional to light distance but capped
    const shadowX = (dx / distance) * Math.min(distance / 5, 25);
    const shadowY = (dy / distance) * Math.min(distance / 5, 25);
    const shadowBlur = Math.min(distance / 8, 20);
    const shadowOpacity = Math.max(0.2, 0.8 - distance / 800);

    return (
        <div className="flex flex-col h-full bg-orange-50/30 rounded-3xl overflow-hidden border-4 border-white shadow-xl relative select-none">
            {/* Header Info */}
            <div className="p-6 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between z-10 shadow-sm">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-dark flex items-center gap-3">
                        Gölge Laboratuvarı <Sun className="text-yellow-500 fill-yellow-200 animate-spin-slow" size={32} />
                    </h1>
                    <p className="text-gray-500 font-medium">Güneşi sürükleyerek gölgelerin dansını izle!</p>
                </div>
                <motion.div
                    layout
                    className="bg-primary text-white px-6 py-3 rounded-2xl font-bold shadow-pop border-2 border-white"
                >
                    Konum: {getShadingLabel()}
                </motion.div>
            </div>

            {/* Interaction Area */}
            <div
                ref={containerRef}
                className="flex-1 relative cursor-none overflow-hidden touch-none bg-gradient-to-b from-blue-50 to-orange-50"
                onMouseMove={handleMove}
                onTouchMove={handleMove}
            >
                {/* Floor Grid */}
                <div className="absolute bottom-0 w-full h-1/2 bg-gray-200/20" style={{ perspective: '500px' }}>
                    <div className="w-full h-full border-t-2 border-gray-300/30 grid grid-cols-12 rotateX-45">
                        {[...Array(12)].map((_, i) => <div key={i} className="border-r border-gray-300/20" />)}
                    </div>
                </div>

                {/* The Sun (Light Source) */}
                <motion.div
                    animate={{ x: lightPos.x - 32, y: lightPos.y - 32 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300, mass: 0.5 }}
                    className="absolute z-40"
                >
                    <div className="relative group">
                        <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-40 rounded-full animate-pulse group-hover:opacity-60 transition-opacity" />
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/50">
                            <Sun size={36} className="text-white drop-shadow-md" />
                        </div>
                    </div>
                </motion.div>

                {/* The Character & Shadow Container */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <svg viewBox="0 0 400 400" className="w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] overflow-visible">
                        <defs>
                            {/* Robust Soft Shadow Filter */}
                            <filter id="shadowFilter" x="-100%" y="-100%" width="300%" height="300%">
                                <feGaussianBlur in="SourceAlpha" stdDeviation={shadowBlur / 1.5} />
                                <feOffset dx={shadowX * 2} dy={shadowY * 2} />
                                <feComponentTransfer>
                                    <feFuncA type="linear" slope={shadowOpacity} />
                                </feComponentTransfer>
                                <feMerge>
                                    <feMergeNode />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        <g filter="url(#shadowFilter)">
                            {/* Teddy Bear Body */}
                            <circle cx="200" cy="220" r="80" fill="#8D6E63" stroke="#5D4037" strokeWidth="4" />

                            {/* Feet */}
                            <circle cx="140" cy="290" r="30" fill="#795548" stroke="#5D4037" strokeWidth="3" />
                            <circle cx="260" cy="290" r="30" fill="#795548" stroke="#5D4037" strokeWidth="3" />

                            {/* Head */}
                            <circle cx="200" cy="130" r="70" fill="#A1887F" stroke="#5D4037" strokeWidth="4" />

                            {/* Ears */}
                            <circle cx="140" cy="80" r="25" fill="#8D6E63" stroke="#5D4037" strokeWidth="3" />
                            <circle cx="260" cy="80" r="25" fill="#8D6E63" stroke="#5D4037" strokeWidth="3" />
                            <circle cx="140" cy="80" r="12" fill="#D7CCC8" />
                            <circle cx="260" cy="80" r="12" fill="#D7CCC8" />

                            {/* Muzzle */}
                            <circle cx="200" cy="155" r="30" fill="#F5F5F5" />

                            {/* Eyes */}
                            <circle cx="175" cy="120" r="8" fill="#212121" />
                            <circle cx="225" cy="120" r="8" fill="#212121" />

                            {/* Highlights */}
                            <circle cx="172" cy="117" r="3" fill="white" />
                            <circle cx="222" cy="117" r="3" fill="white" />

                            {/* Nose */}
                            <ellipse cx="200" cy="140" rx="12" ry="8" fill="#3E2723" />
                        </g>
                    </svg>
                </div>

                {/* Light Connection Ray */}
                <svg className="absolute inset-0 z-10 pointer-events-none w-full h-full opacity-10">
                    <line
                        x1={lightPos.x} y1={lightPos.y}
                        x2={center.x || '50%'} y2={center.y || '50%'}
                        stroke="#F1C40F"
                        strokeWidth="4"
                        strokeDasharray="10,10"
                    />
                </svg>
            </div>

            {/* Educational Footer */}
            <div className="p-6 bg-white/90 backdrop-blur-md border-t border-gray-100 flex items-center gap-6 z-10">
                <div className="bg-orange-500 p-4 rounded-2xl text-white shadow-lg animate-bounce-slow">
                    <Info size={28} />
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-dark mb-1">Küçük Bir İpucu:</h4>
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed font-medium">
                        Işık nereden gelirse, gölge tam **tersi** yöne düşer. Güneş yaklaştıkça gölgen kısalır ve netleşir!
                    </p>
                </div>
            </div>
        </div>
    );
}
