import { motion, useReducedMotion, Variants, useScroll, useTransform, useSpring } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ReactNode, useRef } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  once?: boolean;
  threshold?: number;
  scale?: boolean;
  blur?: boolean;
}

const ScrollReveal = ({
  children,
  className = "",
  delay = 0,
  duration = 0.8,
  direction = "up",
  distance = 60,
  once = true,
  threshold = 0.1,
  scale = false,
  blur = false,
}: ScrollRevealProps) => {
  const shouldReduceMotion = useReducedMotion();
  const { ref, inView } = useInView({
    triggerOnce: once,
    threshold,
    rootMargin: "-50px 0px",
  });

  const getDirectionOffset = () => {
    switch (direction) {
      case "up":
        return { y: distance, x: 0 };
      case "down":
        return { y: -distance, x: 0 };
      case "left":
        return { x: distance, y: 0 };
      case "right":
        return { x: -distance, y: 0 };
      case "none":
        return { x: 0, y: 0 };
    }
  };

  const offset = getDirectionOffset();

  const variants: Variants = {
    hidden: {
      opacity: 0,
      ...offset,
      scale: scale ? 0.9 : 1,
      filter: blur ? "blur(12px)" : "blur(0px)",
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: shouldReduceMotion ? 0 : duration,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1], // Fruitful-style smooth ease
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Staggered container for child elements
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
  threshold?: number;
}

export const StaggerContainer = ({
  children,
  className = "",
  staggerDelay = 0.12,
  once = true,
  threshold = 0.05,
}: StaggerContainerProps) => {
  const shouldReduceMotion = useReducedMotion();
  const { ref, inView } = useInView({
    triggerOnce: once,
    threshold,
    rootMargin: "100px 0px", // Trigger earlier for better mobile experience
  });

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Child component for staggered animations
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  duration?: number;
  scale?: boolean;
}

export const StaggerItem = ({
  children,
  className = "",
  direction = "up",
  distance = 30, // Reduced distance for smoother mobile experience
  duration = 0.6,
  scale = false,
}: StaggerItemProps) => {
  const shouldReduceMotion = useReducedMotion();
  
  const getDirectionOffset = () => {
    switch (direction) {
      case "up":
        return { y: distance, x: 0 };
      case "down":
        return { y: -distance, x: 0 };
      case "left":
        return { x: distance, y: 0 };
      case "right":
        return { x: -distance, y: 0 };
      case "none":
        return { x: 0, y: 0 };
    }
  };

  const offset = getDirectionOffset();

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      ...offset,
      scale: scale ? 0.85 : 1,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : duration,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div 
      variants={itemVariants} 
      className={className}
      style={{ willChange: 'opacity, transform' }}
    >
      {children}
    </motion.div>
  );
};

// Text reveal animation for headings - Fruitful style with clip path
interface TextRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}

export const TextReveal = ({
  children,
  className = "",
  delay = 0,
  once = true,
}: TextRevealProps) => {
  const shouldReduceMotion = useReducedMotion();
  const { ref, inView } = useInView({
    triggerOnce: once,
    threshold: 0.3,
  });

  const variants: Variants = {
    hidden: {
      opacity: 0,
      y: 50,
      clipPath: "inset(100% 0% 0% 0%)",
    },
    visible: {
      opacity: 1,
      y: 0,
      clipPath: "inset(0% 0% 0% 0%)",
      transition: {
        duration: shouldReduceMotion ? 0 : 1,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Parallax scroll effect - Fruitful style with smooth spring physics
interface ParallaxProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: "up" | "down";
}

export const Parallax = ({
  children,
  className = "",
  speed = 0.3,
  direction = "up",
}: ParallaxProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const factor = direction === "up" ? -1 : 1;
  const y = useTransform(scrollYProgress, [0, 1], [100 * speed * factor, -100 * speed * factor]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      ref={ref}
      style={{ y: smoothY }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Fade on scroll - Fruitful style opacity based on scroll position
interface FadeOnScrollProps {
  children: ReactNode;
  className?: string;
  fadeIn?: boolean;
  fadeOut?: boolean;
}

export const FadeOnScroll = ({
  children,
  className = "",
  fadeIn = true,
  fadeOut = false,
}: FadeOnScrollProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  let opacity;
  if (fadeIn && fadeOut) {
    opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  } else if (fadeIn) {
    opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  } else {
    opacity = useTransform(scrollYProgress, [0.6, 1], [1, 0]);
  }

  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      ref={ref}
      style={{ opacity: smoothOpacity }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Scale on scroll - Fruitful style scale effect
interface ScaleOnScrollProps {
  children: ReactNode;
  className?: string;
  scaleFrom?: number;
  scaleTo?: number;
}

export const ScaleOnScroll = ({
  children,
  className = "",
  scaleFrom = 0.9,
  scaleTo = 1,
}: ScaleOnScrollProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [scaleFrom, scaleTo]);
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      ref={ref}
      style={{ scale: smoothScale }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Horizontal scroll reveal - Fruitful style slide in from sides
interface SlideInProps {
  children: ReactNode;
  className?: string;
  from?: "left" | "right";
  distance?: number;
  delay?: number;
}

export const SlideIn = ({
  children,
  className = "",
  from = "left",
  distance = 100,
  delay = 0,
}: SlideInProps) => {
  const shouldReduceMotion = useReducedMotion();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "-50px 0px",
  });

  const x = from === "left" ? -distance : distance;

  const variants: Variants = {
    hidden: {
      opacity: 0,
      x,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.9,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Rotate on scroll - Fruitful style rotation effect
interface RotateOnScrollProps {
  children: ReactNode;
  className?: string;
  degrees?: number;
}

export const RotateOnScroll = ({
  children,
  className = "",
  degrees = 5,
}: RotateOnScrollProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [-degrees, degrees]);
  const smoothRotate = useSpring(rotate, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      ref={ref}
      style={{ rotate: smoothRotate }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Word by word reveal animation - Fruitful style
interface WordRevealProps {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
}

export const WordReveal = ({
  text,
  className = "",
  delay = 0,
  once = true,
}: WordRevealProps) => {
  const shouldReduceMotion = useReducedMotion();
  const { ref, inView } = useInView({
    triggerOnce: once,
    threshold: 0.3,
  });

  const words = text.split(" ");

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: delay,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 30,
      rotateX: 45,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.span
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
      className={className}
      style={{ display: "inline-flex", flexWrap: "wrap", gap: "0.3em" }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={wordVariants}
          style={{ display: "inline-block", transformOrigin: "center bottom" }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
};

// Character by character reveal - Fruitful style
interface CharRevealProps {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
}

export const CharReveal = ({
  text,
  className = "",
  delay = 0,
  once = true,
}: CharRevealProps) => {
  const shouldReduceMotion = useReducedMotion();
  const { ref, inView } = useInView({
    triggerOnce: once,
    threshold: 0.3,
  });

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.03,
        delayChildren: delay,
      },
    },
  };

  const charVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.span
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
      className={className}
      style={{ display: "inline-block" }}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          variants={charVariants}
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
};

export default ScrollReveal;
