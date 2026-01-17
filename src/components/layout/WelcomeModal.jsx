import { useState, useEffect, useRef } from 'react';
import { Upload, Save, User, Sparkles } from 'lucide-react';

export default function WelcomeModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [favColor, setFavColor] = useState('');
    const [favAnimal, setFavAnimal] = useState('');
    const [about, setAbout] = useState('');
    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState('/img/logo_new.jpg'); // Default
    const fileInputRef = useRef(null);

    useEffect(() => {
        // Check if user has already set up their profile
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
            age: age || '8',
            favColor: favColor || 'Mavi',
            favAnimal: favAnimal || 'Kedi'
        };

        // Merge with existing if any, but usually empty here
        localStorage.setItem('userProfileData', JSON.stringify(profileData));

        // Save Photo
        if (photo) {
            localStorage.setItem('appLogo', photo); // For global logo
            localStorage.setItem('userProfileImage', photo); // For profile page
        }

        localStorage.setItem('isProfileSetupComplete', 'true');

        // Trigger updates
        window.dispatchEvent(new Event('logoChange'));
        window.dispatchEvent(new Event('storage')); // For Profile page listeners if any

        setIsOpen(false);
        // Reload to refresh all components cleanly
        window.location.reload();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
                {/* Decorative Background blob */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                <div className="text-center mb-6 relative z-10">
                    <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-2 text-white shadow-lg animate-bounce">
                        <Sparkles size={28} />
                    </div>
                    <h2 className="text-2xl font-heading font-bold text-dark mb-1">Hoş Geldin Ressam! 👋</h2>
                    <p className="text-sm text-gray-500 font-medium">Profilini hemen oluştur!</p>
                </div>

                <div className="space-y-4 relative z-10">
                    {/* Photo Upload */}
                    <div className="flex flex-col items-center">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="relative w-24 h-24 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-all group overflow-hidden"
                        >
                            {preview && preview !== '/img/logo_new.jpg' ? (
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center p-2">
                                    <div className="bg-blue-50 text-blue-500 p-1.5 rounded-full inline-block mb-1 group-hover:scale-110 transition-transform">
                                        <Upload size={20} />
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-bold">Fotoğraf</p>
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

                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Adın Ne?</label>
                            <div className="relative">
                                <User className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Örn: Asaf, Ayşe..."
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl pl-10 pr-3 py-3 font-bold text-dark focus:border-primary focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Yaşın Kaç?</label>
                            <input
                                type="text"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                placeholder="8"
                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 py-3 font-bold text-dark focus:border-primary focus:outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Sevdiğin Renk?</label>
                            <input
                                type="text"
                                value={favColor}
                                onChange={(e) => setFavColor(e.target.value)}
                                placeholder="Mavi"
                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 py-3 font-bold text-dark focus:border-primary focus:outline-none transition-colors"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">En Sevdiğin Hayvan?</label>
                            <input
                                type="text"
                                value={favAnimal}
                                onChange={(e) => setFavAnimal(e.target.value)}
                                placeholder="Kedi, Köpek..."
                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 py-3 font-bold text-dark focus:border-primary focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Kendinden Bahset (İsteğe Bağlı)</label>
                        <textarea
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                            rows="2"
                            placeholder="Ben resim yapmayı çok severim..."
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 py-2 font-medium text-dark focus:border-primary focus:outline-none transition-colors resize-none text-sm"
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
