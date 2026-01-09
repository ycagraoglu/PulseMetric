import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRealtimeStats } from "@/services/stats";

// ============================================
// Types
// ============================================

export interface ActivityEvent {
    id: string;
    type: "event" | "session" | "device";
    name: string;
    user: string;
    country: string;
    countryCode: string;
    timestamp: Date;
    location: [number, number];
    isScreen?: boolean;
}

export interface GlobeMarker {
    location: [number, number];
    size: number;
    color: [number, number, number];
}

// ============================================
// Constants
// ============================================

const EVENT_TYPES = [
    { name: "page_view", isScreen: true },
    { name: "scroll_depth", isScreen: false },
    { name: "time_on_page", isScreen: false },
    { name: "outbound_click", isScreen: false },
    { name: "session_start", isScreen: true },
    { name: "engaged", isScreen: false },
] as const;

const USER_NAMES = [
    "Anonymous User",
    "Visitor Alpha",
    "Web Explorer",
    "Site Guest",
    "New Visitor",
    "Returning User",
] as const;

const LOCATIONS = [
    { country: "Türkiye", code: "TR", coords: [39.9334, 32.8597] as [number, number] },
    { country: "United States", code: "US", coords: [37.0902, -95.7129] as [number, number] },
    { country: "Germany", code: "DE", coords: [51.1657, 10.4515] as [number, number] },
    { country: "Japan", code: "JP", coords: [36.2048, 138.2529] as [number, number] },
    { country: "Brazil", code: "BR", coords: [-14.235, -51.9253] as [number, number] },
    { country: "United Kingdom", code: "GB", coords: [55.3781, -3.436] as [number, number] },
    { country: "India", code: "IN", coords: [20.5937, 78.9629] as [number, number] },
    { country: "Australia", code: "AU", coords: [-25.2744, 133.7751] as [number, number] },
    { country: "France", code: "FR", coords: [46.2276, 2.2137] as [number, number] },
    { country: "Canada", code: "CA", coords: [56.1304, -106.3468] as [number, number] },
] as const;

const ACTIVITY_TYPES: Array<"event" | "session" | "device"> = ["event", "event", "event", "session", "device"];

// Configuration
const CONFIG = {
    maxEvents: 50,
    maxMarkers: 16,
    eventInterval: 2000,
    apiRefreshInterval: 10000,
    staleTime: 5000,
    initialEventCount: 5,
    initialEventGap: 30000,
    markerSize: 0.06,
    markerColor: [0.4, 1, 0.5] as [number, number, number],
    locationSpread: 3,
} as const;

// ============================================
// Helper Functions
// ============================================

const randomFrom = <T,>(arr: readonly T[]): T =>
    arr[Math.floor(Math.random() * arr.length)];

const generateId = (): string =>
    Math.random().toString(36).substring(7);

const generateRandomEvent = (): ActivityEvent => {
    const location = randomFrom(LOCATIONS);
    const eventType = randomFrom(EVENT_TYPES);
    const type = randomFrom(ACTIVITY_TYPES);

    return {
        id: generateId(),
        type,
        name: type === "session" ? "New Session" : type === "device" ? "New Visitor" : eventType.name,
        user: randomFrom(USER_NAMES),
        country: location.country,
        countryCode: location.code,
        timestamp: new Date(),
        location: location.coords,
        isScreen: type === "event" ? eventType.isScreen : false,
    };
};

const generateInitialEvents = (): ActivityEvent[] =>
    Array.from({ length: CONFIG.initialEventCount }, (_, i) => {
        const event = generateRandomEvent();
        event.timestamp = new Date(Date.now() - i * CONFIG.initialEventGap);
        return event;
    });

const createMarkerFromEvent = (event: ActivityEvent): GlobeMarker => {
    const spread = CONFIG.locationSpread;
    return {
        location: [
            event.location[0] + (Math.random() - 0.5) * spread,
            event.location[1] + (Math.random() - 0.5) * spread,
        ],
        size: CONFIG.markerSize,
        color: CONFIG.markerColor,
    };
};

// ============================================
// Query Keys
// ============================================

export const realtimeQueryKeys = {
    stats: ["realtime-stats"] as const,
};

// ============================================
// Main Hook
// ============================================

export const useRealtime = () => {
    const [events, setEvents] = useState<ActivityEvent[]>(() => generateInitialEvents());
    const [markers, setMarkers] = useState<GlobeMarker[]>([]);
    const [isPlaying, setIsPlaying] = useState(true);
    const [platformCount, setPlatformCount] = useState(1);

    // API Query
    const { data: realtimeStats } = useQuery({
        queryKey: realtimeQueryKeys.stats,
        queryFn: () => getRealtimeStats(),
        staleTime: CONFIG.staleTime,
        refetchInterval: isPlaying ? CONFIG.apiRefreshInterval : false,
        retry: 1,
    });

    // Derived state
    const onlineCount = useMemo(
        () => realtimeStats?.onlineVisitors ?? 0,
        [realtimeStats]
    );

    // Simulation effect
    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            const newEvent = generateRandomEvent();

            // Add event (keep last N)
            setEvents((prev) => [newEvent, ...prev.slice(0, CONFIG.maxEvents - 1)]);

            // Add marker (keep last N)
            setMarkers((prev) => [
                ...prev.slice(-(CONFIG.maxMarkers - 1)),
                createMarkerFromEvent(newEvent),
            ]);

            // Random platform count update
            setPlatformCount((prev) => {
                const change = Math.random() > 0.7 ? 1 : Math.random() > 0.8 ? -1 : 0;
                return Math.max(1, Math.min(3, prev + change));
            });
        }, CONFIG.eventInterval);

        return () => clearInterval(interval);
    }, [isPlaying]);

    // Toggle play/pause
    const togglePlay = useCallback(() => {
        setIsPlaying((prev) => {
            if (prev) {
                // Pausing - clear state
                setEvents([]);
                setMarkers([]);
                setPlatformCount(1);
            }
            return !prev;
        });
    }, []);

    // Reset simulation
    const reset = useCallback(() => {
        setEvents(generateInitialEvents());
        setMarkers([]);
        setPlatformCount(1);
        setIsPlaying(true);
    }, []);

    return {
        // State
        events,
        markers,
        isPlaying,
        onlineCount,
        platformCount,
        // Actions
        togglePlay,
        reset,
        // API state
        realtimeStats,
    };
};
