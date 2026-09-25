import React, { useEffect, useRef, useState } from 'react';

export default function InteractiveBackground({ theme = 'constellation' }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, isDown: false, radius: 160 });
  const ripplesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    // Track mouse on entire window so buttons still trigger it
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseDown = (e) => {
      mouseRef.current.isDown = true;
      // Add ripple shockwave
      ripplesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: 180,
        opacity: 0.6,
      });
      if (ripplesRef.current.length > 5) {
        ripplesRef.current.shift();
      }
    };

    const handleMouseUp = () => {
      mouseRef.current.isDown = false;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Particle Generation
    let particles = [];
    const particleCount = Math.min(100, Math.floor((width * height) / 14000));

    function initParticles() {
      particles = [];
      const colors = [
        'rgba(56, 189, 248, ',  // Sky/Cyan
        'rgba(129, 140, 248, ', // Indigo
        'rgba(168, 85, 247, ',  // Purple
        'rgba(52, 211, 153, ',  // Emerald
      ];

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.7,
          vy: (Math.random() - 0.5) * 0.7,
          baseRadius: Math.random() * 2 + 1.2,
          radius: Math.random() * 2 + 1.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          baseAlpha: Math.random() * 0.4 + 0.3,
        });
      }
    }

    initParticles();

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;

      // 1. Draw Subtle Mouse Follow Radial Glow Spotlight
      if (mouse.x > 0 && mouse.y > 0) {
        const mouseGlow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          320
        );
        mouseGlow.addColorStop(0, 'rgba(56, 189, 248, 0.08)');
        mouseGlow.addColorStop(0.5, 'rgba(99, 102, 241, 0.03)');
        mouseGlow.addColorStop(1, 'rgba(15, 23, 42, 0)');
        ctx.fillStyle = mouseGlow;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Process Shockwave Ripples from clicks
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const rip = ripplesRef.current[i];
        rip.radius += 4;
        rip.opacity -= 0.015;

        if (rip.opacity <= 0 || rip.radius >= rip.maxRadius) {
          ripplesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${rip.opacity})`;
        ctx.lineWidth = 2;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.restore();
      }

      // 3. Update and Draw Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Distance from mouse
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Interactive mouse interaction: pull gently or push
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          
          // Subtle repulsion on hover, suction on click
          if (mouse.isDown) {
            p.x += Math.cos(angle) * force * 5;
            p.y += Math.sin(angle) * force * 5;
          } else {
            p.x -= Math.cos(angle) * force * 2.2;
            p.y -= Math.sin(angle) * force * 2.2;
          }

          // Connect particle to mouse with glowing line
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          const mouseLineAlpha = (1 - dist / mouse.radius) * 0.45;
          ctx.strokeStyle = `rgba(56, 189, 248, ${mouseLineAlpha})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          p.radius = p.baseRadius * 1.6;
        } else {
          p.radius = p.baseRadius;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.baseAlpha})`;
        ctx.fill();

        // Connect nearby particles to form constellation graph
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distBetween = Math.hypot(p.x - p2.x, p.y - p2.y);
          const maxLinkDist = 125;

          if (distBetween < maxLinkDist) {
            const lineAlpha = (1 - distBetween / maxLinkDist) * 0.18;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(148, 163, 184, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, #0f172a 0%, #070b14 60%, #030712 100%)',
      }}
    />
  );
}
