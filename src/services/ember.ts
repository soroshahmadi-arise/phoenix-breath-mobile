import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";
import { EmberChatResponse } from "@/types";

interface EmberChatRequest {
    sessionId?: string;
    message?: string;
    isNewSession?: boolean;
}

export class EmberService {
    private static instance: EmberService;

    private constructor() { }

    public static getInstance(): EmberService {
        if (!EmberService.instance) {
            EmberService.instance = new EmberService();
        }
        return EmberService.instance;
    }

    /**
     * Start a new Ember session
     */
    public async startSession(): Promise<EmberChatResponse> {
        const emberChatSend = httpsCallable<EmberChatRequest, EmberChatResponse>(functions, 'emberChatSend');

        try {
            const result = await emberChatSend({ isNewSession: true });
            return result.data;
        } catch (error) {
            console.error("Error starting session:", error);
            throw error;
        }
    }

    /**
     * Send a message to Ember
     */
    public async sendMessage(sessionId: string, message: string): Promise<EmberChatResponse> {
        const emberChatSend = httpsCallable<EmberChatRequest, EmberChatResponse>(functions, 'emberChatSend');

        try {
            const result = await emberChatSend({
                sessionId,
                message
            });
            return result.data;
        } catch (error) {
            console.error("Error sending message:", error);
            throw error;
        }
    }
}

// Mock Service for UI Development
class MockEmberService {
    private step = 0;

    async startSession(): Promise<EmberChatResponse> {
        this.step = 1;
        return {
            sessionId: "mock-session-123",
            reply: "Hi, I'm Ember ✨ What's your goal for today's session?",
            phase: "goal",
            options: ["Stressed", "Overwhelmed", "Anxious", "Skip this step"]
        };
    }

    async sendMessage(sessionId: string, message: string): Promise<EmberChatResponse> {
        await new Promise(resolve => setTimeout(resolve, 1000));

        switch (this.step) {
            case 1:
                this.step = 2;
                return {
                    sessionId,
                    reply: "Beautiful goal! How much time do you have today?",
                    phase: "time",
                    options: ["10 min", "30 min", "60 min", "90 min"]
                };
            case 2:
                this.step = 3;
                return {
                    sessionId,
                    reply: `${message} it is! Ready to start your session?`,
                    phase: "complete",
                    nextAction: "start_session"
                };
            default:
                return {
                    sessionId,
                    reply: "We're all set. Take a deep breath.",
                    phase: "complete",
                    nextAction: "start_session"
                };
        }
    }
}

// Toggle this to switch between Real and Mock service
const USE_MOCK = true;

export const emberService = USE_MOCK ? new MockEmberService() : EmberService.getInstance();
