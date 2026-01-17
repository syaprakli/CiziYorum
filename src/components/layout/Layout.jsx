import { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-light overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className="flex-1 flex flex-col h-full relative overflow-hidden">
                {/* Mobile Header / Toggle */}
                <div className="lg:hidden p-4 bg-white shadow-sm flex items-center justify-between z-10">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 text-primary hover:bg-primary/5 rounded-xl transition-colors"
                    >
                        <Menu size={28} />
                    </button>
                    <span className="font-heading font-bold text-lg text-primary">ÇiziYorum</span>
                    <div className="w-10" /> {/* Spacer for centering if needed */}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar relative">
                    {children}
                </div>
            </main>
        </div>
    );
}
