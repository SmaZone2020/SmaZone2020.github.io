import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BackToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const root = document.getElementById('root');
        if (!root) return;
        const onScroll = () => setVisible(root.scrollTop > 300);
        root.addEventListener('scroll', onScroll, { passive: true });
        return () => root.removeEventListener('scroll', onScroll);
    }, []);

    const scrollToTop = () => {
        document.getElementById('root')?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    key="back-to-top"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    onClick={scrollToTop}
                    aria-label="Back to top"
                    className="fixed bottom-24 right-4 sm:bottom-8 sm:right-8 z-50 w-10 h-10 rounded-full bg-white/70 dark:bg-surface/70 backdrop-blur-sm shadow-md border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-surface transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="18 15 12 9 6 15" />
                    </svg>
                </motion.button>
            )}
        </AnimatePresence>
    );
}
