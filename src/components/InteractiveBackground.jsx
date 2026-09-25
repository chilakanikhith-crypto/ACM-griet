import React, { useEffect, useRef } from 'react';

export default function InteractiveBackground() {
  const canvasRef = useRef(null);

  const mouseRef = useRef({
    x: -1000,
    y: -1000,
    isDown: false,
    radius: 180,
  });

  const ripplesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let animationFrameId;

    const mouse = mouseRef.current;

    const nodes = [];
    const numbers = [];
    const bars = [];

    const nodeCount = Math.min(
      42,
      Math.max(24, Math.floor((width * height) / 32000))
    );

    function createNodes() {
      nodes.length = 0;

      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: Math.random() * 2 + 2,
          pulse: Math.random() * Math.PI * 2,
        });
      }
    }

    function createNumbers() {
      numbers.length = 0;

      const values = [
        'O(n)',
        'O(log n)',
        'O(n²)',
        '01',
        '10',
        '101',
        '42',
        '64',
        '128',
        '256',
        'A',
        'B',
        'C',
        'DFS',
        'BFS',
        'SORT',
        'SEARCH',
      ];

      for (let i = 0; i < 25; i++) {
        numbers.push({
          text: values[Math.floor(Math.random() * values.length)],
          x: Math.random() * width,
          y: Math.random() * height,
          speed: Math.random() * 0.25 + 0.08,
          opacity: Math.random() * 0.16 + 0.05,
          size: Math.random() * 5 + 10,
        });
      }
    }

    function createBars() {
      bars.length = 0;

      for (let i = 0; i < 18; i++) {
        bars.push({
          height: Math.random() * 70 + 20,
          target: Math.random() * 100 + 20,
          speed: Math.random() * 0.8 + 0.2,
        });
      }
    }

    function initialize() {
      createNodes();
      createNumbers();
      createBars();
    }

    initialize();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initialize();
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseDown = (e) => {
      mouse.isDown = true;

      ripplesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: 220,
        opacity: 0.7,
      });

      if (ripplesRef.current.length > 6) {
        ripplesRef.current.shift();
      }
    };

    const handleMouseUp = () => {
      mouse.isDown = false;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    function drawGrid() {
      const gridSize = 80;

      ctx.save();

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.035)';
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
    }

    function drawTree() {
      const centerX = width * 0.82;
      const startY = height * 0.18;

      const treeNodes = [];

      for (let level = 0; level < 4; level++) {
        const count = Math.pow(2, level);
        const spacing = Math.min(100, width / (count + 2));

        for (let i = 0; i < count; i++) {
          const x =
            centerX +
            (i - (count - 1) / 2) * spacing;

          const y = startY + level * 70;

          treeNodes.push({
            x,
            y,
            level,
            index: i,
          });
        }
      }

      ctx.save();

      for (let i = 1; i < treeNodes.length; i++) {
        const child = treeNodes[i];

        const parentIndex = Math.floor((i - 1) / 2);
        const parent = treeNodes[parentIndex];

        ctx.beginPath();
        ctx.moveTo(parent.x, parent.y);
        ctx.lineTo(child.x, child.y);

        ctx.strokeStyle = 'rgba(129, 140, 248, 0.18)';
        ctx.lineWidth = 1;

        ctx.stroke();
      }

      treeNodes.forEach((node, index) => {
        const pulse =
          Math.sin(Date.now() * 0.002 + index) * 0.5 + 0.5;

        ctx.beginPath();
        ctx.arc(
          node.x,
          node.y,
          3 + pulse * 1.5,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = `rgba(129, 140, 248, ${
          0.35 + pulse * 0.25
        })`;

        ctx.fill();
      });

      ctx.restore();
    }

    function drawSortingBars() {
      const baseX = 35;
      const baseY = height - 45;
      const barWidth = 7;
      const gap = 6;

      ctx.save();

      bars.forEach((bar, index) => {
        if (bar.height >= bar.target) {
          bar.target = Math.random() * 90 + 20;
        }

        bar.height +=
          (bar.target - bar.height) * 0.025;

        const x = baseX + index * (barWidth + gap);

        const gradient = ctx.createLinearGradient(
          0,
          baseY - bar.height,
          0,
          baseY
        );

        gradient.addColorStop(
          0,
          'rgba(56, 189, 248, 0.55)'
        );

        gradient.addColorStop(
          1,
          'rgba(129, 140, 248, 0.08)'
        );

        ctx.fillStyle = gradient;

        ctx.fillRect(
          x,
          baseY - bar.height,
          barWidth,
          bar.height
        );
      });

      ctx.restore();
    }

    function drawNumbers() {
      numbers.forEach((item) => {
        item.y -= item.speed;

        if (item.y < -30) {
          item.y = height + 20;
          item.x = Math.random() * width;
        }

        ctx.font = `${item.size}px monospace`;

        ctx.fillStyle = `rgba(56, 189, 248, ${item.opacity})`;

        ctx.fillText(
          item.text,
          item.x,
          item.y
        );
      });
    }

    function drawRipples() {
      for (
        let i = ripplesRef.current.length - 1;
        i >= 0;
        i--
      ) {
        const ripple = ripplesRef.current[i];

        ripple.radius += 5;
        ripple.opacity -= 0.018;

        if (
          ripple.opacity <= 0 ||
          ripple.radius >= ripple.maxRadius
        ) {
          ripplesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();

        ctx.beginPath();

        ctx.arc(
          ripple.x,
          ripple.y,
          ripple.radius,
          0,
          Math.PI * 2
        );

        ctx.strokeStyle = `rgba(56, 189, 248, ${ripple.opacity})`;

        ctx.lineWidth = 2;

        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 14;

        ctx.stroke();

        ctx.restore();
      }
    }

    function drawMouseConnections() {
      if (mouse.x < 0 || mouse.y < 0) return;

      nodes.forEach((node) => {
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;

        const distance = Math.sqrt(
          dx * dx + dy * dy
        );

        if (distance < mouse.radius) {
          const strength =
            1 - distance / mouse.radius;

          ctx.beginPath();

          ctx.moveTo(node.x, node.y);

          ctx.lineTo(mouse.x, mouse.y);

          ctx.strokeStyle = `rgba(56, 189, 248, ${
            strength * 0.5
          })`;

          ctx.lineWidth = 1.2;

          ctx.stroke();

          node.x -=
            (dx / distance || 0) *
            strength *
            0.25;

          node.y -=
            (dy / distance || 0) *
            strength *
            0.25;
        }
      });
    }

    function drawGraph() {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) {
          node.vx *= -1;
        }

        if (node.y < 0 || node.y > height) {
          node.vy *= -1;
        }

        node.pulse += 0.02;

        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];

          const distance = Math.hypot(
            node.x - other.x,
            node.y - other.y
          );

          if (distance < 145) {
            const alpha =
              (1 - distance / 145) * 0.24;

            ctx.beginPath();

            ctx.moveTo(node.x, node.y);

            ctx.lineTo(other.x, other.y);

            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;

            ctx.lineWidth = 0.8;

            ctx.stroke();
          }
        }
      }

      nodes.forEach((node) => {
        const pulse =
          Math.sin(node.pulse) * 0.8;

        ctx.beginPath();

        ctx.arc(
          node.x,
          node.y,
          node.radius + pulse,
          0,
          Math.PI * 2
        );

        ctx.fillStyle =
          'rgba(56, 189, 248, 0.75)';

        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 8;

        ctx.fill();

        ctx.shadowBlur = 0;
      });
    }

    function drawMouseGlow() {
      if (mouse.x < 0 || mouse.y < 0) return;

      const glow =
        ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          320
        );

      glow.addColorStop(
        0,
        'rgba(56, 189, 248, 0.10)'
      );

      glow.addColorStop(
        0.45,
        'rgba(99, 102, 241, 0.035)'
      );

      glow.addColorStop(
        1,
        'rgba(15, 23, 42, 0)'
      );

      ctx.fillStyle = glow;

      ctx.fillRect(
        0,
        0,
        width,
        height
      );
    }

    function render() {
      ctx.clearRect(
        0,
        0,
        width,
        height
      );

      drawGrid();
      drawNumbers();
      drawTree();
      drawGraph();
      drawMouseConnections();
      drawSortingBars();
      drawRipples();
      drawMouseGlow();

      animationFrameId =
        requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(
        animationFrameId
      );

      window.removeEventListener(
        'resize',
        handleResize
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

      document.removeEventListener(
        'mouseleave',
        handleMouseLeave
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background:
          'radial-gradient(ellipse at 50% 0%, #0f172a 0%, #070b14 55%, #020617 100%)',
      }}
    />
  );
}