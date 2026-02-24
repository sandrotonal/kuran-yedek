import { useEffect, useState, useRef } from 'react';
import { hapticFeedback, SURAHS } from '../../lib/constants';

// Ornek sureler, Mishary Rashid Alafasy audio
const SURAS = SURAHS.map(surah => ({
    id: String(surah.id),
    name: surah.turkish,
    arabic: surah.arabic,
    url: `https://server8.mp3quran.net/afs/${String(surah.id).padStart(3, '0')}.mp3`
}));

export function KuranDinlemeView({ onClose }: { onClose: () => void }) {
    const [isVisible, setIsVisible] = useState(false);

    // Audio State
    const [currentSurahIndex, setCurrentSurahIndex] = useState(35); // Default Yasin
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showList, setShowList] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);

    const activeSurah = SURAS[currentSurahIndex];

    useEffect(() => {
        requestAnimationFrame(() => requestAnimationFrame(() => setIsVisible(true)));

        // Initialize audio
        audioRef.current = new Audio(activeSurah.url);

        const audio = audioRef.current;

        const setAudioData = () => {
            setDuration(audio.duration);
            setCurrentTime(audio.currentTime);
        };

        const setAudioTime = () => {
            setCurrentTime(audio.currentTime);
            setProgress((audio.currentTime / audio.duration) * 100 || 0);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setProgress(0);
            setCurrentTime(0);
            playNext(); // Oto devam
        };

        audio.addEventListener('loadeddata', setAudioData);
        audio.addEventListener('timeupdate', setAudioTime);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('loadeddata', setAudioData);
            audio.removeEventListener('timeupdate', setAudioTime);
            audio.removeEventListener('ended', handleEnded);
            audio.pause();
        };
    }, []);

    // Yeni sure seçildiğinde audio source'u güncelle
    useEffect(() => {
        if (audioRef.current) {
            const wasPlaying = !audioRef.current.paused;
            audioRef.current.src = activeSurah.url;
            setProgress(0);
            setCurrentTime(0);

            if (wasPlaying || isPlaying) {
                audioRef.current.play().catch(e => console.log(e));
                setIsPlaying(true);
            }
        }
    }, [currentSurahIndex]);

    const handleClose = () => {
        setIsVisible(false);
        if (audioRef.current) {
            audioRef.current.pause();
        }
        setTimeout(onClose, 500);
    };

    const togglePlay = () => {
        hapticFeedback(10);
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().catch(e => console.log('Oynatma hatası:', e));
            setIsPlaying(true);
        }
    };

    const playNext = () => {
        hapticFeedback(10);
        setCurrentSurahIndex((prev) => (prev + 1) % SURAS.length);
    };

    const playPrev = () => {
        hapticFeedback(10);
        setCurrentSurahIndex((prev) => (prev - 1 + SURAS.length) % SURAS.length);
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!progressBarRef.current || !audioRef.current) return;

        hapticFeedback(10);
        const rect = progressBarRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;

        const newProgress = (clickX / width) * 100;
        const newTime = (newProgress / 100) * audioRef.current.duration;

        audioRef.current.currentTime = newTime;
        setProgress(newProgress);
        setCurrentTime(newTime);
    };

    const formatTime = (timeInSeconds: number) => {
        if (isNaN(timeInSeconds)) return "00:00";
        const m = Math.floor(timeInSeconds / 60);
        const s = Math.floor(timeInSeconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden p-0 sm:p-6 md:p-8">
            <div
                className={`absolute inset-0 bg-black/90 dark:bg-black/95 backdrop-blur-2xl transition-opacity duration-700 ease-out z-0 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleClose}
            />

            <div className={`relative w-full h-full sm:h-[95vh] sm:max-w-md md:h-auto md:max-h-[85vh] flex flex-col sm:rounded-[40px] overflow-hidden bg-[#0a0a0c]/80 backdrop-blur-3xl border-0 sm:border border-white/10 shadow-3xl shadow-indigo-900/40 z-10 transform transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) text-white ${isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-20 scale-90 opacity-0'}`}>

                {/* Ambient Blur */}
                <div className={`absolute top-0 inset-x-0 h-full w-full pointer-events-none transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-40'}`}>
                    <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen transition-all duration-1000 ${isPlaying ? 'animate-pulse scale-110' : ''}`} />
                    <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen transition-all duration-1000 ${isPlaying ? 'animate-pulse scale-110' : ''}`} />
                </div>

                <div className="px-6 py-6 md:px-8 md:py-6 flex items-center justify-between shrink-0 relative z-20">
                    <button onClick={() => { hapticFeedback(10); handleClose(); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/20 transition-all active:scale-90 shadow-sm">
                        <svg className="w-5 h-5 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <div className="text-center pointer-events-none flex flex-col items-center">
                        <span className="text-[10px] font-black tracking-[0.25em] uppercase text-emerald-400/70 block mb-1.5 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-pulse" />
                            Şu An Çalıyor
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-pulse" />
                        </span>
                        <span className="text-sm font-bold text-white/95 font-serif tracking-wide drop-shadow-sm">Kuran Dinleme</span>
                    </div>
                    <button onClick={() => { hapticFeedback(10); setShowList(!showList); }} className={`relative w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border text-white transition-all duration-300 active:scale-90 ${showList ? 'border-emerald-400/50 bg-emerald-500/20 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'border-white/10 hover:bg-white/20 shadow-sm hover:border-white/20'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        {!showList && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0a0a0c] shadow-[0_0_5px_rgba(16,185,129,0.5)]"></span>}
                    </button>
                </div>

                {/* Sure List Overlay - Modern Islamic Chic Design */}
                <div className={`absolute inset-x-0 bottom-0 h-[75%] bg-[#060b13]/80 backdrop-blur-[40px] z-30 transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) border-t border-emerald-500/10 flex flex-col ${showList ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'}`}>
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-emerald-500/10 flex justify-between items-center relative overflow-hidden bg-gradient-to-b from-white/[0.03] to-transparent shrink-0">
                        <div className="flex items-center gap-3 relative z-10">
                            <span className="w-1 h-5 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-full animate-pulse" />
                            <h3 className="font-extrabold text-white uppercase tracking-[0.25em] text-xs">Sure Seçimi</h3>
                        </div>
                        <button onClick={() => { hapticFeedback(10); setShowList(false); }} className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white hover:bg-emerald-500/20 hover:border-emerald-500/30 border border-transparent rounded-full transition-all duration-300 active:scale-90 relative z-10 group">
                            <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        {/* Decorative background Islamic pattern hint */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 150%, #10b981 0%, transparent 60%)' }} />
                    </div>

                    {/* Surah List */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar flex flex-col gap-2.5 relative">
                        {SURAS.map((surah, idx) => {
                            const isSelected = idx === currentSurahIndex;
                            return (
                                <button
                                    key={surah.id}
                                    onClick={() => {
                                        hapticFeedback(10);
                                        setCurrentSurahIndex(idx);
                                        setTimeout(() => setShowList(false), 250);
                                    }}
                                    className={`
                                        group relative w-full flex items-center justify-between p-4 rounded-2xl transition-colors duration-300 overflow-hidden
                                        ${isSelected
                                            ? 'bg-gradient-to-r from-emerald-900/40 via-teal-900/30 to-[#0a1524] border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)] py-5 my-1'
                                            : 'bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.06] hover:border-emerald-500/20 text-white/60 hover:text-white hover:shadow-lg'
                                        }
                                    `}
                                >
                                    {/* Selected State Background Glows & Effects */}
                                    {isSelected && (
                                        <>
                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 animate-[shimmer_3s_infinite]" />
                                            {/* Beautiful Arabic Watermark behind the active row */}
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 font-arabic text-6xl text-emerald-400/[0.04] pointer-events-none select-none transition-transform duration-1000 scale-150">
                                                {surah.arabic}
                                            </div>
                                        </>
                                    )}

                                    {/* Left Content */}
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-serif font-bold text-sm transition-colors duration-300
                                            ${isSelected ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-inner' : 'bg-slate-800/50 text-slate-400 border border-white/5 group-hover:text-emerald-300 group-hover:border-emerald-500/20'}
                                        `}>
                                            {surah.id}
                                        </div>
                                        <div className="flex flex-col items-start gap-0.5">
                                            <span className={`font-bold font-serif tracking-wide transition-colors ${isSelected ? 'text-white text-base drop-shadow-md' : 'group-hover:text-white text-sm'}`}>
                                                {surah.name}
                                            </span>
                                            {isSelected && (
                                                <span className="text-[10px] uppercase tracking-widest text-emerald-400/80 font-bold flex items-center gap-1.5 flex-row">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Oynatılıyor
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Content (Arabic) */}
                                    <span className={`font-arabic text-2xl transition-all duration-300 relative z-10 ${isSelected ? 'text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)] scale-110' : 'opacity-60 group-hover:opacity-100 group-hover:text-emerald-200'} `} dir="rtl">
                                        {surah.arabic}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    {/* Fade out bottom list */}
                    <div className="h-8 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#060b13]/90 to-transparent pointer-events-none" />
                </div>

                <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center custom-scrollbar w-full relative z-10 transition-opacity duration-300" style={{ opacity: showList ? 0.2 : 1 }}>

                    {/* ── Main Playback Visual Element ── */}
                    <div className="relative w-64 h-64 sm:w-[320px] sm:h-[320px] mb-10 w-full max-w-[340px] aspect-square mx-auto">

                        {/* Core Animated Glows behind the card */}
                        <div className={`absolute inset-0 bg-gradient-to-br from-emerald-500/40 via-teal-600/20 to-indigo-600/30 rounded-[3.5rem] blur-3xl transition-all duration-1000 ${isPlaying ? 'opacity-80 scale-110' : 'opacity-40 scale-95'}`} />
                        <div className={`absolute inset-2 bg-gradient-to-tr from-emerald-400 to-teal-400 rounded-[3.5rem] blur-xl opacity-30 mix-blend-overlay transition-all duration-[2000ms] ${isPlaying ? 'animate-pulse' : ''}`} />

                        {/* Outer Glass Ring (pulsing) */}
                        <div className={`absolute -inset-1 rounded-[3.5rem] border border-emerald-500/30 transition-all duration-1000 ${isPlaying ? 'scale-105 opacity-50 shadow-[0_0_30px_rgba(16,185,129,0.3)]' : 'scale-100 opacity-20'}`} />
                        <div className={`absolute -inset-4 rounded-[3.5rem] border border-teal-500/10 transition-all duration-[1500ms] ${isPlaying ? 'scale-[1.12] opacity-30' : 'scale-100 opacity-0'}`} />

                        {/* The Actual Glass Card */}
                        <div className={`w-full h-full rounded-[3.5rem] border border-white/20 shadow-2xl overflow-hidden bg-gradient-to-br from-[#0a1524]/60 to-[#050a12]/80 flex flex-col items-center justify-center relative backdrop-blur-2xl transition-transform duration-700 ease-out group ${isPlaying ? 'scale-100' : 'scale-95'}`}>

                            {/* Inner ambient glow */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-teal-500/10" />

                            {/* Geometric Islamic Pattern Hint */}
                            <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)', backgroundSize: '24px 24px' }} />

                            {/* Massive, Beautiful Arabic Background Watermark */}
                            <h1 className={`absolute inset-0 flex items-center justify-center text-8xl font-arabic text-emerald-400/[0.08] pointer-events-none px-4 text-center leading-normal transition-all duration-[3000ms] ease-out ${isPlaying ? 'scale-110 opacity-100' : 'scale-90 opacity-60'}`}>
                                {activeSurah.arabic}
                            </h1>

                            {/* Front Content */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-1">
                                {/* Tiny top badge */}
                                <div className="px-3 py-1 mb-2 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold tracking-[0.2em] text-emerald-300 uppercase shadow-sm">
                                    Sure {activeSurah.id}
                                </div>
                                <span className={`text-3xl sm:text-5xl font-extrabold font-serif tracking-wider drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] transition-all duration-500 ${isPlaying ? 'text-white' : 'text-slate-200'}`}>
                                    {activeSurah.name}
                                </span>
                                <span className="text-sm font-arabic text-emerald-300/80 mt-2 tracking-widest drop-shadow-md">
                                    {activeSurah.arabic}
                                </span>
                            </div>

                        </div>
                    </div>

                    <div className="text-center md:text-left w-full px-2 mb-8 flex flex-col items-center">
                        <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-white mb-1 tracking-wide drop-shadow-md">
                            {activeSurah.name} Suresi
                        </h2>
                        <p className="text-sm sm:text-base text-emerald-300/80 font-medium tracking-widest uppercase">
                            Mishary Rashid Alafasy
                        </p>
                    </div>

                    {/* Progress Bar & Durations */}
                    <div className="w-full max-w-[400px] px-2 mb-10 relative group">
                        <div
                            className="h-2 w-full bg-white/5 border border-white/5 rounded-full overflow-hidden relative cursor-pointer group-hover:h-3 transition-all duration-300 shadow-inner"
                            ref={progressBarRef}
                            onClick={handleProgressClick}
                        >
                            <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-100 pointer-events-none shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,0.9)] opacity-100 scale-0 group-hover:scale-100 transition-transform duration-300 pointer-events-none" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-[11px] sm:text-xs text-emerald-200/50 mt-4 font-mono font-bold tracking-widest uppercase">
                            <span className="bg-emerald-900/40 px-2 py-0.5 rounded-md border border-emerald-500/20">{formatTime(currentTime)}</span>
                            <span className="bg-white/5 px-2 py-0.5 rounded-md border border-white/5">-{formatTime(duration - currentTime)}</span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-7 sm:gap-12 w-full max-w-[400px] mb-4">
                        <button onClick={playPrev} className="text-emerald-100/40 hover:text-emerald-200 transition-all duration-300 active:scale-90 p-3 rounded-full hover:bg-emerald-500/10">
                            <svg className="w-8 h-8 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M11 5L4 12l7 7v-4h9V9h-9V5z" /></svg>
                        </button>

                        <button
                            onClick={togglePlay}
                            className={`
                                relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center 
                                transition-all duration-500 ease-out group
                                ${isPlaying
                                    ? 'scale-100 shadow-[0_10px_40px_rgba(16,185,129,0.4)]'
                                    : 'scale-95 shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:scale-100 hover:shadow-[0_10px_35px_rgba(16,185,129,0.3)]'
                                }
                            `}
                        >
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-400 to-emerald-600 opacity-90 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-px rounded-full bg-gradient-to-br from-[#10b981] to-[#047857]" />
                            <div className="absolute inset-0 rounded-full bg-black/10 mix-blend-overlay" />

                            <div className="relative z-10 text-white drop-shadow-md transition-transform duration-300 group-active:scale-90 flex items-center justify-center">
                                {isPlaying ? (
                                    <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                                ) : (
                                    <svg className="w-9 h-9 sm:w-11 sm:h-11 ml-1 translate-x-px" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                )}
                            </div>
                        </button>

                        <button onClick={playNext} className="text-emerald-100/40 hover:text-emerald-200 transition-all duration-300 active:scale-90 p-3 rounded-full hover:bg-emerald-500/10">
                            <svg className="w-8 h-8 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M13 5v4H4v6h9v4l7-7-7-7z" /></svg>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
