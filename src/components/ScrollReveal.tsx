import { motion, useReducedMotion, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ReactNode } from "react";

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
  duration = 0.6,
  direction = "up",
  distance = 40,
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
      scale: scale ? 0.95 : 1,
      filter: blur ? "blur(10px)" : "blur(0px)",
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
        ease: [0.25, 0.4, 0.25, 1],
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
  staggerDelay = 0.1,
  once = true,
  threshold = 0.1,
}: StaggerContainerProps) => {
  const shouldReduceMotion = useReducedMotion();
  const { ref, inView } = useInView({
    triggerOnce: once,
    threshold,
    rootMargin: "-50px 0px",
  });

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : staggerDelay,
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
  distance = 30,
  duration = 0.5,
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
      scale: scale ? 0.9 : 1,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : duration,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
};

// Text reveal animation for headings
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
      y: 30,
      clipPath: "inset(100% 0% 0% 0%)",
    },
    visible: {
      opacity: 1,
      y: 0,
      clipPath: "inset(0% 0% 0% 0%)",
      transition: {
        duration: shouldReduceMotion ? 0 : 0.8,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.25, 0.4, 0.25, 1],
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

// Parallax scroll effect
interface ParallaxProps {
  children: ReactNode;
  className?: string;
  speed?: number;
}

export const Parallax = ({
  children,
  className = "",
  speed = 0.5,
}: ParallaxProps) => {
  return (
    <motion.div
      className={className}
      initial={{ y: 0 }}
      whileInView={{ y: 0 }}
      viewport={{ once: false }}
      style={{ willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
