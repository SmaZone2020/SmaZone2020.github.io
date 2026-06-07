import { Link } from "react-router-dom";
import { siteConfig } from "../config/site";
import { useI18n } from "../i18n";

function DefaultLayout({ children, className }: { children: React.ReactNode; className?: string }) {
    const { t } = useI18n();
    
    return(
        <div className={className}>
            <div className={`px-4 py-2 sm:hidden fixed h-[54px] top-0 left-0 right-0 z-50 flex items-center justify-between gap-4 bg-white/40 dark:bg-surface/50 backdrop-blur-sm shadow-lg`}>
                <div className="flex items-center">
                    <Link className="libre text-xl font-bold flex items-center" to="/">{siteConfig.handle}</Link>
                </div>
                <div className="flex items-center">
                    <Link to="/about" className="flex items-center text-primary">
                        {t(`nav.about`)}
                    </Link>
                </div>
            </div>
            <div className="sm:pb-0 sm:mt-0 mt-[58px] pb-[78px]">
                {children}

                <div className="mt-6 mb-4 max-w-[260px] sm:max-w-2xl mx-auto ">
                    <div className="bg-white/40 dark:bg-surface/50 backdrop-blur-sm rounded-[30px] shadow-md p-4 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            © {new Date().getFullYear()} {siteConfig.author}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {t('about.builtWith')}
                        </p>
                    </div>
                </div>
            </div>    
        </div>
    );
}
export default DefaultLayout;
