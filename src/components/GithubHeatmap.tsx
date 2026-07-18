import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
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

const LEVEL_MAP: Record<string, number> = {
    NONE: 0,
    FIRST_QUARTILE: 1,
    SECOND_QUARTILE: 2,
    THIRD_QUARTILE: 3,
    FOURTH_QUARTILE: 4,
};

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

function GithubHeatmap() {
    const username = siteData.social?.github?.split('/').pop() || 'SmaZone2020';
    const { theme } = useTheme();
    const { t } = useI18n();
    const colors = theme === 'dark' ? CELL_STYLES_DARK : CELL_STYLES;
    const [days, setDays] = useState<ContributionDay[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetch(`https://github-contributions-api.deno.dev/${username}.json`)
            .then(res => {
                if (!res.ok) throw new Error('Failed');
                return res.json();
            })
            .then(data => {
                const all: ContributionDay[] = [];
                let sum = 0;
                for (const week of data.contributions || []) {
                    for (const entry of week) {
                        const count = entry.contributionCount || 0;
                        all.push({
                            date: entry.date,
                            count,
                            level: LEVEL_MAP[entry.contributionLevel] ?? 0,
                        });
                        sum += count;
                    }
                }
                // Only keep the last 90 days (~3 months)
                const recent = all.slice(-90);
                const recentTotal = recent.reduce((s, d) => s + d.count, 0);
                setDays(recent);
                setTotal(recentTotal);
                setLoading(false);
            })
            .catch(() => {
                setError(true);
                setLoading(false);
            });
    }, [username]);

    const weeks = useMemo(() => {
        if (days.length === 0) return [];
        const result: ContributionDay[][] = [];
        const first = new Date(days[0].date + 'T00:00:00');
        let dow = first.getDay();
        dow = dow === 0 ? 6 : dow - 1;

        let week: ContributionDay[] = [];
        for (let i = 0; i < dow; i++) {
            week.push({ date: '', count: 0, level: -1 });
        }
        for (const day of days) {
            week.push(day);
            if (week.length === 7) {
                result.push(week);
                week = [];
            }
        }
        if (week.length > 0) result.push(week);
        return result;
    }, [days]);

    const gridRef = useRef<HTMLDivElement>(null);
    const [cellSize, setCellSize] = useState(12);
    const gap = 2;

    const updateSize = useCallback(() => {
        if (gridRef.current && weeks.length > 0) {
            const w = gridRef.current.clientWidth;
            const size = Math.floor((w - (weeks.length - 1) * gap) / weeks.length);
            setCellSize(Math.max(8, Math.min(size, 20)));
        }
    }, [weeks.length]);

    useEffect(() => {
        updateSize();
        const ro = new ResizeObserver(updateSize);
        if (gridRef.current) ro.observe(gridRef.current);
        return () => ro.disconnect();
    }, [updateSize]);

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
                    <div ref={gridRef} className="animate-pulse flex" style={{ gap }}>
                        {Array.from({ length: 13 }).map((_, i) => (
                            <div key={i} className="flex flex-col" style={{ gap }}>
                                {Array.from({ length: 7 }).map((_, j) => (
                                    <div
                                        key={j}
                                        className="rounded-sm bg-default-200 dark:bg-default-100"
                                        style={{ width: cellSize, height: cellSize }}
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
                <div ref={gridRef} className="flex" style={{ gap }}>
                    {weeks.map((week, wi) => (
                        <div key={wi} className="flex flex-col" style={{ gap }}>
                            {week.map((day, di) => {
                                const style = colors[day.level] || colors[0];
                                return (
                                    <div key={di} className="relative group flex-shrink-0">
                                        <div
                                            className="rounded-sm cursor-pointer"
                                            style={{
                                                width: cellSize,
                                                height: cellSize,
                                                backgroundColor: style.bg,
                                                border: `1px solid ${style.border}`,
                                            }}
                                        />
                                        {day.date && (
                                            <Card className="absolute text-[14px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                                <div className="font-medium">{day.count} contributions</div>
                                                <div className="text-[10px] opacity-75">{day.date}</div>
                                            </Card>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
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
        </Card>
    );
}

export default GithubHeatmap;
