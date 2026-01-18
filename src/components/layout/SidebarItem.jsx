import { motion } from 'framer-motion';

export default function SidebarItem({ icon: Icon, label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`relative flex items-center w-full p-2 mb-1 rounded-2xl transition-all duration-300 font-bold font-sans text-sm
        ${active
                    ? 'bg-primary text-white shadow-pop'
                    : 'text-gray-400 hover:bg-light hover:text-dark hover:scale-105'
                }`}
        >
            <Icon className="w-5 h-5 mr-2" variant={active ? 'filled' : 'outline'} />
            <span>{label}</span>

            {active && (
                <motion.div
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                />
            )}
        </button>
    );
}
