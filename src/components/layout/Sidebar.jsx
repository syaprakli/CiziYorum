import { Home, Lightbulb, Image, Upload, Settings, BookOpen, Smile, Play, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import SidebarItem from './SidebarItem';
import SoundBoard from '../features/SoundBoard';
import { BrandLogo } from './Logo';

export default function Sidebar({ isOpen, onClose }) {
    const navigate = useNavigate();
    const location = useLocation();
    const activeTab = location.pathname === '/' ? 'dashboard' : location.pathname.substring(1);

    const handleNavigation = (id) => {
        navigate(id === 'dashboard' ? '/' : `/${id}`);
        // Close sidebar on mobile when item clicked
        if (window.innerWidth < 1024 && onClose) {
            onClose();
        }
    };

    const menuItems = [
        { id: 'profile', label: 'Profilim', icon: Smile },
        { id: 'dashboard', label: 'Fikirler', icon: Lightbulb },
        { id: 'adim-adim', label: 'Adım Adım Çiz', icon: BookOpen },
        { id: 'videolar', label: 'Eğitim Videoları', icon: Play },
        { id: 'gallery', label: 'Galeri', icon: Image },
        { id: 'upload', label: 'Yükle & Kontrol', icon: Upload },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            <aside className={`fixed top-0 left-0 h-[100dvh] bg-white shadow-2xl rounded-r-3xl flex flex-col p-3 z-40 transition-transform duration-300 ease-out transform
                w-52 sm:w-60 lg:w-64 lg:static lg:translate-x-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Mobile Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full lg:hidden block"
                >
                    <X size={24} />
                </button>

                {/* Logo Area */}
                <div className="flex flex-col items-center mb-14 mt-4 lg:mt-0">
                    <BrandLogo />
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
                    {menuItems.map((item) => (
                        <SidebarItem
                            key={item.id}
                            icon={item.icon}
                            label={item.label}
                            active={activeTab === item.id}
                            onClick={() => handleNavigation(item.id)}
                        />
                    ))}

                    {/* Settings - Moved here below Yükle & Kontrol */}
                    <div className="pt-2 border-t border-gray-100/50">
                        <SidebarItem
                            icon={Settings}
                            label="Ayarlar"
                            active={activeTab === 'settings'}
                            onClick={() => handleNavigation('settings')}
                        />
                    </div>
                </nav>

                {/* SoundBoard - Moved to the very bottom */}
                <div className="mt-4 pb-2">
                    <SoundBoard />
                </div>
            </aside>
        </>
    );
}
