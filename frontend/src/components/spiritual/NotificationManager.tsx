import { useEffect, useRef, useState } from 'react';
import { PrayerTimesService } from '../../lib/PrayerTimesService';
import { PrayerDebtService, PrayerType } from '../../lib/PrayerDebtService';
import { ReligiousDaysService } from '../../lib/ReligiousDaysService';

// Map PrayerTimesService Names (Turkish) to PrayerDebtService Types
const PRAYER_MAP: Record<string, PrayerType> = {
    'İmsak': 'sabah',
    'Öğle': 'ogle',
    'İkindi': 'ikindi',
    'Akşam': 'aksam',
    'Yatsı': 'yatsi'
};

// Curated Daily Verses
const DAILY_VERSES = [
    { text: "Rabbin, kendisinden başkasına asla ibadet etmemenizi, anaya-babaya iyi davranmanızı kesin olarak emretti.", source: "İsra, 23" },
    { text: "Şüphesiz Allah, adaleti, iyilik yapmayı, yakınlara yardım etmeyi emreder.", source: "Nahl, 90" },
    { text: "Ey iman edenler! Sabır ve namazla (Allah'tan) yardım dileyin.", source: "Bakara, 153" },
    { text: "Kim zerre ağırlığınca bir hayır işlerse, onun mükâfatını görecektir.", source: "Zilzal, 7" },
    { text: "Kalpler ancak Allah'ı anmakla huzur bulur.", source: "Ra'd, 28" },
    { text: "Allah, sabredenlerle beraberdir.", source: "Bakara, 153" },
    { text: "Bilsin ki insan için kendi çalışmasından başka bir şey yoktur.", source: "Necm, 39" },
    { text: "O, hanginizin daha güzel amel yapacağını sınamak için ölümü ve hayatı yaratandır.", source: "Mülk, 2" }
];

export function NotificationManager() {
    const lastNotifiedTime = useRef<string>('');
    const [religiousAlert, setReligiousAlert] = useState<{ title: string; message: string; dateInfo: string } | null>(null);

    // Otomatik kapanma zamanlayıcısı
    useEffect(() => {
        if (religiousAlert) {
            const timer = setTimeout(() => {
                setReligiousAlert(null);
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [religiousAlert]);

    useEffect(() => {
        // Request permission on mount
        PrayerTimesService.requestNotificationPermission();

        const checkAndNotify = async () => {
            const now = new Date();
            // Format HH:MM
            const currentTime = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

            // --- DAILY VERSE CHECK (at 10:00 AM) ---
            if (currentTime === '10:00') {
                const todayStr = now.toDateString();
                const lastDailyDate = localStorage.getItem('last_daily_verse_date');

                if (lastDailyDate !== todayStr) {
                    // Send Daily Verse
                    const randomVerse = DAILY_VERSES[Math.floor(Math.random() * DAILY_VERSES.length)];
                    PrayerTimesService.sendNotification(
                        "Günün Ayeti 🌿",
                        `"${randomVerse.text}" (${randomVerse.source})`
                    );
                    localStorage.setItem('last_daily_verse_date', todayStr);
                }
            }

            // Prevent double notification in the same minute
            if (lastNotifiedTime.current === currentTime) return;

            // Get location and times
            const loc = await PrayerTimesService.getUserLocation();
            const times = PrayerTimesService.getTimes(loc.lat, loc.lng, now);

            // Find if any prayer matches current time
            const currentPrayer = times.find(t => t.time === currentTime);

            if (currentPrayer) {
                lastNotifiedTime.current = currentTime; // Mark as notified

                let prayerName = currentPrayer.name;
                let title = prayerName;
                let body = currentPrayer.context; // Default context message

                // --- RAMADAN OVERRIDES ---
                if (prayerName === 'Akşam' && localStorage.getItem('ramadan_notif_iftar') === '1') {
                    title = 'İftar Vakti 🌙';
                    body = 'Allah orucunuzu kabul etsin. Hayırlı iftarlar!';
                } else if (prayerName === 'İmsak' && localStorage.getItem('ramadan_notif_sahur') === '1') {
                    title = 'İmsak Vakti 🌙';
                    body = 'Yeme-içme vakti sona erdi, niyet zamanı. Hayırlı ramazanlar!';
                } else {
                    // Check for Debt Integration (Only if not overridden by Ramadan context)
                    const debtType = PRAYER_MAP[prayerName];
                    if (debtType) {
                        const debts = PrayerDebtService.getDebts();
                        const debt = debts.find(d => d.type === debtType);

                        if (debt && debt.count > 0) {
                            body = `${prayerName} vakti girdi. ${debt.count} adet kaza borcunuz var. Bu vakti eda ederken niyet edebilirsiniz.`;
                        } else {
                            body = `${prayerName} vakti girdi. ${currentPrayer.context}`;
                        }
                    } else if (prayerName === 'Güneş') {
                        body = "Güneş doğdu. İşrak vakti yaklaşıyor.";
                    }
                }

                PrayerTimesService.sendNotification(
                    title,
                    body
                );
            }
        };

        // --- TEST METHOD EXPOSED TO WINDOW ---
        (window as any).testNotification = () => {
            PrayerTimesService.requestNotificationPermission().then(granted => {
                if (granted) {
                    PrayerTimesService.sendNotification('Test Bildirimi 🔔', 'Native (Push) bildirimleriniz sorunsuz çalışıyor!');
                } else {
                    alert('Bildirim izni verilmemiş. Tarayıcı ayarlarından izinleri kontrol edin.');
                }
            });
        };

        (window as any).testReligiousNotification = () => {
            setReligiousAlert({
                title: "Test Kandili (Örnek)",
                message: "Bu bir in-app bildirim testidir. Özel günler bu şekilde zarif bir pop-up ile kutlanacaktır.",
                dateInfo: "BUGÜN"
            });
        };

        // Check every 20 seconds to be precise enough but not spammy
        const intervalId = setInterval(checkAndNotify, 20000);

        // Initial check
        checkAndNotify();

        // --- RELIGIOUS DAYS OVERLAY NOTIFICATION ---
        const checkReligiousDaysFocus = () => {
            const upcoming = ReligiousDaysService.getUpcomingDays(1);
            if (upcoming.length > 0) {
                const nextEvent = upcoming[0];
                const daysLeft = ReligiousDaysService.getDaysUntil(nextEvent.date);

                if (daysLeft === 0 || daysLeft === 1) {
                    const storageKey = `rel_notif_seen_${nextEvent.date}`;
                    if (!localStorage.getItem(storageKey)) {
                        setReligiousAlert({
                            title: nextEvent.name,
                            message: nextEvent.description,
                            dateInfo: daysLeft === 0 ? 'BUGÜN' : 'YARIN'
                        });
                        localStorage.setItem(storageKey, 'true');
                    }
                }
            }
        };

        // Run religious days check on mount
        checkReligiousDaysFocus();

        return () => clearInterval(intervalId);
    }, []);

    // Render In-App Notifications
    return (
        <>
            {religiousAlert && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm animate-in slide-in-from-top-10 fade-in duration-500">
                    <div className="relative overflow-hidden rounded-2xl bg-[#0f172a]/95 backdrop-blur-xl border border-emerald-500/30 p-4 shadow-2xl shadow-emerald-900/40 flex items-start gap-4 cursor-pointer" onClick={() => setReligiousAlert(null)}>
                        {/* Glow Effect */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

                        {/* Icon */}
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400 relative z-10">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        </div>

                        {/* Content */}
                        <div className="flex-1 relative z-10">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{religiousAlert.dateInfo}</span>
                            </div>
                            <h4 className="text-white font-serif font-bold text-lg leading-tight mb-1">{religiousAlert.title}</h4>
                            <p className="text-slate-400 text-xs leading-relaxed">{religiousAlert.message}</p>
                        </div>

                        {/* Close Indicator */}
                        <button className="text-slate-500 hover:text-white transition-colors p-1" onClick={(e) => { e.stopPropagation(); setReligiousAlert(null); }}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
