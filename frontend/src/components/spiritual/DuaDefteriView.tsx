import { useEffect, useState } from 'react';
import { hapticFeedback } from '../../lib/constants';

interface DuaNote {
    id: string;
    text: string;
    date: string;
}

export function DuaDefteriView({ onClose }: { onClose: () => void }) {
    const [notes, setNotes] = useState<DuaNote[]>([]);
    const [isPrivate, setIsPrivate] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [newDua, setNewDua] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => requestAnimationFrame(() => setIsVisible(true)));

        const saved = localStorage.getItem('dua_defteri');
        const priv = localStorage.getItem('dua_defteri_private');
        if (saved) {
            try { setNotes(JSON.parse(saved)); } catch (e) { }
        }
        if (priv === 'true') {
            setIsPrivate(true);
            setIsLocked(true);
        }
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 500);
    };

    const togglePrivate = () => {
        hapticFeedback(20);
        const next = !isPrivate;
        setIsPrivate(next);
        setIsLocked(next);
        localStorage.setItem('dua_defteri_private', next.toString());
    };

    const addDua = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDua.trim() || isLocked) return;
        hapticFeedback(10);
        const note: DuaNote = {
            id: Date.now().toString(),
            text: newDua,
            date: new Date().toLocaleDateString('tr-TR')
        };
        const next = [note, ...notes];
        setNotes(next);
        setNewDua('');
        localStorage.setItem('dua_defteri', JSON.stringify(next));
    };

    const deleteDua = (id: string) => {
        hapticFeedback([20, 20]);
        const next = notes.filter(n => n.id !== id);
        setNotes(next);
        localStorage.setItem('dua_defteri', JSON.stringify(next));
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden p-4 sm:p-6 md:p-8">
            <div
                className={`absolute inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-md transition-opacity duration-500 ease-out z-0 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleClose}
            />

            <div className={`relative w-full max-w-3xl h-[95vh] md:h-auto md:max-h-[90vh] flex flex-col rounded-[2.5rem] overflow-hidden
                bg-slate-50/95 dark:bg-[#0c0b0f]/95 backdrop-blur-3xl
                border border-emerald-200/50 dark:border-emerald-500/20
                shadow-2xl shadow-emerald-900/20 dark:shadow-emerald-900/40 z-10
                transform transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)
                ${isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-16 scale-95 opacity-0'}
            `}>

                {/* Theme Glows */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-400/10 dark:bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-400/10 dark:bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

                {/* Header */}
                <div className="px-5 py-5 md:px-8 md:py-6 flex items-center justify-between shrink-0 relative z-20 border-b border-black/5 dark:border-white/5">
                    <div className="flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-emerald-500 to-teal-700 dark:from-emerald-600 dark:to-teal-900 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 group-hover:scale-105 transition-transform duration-300">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-emerald-50 mb-0.5">Dua Defteri</h2>
                            <p className="text-[10px] sm:text-xs font-semibold text-emerald-600/80 dark:text-emerald-400/70 uppercase tracking-widest">Kişisel Notalarınız</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={togglePrivate}
                            className={`px-4 py-2.5 rounded-xl border text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all ${isPrivate ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30 shadow-sm' : 'bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200/50 dark:border-white/10 hover:bg-slate-50 md:dark:hover:bg-white/10'}`}
                        >
                            {isPrivate ? 'Özel Mod Açık' : 'Özel Mod'}
                        </button>
                        <button onClick={() => { hapticFeedback(10); handleClose(); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar relative z-10 w-full mb-6">

                    {/* Input Area */}
                    <div className={`transition-all duration-300 ${isLocked ? 'opacity-50 pointer-events-none grayscale blur-sm' : ''}`}>
                        <form onSubmit={addDua} className="bg-white/80 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-lg backdrop-blur-md relative group flex flex-col focus-within:border-emerald-400 dark:focus-within:border-emerald-500/50 transition-colors">
                            <textarea
                                value={newDua}
                                onChange={(e) => setNewDua(e.target.value)}
                                placeholder="Rabbinize içten bir yakarış yazın..."
                                className="w-full bg-transparent border-none focus:ring-0 resize-none h-24 md:h-32 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 font-serif text-lg sm:text-xl custom-scrollbar leading-relaxed"
                            />
                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100 dark:border-white/5">
                                <span className="text-xs font-medium text-slate-400 tracking-wider">Bugün: {new Date().toLocaleDateString('tr-TR')}</span>
                                <button
                                    type="submit"
                                    disabled={!newDua.trim() || isLocked}
                                    className="px-6 py-2.5 bg-emerald-600 dark:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest disabled:opacity-50 transition-all hover:bg-emerald-700 dark:hover:bg-emerald-400 active:scale-95 shadow-md shadow-emerald-500/20"
                                >
                                    Dualara Ekle
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Locked State Overlay */}
                    {isLocked && (
                        <div className="relative z-20 mt-8">
                            <div className="bg-white/95 dark:bg-[#0c0a09]/95 border border-emerald-100 dark:border-emerald-900/50 rounded-[2rem] p-8 md:p-10 text-center shadow-2xl backdrop-blur-xl max-w-sm mx-auto">
                                <div className="w-20 h-20 mx-auto bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 border border-emerald-200 dark:border-emerald-700/50 shadow-inner">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                </div>
                                <h3 className="font-bold font-serif text-xl sm:text-2xl text-slate-900 dark:text-emerald-50 mb-3">Özel Mod Aktif</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 font-medium">Dualarınız şu anda gizlendi. Görüntülemek için kilidi açın.</p>
                                <button
                                    onClick={() => { hapticFeedback(20); setIsLocked(false); }}
                                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold uppercase tracking-widest transition-colors shadow-lg shadow-emerald-600/30 active:scale-95"
                                >
                                    Kilidi Aç
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Notes List */}
                    <div className={`space-y-4 transition-all duration-500 ${isLocked ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
                        {notes.length === 0 ? (
                            <div className="text-center py-12 text-emerald-700/60 dark:text-emerald-300/50 text-base font-medium border-2 border-dashed border-emerald-200 dark:border-white/5 rounded-2xl">
                                Henüz bir dua eklemediniz.<br /><span className="text-slate-400 text-sm mt-2 inline-block">Kalbinizden geçenleri not alarak başlayın.</span>
                            </div>
                        ) : (
                            notes.map(note => (
                                <div key={note.id} className="bg-white/80 dark:bg-black/40 border border-slate-200 dark:border-white/5 p-6 md:p-8 rounded-2xl relative group shadow-sm backdrop-blur-sm transition-all hover:bg-white dark:hover:bg-black/60 hover:shadow-xl dark:hover:border-white/10 overflow-hidden border-l-4 border-l-emerald-500">
                                    <div className="relative z-10 w-full">
                                        <p className="whitespace-pre-wrap text-slate-800 dark:text-slate-200 font-serif text-base sm:text-lg font-medium leading-relaxed">{note.text}</p>
                                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 dark:border-white/5">
                                            <span className="text-xs text-slate-400 font-bold tracking-widest uppercase">{note.date}</span>
                                            <button
                                                onClick={() => deleteDua(note.id)}
                                                className="w-10 h-10 rounded-xl flex items-center justify-center text-red-500/70 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 transition-colors active:scale-95"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
