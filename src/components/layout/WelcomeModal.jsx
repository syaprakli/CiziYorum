import { useState, useEffect, useRef } from 'react';
import { Upload, Save, User, Key, ArrowRight, BrainCircuit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { saveProfileData, saveProfileImage, getProfileData, getProfileImage } from '../../utils/storage';

export default function WelcomeModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1); // Step 1: Profile, Step 2: AI Info
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [favColor, setFavColor] = useState('');
    const [favAnimal, setFavAnimal] = useState('');
    const [about, setAbout] = useState('');
    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState('/img/logo_new.jpg'); // Default
    const fileInputRef = useRef(null);

    useEffect(() => {
        const checkSetup = async () => {
            const profileData = await getProfileData();
            const profileImage = await getProfileImage();

            if (!profileData && !profileImage) {
                setIsOpen(true);
            }
        };
        checkSetup();
    }, []);

    const compressImage = (base64) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = base64;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                const maxDim = 400; // Profile pics don't need to be huge

                if (width > height) {
                    if (width > maxDim) {
                        height *= maxDim / width;
                        width = maxDim;
                    }
                } else {
                    if (height > maxDim) {
                        width *= maxDim / height;
                        height = maxDim;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.8)); // 80% quality jpeg is very small
            };
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Increased limit to 20MB for profile pics, total storage is now gigabytes
            if (file.size > 20 * 1024 * 1024) {
                alert("Resim çok büyük (Maks 20MB)!");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = async () => {
                const compressed = await compressImage(reader.result);
                setPhoto(compressed);
                setPreview(compressed);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async () => {
        if (!name.trim()) {
            alert("Lütfen bir isim gir!");
            return;
        }

        try {
            // Save Profile Data to IndexedDB (virtually unlimited)
            const profileData = {
                name: name,
                about: about || 'Merhaba! Ben resim çizmeyi çok seviyorum.',
                age: age || '8',
                favColor: favColor || 'Mavi',
                favAnimal: favAnimal || 'Kedi'
            };

            await saveProfileData(profileData);

            if (photo) {
                await saveProfileImage(photo);
            }

            // Mark setup as complete in localStorage as a simple flag (legacy check)
            localStorage.setItem('isProfileSetupComplete', 'true');
            window.dispatchEvent(new Event('logoChange'));
        } catch (error) {
            console.error("Profil kaydedilirken hata oluştu:", error);
            alert("⚠️ Kayıt işlemi sırasında bir sorun oluştu, lütfen tekrar dene.");
            return; // Don't move to step 2 if critical failure
        }

        // Move to AI Info step
        setStep(2);
    };

    const handleFinish = () => {
        setIsOpen(false);
        window.location.reload();
    };

    const goToSettings = () => {
        window.open('https://aistudio.google.com/app/apikey', '_blank');
        setIsOpen(false);
        navigate('/settings');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300 text-dark">
            <div className="bg-white rounded-3xl p-5 w-full max-w-lg shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">

                {step === 1 ? (
                    <div className="animate-in fade-in duration-500">
                        {/* Decorative Background blob */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                        <div className="text-center mb-3 relative z-10">
                            <h2 className="text-2xl font-heading font-bold text-dark mb-1">Hoş Geldin Ressam! 👋</h2>
                            <p className="text-sm text-gray-500 font-medium">Profilini hemen oluştur!</p>
                        </div>

                        <div className="space-y-3 relative z-10">
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
                                                <Upload size={18} />
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

                            <div className="grid grid-cols-2 gap-2">
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-bold text-gray-500 mb-1 ml-1">Adın Ne?</label>
                                    <div className="relative">
                                        <User className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400" size={14} />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Örn: Asaf, Ayşe..."
                                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl pl-10 pr-3 py-2.5 font-bold text-dark focus:border-primary focus:outline-none transition-colors text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 mb-1 ml-1">Yaşın Kaç?</label>
                                    <input
                                        type="text"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        placeholder="8"
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 py-2.5 font-bold text-dark focus:border-primary focus:outline-none transition-colors text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 mb-1 ml-1">Sevdiğin Renk?</label>
                                    <input
                                        type="text"
                                        value={favColor}
                                        onChange={(e) => setFavColor(e.target.value)}
                                        placeholder="Mavi"
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 py-2.5 font-bold text-dark focus:border-primary focus:outline-none transition-colors text-sm"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-bold text-gray-500 mb-1 ml-1">En Sevdiğin Hayvan?</label>
                                    <input
                                        type="text"
                                        value={favAnimal}
                                        onChange={(e) => setFavAnimal(e.target.value)}
                                        placeholder="Kedi, Köpek..."
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 py-2.5 font-bold text-dark focus:border-primary focus:outline-none transition-colors text-sm"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleSaveProfile}
                                className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-primary-dark hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 text-lg"
                            >
                                <Save size={20} />
                                Devam Et
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="animate-in slide-in-from-right duration-500">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                                <BrainCircuit size={32} />
                            </div>
                            <h2 className="text-2xl font-heading font-bold text-dark mb-1">Yapay Zeka Öğretmenin! 👩‍🎨</h2>
                            <p className="text-sm text-gray-500 font-medium">Resimlerini yorumlamamı ister misin?</p>
                        </div>

                        <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-4 mb-6">
                            <p className="text-blue-800 text-sm leading-relaxed font-bold">
                                🌟 Öğretmenin resimlerini sesli yorumlaması için ücretsiz bir <span className="text-blue-600 underline text-blue-700">API Anahtarı</span> alman gerekiyor.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={goToSettings}
                                className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 text-lg group"
                            >
                                <Key size={24} />
                                Anahtar Al ve Kur!
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button
                                onClick={handleFinish}
                                className="w-full bg-gray-100 text-gray-500 font-bold py-4 rounded-xl hover:bg-gray-200 transition-all text-lg"
                            >
                                Şimdilik Geç, Hemen Başla
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
