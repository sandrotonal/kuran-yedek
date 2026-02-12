import { useEffect, useState } from 'react';
import { Mosque, MosqueService } from '../../lib/MosqueService';
import { MosqueMap } from './MosqueMap';
import { Locate, Map as MapIcon, List, Navigation } from 'lucide-react';

interface MosqueFinderProps {
    onClose: () => void;
}

export function MosqueFinder({ onClose }: MosqueFinderProps) {
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [mosques, setMosques] = useState<Mosque[]>([]);
    const [loading, setLoading] = useState(true);
    const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);

    useEffect(() => {
        // Get Location
        if (!navigator.geolocation) {
            setError("Tarayıcınız konum servisini desteklemiyor.");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lon: longitude });

                try {
                    const data = await MosqueService.getNearbyMosques(latitude, longitude);
                    setMosques(data);
                } catch (err) {
                    console.error(err);
                    setError("Camiler yüklenirken bir sorun oluştu.");
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                console.error(err);
                setError("Konum alınamadı. Varsayılan konum (İstanbul) kullanılıyor.");
                // Default fallback: Istanbul Fatih
                const defaultLat = 41.0082;
                const defaultLon = 28.9784;
                setUserLocation({ lat: defaultLat, lon: defaultLon });

                // Still try to fetch mosques for default location
                MosqueService.getNearbyMosques(defaultLat, defaultLon)
                    .then(data => setMosques(data))
                    .catch(() => setError("Varsayılan konum için camiler yüklenemedi."))
                    .finally(() => setLoading(false));
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }, []);

    return (
        <div className="fixed inset-0 z-[60] bg-theme-bg flex flex-col animate-fadeIn overflow-hidden font-sans">
            {/* Glossy Header - Using theme-surface */}
            <div className="px-6 py-4 flex items-center justify-between bg-theme-surface/80 backdrop-blur-xl border-b border-theme-border sticky top-0 z-20 shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onClose}
                        className="p-2 -ml-2 rounded-full hover:bg-theme-border/50 text-theme-muted hover:text-theme-text transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <div>
                        <h2 className="text-xl font-bold font-serif text-theme-text flex items-center gap-2">
                            Yakın Camiler
                        </h2>
                        <p className="text-xs text-theme-muted">Çevrenizdeki ibadet noktaları</p>
                    </div>
                </div>

                {/* Segmented Control */}
                <div className="flex bg-theme-bg p-1 rounded-lg border border-theme-border relative">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`relative z-10 px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${viewMode === 'list'
                                ? 'bg-theme-surface text-emerald-600 shadow-sm border border-theme-border'
                                : 'text-theme-muted hover:text-theme-text'
                            }`}
                    >
                        <List className="w-4 h-4" />
                        <span className="hidden sm:inline">Liste</span>
                    </button>
                    <button
                        onClick={() => setViewMode('map')}
                        className={`relative z-10 px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${viewMode === 'map'
                                ? 'bg-theme-surface text-emerald-600 shadow-sm border border-theme-border'
                                : 'text-theme-muted hover:text-theme-text'
                            }`}
                    >
                        <MapIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Harita</span>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative flex flex-col md:flex-row">

                {/* Check Loading/Error */}
                {loading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-theme-bg/50 backdrop-blur-sm z-30">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 border-4 border-theme-border rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-t-emerald-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="mt-4 text-theme-muted font-medium animate-pulse">Camiler taranıyor...</p>
                    </div>
                ) : error ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-30">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-theme-text mb-2">Eyvah!</h3>
                        <p className="text-theme-muted max-w-xs">{error}</p>
                        <button onClick={onClose} className="mt-8 px-8 py-2.5 bg-theme-text text-theme-bg rounded-full font-medium hover:opacity-90 transition-opacity">
                            Tamam
                        </button>
                    </div>
                ) : (
                    <>
                        {/* List Panel */}
                        <div className={`
                            flex-1 overflow-y-auto custom-scrollbar bg-theme-bg
                            ${viewMode === 'map' ? 'hidden md:block md:w-96 md:flex-none border-r border-theme-border' : 'block w-full'}
                        `}>
                            {mosques.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-theme-muted p-10 text-center">
                                    <Locate className="w-12 h-12 mb-4 opacity-50" />
                                    <p>Yakınınızda cami bulunamadı.</p>
                                </div>
                            ) : (
                                <div className="p-4 space-y-3 pb-24 md:pb-4">
                                    {/* Location Badge */}
                                    <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/50 rounded-lg p-3 mb-4 flex items-center gap-3">
                                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-full text-emerald-600 dark:text-emerald-400">
                                            <Locate className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">Şu anki Konum</p>
                                            <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">{userLocation ? `${userLocation.lat.toFixed(4)}, ${userLocation.lon.toFixed(4)}` : 'Konum bekleniyor...'}</p>
                                        </div>
                                    </div>

                                    {mosques.map((mosque, index) => (
                                        <div
                                            key={mosque.id}
                                            onClick={() => {
                                                setSelectedMosque(mosque);
                                                if (window.innerWidth < 768) setViewMode('map');
                                            }}
                                            className={`
                                                group relative bg-theme-surface p-4 rounded-xl border transition-all cursor-pointer overflow-hidden
                                                hover:shadow-md hover:border-emerald-500/30
                                                ${selectedMosque?.id === mosque.id
                                                    ? 'border-emerald-500 ring-1 ring-emerald-500 shadow-md bg-emerald-50/50 dark:bg-emerald-900/10'
                                                    : 'border-theme-border shadow-sm'}
                                            `}
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            {/* Decorative pattern */}
                                            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity text-theme-text">
                                                <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" /></svg>
                                            </div>

                                            <div className="flex justify-between items-start relative z-10">
                                                <div>
                                                    <h3 className={`font-bold text-lg font-serif mb-1 group-hover:text-emerald-600 transition-colors ${selectedMosque?.id === mosque.id ? 'text-emerald-600' : 'text-theme-text'}`}>
                                                        {mosque.name}
                                                    </h3>
                                                    {mosque.address && (
                                                        <p className="text-xs text-theme-muted mb-2 line-clamp-1">{mosque.address}</p>
                                                    )}
                                                </div>
                                                <span className="px-2.5 py-1 bg-theme-bg rounded-lg text-xs font-mono font-medium text-theme-muted whitespace-nowrap">
                                                    {(mosque.distance || 0).toFixed(0)}m
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-3 mt-4 relative z-10">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.open(`https://www.google.com/maps/dir/?api=1&destination=${mosque.lat},${mosque.lon}`, '_blank');
                                                    }}
                                                    className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-emerald-500/20"
                                                >
                                                    <Navigation className="w-3.5 h-3.5" />
                                                    Yol Tarifi
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedMosque(mosque);
                                                        setViewMode('map');
                                                    }}
                                                    className="p-2 text-theme-muted hover:text-emerald-600 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg"
                                                >
                                                    <MapIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Map Panel */}
                        <div className={`
                            flex-1 bg-slate-100 dark:bg-slate-900 relative
                            ${viewMode === 'list' ? 'hidden md:block' : 'block w-full h-full'}
                        `}>
                            {userLocation && (
                                <MosqueMap
                                    userLat={userLocation.lat}
                                    userLon={userLocation.lon}
                                    mosques={mosques}
                                    selectedMosqueId={selectedMosque?.id}
                                    onSelectMosque={(m) => setSelectedMosque(m)}
                                />
                            )}

                            {/* Floating Map Controls for Mobile */}
                            {viewMode === 'map' && (
                                <button
                                    onClick={() => setViewMode('list')}
                                    className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 bg-theme-surface text-theme-text px-6 py-3 rounded-full shadow-xl font-bold text-sm flex items-center gap-2 z-[400] border border-theme-border"
                                >
                                    <List className="w-4 h-4" />
                                    Listeye Dön
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
