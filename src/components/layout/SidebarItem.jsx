import { motion } from 'framer-motion';

export default function SidebarItem({ icon: Icon, label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`relative flex items-center w-full p-4 mb-2 rounded-2xl transition-all duration-300 font-bold font-sans text-lg
        ${active
                    ? 'bg-primary text-white shadow-pop scale-105'
                    : 'text-gray-400 hover:bg-light hover:text-dark hover:scale-105'
                }`}
        >
            <Icon className="w-8 h-8 mr-4" variant={active ? 'filled' : 'outline'} />
            <span>{label}</span>

            {active && (
                <motion.div
                    layoutId="active-pill"
                    className="absolute left-0 w-1.5 h-8 bg-white rounded-r-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                />
            )}
        </button>
    );
}
