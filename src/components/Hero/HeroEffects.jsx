import { useEffect, useRef, useMemo } from 'react';
import useMousePosition from '../../hooks/useMousePosition';
import './HeroEffects.css';

export function HeroEffects({ animationProgress = 0 }) {
  const canvasRef = useRef(null);
  const mousePosition = useMousePosition();
  const particlesRef = useRef([]);
  const animationFrameRef = useRef(null);

  // Particle configuration
  const particleConfig = useMemo(() => ({
    count: typeof window !== 'undefined' && window.innerWidth < 768 ? 30 : 60,
    maxRadius: 3,
    minRadius: 1,
    speed: 0.3,
    glowIntensity: 0.6,
  }), []);

  // Initialize particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particles
    const createParticles = () => {
      const particles = [];
      for (let i = 0; i < particleConfig.count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * (particleConfig.maxRadius - particleConfig.minRadius) + particleConfig.minRadius,
          vx: (Math.random() - 0.5) * particleConfig.speed,
          vy: (Math.random() - 0.5) * particleConfig.speed,
          alpha: Math.random() * 0.5 + 0.2,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.02,
        });
      }
      return particles;
    };

    particlesRef.current = createParticles();

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.pulse += particle.pulseSpeed;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Mouse interaction - subtle repulsion
        const dx = particle.x - mousePosition.x;
        const dy = particle.y - mousePosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const interactionRadius = 150;

        if (distance < interactionRadius) {
          const force = (interactionRadius - distance) / interactionRadius;
          particle.x += (dx / distance) * force * 2;
          particle.y += (dy / distance) * force * 2;
        }

        // Calculate pulse alpha
        const pulseAlpha = particle.alpha + Math.sin(particle.pulse) * 0.2;

        // Draw particle glow
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius * 3
        );
        gradient.addColorStop(0, `rgba(214, 181, 107, ${pulseAlpha * particleConfig.glowIntensity})`);
        gradient.addColorStop(0.5, `rgba(214, 181, 107, ${pulseAlpha * particleConfig.glowIntensity * 0.3})`);
        gradient.addColorStop(1, 'rgba(214, 181, 107, 0)');

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw particle core
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 239, 230, ${pulseAlpha})`;
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [particleConfig, mousePosition]);

  return (
    <div className="hero-effects">
      {/* Canvas for particles */}
      <canvas
        ref={canvasRef}
        className="hero-particles"
        style={{ opacity: animationProgress > 0.5 ? 1 : 0 }}
      />

      {/* Volumetric light rays */}
      <div className="hero-volumetric">
        <div
          className="hero-light-ray ray-1"
          style={{
            opacity: animationProgress > 0.2 ? Math.min((animationProgress - 0.2) * 1.5, 0.15) : 0
          }}
        />
        <div
          className="hero-light-ray ray-2"
          style={{
            opacity: animationProgress > 0.3 ? Math.min((animationProgress - 0.3) * 1.5, 0.12) : 0
          }}
        />
        <div
          className="hero-light-ray ray-3"
          style={{
            opacity: animationProgress > 0.25 ? Math.min((animationProgress - 0.25) * 1.5, 0.1) : 0
          }}
        />
      </div>

      {/* Fog layers */}
      <div
        className="hero-fog"
        style={{ opacity: animationProgress > 0.35 ? Math.min((animationProgress - 0.35) * 2, 0.4) : 0 }}
      />
      <div
        className="hero-fog hero-fog-2"
        style={{ opacity: animationProgress > 0.4 ? Math.min((animationProgress - 0.4) * 2, 0.3) : 0 }}
      />

      {/* Golden ambient glow */}
      <div
        className="hero-ambient-glow"
        style={{ opacity: animationProgress > 0.15 ? Math.min((animationProgress - 0.15) * 2, 0.6) : 0 }}
      />

      {/* Mouse-reactive spotlight */}
      <div
        className="hero-spotlight"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(214, 181, 107, 0.08), transparent 60%)`,
          opacity: animationProgress > 0.5 ? 1 : 0,
        }}
      />

      {/* Floating golden orbs */}
      <div
        className="hero-orb orb-1"
        style={{ opacity: animationProgress > 0.4 ? Math.min((animationProgress - 0.4) * 2, 0.3) : 0 }}
      />
      <div
        className="hero-orb orb-2"
        style={{ opacity: animationProgress > 0.5 ? Math.min((animationProgress - 0.5) * 2, 0.2) : 0 }}
      />
    </div>
  );
}

export default HeroEffects;