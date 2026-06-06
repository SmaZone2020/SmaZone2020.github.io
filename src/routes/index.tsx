import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { setTitle } from '../App';

import Home from '../pages/HomePage';
import BlogList from '../pages/BlogListPage';
import BlogPost from '../pages/BlogPostPage';
import Portfolio from '../pages/PortfolioPage';
import Archive from '../pages/ArchivePage';
import About from '../pages/AboutPage';
import NotFound from '../pages/NotFoundPage';
import { Card } from '@heroui/react';

function AppRoutes() {
    const location = useLocation();

    setTitle("");

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                <Route path="/blog" element={<PageTransition><BlogList /></PageTransition>} />
                <Route path="/blog/:id" element={<PageTransition><BlogPost /></PageTransition>} />
                <Route path="/portfolio" element={<PageTransition><Portfolio /></PageTransition>} />
                <Route path="/archive" element={<PageTransition><Archive /></PageTransition>} />
                <Route path="/about" element={<PageTransition><About /></PageTransition>} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </AnimatePresence>
    );
}

function PageTransition({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
            style={{ touchAction: 'pan-y' }}
        >
            <Card className="my-auto bg-white/60 dark:bg-surface/60 backdrop-blur-sm p-0 m-0 sm:m-6 rounded-none sm:rounded-[30px] max-h-[calc(100vh-50px)] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {children}
            </Card>
        </motion.div>
    );
}

export default AppRoutes;
