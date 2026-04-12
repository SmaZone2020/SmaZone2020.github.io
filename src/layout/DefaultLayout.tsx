import { Link } from "react-router-dom";
import { siteConfig } from "../config/site";
import { useI18n } from "../i18n";
import { Separator } from "@heroui/react";

function DefaultLayout({ children, className }: { children: React.ReactNode; className?: string }) {
    const { t } = useI18n();
    
    return(
        <div className={className}>
            <div className={`px-4 py-2 sm:hidden fixed h-[48px] top-0 left-0 right-0 z-50 flex items-center justify-between gap-4 bg-white/80 dark:bg-black/40 backdrop-blur-sm shadow-lg ${className}`}>
                <Link className="libre text-xl font-bold flex items-center" to="/">{siteConfig.handle}</Link>
                <Link to="/about" className="flex items-center text-primary">
                    {t(`nav.about`)}
                </Link>
            </div>
            <div className="sm:pb-0 mt-[58px] sm:mt-0 pb-[78px]">
                {children}

                <Separator className="my-6" />

                <div className="text-center text-sm text-gray-500 dark:text-gray-400 pb-4">
                    <p>© {new Date().getFullYear()} {siteConfig.author}</p>
                    <p className="mt-1">{t('about.builtWith')}</p>
                </div>
            </div>    
        </div>
    );
}
export default DefaultLayout;
