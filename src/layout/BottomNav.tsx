import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { navItems } from '../config/site';
import { useI18n } from '../i18n';

interface BottomNavProps {
  defaultActive?: string;
  onItemClick?: (id: string) => void;
}

export function BottomNav({ defaultActive, onItemClick }: BottomNavProps) {
  const items = navItems.filter(item => item.showInBottomNav !== false);
  const location = useLocation();
  const { t } = useI18n();
  const [activeId, setActiveId] = useState(
    defaultActive || items[0]?.url
  );

  const controls = useAnimation();
  const [hasMounted, setHasMounted] = useState(false);

  const activeIndex = items.findIndex(
    item => item.url === activeId
  );

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const item = items.find(i => i.url === location.pathname);
    if (item && item.showBottomNav !== false) {
      setActiveId(location.pathname);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (activeIndex < 0) return;

    if (!hasMounted) {
      controls.set({
        left: `${(activeIndex / items.length) * 100}%`,
        width: `${100 / items.length}%`,
        top: '4px',
        bottom: '4px',
      });
      return;
    }

    controls.start({
      left: `${(activeIndex / items.length) * 100}%`,
      width: `${100 / items.length}%`,
      scale: [0.9, 1.1, 0.9],
      transition: {
        left: {
          type: 'spring',
          stiffness: 320,
          damping: 28
        },
        width: {
          type: 'spring',
          stiffness: 320,
          damping: 28
        },
      }
    });
  }, [activeIndex, hasMounted, controls, items.length]);

  const handleClick = (id: string) => {
    setActiveId(id);
    onItemClick?.(id);
  };

  const currentItem = items.find(item => item.url === location.pathname);
  const shouldHide = currentItem?.label == null || currentItem?.showBottomNav === false;

  return (
    <div className={`fixed bottom-[35px] left-[20px] right-[20px] scale-105 z-50 sm:hidden ${shouldHide ? 'hidden' : ''}`}>

      <div className="relative bg-white/40 dark:bg-surface/50 backdrop-blur-sm rounded-[35px]">

        <motion.div
          className="absolute bg-blue-500/80 rounded-[60px] scale-95 pointer-events-none"
          animate={controls}
          initial={false}
          style={{
            zIndex: 0
          }}
        />

        <div className="relative z-10 flex justify-around">
          {items.map((item) => (
            <Link
              key={item.url}
              to={item.url}
              onClick={() => handleClick(item.url)}
              className={`flex-1 flex flex-col items-center justify-center p-3 transition-colors ${
                activeId === item.url
                  ? 'text-white'
                  : 'text-gray-500/80'
              }`}
            >
              <div className={`text-xl ${item.label ? 'scale-120' : 'scale-140'}`}>
                <item.icon />
              </div>
              {(item.label)&&(
                <span className="text-sm font-medium">
                  {t(`nav.${item.label.toLowerCase()}`)}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}