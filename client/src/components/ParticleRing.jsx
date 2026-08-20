import { useEffect, useRef } from 'react';

const COLORS = ['#4285f4', '#7b61ff', '#ea4335', '#a855f7'];

export default function ParticleRing({ className = 'pointer-events-none absolute inset-0 h-full w-full' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const pointer = { x: -1000, y: -1000 };
    let frameId;
    let particles = [];
    let ambientParticles = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.min(260, Math.max(130, Math.floor(rect.width / 5)));
      particles = Array.from({ length: count }, () => ({
        angle: Math.random() * Math.PI * 2,
        radius: 100 + Math.random() * Math.min(rect.width * 0.42, 520),
        speed: 0.0012 + Math.random() * 0.0034,
        size: 1 + Math.random() * 2.4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        x: rect.width / 2,
        y: rect.height / 2,
      }));
      ambientParticles = Array.from({ length: Math.floor(count * 0.72) }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        speedX: (Math.random() - 0.5) * 0.12,
        speedY: -0.04 - Math.random() * 0.14,
        size: 1 + Math.random() * 1.6,
        rotation: Math.random() * Math.PI,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    };

    const onPointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };

    const draw = (time = 0) => {
      const { width, height } = canvas.getBoundingClientRect();
      context.clearRect(0, 0, width, height);
      const centerX = width / 2;
      const centerY = height * 0.49;

      const breath = 1 + Math.sin(time * 0.00105) * 0.038;

      ambientParticles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        if (particle.x < -12) particle.x = width + 12;
        if (particle.x > width + 12) particle.x = -12;
        if (particle.y < -12) particle.y = height + 12;

        context.save();
        context.translate(particle.x, particle.y);
        context.rotate(particle.rotation);
        context.fillStyle = particle.color;
        context.globalAlpha = 0.46;
        context.fillRect(-particle.size / 2, -particle.size * 2, particle.size, particle.size * 4);
        context.restore();
      });

      particles.forEach((particle) => {
        particle.angle += particle.speed;
        const baseX = centerX + Math.cos(particle.angle) * particle.radius * breath;
        const baseY = centerY + Math.sin(particle.angle) * particle.radius * 0.62 * breath;
        const dx = pointer.x - baseX;
        const dy = pointer.y - baseY;
        const distance = Math.hypot(dx, dy) || 1;
        const influence = Math.max(0, 1 - distance / 135);
        const offset = influence * 42;
        particle.x += (baseX - (dx / distance) * offset - particle.x) * 0.16;
        particle.y += (baseY - (dy / distance) * offset - particle.y) * 0.16;

        context.save();
        context.translate(particle.x, particle.y);
        context.rotate(particle.angle + Math.PI / 2);
        context.fillStyle = particle.color;
        context.globalAlpha = 0.38 + influence * 0.5;
        context.fillRect(-particle.size / 2, -particle.size * 1.8, particle.size, particle.size * 3.6);
        context.restore();
      });
      frameId = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove);
    draw();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
