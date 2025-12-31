import { useEffect, useRef } from "react";

interface SparklesProps {
  count?: number;
}

export function Sparkles({ count = 50 }: SparklesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sparkles: HTMLDivElement[] = [];

    for (let i = 0; i < count; i++) {
      const sparkle = document.createElement("div");
      sparkle.className = "sparkle";
      sparkle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 3 + 1}px;
        height: ${Math.random() * 3 + 1}px;
        background: hsl(var(--primary) / ${Math.random() * 0.5 + 0.2});
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: sparkle-float ${Math.random() * 10 + 10}s ease-in-out infinite;
        animation-delay: ${Math.random() * 5}s;
        opacity: ${Math.random() * 0.5 + 0.3};
      `;
      container.appendChild(sparkle);
      sparkles.push(sparkle);
    }

    return () => {
      sparkles.forEach((s) => s.remove());
    };
  }, [count]);

  return (
    <>
      <style>{`
        @keyframes sparkle-float {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-20px) translateX(10px) scale(1.2);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-10px) translateX(-5px) scale(0.8);
            opacity: 0.5;
          }
          75% {
            transform: translateY(-30px) translateX(15px) scale(1.1);
            opacity: 0.7;
          }
        }
      `}</style>
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      />
    </>
  );
}
