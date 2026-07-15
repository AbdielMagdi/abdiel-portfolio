import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const MouseFollower: React.FC = () => {
  const [cursorType, setCursorType] = useState<'default' | 'pointer' | 'drag' | 'click'>('default');
  const [hoverText, setHoverText] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  // Position motion values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Spring animations for delay/inertia
  const springConfig = { damping: 30, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Global listener to detect hover target types and custom attributes
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Check if element is interactive
      const isClickable = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') || 
        target.classList.contains('clickable') ||
        target.getAttribute('role') === 'button';

      const customText = target.getAttribute('data-cursor-text') || target.closest('[data-cursor-text]')?.getAttribute('data-cursor-text');
      const forceType = target.getAttribute('data-cursor-type') || target.closest('[data-cursor-type]')?.getAttribute('data-cursor-type');

      if (customText) {
        setCursorType('click');
        setHoverText(customText);
      } else if (forceType === 'drag' || target.closest('.canvas-3d')) {
        setCursorType('drag');
        setHoverText('DRAG');
      } else if (isClickable) {
        setCursorType('pointer');
        setHoverText('');
      } else {
        setCursorType('default');
        setHoverText('');
      }
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver);

    // Apply custom cursor body class
    document.body.classList.add('custom-cursor-active');

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
      document.body.classList.remove('custom-cursor-active');
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  // Variants based on cursor state
  const variants = {
    default: {
      width: 12,
      height: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderColor: 'rgba(255, 255, 255, 0.8)',
    },
    pointer: {
      width: 48,
      height: 48,
      backgroundColor: 'rgba(0, 240, 255, 0.1)',
      borderColor: 'rgba(0, 240, 255, 0.6)',
      borderWidth: 1.5,
    },
    drag: {
      width: 60,
      height: 60,
      backgroundColor: 'rgba(168, 85, 247, 0.1)',
      borderColor: 'rgba(168, 85, 247, 0.6)',
      borderWidth: 1.5,
    },
    click: {
      width: 80,
      height: 80,
      backgroundColor: 'rgba(0, 240, 255, 0.15)',
      borderColor: 'rgba(0, 240, 255, 0.8)',
      borderWidth: 1.5,
    }
  };

  return (
    <>
      {/* Outer Spring Follower */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-white pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center overflow-hidden mix-blend-screen hidden md:flex"
        style={{
          x: cursorX,
          y: cursorY,
        }}
        variants={variants}
        animate={cursorType}
        transition={{ type: 'spring', damping: 30, stiffness: 350, mass: 0.2 }}
      >
        {hoverText && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[9px] font-bold tracking-[0.2em] text-cyan-400 font-orbitron select-none pointer-events-none"
          >
            {hoverText}
          </motion.span>
        )}
      </motion.div>

      {/* Inner Dot (instant tracking) */}
      <motion.div
        className="fixed top-0 left-0 w-[4px] h-[4px] bg-white rounded-full pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 mix-blend-screen hidden md:block"
        style={{
          x: mouseX,
          y: mouseY,
        }}
      />
    </>
  );
};
export default MouseFollower;
