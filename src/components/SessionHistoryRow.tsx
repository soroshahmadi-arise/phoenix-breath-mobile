"use client";

import styles from "./SessionHistoryRow.module.css";
import { BreathSession } from "@/types";

// Helper to format date relative or absolute
const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    // Handle Firestore Timestamp or Date object
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};

interface SessionHistoryRowProps {
    session: any; // Using any for now to be flexible with Firestore data
}

export default function SessionHistoryRow({ session }: SessionHistoryRowProps) {
    const title = session.customTitle || session.title || "Breathwork Session";
    const duration = session.durationMinutes || 0;
    const goal = session.goalText || "Guided session";
    const dateStr = formatDate(session.createdAt);

    return (
        <div className={styles.row}>
            <div className={styles.topLine}>
                <span className={styles.title}>{title}</span>
                <span className={styles.pill}>{duration} min</span>
            </div>

            <div className={styles.bottomLine}>
                <span className={styles.goal}>{goal}</span>
                <span className={styles.date}>{dateStr}</span>
            </div>
        </div>
    );
}
