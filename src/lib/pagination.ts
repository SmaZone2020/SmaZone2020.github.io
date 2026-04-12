/**
 * Generate a page range array with ellipsis markers for pagination controls.
 *
 * Always includes the first page, last page, and pages adjacent to the current page.
 * Gaps larger than 1 are represented by 'ellipsis'.
 */
export function getPageRange(current: number, total: number): (number | 'ellipsis')[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | 'ellipsis')[] = [];
    const near = new Set([1, total, current - 1, current, current + 1].filter(p => p >= 1 && p <= total));
    const sorted = [...near].sort((a, b) => a - b);
    for (let i = 0; i < sorted.length; i++) {
        if (i > 0 && sorted[i] - sorted[i - 1] > 1) pages.push('ellipsis');
        pages.push(sorted[i]);
    }
    return pages;
}
