
import { useEffect, useState } from 'react';
import { QiblaService } from '../../lib/QiblaService';
import { PrayerTimesService } from '../../lib/PrayerTimesService';

interface QiblaCompassProps {
    onClose: () => void;
}

export function QiblaCompass({ onClose }: QiblaCompassProps) {
    const [qiblaAngle, setQiblaAngle] = useState<number | null>(null); // Angle of Qibla from North
    const [compassHeading, setCompassHeading] = useState<number>(0); // Device heading
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // 1. Get Location & Qibla Angle
        const init = async () => {
            try {
                const loc = await PrayerTimesService.getUserLocation();
                const angle = await QiblaService.getQiblaDirection(loc.lat, loc.lng);
                if (angle !== null) {
                    setQiblaAngle(angle);
                } else {
                    setError("Kıble açısı alınamadı.");
                }
            } catch (err) {
                setError("Konum alınamadı.");
            } finally {
                setLoading(false);
            }
        };
        init();

        // 2. Listen to Device Orientation
        const handleOrientation = (event: DeviceOrientationEvent) => {
            // alpha: rotation around z-axis (compass direction)
            // webkitCompassHeading: for iOS
            let heading = 0;

            // @ts-ignore - iOS property
            if (event.webkitCompassHeading) {
                // @ts-ignore
                heading = event.webkitCompassHeading;
            } else if (event.alpha) {
                // Android/Standard - alpha is 0 at North usually, but mapping varies. 
                // Checks are needed for absolute orientation.
                // Simplified for web: 360 - alpha is roughly compass heading if absolute is true.
                if (event.absolute) {
                    heading = 360 - event.alpha;
                } else {
                    // Fallback or relative - usually means device doesn't support absolute north well without calibration
                    // We might show a warning or just use it.
                    heading = 360 - event.alpha;
                }
            }

            setCompassHeading(heading);
        };

        window.addEventListener('deviceorientation', handleOrientation, true);
        return () => window.removeEventListener('deviceorientation', handleOrientation, true);
    }, []);

    // Calculate rotation to point to Qibla
    // If phone points North (0), Compass UI should show North at top.
    // If Qibla is at 150. Use rotates the Dial.
    // We rotate the "Compass Card" opposite to device heading so North stays North.
    // Then we place the Qibla marker at `qiblaAngle`.

    // Easier visual:
    // Background Dial rotates by `-compassHeading`.
    // Qibla Indicator (overlay) is fixed at `qiblaAngle` relative to the Dial's North.

    const isAligned = qiblaAngle !== null && Math.abs((compassHeading - qiblaAngle + 360) % 360) < 5; // +/- 5 deg tolerance

    return (
        <div className="fixed inset-0 z-[60] bg-theme-bg/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full bg-theme-surface hover:bg-theme-border transition-colors z-50"
            >
                <svg className="w-6 h-6 text-theme-text" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <h2 className="text-2xl font-bold font-serif mb-2 text-emerald-500">Kıble Bulucu</h2>
            <p className="text-sm text-theme-muted mb-10 max-w-xs">
                Cihazınızı yere paralel tutun ve 8 işareti çizerek kalibre edin.
            </p>

            {loading ? (
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            ) : error ? (
                <div className="text-red-400">{error}</div>
            ) : (
                <div className="relative w-72 h-72">
                    {/* 1. Rotating Compass Dial (North stays North relative to earth) */}
                    <div
                        className="w-full h-full rounded-full border-4 border-theme-border bg-theme-surface shadow-2xl relative transition-transform duration-300 ease-out"
                        style={{ transform: `rotate(${-compassHeading}deg)` }}
                    >
                        {/* North Marker */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
                            <span className="text-red-500 font-bold text-lg">N</span>
                            <div className="w-1 h-3 bg-red-500 rounded-full"></div>
                        </div>
                        {/* Other Cardinals */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-theme-muted text-xs font-bold">S</div>
                        <div className="absolute top-1/2 right-4 -translate-y-1/2 text-theme-muted text-xs font-bold">E</div>
                        <div className="absolute top-1/2 left-4 -translate-y-1/2 text-theme-muted text-xs font-bold">W</div>

                        {/* Qibla Marker (Fixed on the dial at the correct angle) */}
                        {qiblaAngle !== null && (
                            <div
                                className="absolute top-1/2 left-1/2 w-1 h-[50%] origin-bottom"
                                style={{ transform: `translateX(-50%) rotate(${qiblaAngle}deg) translateY(-100%)` }}
                            >
                                <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                                    {/* Kaaba Icon/Indicator */}
                                    <div className="w-8 h-8 relative animate-pulse">
                                        <div className="absolute inset-0 bg-emerald-500 blur-md opacity-40 rounded-full"></div>
                                        <svg className="w-8 h-8 text-emerald-600 relative z-10 drop-shadow-lg" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M4 4h16v16H4z" /> {/* Simple Cube/Kaaba representation */}
                                            <path d="M4 8h16M4 12h16M10 4v16" stroke="white" strokeWidth="0.5" strokeOpacity="0.5" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Center Point */}
                        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-theme-text rounded-full -translate-x-1/2 -translate-y-1/2 z-20"></div>
                    </div>

                    {/* Fixed Target Overlay (Phone Orientation) - Visual Guide */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 pointer-events-none">
                        <div className={`transition-all duration-300 ${isAligned ? 'scale-110 opacity-100' : 'scale-100 opacity-20'}`}>
                            <div className="w-1 h-6 bg-emerald-500 mx-auto rounded-full mb-1"></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Feedback Text */}
            <div className="mt-12 h-8">
                {isAligned ? (
                    <div className="text-emerald-500 font-bold text-lg animate-bounce flex items-center gap-2">
                        <span>✨ Kıbleye Yöneldiniz!</span>
                    </div>
                ) : (
                    <div className="text-theme-muted text-sm">
                        {Math.round(qiblaAngle || 0)}° açısına dönün
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="mt-4 text-xs text-theme-muted/50 font-mono">
                Pusula: {Math.round(compassHeading)}° | Kıble: {Math.round(qiblaAngle || 0)}°
            </div>
        </div>
    );
}
