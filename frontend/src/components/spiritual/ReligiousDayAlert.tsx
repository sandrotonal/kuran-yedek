import { useState, useEffect } from 'react';
import { ReligiousDaysService, ReligiousDay } from '../../lib/ReligiousDaysService';
import { hapticFeedback } from '../../lib/constants';
import { Moon, ChevronRight, Star } from 'lucide-react';

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
            className="w-full mb-8 group relative overflow-hidden rounded-3xl p-1 transition-all duration-500 hover:scale-[1.02]"
        >
            {/* Animated Border Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 opacity-70 group-hover:opacity-100 transition-opacity animate-gradient-xy"></div>

            {/* Inner Content Card */}
            <div className="relative h-full bg-[#0F172A] rounded-[1.3rem] p-5 flex items-center justify-between overflow-hidden">

                {/* Background Effects */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

                {/* Left Side: Icon & Text */}
                <div className="flex items-center gap-5 relative z-10">
                    {/* Icon Container with Glow */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full"></div>
                        <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center relative shadow-[0_0_15px_rgba(16,185,129,0.15)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all duration-500">
                            <Moon className="w-7 h-7 text-emerald-400 fill-emerald-400/20" />
                            <Star className="w-3 h-3 text-emerald-200 absolute top-2 right-2 animate-pulse" />
                        </div>
                    </div>

                    <div className="text-left">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                                BUGÜN
                            </span>
                        </div>
                        <h3 className="text-xl font-bold font-serif text-slate-100 tracking-wide leading-tight group-hover:text-white transition-colors">
                            {todayEvent.name}
                        </h3>
                    </div>
                </div>

                {/* Right Side: Action */}
                <div className="relative z-10 pl-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:border-emerald-500 group-hover:text-white transition-all duration-300 shadow-lg">
                        <ChevronRight className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </button>
    );
}
