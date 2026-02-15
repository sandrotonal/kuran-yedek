import { useEffect, useState } from 'react';
import { PrayerTimesService, PrayerTimeInfo } from '../../lib/PrayerTimesService';
import { PrayerReminder } from './PrayerReminder';
import { PrayerFocusMode } from './PrayerFocusMode';
import { usePrayerReminder } from '../../hooks/usePrayerReminder';

interface PrayerTimesCardProps {
    onNavigate?: (sure: number, ayet: number) => void;
}

export function PrayerTimesCard({ onNavigate }: PrayerTimesCardProps) {
    const [times, setTimes] = useState<PrayerTimeInfo[]>([]);
    const [loading, setLoading] = useState(true);

    // 1. Manual Focus Mode State (User Initiated, Continuous)
    const [isManualFocusActive, setIsManualFocusActive] = useState(false);

    // 2. System Prayer Reminder Hook (Ephemeral, System Initiated)
    const {
        isActive: isReminderActive,
        activate: triggerReminder,
        dismiss: dismissReminder,
        snooze,
        toggleMute,
        isMuted,
        content: reminderContent,
        currentTime
    } = usePrayerReminder();

    // Contextual Suggestion & State
    const [suggestion, setSuggestion] = useState<{ topic: string; ayetLink?: string } | null>(null);
    const [notifPermission, setNotifPermission] = useState(Notification.permission === 'granted');

    useEffect(() => {
        async function loadTimes() {
            try {
                const loc = await PrayerTimesService.getUserLocation();
                const todayTimes = PrayerTimesService.getTimes(loc.lat, loc.lng);
                setTimes(todayTimes);

                const next = todayTimes.find(t => t.isNext);
                if (next) {
                    setSuggestion(PrayerTimesService.getContextualSuggestion(
                        next.name === 'İmsak' ? 'fajr' :
                            next.name === 'Güneş' ? 'sunrise' :
                                next.name === 'Öğle' ? 'dhuhr' :
                                    next.name === 'İkindi' ? 'asr' :
                                        next.name === 'Akşam' ? 'maghrib' :
                                            next.name === 'Yatsı' ? 'isha' : 'other'
                    ));
                } else {
                    // Post-Isha Fallback: Show Isha suggestions or General Night focus
                    setSuggestion(PrayerTimesService.getContextualSuggestion('isha'));
                }
            } catch (e) {
                console.error("Failed to load prayer times", e);
            } finally {
                setLoading(false);
            }
        }

        loadTimes();
        loadTimes();
    }, []);

    // 3. Automatic Trigger & Sound Logic
    useEffect(() => {
        const checkTime = () => {
            const now = new Date();
            const currentTimeStr = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

            const currentPrayer = times.find(t => t.time === currentTimeStr);

            if (currentPrayer && notifPermission) {
                // Check if we already triggered for this specific time to avoid loop
                // Simple debounce: could rely on state, but here we trust the reminder is active for 20s
                // and won't re-trigger if isActive is true.
                // However, we need to check if reminder is NOT active to trigger it.
                // We pass this logic to triggerReminder/Audio.
                triggerReminder();

                // Play Sound if not muted
                if (!isMuted) {
                    // Using a placeholder soft notification sound (or adhan if available)
                    // Using a simple beep data URI for reliability without external assets for now
                    // In production, replace with: new Audio('/adhan.mp3').play();
                    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'); // Soft chime
                    audio.volume = 0.5;
                    audio.play().catch(e => console.log("Audio play failed (interaction needed first):", e));
                }

                // Browser Notification
                PrayerTimesService.sendNotification("Vakit Girdi", `${currentPrayer.name} vakti girdi. ${currentPrayer.context}`);
            }
        };

        const timer = setInterval(checkTime, 60000); // Check every minute
        return () => clearInterval(timer);
    }, [times, notifPermission, isMuted, triggerReminder]);

    const handleEnableNotifications = async () => {
        if (notifPermission) {
            alert("Bildirimler zaten açık. Namaz vakitlerinde size haber vereceğiz.");
            return;
        }

        const granted = await PrayerTimesService.requestNotificationPermission();
        setNotifPermission(granted);

        if (granted) {
            PrayerTimesService.sendNotification("Bildirimler Açık", "Namaz vakitlerinde size huzur veren hatırlatmalar yapacağız.");
            // Test trigger for the user to see the new screen
            setTimeout(() => triggerReminder(), 2000);
        } else {
            alert("Bildirim izni verilmedi. Tarayıcı ayarlarından bildirimlere izin verip tekrar deneyebilirsiniz.");
        }
    };

    if (loading) return <div className="h-24 animate-pulse bg-theme-bg/50 rounded-xl my-4"></div>;

    // Determine active prayer context
    // If nextPrayer is found (standard case), use it.
    // If NOT found (post-Isha), fallback to Isha (Yatsı) to keep the UI active at night.
    let activeContextPrayer = times.find(t => t.isNext);
    if (!activeContextPrayer && times.length > 0) {
        // Fallback to Yatsı (Last item)
        activeContextPrayer = times[times.length - 1];
    }

    return (
        <div className="bg-gradient-to-br from-theme-surface to-theme-bg border border-theme-border/50 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-theme-text flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-emerald-500 rounded-full"></span>
                        Namaz Vakitleri
                    </h3>
                    <p className="text-xs text-theme-muted ml-3.5 mt-0.5">
                        Diyanet Takvimi ile uyumlu
                    </p>
                </div>

                {/* Controls */}
                <div className="flex gap-2 justify-end relative z-10">
                    {/* Notification Toggle with Feedback */}
                    <button
                        onClick={handleEnableNotifications}
                        className={`p-2 rounded-lg transition-colors 
                            ${notifPermission
                                ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                                : 'bg-theme-bg/50 text-theme-muted hover:text-emerald-500 hover:bg-emerald-500/10'
                            }`}
                        title={notifPermission ? "Bildirimler Açık" : "Bildirimleri Aç"}
                    >
                        {notifPermission ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6L18 18" /></svg> // Slash icon for disabled
                        )}
                    </button>

                    {/* Manual Focus Mode Toggle */}
                    <button
                        onClick={() => setIsManualFocusActive(true)}
                        className="p-2 rounded-lg bg-theme-bg/50 hover:bg-indigo-500/10 text-theme-muted hover:text-indigo-500 transition-colors"
                        title="Sessiz Mod / Odak Modu"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                    </button>
                    {/* Dev Only: Trigger System Reminder manually for testing */}
                    <button
                        onClick={triggerReminder}
                        className="p-2 rounded-lg bg-theme-bg/50 hover:bg-emerald-500/10 text-theme-muted hover:text-emerald-500 transition-colors opacity-50 hover:opacity-100"
                        title="Test: Namaz Vakti Ekranını Tetikle"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </button>
                </div>
            </div>

            {/* Times Grid */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {times.map((t, i) => (
                    <div
                        key={i}
                        className={`
                            flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300
                            ${t.isNext
                                ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20 scale-105 ring-2 ring-emerald-500/20'
                                : 'bg-theme-bg/50 hover:bg-theme-bg text-theme-text border border-theme-border/10'
                            }
                        `}
                    >
                        <span className={`text-[10px] uppercase tracking-wider mb-1 ${t.isNext ? 'text-white/80' : 'text-theme-muted'}`}>
                            {t.name}
                        </span>
                        <span className={`text-sm font-bold font-mono ${t.isNext ? 'text-white' : 'text-theme-text'}`}>
                            {t.time}
                        </span>
                    </div>
                ))}
            </div>

            {/* Context Line (for Next/Active Prayer) */}
            {/* Context Line (for Next/Active Prayer) */}
            {activeContextPrayer && (
                <div className="mt-4 pt-4 border-t border-theme-border/10">
                    <div className="text-center mb-3">
                        <p className="text-xs text-theme-muted/80 italic font-serif">
                            "{activeContextPrayer.context}"
                        </p>
                    </div>

                    {suggestion && (
                        <div className="flex items-center justify-between bg-theme-bg/30 rounded-2xl p-3 border border-theme-border/20 shadow-sm hover:bg-theme-bg/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/10 rounded-full text-emerald-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] uppercase font-bold text-theme-muted tracking-wide mb-0.5">Manevi Odak</p>
                                    <p className="text-xs font-bold text-theme-text leading-tight">{suggestion.topic}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pl-2">
                                {suggestion.ayetLink && (
                                    <button
                                        onClick={() => {
                                            if (onNavigate && suggestion.ayetLink) {
                                                const [sureStr, ayetStr] = suggestion.ayetLink.split(':');
                                                onNavigate(parseInt(sureStr), parseInt(ayetStr));
                                            }
                                        }}
                                        className="h-8 px-3 bg-white/50 dark:bg-black/20 hover:bg-emerald-500/10 border border-theme-border/20 hover:border-emerald-500/30 rounded-full text-[10px] font-bold text-theme-text hover:text-emerald-600 dark:hover:text-emerald-400 transition-all active:scale-95 shadow-sm flex items-center justify-center"
                                    >
                                        Oku: {suggestion.ayetLink}
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        const text = `Vaktin Ayeti: ${suggestion.topic}\nKuran Anlam Haritası`;
                                        navigator.clipboard.writeText(text);
                                        const btn = document.getElementById('copy-btn-feedback');
                                        if (btn) btn.classList.add('text-emerald-500', 'scale-110');
                                        setTimeout(() => btn?.classList.remove('text-emerald-500', 'scale-110'), 1000);
                                    }}
                                    id="copy-btn-feedback"
                                    className="w-8 h-8 flex items-center justify-center bg-white/50 dark:bg-black/20 hover:bg-theme-bg/80 border border-theme-border/20 rounded-full text-theme-muted hover:text-emerald-500 transition-all active:scale-95 shadow-sm"
                                    title="Paylaş"
                                >
                                    <svg className="w-3.5 h-3.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 1. MANUAL FOCUS MODE (Persistent, User Controlled) */}
            <PrayerFocusMode
                isActive={isManualFocusActive}
                onExit={() => setIsManualFocusActive(false)}
                currentPrayer={activeContextPrayer?.name}
                suggestion={suggestion || undefined}
            />

            {/* 2. AUTOMATIC PRAYER REMINDER (Ephemeral, System Controlled) */}
            <PrayerReminder
                isActive={isReminderActive}
                onDismiss={dismissReminder}
                onSnooze={snooze}
                onMute={toggleMute}
                isMuted={isMuted}
                content={reminderContent}
                currentTime={currentTime}
                prayerName={activeContextPrayer?.name}
            />
        </div>
    );
}
