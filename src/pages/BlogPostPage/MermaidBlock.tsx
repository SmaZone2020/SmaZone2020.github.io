import { useEffect, useRef, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowsExpand, MagnifierMinus, MagnifierPlus, Xmark } from '@gravity-ui/icons';
import { useTheme } from '../../theme';
import { useI18n } from '../../i18n';

let uid = 0;

const MIN_SCALE = 0.1;
const MAX_SCALE = 8;

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

interface MermaidBlockProps {
    code: string;
}

export default function MermaidBlock({ code }: MermaidBlockProps) {
    const { theme } = useTheme();
    const [svg, setSvg] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                // Dynamic import keeps the large mermaid chunk out of the initial bundle
                const { default: mermaid } = await import('mermaid');
                if (cancelled) return;
                mermaid.initialize({
                    startOnLoad: false,
                    securityLevel: 'strict',
                    theme: theme === 'dark' ? 'dark' : 'default',
                });
                const { svg: svgString } = await mermaid.render(`mermaid-${uid++}`, code);
                if (cancelled) return;
                setSvg(svgString);
                setError(null);
            } catch (e) {
                if (!cancelled) {
                    setError(e instanceof Error ? e.message : String(e));
                    setSvg(null);
                }
            }
        })();

        return () => { cancelled = true; };
    }, [code, theme]);

    if (error) {
        return (
            <div className="my-4 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                <p className="mb-2 text-sm text-red-500">Diagram render failed</p>
                <pre className="overflow-x-auto text-xs text-red-600 dark:text-red-400">{code}</pre>
            </div>
        );
    }

    return (
        <>
            <div className="group relative my-4 overflow-x-auto">
                <div className="mx-auto w-max [&_svg]:max-w-none" dangerouslySetInnerHTML={{ __html: svg ?? '' }} />
                <button
                    onClick={() => setOpen(true)}
                    aria-label="Expand diagram"
                    title="Expand"
                    className="absolute top-2 right-2 z-10 rounded-md bg-black/50 p-1.5 text-white transition-colors hover:bg-black/70 opacity-90 md:opacity-0 md:group-hover:opacity-100"
                >
                    <ArrowsExpand className="w-4 h-4" />
                </button>
            </div>

            <AnimatePresence>
                {open && svg && <DiagramStage svg={svg} onClose={() => setOpen(false)} />}
            </AnimatePresence>
        </>
    );
}

function DiagramStage({ svg, onClose }: { svg: string; onClose: () => void }) {
    const { t } = useI18n();
    const stageRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
    const viewRef = useRef(view);
    viewRef.current = view;
    const drag = useRef<{ active: boolean; pointerId: number; startX: number; startY: number; x: number; y: number } | null>(null);

    const fit = useCallback(() => {
        const stage = stageRef.current;
        const content = contentRef.current;
        if (!stage || !content) return;
        const sw = stage.clientWidth;
        const sh = stage.clientHeight;
        const cw = content.offsetWidth;
        const ch = content.offsetHeight;
        if (sw === 0 || sh === 0 || cw === 0 || ch === 0) return;
        const scale = clamp(Math.min(sw / cw, sh / ch, 1) * 0.92, MIN_SCALE, MAX_SCALE);
        setView({ scale, x: (sw - cw * scale) / 2, y: (sh - ch * scale) / 2 });
    }, []);

    useEffect(() => { fit(); }, [fit, svg]);

    // Wheel zoom — attached manually so it can be non-passive (preventDefault)
    useEffect(() => {
        const stage = stageRef.current;
        if (!stage) return;
        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            const rect = stage.getBoundingClientRect();
            const px = e.clientX - rect.left;
            const py = e.clientY - rect.top;
            const { x, y, scale } = viewRef.current;
            const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
            const newScale = clamp(scale * factor, MIN_SCALE, MAX_SCALE);
            const k = newScale / scale;
            setView({ scale: newScale, x: px - (px - x) * k, y: py - (py - y) * k });
        };
        stage.addEventListener('wheel', onWheel, { passive: false });
        return () => stage.removeEventListener('wheel', onWheel);
    }, []);

    // Close on Escape + lock page scroll while open
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [onClose]);

    const zoomAt = (factor: number, px?: number, py?: number) => {
        const stage = stageRef.current;
        const { x, y, scale } = viewRef.current;
        const newScale = clamp(scale * factor, MIN_SCALE, MAX_SCALE);
        const k = newScale / scale;
        let cx = px;
        let cy = py;
        if (cx == null || cy == null) {
            const rect = stage?.getBoundingClientRect();
            cx = rect ? rect.width / 2 : 0;
            cy = rect ? rect.height / 2 : 0;
        }
        setView({ scale: newScale, x: cx - (cx - x) * k, y: cy - (cy - y) * k });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm"
        >
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <button
                    onClick={() => zoomAt(1.4)}
                    aria-label="Zoom in"
                    title="Zoom in"
                    className="rounded-md bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                >
                    <MagnifierPlus className="w-4 h-4" />
                </button>
                <button
                    onClick={() => zoomAt(1 / 1.4)}
                    aria-label="Zoom out"
                    title="Zoom out"
                    className="rounded-md bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                >
                    <MagnifierMinus className="w-4 h-4" />
                </button>
                <button
                    onClick={fit}
                    aria-label="Reset zoom"
                    title="Reset zoom"
                    className="rounded-md bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                >
                    <ArrowsExpand className="w-4 h-4" />
                </button>
                <button
                    onClick={onClose}
                    aria-label="Close"
                    title="Close"
                    className="rounded-md bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                >
                    <Xmark className="w-4 h-4" />
                </button>
            </div>

            <div
                ref={stageRef}
                className="absolute inset-0 touch-none select-none overflow-hidden cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => {
                    if (e.button !== 0) return;
                    drag.current = {
                        active: true,
                        pointerId: e.pointerId,
                        startX: e.clientX,
                        startY: e.clientY,
                        x: viewRef.current.x,
                        y: viewRef.current.y,
                    };
                    try {
                        e.currentTarget.setPointerCapture(e.pointerId);
                    } catch { /* no active pointer (e.g. synthetic events) */ }
                }}
                onPointerMove={(e) => {
                    const d = drag.current;
                    if (!d || !d.active) return;
                    setView({ ...viewRef.current, x: d.x + (e.clientX - d.startX), y: d.y + (e.clientY - d.startY) });
                }}
                onPointerUp={() => { if (drag.current) drag.current.active = false; }}
                onPointerCancel={() => { if (drag.current) drag.current.active = false; }}
                onDoubleClick={(e) => {
                    const rect = stageRef.current?.getBoundingClientRect();
                    if (!rect) return;
                    const px = e.clientX - rect.left;
                    const py = e.clientY - rect.top;
                    if (viewRef.current.scale > 1.05) {
                        fit();
                    } else {
                        zoomAt(2, px, py);
                    }
                }}
            >
                <div
                    ref={contentRef}
                    className="absolute left-0 top-0 [&_svg]:max-w-none"
                    style={{
                        transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
                        transformOrigin: '0 0',
                    }}
                >
                    <div className="w-max" dangerouslySetInnerHTML={{ __html: svg }} />
                </div>
            </div>

            <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-white/60">
                {t('blog.diagramHint')}
            </div>
        </motion.div>
    );
}
