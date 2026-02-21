import { PrivateNoteWidget } from './PrivateNoteWidget';
import { DeepContentService } from '../lib/deepContentService';
import { DeepQuestion } from './deep/DeepQuestion';
import { ConceptChips } from './deep/ConceptChips';
import { ToneIndicator } from './deep/ToneIndicator';

interface AyetContextSectionProps {
    sure: number;
    ayet: number;
    metadata?: any;
    onNavigate?: (sure: number, ayet: number) => void;
}

export function AyetContextSection({ sure, ayet, metadata, onNavigate }: AyetContextSectionProps) {
    const deepInfo = DeepContentService.getDeepInfo(sure, ayet, metadata);
    const activeChain = deepInfo?.chain;

    const handleChainClick = () => {
        if (activeChain?.next && onNavigate) {
            const [nextSure, nextAyet] = activeChain.next.split(':').map(Number);
            onNavigate(nextSure, nextAyet);
        }
    };

    return (
        <div className="mt-8 space-y-8 animate-fadeIn">

            {/* 1️⃣ Deep Content Zone */}
            {deepInfo && (
                <div>
                    {deepInfo.tone && (
                        <div className="flex justify-center mb-4">
                            <ToneIndicator tone={deepInfo.tone} />
                        </div>
                    )}
                    {deepInfo.question && <DeepQuestion question={deepInfo.question} />}
                    {deepInfo.concepts && deepInfo.concepts.length > 0 && (
                        <ConceptChips concepts={deepInfo.concepts} />
                    )}
                    {deepInfo.modernContext && (
                        <div className="mt-6 text-center">
                            <p className="text-sm font-serif text-theme-text/80 italic leading-relaxed border-l-2 border-theme-border/50 pl-4 inline-block text-left">
                                "{deepInfo.modernContext}"
                            </p>
                        </div>
                    )}
                    {(deepInfo.question || deepInfo.modernContext || (deepInfo.concepts && deepInfo.concepts.length > 0)) && (
                        <div className="w-16 h-px bg-theme-border/30 mx-auto mt-8" />
                    )}
                </div>
            )}

            {/* 2️⃣ Derinlik & Notlar label + Private Notes */}
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <span className="w-4 h-px bg-theme-border" />
                    <span className="text-[9px] font-black text-theme-muted uppercase tracking-[0.28em]">Derinlik &amp; Notlar</span>
                </div>
                <PrivateNoteWidget sure={sure} ayet={ayet} />
            </div>

            {/* 3️⃣ Zincirleme Okuma */}
            {activeChain && (
                <div>
                    <button
                        onClick={handleChainClick}
                        className="w-full group text-left relative overflow-hidden rounded-2xl p-4 transition-all duration-300 active:scale-[0.98]
                            bg-indigo-50 dark:bg-indigo-500/[0.07]
                            border border-indigo-200 dark:border-indigo-500/20
                            hover:border-indigo-400 dark:hover:border-indigo-500/40"
                    >
                        {/* Shimmer */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/[0.05] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

                        <div className="flex items-center gap-3.5 relative z-10">
                            {/* Icon */}
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110
                                bg-indigo-100 dark:bg-indigo-500/14
                                border border-indigo-200 dark:border-indigo-500/25">
                                <svg className="w-5 h-5 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-500 dark:text-indigo-400">
                                        Zincirleme Okuma
                                    </span>
                                    <span className="text-[10px] text-indigo-400 dark:text-indigo-400/60 font-mono px-1.5 py-0.5 rounded-md
                                        bg-indigo-100 dark:bg-indigo-500/12
                                        border border-indigo-200 dark:border-indigo-500/20">
                                        {activeChain.next}
                                    </span>
                                </div>
                                <p className="text-[0.85rem] font-medium text-slate-600 dark:text-white/55 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors duration-200 line-clamp-1">
                                    {activeChain.nuance}
                                </p>
                            </div>

                            <svg className="w-4 h-4 text-indigo-400/50 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 -translate-x-1 group-hover:translate-x-0 transition-all duration-300 shrink-0"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
}
