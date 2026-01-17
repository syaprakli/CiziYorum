import { useState } from 'react';
import { Play, X, Clock, BarChart } from 'lucide-react';
import { VIDEO_TUTORIALS } from '../data/education';

export default function VideoTutorials() {
    const [selectedVideo, setSelectedVideo] = useState(null);

    // Helper to get embed URL
    const getEmbedUrl = (url) => {
        if (!url) return '';
        if (url.includes('instagram.com')) {
            // Remove parameters if any and ensure trailing slash before embed
            const cleanUrl = url.split('?')[0].replace(/\/$/, '');
            return `${cleanUrl}/embed`;
        }
        if (url.includes('embed')) return url;
        return url.replace('watch?v=', 'embed/');
    };

    return (
        <div className="max-w-6xl mx-auto pb-10">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-3xl p-8 shadow-soft text-white mb-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-10 -translate-y-10" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full transform -translate-x-5 translate-y-5" />

                <h1 className="text-4xl font-heading font-bold mb-2 relative z-10">Video Atölyesi 🎥</h1>
                <p className="text-white/90 font-medium text-lg relative z-10">İzle, öğren ve sen de çiz!</p>
            </div>

            {/* Video Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {VIDEO_TUTORIALS.map((video) => (
                    <div
                        key={video.id}
                        onClick={() => setSelectedVideo(video)}
                        className="bg-white rounded-3xl p-4 shadow-soft hover:shadow-pop transition-all cursor-pointer group border-2 border-transparent hover:border-red-200 flex flex-col h-full"
                    >
                        {/* Thumbnail Container */}
                        <div className="relative rounded-2xl overflow-hidden aspect-video mb-4">
                            <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center text-red-500 shadow-lg group-hover:scale-110 transition-transform">
                                    <Play fill="currentColor" className="ml-1 w-6 h-6" />
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

                        {/* Content */}
                        <div className="flex-1 flex flex-col">
                            <h3 className="font-bold text-dark text-lg mb-1 line-clamp-2 leading-tight">{video.title}</h3>
                            <p className="text-gray-400 text-sm font-medium mb-3">{video.author}</p>

                            {/* Tags */}
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

            {/* Video Modal */}
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
                            {/* Local Video Support */}
                            {selectedVideo.videoUrl.endsWith('.mp4') ? (
                                <video
                                    src={selectedVideo.videoUrl}
                                    controls
                                    autoPlay
                                    className="w-full h-full"
                                >
                                    Tarayıcınız bu video formatını desteklemiyor.
                                </video>
                            ) : selectedVideo.videoUrl.includes('instagram.com') ? (
                                <div className="relative w-full h-full group">
                                    {/* Blurred Background */}
                                    <div
                                        className="absolute inset-0 bg-cover bg-center blur-xl opacity-50"
                                        style={{ backgroundImage: `url(${selectedVideo.thumbnail})` }}
                                    />

                                    {/* Main Image */}
                                    <img
                                        src={selectedVideo.thumbnail}
                                        alt={selectedVideo.title}
                                        className="absolute inset-0 w-full h-full object-contain z-10"
                                    />

                                    {/* Overlay & Button */}
                                    <div className="absolute inset-0 bg-black/40 z-20 flex flex-col items-center justify-center gap-4">
                                        <a
                                            href={selectedVideo.videoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                                        >
                                            <Play size={24} fill="currentColor" />
                                            Instagram'da İzle
                                        </a>
                                        <p className="text-white/80 font-medium text-sm">
                                            Bu video Instagram'da açılır
                                        </p>
                                    </div>
                                </div>
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

                        <div className="p-6 bg-gradient-to-b from-gray-900 to-black text-white flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">{selectedVideo.title}</h2>
                                <p className="text-gray-400 font-medium flex items-center gap-2">
                                    <span>{selectedVideo.author}</span>
                                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                    <span>{selectedVideo.duration}</span>
                                </p>
                            </div>
                            {selectedVideo.difficulty && (
                                <span className={`px-4 py-2 rounded-xl font-bold text-sm
                                    ${selectedVideo.difficulty === 'Kolay' ? 'bg-green-900/50 text-green-400 border border-green-800' :
                                        selectedVideo.difficulty === 'Orta' ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-800' :
                                            'bg-red-900/50 text-red-400 border border-red-800'}`}>
                                    {selectedVideo.difficulty} Seviye
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
