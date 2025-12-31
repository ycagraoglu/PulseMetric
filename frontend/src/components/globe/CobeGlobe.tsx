import { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

interface GlobeMarker {
  location: [number, number];
  size?: number;
  color?: [number, number, number];
}

interface CobeGlobeProps {
  markers?: GlobeMarker[];
  className?: string;
}

const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255,
      ]
    : [0, 0, 0];
};

export function CobeGlobe({ markers = [], className }: CobeGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const markersRef = useRef<GlobeMarker[]>(markers);
  const { theme } = useTheme();

  useEffect(() => {
    markersRef.current = markers;
  }, [markers]);

  useEffect(() => {
    let width = 0;
    let phi = 0;

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };

    window.addEventListener("resize", onResize);
    onResize();

    if (!canvasRef.current) return;

    const isDark = theme === "dark";
    const baseColor: [number, number, number] = isDark 
      ? hexToRgb("#ffffff") 
      : hexToRgb("#ffffff");
    const glowColor: [number, number, number] = isDark 
      ? hexToRgb("#ffffff") 
      : hexToRgb("#e6f2ff");
    const markerColor: [number, number, number] = isDark 
      ? hexToRgb("#5cd688") 
      : hexToRgb("#3eb96e");

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.2,
      dark: isDark ? 1.1 : 0.1,
      scale: 1.1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 1.8,
      baseColor,
      markerColor,
      glowColor,
      opacity: 1,
      offset: [0, 0],
      markers: markersRef.current.map((m) => ({
        location: m.location,
        size: m.size ?? 0.05,
        color: m.color,
      })),
      onRender: (state) => {
        state.markers = markersRef.current.map((m) => ({
          location: m.location,
          size: m.size ?? 0.05,
          color: m.color,
        }));

        state.phi = phi;
        phi += 0.003;

        state.width = width * 2;
        state.height = width * 2;
      },
    });

    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = "1";
        canvasRef.current.style.filter = isDark
          ? "brightness(1.1)"
          : "brightness(0.95)";
      }
    });

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [theme]);

  return (
    <div
      className={cn(
        "relative z-10 mx-auto flex w-full items-center justify-center",
        className
      )}
    >
      
      <canvas
        ref={canvasRef}
        className="h-full w-full opacity-0 transition-opacity duration-500"
        style={{
          width: "100%",
          height: "100%",
          maxWidth: "100%",
          aspectRatio: "1",
          contain: "layout paint size",
        }}
      />
    </div>
  );
}
