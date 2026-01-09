import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Sparkles } from "@/components/effects/Sparkles";
import { CobeGlobe } from "@/components/globe/CobeGlobe";
import { ActivityFeed } from "@/components/realtime/ActivityFeed";
import { useRealtime } from "@/hooks/useRealtime";

// ============================================
// Constants
// ============================================

const SPARKLES_COUNT = 200;
const FEED_WIDTH = "w-[480px]";

// ============================================
// Sub-Components
// ============================================

const SparklesBackground = () => (
  <div className="absolute inset-0 -z-10 pointer-events-none">
    <Sparkles count={SPARKLES_COUNT} />
  </div>
);

const GlobeSection = ({ markers }: { markers: ReturnType<typeof useRealtime>["markers"] }) => (
  <div className="flex-1 flex items-center justify-center p-8">
    <div className="relative w-full max-w-[600px] xl:max-w-[700px] 2xl:max-w-[800px]">
      <CobeGlobe markers={markers} className="w-full aspect-square" />
    </div>
  </div>
);

const FeedSection = ({
  events,
  isPlaying,
  onlineCount,
  platformCount,
  onTogglePlay,
}: {
  events: ReturnType<typeof useRealtime>["events"];
  isPlaying: boolean;
  onlineCount: number;
  platformCount: number;
  onTogglePlay: () => void;
}) => (
  <div className={`${FEED_WIDTH} h-full p-6 flex flex-col`}>
    <ActivityFeed
      events={events}
      isPlaying={isPlaying}
      onTogglePlay={onTogglePlay}
      onlineCount={onlineCount}
      platformCount={platformCount}
    />
  </div>
);

// ============================================
// Main Component
// ============================================

const Realtime = () => {
  const {
    events,
    markers,
    isPlaying,
    onlineCount,
    platformCount,
    togglePlay,
  } = useRealtime();

  return (
    <DashboardLayout hideHeader fullWidth>
      <div className="relative h-[calc(100vh-0px)] overflow-hidden bg-background">
        <SparklesBackground />

        <div className="relative z-10 flex h-full">
          <FeedSection
            events={events}
            isPlaying={isPlaying}
            onlineCount={onlineCount}
            platformCount={platformCount}
            onTogglePlay={togglePlay}
          />
          <GlobeSection markers={markers} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Realtime;
