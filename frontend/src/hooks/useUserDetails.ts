import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

// ============================================
// Types
// ============================================

export interface UserSession {
    id: string;
    date: string;
    duration: string;
    events: SessionEvent[];
}

export interface SessionEvent {
    type: "session_started" | "session_ended" | "view" | "click" | "action";
    name: string;
    time: string;
}

export interface UserActivity {
    date: string;
    count: number;
}

export interface UserDetailsData {
    id: string;
    name: string;
    country: string;
    countryCode: string;
    city: string;
    platform: string;
    version: string;
    deviceType: string;
    totalSessions: number;
    avgSessionDuration: string;
    firstSeen: string;
    lastActivity: string;
    activities: UserActivity[];
    sessions: UserSession[];
}

// ============================================
// Mock Data (TODO: Replace with API)
// ============================================

const MOCK_USERS: Record<string, UserDetailsData> = {
    "01KCR8XTGQ5W7HR0MAV22YXDHC": {
        id: "01KCR8XTGQ5W7HR0MAV22YXDHC",
        name: "Antique Alex",
        country: "Türkiye",
        countryCode: "TR",
        city: "Ankara",
        platform: "iOS",
        version: "18.6",
        deviceType: "Phone",
        totalSessions: 12,
        avgSessionDuration: "1m 50s",
        firstSeen: "18/12/2025 11:23 AM",
        lastActivity: "18/12/2025 11:56 AM",
        activities: [
            { date: "2025-12-18", count: 5 },
            { date: "2025-12-17", count: 2 },
        ],
        sessions: [
            {
                id: "s1",
                date: "18/12/2025 11:52 AM",
                duration: "4m 5s",
                events: [
                    { type: "session_started", name: "Session Started", time: "11:52 AM" },
                    { type: "view", name: "View /home", time: "11:52 AM" },
                    { type: "click", name: "button_click", time: "11:56 AM" },
                    { type: "view", name: "View /details", time: "11:56 AM" },
                    { type: "session_ended", name: "Session Ended", time: "11:56 AM" },
                ],
            },
            { id: "s2", date: "18/12/2025 11:51 AM", duration: "10 seconds", events: [] },
            { id: "s3", date: "18/12/2025 11:51 AM", duration: "20 seconds", events: [] },
            { id: "s4", date: "18/12/2025 11:50 AM", duration: "1m 5s", events: [] },
            { id: "s5", date: "18/12/2025 11:48 AM", duration: "1m 41s", events: [] },
            { id: "s6", date: "18/12/2025 11:48 AM", duration: "40 seconds", events: [] },
            { id: "s7", date: "18/12/2025 11:47 AM", duration: "5 seconds", events: [] },
            { id: "s8", date: "18/12/2025 11:43 AM", duration: "4m 45s", events: [] },
        ],
    },
    "01KCQAE9RP013RTJZE10SQX5TR": {
        id: "01KCQAE9RP013RTJZE10SQX5TR",
        name: "Emotional Tyrese",
        country: "Türkiye",
        countryCode: "TR",
        city: "Istanbul",
        platform: "iOS",
        version: "18.6",
        deviceType: "Phone",
        totalSessions: 10,
        avgSessionDuration: "2m 30s",
        firstSeen: "18/12/2025 02:31 AM",
        lastActivity: "19/12/2025 12:51 AM",
        activities: [
            { date: "2025-12-19", count: 3 },
            { date: "2025-12-18", count: 7 },
        ],
        sessions: [
            { id: "s1", date: "19/12/2025 12:51 AM", duration: "5 seconds", events: [] },
            { id: "s2", date: "18/12/2025 07:13 PM", duration: "1m 29s", events: [] },
            { id: "s3", date: "18/12/2025 07:10 PM", duration: "30 seconds", events: [] },
        ],
    },
};

// ============================================
// Main Hook
// ============================================

export const useUserDetails = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [selectedSession, setSelectedSession] = useState<UserSession | null>(null);

    // Get user data (TODO: Replace with API call)
    const user = userId ? MOCK_USERS[userId] : null;

    // Actions
    const goBack = useCallback(() => {
        navigate("/users");
    }, [navigate]);

    const copyUserId = useCallback(() => {
        if (user) {
            navigator.clipboard.writeText(user.id);
            toast.success("User ID copied to clipboard");
        }
    }, [user]);

    const selectSession = useCallback((session: UserSession | null) => {
        setSelectedSession(session);
    }, []);

    const closeSessionDialog = useCallback(() => {
        setSelectedSession(null);
    }, []);

    const banUser = useCallback(() => {
        toast.info("Ban user functionality coming soon");
    }, []);

    return {
        // Data
        user,
        userId,
        selectedSession,
        // State
        isNotFound: !user,
        // Actions
        goBack,
        copyUserId,
        selectSession,
        closeSessionDialog,
        banUser,
    };
};

// ============================================
// Re-exports
// ============================================

export type { UserDetailsData as UserDetails };
