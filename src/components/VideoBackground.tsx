"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./VideoBackground.module.css";

interface VideoBackgroundProps {
    videoSrc: string;
    isPlaying: boolean;
    onEnded?: () => void;
    onPlayStateChange?: (playing: boolean) => void;
}

export default function VideoBackground({
    videoSrc,
    isPlaying,
    onEnded,
    onPlayStateChange
}: VideoBackgroundProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (isPlaying) {
            video.play().catch(err => {
                console.error("Video play failed:", err);
                setHasError(true);
            });
        } else {
            video.pause();
        }
    }, [isPlaying]);

    const handleEnded = () => {
        onEnded?.();
        onPlayStateChange?.(false);
    };

    if (hasError) {
        return null; // Gracefully hide if video fails
    }

    return (
        <div className={styles.container}>
            <video
                ref={videoRef}
                className={styles.video}
                src={videoSrc}
                playsInline
                muted={false}
                onEnded={handleEnded}
                preload="auto"
            />
            {/* Gradient Overlay matching iOS */}
            <div className={styles.gradientOverlay} />
        </div>
    );
}
