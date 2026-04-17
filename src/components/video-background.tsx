import { useRef, useState } from "react";

interface VideoBackgroundProps {
  src: string;
  className?: string;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({ src, className }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [opacity, setOpacity] = useState(0);
  const opacityRef = useRef(0);
  const fadeRequestIdRef = useRef<number | null>(null);
  const fadingOutRef = useRef(false);

  const FADE_DURATION = 250; // ms
  const FADE_OUT_THRESHOLD = 0.55; // seconds before end

  const cancelFade = () => {
    if (fadeRequestIdRef.current !== null) {
      cancelAnimationFrame(fadeRequestIdRef.current);
      fadeRequestIdRef.current = null;
    }
  };

  const startFade = (targetOpacity: number, duration: number) => {
    cancelFade();
    
    const startTime = performance.now();
    const initialOpacity = opacityRef.current;
    
    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const newOpacity = initialOpacity + (targetOpacity - initialOpacity) * progress;
      setOpacity(newOpacity);
      opacityRef.current = newOpacity;

      if (progress < 1) {
        fadeRequestIdRef.current = requestAnimationFrame(animate);
      } else {
        fadeRequestIdRef.current = null;
      }
    };

    fadeRequestIdRef.current = requestAnimationFrame(animate);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const remainingTime = video.duration - video.currentTime;

    // Trigger fade-out
    if (remainingTime <= FADE_OUT_THRESHOLD && !fadingOutRef.current) {
      fadingOutRef.current = true;
      startFade(0, FADE_DURATION);
    }
  };

  const handleEnded = () => {
    const video = videoRef.current;
    if (!video) return;

    video.style.opacity = "0";
    setOpacity(0);
    opacityRef.current = 0;
    
    setTimeout(() => {
      video.currentTime = 0;
      fadingOutRef.current = false;
      video.play().catch(console.error);
      startFade(1, FADE_DURATION);
    }, 100);
  };

  const handleLoadedData = () => {
    startFade(1, FADE_DURATION);
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-black">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedData={handleLoadedData}
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[115%] h-[115%] object-cover object-top ${className}`}
        style={{ opacity: opacity }}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
};
