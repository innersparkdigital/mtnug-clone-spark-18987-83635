import { useState, useRef, useEffect, ImgHTMLAttributes } from "react";

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  /** Set to true for above-the-fold images (hero, first visible) */
  priority?: boolean;
}

const OptimizedImage = ({ src, alt, priority = false, className = "", style, ...props }: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [priority]);

  return (
    <img
      ref={imgRef}
      src={isInView ? src : undefined}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      onLoad={() => setIsLoaded(true)}
      className={`${className} transition-opacity duration-300 ${isLoaded || !isInView ? "opacity-100" : "opacity-0"}`}
      style={style}
      {...props}
    />
  );
};

export default OptimizedImage;
