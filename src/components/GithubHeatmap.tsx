import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Card, CardHeader } from '@heroui/react';
import { LogoGithub } from '@gravity-ui/icons';
import { siteData } from '../lib/data';
import { useTheme } from '../theme';
import { useI18n } from '../i18n';

interface ContributionDay {
    date: string;
    count: number;
    level: number;
}

function toDateKey(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** 所在周的周一（周一为一周起点，与渲染补位一致） */
function weekStartOf(dateKey: string): string {
    const d = new Date(dateKey + 'T00:00:00');
    const dow = d.getDay() === 0 ? 6 : d.getDay() - 1; // Mon=0..Sun=6
    d.setDate(d.getDate() - dow);
    return toDateKey(d);
}

/** 所在周的周日 */
function weekEndOf(date: Date): string {
    const d = new Date(date);
    const dow = d.getDay() === 0 ? 6 : d.getDay() - 1;
    d.setDate(d.getDate() + (6 - dow));
    return toDateKey(d);
}

// GitHub's actual contribution colors with borders for visual clarity
const CELL_STYLES: Record<number, { bg: string; border: string }> = {
    [-1]: { bg: 'transparent', border: 'transparent' },
    0:  { bg: '#ebedf0', border: '#d0d4d8' },
    1:  { bg: '#9be9a8', border: '#7bc88c' },
    2:  { bg: '#40c463', border: '#30a14e' },
    3:  { bg: '#30a14e', border: '#216e39' },
    4:  { bg: '#216e39', border: '#144625' },
};

const CELL_STYLES_DARK: Record<number, { bg: string; border: string }> = {
    [-1]: { bg: 'transparent', border: 'transparent' },
    0:  { bg: '#1b1d23', border: '#2d3139' },
    1:  { bg: '#0e4429', border: '#1a6b3c' },
    2:  { bg: '#006d32', border: '#00963f' },
    3:  { bg: '#26a641', border: '#3dc953' },
    4:  { bg: '#39d353', border: '#56e06b' },
};

const CELL = 12;
const GAP = 3;
// Width of the 7-column week grid; becomes the visual height after rotation
const GRID_SPAN = CELL * 7 + GAP * 6;

// Visual rows top->bottom after rotation are Mon..Sun
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface TooltipInfo {
    x: number;
    y: number;
    date: string;
    count: number;
}

function GithubHeatmap() {
    const username = siteData.social?.github?.split('/').pop() || 'SmaZone2020';
    const { theme } = useTheme();
    const { t } = useI18n();
    const colors = theme === 'dark' ? CELL_STYLES_DARK : CELL_STYLES;
    const [days, setDays] = useState<ContributionDay[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);
    const [shadows, setShadows] = useState({ left: false, right: false });
    const [width, setWidth] = useState(0);
    const [dragging, setDragging] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const wrapRef = useRef<HTMLDivElement>(null);
    const dragState = useRef<{ startX: number; startTop: number } | null>(null);

    useEffect(() => {
        fetch(`https://github-contributions-api.jogruber.de/v4/${username}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed');
                return res.json();
            })
            .then(data => {
                const all: ContributionDay[] = [];
                const list: { date?: string; count?: number; level?: number }[] = data.contributions || [];
                // v4 返回扁平数组，按日期升序保证从最早的一天开始渲染
                const sorted = [...list].sort((a, b) => (a.date ?? '') < (b.date ?? '') ? -1 : 1);
                for (const entry of sorted) {
                    all.push({ date: entry.date ?? '', count: entry.count || 0, level: entry.level ?? 0 });
                }
                // 最早只显示到第一次提交的那周，最晚只显示到本周（去掉未来的空周）
                const firstCommit = all.find(d => d.count > 0);
                const firstWeekStart = firstCommit ? weekStartOf(firstCommit.date) : weekStartOf(toDateKey(new Date()));
                const thisWeekEnd = weekEndOf(new Date());
                const filtered = all.filter(d => d.date >= firstWeekStart && d.date <= thisWeekEnd);
                setDays(filtered);
                setTotal(filtered.reduce((s, d) => s + d.count, 0));
                setLoading(false);
            })
            .catch(() => {
                setError(true);
                setLoading(false);
            });
    }, [username]);

    // Pad the start so the first cell lands on its weekday column (Mon-based)
    const paddedDays = useMemo(() => {
        if (days.length === 0) return [];
        const first = new Date(days[0].date + 'T00:00:00');
        let dow = first.getDay();
        dow = dow === 0 ? 6 : dow - 1;
        const pad: ContributionDay[] = Array.from({ length: dow }, () => ({
            date: '',
            count: 0,
            level: -1,
        }));
        return [...pad, ...days];
    }, [days]);

    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;
        setWidth(el.clientWidth);
        const ro = new ResizeObserver(() => setWidth(el.clientWidth));
        ro.observe(el);
        return () => ro.disconnect();
    }, [loading, error]);

    // DOM top (older weeks) shows on the left after rotation, DOM bottom on the right
    const updateShadows = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setShadows({
            left: el.scrollTop > 2,
            right: el.scrollTop + el.clientHeight < el.scrollHeight - 2,
        });
    }, []);

    // Start at the newest weeks (visual right edge)
    useEffect(() => {
        const el = scrollRef.current;
        if (el && paddedDays.length > 0) {
            el.scrollTop = el.scrollHeight;
            updateShadows();
        }
    }, [paddedDays, width, updateShadows]);

    // Horizontal drag pans the rotated scroller (visual x maps to DOM scrollTop)
    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!scrollRef.current) return;
        dragState.current = { startX: e.clientX, startTop: scrollRef.current.scrollTop };
        e.currentTarget.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        const d = dragState.current;
        const el = scrollRef.current;
        if (!d || !el) return;
        const dx = e.clientX - d.startX;
        if (dragging || Math.abs(dx) > 3) {
            if (!dragging) setDragging(true);
            el.scrollTop = d.startTop - dx;
        }
    };
    const endDrag = () => {
        dragState.current = null;
        setDragging(false);
    };

    if (loading) {
        return (
            <Card className="bg-white/40 dark:bg-surface/50 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <LogoGithub className="w-5 h-5" />
                        <span>{t('github.title')}</span>
                    </div>
                </CardHeader>
                <Card.Content className="pb-4">
                    <div
                        className="animate-pulse flex overflow-hidden"
                        style={{ gap: GAP, height: GRID_SPAN }}
                    >
                        {Array.from({ length: 18 }).map((_, i) => (
                            <div key={i} className="flex flex-col flex-shrink-0" style={{ gap: GAP }}>
                                {Array.from({ length: 7 }).map((_, j) => (
                                    <div
                                        key={j}
                                        className="rounded-sm bg-default-200 dark:bg-default-100"
                                        style={{ width: CELL, height: CELL }}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </Card.Content>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="bg-white/40 dark:bg-surface/50 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <LogoGithub className="w-5 h-5" />
                        <span>{t('github.title')}</span>
                    </div>
                </CardHeader>
                <Card.Content className="pb-4">
                    <p className="text-sm text-gray-500">{t('github.unableToLoad')}</p>
                </Card.Content>
            </Card>
        );
    }

    return (
        <Card className="bg-white/40 dark:bg-surface/50 backdrop-blur-sm">
            <CardHeader>
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <LogoGithub className="w-5 h-5" />
                        <span className="text-sm font-medium">
                            {t('github.contributions').replace('{total}', String(total))}
                        </span>
                    </div>
                </div>
            </CardHeader>
            <Card.Content className="pb-4">
                <div className="flex gap-1.5">
                    <div className="flex flex-col flex-shrink-0" style={{ gap: GAP }}>
                        {WEEKDAYS.map((label, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-end text-[9px] leading-none text-gray-400 dark:text-gray-500 select-none font-mono"
                                style={{ height: CELL }}
                            >
                                {label}
                            </div>
                        ))}
                    </div>
                    <div
                        ref={wrapRef}
                        className={`relative min-w-0 flex-1 ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                        style={{ height: GRID_SPAN, touchAction: 'none' }}
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={endDrag}
                        onPointerCancel={endDrag}
                    >
                        {width > 0 && (
                            <div
                                ref={scrollRef}
                                onScroll={() => {
                                    setTooltip(null);
                                    updateShadows();
                                }}
                                className="absolute left-0 top-0 overflow-y-auto [&::-webkit-scrollbar]:hidden"
                                style={{
                                    width: GRID_SPAN,
                                    height: width,
                                    transform: `translateY(${GRID_SPAN}px) rotate(-90deg)`,
                                    transformOrigin: '0 0',
                                    scrollbarWidth: 'none',
                                }}
                            >
                                {/* rtl puts Monday in the rightmost DOM column, i.e. the top visual row */}
                                <div
                                    dir="rtl"
                                    className="grid"
                                    style={{
                                        gridTemplateColumns: `repeat(7, ${CELL}px)`,
                                        gap: GAP,
                                    }}
                                >
                                    {paddedDays.map((day, i) => {
                                        const style = colors[day.level] || colors[0];
                                        return (
                                            <div
                                                key={i}
                                                className="rounded-sm"
                                                style={{
                                                    width: CELL,
                                                    height: CELL,
                                                    backgroundColor: style.bg,
                                                    border: `1px solid ${style.border}`,
                                                }}
                                                onMouseEnter={day.date ? (e) => {
                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                    setTooltip({
                                                        x: rect.left + rect.width / 2,
                                                        y: rect.top,
                                                        date: day.date,
                                                        count: day.count,
                                                    });
                                                } : undefined}
                                                onMouseLeave={day.date ? () => setTooltip(null) : undefined}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        <div
                            className={`pointer-events-none absolute inset-y-0 left-0 w-5 bg-gradient-to-r from-black/15 to-transparent dark:from-black/50 transition-opacity duration-200 ${shadows.left ? 'opacity-100' : 'opacity-0'}`}
                        />
                        <div
                            className={`pointer-events-none absolute inset-y-0 right-0 w-5 bg-gradient-to-l from-black/15 to-transparent dark:from-black/50 transition-opacity duration-200 ${shadows.right ? 'opacity-100' : 'opacity-0'}`}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-1 mt-2 justify-end text-[10px] text-gray-400 dark:text-gray-500">
                    {t('github.less')}
                    {[0, 1, 2, 3, 4].map(level => {
                        const style = colors[level];
                        return (
                            <div
                                key={level}
                                className="rounded-sm"
                                style={{
                                    width: 10,
                                    height: 10,
                                    backgroundColor: style.bg,
                                    border: `1px solid ${style.border}`,
                                }}
                            />
                        );
                    })}
                    {t('github.more')}
                </div>
            </Card.Content>
            {tooltip && createPortal(
                <Card
                    className="fixed z-50 pointer-events-none text-[14px] whitespace-nowrap"
                    style={{
                        left: tooltip.x,
                        top: tooltip.y - 8,
                        transform: 'translate(-50%, -100%)',
                    }}
                >
                    <div className="font-medium">{tooltip.count} 次贡献</div>
                    <div className="text-[10px] opacity-75">{tooltip.date}</div>
                </Card>,
                document.body
            )}
        </Card>
    );
}

export default GithubHeatmap;
