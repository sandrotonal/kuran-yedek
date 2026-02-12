
import { useEffect, useState } from 'react';
import { EsmaulHusnaService, AsmaAlHusna } from '../../lib/EsmaulHusnaService';

interface EsmaulHusnaViewProps {
    onClose: () => void;
}

export function EsmaulHusnaView({ onClose }: EsmaulHusnaViewProps) {
    const [names, setNames] = useState<AsmaAlHusna[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedName, setSelectedName] = useState<AsmaAlHusna | null>(null);

    const [favorites, setFavorites] = useState<number[]>([]);

    useEffect(() => {
        const loadNames = async () => {
            const data = await EsmaulHusnaService.getAllNames();
            setNames(data);
            setLoading(false);
        };
        loadNames();

        // Load favorites
        const storedFavs = localStorage.getItem('esmaulHusnaFavorites');
        if (storedFavs) {
            setFavorites(JSON.parse(storedFavs));
        }
    }, []);

    const toggleFavorite = (number: number) => {
        setFavorites(prev => {
            const newFavs = prev.includes(number)
                ? prev.filter(n => n !== number)
                : [...prev, number];
            localStorage.setItem('esmaulHusnaFavorites', JSON.stringify(newFavs));
            return newFavs;
        });
    };

    const playAudio = (text: string) => {
        // Try to find an Arabic voice
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ar-SA';
        utterance.rate = 0.8; // Slightly slower for better clarity

        // Optional: specific voice selection if available
        const voices = window.speechSynthesis.getVoices();
        const arabicVoice = voices.find(v => v.lang.includes('ar'));
        if (arabicVoice) utterance.voice = arabicVoice;

        window.speechSynthesis.cancel(); // Stop previous
        window.speechSynthesis.speak(utterance);
    };

    const filteredNames = names.filter(n =>
        n.transliteration.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.en.meaning.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-[60] bg-theme-bg/95 backdrop-blur-xl flex flex-col animate-fadeIn overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-theme-border flex items-center justify-between bg-theme-surface/50 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onClose}
                        className="p-2 -ml-2 rounded-full hover:bg-theme-border/50 text-theme-text transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <h2 className="text-xl font-bold font-serif text-theme-text">Esmaül Hüsna</h2>
                </div>

                <div className="text-xs text-theme-muted font-mono bg-theme-bg/50 px-3 py-1 rounded-full border border-theme-border">
                    99 İsim
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">

                {/* Search */}
                <div className="max-w-md mx-auto mb-8 relative">
                    <input
                        type="text"
                        placeholder="İsim veya anlam ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 bg-theme-surface border border-theme-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all pl-10"
                    />
                    <svg className="w-5 h-5 text-theme-muted absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 max-w-7xl mx-auto pb-20">
                        {filteredNames.map((item) => (
                            <button
                                key={item.number}
                                onClick={() => setSelectedName(item)}
                                className={`group relative aspect-square flex flex-col items-center justify-center p-4 bg-theme-surface border rounded-2xl transition-all duration-300 active:scale-95
                                    ${favorites.includes(item.number)
                                        ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                                        : 'border-theme-border hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10'
                                    }
                                `}
                            >
                                <span className="absolute top-3 left-3 text-[10px] font-mono text-theme-muted opacity-50">{item.number}</span>
                                {favorites.includes(item.number) && (
                                    <span className="absolute top-3 right-3 text-emerald-500">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                                    </span>
                                )}

                                <div className="flex-1 flex items-center justify-center w-full">
                                    <span className="text-3xl md:text-4xl font-arabic text-theme-text group-hover:text-emerald-600 transition-colors drop-shadow-sm">
                                        {item.name}
                                    </span>
                                </div>

                                <div className="mt-2 text-center w-full">
                                    <h3 className="text-sm font-bold text-theme-text truncate group-hover:text-emerald-500 transition-colors">{item.transliteration}</h3>
                                    <p className="text-[10px] text-theme-muted truncate opacity-80 group-hover:opacity-100">{item.en.meaning}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedName && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={() => setSelectedName(null)}>
                    <div
                        className="bg-theme-surface border border-theme-border rounded-3xl p-8 max-w-sm w-full shadow-2xl relative overflow-hidden animate-slideUp"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 p-8 opacity-5 font-arabic text-9xl pointer-events-none select-none">
                            {selectedName.name}
                        </div>

                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold font-mono">
                                #{selectedName.number}
                            </span>
                            <button
                                onClick={() => setSelectedName(null)}
                                className="p-2 bg-theme-bg rounded-full hover:bg-theme-border transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="text-center mb-8 relative z-10">
                            <h2 className="text-6xl font-arabic mb-4 text-theme-text drop-shadow-md">{selectedName.name}</h2>
                            <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">{selectedName.transliteration}</h3>
                            <p className="text-theme-muted italic">"{selectedName.en.meaning}"</p>
                        </div>

                        <div className="flex gap-2 justify-center relative z-10">
                            <button
                                onClick={() => playAudio(selectedName.name)}
                                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-95"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Dinle
                            </button>
                            <button
                                onClick={() => toggleFavorite(selectedName.number)}
                                className={`p-3 border rounded-xl transition-colors active:scale-95
                                    ${favorites.includes(selectedName.number)
                                        ? 'bg-emerald-100 border-emerald-500 text-emerald-600 dark:bg-emerald-900/30 dark:border-emerald-500/50 dark:text-emerald-400'
                                        : 'bg-theme-bg border-theme-border hover:text-emerald-500'
                                    }
                                `}
                            >
                                {favorites.includes(selectedName.number) ? (
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                                ) : (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
