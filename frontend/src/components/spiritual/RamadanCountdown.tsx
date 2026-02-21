import { useState, useEffect, useCallback } from 'react';
import { PrayerTimesService } from '../../lib/PrayerTimesService';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';

/* ─── DATES ─── */
const RAMADAN_START = new Date('2026-03-01T00:00:00');
const RAMADAN_END = new Date('2026-03-31T00:00:00');

/* ─── HELPERS ─── */
interface TimeLeft { days: number; hours: number; minutes: number; seconds: number; }

function getTimeLeft(target: Date): TimeLeft {
    const diff = Math.max(0, target.getTime() - Date.now());
    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
}
function getRamadanDay() { return Math.min(30, Math.max(1, Math.floor((Date.now() - RAMADAN_START.getTime()) / 86400000) + 1)); }
function isRamadanActive() { const n = Date.now(); return n >= RAMADAN_START.getTime() && n < RAMADAN_END.getTime(); }
function isRamadanOver() { return Date.now() >= RAMADAN_END.getTime(); }

async function getRamadanTimes(): Promise<{ imsak: string; iftar: string }> {
    const loc = await PrayerTimesService.getUserLocation();
    const pt = new PrayerTimes(new Coordinates(loc.lat, loc.lng), new Date(), CalculationMethod.Turkey());
    const fmt = (d: Date) => d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    return { imsak: fmt(pt.fajr), iftar: fmt(pt.maghrib) };
}

const SK = (k: string) => `ramadan_notif_${k}`;

/* ─── CRESCENT MOON ─── */
function CrescentMoon({ dark }: { dark: boolean }) {
    return (
        <svg viewBox="0 0 64 64" fill="none" className="w-9 h-9 shrink-0 drop-shadow-lg">
            <defs>
                <radialGradient id="mgrd" cx="40%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.97)" />
                    <stop offset="100%" stopColor="rgba(52,211,153,0.90)" />
                </radialGradient>
            </defs>
            <circle cx="32" cy="32" r="22" fill="url(#mgrd)" />
            <circle cx="42" cy="28" r="18" fill={dark ? '#0d2b1a' : '#052e16'} />
            <polygon points="50,14 51.5,18.5 56,18.5 52.5,21.5 53.8,26 50,23.5 46.2,26 47.5,21.5 44,18.5 48.5,18.5"
                fill="rgba(255,255,255,0.93)" />
        </svg>
    );
}

/* ─── BELL ICON ─── */
function BellIcon({ active }: { active: boolean }) {
    return (
        <svg className="w-4 h-4" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
    );
}

/* ─── COUNT TILE ─── */
function CountTile({ value, label, dark }: { value: number; label: string; dark: boolean }) {
    return (
        <div className="flex-1 flex flex-col items-center gap-1.5">
            <div className={`relative overflow-hidden w-full py-3 rounded-2xl text-center border
                ${dark
                    ? 'bg-white/[0.08] border-white/[0.13] shadow-inner'
                    : 'bg-white border-emerald-100 shadow-md shadow-emerald-100'
                }`}>
                <div className={`absolute inset-0 pointer-events-none bg-gradient-to-b
                    ${dark ? 'from-white/[0.06] to-transparent' : 'from-emerald-50 to-transparent'}`} />
                <span className={`relative z-10 text-[2rem] sm:text-[2.4rem] font-bold font-mono leading-none tabular-nums
                    ${dark ? 'text-white' : 'text-emerald-700'}`}>
                    {String(value).padStart(2, '0')}
                </span>
            </div>
            <span className={`text-[9px] font-black uppercase tracking-[0.22em]
                ${dark ? 'text-emerald-300/70' : 'text-emerald-600/60'}`}>
                {label}
            </span>
        </div>
    );
}

function Separator({ dark }: { dark: boolean }) {
    return (
        <div className="flex flex-col items-center gap-1.5 pb-6 mt-1">
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${dark ? 'bg-white/30' : 'bg-emerald-400/50'}`} />
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${dark ? 'bg-white/30' : 'bg-emerald-400/50'}`}
                style={{ animationDelay: '0.35s' }} />
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════════ */
export function RamadanCountdown() {
    const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft(RAMADAN_START));
    const [ramadanActive, setActive] = useState(isRamadanActive());
    const [ramadanDay, setDay] = useState(getRamadanDay());
    const [permission, setPerm] = useState<NotificationPermission>(Notification.permission);
    const [iftarNotif, setIftar] = useState(() => localStorage.getItem(SK('iftar')) === '1');
    const [sahurNotif, setSahur] = useState(() => localStorage.getItem(SK('sahur')) === '1');
    const [ramadanTimes, setTimes] = useState<{ imsak: string; iftar: string } | null>(null);
    const [notifMsg, setNotifMsg] = useState<string | null>(null);

    /* observe class changes for theme */
    useEffect(() => {
        const obs = new MutationObserver(() => setDark(document.documentElement.classList.contains('dark')));
        obs.observe(document.documentElement, { attributeFilter: ['class'] });
        return () => obs.disconnect();
    }, []);

    /* fetch prayer times once Ramadan is active */
    useEffect(() => { if (ramadanActive) getRamadanTimes().then(setTimes).catch(console.error); }, [ramadanActive]);

    /* live tick */
    useEffect(() => {
        const id = setInterval(() => {
            const a = isRamadanActive();
            setActive(a);
            if (!a && !isRamadanOver()) setTimeLeft(getTimeLeft(RAMADAN_START));
            if (a) setDay(getRamadanDay());
        }, 1000);
        return () => clearInterval(id);
    }, []);

    /* notification checker */
    useEffect(() => {
        if (!ramadanTimes || permission !== 'granted') return;
        const check = () => {
            const now = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
            if (iftarNotif && now === ramadanTimes.iftar)
                PrayerTimesService.sendNotification('🌙 İftar Vakti!', 'Hayırlı iftarlar! Orucunuz kabul olsun.');
            if (sahurNotif) {
                const [h, m] = ramadanTimes.imsak.split(':').map(Number);
                const warn = `${String(h).padStart(2, '0')}:${String(m < 30 ? m + 30 : m - 30).padStart(2, '0')}`;
                if (now === warn)
                    PrayerTimesService.sendNotification('⏰ Sahur Hatırlatması', `İmsak (${ramadanTimes.imsak}) yaklaşıyor! Son yemeğinizi yiyin.`);
                if (now === ramadanTimes.imsak)
                    PrayerTimesService.sendNotification('🌅 İmsak Vakti!', 'Oruç başladı. Hayırlı olsun.');
            }
        };
        const id = setInterval(check, 60000);
        return () => clearInterval(id);
    }, [ramadanTimes, iftarNotif, sahurNotif, permission]);

    const showMsg = useCallback((msg: string) => {
        setNotifMsg(msg); setTimeout(() => setNotifMsg(null), 3000);
    }, []);

    const toggle = useCallback(async (type: 'iftar' | 'sahur') => {
        let p = permission;
        if (p === 'default') {
            p = (await PrayerTimesService.requestNotificationPermission()) ? 'granted' : 'denied';
            setPerm(p);
        }
        if (p === 'denied') { showMsg('Tarayıcıdan bildirim izni vermeniz gerekiyor.'); return; }
        if (type === 'iftar') {
            const next = !iftarNotif; setIftar(next); localStorage.setItem(SK('iftar'), next ? '1' : '0');
            showMsg(next ? '✅ İftar bildirimi açıldı' : '🔕 İftar bildirimi kapatıldı');
            if (next) PrayerTimesService.sendNotification('İftar Bildirimi Açık', `${ramadanTimes?.iftar ?? '...'} vakti haberdar edeceğiz.`);
        } else {
            const next = !sahurNotif; setSahur(next); localStorage.setItem(SK('sahur'), next ? '1' : '0');
            showMsg(next ? '✅ Sahur bildirimi açıldı' : '🔕 Sahur bildirimi kapatıldı');
            if (next) PrayerTimesService.sendNotification('Sahur Bildirimi Açık', 'İmsaktan 30 dk önce haberdar edeceğiz.');
        }
    }, [iftarNotif, sahurNotif, permission, ramadanTimes, showMsg]);

    if (isRamadanOver()) return null;

    /* ─── theme tokens ─── */
    const D = dark;

    // Card wrapper
    const cardCls = D
        ? 'bg-gradient-to-br from-emerald-900 via-[#0d2b1a] to-[#081a12] shadow-xl shadow-emerald-900/25'
        : 'bg-white border border-emerald-100 shadow-lg shadow-emerald-100/60';

    // Text
    const headingCls = D ? 'text-white' : 'text-emerald-900';
    const subTextCls = D ? 'text-emerald-300/65' : 'text-emerald-600/70';
    const footerCls = D ? 'text-emerald-300/55' : 'text-emerald-500/70';

    // Tile (inside Ramadan active area)
    const tileCls = D
        ? 'bg-white/[0.06] border-white/[0.12]'
        : 'bg-emerald-50 border-emerald-100 shadow-sm';

    // Progress bar track
    const trackCls = D ? 'bg-white/[0.10]' : 'bg-emerald-100';

    // Notification button
    const notifBtnBase = (active: boolean) => D
        ? (active
            ? 'bg-white/20 border-white/30 text-white'
            : 'bg-white/[0.06] border-white/[0.10] text-white/50 hover:bg-white/[0.12] hover:text-white/75')
        : (active
            ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-200'
            : 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100');

    // Toast
    const toastCls = D
        ? 'bg-white/10 backdrop-blur-md border-white/20 text-white'
        : 'bg-emerald-600 border-emerald-700 text-white';

    // Dua box (active)
    const duaCls = D
        ? 'bg-white/[0.05] border-white/[0.09]'
        : 'bg-emerald-50 border-emerald-100';
    const duaTextCls = D ? 'text-white/75' : 'text-emerald-700/80';

    return (
        <div className={`relative w-full overflow-hidden rounded-3xl mb-5 select-none ${cardCls}`}>

            {/* Decorative stars (dark only) */}
            {D && (
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(14)].map((_, i) => (
                        <div key={i} className="absolute rounded-full bg-white animate-pulse"
                            style={{
                                width: `${1 + (i % 3) * 0.7}px`, height: `${1 + (i % 3) * 0.7}px`,
                                top: `${(i * 17 + 5) % 70}%`, left: `${(i * 23 + 3) % 98}%`,
                                opacity: 0.10 + (i % 4) * 0.05,
                                animationDuration: `${2 + (i % 3)}s`, animationDelay: `${(i % 5) * 0.4}s`,
                            }} />
                    ))}
                </div>
            )}

            {/* Decorative arabesque (light only) */}
            {!D && (
                <>
                    <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-emerald-100/60 blur-2xl pointer-events-none" />
                    <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-emerald-50 blur-xl pointer-events-none" />
                    <div
                        dir="rtl"
                        className="absolute -right-2 top-1/2 -translate-y-1/2 font-arabic text-[7rem] leading-none text-emerald-100/80 select-none pointer-events-none"
                    >
                        رمضان
                    </div>
                </>
            )}

            {/* Radial glow (dark) */}
            {D && <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-72 h-36 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />}

            {/* Shimmer */}
            <div className={`absolute inset-0 bg-gradient-to-r from-transparent ${D ? 'via-white/[0.04]' : 'via-emerald-50/50'} to-transparent -translate-x-full animate-[shimmer_6s_ease-in-out_infinite] pointer-events-none`} />

            {/* Toast */}
            {notifMsg && (
                <div className={`absolute top-3 left-1/2 -translate-x-1/2 z-30 px-4 py-2 border rounded-full text-[11px] font-semibold whitespace-nowrap shadow-lg animate-slideDown ${toastCls}`}>
                    {notifMsg}
                </div>
            )}

            {/* Content */}
            <div className="relative z-10 px-5 py-5">

                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <CrescentMoon dark={D} />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className={`font-bold text-[1rem] tracking-tight leading-tight ${headingCls}`}>
                                {ramadanActive ? 'Ramazan-ı Şerif' : 'Ramazan Geri Sayımı'}
                            </h3>
                            {ramadanActive && (
                                <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest animate-pulse shrink-0
                                    ${D ? 'bg-white/15 border border-white/25 text-white' : 'bg-emerald-100 border border-emerald-200 text-emerald-700'}`}>
                                    Canlı
                                </span>
                            )}
                        </div>
                        <p className={`text-[11px] font-medium mt-0.5 ${subTextCls}`}>
                            {ramadanActive ? `1447H · ${ramadanDay}. Gün` : '1447 Hicri · 1 Mart 2026 Tahmini'}
                        </p>
                    </div>
                </div>

                {/* ── PRE-RAMADAN countdown ── */}
                {!ramadanActive && (
                    <>
                        <div className="flex items-end gap-2">
                            <CountTile value={timeLeft.days} label="Gün" dark={D} />
                            <Separator dark={D} />
                            <CountTile value={timeLeft.hours} label="Saat" dark={D} />
                            <Separator dark={D} />
                            <CountTile value={timeLeft.minutes} label="Dakika" dark={D} />
                            <Separator dark={D} />
                            <CountTile value={timeLeft.seconds} label="Saniye" dark={D} />
                        </div>

                        <p className={`text-center text-[10px] font-medium mt-3.5 tracking-wide ${footerCls}`}>
                            ✦ Ramazana kadar kalan süre ✦
                        </p>

                        {/* Notif buttons */}
                        <div className="mt-4 grid grid-cols-2 gap-2">
                            {([['sahur', sahurNotif, 'Sahur Hatırlatması'], ['iftar', iftarNotif, 'İftar Hatırlatması']] as const).map(([type, active, label]) => (
                                <button key={type} onClick={() => toggle(type)}
                                    className={`group flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border text-[12px] font-bold transition-all active:scale-95 ${notifBtnBase(active)}`}>
                                    <BellIcon active={active} />
                                    {label}
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {/* ── ACTIVE RAMADAN ── */}
                {ramadanActive && (
                    <div className="space-y-3">
                        {/* Day + progress */}
                        <div className="flex items-center gap-3">
                            <div className={`relative overflow-hidden w-[68px] h-[68px] rounded-2xl border flex flex-col items-center justify-center shrink-0 ${tileCls}`}>
                                <div className={`absolute inset-0 bg-gradient-to-b pointer-events-none ${D ? 'from-white/[0.06] to-transparent' : 'from-emerald-100/80 to-transparent'}`} />
                                <span className={`text-3xl font-bold font-mono leading-none ${D ? 'text-white' : 'text-emerald-700'}`}>{ramadanDay}</span>
                                <span className={`text-[9px] font-black uppercase tracking-widest mt-0.5 ${subTextCls}`}>Gün</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className={`text-[11px] font-medium ${subTextCls}`}>Ramazan İlerlemesi</span>
                                    <span className={`text-[11px] font-bold ${D ? 'text-white' : 'text-emerald-700'}`}>{Math.round((ramadanDay / 30) * 100)}%</span>
                                </div>
                                <div className={`w-full h-2 rounded-full overflow-hidden ${trackCls}`}>
                                    <div className={`h-full rounded-full transition-all duration-1000 shadow-sm
                                        ${D ? 'bg-gradient-to-r from-white/80 to-emerald-200' : 'bg-gradient-to-r from-emerald-500 to-emerald-400'}`}
                                        style={{ width: `${Math.min(100, (ramadanDay / 30) * 100)}%` }} />
                                </div>
                                <div className={`flex justify-between mt-1 text-[9px] font-medium ${footerCls}`}>
                                    <span>1. Gün</span><span>30. Gün</span>
                                </div>
                            </div>
                        </div>

                        {/* İmsak / İftar */}
                        {ramadanTimes && (
                            <div className="grid grid-cols-2 gap-2">
                                {([
                                    { label: 'Sahur / İmsak', time: ramadanTimes.imsak, icon: '🌅', type: 'sahur' as const, active: sahurNotif },
                                    { label: 'İftar / Akşam', time: ramadanTimes.iftar, icon: '🌙', type: 'iftar' as const, active: iftarNotif },
                                ]).map(({ label, time, icon, type, active }) => (
                                    <button key={type} onClick={() => toggle(type)}
                                        className={`relative overflow-hidden flex flex-col items-start p-3 rounded-2xl border transition-all active:scale-95 text-left ${tileCls} ${active ? (D ? 'ring-1 ring-white/30' : 'ring-2 ring-emerald-400/50') : ''}`}>
                                        <div className={`absolute inset-0 bg-gradient-to-b pointer-events-none ${D ? 'from-white/[0.05] to-transparent' : 'from-emerald-50/80 to-transparent'}`} />
                                        <div className="relative z-10 flex items-center justify-between w-full mb-1.5">
                                            <span className="text-base">{icon}</span>
                                            <div className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full border transition-all
                                                ${active
                                                    ? (D ? 'bg-white/20 border-white/30 text-white' : 'bg-emerald-500 border-emerald-500 text-white')
                                                    : (D ? 'bg-white/[0.05] border-white/10 text-white/50' : 'bg-emerald-50 border-emerald-200 text-emerald-500')
                                                }`}>
                                                <BellIcon active={active} />
                                                {active ? 'Açık' : 'Kapat'}
                                            </div>
                                        </div>
                                        <p className={`relative z-10 text-[10px] font-medium ${subTextCls}`}>{label}</p>
                                        <p className={`relative z-10 text-[1.35rem] font-bold font-mono leading-tight ${D ? 'text-white' : 'text-emerald-800'}`}>{time}</p>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Dua */}
                        <div className={`relative overflow-hidden rounded-2xl border px-4 py-2.5 text-center ${duaCls}`}>
                            <p dir="rtl" className={`font-arabic text-xl leading-relaxed mb-0.5 ${duaTextCls}`}>رَمَضَانَ الْخَيْرَ</p>
                            <p className={`text-[10px] font-medium tracking-wide ${footerCls}`}>Hayırlı Ramazanlar</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
