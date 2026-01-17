import { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Send, Sparkles, AlertCircle, X, Loader2, Save, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeDrawing } from '../services/gemini';
import { useLocation, useNavigate } from 'react-router-dom';
import { saveDrawingToGallery } from '../utils/storage';

export default function Upload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    const fileInputRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    // Check if we came from a specific mission
    const missionText = location.state?.mission;

    const resizeImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800; // Optimize for speed
                    const MAX_HEIGHT = 800;
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

                    // Compress to JPEG 0.7 quality
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    resolve(dataUrl);
                };
            };
        });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setLoading(true); // Show loading during resize
            try {
                const resizedImage = await resizeImage(file);
                setPreview(resizedImage);
                setFeedback("");
            } catch (error) {
                console.error("Resize error:", error);
                // Fallback to original if resize fails
                const reader = new FileReader();
                reader.onloadend = () => setPreview(reader.result);
                reader.readAsDataURL(file);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleAnalyze = async () => {
        if (!preview) return;

        setLoading(true);
        setFeedback("");

        try {
            // If there is a mission, use it for validation context
            const promptContext = missionText
                ? `Öğrencinin görevi: "${missionText}". Bu resim göreve uygun mu? Eğer uygunsa tebrik et. Değilse neyi eksik yapmış söyle.`
                : "Bu resmi incele ve 8 yaşındaki çocuğa yapıcı, harika bir yorum yap.";

            const result = await analyzeDrawing(preview, promptContext);
            setFeedback(result);
        } catch (e) {
            console.error("Analyze Error:", e);
            setFeedback("⚠️ Bir sorun oluştu: " + (e.message || "Bilinmeyen hata"));
        } finally {
            setLoading(false);
        }
    };

    const clearSelection = () => {
        setSelectedFile(null);
        setPreview(null);
        setFeedback("");
        setSaved(false);
    };

    const handleSaveToGallery = async () => {
        const newDrawing = {
            id: Date.now(),
            image: preview,
            feedback: feedback,
            date: new Date().toISOString(),
            category: missionText ? "Görev" : "Serbest Çizim", // Auto categorize
            mission: missionText || null
        };

        await saveDrawingToGallery(newDrawing);
        setSaved(true);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 pb-20 pt-6">

            {/* Active Mission Banner */}
            {missionText && (
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-secondary/10 border-2 border-secondary/20 p-4 rounded-2xl mb-6 relative flex flex-col items-center text-center"
                >
                    <button
                        onClick={() => navigate(location.pathname, { replace: true, state: {} })}
                        className="absolute top-2 right-2 text-secondary/50 hover:text-secondary p-1"
                    >
                        <X size={16} />
                    </button>
                    <h3 className="font-bold text-secondary uppercase text-xs tracking-widest mb-1">🎯 AKTİF GÖREV</h3>
                    <p className="font-heading font-bold text-xl text-dark max-w-2xl">{missionText}</p>
                </motion.div>
            )}

            {/* Main Upload Area */}
            <div className="flex flex-col items-center justify-center min-h-[500px]">

                {/* Header Text (Dynamic based on state) */}
                <div className="text-center mb-10 max-w-md">
                    <h2 className="text-3xl font-heading font-bold text-dark mb-2">
                        {feedback ? 'Öğretmenin Yorumladı! 👩‍🎨' : preview ? 'Harika Görünüyor! ✨' : 'Resmini Göster! 📸'}
                    </h2>
                    <p className="text-gray-500">
                        {feedback ? 'Yorumu beğendin mi? Yeni bir resim çiz!' : preview ? 'Beğendiysen öğretmene gönder, yorumlasın.' : 'Çizdiğin resmin fotoğrafını çek, Yapay Zeka öğretmenin yorumlasın.'}
                    </p>
                </div>

                {preview ? (
                    <div className="flex flex-col items-center w-full max-w-4xl gap-8">
                        {/* Image Card */}
                        <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 bg-black/5">
                            <img src={preview} className="w-full h-auto" alt="User Drawing" />

                            <button onClick={clearSelection} className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 backdrop-blur-md z-10 transition-colors">
                                <X size={20} />
                            </button>

                            {/* Send Button Overlay - Only if NO feedback */}
                            {!feedback && (
                                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent pt-20 flex justify-center">
                                    <button
                                        onClick={handleAnalyze}
                                        disabled={loading}
                                        className="bg-secondary text-white font-bold py-4 px-12 text-xl rounded-2xl shadow-pop hover:scale-105 transition-transform flex items-center disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
                                    >
                                        {loading ? <Loader2 className="animate-spin mr-3" size={28} /> : <Send className="mr-3" size={28} />}
                                        {loading ? 'İnceleniyor...' : 'Öğretmene Gönder'}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Feedback Card - Now Below Image */}
                        {feedback && (
                            <div className="w-full bg-white rounded-3xl p-8 shadow-soft border-l-8 border-secondary animate-in slide-in-from-bottom transition-all duration-500">
                                <h3 className="font-bold text-primary mb-4 flex items-center text-3xl">
                                    <span className="text-5xl mr-4">👩‍🎨</span> Öğretmenin Diyor ki:
                                </h3>

                                <div className="bg-light/50 p-8 rounded-2xl mb-8 max-h-[500px] overflow-y-auto custom-scrollbar border-2 border-primary/5">
                                    <p className="text-2xl text-dark leading-relaxed font-medium">
                                        {feedback}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {!saved ? (
                                        <button
                                            onClick={handleSaveToGallery}
                                            className="w-full bg-primary text-white py-6 rounded-2xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-3 text-xl shadow-lg hover:-translate-y-1"
                                        >
                                            <Save size={28} />
                                            Galeriye Kaydet
                                        </button>
                                    ) : (
                                        <button disabled className="w-full bg-green-100 text-green-600 py-6 rounded-2xl font-bold flex items-center justify-center gap-3 text-xl">
                                            <CheckCircle size={28} />
                                            Kaydedildi!
                                        </button>
                                    )}

                                    <button onClick={clearSelection} className="w-full bg-gray-100 text-gray-500 py-6 rounded-2xl font-bold hover:bg-gray-200 transition-colors text-xl">
                                        Yeni Resim Çiz
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <input
                            type="file"
                            id="file-upload"
                            accept="image/*"
                            hidden
                            onChange={handleFileChange}
                            ref={fileInputRef}
                        />

                        <label htmlFor="file-upload" className="relative group w-full max-w-lg aspect-square bg-white border-8 border-dashed border-gray-200 rounded-[3rem] flex flex-col items-center justify-center hover:border-primary hover:bg-primary/5 transition-all cursor-pointer shadow-soft hover:shadow-lg">
                            <div className="w-40 h-40 bg-light rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform text-primary shadow-inner">
                                <Camera size={80} />
                            </div>
                            <span className="font-bold text-gray-400 group-hover:text-primary text-3xl">Fotoğraf Çek</span>
                            <span className="mt-2 text-lg text-gray-300 group-hover:text-primary/70 font-medium">veya yüklemek için tıkla</span>
                        </label>
                    </>
                )}

            </div>
        </div>
    );
}
