import * as React from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { cn } from '@/lib/utils';

function BubbleBackground({
  className,
  children,
  interactive = false,
  transition = { stiffness: 100, damping: 20 },
  colors = {
    first: '18,113,255',
    second: '221,74,255',
    third: '0,220,255',
    fourth: '200,50,50',
    fifth: '180,180,50',
    sixth: '140,100,255',
  },
  style,
  ...props
}) {
  const containerRef = React.useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, transition);
  const springY = useSpring(mouseY, transition);
  const rectRef = React.useRef(null);
  const rafIdRef = React.useRef(null);

  React.useEffect(() => {
    const updateRect = () => {
      if (containerRef.current) {
        rectRef.current = containerRef.current.getBoundingClientRect();
      }
    };
    updateRect();
    const el = containerRef.current;
    const ro = new ResizeObserver(updateRect);
    if (el) ro.observe(el);
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
    };
  }, []);

  React.useEffect(() => {
    if (!interactive) return;
    const el = containerRef.current;
    if (!el) return;
    const handleMouseMove = (e) => {
      const rect = rectRef.current;
      if (!rect) return;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(() => {
        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
      });
    };
    el.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
    };
  }, [interactive, mouseX, mouseY]);

  const bubbleStyle = (extra) => ({
    position: 'absolute',
    borderRadius: '50%',
    mixBlendMode: 'hard-light',
    transform: 'translateZ(0)',
    willChange: 'transform',
    ...extra,
  });

  return (
    <div
      ref={containerRef}
      data-slot="bubble-background"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1a0533 0%, #0d1a4a 100%)',
        ...style,
      }}
      {...props}
    >
      <style>{`
        :root {
          --first-color: ${colors.first};
          --second-color: ${colors.second};
          --third-color: ${colors.third};
          --fourth-color: ${colors.fourth};
          --fifth-color: ${colors.fifth};
          --sixth-color: ${colors.sixth};
        }
      `}</style>

      <svg style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0 }}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div style={{ position: 'absolute', inset: 0, filter: 'url(#goo) blur(40px)' }}>
        {/* Bubble 1 — vertical float */}
        <motion.div
          style={bubbleStyle({
            width: '80%', height: '80%', top: '10%', left: '10%',
            background: 'radial-gradient(circle at center, rgba(var(--first-color),0.8) 0%, rgba(var(--first-color),0) 50%)',
          })}
          animate={{ y: [-50, 50, -50] }}
          transition={{ duration: 30, ease: 'easeInOut', repeat: Infinity }}
        />

        {/* Bubble 2 — orbit */}
        <motion.div
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            transformOrigin: 'calc(50% - 400px)',
            willChange: 'transform',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, ease: 'linear', repeat: Infinity, repeatType: 'loop' }}
        >
          <div style={{
            borderRadius: '50%', width: '80%', height: '80%',
            mixBlendMode: 'hard-light',
            background: 'radial-gradient(circle at center, rgba(var(--second-color),0.8) 0%, rgba(var(--second-color),0) 50%)',
          }} />
        </motion.div>

        {/* Bubble 3 — orbit opposite */}
        <motion.div
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            transformOrigin: 'calc(50% + 400px)',
            willChange: 'transform',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 40, ease: 'linear', repeat: Infinity }}
        >
          <div style={{
            position: 'absolute', borderRadius: '50%', width: '80%', height: '80%',
            mixBlendMode: 'hard-light',
            background: 'radial-gradient(circle at center, rgba(var(--third-color),0.8) 0%, rgba(var(--third-color),0) 50%)',
            top: 'calc(50% + 200px)', left: 'calc(50% - 500px)',
          }} />
        </motion.div>

        {/* Bubble 4 — horizontal drift */}
        <motion.div
          style={bubbleStyle({
            width: '80%', height: '80%', top: '10%', left: '10%', opacity: 0.7,
            background: 'radial-gradient(circle at center, rgba(var(--fourth-color),0.8) 0%, rgba(var(--fourth-color),0) 50%)',
          })}
          animate={{ x: [-50, 50, -50] }}
          transition={{ duration: 40, ease: 'easeInOut', repeat: Infinity }}
        />

        {/* Bubble 5 — large slow orbit */}
        <motion.div
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            transformOrigin: 'calc(50% - 800px) calc(50% + 200px)',
            willChange: 'transform',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
        >
          <div style={{
            position: 'absolute', borderRadius: '50%', width: '160%', height: '160%',
            mixBlendMode: 'hard-light',
            background: 'radial-gradient(circle at center, rgba(var(--fifth-color),0.8) 0%, rgba(var(--fifth-color),0) 50%)',
            top: 'calc(50% - 80%)', left: 'calc(50% - 80%)',
          }} />
        </motion.div>

        {/* Bubble 6 — interactive cursor follower */}
        {interactive && (
          <motion.div
            style={{
              position: 'absolute', borderRadius: '50%',
              width: '100%', height: '100%',
              mixBlendMode: 'hard-light', opacity: 0.7,
              background: 'radial-gradient(circle at center, rgba(var(--sixth-color),0.8) 0%, rgba(var(--sixth-color),0) 50%)',
              x: springX, y: springY,
              willChange: 'transform',
            }}
          />
        )}
      </div>

      {children}
    </div>
  );
}

export { BubbleBackground };
