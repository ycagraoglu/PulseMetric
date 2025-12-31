import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Sparkles } from "@/components/effects/Sparkles";
import { CobeGlobe } from "@/components/globe/CobeGlobe";
import { ActivityFeed } from "@/components/realtime/ActivityFeed";

interface ActivityEvent {
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

// Sample event types with e-commerce focus
const eventTypes = [
  { name: "purchase_complete", isScreen: false },
  { name: "checkout_start", isScreen: true },
  { name: "payment_info_entered", isScreen: false },
  { name: "add_to_cart", isScreen: false },
  { name: "cart_view", isScreen: true },
  { name: "product_view", isScreen: true },
  { name: "search_query", isScreen: false },
  { name: "wishlist_add", isScreen: false },
  { name: "review_submit", isScreen: false },
];

// Sample user names
const userNames = [
  "Common Jimmie",
  "Creative Luna",
  "Artful Max",
  "Digital Sarah",
  "Pixel Hunter",
  "Canvas Master",
  "Color Wizard",
  "Bright Alex",
  "Swift Mia",
];

// Sample locations with coordinates
const locations = [
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
];

const generateRandomEvent = (): ActivityEvent => {
  const location = locations[Math.floor(Math.random() * locations.length)];
  const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
  const types: Array<"event" | "session" | "device"> = ["event", "event", "event", "session", "device"];
  const type = types[Math.floor(Math.random() * types.length)];
  
  return {
    id: Math.random().toString(36).substring(7),
    type,
    name: type === "session" ? "New Session" : type === "device" ? "New User" : eventType.name,
    user: userNames[Math.floor(Math.random() * userNames.length)],
    country: location.country,
    countryCode: location.code,
    timestamp: new Date(),
    location: location.coords,
    isScreen: type === "event" ? eventType.isScreen : false,
  };
};

interface GlobeMarker {
  location: [number, number];
  size: number;
  color: [number, number, number];
}

const Realtime = () => {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [onlineCount, setOnlineCount] = useState(1);
  const [markers, setMarkers] = useState<GlobeMarker[]>([]);
  const [platformCount, setPlatformCount] = useState(1);

  // Generate initial events
  useEffect(() => {
    const initialEvents: ActivityEvent[] = [];
    for (let i = 0; i < 5; i++) {
      const event = generateRandomEvent();
      event.timestamp = new Date(Date.now() - i * 30000);
      initialEvents.push(event);
    }
    setEvents(initialEvents);
  }, []);

  // Simulate real-time events
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const newEvent = generateRandomEvent();
      
      setEvents((prev) => [newEvent, ...prev.slice(0, 49)]);
      
      // Add marker with random spread around the country
      const randomLat = newEvent.location[0] + (Math.random() - 0.5) * 3;
      const randomLng = newEvent.location[1] + (Math.random() - 0.5) * 3;
      
      setMarkers((prev) => {
        const newMarker: GlobeMarker = {
          location: [randomLat, randomLng],
          size: 0.06,
          color: [0.4, 1, 0.5],
        };
        return [...prev.slice(-15), newMarker];
      });

      // Randomly update online count
      setOnlineCount((prev) => Math.max(1, prev + (Math.random() > 0.4 ? 1 : -1)));
      setPlatformCount((prev) => Math.max(1, Math.min(3, prev + (Math.random() > 0.7 ? 1 : Math.random() > 0.8 ? -1 : 0))));
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
    if (isPlaying) {
      setEvents([]);
      setOnlineCount(1);
      setMarkers([]);
      setPlatformCount(1);
    }
  }, [isPlaying]);

  return (
    <DashboardLayout hideHeader fullWidth>
      <div className="relative h-[calc(100vh-0px)] overflow-hidden bg-background">
        {/* Sparkles background */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <Sparkles count={200} />
        </div>

        {/* Main content grid */}
        <div className="relative z-10 flex h-full">
          {/* Left side - Activity Feed */}
          <div className="w-[480px] h-full p-6 flex flex-col">
            <ActivityFeed
              events={events}
              isPlaying={isPlaying}
              onTogglePlay={togglePlay}
              onlineCount={onlineCount}
              platformCount={platformCount}
            />
          </div>

          {/* Right side - Globe */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="relative w-full max-w-[600px] xl:max-w-[700px] 2xl:max-w-[800px]">
              <CobeGlobe
                markers={markers}
                className="w-full aspect-square"
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Realtime;
