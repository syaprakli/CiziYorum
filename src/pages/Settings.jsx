import { useState, useEffect, useRef } from 'react';
import { Save, Eye, EyeOff, Cpu, Key, CheckCircle, Upload, Download, Database, XCircle, Settings as SettingsIcon } from 'lucide-react';
import { testConnection } from '../services/gemini';

const AI_MODELS = [
    { id: 'gemini-flash-latest', name: 'Gemini Flash (Çalışan)', icon: '✅' },
    { id: 'gemini-pro', name: 'Gemini Pro (Yedek)', icon: '🛡️' }
];

export default function Settings() {
    const [selectedModel, setSelectedModel] = useState('gemini-flash-latest');
    const [apiKey, setApiKey] = useState('');
    const [showKey, setShowKey] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    // Test Status: 'idle' | 'loading' | 'success' | 'error'
    const [testStatus, setTestStatus] = useState('idle');
    const [testMessage, setTestMessage] = useState('');

    const backupInputRef = useRef(null);

    const handleTestConnection = async () => {
        setTestStatus('loading');
        setTestMessage('');
        try {
            await testConnection(apiKey, selectedModel);
            setTestStatus('success');
            setTestMessage('Harika! Bağlantı başarılı.');
        } catch (error) {
            setTestStatus('error');
            console.error(error);
            if (error.message.includes('429') || error.message.includes('Quota')) {
                setTestMessage('Kota aşıldı (429)! Lütfen "Gemini 1.5 Flash" modelini seçip tekrar deneyin.');
            } else if (error.message.includes('API Key')) {
                setTestMessage('API Anahtarı geçersiz görünüyor.');
            } else {
                setTestMessage('Bağlantı hatası: ' + (error.message.slice(0, 50) + "..."));
            }
        }
    };

    useEffect(() => {
        // Load saved settings
        const savedModel = localStorage.getItem('selectedAiModel');
        const savedKey = localStorage.getItem('aiApiKey');

        if (savedModel) setSelectedModel(savedModel);
        if (savedKey) setApiKey(savedKey);
    }, []);

    const handleSave = () => {
        localStorage.setItem('selectedAiModel', selectedModel);
        localStorage.setItem('aiApiKey', apiKey);

        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000); // Hide success message after 3s
    };

    // --- Backup & Restore Logic ---
    const handleBackup = () => {
        const backupData = {
            userProfileData: localStorage.getItem('userProfileData'),
            userProfileImage: localStorage.getItem('userProfileImage'),
            galleryDrawings: localStorage.getItem('galleryDrawings'),
            aiSettings: { model: selectedModel, key: apiKey },
            backupDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(backupData)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `asafdraw-yedek-${new Date().toLocaleDateString('tr-TR').replace(/\./g, '-')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleRestoreClick = () => {
        if (confirm("DİKKAT! Yedek dosyasını yüklediğinde şu anki verilerin silinecek ve yedektekiler geri gelecek. Emin misin?")) {
            backupInputRef.current.click();
        }
    };

    const handleRestoreFile = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                if (data.userProfileData) localStorage.setItem('userProfileData', data.userProfileData);
                if (data.userProfileImage) localStorage.setItem('userProfileImage', data.userProfileImage);
                if (data.galleryDrawings) localStorage.setItem('galleryDrawings', data.galleryDrawings);

                // Restore settings
                if (data.aiSettings) {
                    localStorage.setItem('selectedAiModel', data.aiSettings.model);
                    localStorage.setItem('aiApiKey', data.aiSettings.key);
                }

                alert("Verilerin başarıyla geri yüklendi! Sayfa yenileniyor...");
                window.location.reload();
            } catch (error) {
                console.error("Yedek yükleme hatası:", error);
                alert("Hata! Bu dosya bozuk veya yanlış formatta.");
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="max-w-6xl mx-auto pb-10">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-600 rounded-3xl p-8 shadow-soft text-white mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full transform translate-x-10 -translate-y-10" />
                <h1 className="text-4xl font-heading font-bold mb-2 relative z-10 flex items-center gap-3">
                    <SettingsIcon size={40} className="text-gray-300" /> Ayarlar
                </h1>
                <p className="text-gray-200 font-medium text-lg relative z-10">Uygulamanın beynini ve verilerini buradan yönet.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* AI Configuration Card */}
                <div className="bg-white rounded-3xl p-8 shadow-soft border-2 border-transparent hover:border-blue-100 transition-colors">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                            <Cpu size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-dark">Yapay Zeka Ayarları</h2>
                            <p className="text-sm text-gray-400 font-bold">Model ve API Anahtarı</p>
                        </div>
                    </div>

                    {/* Model Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">
                            Kullanılacak Model
                        </label>
                        <div className="grid grid-cols-1 gap-3">
                            {AI_MODELS.map((model) => (
                                <button
                                    key={model.id}
                                    onClick={() => setSelectedModel(model.id)}
                                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left group
                                    ${selectedModel === model.id
                                            ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-sm'
                                            : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-300'
                                        }`}
                                >
                                    <span className="text-2xl">{model.icon}</span>
                                    <span className="font-bold flex-1">{model.name}</span>
                                    {selectedModel === model.id && (
                                        <CheckCircle size={20} className="text-blue-500" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>



                    {/* API Key Input */}
                    <div className="mb-8">
                        <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">
                            API Anahtarı ({AI_MODELS.find(m => m.id === selectedModel)?.name})
                        </label>
                        <div className="relative mb-2">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Key size={20} className="text-gray-400" />
                            </div>
                            <input
                                type={showKey ? "text" : "password"}
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="sk-..."
                                className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl font-mono text-dark focus:border-blue-500 focus:outline-none transition-colors"
                            />
                            <button
                                onClick={() => setShowKey(!showKey)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-dark cursor-pointer"
                            >
                                {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {/* Test Button & Message */}
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-400 font-medium">
                                Anahtarınız cihazınızda saklanır.
                            </p>
                            <button
                                onClick={handleTestConnection}
                                disabled={!apiKey || testStatus === 'loading'}
                                className={`text-sm font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2
                                ${testStatus === 'success' ? 'bg-green-100 text-green-600' :
                                        testStatus === 'error' ? 'bg-red-100 text-red-600' :
                                            'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                {testStatus === 'loading' && <span className="animate-spin">⏳</span>}
                                {testStatus === 'success' && <CheckCircle size={16} />}
                                {testStatus === 'error' && <XCircle size={16} />}
                                {testStatus === 'idle' && "Bağlantıyı Test Et"}
                                {testStatus === 'loading' && "Test Ediliyor..."}
                                {testStatus === 'success' && "Bağlandıldı!"}
                                {testStatus === 'error' && "Hata!"}
                            </button>
                        </div>
                        {testMessage && (
                            <p className={`mt-2 text-xs font-bold ${testStatus === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                {testMessage}
                            </p>
                        )}
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform active:scale-95
                        ${isSaved
                                ? 'bg-green-500 text-white shadow-green-200 shadow-lg'
                                : 'bg-dark text-white hover:bg-black shadow-lg hover:shadow-xl'
                            }`}
                    >
                        {isSaved ? (
                            <>
                                <CheckCircle size={24} />
                                Kaydedildi!
                            </>
                        ) : (
                            <>
                                <Save size={24} />
                                Ayarları Kaydet
                            </>
                        )}
                    </button>
                </div>

                {/* Right Column */}
                <div className="space-y-6">

                    {/* Logo & Profile Management Section */}
                    <div className="bg-white rounded-3xl p-8 border-2 border-gray-100 shadow-soft">
                        <h3 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
                            <span className="text-2xl">🖼️</span> Profil ve Uygulama Logosu
                        </h3>
                        <p className="text-gray-500 mb-6 text-sm font-medium">
                            Buradan yükleyeceğin resim hem sol üstteki logo hem de profil fotoğrafın olacak.
                        </p>

                        <div className="flex flex-col gap-3">
                            <input
                                type="file"
                                id="logoInput"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        // 1MB Limit Check
                                        if (file.size > 5 * 1024 * 1024) {
                                            alert("Resim çok büyük! Lütfen 5MB'dan küçük bir resim seç.");
                                            return;
                                        }

                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            const base64 = reader.result;
                                            try {
                                                localStorage.setItem('appLogo', base64);
                                                localStorage.setItem('userProfileImage', base64);
                                                // Trigger event for immediate update
                                                window.dispatchEvent(new Event('logoChange'));
                                                alert("Profil ve Logo başarıyla güncellendi! Sayfa yenileniyor...");
                                                window.location.reload();
                                            } catch (error) {
                                                console.error("Logo save error:", error);
                                                alert("Hata: Resim kaydedilemedi. Muhtemelen depolama alanı doldu veya resim çok büyük.");
                                            }
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                            <label
                                htmlFor="logoInput"
                                className="w-full bg-purple-50 text-purple-600 font-bold py-3 rounded-xl hover:bg-purple-100 transition-colors flex items-center justify-center gap-3 border border-purple-200 cursor-pointer"
                            >
                                <Upload size={20} />
                                <span>Resim Yükle</span>
                            </label>

                            <button
                                onClick={() => {
                                    if (confirm("Logoyu ve profil resmini varsayılan haline döndürmek istiyor musun?")) {
                                        localStorage.removeItem('appLogo');
                                        localStorage.removeItem('userProfileImage');
                                        window.dispatchEvent(new Event('logoChange'));
                                        window.location.reload();
                                    }
                                }}
                                className="w-full bg-gray-50 text-gray-500 font-bold py-3 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-3 border border-gray-200"
                            >
                                <XCircle size={20} />
                                <span>Varsayılanı Kullan</span>
                            </button>
                        </div>
                    </div>

                    {/* Veri Yönetimi Bölümü */}
                    <div className="bg-white rounded-3xl p-8 border-2 border-gray-100 shadow-soft">
                        <h3 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
                            <Database size={24} className="text-gray-400" /> Veri İşlemleri
                        </h3>
                        <p className="text-gray-500 mb-6 text-sm font-medium">
                            Çizimlerini, profilini ve ayarlarını kaybetmemek için düzenli yedek al.
                        </p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleBackup}
                                className="w-full bg-blue-50 text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center gap-3 border border-blue-200"
                            >
                                <Download size={20} />
                                <span>Verileri Bilgisayara İndir</span>
                            </button>

                            <button
                                onClick={handleRestoreClick}
                                className="w-full bg-gray-50 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-3 border border-gray-200"
                            >
                                <Upload size={20} />
                                <span>Yedeği Geri Yükle</span>
                            </button>

                            <input
                                type="file"
                                ref={backupInputRef}
                                onChange={handleRestoreFile}
                                accept=".json"
                                className="hidden"
                            />
                        </div>
                    </div>

                    <div className="bg-blue-50 rounded-3xl p-8 border border-blue-100">
                        <h3 className="font-bold text-blue-900 text-lg mb-2">💡 Neden API Anahtarı?</h3>
                        <p className="text-blue-700/80 leading-relaxed mb-4">
                            Uygulamanın akıllı özelliklerini (resim yorumlama, fikir üretme) kullanabilmek için Google'dan ücretsiz bir anahtar almalısın.
                        </p>
                        <a
                            href="https://aistudio.google.com/app/apikey"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-blue-500 text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                        >
                            <Key size={18} />
                            Ücretsiz Anahtar Al (Google)
                        </a>
                    </div>

                    <div className="bg-purple-50 rounded-3xl p-8 border border-purple-100 opacity-60 pointer-events-none grayscale">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold text-purple-900 text-lg">Ses & Efektler</h3>
                            <span className="text-xs font-bold bg-purple-200 text-purple-800 px-2 py-1 rounded">Yakında</span>
                        </div>
                        <p className="text-purple-700/80 text-sm">
                            Uygulama seslerini ve müziklerini buradan açıp kapatabileceksiniz.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

