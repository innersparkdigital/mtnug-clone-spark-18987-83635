import { useEffect, useRef, useState } from "react";
import hero1 from "@/assets/hero-videos/hero-1.mp4.asset.json";
import hero2 from "@/assets/hero-videos/hero-2.mp4.asset.json";

const videos = [hero1.url, hero2.url];

export default function KenyaHeroVideo() {
  const [idx, setIdx] = useState(0);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const onEnded = () => setIdx((i) => (i + 1) % videos.length);
    v.addEventListener("ended", onEnded);
    return () => v.removeEventListener("ended", onEnded);
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.load();
    v.play().catch(() => {});
  }, [idx]);

  return (
    <video
      ref={ref}
      src={videos[idx]}
      className="w-full h-full object-cover"
      autoPlay
      muted
      playsInline
      preload="auto"
    />
  );
}