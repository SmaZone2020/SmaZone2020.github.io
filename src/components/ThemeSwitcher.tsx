import { Button } from '@heroui/react';
import { Sun, Moon } from '@gravity-ui/icons';
import { useTheme } from '../theme';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeSwitcher({ collapsed }: { collapsed: boolean }) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  const toggle = () => setTheme(isDark ? 'light' : 'dark');

  return (
    <motion.div layout className="flex items-center">
      <Button
        variant={isDark ? 'primary' : 'secondary'}
        onPress={toggle}
        size="lg"
        isIconOnly={collapsed}
        className={`flex-1 justify-start px-3 mr-2 transition-all duration-300 ${isDark ? 'rounded-[15px]' : 'opacity-50 hover:opacity-100 hover:rounded-[15px]'}`}
      >
        {isDark ? <Moon className="w-5 h-5 shrink-0" /> : <Sun className="w-5 h-5 shrink-0" />}
        <span
          className="overflow-hidden whitespace-nowrap transition-all duration-300"
          style={{
            maxWidth: collapsed ? 0 : '8rem',
            opacity: collapsed ? 0 : 1,
          }}
        >
          {isDark ? 'Dark' : 'Light'}
        </span>
      </Button>
      <AnimatePresence>
        {isDark && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 8, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-5 bg-blue-500 rounded-full shrink-0"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

