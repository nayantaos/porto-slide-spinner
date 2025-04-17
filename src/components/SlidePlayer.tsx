
import { useState, useEffect, useCallback } from "react";
import { SlideConfig, SlidePlayerConfig } from "@/types/slide";
import ThreeDSlide from "./ThreeDSlide";
import VideoSlide from "./VideoSlide";

const SlidePlayer = () => {
  const [config, setConfig] = useState<SlidePlayerConfig | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fadeOut, setFadeOut] = useState<boolean>(false);

  // Fetch configuration
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/config.json');
        if (!response.ok) {
          throw new Error("Failed to load configuration file");
        }
        const data = await response.json();
        setConfig(data);
      } catch (err) {
        setError("Error loading configuration: " + (err instanceof Error ? err.message : String(err)));
        console.error("Error loading configuration:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  // Handle slide transitions
  const goToNextSlide = useCallback(() => {
    if (!config) return;
    
    setFadeOut(true);
    
    // Wait for fade out animation to complete
    setTimeout(() => {
      setCurrentSlideIndex((prevIndex) => 
        prevIndex + 1 >= config.files.length ? 0 : prevIndex + 1
      );
      setFadeOut(false);
    }, 500); // Match with the fade-out animation duration
  }, [config]);

  // Set up timer for automatic transitions
  useEffect(() => {
    if (!config || config.files.length === 0) return;
    
    const currentSlide = config.files[currentSlideIndex];
    const timer = setTimeout(goToNextSlide, currentSlide.rotation_time * 1000);
    
    return () => clearTimeout(timer);
  }, [currentSlideIndex, config, goToNextSlide]);

  // Error state
  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center p-4">
          <h1 className="text-2xl mb-4">Error</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading || !config || config.files.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black text-white">
        <p>Loading...</p>
      </div>
    );
  }

  const currentSlide: SlideConfig = config.files[currentSlideIndex];

  return (
    <div className="w-full h-screen overflow-hidden bg-black">
      <div className={`w-full h-full transition-opacity duration-500 ${fadeOut ? 'animate-fade-out' : 'animate-fade-in'}`}>
        {currentSlide.type === "3d" ? (
          <ThreeDSlide slide={currentSlide} />
        ) : (
          <VideoSlide slide={currentSlide} />
        )}
      </div>
    </div>
  );
};

export default SlidePlayer;
