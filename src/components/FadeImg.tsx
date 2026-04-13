import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Properties that conflict between React's HTML attributes and Framer Motion's motion props
type MotionConflicts = 'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart';

interface FadeImgProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, MotionConflicts> {
    shimmer?: boolean;
    imgClassName?: string;
}

export default function FadeImg({
    shimmer = true,
    className,
    imgClassName,
    onLoad,
    ...props
}: FadeImgProps) {
    const [loaded, setLoaded] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const img = imgRef.current;
        if (img && img.complete && img.naturalWidth > 0) {
            setLoaded(true);
        }
    }, []);

    const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        setLoaded(true);
        onLoad?.(e);
    };

    return (
        <span className={`relative inline-block overflow-hidden ${className ?? ''}`} style={{ borderRadius: 'inherit' }}>
            <AnimatePresence>
                {shimmer && !loaded && (
                    <motion.span
                        key="shimmer"
                        className="absolute inset-0 bg-gray-200 dark:bg-gray-700"
                        style={{ borderRadius: 'inherit' }}
                        animate={{ opacity: [0.4, 0.9, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        exit={{ opacity: 0, transition: { duration: 0.25 } }}
                    />
                )}
            </AnimatePresence>
            <motion.img
                ref={imgRef}
                {...props}
                className={imgClassName}
                onLoad={handleLoad}
                initial={false}
                animate={
                    loaded
                        ? { opacity: 1, filter: 'blur(0px)' }
                        : { opacity: 0, filter: 'blur(6px)' }
                }
                transition={{ duration: 0.45, ease: 'easeOut' }}
            />
        </span>
    );
}
