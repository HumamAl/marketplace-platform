"use client";

import { useEffect, useRef, useCallback } from "react";

interface GridNode {
  x: number;
  y: number;
  col: number;
  row: number;
  brightness: number;
  targetBrightness: number;
  pulsePhase: number;
  pulsing: boolean;
}

interface DataPulse {
  fromNode: number;
  toNode: number;
  t: number; // 0 to 1 progress along edge
  speed: number;
  alpha: number;
}

const AMBER_H = 65; // hue from CSS tokens

export function MarketplaceGridCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<GridNode[]>([]);
  const pulsesRef = useRef<DataPulse[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const frameRef = useRef<number>(0);
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });
  const lastPulseTimeRef = useRef(0);

  const initNodes = useCallback((w: number, h: number) => {
    // Build a rectangular grid of nodes
    const cols = 14;
    const rows = 10;
    const padX = w * 0.06;
    const padY = h * 0.06;
    const cellW = (w - padX * 2) / (cols - 1);
    const cellH = (h - padY * 2) / (rows - 1);

    const nodes: GridNode[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        nodes.push({
          x: padX + c * cellW,
          y: padY + r * cellH,
          col: c,
          row: r,
          brightness: 0.25 + Math.random() * 0.2,
          targetBrightness: 0.25 + Math.random() * 0.2,
          pulsePhase: Math.random() * Math.PI * 2,
          pulsing: false,
        });
      }
    }
    return nodes;
  }, []);

  const getNeighborIndices = useCallback(
    (idx: number, cols: number, rows: number): number[] => {
      const row = Math.floor(idx / cols);
      const col = idx % cols;
      const neighbors: number[] = [];
      if (col + 1 < cols) neighbors.push(idx + 1);
      if (row + 1 < rows) neighbors.push(idx + cols);
      return neighbors;
    },
    []
  );

  const spawnPulse = useCallback((nodes: GridNode[]) => {
    const cols = 14;
    const rows = 10;
    // Pick a random edge node as start
    const edgeNodes: number[] = [];
    for (let i = 0; i < nodes.length; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      if (row === 0 || col === 0) edgeNodes.push(i);
    }
    const fromIdx = edgeNodes[Math.floor(Math.random() * edgeNodes.length)];
    const neighbors = getNeighborIndices(fromIdx, cols, rows);
    if (neighbors.length === 0) return;
    const toIdx = neighbors[Math.floor(Math.random() * neighbors.length)];
    pulsesRef.current.push({
      fromNode: fromIdx,
      toNode: toIdx,
      t: 0,
      speed: 0.018 + Math.random() * 0.022,
      alpha: 0.7 + Math.random() * 0.3,
    });
  }, [getNeighborIndices]);

  const draw = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { w, h, dpr } = sizeRef.current;
    const cols = 14;
    const rows = 10;
    const nodes = nodesRef.current;
    const pulses = pulsesRef.current;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    ctx.clearRect(0, 0, w * dpr, h * dpr);

    // Spawn new pulses every ~400ms
    if (timestamp - lastPulseTimeRef.current > 380 && pulses.length < 16) {
      spawnPulse(nodes);
      lastPulseTimeRef.current = timestamp;
    }

    // Update node brightness based on mouse proximity
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const dx = node.x - mx;
      const dy = node.y - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const proximity = Math.max(0, 1 - dist / 180);

      // Slow ambient oscillation
      node.pulsePhase += 0.008;
      const ambient = 0.22 + Math.sin(node.pulsePhase) * 0.06;

      node.targetBrightness = ambient + proximity * 0.65;
      node.brightness += (node.targetBrightness - node.brightness) * 0.08;
    }

    // Draw grid edges (lines between adjacent nodes)
    ctx.save();
    for (let i = 0; i < nodes.length; i++) {
      const nodeA = nodes[i];
      const neighbors = getNeighborIndices(i, cols, rows);
      for (const j of neighbors) {
        const nodeB = nodes[j];
        const avgBright = (nodeA.brightness + nodeB.brightness) * 0.5;
        ctx.beginPath();
        ctx.moveTo(nodeA.x * dpr, nodeA.y * dpr);
        ctx.lineTo(nodeB.x * dpr, nodeB.y * dpr);
        // Amber: approx rgb(217, 166, 0) at full sat
        ctx.strokeStyle = `oklch(${0.72} ${0.17 * avgBright} ${AMBER_H} / ${avgBright * 0.22})`;
        ctx.lineWidth = 0.8 * dpr;
        ctx.stroke();
      }
    }
    ctx.restore();

    // Draw data pulses traveling along edges
    const nextPulses: DataPulse[] = [];
    ctx.save();
    for (const pulse of pulses) {
      pulse.t += pulse.speed;
      if (pulse.t >= 1) {
        // Pulse reached destination — try to continue to a next neighbor
        const neighbors = getNeighborIndices(pulse.toNode, cols, rows);
        // Also add reverse direction neighbors
        const row = Math.floor(pulse.toNode / cols);
        const col = pulse.toNode % cols;
        const moreNeighbors: number[] = [...neighbors];
        if (col - 1 >= 0) moreNeighbors.push(pulse.toNode - 1);
        if (row - 1 >= 0) moreNeighbors.push(pulse.toNode - cols);

        const validNext = moreNeighbors.filter((n) => n !== pulse.fromNode && n >= 0 && n < nodes.length);
        if (validNext.length > 0 && pulse.t < 2.5 && Math.random() > 0.3) {
          const nextTo = validNext[Math.floor(Math.random() * validNext.length)];
          nextPulses.push({
            fromNode: pulse.toNode,
            toNode: nextTo,
            t: 0,
            speed: pulse.speed,
            alpha: pulse.alpha * 0.85,
          });
        }
        // Brighten destination node
        const destNode = nodes[pulse.toNode];
        if (destNode) {
          destNode.targetBrightness = Math.min(1, destNode.targetBrightness + 0.4);
        }
        continue; // remove this pulse
      }

      const fromNode = nodes[pulse.fromNode];
      const toNode = nodes[pulse.toNode];
      if (!fromNode || !toNode) continue;

      const px = fromNode.x + (toNode.x - fromNode.x) * pulse.t;
      const py = fromNode.y + (toNode.y - fromNode.y) * pulse.t;

      // Glow halo
      const grad = ctx.createRadialGradient(
        px * dpr, py * dpr, 0,
        px * dpr, py * dpr, 10 * dpr
      );
      grad.addColorStop(0, `rgba(217, 166, 25, ${pulse.alpha * 0.9})`);
      grad.addColorStop(0.4, `rgba(217, 166, 25, ${pulse.alpha * 0.35})`);
      grad.addColorStop(1, `rgba(217, 166, 25, 0)`);
      ctx.beginPath();
      ctx.arc(px * dpr, py * dpr, 10 * dpr, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(px * dpr, py * dpr, 2 * dpr, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 215, 80, ${pulse.alpha})`;
      ctx.fill();

      nextPulses.push(pulse);
    }
    pulsesRef.current = nextPulses;
    ctx.restore();

    // Draw nodes
    ctx.save();
    for (const node of nodes) {
      const b = node.brightness;
      const size = 2.5 + b * 2;

      // Glow for bright nodes
      if (b > 0.4) {
        const glow = ctx.createRadialGradient(
          node.x * dpr, node.y * dpr, 0,
          node.x * dpr, node.y * dpr, size * 4 * dpr
        );
        glow.addColorStop(0, `rgba(217, 166, 25, ${b * 0.4})`);
        glow.addColorStop(1, `rgba(217, 166, 25, 0)`);
        ctx.beginPath();
        ctx.arc(node.x * dpr, node.y * dpr, size * 4 * dpr, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      }

      // Node dot
      ctx.beginPath();
      ctx.arc(node.x * dpr, node.y * dpr, size * dpr, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(217, 150, 10, ${0.3 + b * 0.55})`;
      ctx.fill();
    }
    ctx.restore();

    frameRef.current = requestAnimationFrame(draw);
  }, [spawnPulse, getNeighborIndices]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = parent.offsetWidth;
      const h = parent.offsetHeight;
      sizeRef.current = { w, h, dpr };
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      nodesRef.current = initNodes(w, h);
      pulsesRef.current = [];
    };

    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    canvas.parentElement?.addEventListener("mousemove", onMouseMove);
    canvas.parentElement?.addEventListener("mouseleave", onMouseLeave);

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameRef.current);
      ro.disconnect();
      canvas.parentElement?.removeEventListener("mousemove", onMouseMove);
      canvas.parentElement?.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [draw, initNodes]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
