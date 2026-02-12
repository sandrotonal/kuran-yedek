import { useState, useEffect } from 'react';
import { SURAHS, hapticFeedback } from '../lib/constants';

interface MenuDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (sure: number, ayet: number) => void;
    onOpenQibla: () => void;
    onOpenEsmaulHusna: () => void;
    onOpenEsmaulHusna: () => void;
    onOpenMosqueFinder: () => void;
    onOpenPrayerDebt: () => void;
}

type TabType = 'surah' | 'juz' | 'favorites' | 'discover';

// Placeholder Juz Data (To be filled accurately later or by another service)
const JUZ_LIST = Array.from({ length: 30 }, (_, i) => ({ id: i + 1, label: `${i + 1}. Cüz` }));

export function MenuDrawer({ isOpen, onClose, onNavigate, onOpenQibla, onOpenEsmaulHusna, onOpenMosqueFinder, onOpenPrayerDebt }: MenuDrawerProps) {
    const [activeTab, setActiveTab] = useState<TabType>('surah');
    const [searchTerm, setSearchTerm] = useState('');
    const [favorites, setFavorites] = useState<{ sure: number, ayet: number, date: number }[]>([]);

    // Load favorites on open
    useEffect(() => {
        if (isOpen && activeTab === 'favorites') {
            try {
                const stored = localStorage.getItem('favorites');
                if (stored) {
                    setFavorites(JSON.parse(stored));
                }
            } catch (e) {
                console.error("Failed to load favorites", e);
            }
        }
    }, [isOpen, activeTab]);

    // Turkish-aware toLowerCase
    const turkishLower = (text: string) => text.replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase();

    // Filter Logic
    const filteredSurahs = SURAHS.filter((s) => {
        if (!searchTerm) return true;
        const search = turkishLower(searchTerm.trim());
        return (
            turkishLower(s.turkish).includes(search) ||
            s.id.toString() === search ||
            s.arabic.includes(searchTerm)
        );
    });

    const handleNavigate = (sure: number, ayet: number) => {
        hapticFeedback(10);
        onNavigate(sure, ayet);
        onClose();
    };

    // Two-stage animation state
    const [render, setRender] = useState(isOpen);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setRender(true);
            // Double RAF ensures the browser has painted the "hidden" state
            // before we toggle the class to trigger the transition.
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsVisible(true);
                });
            });
        } else {
            setIsVisible(false);
            const timer = setTimeout(() => {
                setRender(false);
            }, 500); // Match CSS duration
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!render) return null;

    return (
        <>
            {/* Backdrop with Fade In/Out */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-500 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            {/* Drawer with Smooth Slide In/Out */}
            <div
                className={`
                    fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-theme-surface border-r border-theme-border shadow-2xl z-50 
                    transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform
                    overflow-hidden flex flex-col
                    ${isVisible ? 'translate-x-0' : '-translate-x-full'}
                `}
            >

                {/* Header Section */}
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 dark:from-emerald-900 dark:to-teal-900 p-6 shadow-lg z-10 shrink-0">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white font-serif tracking-wide">Kur'an Rehberi</h2>
                        <button onClick={onClose} className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    {/* Search Bar - Only show on relevant tabs */}
                    {activeTab !== 'discover' && (
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Sure ara (ör: Yasin)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 backdrop-blur-md transition-all"
                            />
                            <svg className="w-5 h-5 text-white/60 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex p-2 gap-2 bg-theme-surface border-b border-theme-border shadow-sm shrink-0 overflow-x-auto no-scrollbar">
                    {[
                        { id: 'surah', label: 'Sureler' },
                        { id: 'juz', label: 'Cüzler' },
                        { id: 'favorites', label: 'Favoriler' },
                        { id: 'discover', label: 'Keşfet' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id as TabType);
                                hapticFeedback(5);
                            }}
                            className={`
                                flex-1 py-2.5 px-3 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden
                                ${activeTab === tab.id
                                    ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 shadow-inner'
                                    : 'text-theme-muted hover:bg-theme-bg'
                                }
                            `}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full mb-1"></div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 custom-scrollbar bg-theme-bg">

                    {/* SURAHS TAB */}
                    {activeTab === 'surah' && (
                        <div className="space-y-2.5 pb-20">
                            {filteredSurahs.length === 0 ? (
                                <div className="text-center py-10 opacity-60">
                                    <p>Sonuç bulunamadı</p>
                                </div>
                            ) : (
                                filteredSurahs.map((surah) => (
                                    <button
                                        key={surah.id}
                                        onClick={() => handleNavigate(surah.id, 1)}
                                        className="w-full group relative flex items-center justify-between p-4 bg-theme-surface hover:bg-white dark:hover:bg-slate-700 border border-theme-border hover:border-emerald-500/30 rounded-2xl transition-all duration-300 active:scale-[0.98] shadow-sm hover:shadow"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-theme-bg flex items-center justify-center text-sm font-bold text-theme-muted group-hover:text-emerald-600 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 transition-colors">
                                                {surah.id}
                                            </div>
                                            <div className="text-left">
                                                <h3 className="text-base font-bold text-theme-text group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                    {surah.turkish}
                                                </h3>
                                                <p className="text-xs text-theme-muted">
                                                    {surah.ayetCount} Ayet
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-xl font-arabic text-theme-muted/50 group-hover:text-emerald-600/50 transition-colors">
                                            {surah.arabic}
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    )}

                    {/* JUZ TAB */}
                    {activeTab === 'juz' && (
                        <div className="grid grid-cols-3 gap-3 pb-20">
                            {JUZ_LIST.map((juz) => (
                                <button
                                    key={juz.id}
                                    onClick={() => {
                                        // Cüz Başlangıç Sureleri (Yaklaşık - Sure bazlı navigasyon için)
                                        // Tam liste: 1->1, 2->2:142, 3->2:253... fakat şu an sadece SURE'ye atıyoruz.
                                        // Kullanıcı en azından doğru sureye gitsin.
                                        const JUZ_SURAH_MAP: Record<number, number> = {
                                            1: 1, 2: 2, 3: 2, 4: 3, 5: 4, 6: 4, 7: 5, 8: 6, 9: 7, 10: 8,
                                            11: 9, 12: 11, 13: 12, 14: 15, 15: 17, 16: 18, 17: 21, 18: 23, 19: 25, 20: 27,
                                            21: 29, 22: 33, 23: 36, 24: 39, 25: 41, 26: 46, 27: 51, 28: 58, 29: 67, 30: 78
                                        };
                                        const targetSure = JUZ_SURAH_MAP[juz.id] || 1;
                                        handleNavigate(targetSure, 1);
                                    }}
                                    className="aspect-square flex flex-col items-center justify-center bg-theme-surface hover:bg-emerald-50 dark:hover:bg-emerald-900/10 border border-theme-border hover:border-emerald-500/30 rounded-2xl transition-all active:scale-95 group"
                                >
                                    <span className="text-sm font-medium text-theme-muted group-hover:text-emerald-600 uppercase tracking-wider mb-1">Cüz</span>
                                    <span className="text-2xl font-bold text-theme-text group-hover:text-emerald-600 font-serif">{juz.id}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* FAVORITES TAB */}
                    {activeTab === 'favorites' && (
                        <div className="space-y-3 pb-20">
                            {favorites.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                                    <div className="w-16 h-16 bg-theme-surface rounded-full flex items-center justify-center mb-4 text-theme-muted">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-theme-text mb-2">Favori Listeniz Boş</h3>
                                    <p className="text-sm text-theme-muted">Ayetleri okurken kalp ikonuna tıklayarak buraya ekleyebilirsiniz.</p>
                                </div>
                            ) : (
                                favorites.map((fav, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleNavigate(fav.sure, fav.ayet)}
                                        className="w-full text-left p-4 bg-theme-surface border border-theme-border rounded-xl hover:border-amber-400/50 transition-all group"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold rounded uppercase tracking-wider">
                                                Favori
                                            </span>
                                            <span className="text-xs text-theme-muted">
                                                {new Date(fav.date).toLocaleDateString('tr-TR')}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-theme-text group-hover:text-amber-500 transition-colors">
                                            {SURAHS.find(s => s.id === fav.sure)?.turkish} Suresi, {fav.ayet}. Ayet
                                        </h4>
                                    </button>
                                ))
                            )}
                        </div>
                    )}

                    {/* DISCOVER TAB */}
                    {activeTab === 'discover' && (
                        <div className="grid grid-cols-1 gap-4 pb-20 p-2">
                            {/* Features Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Mosque Finder Button */}
                                <button
                                    onClick={() => {
                                        hapticFeedback(10);
                                        onOpenMosqueFinder();
                                    }}
                                    className="group relative overflow-hidden p-5 rounded-2xl bg-theme-surface border border-theme-border hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-left flex flex-col items-start"
                                >
                                    <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-10 transition-opacity transform group-hover:rotate-12 duration-500">
                                        <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" /></svg>
                                    </div>

                                    <div className="w-12 h-12 mb-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </div>
                                    <span className="font-bold text-lg text-theme-text group-hover:text-emerald-600 transition-colors">Yakın Camiler</span>
                                    <span className="text-xs text-theme-muted mt-1 leading-relaxed">Çevrendeki ibadethaneleri bul</span>
                                </button>

                                {/* Qibla Finder Button */}
                                <button
                                    onClick={() => {
                                        hapticFeedback(10);
                                        onOpenQibla();
                                    }}
                                    className="group relative overflow-hidden p-5 rounded-2xl bg-theme-surface border border-theme-border hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-left flex flex-col items-start"
                                >
                                    <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-10 transition-opacity transform group-hover:rotate-45 duration-500">
                                        <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L22 22L12 18L2 22L12 2Z" /></svg>
                                    </div>

                                    <div className="w-12 h-12 mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 shadow-sm">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                    </div>
                                    <span className="font-bold text-lg text-theme-text group-hover:text-blue-600 transition-colors">Kıble Bulucu</span>
                                    <span className="text-xs text-theme-muted mt-1 leading-relaxed">Pusula ile yönünü tayin et</span>
                                </button>
                            </div>

                            {/* Esmaül Hüsna Button (Full Width) */}
                            <button
                                onClick={() => {
                                    hapticFeedback(10);
                                    onOpenEsmaulHusna();
                                }}
                                className="group relative overflow-hidden p-5 rounded-2xl bg-theme-surface border border-theme-border hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-left flex items-center gap-5"
                            >
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.03] group-hover:opacity-10 transition-opacity transform scale-150">
                                    <span className="font-arabic text-9xl">الله</span>
                                </div>

                                <div className="w-16 h-16 shrink-0 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-all duration-300 shadow-sm">
                                    <span className="font-arabic text-3xl pb-2">الله</span>
                                </div>

                                <div>
                                    <span className="font-bold text-xl text-theme-text group-hover:text-amber-600 transition-colors block">Esmaül Hüsna</span>
                                    <span className="text-sm text-theme-muted mt-1 block">Allah'ın 99 güzel ismini ve manalarını keşfet</span>
                                </div>
                            </button>

                            {/* Kaza Takip Button (Full Width) */}
                            <button
                                onClick={() => {
                                    hapticFeedback(10);
                                    onOpenPrayerDebt();
                                }}
                                className="group relative overflow-hidden p-5 rounded-2xl bg-theme-surface border border-theme-border hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-left flex items-center gap-5"
                            >
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.03] group-hover:opacity-10 transition-opacity transform scale-150 rotate-12">
                                    <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" /></svg>
                                </div>

                                <div className="w-16 h-16 shrink-0 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-all duration-300 shadow-sm">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                                </div>

                                <div>
                                    <span className="font-bold text-xl text-theme-text group-hover:text-indigo-600 transition-colors block">Kaza Takip</span>
                                    <span className="text-sm text-theme-muted mt-1 block">Kılınmayan namazlarınızı kaydedin ve takip edin</span>
                                </div>
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}
