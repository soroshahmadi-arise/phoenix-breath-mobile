"use client";

import styles from "./TopNavBar.module.css";

import { useSidebar } from "../context/SidebarContext";

interface TopNavBarProps {
    selectedTab: number;
    onTabSelect: (index: number) => void;
    onMenuClick?: () => void;
}

export default function TopNavBar({ selectedTab, onTabSelect, onMenuClick }: TopNavBarProps) {
    const { toggleSidebar } = useSidebar();
    const handleMenuClick = onMenuClick || toggleSidebar;
    return (
        <div className={styles.container}>
            {/* Gradient Scrim */}
            <div className={styles.scrim} />

            <div className={styles.content}>
                {/* Hamburger */}
                <button onClick={handleMenuClick} className={styles.menuButton}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>

                {/* Tab Pill */}
                <div className={styles.pillContainer}>
                    <button
                        className={`${styles.pillSegment} ${selectedTab === 0 ? styles.active : ''}`}
                        onClick={() => onTabSelect(0)}
                    >
                        Session
                    </button>
                    <button
                        className={`${styles.pillSegment} ${selectedTab === 1 ? styles.active : ''}`}
                        onClick={() => onTabSelect(1)}
                    >
                        Explore
                    </button>

                    {/* Animated Background Pill */}
                    <div
                        className={styles.activeBackground}
                        style={{ transform: `translateX(${selectedTab * 100}%)` }}
                    />
                </div>

                {/* Spacer for Balance */}
                <div style={{ width: 44 }} />
            </div>
        </div>
    );
}
