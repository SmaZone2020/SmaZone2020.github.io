import { siteData } from '../../lib/data';
import { useI18n } from '../../i18n';
import AdaptiveAvatar from '../../components/AdaptiveAvatar';
import FadeImg from '../../components/FadeImg';
import React from 'react';

function HeroSection() {
    const { t } = useI18n();

    return (
        <div className="relative mb-8 -left-2 h-64 sm:h-80 w-[110%]">
            <FadeImg
                shimmer={false}
                src={siteData.heroImage}
                alt="Hero"
                className="w-full h-full"
                imgClassName="w-full h-full object-cover"
                style={{borderRadius: 0}}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute pt-[30px] bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center gap-4 mb-3">
                    <AdaptiveAvatar
                        src={siteData.avatar}
                        alt={siteData.author}
                        size="xl"
                    />
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold libre">
                            {siteData.title}
                        </h1>
                        <p className="text-sm text-white/80">{siteData.handle}</p>
                    </div>
                </div>
                <p className="text-sm text-white/90 line-clamp-3">
                    {t('site.description').replace(/<br\/>/g, '\n').split('\n').map((line, index) => (
                        <React.Fragment key={index}>
                            {index > 0 && <br />}
                            {line}
                        </React.Fragment>
                    ))}
                </p>
            </div>
        </div>
    );
}

export default HeroSection;
