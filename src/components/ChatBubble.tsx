import React from 'react';
import styles from './ChatBubble.module.css';

interface ChatBubbleProps {
    message: string;
    sender: 'user' | 'bot';
    timestamp?: Date;
}

export default function ChatBubble({ message, sender, timestamp }: ChatBubbleProps) {
    const isUser = sender === 'user';

    return (
        <div className={`${styles.container} ${isUser ? styles.userContainer : styles.botContainer}`}>
            <div className={`${styles.bubble} ${isUser ? styles.userBubble : styles.botBubble}`}>
                <p>{message}</p>
                {timestamp && (
                    <span className={styles.timestamp}>
                        {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                )}
            </div>
        </div>
    );
}
