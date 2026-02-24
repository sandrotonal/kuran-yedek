import { useState, useEffect } from 'react';
import { hapticFeedback, SURAHS } from '../lib/constants';
import { useAudio } from '../hooks/useAudio';
import { CircularProgress } from './CircularProgress';

interface AyetCardProps {
    sure: number;
    ayet: number;
    arabicText: string;
    turkishText: string;
    similarityScore?: number;
    isMain?: boolean;
    onClick?: () => void;
}

export function AyetCard({
    sure,
    ayet,
    arabicText,
    turkishText,
    similarityScore,
    isMain = false,
    onClick,
}: AyetCardProps) {
    const [isExpanded, setIsExpanded] = useState(isMain);
    const { isPlaying, isLoading, togglePlay, segments, activeWordIndex } = useAudio(sure, ayet);

    useEffect(() => {
        if (isPlaying && !isExpanded) setIsExpanded(true);
    }, [isPlaying]);

    const handleClick = () => {
        hapticFeedback(10);
        setIsExpanded(!isExpanded);
        onClick?.();
    };

    const handlePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        hapticFeedback(20);
        togglePlay();
    };

    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        try {
            const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
            setIsFavorite(favs.some((f: any) => f.sure === sure && f.ayet === ayet));
        } catch (e) { console.error(e); }
    }, [sure, ayet]);

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        hapticFeedback(15);
        try {
            const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
            const newFavs = isFavorite
                ? favs.filter((f: any) => !(f.sure === sure && f.ayet === ayet))
                : [...favs, { sure, ayet, date: Date.now() }];
            localStorage.setItem('favorites', JSON.stringify(newFavs));
            setIsFavorite(!isFavorite);
        } catch (e) { console.error('Fav toggle error', e); }
    };

    const renderKaraokeText = () => {
        if (!segments || segments.length === 0) return arabicText;
        return (
            <div className="flex flex-wrap gap-3 leading-[2.8] relative z-20">
                {segments.map((segment: any, index: number) => {
                    const isActive = index === activeWordIndex;
                    return (
                        <span key={index} className={`
                            transition-all duration-300 cursor-pointer rounded px-1.5
                            ${isActive
                                ? 'text-emerald-600 dark:text-emerald-400 scale-110 font-bold drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                                : 'text-theme-text hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors'
                            }
                        `}>{segment.text}</span>
                    );
                })}
            </div>
        );
    };

    /* ── Main Card Style (golden border, dark/light aware) ── */
    const mainCardClass = `
        bg-white dark:bg-[#0a1524]
        border-[1.5px] border-amber-300/50 dark:border-amber-400/25
        shadow-[0_4px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_50px_rgba(0,0,0,0.50)]
        mb-10 scale-[1.01]
    `;

    /* ── List Card Style ── */
    const listCardClass = `
        bg-white/70 dark:bg-white/[0.028]
        border border-slate-200/80 dark:border-white/[0.06]
        shadow-sm dark:shadow-[0_2px_12px_rgba(0,0,0,0.18)]
        hover:border-emerald-300 dark:hover:border-emerald-500/30
        hover:shadow-md dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.25)]
        mb-3
        group
    `;

    return (
        <div
            onClick={handleClick}
            className={`
                rounded-[2rem] cursor-pointer
                transition-all duration-500 ease-out relative overflow-hidden
                ${isMain ? mainCardClass : listCardClass}
            `}
            style={{ padding: isMain ? '28px' : '18px 22px' }}
        >
            {/* Connector line above — list view */}
            {!isMain && (
                <div className="absolute -top-3 left-10 w-px h-4 bg-gradient-to-b from-emerald-500/20 to-transparent" />
            )}

            {/* Subtle top-left warmth — main only */}
            {isMain && (
                <div className="pointer-events-none absolute top-0 left-0 w-56 h-56 -translate-x-14 -translate-y-14 rounded-full opacity-60"
                    style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 65%)' }} />
            )}

            {/* ── Header: verse badge + actions ── */}
            <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-3">
                    {/* Verse number badge */}
                    <span className={`
                        flex items-center justify-center w-9 h-9 rounded-full font-serif text-[0.95rem] font-bold shrink-0 transition-all duration-300
                        ${isMain
                            ? 'bg-amber-100 dark:bg-amber-400/12 text-amber-700 dark:text-amber-300 ring-1 ring-amber-300 dark:ring-amber-400/35'
                            : 'bg-slate-100 dark:bg-white/[0.055] text-slate-500 dark:text-white/40 ring-1 ring-slate-200 dark:ring-white/[0.08]'
                        }
                    `}>
                        {ayet}
                    </span>

                    {!isMain && (
                        <span className="text-[10px] font-black text-slate-400 dark:text-white/32 uppercase tracking-[0.22em]">
                            {SURAHS[sure - 1]?.turkish || `${sure}. Sure`}
                        </span>
                    )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                    {/* Favorite */}
                    <button
                        onClick={handleToggleFavorite}
                        className={`
                            w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90
                            ${isFavorite
                                ? 'text-rose-500 bg-rose-100 dark:bg-rose-500/15 ring-1 ring-rose-300 dark:ring-rose-500/30'
                                : 'text-slate-300 dark:text-white/22 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10'
                            }
                        `}
                        aria-label="Favorilere Ekle"
                    >
                        <svg className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>

                    {/* Audio */}
                    <button
                        onClick={handlePlay}
                        disabled={isLoading}
                        className={`
                            w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90
                            ${isPlaying
                                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/15 ring-1 ring-emerald-300 dark:ring-emerald-500/30'
                                : 'text-slate-300 dark:text-white/22 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
                            }
                        `}
                        aria-label={isPlaying ? "Durdur" : "Dinle"}
                    >
                        {isLoading ? (
                            <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : isPlaying ? (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                        ) : (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        )}
                    </button>

                    {/* Similarity */}
                    {similarityScore !== undefined && !isMain && (
                        <div className="relative group/score">
                            <CircularProgress size={34} strokeWidth={3} percentage={similarityScore * 100} color="emerald" />
                            <span className="absolute -bottom-6 right-0 text-[9px] font-medium text-theme-muted opacity-0 group-hover/score:opacity-100 transition-opacity whitespace-nowrap">
                                Benzerlik
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Arabic Text ── */}
            <div
                className={`
                    text-right font-arabic leading-[2.4] tracking-wide
                    ${isExpanded ? 'text-4xl md:text-5xl mb-7' : 'text-3xl md:text-4xl mb-4'}
                    text-theme-text
                    transition-all duration-500 ease-out relative z-10 py-1
                `}
                dir="rtl"
            >
                {(isPlaying || segments.length > 0) ? renderKaraokeText() : (
                    isExpanded ? arabicText : `${arabicText.substring(0, 120)}${arabicText.length > 120 ? '...' : ''}`
                )}
            </div>

            {/* Gentle divider */}
            <div className={`w-full h-px mb-4 ${isMain ? 'bg-amber-200/60 dark:bg-amber-400/15' : 'bg-slate-100 dark:bg-white/[0.06]'}`} />

            {/* ── Turkish Text ── */}
            <div className={`
                font-serif leading-relaxed
                ${isMain ? 'text-theme-text text-[1.0rem]' : 'text-theme-muted text-[0.9rem]'}
                ${isExpanded ? 'font-normal' : 'line-clamp-2'}
                transition-all duration-500
            `}>
                {turkishText}
            </div>

            {/* Expand / Collapse indicator — list cards only */}
            {!isMain && (
                <div className={`mt-3 flex justify-center transition-all duration-300
                    ${isExpanded ? 'opacity-30' : 'opacity-0 group-hover:opacity-25'}`}>
                    <svg className="w-3.5 h-3.5 text-theme-muted transition-transform duration-300"
                        style={{ transform: isExpanded ? 'rotate(180deg)' : 'none' }}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            )}
        </div>
    );
}
