import { useState, useEffect } from 'react';
import { Image as ImageIcon, Trash2, CheckCircle2, Grid, Layers, Download, X, MessageCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GAME_TYPES } from '../data/prompts';
import { getGallery, saveGallery } from '../utils/storage';






export default function Gallery() {
    const [drawings, setDrawings] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [viewMode, setViewMode] = useState('grouped'); // 'grid' | 'grouped'
    const [selectedDrawing, setSelectedDrawing] = useState(null);

    const handleDownload = (drawing) => {
        const link = document.createElement('a');
        link.href = drawing.image;
        link.download = `asafdraw-${new Date(drawing.date || Date.now()).toLocaleDateString('tr-TR').replace(/\./g, '-')}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        const loadGallery = async () => {
            try {
                const savedDrawings = await getGallery();
                if (savedDrawings && savedDrawings.length > 0) {
                    setDrawings(savedDrawings);
                } else {
                    setDrawings([]);
                    // Mark first run as done so we don't wonder about it later
                    if (!localStorage.getItem('firstRun')) {
                        localStorage.setItem('firstRun', 'true');
                    }
                }
            } catch (error) {
                console.error("Galeri verisi yüklenirken hata:", error);
                setDrawings([]);
            }
        };
        loadGallery();
    }, []);

    const updateDrawings = async (newDrawings) => {
        setDrawings(newDrawings);
        await saveGallery(newDrawings);
    };

    const toggleSelection = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(itemId => itemId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleDeleteSelected = () => {
        if (confirm('Seçili resimleri silmek istediğine emin misin?')) {
            const newDrawings = drawings.filter(d => !selectedIds.includes(d.id));
            updateDrawings(newDrawings);
            setSelectedIds([]);
            setIsSelectionMode(false);
        }
    };

    const handleDeleteAll = () => {
        if (confirm('TÜM resimleri silmek istediğine emin misin? Bu işlem geri alınamaz!')) {
            updateDrawings([]);
            setSelectedIds([]);
            setIsSelectionMode(false);
        }
    };

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode);
        setSelectedIds([]);
    };

    // Grouping Logic by Category
    const groupedDrawings = drawings.reduce((acc, drawing) => {
        // Fallback to 'other' if no category, or use the category key
        const catKey = drawing.category || 'other';

        if (!acc[catKey]) {
            acc[catKey] = [];
        }
        acc[catKey].push(drawing);
        return acc;
    }, {});

    // Helper to get display title for a category key
    const getCategoryTitle = (catKey) => {
        if (GAME_TYPES[catKey]) {
            return GAME_TYPES[catKey].title;
        }
        return 'Diğer Çizimler';
    };

    return (
        <div className="pb-20">
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-3xl font-heading font-bold text-dark">Galeri</h2>
                    <p className="text-gray-400 font-medium">{drawings.length} Eser</p>
                </div>

                <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm">
                    {/* View Toggle */}
                    <div className="flex bg-gray-100 rounded-xl p-1 mr-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                            title="Izgara Görünümü"
                        >
                            <Grid size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('grouped')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grouped' ? 'bg-white shadow-sm text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                            title="Gruplanmış Görünüm"
                        >
                            <Layers size={20} />
                        </button>
                    </div>

                    {isSelectionMode ? (
                        <>
                            <button
                                onClick={handleDeleteSelected}
                                disabled={selectedIds.length === 0}
                                className="flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-xl font-bold hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Trash2 size={18} />
                                Sil ({selectedIds.length})
                            </button>
                            <button
                                onClick={toggleSelectionMode}
                                className="px-4 py-2 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                            >
                                İptal
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={toggleSelectionMode}
                                className="flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-xl font-bold hover:bg-secondary/20 transition-colors"
                            >
                                <CheckCircle2 size={18} />
                                Seç
                            </button>
                            {drawings.length > 0 && (
                                <button
                                    onClick={handleDeleteAll}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    title="Tümünü Sil"
                                >
                                    <Trash2 size={20} />
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {drawings.length === 0 ? (
                <div className="text-center py-20 opacity-50 flex flex-col items-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-300">
                        <ImageIcon size={48} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-500 mb-2">Galeri Boş</h3>
                    <p className="text-gray-400 max-w-xs mx-auto">Henüz hiç resim kaydetmedin. Çizim yapmaya başla ve eserlerini buraya kaydet!</p>
                </div>
            ) : (
                <AnimatePresence>
                    {viewMode === 'grouped' ? (
                        // GROUPED VIEW
                        <div className="space-y-8">
                            {Object.entries(groupedDrawings).map(([categoryKey, groupDrawings]) => (
                                <motion.div
                                    key={categoryKey}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                                        <div className="w-2 h-8 bg-secondary rounded-full"></div>
                                        {getCategoryTitle(categoryKey)}
                                        <span className="text-sm font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                            {groupDrawings.length}
                                        </span>
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {groupDrawings.map((drawing) => (
                                            <GalleryItem
                                                key={drawing.id}
                                                drawing={drawing}
                                                isSelectionMode={isSelectionMode}
                                                isSelected={selectedIds.includes(drawing.id)}
                                                onToggle={() => toggleSelection(drawing.id)}
                                                onSelect={() => setSelectedDrawing(drawing)}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        // GRID VIEW
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {drawings.map((drawing) => (
                                <GalleryItem
                                    key={drawing.id}
                                    drawing={drawing}
                                    isSelectionMode={isSelectionMode}
                                    isSelected={selectedIds.includes(drawing.id)}
                                    onToggle={() => toggleSelection(drawing.id)}
                                    onSelect={() => setSelectedDrawing(drawing)}
                                />
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            )}

            {/* DRAWING MODAL */}
            {selectedDrawing && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
                        <button
                            onClick={() => setSelectedDrawing(null)}
                            className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/80 transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="flex-1 bg-black flex items-center justify-center p-4 relative group">
                            <img src={selectedDrawing.image} className="max-w-full max-h-[80vh] object-contain" alt="Drawing" />
                        </div>

                        <div className="w-full md:w-96 bg-white flex flex-col border-l border-gray-100">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="text-xl font-bold text-dark mb-1">
                                    {selectedDrawing.mission ? 'Görev Çizimi' : 'Serbest Çizim'}
                                </h3>
                                <p className="text-sm text-gray-400 font-bold">
                                    {new Date(selectedDrawing.date).toLocaleDateString('tr-TR')}
                                </p>
                            </div>

                            <div className="flex-1 p-6 overflow-y-auto bg-gray-50 custom-scrollbar">
                                {selectedDrawing.feedback ? (
                                    <>
                                        <div className="flex items-center gap-2 mb-3 text-primary font-bold">
                                            <Sparkles size={18} /> Öğretmenin Yorumu:
                                        </div>
                                        <div className="bg-white p-4 rounded-2xl shadow-sm text-gray-700 leading-relaxed text-sm border border-gray-100">
                                            {selectedDrawing.feedback}
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2 opacity-50">
                                        <MessageCircle size={32} />
                                        <p className="text-sm font-bold">Yorum yok</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border-t border-gray-100 bg-white z-10">
                                <button
                                    onClick={() => handleDownload(selectedDrawing)}
                                    className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                                >
                                    <Download size={20} />
                                    Resmi İndir
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function GalleryItem({ drawing, isSelectionMode, isSelected, onToggle, onSelect }) {
    return (
        <motion.div
            layoutId={drawing.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => isSelectionMode ? onToggle() : onSelect()}
            className={`relative group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer border-2
                ${isSelected ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-transparent'}
            `}
        >
            <div className="aspect-square bg-gray-50 relative">
                <img src={drawing.image} alt={drawing.task} className="w-full h-full object-cover p-2" />

                {/* Feedback Indicator */}
                {!isSelectionMode && drawing.feedback && (
                    <div className="absolute top-2 right-2 bg-secondary text-white p-1.5 rounded-full shadow-lg transform scale-0 group-hover:scale-100 transition-transform z-10">
                        <MessageCircle size={14} />
                    </div>
                )}

                {/* Selection Overlay */}
                {isSelectionMode && (
                    <div className={`absolute inset-0 bg-black/10 flex items-center justify-center transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isSelected ? 'bg-primary text-white' : 'bg-white text-gray-300'}`}>
                            <CheckCircle2 size={20} />
                        </div>
                    </div>
                )}
            </div>
            <div className="p-4">
                <h4 className="font-bold text-dark truncate text-sm">{drawing.task}</h4>
                <p className="text-xs text-gray-400 mt-1">{drawing.date}</p>
            </div>
        </motion.div>
    );
}
