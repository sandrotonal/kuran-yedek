import { useState, useEffect } from 'react';
import { ReligiousDaysService, ReligiousDay } from '../../lib/ReligiousDaysService';
import { hapticFeedback } from '../../lib/constants';

interface ReligiousDayAlertProps {
    onClick: () => void;
}

export function ReligiousDayAlert({ onClick }: ReligiousDayAlertProps) {
    const [todayEvent, setTodayEvent] = useState<ReligiousDay | null>(null);

    useEffect(() => {
        const event = ReligiousDaysService.getTodayEvent();
        if (event) {
            setTodayEvent(event);
        }
    }, []);

    if (!todayEvent) return null;

    return (
        <button
            onClick={() => {
                hapticFeedback(10);
                onClick();
            }}
            className="w-full mb-6 relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20 p-4 flex items-center justify-between group animate-in slide-in-from-top-4 duration-500"
        >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
            <div className="absolute -right-10 -top-10 bg-white/10 w-32 h-32 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

            <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shrink-0">
                    <span className="text-2xl">🌙</span>
                </div>
                <div className="text-left">
                    <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider mb-0.5">Bugün</p>
                    <h3 className="text-xl font-bold font-serif leading-tight">{todayEvent.name}</h3>
                </div>
            </div>

            <div className="relative z-10 flex items-center gap-2 pr-2">
                <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">Detaylar</span>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
        </button>
    );
}
