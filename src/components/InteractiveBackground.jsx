import { useEffect, useRef } from 'react';

const InteractiveBackground = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({
    x: -1000,
    y: -1000,
    down: false,
  });

  const ripplesRef = useRef([]);
  const particlesRef = useRef([]);
  const labelsRef = useRef([]);
  const barsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    let width = 0;
    let height = 0;
    let animationId;

    const algorithmLabels = [
      'O(n)',
      'O(log n)',
      'O(n²)',
      'O(1)',
      'DFS',
      'BFS',
      'SORT',
      'SEARCH',
      'GRAPH',
      'TREE',
      'STACK',
      'QUEUE',
      'HASH',
      'DP',
      'GREEDY',
      'RECURSION',
      '101010',
      '110101',
      '010110',
      '001101',
    ];

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const createParticles = () => {
      const count = Math.min(
        75,
        Math.max(35, Math.floor((width * height) / 18000))
      );

      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 2 + 1,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.025 + 0.01,
      }));
    };

    const createLabels = () => {
      labelsRef.current = algorithmLabels.map((text) => ({
        text,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        opacity: Math.random() * 0.25 + 0.12,
        size: Math.random() * 7 + 12,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const createBars = () => {
      barsRef.current = Array.from({ length: 16 }, (_, index) => ({
        value: Math.random() * 0.8 + 0.2,
        target: Math.random() * 0.8 + 0.2,
        speed: 0.015 + Math.random() * 0.025,
        index,
      }));
    };

    const drawBackground = () => {
      const gradient = ctx.createRadialGradient(
        width * 0.5,
        height * 0.15,
        0,
        width * 0.5,
        height * 0.5,
        Math.max(width, height)
      );

      gradient.addColorStop(0, '#111c35');
      gradient.addColorStop(0.35, '#0a1224');
      gradient.addColorStop(0.7, '#050b18');
      gradient.addColorStop(1, '#020617');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    };

    const drawGrid = () => {
      const gridSize = 45;

      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.055)';
      ctx.lineWidth = 1;

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      ctx.restore();
    };

    const drawMouseGlow = () => {
      const mouse = mouseRef.current;

      if (mouse.x < 0 || mouse.y < 0) return;

      const gradient = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        220
      );

      gradient.addColorStop(0, 'rgba(34, 211, 238, 0.12)');
      gradient.addColorStop(0.35, 'rgba(59, 130, 246, 0.06)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 220, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawBinaryTree = () => {
      const startX = width * 0.78;
      const startY = height * 0.18;

      const nodes = [];

      for (let level = 0; level < 4; level++) {
        const count = Math.pow(2, level);
        const spacing = 110 / Math.pow(1.55, level);

        for (let i = 0; i < count; i++) {
          const x =
            startX +
            (i - (count - 1) / 2) * spacing;

          const y = startY + level * 55;

          nodes.push({
            x,
            y,
            level,
            index: i,
          });
        }
      }

      ctx.save();

      ctx.lineWidth = 1;

      for (let i = 1; i < nodes.length; i++) {
        const parent = nodes[Math.floor((i - 1) / 2)];
        const child = nodes[i];

        ctx.strokeStyle = 'rgba(34, 211, 238, 0.16)';

        ctx.beginPath();
        ctx.moveTo(parent.x, parent.y);
        ctx.lineTo(child.x, child.y);
        ctx.stroke();
      }

      nodes.forEach((node) => {
        ctx.fillStyle = 'rgba(34, 211, 238, 0.18)';
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.55)';
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      ctx.restore();
    };

    const updateParticles = () => {
      const mouse = mouseRef.current;

      particlesRef.current.forEach((particle) => {
        particle.pulse += particle.pulseSpeed;

        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < -20) particle.x = width + 20;
        if (particle.x > width + 20) particle.x = -20;

        if (particle.y < -20) particle.y = height + 20;
        if (particle.y > height + 20) particle.y = -20;

        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 180) {
          if (mouse.down) {
            particle.vx += (dx / distance) * 0.008;
            particle.vy += (dy / distance) * 0.008;
          } else {
            particle.vx -= (dx / distance) * 0.018;
            particle.vy -= (dy / distance) * 0.018;
          }
        }

        particle.vx *= 0.995;
        particle.vy *= 0.995;

        const maxSpeed = 0.75;

        particle.vx = Math.max(
          -maxSpeed,
          Math.min(maxSpeed, particle.vx)
        );

        particle.vy = Math.max(
          -maxSpeed,
          Math.min(maxSpeed, particle.vy)
        );
      });
    };

    const drawConnections = () => {
      const particles = particlesRef.current;

      ctx.save();
      ctx.lineWidth = 1;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];

          const dx = a.x - b.x;
          const dy = a.y - b.y;

          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 135) {
            const alpha =
              (1 - distance / 135) * 0.38;

            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      ctx.restore();
    };

    const drawParticles = () => {
      const mouse = mouseRef.current;

      particlesRef.current.forEach((particle) => {
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        let glow = 0;

        if (distance < 180) {
          glow = 1 - distance / 180;
        }

        const pulse =
          Math.sin(particle.pulse) * 0.5 + 0.5;

        const radius =
          particle.radius + pulse * 0.8 + glow * 1.8;

        ctx.save();

        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(34, 211, 238, 0.7)';

        ctx.fillStyle = `rgba(34, 211, 238, ${
          0.35 + glow * 0.45
        })`;

        ctx.beginPath();
        ctx.arc(
          particle.x,
          particle.y,
          radius,
          0,
          Math.PI * 2
        );
        ctx.fill();

        ctx.restore();
      });
    };

    const updateLabels = () => {
      labelsRef.current.forEach((label) => {
        label.x += label.vx;
        label.y += label.vy;
        label.phase += 0.01;

        if (label.x < -100) label.x = width + 100;
        if (label.x > width + 100) label.x = -100;

        if (label.y < -50) label.y = height + 50;
        if (label.y > height + 50) label.y = -50;
      });
    };

    const drawLabels = () => {
      labelsRef.current.forEach((label) => {
        const floatingOpacity =
          label.opacity +
          Math.sin(label.phase) * 0.04;

        ctx.save();

        ctx.font = `600 ${label.size}px monospace`;
        ctx.fillStyle = `rgba(103, 232, 249, ${Math.max(
          0.04,
          floatingOpacity
        )})`;

        ctx.fillText(
          label.text,
          label.x,
          label.y
        );

        ctx.restore();
      });
    };

    const updateBars = () => {
      barsRef.current.forEach((bar) => {
        if (Math.abs(bar.value - bar.target) < 0.01) {
          bar.target = Math.random() * 0.85 + 0.15;
        }

        bar.value +=
          (bar.target - bar.value) * bar.speed;
      });
    };

    const drawSortingBars = () => {
      const barWidth = 8;
      const gap = 5;

      const totalWidth =
        barsRef.current.length *
        (barWidth + gap);

      const startX = 45;
      const baseY = height - 45;

      ctx.save();

      ctx.font = '11px monospace';
      ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
      ctx.fillText(
        'SORTING',
        startX,
        baseY - 110
      );

      barsRef.current.forEach((bar, index) => {
        const barHeight = bar.value * 90;

        const x =
          startX + index * (barWidth + gap);

        const y = baseY - barHeight;

        ctx.fillStyle = `rgba(34, 211, 238, ${
          0.18 + bar.value * 0.35
        })`;

        ctx.fillRect(
          x,
          y,
          barWidth,
          barHeight
        );

        ctx.strokeStyle =
          'rgba(34, 211, 238, 0.35)';

        ctx.strokeRect(
          x,
          y,
          barWidth,
          barHeight
        );
      });

      ctx.restore();
    };

    const createRipple = (x, y) => {
      ripplesRef.current.push({
        x,
        y,
        radius: 0,
        alpha: 0.65,
      });

      if (ripplesRef.current.length > 8) {
        ripplesRef.current.shift();
      }
    };

    const updateRipples = () => {
      ripplesRef.current.forEach((ripple) => {
        ripple.radius += 3;
        ripple.alpha *= 0.96;
      });

      ripplesRef.current =
        ripplesRef.current.filter(
          (ripple) => ripple.alpha > 0.03
        );
    };

    const drawRipples = () => {
      ripplesRef.current.forEach((ripple) => {
        ctx.save();

        ctx.strokeStyle = `rgba(34, 211, 238, ${ripple.alpha})`;
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        ctx.arc(
          ripple.x,
          ripple.y,
          ripple.radius,
          0,
          Math.PI * 2
        );
        ctx.stroke();

        ctx.strokeStyle = `rgba(59, 130, 246, ${
          ripple.alpha * 0.45
        })`;

        ctx.beginPath();
        ctx.arc(
          ripple.x,
          ripple.y,
          ripple.radius * 0.55,
          0,
          Math.PI * 2
        );
        ctx.stroke();

        ctx.restore();
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      drawBackground();
      drawGrid();

      updateParticles();
      updateLabels();
      updateBars();
      updateRipples();

      drawConnections();
      drawBinaryTree();
      drawLabels();
      drawSortingBars();
      drawParticles();
      drawRipples();
      drawMouseGlow();

      animationId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (event) => {
      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
    };

    const handleMouseDown = (event) => {
      mouseRef.current.down = true;
      createRipple(
        event.clientX,
        event.clientY
      );
    };

    const handleMouseUp = () => {
      mouseRef.current.down = false;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
      mouseRef.current.down = false;
    };

    resizeCanvas();
    createParticles();
    createLabels();
    createBars();

    window.addEventListener(
      'resize',
      resizeCanvas
    );

    window.addEventListener(
      'resize',
      createParticles
    );

    window.addEventListener(
      'resize',
      createLabels
    );

    window.addEventListener(
      'mousemove',
      handleMouseMove
    );

    window.addEventListener(
      'mousedown',
      handleMouseDown
    );

    window.addEventListener(
      'mouseup',
      handleMouseUp
    );

    window.addEventListener(
      'mouseleave',
      handleMouseLeave
    );

    animate();

    return () => {
      cancelAnimationFrame(animationId);

      window.removeEventListener(
        'resize',
        resizeCanvas
      );

      window.removeEventListener(
        'resize',
        createParticles
      );

      window.removeEventListener(
        'resize',
        createLabels
      );

      window.removeEventListener(
        'mousemove',
        handleMouseMove
      );

      window.removeEventListener(
        'mousedown',
        handleMouseDown
      );

      window.removeEventListener(
        'mouseup',
        handleMouseUp
      );

      window.removeEventListener(
        'mouseleave',
        handleMouseLeave
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{
        background:
          'radial-gradient(ellipse at 50% 0%, #111c35 0%, #050b18 65%, #020617 100%)',
      }}
    />
  );
};

export default InteractiveBackground;