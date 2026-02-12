import { useState, useEffect } from 'react';
import { PrayerDebt, PrayerDebtService, PrayerType } from '../../lib/PrayerDebtService';
import { Minus, Plus, Calendar, Save, Trash2 } from 'lucide-react';

interface PrayerDebtTrackerProps {
    onClose: () => void;
}

export function PrayerDebtTracker({ onClose }: PrayerDebtTrackerProps) {
    const [debts, setDebts] = useState<PrayerDebt[]>([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [bulkYears, setBulkYears] = useState<string>('');

    useEffect(() => {
        loadDebts();
        // Listen for updates from other instances
        window.addEventListener('prayer-debt-update', loadDebts);
        return () => window.removeEventListener('prayer-debt-update', loadDebts);
    }, []);

    const loadDebts = () => {
        setDebts(PrayerDebtService.getDebts());
        setLoading(false);
    };

    const handleUpdate = (type: PrayerType, delta: number) => {
        const newDebts = PrayerDebtService.updateDebt(type, delta);
        setDebts(newDebts);
        if (navigator.vibrate) navigator.vibrate(10);
    };

    const handleBulkAdd = () => {
        const years = parseFloat(bulkYears);
        if (years > 0) {
            if (confirm(`${years} yıllık kaza namazı eklenecek. Onaylıyor musunuz?`)) {
                const newDebts = PrayerDebtService.addYearlyDebt(years);
                setDebts(newDebts);
                setBulkYears('');
                setEditMode(false);
            }
        }
    };

    const getTotalDebt = () => debts.reduce((acc, curr) => acc + curr.count, 0);

    return (
        <div className="fixed inset-0 z-[60] bg-theme-bg flex flex-col animate-fadeIn overflow-hidden font-sans">
            {/* Header */}
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
                            Kaza Takip
                        </h2>
                        <p className="text-xs text-theme-muted">Borç namazlarınızı kaydedin</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setEditMode(!editMode)}
                        className={`p-2 rounded-lg transition-colors ${editMode ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'text-theme-muted hover:bg-theme-surface'}`}
                    >
                        <Calendar className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">

                {/* Summary Card */}
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white mb-6 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" /></svg>
                    </div>
                    <div className="relative z-10">
                        <p className="text-emerald-100 text-sm font-medium mb-1">Toplam Kaza Borcu</p>
                        <h3 className="text-4xl font-bold font-mono tracking-tight">
                            {getTotalDebt().toLocaleString()} <span className="text-lg font-sans font-normal opacity-80">Vakit</span>
                        </h3>
                        {getTotalDebt() === 0 ? (
                            <p className="mt-4 text-emerald-100 bg-emerald-800/30 inline-block px-3 py-1 rounded-lg text-sm">
                                🎉 Elhamdülillah, borcunuz yok!
                            </p>
                        ) : (
                            <p className="mt-4 text-emerald-100 text-sm opacity-90 max-w-xs leading-relaxed">
                                "Borcu olan kimse, onu ödemeye niyet ederse, Allah ona yardım eder."
                            </p>
                        )}
                    </div>
                </div>

                {/* Bulk Add Section (Hidden by default) */}
                {editMode && (
                    <div className="bg-theme-surface border border-theme-border rounded-xl p-4 mb-6 animate-slideUp">
                        <h4 className="font-bold text-theme-text mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Toplu Yıl Ekleme
                        </h4>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="Yıl (Ör: 1.5)"
                                value={bulkYears}
                                onChange={(e) => setBulkYears(e.target.value)}
                                className="flex-1 px-4 py-2 bg-theme-bg border border-theme-border rounded-lg text-theme-text focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                            />
                            <button
                                onClick={handleBulkAdd}
                                className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Ekle
                            </button>
                        </div>
                        <p className="text-xs text-theme-muted mt-2">
                            Hesaplama: Girilen yıl × 365 gün × 6 vakit
                        </p>
                    </div>
                )}

                {/* Debts Grid */}
                <div className="grid grid-cols-2 gap-4 pb-20">
                    {debts.map((debt) => (
                        <div key={debt.type} className="bg-theme-surface border border-theme-border rounded-2xl p-4 shadow-sm hover:border-emerald-500/30 transition-all group">
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="font-bold text-theme-text capitalize">{PrayerDebtService.getLabel(debt.type)}</h4>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${debt.count > 0
                                        ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                                        : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                                    }`}>
                                    {debt.count > 0 ? '!' : '✓'}
                                </div>
                            </div>

                            <div className="text-2xl font-mono font-bold text-theme-text mb-4">
                                {debt.count.toLocaleString()}
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleUpdate(debt.type, -1)}
                                    disabled={debt.count <= 0}
                                    className="flex-1 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold hover:bg-emerald-200 dark:hover:bg-emerald-800/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleUpdate(debt.type, 1)}
                                    className="flex-1 h-10 rounded-lg bg-theme-bg border border-theme-border text-theme-text hover:bg-theme-border/50 transition-colors flex items-center justify-center"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
