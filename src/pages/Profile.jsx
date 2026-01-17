import { useState, useRef, useEffect } from 'react';
import { Pencil, Award, Lock, Save, X, Download, MessageCircle, Image as ImageIcon, Sparkles } from 'lucide-react';
import { LEVELS, BADGES, getCurrentLevel, getNextLevel } from '../data/gamification';
import { getGallery, getProfileImage, saveProfileImage, getProfileData, saveProfileData, migrateFromLocalStorage } from '../utils/storage';

export default function Profile() {
    const [gallery, setGallery] = useState([]);
    const [selectedDrawing, setSelectedDrawing] = useState(null);

    // Derived stats
    const drawingCount = gallery.length;
    const currentLevel = getCurrentLevel(drawingCount);
    const nextLevel = getNextLevel(drawingCount);

    const [profileImage, setProfileImage] = useState('/img/family.jpg');
    const [profileData, setProfileData] = useState({
        name: 'Küçük Ressam',
        age: '8',
        favColor: 'Mavi',
        favAnimal: 'Kedi',
        about: 'Merhaba! Ben resim çizmeyi ve hayal kurmayı çok seviyorum. 🚀'
    });
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [tempData, setTempData] = useState({ ...profileData });
    const fileInputRef = useRef(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                // Ensure migration happens first
                await migrateFromLocalStorage();

                // Profile Image/Data
                const savedImage = await getProfileImage();
                if (savedImage) setProfileImage(savedImage);

                const savedData = await getProfileData();
                if (savedData) setProfileData(savedData);

                // Load Gallery
                const savedGallery = await getGallery();
                setGallery(savedGallery);
            } catch (error) {
                console.error("Error loading profile:", error);
            }
        };
        loadProfile();
    }, []);

    const handleDownload = (drawing) => {
        const link = document.createElement('a');
        link.href = drawing.image;
        link.download = `asafdraw-${new Date(drawing.date || Date.now()).toLocaleDateString('tr-TR').replace(/\./g, '-')}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const resizeImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 500; // Profile pics don't need 4k
                    const MAX_HEIGHT = 500;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                    resolve(dataUrl);
                };
            };
        });
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const base64String = await resizeImage(file);
                setProfileImage(base64String);
                await saveProfileImage(base64String);
                // Sync with App Logo
                localStorage.setItem('appLogo', base64String); // Keep sync simpler using storage event if needed, but localstorage event works across tabs
                window.dispatchEvent(new Event('logoChange'));
            } catch (e) {
                console.error("Profil resmi hatası:", e);
                alert("Resim yüklenirken bir sorun oluştu.");
            }
        }
    };

    const handleEditClick = () => {
        setTempData({ ...profileData });
        setIsEditingInfo(true);
    };

    const handleSaveInfo = async () => {
        setProfileData(tempData);
        await saveProfileData(tempData);
        setIsEditingInfo(false);
    };

    const progressPercent = nextLevel
        ? Math.min(100, (drawingCount / nextLevel.target) * 100)
        : 100;

    return (
        <div className="max-w-6xl mx-auto pb-10 relative">

            {/* Profile Header */}
            <div className="bg-white rounded-3xl p-8 shadow-soft text-center relative overflow-hidden mb-8 border-b-8 border-primary/10">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                />

                {/* Edit Info Button */}
                <button
                    onClick={handleEditClick}
                    className="absolute top-6 right-6 text-gray-400 hover:text-primary transition-colors flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl hover:bg-primary/10"
                    title="Bilgileri Düzenle"
                >
                    <span className="text-sm font-bold">Düzenle</span>
                    <Pencil size={18} />
                </button>

                <div className="inline-block relative mb-4 group">
                    <img
                        src={profileImage}
                        className="w-36 h-36 rounded-full border-4 border-white shadow-pop object-cover"
                        alt="Profile"
                    />
                    <button
                        onClick={handleImageClick}
                        className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                        <Pencil className="text-white" size={24} />
                    </button>
                    <div className="absolute bottom-0 right-0 bg-primary text-white p-3 rounded-full border-4 border-white shadow-md z-10">
                        <Award size={24} />
                    </div>
                </div>

                <h2 className="text-4xl font-heading font-bold text-dark mb-1">{profileData.name}</h2>
                <p className="text-primary font-bold text-xl tracking-wide uppercase mb-4">{currentLevel.title}</p>

                {/* About Me Section */}
                <div className="max-w-lg mx-auto mb-6 px-6 relative">
                    <div className="absolute -top-3 -left-2 text-4xl opacity-20 transform -rotate-12">❝</div>
                    <p className="text-gray-600 font-medium italic relative z-10">
                        {profileData.about}
                    </p>
                    <div className="absolute -bottom-4 -right-2 text-4xl opacity-20 transform -rotate-12">❞</div>
                </div>

                {/* Info Pills */}
                <div className="flex justify-center gap-3 mt-4 mb-6 flex-wrap">
                    <div className="px-4 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-bold">
                        🎨 {profileData.favColor}
                    </div>
                    <div className="px-4 py-1 bg-green-100 text-green-600 rounded-full text-sm font-bold">
                        🐾 {profileData.favAnimal}
                    </div>
                </div>

                {/* Stats */}
                <div className="flex justify-center gap-10 mt-6 pt-6 border-t border-gray-100">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-dark">{drawingCount}</div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">TOPLAM ÇİZİM</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-secondary">{profileData.age}</div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">YAŞINDA</div>
                    </div>
                </div>

                {/* Simple Progress Bar */}
                {nextLevel && (
                    <div className="max-w-xs mx-auto mt-6">
                        <div className="flex justify-between text-xs font-bold text-gray-400 mb-1">
                            <span>İlerleme</span>
                            <span>Sonraki Seviye İçin Hedef: {nextLevel.target}</span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-secondary transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Gallery Section */}
            <div className="bg-white rounded-3xl p-8 shadow-soft mb-8 border-b-8 border-gray-100">
                <h3 className="text-2xl font-bold text-dark mb-6 flex items-center gap-2">
                    <ImageIcon className="text-primary" /> Çizimlerim ({drawingCount})
                </h3>
                {/* Gallery grid content removed as per instruction */}
            </div>


            {/* Badges Collection */}
            <div className="flex items-center mb-6 ml-2">
                <h3 className="text-2xl font-bold text-gray-700 mr-3">Rozet Koleksiyonum</h3>
                <span className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-full text-sm">
                    {BADGES.filter(l => drawingCount >= l.target).length} / {BADGES.length}
                </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {BADGES.map((badge) => {
                    const isUnlocked = drawingCount >= badge.target;
                    const Icon = badge.icon;

                    return (
                        <div
                            key={badge.id}
                            className={`relative p-4 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center text-center group
                            ${isUnlocked
                                    ? 'bg-white border-transparent shadow-md hover:shadow-pop hover:-translate-y-1'
                                    : 'bg-gray-50 border-gray-100 opacity-60'
                                }`}
                        >
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-inner text-white transition-transform duration-500
                            ${isUnlocked ? badge.color : 'bg-gray-200 text-gray-400 grayscale'}
                            ${isUnlocked && 'group-hover:scale-110 group-hover:rotate-12'}
                       `}>
                                <Icon size={32} />
                            </div>

                            <h4 className={`font-bold text-sm mb-1 ${isUnlocked ? 'text-dark' : 'text-gray-400'}`}>
                                {badge.title}
                            </h4>
                            <span className="text-xs font-bold text-gray-600 bg-gray-200 px-2 py-1 rounded-lg">
                                {badge.target} Çizim
                            </span>

                            {!isUnlocked && (
                                <div className="absolute top-2 right-2 text-gray-300">
                                    <Lock size={14} />
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* EDIT MODAL */}
            {isEditingInfo && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-dark">Bilgilerini Düzenle</h3>
                            <button onClick={() => setIsEditingInfo(false)} className="text-gray-400 hover:text-red-500">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-500 mb-1">İsmin</label>
                                <input
                                    type="text"
                                    value={tempData.name}
                                    onChange={(e) => setTempData({ ...tempData, name: e.target.value })}
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 font-bold text-dark focus:border-primary focus:outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-500 mb-1">Hakkımda</label>
                                <textarea
                                    value={tempData.about || ''}
                                    onChange={(e) => setTempData({ ...tempData, about: e.target.value })}
                                    rows="3"
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 font-medium text-dark focus:border-primary focus:outline-none transition-colors resize-none"
                                    placeholder="Kendinden kısaca bahset..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-500 mb-1">Yaşın</label>
                                <input
                                    type="text" // text to allow funny inputs if wanted, or number
                                    value={tempData.age}
                                    onChange={(e) => setTempData({ ...tempData, age: e.target.value })}
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 font-bold text-dark focus:border-primary focus:outline-none transition-colors"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 mb-1">Sevdiğin Renk</label>
                                    <input
                                        type="text"
                                        value={tempData.favColor}
                                        onChange={(e) => setTempData({ ...tempData, favColor: e.target.value })}
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 font-bold text-dark focus:border-primary focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 mb-1">Sevdiğin Hayvan</label>
                                    <input
                                        type="text"
                                        value={tempData.favAnimal}
                                        onChange={(e) => setTempData({ ...tempData, favAnimal: e.target.value })}
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 font-bold text-dark focus:border-primary focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={handleSaveInfo}
                                className="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                            >
                                <Save size={20} />
                                Kaydet
                            </button>
                            <button
                                onClick={() => setIsEditingInfo(false)}
                                className="px-6 bg-gray-100 text-gray-500 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                İptal
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
