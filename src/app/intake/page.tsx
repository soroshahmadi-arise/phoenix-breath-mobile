"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { emberService } from "@/services/ember";
import ChatBubble from "@/components/ChatBubble";
import TopNavBar from "@/components/TopNavBar";

import { useAuth } from "@/context/AuthContext";
import { DataService } from "@/services/data";

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    options?: string[];
}

export default function IntakePage() {
    const { user } = useAuth();
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isIntakeComplete, setIsIntakeComplete] = useState(false);
    const scrollEndRef = useRef<HTMLDivElement>(null);


    // Auto-scroll to bottom of chat
    const scrollToBottom = () => {
        scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Start Ember Session on mount
    useEffect(() => {
        const initSession = async () => {
            setLoading(true);
            try {
                const response = await emberService.startSession();
                setSessionId(response.sessionId);
                setMessages([
                    {
                        id: 'init-1',
                        text: response.reply,
                        sender: 'bot',
                        timestamp: new Date(),
                        options: response.options
                    }
                ]);
            } catch (error) {
                console.error("Failed to start session:", error);
            } finally {
                setLoading(false);
            }
        };

        initSession();
    }, []);

    const handleSendMessage = async (textOverride?: string) => {
        const textToSend = textOverride || inputText;
        if (!textToSend.trim() || !sessionId) return;

        setInputText("");

        const userMsg: Message = {
            id: Date.now().toString(),
            text: textToSend,
            sender: 'user',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMsg]);
        setLoading(true);

        try {
            const response = await emberService.sendMessage(sessionId, textToSend);

            if (response.nextAction === 'start_session') {
                setIsIntakeComplete(true);
            }

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: response.reply,
                sender: 'bot',
                timestamp: new Date(),
                options: response.options
            };
            setMessages(prev => [...prev, botMsg]);

        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleStartSession = () => {
        router.push("/session");
    };

    return (
        <div className={styles.container}>

            <TopNavBar
                selectedTab={0}
                onTabSelect={() => { }} // Disabled on intake
            />

            {/* Premium Circular Back Button (beside/under nav area) */}
            <button onClick={() => router.back()} className={styles.backButton}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            </button>

            <div className={styles.chatScrollArea}>
                {messages.map((msg, idx) => (
                    <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                        <ChatBubble
                            message={msg.text}
                            sender={msg.sender}
                            timestamp={msg.timestamp}
                        />
                        {idx === messages.length - 1 && msg.sender === 'bot' && msg.options && msg.options.length > 0 && (
                            <div className={styles.chipsContainer}>
                                {msg.options.map((option) => (
                                    <button
                                        key={option}
                                        className={styles.chipButton}
                                        onClick={() => handleSendMessage(option)}
                                        disabled={loading}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                {loading && (
                    <div className={styles.loadingIndicator}>
                        <div className={styles.typingDots}>
                            <div className={styles.dot} />
                            <div className={styles.dot} />
                            <div className={styles.dot} />
                        </div>
                        <span>Ember is crafting your journey...</span>
                    </div>
                )}
                <div ref={scrollEndRef} />
            </div>

            <div className={styles.bottomActionArea}>
                <div className={styles.startSessionContainer}>
                    <button
                        className={styles.startSessionButton}
                        disabled={!isIntakeComplete}
                        onClick={handleStartSession}
                    >
                        Start Session
                    </button>
                    {!isIntakeComplete && (
                        <span className={styles.validationText}>Complete intake to start.</span>
                    )}
                </div>

                <div className={styles.inputArea}>
                    <input
                        className={styles.textInput}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        disabled={loading || !sessionId}
                    />
                    <button
                        className={styles.sendButton}
                        onClick={() => handleSendMessage()}
                        disabled={!inputText.trim() || loading || !sessionId}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
