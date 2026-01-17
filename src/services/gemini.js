import { GoogleGenerativeAI } from "@google/generative-ai";

// Helper to get configuration
const getConfig = () => {
    const localKey = localStorage.getItem('aiApiKey');
    const localModel = localStorage.getItem('selectedAiModel') || "gemini-flash-latest"; // Matches original project exactly
    const apiKey = localKey || import.meta.env.VITE_GEMINI_API_KEY;
    return { apiKey, model: localModel };
};

// 🇹🇷 STRICT TURKISH PERSONA PROMPT
const SYSTEM_PROMPT = `
Rol: Sen karşındaki 8 yaşındaki yetenekli bir çocuğun "Sanal Resim Öğretmenisin".
Dil Kuralı: CEVAPLARIN HER ZAMAN VE SADECE TÜRKÇE OLACAK.
Ton: Neşeli, motive edici, kısa ve net.
Amaç: Çocuğun yüklediği resme bakarak onu tebrik etmek ve geliştirmesi için KÜÇÜK, tatlı bir ipucu vermek.

Kurallar:
1. Asla karmaşık sanat terimleri kullanma.
2. "Harika", "Süper", "Çok güzek" gibi kelimeler kullan ama mutlaka resimden bir DETAY ver (Örn: "Çizdiğin güneş ne kadar parlak olmuş!").
3. Cevapların en fazla 2-3 cümle olsun. Çocuk okurken sıkılmasın.
4. Emojiler kullan (🎨, 🌟, 🚀).
`;

export const analyzeDrawing = async (fileBase64, promptText = "Bu resmi yorumla") => {
    const { apiKey, model } = getConfig();

    if (!apiKey) {
        return "Öğretmen şu an derste değil (API Anahtarı eksik). Ayarlardan ekleyebilirsin!";
    }

    // Extract mime type and clean base64
    let mimeType = "image/jpeg";
    let cleanBase64 = fileBase64;

    if (fileBase64.includes('data:')) {
        const matches = fileBase64.match(/^data:(.+);base64,(.+)$/);
        if (matches && matches.length === 3) {
            mimeType = matches[1];
            cleanBase64 = matches[2];
        }
    } else if (fileBase64.includes(',')) {
        // Fallback simple split
        cleanBase64 = fileBase64.split(',')[1];
    }

    const body = {
        contents: [{
            parts: [
                { text: SYSTEM_PROMPT + `\n\nÇocuğun Görevi/Resmi: ${promptText}` },
                {
                    inlineData: {
                        mimeType: mimeType,
                        data: cleanBase64
                    }
                }
            ]
        }]
    };

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (data.error) {
            console.error("Gemini API Error:", data.error);
            throw new Error(data.error.message || "API Hatası");
        }

        if (data.candidates && data.candidates.length > 0) {
            return data.candidates[0].content.parts[0].text;
        }

        return "Hımm, bir cevap oluşturamadım. Tekrar dener misin?";
    } catch (error) {
        console.error("Gemini Fetch Error:", error);
        return "Bağlantı hatası oluştu. Lütfen internetini ve anahtarını kontrol et.";
    }
};

// 🧠 BİLSEM / CREATIVE PROMPT GENERATOR
const PROMPT_PERSONA = `
Rol: BİLSEM (Bilim ve Sanat Merkezleri) resim yetenek sınavlarına hazırlık uzmanısın.
Hedef Kitle: 8 yaşındaki yetenekli çocuklar.
Amaç: Çocuğun hayal gücünü geliştirecek, "Fikir Jimnastiği" yaptıracak ama mutlaka ÇİZİLEBİLİR somut bir sahne tasviri yap.

KURALLAR:
1. ASLA soru sorma (Örn: "Ne yapardın?" DEME).
2. Doğrudan sahneyi anlat (Örn: "Şunu çiz: ...").
3. Detay ver (Renkler, mekanı, atmosferi anlat).
4. Çocuğun hayal edip kağıda dökebileceği bir kare tarif et.

Türler:
1. Hikaye: "Yağmurun yukarı doğru yağdığı ve balıkların havada yüzdüğü bir şehir çiz."
2. Dönüştürme: "Tekerlekleri karpuz dilimi olan dev bir kamyon çiz."
3. Mekan: "Karıncanın gözünden devasa bir piknik sepetinin içini çiz."

Sadece görevi, tek bir cümle veya kısa paragraf olarak yaz.
`;

export const generateCreativePrompt = async (gameType) => {
    const { apiKey, model } = getConfig();
    if (!apiKey) return null;

    try {
        let topic = "Genel yaratıcılık";
        if (gameType === 'scamper') topic = "SCAMPER tekniği ile 'Ya öyle olmasaydı?' sorusu";
        if (gameType === 'hard') topic = "Zorlu, detaylı, perspektif gerektiren bir sahne";
        if (gameType === 'shape') topic = "Bir geometrik şekli alakasız bir nesneye dönüştürme görevi";

        const body = {
            contents: [{
                parts: [{ text: PROMPT_PERSONA + `\n\nLütfen şu türde bir çizim görevi üret: ${topic}` }]
            }]
        };

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (data.candidates && data.candidates.length > 0) {
            return data.candidates[0].content.parts[0].text.replace("Görevin:", "").trim();
        }
        return null;
    } catch (e) {
        console.error("Prompt Gen Error:", e);
        return null; // Fallback to local data
    }
};

export const testConnection = async (apiKey, modelName) => {
    const effectiveKey = apiKey || import.meta.env.VITE_GEMINI_API_KEY;
    const model = modelName || "gemini-flash-latest";

    if (!effectiveKey) throw new Error("API Anahtarı bulunamadı.");

    const body = {
        contents: [{
            parts: [{ text: "Merhaba, tek kelimeyle cevap ver: Hazır" }]
        }]
    };

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${effectiveKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(`API Hatası: ${data.error.message} (Kod: ${data.error.code})`);
        }

        if (!data.candidates) throw new Error("Yanıt alınamadı.");

        return true;
    } catch (error) {
        console.error("API Test Hatası:", error);
        throw error;
    }
};
