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
    const dx = center.x - lightPos.x;
    const dy = center.y - lightPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Shadow offset should be proportional to light distance but capped
    const shadowX = (dx / (distance || 1)) * Math.min(distance / 5, 20);
    const shadowY = (dy / (distance || 1)) * Math.min(distance / 5, 20);
    const shadowBlur = Math.min(distance / 10, 15);
    const shadowOpacity = Math.max(0.3, 1 - distance / 1000);

    return (
        <div className="flex flex-col h-full bg-slate-50 rounded-3xl overflow-hidden border-2 border-white shadow-inner relative select-none">
            {/* Header Info */}
            <div className="p-6 bg-white border-b border-gray-100 flex items-center justify-between z-10">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-dark flex items-center gap-2">
                        Işık ve Gölge Laboratuvarı <Sun className="text-yellow-500 animate-pulse" />
                    </h1>
                    <p className="text-gray-500 text-sm">Güneşi hareket ettirerek gölgelerin nasıl değiştiğini keşfet!</p>
                </div>
                <div className="bg-primary/10 text-primary px-4 py-2 rounded-2xl font-bold border-2 border-primary/20">
                    Konum: <span className="text-primary-dark">{getShadingLabel()}</span>
                </div>
            </div>

            {/* Interaction Area */}
            <div
                ref={containerRef}
                className="flex-1 relative cursor-crosshair overflow-hidden touch-none"
                onMouseMove={handleMove}
                onTouchMove={handleMove}
            >
                {/* Visual Guides */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-400 border-dashed border" />
                    <div className="absolute top-0 left-1/2 w-[1px] h-full bg-gray-400 border-dashed border" />
                </div>

                {/* The Sun (Light Source) */}
                <motion.div
                    animate={{ x: lightPos.x - 24, y: lightPos.y - 24 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                    className="absolute z-30 pointer-events-none"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-60 rounded-full animate-pulse" />
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-300 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                            <Sun size={28} className="text-white" />
                        </div>
                    </div>
                </motion.div>

                {/* The Character (Teddy Bear Stylized) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <div
                        className="relative w-48 h-48 sm:w-64 sm:h-64 transition-all duration-75"
                        style={{
                            filter: `drop-shadow(${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0,0,0,${shadowOpacity}))`
                        }}
                    >
                        {/* Teddy Bear SVG Representation */}
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                            {/* Ears */}
                            <circle cx="60" cy="60" r="25" fill="#A1887F" />
                            <circle cx="140" cy="60" r="25" fill="#A1887F" />
                            <circle cx="60" cy="60" r="15" fill="#D7CCC8" />
                            <circle cx="140" cy="60" r="15" fill="#D7CCC8" />

                            {/* Head */}
                            <circle cx="100" cy="110" r="70" fill="#8D6E63" />

                            {/* Muzzle */}
                            <circle cx="100" cy="130" r="30" fill="#D7CCC8" />

                            {/* Nose */}
                            <ellipse cx="100" cy="115" rx="10" ry="7" fill="#3E2723" />

                            {/* Eyes */}
                            <circle cx="75" cy="100" r="6" fill="#212121" />
                            <circle cx="125" cy="100" r="6" fill="#212121" />

                            {/* Body (partial) */}
                            <path d="M 40,180 Q 100,220 160,180 L 160,200 L 40,200 Z" fill="#795548" />

                            {/* Inner Shading Overlay (Simulates local shading) */}
                            <defs>
                                <radialGradient id="innerShade" cx={lightPos.x / 3 + "%"} cy={lightPos.y / 3 + "%"}>
                                    <stop offset="0%" stopColor="white" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="black" stopOpacity="0.4" />
                                </radialGradient>
                            </defs>
                            <circle cx="100" cy="110" r="70" fill="url(#innerShade)" style={{ mixBlendMode: 'overlay' }} />
                        </svg>
                    </div>
                </div>

                {/* Light Rays Interaction Feedback */}
                <svg className="absolute inset-0 z-10 pointer-events-none w-full h-full opacity-10">
                    <line
                        x1={lightPos.x} y1={lightPos.y}
                        x2={center.x} y2={center.y}
                        stroke="#F1C40F"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                    />
                </svg>
            </div>

            {/* Educational Footer */}
            <div className="p-6 bg-white border-t border-gray-100 flex items-center gap-4">
                <div className="bg-orange-100 p-3 rounded-full text-orange-500">
                    <Info size={24} />
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                    <strong>Unutma:</strong> Işık nereden gelirse, gölge tam **tersi** yöne düşer. Işık uzaklaştıkça gölge daha yumuşak ve belirsiz olur, yaklaştıkça ise keskinleşir!
                </p>
            </div>
        </div>
    );
}
