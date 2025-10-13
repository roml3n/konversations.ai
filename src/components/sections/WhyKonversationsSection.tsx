"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";

type WhyItem = {
  id: string;
  title: string;
  description: string;
  src: string; // empty for now; user will provide later
};

const WhyKonversationsSection = () => {
  const items: WhyItem[] = useMemo(
    () => [
      {
        id: "a",
        title: "See the bigger picture",
        description: "Track performance across teams with one unified view.",
        src: "",
      },
      {
        id: "b",
        title: "Understand your customers",
        description: "Uncover trends and sentiment to prioritize what matters.",
        src: "",
      },
      {
        id: "c",
        title: "Grow with confidence",
        description: "Make data-backed decisions and measure impact instantly.",
        src: "",
      },
    ],
    []
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  // Simulation state for empty sources
  const simRafRef = useRef<number | null>(null);
  const simLastTsRef = useRef<number | null>(null);
  const SIM_DURATION_SECONDS = 6; // adjustable simulated length per tab
  // Crossfade state when switching active tab
  const [fadeStage, setFadeStage] = useState<0 | 1>(1);

  const progress = duration > 0 ? Math.min(currentTime / duration, 1) : 0;

  useEffect(() => {
    // Reset timing whenever the active video changes
    setDuration(0);
    setCurrentTime(0);
    const el = videoRef.current;
    if (!el) return;

    // Change the source
    el.currentTime = 0;
    // Pause while we swap sources; separate effect will start playback if needed
    el.pause();
    // trigger crossfade
    setFadeStage(0);
    const id = requestAnimationFrame(() => setFadeStage(1));
    return () => cancelAnimationFrame(id);
  }, [activeIndex, items]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (!items[activeIndex]?.src) return; // no autoplay for empty src
    if (isPlaying) {
      el.play().catch(() => {});
      return;
    }
    el.pause();
  }, [isPlaying, activeIndex, items]);

  // Initialize duration for empty sources so that progress can be simulated
  useEffect(() => {
    if (!items[activeIndex]?.src) {
      setDuration(SIM_DURATION_SECONDS);
      setCurrentTime(0);
    }
  }, [activeIndex, items, SIM_DURATION_SECONDS]);

  // Simulate playback when the current item has an empty src
  useEffect(() => {
    const hasSrc = !!items[activeIndex]?.src;
    if (hasSrc) {
      // Ensure any running simulation is stopped
      if (simRafRef.current) cancelAnimationFrame(simRafRef.current);
      simRafRef.current = null;
      simLastTsRef.current = null;
      return;
    }

    if (!isPlaying) {
      if (simRafRef.current) cancelAnimationFrame(simRafRef.current);
      simRafRef.current = null;
      simLastTsRef.current = null;
      return;
    }

    const step = (ts: number) => {
      if (simLastTsRef.current == null) simLastTsRef.current = ts;
      const deltaMs = ts - simLastTsRef.current;
      simLastTsRef.current = ts;
      setCurrentTime((prev) => {
        const next = prev + deltaMs / 1000;
        if (duration > 0 && next >= duration) {
          // End reached; advance to next tab and reset simulation state
          setTimeout(() => {
            simLastTsRef.current = null;
            setActiveIndex((i) => (i + 1) % items.length);
          }, 0);
          return duration;
        }
        return next;
      });
      simRafRef.current = requestAnimationFrame(step);
    };

    simRafRef.current = requestAnimationFrame(step);
    return () => {
      if (simRafRef.current) cancelAnimationFrame(simRafRef.current);
      simRafRef.current = null;
      simLastTsRef.current = null;
    };
  }, [items, activeIndex, isPlaying, duration]);

  const handleLoadedMetadata = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    setDuration(el.duration || 0);
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    setCurrentTime(el.currentTime || 0);
  }, []);

  const handleEnded = useCallback(() => {
    setActiveIndex((i) => (i + 1) % items.length);
  }, [items.length]);

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((p) => !p);
  }, []);

  const radius = 24; // increased for more breathing room around the 24px icon
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-16">
        <div className="max-w-[1151px] mx-auto p-6 md:p-9 bg-zinc-100 rounded-3xl border border-black/10 flex flex-col lg:flex-row gap-9 overflow-hidden">
          {/* Left: Heading and Tabs */}
          <div className="flex-1 flex flex-col justify-between gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="text-[1.75rem] md:text-4xl lg:text-5xl font-medium font-gotham leading-none tracking-tighter text-zinc-800">
                Why Konversations?
              </h2>
              <p className="text-base md:text-lg text-zinc-800/60 font-sans">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et
                massa mi. Aliquam in hendrerit urna. Pellentesque sit amet
                sapien fringilla, mattis ligula consectetur, ultrices .
              </p>
            </div>

            <div
              className="flex flex-col gap-4"
              role="tablist"
              aria-label="Why Konversations tabs"
            >
              {items.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <div key={item.id} className="flex flex-col gap-2">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`why-panel-${item.id}`}
                      id={`why-tab-${item.id}`}
                      onClick={() => setActiveIndex(index)}
                      className={
                        `group flex items-start gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 rounded-md ` +
                        (isActive ? "" : "opacity-60 hover:opacity-100")
                      }
                    >
                      <span
                        className="w-11 h-10 bg-neutral-400 rounded-lg flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="py-3 flex-1 flex flex-col gap-1 justify-center">
                        <span className="text-lg font-medium font-gotham tracking-tighter leading-none text-zinc-800">
                          {item.title}
                        </span>
                        <span
                          className={
                            "text-base text-zinc-800/60 font-sans  transition-all duration-300 overflow-hidden " +
                            (isActive
                              ? "opacity-100 max-h-20 translate-y-0"
                              : "opacity-0 max-h-0 -translate-y-1")
                          }
                        >
                          {item.description}
                        </span>
                      </span>
                    </button>
                    {isActive ? (
                      <div className="h-px bg-zinc-200 relative rounded-full overflow-hidden w-full">
                        <div
                          className="h-px bg-blue-700 absolute inset-y-0 left-0 right-0 origin-left transition-transform duration-200 ease-linear"
                          style={{
                            transform: `scaleX(${Math.min(progress, 1)})`,
                          }}
                        />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Video with overlay controls */}
          <div className="w-full lg:w-[648px] h-[400px] lg:h-[738px] relative rounded-tl-2xl overflow-hidden">
            {/* Placeholder background */}
            <div
              className="absolute inset-0 bg-neutral-300"
              aria-hidden="true"
            />

            {/* Video element (hidden if no src) */}
            {items[activeIndex]?.src ? (
              <video
                ref={videoRef}
                key={items[activeIndex].id}
                src={items[activeIndex].src}
                muted
                playsInline
                autoPlay={isPlaying}
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                className={
                  "absolute inset-0 w-full h-full object-cover transition-opacity duration-500 " +
                  (fadeStage === 1 ? "opacity-100" : "opacity-0")
                }
              />
            ) : (
              <div
                className={
                  "absolute inset-0 flex items-center justify-center transition-opacity duration-500 " +
                  (fadeStage === 1 ? "opacity-100" : "opacity-0")
                }
                role="img"
                aria-label="Video placeholder"
              >
                <svg
                  width="96"
                  height="96"
                  viewBox="0 0 96 96"
                  className="text-zinc-400"
                >
                  <rect
                    x="0"
                    y="0"
                    width="96"
                    height="96"
                    rx="16"
                    fill="currentColor"
                    opacity="0.2"
                  />
                  <polygon
                    points="38,28 70,48 38,68"
                    fill="currentColor"
                    opacity="0.5"
                  />
                </svg>
              </div>
            )}

            {/* Controls: Play/Pause with circular progress */}
            <div className="absolute bottom-6 left-6">
              <button
                type="button"
                onClick={handleTogglePlay}
                aria-pressed={!isPlaying}
                aria-label={isPlaying ? "Pause video" : "Play video"}
                className="relative w-14 h-14 p-2 rounded-full flex items-center justify-center text-zinc-800 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
              >
                {/* Progress ring */}
                <svg
                  className="absolute inset-0 pointer-events-none"
                  width="56"
                  height="56"
                  viewBox="0 0 56 56"
                  aria-hidden="true"
                >
                  <circle
                    cx="28"
                    cy="28"
                    r={radius}
                    stroke="#d1d5db"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle
                    cx="28"
                    cy="28"
                    r={radius}
                    stroke="#9ca3af"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                    transform="rotate(-90 28 28)"
                  />
                </svg>

                {/* Icon */}
                <Image
                  src={isPlaying ? "/icons/pause.svg" : "/icons/play.svg"}
                  alt={isPlaying ? "Pause" : "Play"}
                  width={24}
                  height={24}
                  draggable={false}
                  className="select-none block relative z-10"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyKonversationsSection;
