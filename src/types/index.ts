export type BreathPhase = "Inhale" | "Hold" | "Exhale" | "Sustain";

export interface BreathPattern {
    inhale: number;
    holdIn: number;
    exhale: number;
    holdOut: number;
}

export interface BreathSession {
    id: string; // UUID
    title: string;
    description: string;
    pattern: BreathPattern;
    durationMinutes: number;
}

export interface SessionOption {
    id: string; // UUID
    title: string;
    description: string;
    durationMinutes: number;
    iconName: string;
    isEnabled: boolean;
    audioFileName?: string;
}

export interface EmberChatResponse {
    sessionId: string;
    reply: string;
    phase: string;
    options?: string[]; // nullable in Swift
    nextAction?: string; // nullable
    selectedTrackId?: string; // nullable
}

export type IntakeStep = "time" | "depth" | "intention" | "complete";

export interface IntakeState {
    step: IntakeStep;
    selectedTime?: number;
    selectedDepth?: string;
    intentionText?: string;
}

export interface ChatMessage {
    id?: string;
    role: "user" | "ember";
    text: string;
    createdAt: any; // Firestore Timestamp
}
