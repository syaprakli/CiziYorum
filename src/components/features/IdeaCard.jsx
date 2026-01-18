import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

export default function IdeaCard({ title, description, icon: Icon, color, onClick, isNew, isLocked, requiredLevel }) {
    if (isLocked) {
        return (
            <div className="relative p-6 rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 cursor-not-allowed overflow-hidden">
                {/* Lock Badge */}
                <div className="absolute top-4 right-4 z-20 flex flex-col items-end">
                    <div className="bg-gray-300 text-white p-2 rounded-full mb-1 shadow-sm">
                        <Lock size={16} />
                    </div>
                    <span className="font-bold text-gray-400 text-[10px] uppercase tracking-wider">Seviye {requiredLevel}</span>
                </div>

                <div className="opacity-40 pointer-events-none">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-gray-200 text-gray-400`}>
                        <Icon size={32} />
                    </div>
                    <h3 className="text-xl font-heading font-bold text-gray-500 mb-2">{title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`relative p-6 rounded-3xl cursor-pointer shadow-lg hover:shadow-xl transition-shadow bg-white border-t-8 overflow-hidden`}
            style={{ borderColor: color }}
        >
            {/* Background Icon Opacity */}
            <Icon className="absolute -right-4 -bottom-4 w-32 h-32 opacity-5 text-gray-500 transform rotate-12" />

            <div className="relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-white`} style={{ backgroundColor: color }}>
                    <Icon size={32} />
                </div>

                <h3 className="text-xl font-heading font-bold text-dark mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
            </div>

            {isNew && (
                <div className="absolute top-4 right-4 bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse shadow-md">
                    YENİ
                </div>
            )}
        </motion.div>
    );
}
