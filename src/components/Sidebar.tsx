"use client";

import { useEffect, useRef } from "react";
import styles from "./Sidebar.module.css";
import SessionHistoryRow from "./SessionHistoryRow";

import { useSidebar } from "../context/SidebarContext";

export default function Sidebar() {
    const { isMenuOpen, setIsMenuOpen, sessions } = useSidebar();
    const onClose = () => setIsMenuOpen(false);
    const dialogRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMenuOpen, onClose]);

    if (!isMenuOpen) return null;

    return (
        <div className={styles.overlay}>
            <div ref={dialogRef} className={styles.sidebar}>
                <header className={styles.header}>
                    <h2 className={styles.title}>Menu</h2>
                    <button onClick={onClose} className={styles.closeButton}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </header>

                <div className={styles.content}>
                    <div className={styles.sectionTitle}>History</div>
                    {sessions.length > 0 ? (
                        <div className={styles.historyList}>
                            {sessions.map(session => (
                                <SessionHistoryRow key={session.id} session={session} />
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: "var(--text-tertiary)", fontSize: 14 }}>No history yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
