"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Point {
    x: number;
    y: number;
    oldX: number;
    oldY: number;
    pinned: boolean;
}
interface Stick {
    p1: Point;
    p2: Point;
    len: number;
}

const GRAVITY = 0.85;
const FRICTION = 0.996;
const ITERATIONS = 16;
const SEGMENT_COUNT = 10;
const SEGMENT_LEN = 18;

const WORLD_W = 360;
const WORLD_H = 290;

export function RopeThemeToggle() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDark, setIsDark] = useState(true);
    const isDarkRef = useRef(true);
    const points = useRef<Point[]>([]);
    const sticks = useRef<Stick[]>([]);
    const mouse = useRef({ x: 0, y: 0, down: false, target: null as Point | null });
    const animRef = useRef<number>(0);

    useEffect(() => {
        const isLight = document.documentElement.classList.contains("forg-light");
        setIsDark(!isLight);
        isDarkRef.current = !isLight;
    }, []);

    const toggleTheme = useCallback(() => {
        setIsDark((prev) => {
            const next = !prev;
            isDarkRef.current = next;
            document.documentElement.classList.toggle("forg-light", !next);
            try { 
              localStorage.setItem("forg-theme", next ? "dark" : "light"); 
              // Dispatch event for other components if needed
              window.dispatchEvent(new Event('theme-change'));
            } catch { }
            return next;
        });
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = Math.max(1, window.devicePixelRatio || 1);
        canvas.width = WORLD_W * dpr;
        canvas.height = WORLD_H * dpr;
        canvas.style.width = `${WORLD_W}px`;
        canvas.style.height = `${WORLD_H}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const anchorX = WORLD_W / 2;

        points.current = [];
        sticks.current = [];
        for (let i = 0; i < SEGMENT_COUNT; i++) {
            points.current.push({
                x: anchorX,
                y: 6 + i * SEGMENT_LEN,
                oldX: anchorX,
                oldY: 6 + i * SEGMENT_LEN,
                pinned: i === 0,
            });
            if (i > 0) {
                sticks.current.push({
                    p1: points.current[i - 1],
                    p2: points.current[i],
                    len: SEGMENT_LEN,
                });
            }
        }

        const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
        const hexToRgb = (hex: string) => {
            const n = parseInt(hex.replace("#", ""), 16);
            return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
        };
        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
        type RGB = { r: number; g: number; b: number };
        const mixRgb = (a: RGB, b: RGB, t: number): RGB => ({
            r: Math.round(lerp(a.r, b.r, t)),
            g: Math.round(lerp(a.g, b.g, t)),
            b: Math.round(lerp(a.b, b.b, t)),
        });
        const toRgb = (c: RGB) => `rgb(${c.r},${c.g},${c.b})`;

        const C = {
            cord: [hexToRgb("#3a3a3a"), hexToRgb("#b0b0b0")],
            mount: [hexToRgb("#2b2b2b"), hexToRgb("#d4d4d4")],
            mountStroke: [hexToRgb("#4a4a4a"), hexToRgb("#b8b8b8")],
            bodyTop: [hexToRgb("#f4f4f4"), hexToRgb("#111111")],
            bodyBot: [hexToRgb("#cfcfcf"), hexToRgb("#2a2a2a")],
            bodyStroke: [hexToRgb("#d9d9d9"), hexToRgb("#1f1f1f")],
            slot: [hexToRgb("#aaaaaa"), hexToRgb("#151515")],
            nub: [hexToRgb("#2b2b2b"), hexToRgb("#f0f0f0")],
            led: [hexToRgb("#00e5ff"), hexToRgb("#e67d22")],
            glow: [hexToRgb("#00bcd4"), hexToRgb("#e67d22")],
        };

        let colorT = isDarkRef.current ? 0 : 1;

        const getPoint = (e: PointerEvent | MouseEvent | TouchEvent) => {
            const rect = canvas.getBoundingClientRect();
            const src = "touches" in e && (e as TouchEvent).touches.length ? (e as TouchEvent).touches[0]
                : "changedTouches" in e && (e as TouchEvent).changedTouches.length ? (e as TouchEvent).changedTouches[0]
                    : (e as MouseEvent);
            return {
                mx: clamp(src.clientX - rect.left, 5, WORLD_W - 5),
                my: clamp(src.clientY - rect.top, 4, WORLD_H - 5),
            };
        };

        let pulledFar = false;

        const onDown = (e: PointerEvent | MouseEvent | TouchEvent) => {
            const { mx, my } = getPoint(e);
            const end = points.current.at(-1)!;
            const BW = 22, BH = 34;
            const toggleY = Math.min(end.y, WORLD_H - 60);
            const inBody = mx >= end.x - BW / 2 - 10 && mx <= end.x + BW / 2 + 10
                && my >= toggleY - 6 && my <= toggleY + BH + 12;

            let nearest: Point | null = null, nearestDist = Infinity;
            for (let i = Math.max(0, points.current.length - 4); i < points.current.length; i++) {
                const p = points.current[i];
                const d = Math.hypot(p.x - mx, p.y - my);
                if (d < nearestDist) { nearestDist = d; nearest = p; }
            }
            if (inBody || nearestDist < 24) {
                mouse.current.down = true;
                mouse.current.target = inBody ? end : nearest;
                pulledFar = false;
                if (e.cancelable) e.preventDefault();
            }
        };

        const onMove = (e: PointerEvent | MouseEvent | TouchEvent) => {
            const { mx, my } = getPoint(e);
            mouse.current.x = mx; mouse.current.y = my;
            if (mouse.current.down) {
                const naturalEndY = 6 + (SEGMENT_COUNT - 1) * SEGMENT_LEN;
                if (my > naturalEndY + 30) pulledFar = true;
                if (e.cancelable) e.preventDefault();
            }
        };

        const onUp = (e?: PointerEvent | MouseEvent | TouchEvent) => {
            if (mouse.current.down && pulledFar) toggleTheme();
            mouse.current.down = false;
            mouse.current.target = null;
            pulledFar = false;
            if (e?.cancelable) e.preventDefault();
        };

        const sp = typeof window !== 'undefined' && "PointerEvent" in window;
        if (sp) {
            canvas.addEventListener("pointerdown", onDown, { passive: false });
            window.addEventListener("pointermove", onMove, { passive: false });
            window.addEventListener("pointerup", onUp, { passive: false });
        } else {
            canvas.addEventListener("touchstart", onDown, { passive: false });
            window.addEventListener("touchmove", onMove, { passive: false });
            window.addEventListener("touchend", onUp, { passive: false });
            canvas.addEventListener("mousedown", onDown);
            window.addEventListener("mousemove", onMove);
            window.addEventListener("mouseup", onUp);
        }

        const render = () => {
            points.current.forEach((p) => {
                if (p.pinned) return;
                if (mouse.current.down && mouse.current.target === p) {
                    p.x = clamp(mouse.current.x, 5, WORLD_W - 5);
                    p.y = clamp(mouse.current.y, 4, WORLD_H - 5);
                } else {
                    const vx = (p.x - p.oldX) * FRICTION;
                    const vy = (p.y - p.oldY) * FRICTION;
                    p.oldX = p.x; p.oldY = p.y;
                    p.x += vx; p.y += vy + GRAVITY;
                }
            });
            for (let it = 0; it < ITERATIONS; it++) {
                sticks.current.forEach((s) => {
                    const dx = s.p2.x - s.p1.x, dy = s.p2.y - s.p1.y;
                    const dist = Math.hypot(dx, dy) || 0.001;
                    const pct = (s.len - dist) / dist / 2;
                    if (!s.p1.pinned) { s.p1.x -= dx * pct; s.p1.y -= dy * pct; }
                    if (!s.p2.pinned) { s.p2.x += dx * pct; s.p2.y += dy * pct; }
                });
            }

            ctx.clearRect(0, 0, WORLD_W, WORLD_H);
            colorT += ((isDarkRef.current ? 0 : 1) - colorT) * 0.08;
            const t = Math.max(0, Math.min(1, colorT));
            const mix = (k: keyof typeof C) => toRgb(mixRgb(C[k][0], C[k][1], t));

            ctx.save();
            ctx.translate(anchorX, 5);
            ctx.fillStyle = mix("mount");
            ctx.strokeStyle = mix("mountStroke");
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(-16, -4, 32, 10, 5);
            ctx.fill(); ctx.stroke();
            ctx.restore();

            ctx.beginPath();
            ctx.moveTo(points.current[0].x, points.current[0].y);
            points.current.forEach((p) => ctx.lineTo(p.x, p.y));
            ctx.strokeStyle = mix("cord");
            ctx.lineWidth = 2; ctx.lineCap = "round";
            ctx.stroke();

            const last = points.current[points.current.length - 1];
            const toggleY = Math.min(last.y, WORLD_H - 60);
            const BW = 22, BH = 34;
            ctx.save();
            ctx.translate(last.x, toggleY);

            if (pulledFar) {
                ctx.shadowColor = isDarkRef.current ? "rgba(0,229,255,0.3)" : "rgba(230,125,34,0.35)";
                ctx.shadowBlur = 16;
            }
            const grad = ctx.createLinearGradient(0, 0, 0, BH);
            grad.addColorStop(0, mix("bodyTop")); grad.addColorStop(1, mix("bodyBot"));
            ctx.fillStyle = grad;
            ctx.strokeStyle = mix("bodyStroke");
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.roundRect(-BW / 2, 2, BW, BH, 9);
            ctx.fill(); ctx.stroke();
            ctx.shadowBlur = 0;

            ctx.fillStyle = mix("slot");
            ctx.beginPath(); ctx.roundRect(-5, 6, 10, 16, 4); ctx.fill();

            ctx.fillStyle = mix("nub");
            ctx.beginPath(); ctx.arc(0, 14, 3.5, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = mix("led");
            ctx.shadowColor = mix("glow"); ctx.shadowBlur = 6;
            ctx.globalAlpha = 0.85 + 0.15 * Math.sin(Date.now() / 600);
            ctx.beginPath(); ctx.arc(0, BH - 6, 3, 0, Math.PI * 2); ctx.fill();
            ctx.globalAlpha = 1; ctx.shadowBlur = 0;
            ctx.restore();

            animRef.current = requestAnimationFrame(render);
        };
        animRef.current = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animRef.current);
            if (sp) {
                canvas.removeEventListener("pointerdown", onDown);
                window.removeEventListener("pointermove", onMove);
                window.removeEventListener("pointerup", onUp);
            } else {
                canvas.removeEventListener("touchstart", onDown);
                window.removeEventListener("touchmove", onMove);
                window.removeEventListener("touchend", onUp);
                canvas.removeEventListener("mousedown", onDown);
                window.removeEventListener("mousemove", onMove);
                window.removeEventListener("mouseup", onUp);
            }
        };
    }, [toggleTheme]);

    return (
        <div style={{ overflow: "visible", lineHeight: 0 }} className="fixed top-0 right-[max(1.5rem,calc(50vw-37rem))] z-[100] hidden md:block">
            <div style={{ marginRight: "-180px" }}>
              <canvas
                  ref={canvasRef}
                  title={isDark ? "Pull to switch to light mode" : "Pull to switch to dark mode"}
                  style={{ touchAction: "none", display: "block", cursor: "grab", overflow: "visible" }}
              />
            </div>
        </div>
    );
}
