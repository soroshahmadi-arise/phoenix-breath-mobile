"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import TopNavBar from "@/components/TopNavBar";
import SessionHistoryRow from "@/components/SessionHistoryRow";
import { DataService } from "@/services/data";

import VideoBackground from "@/components/VideoBackground";

export default function Home() {
  const { user, loading, signInWithGoogle, signInWithEmail } = useAuth();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showEntrance, setShowEntrance] = useState(false);

  // Entrance animations
  useEffect(() => {
    if (user) {
      setTimeout(() => setShowEntrance(true), 100);
    }
  }, [user]);


  const handleStartSession = () => {
    setIsPlaying(false);
    router.push("/intake");
  };

  const handleToggleVideo = () => {
    setIsPlaying(!isPlaying);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmail(email, password);
    } catch (err) {
      alert("Login failed. Please check your credentials.");
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>
  }

  // If not logged in, show premium landing/login
  if (!user) {
    return (
      <div className={styles.loginContainer}>
        <header className={styles.loginHeader}>
          <div className={styles.loginLogo}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L9 9H3L8 14L6 21L12 17L18 21L16 14L21 9H15L12 2Z" fill="#5D4037" />
            </svg>
          </div>
          <h1 className={styles.loginTitle}>Phoenix Breath</h1>
        </header>

        <main className={styles.loginMain}>
          <form onSubmit={handleEmailLogin} className={styles.loginForm}>
            <input
              type="email"
              placeholder="Email"
              className={styles.loginInput}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className={styles.loginInput}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className={styles.emailLoginButton}>
              Log in with Email
            </button>
          </form>

          <div className={styles.divider}>
            <span className={styles.dividerText}>OR</span>
          </div>

          <div className={styles.socialButtons}>
            <button onClick={signInWithGoogle} className={styles.googleButton}>
              <span className={styles.socialIcon}>G</span>
              Continue with Google
            </button>
            <button className={styles.appleButton}>
              <span className={styles.socialIcon}></span>
              Continue with Apple
            </button>
          </div>

          <footer className={styles.loginFooter}>
            <p>New here? <span className={styles.link}>Create Account</span></p>
          </footer>
        </main>
      </div>
    )
  }

  // Main Dashboard (App View)
  return (
    <div className={styles.dashboardContainer}>
      {/* Background Video (at top level of dashboard) */}
      {selectedTab === 0 && (
        <VideoBackground
          videoSrc={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/videos/EmberIntroVideo2.mp4`}
          isPlaying={isPlaying}
          onPlayStateChange={setIsPlaying}
        />
      )}

      {/* Top Navigation */}
      <TopNavBar
        selectedTab={selectedTab}
        onTabSelect={setSelectedTab}
      />

      <main className={styles.dashboardContent}>
        {selectedTab === 0 ? (
          /* Session Tab Content */
          <div className={`${styles.homeContainer} ${showEntrance ? styles.showContent : ""}`}>
            <div className={`${styles.greetingArea} ${styles.animateText}`}>
              <span className={styles.welcomeText}>Welcome, {user.displayName?.split(" ")[0] || "Traveler"}</span>
              <h1 className={styles.heroTitle}>Hello, I'm Ember.</h1>
              <p className={styles.heroSubtitle}>I'll be your guide.</p>
            </div>

            <div className={`${styles.centerAction} ${styles.animateButton}`}>
              <button className={styles.playButton} onClick={handleToggleVideo}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className={styles.playIcon}>
                  {isPlaying ? (
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  ) : (
                    <path d="M8 5v14l11-7z" />
                  )}
                </svg>
              </button>
            </div>

            <div className={`${styles.bottomAction} ${styles.animateCTA}`}>
              <button className={styles.beginButton} onClick={handleStartSession}>
                Begin Your Journey
              </button>
            </div>
          </div>
        ) : (
          /* Explore Tab Content */
          <div className={styles.exploreContainer}>
            <header className={styles.exploreHeader}>
              <h1 className={styles.exploreTitle}>What you choose<br />becomes your rebirth</h1>
              <p className={styles.exploreSubtitle}>Select a session to start breathing.</p>
            </header>

            <div className={styles.sessionList}>
              {/* Reset */}
              <div className={styles.sessionCard}>
                <div className={styles.sessionIconContainer}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                  </svg>
                </div>
                <div className={styles.sessionInfo}>
                  <h3 className={styles.sessionCardTitle}>Reset</h3>
                  <p className={styles.sessionCardSubtitle}>Quick grounding<br />and tension relief</p>
                </div>
                <div className={styles.sessionMeta}>
                  <span className={styles.comingSoon}>Coming Soon</span>
                  <span className={styles.duration}>10 min</span>
                </div>
              </div>

              {/* Settle */}
              <div className={styles.sessionCard}>
                <div className={styles.sessionIconContainer}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 7h10M5 12h14M8 17h8" />
                  </svg>
                </div>
                <div className={styles.sessionInfo}>
                  <h3 className={styles.sessionCardTitle}>Settle</h3>
                  <p className={styles.sessionCardSubtitle}>Drop out of<br />survival mode</p>
                </div>
                <div className={styles.sessionMeta}>
                  <span className={styles.comingSoon}>Coming Soon</span>
                  <span className={styles.duration}>20 min</span>
                </div>
              </div>

              {/* Release */}
              <div className={styles.sessionCard}>
                <div className={styles.sessionIconContainer}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                    <path d="M19 3v4M21 5h-4" />
                  </svg>
                </div>
                <div className={styles.sessionInfo}>
                  <h3 className={styles.sessionCardTitle}>Release</h3>
                  <p className={styles.sessionCardSubtitle}>Let emotion and<br />tension move thr...</p>
                </div>
                <div className={styles.sessionMeta}>
                  <span className={styles.comingSoon}>Coming Soon</span>
                  <span className={styles.duration}>45 min</span>
                </div>
              </div>

              {/* Renewal */}
              <div className={styles.sessionCard}>
                <div className={styles.sessionIconContainer}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <div className={styles.sessionInfo}>
                  <h3 className={styles.sessionCardTitle}>Renewal</h3>
                  <p className={styles.sessionCardSubtitle}>Deeper unwind +<br />nervous system r...</p>
                </div>
                <div className={styles.sessionMeta}>
                  <span className={styles.comingSoon}>Coming Soon</span>
                  <span className={styles.duration}>60 min</span>
                </div>
              </div>

              {/* Rebirth */}
              <div className={`${styles.sessionCard} ${styles.activeCard}`} onClick={handleStartSession}>
                <div className={styles.sessionIconContainer}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.5 4 6.5 2 2 3 3.5 3 5.5a6 6 0 1 1-12 0c0-1.38.5-3 1.5-4.5" />
                  </svg>
                </div>
                <div className={styles.sessionInfo}>
                  <h3 className={styles.sessionCardTitle}>Rebirth</h3>
                  <p className={styles.sessionCardSubtitle}>Deep transformational<br />journey</p>
                </div>
                <div className={styles.sessionMeta}>
                  <span className={styles.duration}>90 min</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.chevron}>
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
