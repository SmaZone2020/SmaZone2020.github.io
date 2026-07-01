import { Button } from '@heroui/react';
import { Sun, Moon } from '@gravity-ui/icons';
import { useTheme } from '../theme';

export function ThemeSwitcher({ collapsed }: { collapsed: boolean }) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  const toggle = () => setTheme(isDark ? 'light' : 'dark');

  return (
    <Button
      variant="secondary"
      onPress={toggle}
      className={`${collapsed ? '' : 'justify-start'} opacity-70`}
      isIconOnly={collapsed}
    >
      {isDark ? <Moon className="shrink-0" /> : <Sun className="shrink-0" />}
      <span
        className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
          collapsed ? 'hidden opacity-0' : 'max-w-20 opacity-100 ml-1'
        }`}
      >
        {isDark ? 'Dark' : 'Light'}
      </span>
    </Button>
  );
}
