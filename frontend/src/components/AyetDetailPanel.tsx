import { AyetContextSection } from './AyetContextSection';

interface AyetDetailPanelProps {
    data: {
        label: string;
        text: string;
        arabic: string;
        similarityScore?: number;
        isCenter?: boolean;
        metadata?: {
            tags?: string[];
            context?: string;
            chain?: {
                next: string;
                nuance: string;
            };
        };
    } | null;
    onClose: () => void;
    onNavigate?: (sure: number, ayet: number) => void;
}

export function AyetDetailPanel({ data, onClose, onNavigate }: AyetDetailPanelProps) {
    if (!data) return null;

    const [sureStr, ayetStr] = data.label.split(':');
    const sure = parseInt(sureStr);
    const ayet = parseInt(ayetStr);

    return (
        <div className="fixed right-0 top-0 h-full w-96 bg-theme-surface shadow-2xl border-l border-theme-border/20 overflow-y-auto z-50 backdrop-blur-xl transition-all duration-300 animate-slideInRight">
            <div className="p-6">
                {/* ── Header ── */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className="text-[9px] font-black text-theme-muted uppercase tracking-[0.25em] mb-0.5">Ayet</p>
                        <h3 className="text-2xl font-bold text-theme-text font-serif">{data.label}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-theme-muted hover:text-red-500 hover:bg-red-500/10 transition-all duration-200 mt-1"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Center Ayet Badge */}
                {data.isCenter && (
                    <div className="mb-5 px-3 py-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/22 rounded-xl flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-pulse" />
                        <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Merkez Ayet</p>
                    </div>
                )}

                {/* Similarity Score */}
                {data.similarityScore !== undefined && (
                    <div className="mb-6">
                        <div className="flex justify-between items-end mb-2">
                            <p className="text-[10px] text-theme-muted uppercase tracking-wider font-semibold">Anlamsal Yakınlık</p>
                            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                %{(data.similarityScore * 100).toFixed(1)}
                            </span>
                        </div>
                        <div className="h-1.5 bg-slate-100 dark:bg-white/[0.06] rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                                style={{ width: `${data.similarityScore * 100}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Arabic Text */}
                <div className="mb-5 p-5 bg-theme-bg/40 dark:bg-white/[0.025] border border-theme-border/30 dark:border-white/[0.07] rounded-2xl">
                    <p className="text-2xl text-right leading-[2.2] text-theme-text font-arabic" dir="rtl">
                        {data.arabic}
                    </p>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-theme-border/30 mb-5" />

                {/* Turkish Meal */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2.5 opacity-50">
                        <span className="w-4 h-px bg-theme-border" />
                        <p className="text-[9px] text-theme-muted uppercase tracking-[0.28em] font-black">Meal</p>
                    </div>
                    <p className="text-[0.95rem] leading-relaxed text-theme-text/85 font-serif">
                        {data.text}
                    </p>
                </div>

                {/* Context Section */}
                <AyetContextSection sure={sure} ayet={ayet} metadata={data.metadata} onNavigate={onNavigate} />
            </div>
        </div>
    );
}
