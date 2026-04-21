import { siteConfig } from '../../config/site';
import { useI18n } from '../../i18n';
import AdaptiveAvatar from '../../components/AdaptiveAvatar';
import FadeImg from '../../components/FadeImg';

function HeroSection() {
    const { t } = useI18n();

    return (
        <div className="relative mb-8 h-64 sm:h-80 w-full">
            <FadeImg
                shimmer={false}
                src={siteConfig.heroImage}
                alt="Hero"
                className="w-full h-full"
                imgClassName="w-full h-full object-cover"
                style={{borderRadius: 0}}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center gap-4 mb-3">
                    <AdaptiveAvatar
                        src={siteConfig.avatar}
                        alt={siteConfig.author}
                        size="xl"
                        className="shadow-xl rounded-[30px]"
                    />
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold libre">
                            {siteConfig.title}
                        </h1>
                        <p className="text-sm text-white/80">{siteConfig.handle}</p>
                    </div>
                </div>
                <p className="text-sm text-white/90 line-clamp-2">
                    {t('site.description')}
                </p>
            </div>
        </div>
    );
}

export default HeroSection;
