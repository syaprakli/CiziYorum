import {
    Pencil, Highlighter, Palette, Activity, Wand2,
    Brush, Cloudy, Component, BrainCircuit, Crown, Sparkles, Flame, Star
} from 'lucide-react';

export const LEVELS = [
    {
        id: 1,
        title: "Meraklı Çırak",
        target: 0,
        desc: "Sanat yolculuğuna yeni başlayan minik ressam.",
        icon: Pencil,
        color: "bg-gray-400"
    },
    {
        id: 2,
        title: "Hevesli Çizer",
        target: 2, // Easier: Unlock Jar (Was 3)
        desc: "Kağıtla kalemin dostluğunu keşfeden çizer.",
        icon: Highlighter,
        color: "bg-yellow-400"
    },
    {
        id: 3,
        title: "Renk Kaşifi",
        target: 5, // Easier: Unlock Shape (Was 7)
        desc: "Renklerin dünyasında ilk adımlar.",
        icon: Palette,
        color: "bg-orange-400"
    },
    {
        id: 4,
        title: "Çizgi Cambazı",
        target: 10, // Easier: Unlock Absurd (Was 15)
        desc: "Çizgileri dans ettiren yetenek.",
        icon: Activity,
        color: "bg-green-400"
    },
    {
        id: 5,
        title: "Boya Büyücüsü",
        target: 15, // Easier: Unlock Scamper (Was 25)
        desc: "Hayal gücünü renklere katan büyücü.",
        icon: Wand2,
        color: "bg-purple-400"
    },
    {
        id: 6,
        title: "Fırça Şövalyesi",
        target: 25, // Easier: Was 40
        desc: "Sanatın koruyucusu ve uygulayıcısı.",
        icon: Brush,
        color: "bg-blue-500"
    },
    {
        id: 7,
        title: "Gökkuşağı Mimarı",
        target: 40, // Unlock Hard (Was 60)
        desc: "Dünyayı renklerle yeniden inşa eden mimar.",
        icon: Cloudy,
        color: "bg-indigo-500"
    },
    {
        id: 8,
        title: "Tuval Ustası",
        target: 60, // Was 90
        desc: "Eserleriyle hayranlık uyandıran usta.",
        icon: Component,
        color: "bg-red-500"
    },
    {
        id: 9,
        title: "Sanat Dehası",
        target: 100, // Was 150
        desc: "Benzersiz tarzıyla ışıldayan deha.",
        icon: BrainCircuit,
        color: "bg-pink-500"
    },
    {
        id: 10,
        title: "Efsanevi Ressam",
        target: 200, // Was 250
        desc: "Sanat tarihine adını yazdıran efsane.",
        icon: Crown,
        color: "bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500"
    }
];

// Achievements / Badges (Harder challenges)
// Achievements / Badges (Harder challenges)
export const BADGES = [
    { id: 'b1', title: "Çaylak Ressam", target: 1, icon: Pencil, color: "bg-blue-400" },
    { id: 'b2', title: "Renkli Kalem", target: 10, icon: Highlighter, color: "bg-teal-400" },
    { id: 'b3', title: "Fırça Ustası", target: 20, icon: Brush, color: "bg-amber-700" },
    { id: 'b4', title: "Palet Şefi", target: 30, icon: Palette, color: "bg-slate-400" },
    { id: 'b5', title: "Sihirli Dokunuş", target: 40, icon: Wand2, color: "bg-yellow-500" },
    { id: 'b6', title: "Sanat Aşığı", target: 50, icon: Activity, color: "bg-red-400" },
    { id: 'b7', title: "Kompozisyon", target: 60, icon: Component, color: "bg-emerald-500" },
    { id: 'b8', title: "Yıldız Tozu", target: 70, icon: Sparkles, color: "bg-blue-600" },
    { id: 'b9', title: "Ateşli Çizim", target: 80, icon: Flame, color: "bg-rose-600" },
    { id: 'b10', title: "Efsane", target: 90, icon: Crown, color: "bg-fuchsia-600" }
];

export const getCurrentLevel = (count) => {
    // Find the highest level achieved
    let level = LEVELS[0];
    for (let l of LEVELS) {
        if (count >= l.target) {
            level = l;
        } else {
            break; // Stop if we haven't reached this target
        }
    }
    return level;
};

export const getNextLevel = (count) => {
    return LEVELS.find(l => l.target > count) || null;
};

// Aliases / Helpers
export const calculateLevel = (xp) => {
    // XP is basically drawing count in this simplified model
    const current = getCurrentLevel(xp);
    return { level: current.id, details: current };
};
