import { useState, useEffect, useRef } from 'react';
import { Upload, Save, User, Sparkles } from 'lucide-react';

export default function WelcomeModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState('/img/logo_new.jpg'); // Default
    const fileInputRef = useRef(null);

    useEffect(() => {
        // Check if user has already set up their profile (using the logo as a flag for now, or a specific flag)
        const hasSetup = localStorage.getItem('isProfileSetupComplete');
        // If not setup, OR we want to double check if logo is missing
        const hasLogo = localStorage.getItem('appLogo');

        if (!hasSetup && !hasLogo) {
            setIsOpen(true);
        }
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("Resim çok büyük (Maks 5MB)!");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhoto(reader.result);
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (!name.trim()) {
            alert("Lütfen bir isim gir!");
            return;
        }

        // Save Profile Data
        const profileData = {
            name: name,
            about: about || 'Merhaba! Ben resim çizmeyi çok seviyorum.',
            age: '8', // Default
            favColor: 'Mavi', // Default
            favAnimal: 'Kedi' // Default
        };

        // Merge with existing if any, but usually empty here
        localStorage.setItem('userProfileData', JSON.stringify(profileData));

        // Save Photo
        if (photo) {
            localStorage.setItem('appLogo', photo); // For global logo
            localStorage.setItem('userProfileImage', photo); // For profile page
        } else {
            // Even if they didn't upload, we mark setup as complete so it doesn't pop up again
            // But user specifically asked for image upload. Let's assume default is okay if they skip image, 
            // OR force them? User said "upload photo". Let's making it optional but recommended.
            // If they don't upload, we use the default logo logic which is handled elsewhere.
        }

        localStorage.setItem('isProfileSetupComplete', 'true');

        // Trigger updates
        window.dispatchEvent(new Event('logoChange'));
        window.dispatchEvent(new Event('storage')); // For Profile page listeners if any

        setIsOpen(false);
        // Optional: Reload to refresh all components cleanly
        window.location.reload();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Decorative Background blob */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                <div className="text-center mb-8 relative z-10">
                    <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg animate-bounce">
                        <Sparkles size={32} />
                    </div>
                    <h2 className="text-3xl font-heading font-bold text-dark mb-2">Hoş Geldin Ressam! 👋</h2>
                    <p className="text-gray-500 font-medium">Hadi profilini oluşturalım ve çizmeye başlayalım.</p>
                </div>

                <div className="space-y-6 relative z-10">
                    {/* Photo Upload */}
                    <div className="flex flex-col items-center">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="relative w-32 h-32 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-all group overflow-hidden"
                        >
                            {preview && preview !== '/img/logo_new.jpg' ? (
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center p-2">
                                    <div className="bg-blue-50 text-blue-500 p-2 rounded-full inline-block mb-1 group-hover:scale-110 transition-transform">
                                        <Upload size={24} />
                                    </div>
                                    <p className="text-xs text-gray-400 font-bold">Fotoğraf Yükle</p>
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>

                    {/* Inputs */}
                    <div>
                        <label className="block text-sm font-bold text-gray-500 mb-1 ml-1">Adın Ne?</label>
                        <div className="relative">
                            <User className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" size={20} />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Örn: Ahmet, Ayşe..."
                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl pl-12 pr-4 py-4 font-bold text-dark focus:border-primary focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-500 mb-1 ml-1">Kendinden Bahset (İsteğe Bağlı)</label>
                        <textarea
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                            rows="2"
                            placeholder="En çok ne çizmeyi seversin?"
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 font-medium text-dark focus:border-primary focus:outline-none transition-colors resize-none"
                        />
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleSave}
                        className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg hover:bg-primary-dark hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 text-lg"
                    >
                        <Save size={24} />
                        Kaydet ve Başla!
                    </button>
                </div>
            </div>
        </div>
    );
}
