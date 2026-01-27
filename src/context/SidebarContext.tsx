"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { DataService } from "@/services/data";

interface SidebarContextType {
    isMenuOpen: boolean;
    setIsMenuOpen: (open: boolean) => void;
    toggleSidebar: () => void;
    sessions: any[];
    refreshSessions: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [sessions, setSessions] = useState<any[]>([]);
    const { user } = useAuth();

    const refreshSessions = async () => {
        if (user) {
            const data = await DataService.getUserSessions(user.uid);
            setSessions(data);
        }
    };

    useEffect(() => {
        if (user) {
            refreshSessions();
        } else {
            setSessions([]);
        }
    }, [user]);

    const toggleSidebar = () => setIsMenuOpen(prev => !prev);

    return (
        <SidebarContext.Provider value={{
            isMenuOpen,
            setIsMenuOpen,
            toggleSidebar,
            sessions,
            refreshSessions
        }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
}
