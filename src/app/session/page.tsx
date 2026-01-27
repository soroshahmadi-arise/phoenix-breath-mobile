"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import TopNavBar from "@/components/TopNavBar";

export default function SessionPage() {
    const router = useRouter();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isEnding, setIsEnding] = useState(false);
    const [equalizerLevels, setEqualizerLevels] = useState<number[]>(Array(7).fill(0.25));

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize Audio
    useEffect(() => {
        const audio = new Audio("/audio/phoenix_placeholder_75min.mp3");
        audioRef.current = audio;

        const onLoadedMetadata = () => setDuration(audio.duration);
        const onTimeUpdate = () => setCurrentTime(audio.currentTime);
        const onEnded = () => setIsPlaying(false);

        audio.addEventListener("loadedmetadata", onLoadedMetadata);
        audio.addEventListener("timeupdate", onTimeUpdate);
        audio.addEventListener("ended", onEnded);

        // Auto-play attempt (many browsers block this until interaction)
        // We'll wait for the user to hit play if it fails
        const playAttempt = audio.play();
        if (playAttempt !== undefined) {
            playAttempt.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        }

        return () => {
            audio.pause();
            audio.removeEventListener("loadedmetadata", onLoadedMetadata);
            audio.removeEventListener("timeupdate", onTimeUpdate);
            audio.removeEventListener("ended", onEnded);
            audioRef.current = null;
        };
    }, []);

    // Sync state with audio engine
    useEffect(() => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.play().catch(console.error);
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    // Equalizer animation logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                setEqualizerLevels(prev => prev.map((_, i) => {
                    const base = Math.random() * 0.75 + 0.20;
                    const bias = 0.10 * Math.sin(i * 0.9);
                    return Math.min(1.0, Math.max(0.18, base + bias));
                }));
            }, 120);
        } else {
            setEqualizerLevels(Array(7).fill(0.18));
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    const formatTime = (seconds: number) => {
        if (isNaN(seconds)) return "00:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const remainingTime = duration - currentTime;

    const handleEndSession = () => {
        setIsEnding(true);
        setIsPlaying(false);
        if (audioRef.current) {
            audioRef.current.pause();
        }
        setTimeout(() => {
            router.push("/");
        }, 500);
    };

    const togglePlay = () => setIsPlaying(!isPlaying);

    const skip = (seconds: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = Math.min(duration, Math.max(0, audioRef.current.currentTime + seconds));
        }
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseInt(e.target.value);
        setCurrentTime(newTime);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.topScrim} />


            <TopNavBar
                selectedTab={0}
                onTabSelect={() => { }}
            />

            <main className={styles.content}>
                <div className={styles.visualizerContainer}>
                    <div className={`${styles.visualizerCircle} ${isPlaying ? styles.pulsing : ''}`} />
                    <div className={styles.visualizerRing}>
                        <div className={styles.waveform}>
                            {equalizerLevels.map((level, i) => (
                                <div
                                    key={i}
                                    className={styles.waveformBar}
                                    style={{
                                        height: `${44 * level}px`,
                                        opacity: isPlaying ? 0.92 : 0.4
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.infoArea}>
                    <h1 className={styles.title}>Rebirth</h1>
                    <p className={styles.subtitle}>{duration ? `${Math.floor(duration / 60)} min` : "..."} Guided Session</p>
                </div>

                <div className={styles.playerArea}>
                    <div className={styles.sliderContainer}>
                        <input
                            type="range"
                            className={styles.slider}
                            min="0"
                            max={duration || 100}
                            value={currentTime}
                            onChange={handleSliderChange}
                        />
                        <div className={styles.timeDisplay}>
                            <span>{formatTime(currentTime)}</span>
                            <span>-{formatTime(remainingTime)}</span>
                        </div>
                    </div>

                    <div className={styles.controlsRows}>
                        {/* Skip Back */}
                        <button className={styles.controlButton} onClick={() => skip(-10)}>
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3.5 13a9 9 0 1 0 1.5-5" />
                                <path d="m3 7 5 1-1.5 4.5" />
                            </svg>
                            <span className={styles.skipLabel}>10</span>
                        </button>

                        {/* Play/Pause */}
                        <button
                            className={`${styles.controlButton} ${styles.playPauseButton} ${isPlaying ? styles.isPlaying : ''}`}
                            onClick={togglePlay}
                        >
                            {isPlaying ? (
                                <svg width="34" height="34" viewBox="0 0 24 24" fill="#4A2E26">
                                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                </svg>
                            ) : (
                                <svg width="34" height="34" viewBox="0 0 24 24" fill="#4A2E26" style={{ marginLeft: 4 }}>
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            )}
                        </button>

                        {/* Skip Forward */}
                        <button className={styles.controlButton} onClick={() => skip(10)}>
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.5 13a9 9 0 1 1-1.5-5" />
                                <path d="m21 7-5 1 1.5 4.5" />
                            </svg>
                            <span className={styles.skipLabel}>10</span>
                        </button>
                    </div>
                </div>

                <div className={styles.footerArea}>
                    <button className={styles.endSessionButton} onClick={handleEndSession} disabled={isEnding}>
                        {isEnding ? (
                            <div className={styles.loader} />
                        ) : (
                            <>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="15" y1="9" x2="9" y2="15"></line>
                                    <line x1="9" y1="9" x2="15" y2="15"></line>
                                </svg>
                                <span>End Session</span>
                            </>
                        )}
                    </button>
                </div>
            </main>
        </div>
    );
}
