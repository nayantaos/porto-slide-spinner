
import { useEffect, useRef } from "react";
import { SlideConfig } from "@/types/slide";

interface VideoSlideProps {
  slide: SlideConfig;
}

const VideoSlide = ({ slide }: VideoSlideProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Autoplay prevented:", error);
      });
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };
  }, [slide]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <video
        ref={videoRef}
        src={slide.file}
        className="max-h-full max-w-full object-contain"
        autoPlay
        playsInline
        muted
      />
    </div>
  );
};

export default VideoSlide;
