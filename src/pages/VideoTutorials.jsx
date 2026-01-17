import { useState } from 'react';
import { Play, X, Clock, BarChart, Monitor, Pencil, ChevronLeft, Folder } from 'lucide-react';
import { VIDEO_TUTORIALS } from '../data/education';

// Artist Cover Image Mapping
const ARTIST_COVERS = {
    "Chut Chit": "/videos/klasik/Chut Chit/Chut Chit.jpg",
    "Daribodrawing": "/videos/klasik/Daribodrawing/daribodrawing.jpg",
    "Guitar İllustrain": "/videos/dijital/Guitar İllustrain/guitar_illustration.jpg",
    "Neda Sadrettin": "/videos/dijital/Neda Sadrettin/Neda.webp",
    "Çizim Atölyesi": null // Fallback if needed
};

export default function VideoTutorials() {
    const [view, setView] = useState('menu'); // 'menu', 'digital', 'classic'
    const [selectedArtist, setSelectedArtist] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);

    // 1. Get Artists for current Category Logic
    const getArtistsByCategory = (category) => {
        const videosInCategory = VIDEO_TUTORIALS.filter(v => v.category === category);
        // Get unique authors
        const authors = [...new Set(videosInCategory.map(v => v.author))];
        return authors.map(author => ({
            name: author,
            count: videosInCategory.filter(v => v.author === author).length,
            cover: ARTIST_COVERS[author] || null
        }));
    };

    // 2. Get Videos for current Artist Logic
    const getArtistVideos = () => {
        if (!selectedArtist) return [];
        return VIDEO_TUTORIALS.filter(v =>
            v.category === view && v.author === selectedArtist
        );
    };

    const handleBack = () => {
        if (selectedVideo) {
            setSelectedVideo(null);
            return;
        }
        if (selectedArtist) {
            setSelectedArtist(null);
            return;
        }
        if (view !== 'menu') {
            setView('menu');
            return;
        }
    };

    // Helper to get embed URL (kept for backward compatibility if YouTube links return)
    const getEmbedUrl = (url) => {
        if (!url) return '';
        if (url.includes('instagram.com')) {
            const cleanUrl = url.split('?')[0].replace(/\/$/, '');
            return `${cleanUrl}/embed`;
        }
        if (url.includes('embed')) return url;
        return url.replace('watch?v=', 'embed/');
    };

    const currentArtists = view !== 'menu' ? getArtistsByCategory(view) : [];
    const currentVideos = selectedArtist ? getArtistVideos() : [];

    return (
        <div className="max-w-6xl mx-auto pb-10">
            {/* Header Area */}
            <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-3xl p-8 shadow-soft text-white mb-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-10 -translate-y-10" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full transform -translate-x-5 translate-y-5" />

                {view === 'menu' ? (
                    <>
                        <h1 className="text-4xl font-heading font-bold mb-2 relative z-10">Video Atölyesi 🎥</h1>
                        <p className="text-white/90 font-medium text-lg relative z-10">İzle, öğren ve sen de çiz!</p>
                    </>
                ) : (
                    <div className="relative z-10 flex items-center justify-center gap-4">
                        <button
                            onClick={handleBack}
                            className="absolute left-0 bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-heading font-bold mb-1">
                                {selectedArtist ? selectedArtist : (view === 'digital' ? 'Dijital Çizim' : 'Klasik Çizim')}
                            </h1>
                            <p className="text-white/90 font-medium">
                                {selectedArtist ? 'Eğitim Videoları' : 'Sanatçını Seç ve Başla!'}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* VIEW 1: Main Menu (Digital vs Classic) */}
            {view === 'menu' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <div
                        onClick={() => setView('digital')}
                        className="bg-white rounded-3xl p-8 shadow-soft hover:shadow-pop transition-all cursor-pointer group border-b-8 border-purple-500 hover:-translate-y-2"
                    >
                        <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                            <Monitor size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-dark mb-3">Dijital Çizim Öğreniyorum</h2>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            Tablet ve bilgisayar ile çizim yapmanın sırları.
                        </p>
                    </div>

                    <div
                        onClick={() => setView('classic')}
                        className="bg-white rounded-3xl p-8 shadow-soft hover:shadow-pop transition-all cursor-pointer group border-b-8 border-orange-500 hover:-translate-y-2"
                    >
                        <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition-transform">
                            <Pencil size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-dark mb-3">Klasik Çizim Öğreniyorum</h2>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            Kağıt, kalem ve boya kalemleri ile harikalar yarat.
                        </p>
                    </div>
                </div>
            )}

            {/* VIEW 2: Artist Folders Selection */}
            {view !== 'menu' && !selectedArtist && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {currentArtists.map((artist, index) => (
                        <div
                            key={index}
                            onClick={() => setSelectedArtist(artist.name)}
                            className="bg-white rounded-3xl p-4 shadow-soft hover:shadow-pop transition-all cursor-pointer group border-2 border-transparent hover:border-red-200 flex flex-col h-full"
                        >
                            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] mb-4 bg-gray-100">
                                {artist.cover ? (
                                    <img
                                        src={artist.cover}
                                        alt={artist.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <Folder size={64} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-lg">
                                    {artist.count} Video
                                </div>
                            </div>
                            <h3 className="font-bold text-dark text-xl text-center mb-2">{artist.name}</h3>
                            <button className="w-full bg-red-50 text-red-500 font-bold py-2 rounded-xl group-hover:bg-red-500 group-hover:text-white transition-colors">
                                Klasörü Aç
                            </button>
                        </div>
                    ))}

                    {currentArtists.length === 0 && (
                        <div className="col-span-full text-center py-10 text-gray-400">
                            Bu kategoride henüz çizer klasörü bulunmuyor.
                        </div>
                    )}
                </div>
            )}

            {/* VIEW 3: Video Grid for Selected Artist */}
            {selectedArtist && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {currentVideos.map((video) => (
                        <div
                            key={video.id}
                            onClick={() => setSelectedVideo(video)}
                            className="bg-white rounded-3xl p-4 shadow-soft hover:shadow-pop transition-all cursor-pointer group border-2 border-transparent hover:border-red-200 flex flex-col h-full"
                        >
                            {/* Video Preview (No Thumbnail mode) */}
                            <div className="relative rounded-2xl overflow-hidden aspect-video mb-4 bg-black">
                                {video.videoUrl.endsWith('.mp4') ? (
                                    <video
                                        src={video.videoUrl + "#t=0.5"}
                                        className="w-full h-full object-cover"
                                        preload="metadata"
                                        muted
                                        loop
                                        playsInline
                                        onMouseOver={event => event.target.play()}
                                        onMouseOut={event => {
                                            event.target.pause();
                                            event.target.currentTime = 0.5;
                                        }}
                                    />
                                ) : (
                                    // Fallback for non-mp4 (YouTube etc)
                                    <img
                                        src={video.thumbnail || "https://placehold.co/600x400?text=Video"}
                                        alt={video.title}
                                        className="w-full h-full object-cover"
                                    />
                                )}

                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-red-500 shadow-lg group-hover:scale-110 transition-transform">
                                        <Play fill="currentColor" className="ml-1 w-5 h-5" />
                                    </div>
                                </div>

                                {/* Duration Badge */}
                                {video.duration && (
                                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 backdrop-blur-sm">
                                        <Clock size={12} />
                                        {video.duration}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 flex flex-col">
                                <h3 className="font-bold text-dark text-lg mb-1 line-clamp-2 leading-tight">{video.title}</h3>
                                <div className="mt-auto flex gap-2">
                                    {video.difficulty && (
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1
                                            ${video.difficulty === 'Kolay' ? 'bg-green-100 text-green-600' :
                                                video.difficulty === 'Orta' ? 'bg-yellow-100 text-yellow-600' :
                                                    'bg-red-100 text-red-600'}`}>
                                            <BarChart size={12} />
                                            {video.difficulty}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Video Modal Player */}
            {selectedVideo && (
                <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="w-full max-w-5xl bg-gray-900 rounded-3xl overflow-hidden shadow-2xl relative border border-gray-800">
                        <button
                            onClick={() => setSelectedVideo(null)}
                            className="absolute top-4 right-4 text-white/50 hover:text-white bg-black/50 hover:bg-red-500 rounded-full p-2 transition-all z-10"
                        >
                            <X size={24} />
                        </button>

                        <div className="aspect-video w-full bg-black relative flex items-center justify-center overflow-hidden">
                            {selectedVideo.videoUrl.endsWith('.mp4') ? (
                                <video
                                    src={selectedVideo.videoUrl}
                                    controls
                                    autoPlay
                                    className="w-full h-full"
                                >
                                    Tarayıcınız bu video formatını desteklemiyor.
                                </video>
                            ) : (
                                <iframe
                                    src={`${getEmbedUrl(selectedVideo.videoUrl)}?autoplay=1&rel=0&modestbranding=1&showinfo=0`}
                                    title={selectedVideo.title}
                                    className="w-full h-full"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
