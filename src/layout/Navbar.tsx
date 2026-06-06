import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Bars, Xmark, Globe } from '@gravity-ui/icons';
import { Button, Dropdown, Label } from '@heroui/react';
import { navItems, siteConfig } from '../config/site';
import { useI18n } from '../i18n';
import { MenuList } from '../components/MenuList';
import { ThemeSwitcher } from '../components/ThemeSwitcher';

interface SidebarProps {
  collapsed: boolean;
  onToggle: (v: boolean) => void;
}

function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { setLocale, t } = useI18n();

  return (
    <>
      <aside
        className={`fixed top-4 left-4 bottom-4 z-40 hidden sm:block
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-18' : 'w-54'}`}
      >
        <div className="h-full bg-white/40 dark:bg-surface/60 backdrop-blur-sm rounded-[32px] p-4 py-6">
          <div className="flex flex-col h-full">
            <div
              className={`flex items-center mb-8 transition-all duration-300 ${
                collapsed ? 'justify-center' : 'justify-between'
              }`}
            >
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <Link
                      to="/"
                      className="text-2xl font-bold libre whitespace-nowrap block"
                    >
                      {siteConfig.name}
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
              <Button
                isIconOnly
                variant="ghost"
                size="sm"
                onPress={() => onToggle(!collapsed)}
                aria-label="Toggle sidebar"
              >
                {collapsed ? <Bars className="w-5 h-5" /> : <Xmark className="w-5 h-5" />}
              </Button>
            </div>

            <motion.nav
              layout
              className="flex-1 flex flex-col gap-1"
              transition={{ layout: { staggerChildren: 0.1 } }}
            >
              {navItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <motion.div key={item.url} layout className="flex items-center">
                    <Button
                      isIconOnly={collapsed}
                      variant={isActive ? 'primary' : 'secondary'}
                      size="lg"
                      className={`flex-1 justify-start px-3 mr-2 transition-all duration-300 ${isActive ? 'rounded-[15px]' : 'opacity-80'}`}
                      onPress={() => navigate(item.url)}
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      <span
                        className="overflow-hidden whitespace-nowrap transition-all duration-300"
                        style={{
                          maxWidth: collapsed ? 0 : '8rem',
                          opacity: collapsed ? 0 : 1,
                        }}
                      >
                        {item.label ? t(`nav.${item.label.toLowerCase()}`) : ''}
                      </span>
                    </Button>
                    <AnimatePresence>
                      {isActive && (
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
              })}
            </motion.nav>

            <motion.div
              layout
              className="pt-4 border-t border-gray-200 dark:border-gray-800 w-full space-y-2"
            >
              <ThemeSwitcher collapsed={collapsed} />

              <Dropdown>
                <Button
                  aria-label="Language"
                  variant="secondary"
                  size="sm"
                  className={`${collapsed ? '' : 'justify-start'} w-full opacity-70`}
                  isIconOnly={collapsed}
                >
                  <Globe className="w-4 h-4 shrink-0" />
                  <span
                    className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                      collapsed ? 'w-0 opacity-0' : 'max-w-20 opacity-100 ml-1'
                    }`}
                  >
                    {t('common.language')}
                  </span>
                </Button>
                <Dropdown.Popover>
                  <Dropdown.Menu onAction={(key) => setLocale(key as 'en' | 'zh')}>
                    <Dropdown.Item id="en" textValue="English">
                      <Label>English</Label>
                    </Dropdown.Item>
                    <Dropdown.Item id="zh" textValue="中文">
                      <Label>中文</Label>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>

              <MenuList />
            </motion.div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
